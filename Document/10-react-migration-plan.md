# React 重构启动计划（基于现有 Vue2 管理端）

目标：保持与 Spring Boot 后端完全对接，迁移到 React 技术栈，功能覆盖原有 PMS/OMS/SMS 全部模块，同时保持 UI 简洁。

## 1. 目标技术栈
- 构建：Vite + React 18 + TypeScript
- 路由：React Router v6（嵌套路由支持侧栏 + 面包屑）
- 状态：Zustand（全局轻量状态）+ React Query（服务端数据缓存与请求态管理）
- UI 组件：Ant Design（保守简单，覆盖表单/表格/布局），按需加载
- 表单：react-hook-form（大表单性能好）
- 图表：ECharts（与原 v-charts 对齐）
- 样式：SCSS + CSS Modules，保留全局变量文件
- 代码质量：ESLint + Prettier + Stylelint（可选）

## 2. 后端对接要点（来自 infos_from_backend.md）
- Base URL：`http://localhost:8888`
- 认证：OAuth2 + JWT，Header `Authorization: Bearer <token>`
- 关键接口：
  - 登录：`POST /sso/login` (username, password, verifyCode) -> token, tokenHead, refreshToken, memberId, nickName
  - 当前用户：`GET /sso/getCurrentMember`
  - 商品详情：`GET /pms/productInfo/{id}`
  - 秒杀商品列表：`GET /pms/flashPromotion/productList` (pageSize, pageNum, flashPromotionId, flashPromotionSessionId)
  - 首页秒杀：`GET /pms/flashPromotion/getHomeSecKillProductList`
  - 生成订单：`POST /order/generateOrder` (Header: memberId, Body: OrderParam)
  - 订单详情：`GET /order/specificOrderDetail` (orderId)
  - 用户订单列表：`POST /order/list/userOrder` (pageSize, pageNum, memberId, status)
  - 领券：`POST /coupon/add/{couponId}` (Headers: memberId, nickName)
  - 用户优惠券列表：`GET /coupon/list` (useStatus: 0/1/2)
- 关键枚举：促销类型(0-5)、订单状态(0-5)、支付方式(0-2)。

## 3. 路由与模块映射
- Layout：保留侧栏 + 顶栏 + 主内容三段式。React Router 嵌套路由对应 `Layout` 父路由。
- 模块分区：`/home`, `/pms`, `/oms`, `/sms`，与旧路由一致，便于迁移视图逻辑。
- 404/Login：同名路由保留，未来可加动态菜单（后端返回菜单时支持动态路由表）。

## 4. 数据契约与 Axios 封装
- 基础封装：`axios.create({ baseURL: import.meta.env.VITE_API_BASE, timeout: 15000 })`
- 请求拦截：注入 `Authorization`，从 Zustand 中读取 token。
- 响应处理：适配旧前端约定 `{ code, message, data }`，code!=200 统一 Message 提示；401/403 触发登出。
- 分页结构：期望 `{ list, total, pageNum, pageSize, totalPage }`；列表组件统一消费该结构。

## 5. 组件迁移策略
- 表格/筛选：AntD `Table` + `Form`，抽象通用分页列表组件，对接 React Query。
- 大表单（商品发布）：拆分为步骤表单；SKU 生成沿用旧逻辑（笛卡尔积），转为 TS 工具函数。
- 上传：封装 `Upload` 组件，预留两种实现：
  1) 直传云存储（待拿到签名接口）
  2) 通过后端代理上传
- 富文本：使用 `@tinymce/tinymce-react` 或 `react-quill`，优先 Tinymce 以便与旧内容兼容。
- 图表：用 `echarts-for-react` 包装，复刻首页统计与营销图表。

## 6. 样式与资源
- 迁移全局变量：把旧 `styles/variables.scss`、`mixin.scss` 中的色板与布局变量转为 SCSS 变量；在 `src/styles` 维护。
- 图标：导入旧 `icons/svg` 到 React，使用 `vite-plugin-svg-icons` 生成 sprite，提供 `<SvgIcon name="..." />` 组件。
- 静态资源：保留品牌 Logo、上传占位图，Tinymce 静态资源改为 npm 包引用。

## 7. 脚手架与目录建议
```
src/
  app/             # 入口与根布局
  routes/          # 路由配置与守卫
  api/             # axios 实例与 API 模块
  auth/            # token 存储、guard、user store
  modules/
    pms/
    oms/
    sms/
    home/
  components/      # 通用组件（Upload, RichText, Table, Form parts, SvgIcon）
  hooks/           # useAuth, usePaginationQuery 等
  stores/          # Zustand stores
  styles/          # 全局样式与变量
  utils/           # 工具（日期、校验、sku 生成）
```

## 8. 近期里程碑
1) 初始化 Vite + React + TS 脚手架，配置别名 `@` -> `src`
2) 接入 AntD、React Router v6、React Query、Zustand、SCSS
3) 实现 Axios 封装 + Auth 流程（登录页、token 存储、路由守卫、获取当前用户）
4) 迁移首页 Dashboard（保证基础接口拉通）
5) 迁移商品列表与商品详情（含 SKU 逻辑）
6) 迁移订单列表 + 详情
7) 迁移营销模块（秒杀/优惠券/推荐）
8) 上传与富文本集成

## 9. 仍需确认的事项
- 上传方案：后端是否提供上传接口或签名？存储位置（本地/OSS/MinIO）？
- 富文本：是否必须 Tinymce 兼容已有内容格式？
- 设计规范：是否沿用旧配色/字号/间距？如需保持极简，可用 AntD 默认主题 + 少量变量覆盖。
- 是否需要国际化（当前中文）。

准备好后，可直接脚手架初始化并开始迁移模块。