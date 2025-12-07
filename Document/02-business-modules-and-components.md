# 02. 业务模块与数据流分析 (Business Modules & Data Flow)

本文档深入分析 `mall-admin-web` 的核心业务模块（商品与订单）的实现逻辑、数据结构及前后端交互方式，帮助后端开发者理解前端如何组织和处理业务数据。

## 1. 布局与全局交互 (Layout & Interaction)

### `src/views/layout/Layout.vue`
- **结构**: 经典的后台管理布局。
  - **Sidebar**: 左侧菜单栏，依赖 `vuex` 中的 `sidebar` 状态控制展开/收起。
  - **Navbar**: 顶部导航栏，包含面包屑 (`Breadcrumb`)、汉堡按钮 (`Hamburger`) 和用户头像下拉菜单。
  - **AppMain**: 内容区域，使用 `<router-view>` 渲染具体的业务页面。
- **数据流**:
  - 用户点击 Sidebar 菜单 -> 触发路由跳转 -> `AppMain` 更新组件。

### `src/views/layout/components/Sidebar/index.vue`
- **路由渲染**: 通过 `this.$router.options.routes` 获取所有路由配置，并传递给 `SidebarItem` 组件进行递归渲染。
- **权限控制**: 结合 `permission.js`，只有用户有权限访问的路由才会被渲染在菜单中。

## 2. 商品管理模块 (PMS - Product Management System)

### 核心文件
- **列表页**: `src/views/pms/product/index.vue`
- **添加/编辑页**: `src/views/pms/product/add.vue`, `update.vue`
- **核心组件**: `src/views/pms/product/components/ProductDetail.vue`

### 数据结构 (Product Data Model)
前端维护了一个庞大的 `productParam` 对象，用于提交给后端 `/product/create` 或 `/product/update/{id}` 接口。

```javascript
const defaultProductParam = {
  name: '',                   // 商品名称
  subTitle: '',               // 副标题
  brandId: null,              // 品牌ID
  productCategoryId: null,    // 分类ID
  productSn: '',              // 货号
  price: 0,                   // 价格
  originalPrice: 0,           // 市场价
  stock: 0,                   // 库存
  sort: 0,                    // 排序
  sale: 0,                    // 销量
  pic: '',                    // 主图
  albumPics: '',              // 画册图片（逗号分隔）
  description: '',            // 商品描述
  detailDesc: '',             // 详情描述
  detailHtml: '',             // 详情页HTML (富文本)
  detailMobileHtml: '',       // 移动端详情HTML
  // ... 促销信息
  promotionPrice: null,       // 促销价格
  promotionStartTime: '',     // 促销开始时间
  promotionEndTime: '',       // 促销结束时间
  promotionType: 0,           // 促销类型：0->没有促销；1->使用促销价；2->使用会员价；3->使用阶梯价格；4->使用满减价格；5->限时购
  // ... 关联数据
  memberPriceList: [],        // 会员价格列表
  productLadderList: [],      // 阶梯价格列表
  productFullReductionList: [], // 满减价格列表
  skuStockList: [],           // SKU库存列表
  productAttributeValueList: [], // 商品属性参数列表
  subjectProductRelationList: [], // 关联专题
  prefrenceAreaProductRelationList: [] // 关联优选
};
```

### 业务逻辑流程
1. **分步表单**: `ProductDetail.vue` 使用 `el-steps` 将复杂的商品录入分为 4 步：
   - **Step 1**: 基本信息 (ProductInfoDetail) - 校验名称、分类、品牌。
   - **Step 2**: 促销信息 (ProductSaleDetail) - 根据 `promotionType` 动态显示不同的价格设置表单。
   - **Step 3**: 属性信息 (ProductAttrDetail) - 动态加载分类下的属性，生成 SKU 表格。
   - **Step 4**: 关联信息 (ProductRelationDetail) - 选择关联的专题和优选。
2. **数据回显**: 在 `update.vue` 中，调用 `getProduct(id)` 接口，将返回的数据填充到 `productParam`，供用户修改。
3. **SKU 生成**: 在 Step 3 中，前端会根据用户选择的销售属性（如颜色、尺寸），计算笛卡尔积，动态生成 SKU 表格供用户输入价格和库存。

## 3. 订单管理模块 (OMS - Order Management System)

### 核心文件
- **列表页**: `src/views/oms/order/index.vue`
- **详情页**: `src/views/oms/order/orderDetail.vue`

### 订单详情数据结构
`orderDetail.vue` 展示了非常详细的订单信息，数据来源于 `/order/{id}` 接口。

```javascript
// 核心字段展示
order: {
  orderSn: '',             // 订单编号
  status: 0,               // 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单
  createTime: '',          // 提交时间
  payType: 0,              // 支付方式：0->未支付；1->支付宝；2->微信
  sourceType: 0,           // 订单来源：0->PC订单；1->app订单
  receiverName: '',        // 收货人
  receiverPhone: '',       // 手机号
  receiverProvince: '',    // 省
  receiverCity: '',        // 市
  receiverRegion: '',      // 区
  receiverDetailAddress: '', // 详细地址
  orderItemList: []        // 订单商品列表
  // ... 费用信息
  totalAmount: 0,          // 订单总金额
  payAmount: 0,            // 应付金额
  freightAmount: 0,        // 运费金额
  promotionAmount: 0,      // 促销优化金额
}
```

### 状态操作逻辑
前端根据 `order.status` 动态显示可操作的按钮：
- **待付款 (0)**: 修改收货人、修改费用、关闭订单。
- **待发货 (1)**: 取消订单、发货（跳转到发货页面）。
- **已发货 (2)**: 订单跟踪（查看物流）。
- **已关闭 (4)**: 删除订单。

### 关键交互
- **关闭订单**: 弹出 `CloseOrderDialog`，填写备注后调用 `closeOrder` 接口。
- **订单备注**: 调用 `updateOrderNote` 接口。
- **修改收货人**: 调用 `updateReceiverInfo` 接口。

## 4. 常用组件与工具

### `src/components/`
- **Upload/MultiUpload**: 封装了阿里云 OSS 的上传逻辑，支持单图/多图上传，上传成功后返回 URL 给父组件。
- **Tinymce**: 富文本编辑器，用于编辑商品详情 (`detailHtml`)。
- **ScrollBar**: 自定义滚动条组件，用于 Sidebar。

### 过滤器 (Filters)
在 `main.js` 或组件内部定义了大量过滤器，用于将后端的状态码转换为可读文本：
- `formatStatus`: 0->待付款, 1->待发货...
- `formatPayType`: 1->支付宝, 2->微信...
- `formatTime`: 时间戳转 `yyyy-MM-dd HH:mm:ss`。

## 5. 后端开发建议
- **接口对齐**: 重点关注 `src/api/product.js` 和 `src/api/order.js` 中的接口定义，确保后端 Controller 的路径和参数与前端一致。
- **数据校验**: 前端虽然有表单校验 (`el-form` rules)，但后端必须进行二次校验，尤其是价格、库存等敏感字段。
- **枚举统一**: 前端硬编码了许多状态码（如 `promotionType: 0-5`），建议后端维护对应的枚举类，并确保文档与前端一致。
