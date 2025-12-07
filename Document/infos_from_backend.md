# 前端开发指南

基于Spring Boot后端项目的React前端开发所需信息

## 后端API契约

### 基础URL和认证方案

1. **基础URL**: 系统通过网关服务运行在端口8888上，所有API请求应通过网关：
   ```
   Base URL: http://localhost:8888
   ```

2. **认证机制**: 使用OAuth2 + JWT认证
   - 用户登录后会获得一个JWT Token
   - 请求受保护资源时需要在Header中添加：
     ```
     Authorization: Bearer <token>
     ```

### 核心端点

#### 1. 登录与用户信息
- **用户登录**: `POST /sso/login`
  - 参数: username, password, verifyCode
  - 返回: token, tokenHead, refreshToken, memberId, nickName
  
- **获取当前用户**: `GET /sso/getCurrentMember`
  - 返回: 当前登录用户详细信息

#### 2. 商品相关
- **获取商品详情**: `GET /pms/productInfo/{id}`
  - 返回: 商品详细信息
  
- **获取秒杀商品列表**: `GET /pms/flashPromotion/productList`
  - 参数: pageSize, pageNum, flashPromotionId, flashPromotionSessionId
  
- **获取首页秒杀商品**: `GET /pms/flashPromotion/getHomeSecKillProductList`

#### 3. 订单相关
- **生成订单**: `POST /order/generateOrder`
  - Header: memberId
  - Body: OrderParam对象
  - 返回: 生成的订单信息
  
- **获取订单详情**: `GET /order/specificOrderDetail`
  - 参数: orderId
  
- **用户订单查询**: `POST /order/list/userOrder`
  - 参数: pageSize, pageNum, memberId, status
  - status值: 0-待付款, 1-待发货, 2-已发货, 3-已完成, 4-已关闭

#### 4. 营销相关
- **用户领取优惠券**: `POST /coupon/add/{couponId}`
  - Header: memberId, nickName
  
- **获取用户优惠券列表**: `GET /coupon/list`
  - 参数: useStatus (0-未使用, 1-已使用, 2-已过期)

### 关键枚举值

1. **商品促销类型**:
   - 0 - 没有促销使用原价
   - 1 - 使用促销价
   - 2 - 使用会员价
   - 3 - 使用阶梯价格
   - 4 - 使用满减价格
   - 5 - 限时购

2. **订单状态**:
   - 0 - 待付款
   - 1 - 待发货
   - 2 - 已发货
   - 3 - 已完成
   - 4 - 已关闭
   - 5 - 无效订单

3. **支付方式**:
   - 0 - 未支付
   - 1 - 支付宝
   - 2 - 微信

## 文件上传集成

从代码分析来看，系统可能使用本地存储或OSS存储方案，但具体实现细节需要进一步确认。建议采用以下方案之一：

1. 通过后端API提供文件上传接口
2. 集成阿里云OSS或其他云存储服务

## 静态资源

根据项目结构，静态资源包括：
1. 品牌Logo和图标
2. TinyMCE编辑器相关资源
3. SVG图标集
4. 在doc/htmljss目录中有现成的CSS和HTML模板可供参考

这套技术栈可以确保高性能、良好的开发体验和维护性，同时与Spring Boot后端很好地配合。