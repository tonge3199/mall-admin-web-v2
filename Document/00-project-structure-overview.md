# Mall Admin Web 项目结构全解与重构指南

本文档提供了 `mall-admin-web` 项目目录结构的深度解析。作为一个基于 Vue 2.x + Element UI + Webpack 的传统后台管理系统，理解其目录结构对于重构（无论是升级前端技术栈还是对接新后端）至关重要。

## 1. 根目录结构 (Root Directory)

| 文件/目录 | 说明 | 重构关注点 |
| :--- | :--- | :--- |
| `package.json` | 项目依赖与脚本配置。 | **依赖升级**: 关注 `vue`, `element-ui`, `axios` 的版本。**脚本**: `dev` (开发), `build` (构建)。 |
| `index.html` | 单页应用的入口 HTML 模板。 | **全局依赖**: 检查是否有通过 `<script>` 标签引入的 CDN 资源（如 Tinymce），重构时建议改为 npm 包引入。 |
| `build/` | Webpack 构建脚本 (Vue CLI 2.x 风格)。 | **构建迁移**: 如果迁移到 Vue 3 + Vite，此目录将被 `vite.config.js` 取代。 |
| `config/` | 环境配置文件。 | **接口地址**: `dev.env.js` (开发) 和 `prod.env.js` (生产) 中的 `BASE_API` 是后端接口地址，重构后端时需修改此处。 |
| `static/` | 静态资源目录（不经过 Webpack 处理）。 | **Tinymce**: 富文本编辑器的静态资源通常放在这里，迁移时需注意路径引用。 |
| `src/` | **核心源码目录**。 | 所有的业务逻辑都在这里。 |

---

## 2. 源码目录详解 (`src/`)

这是重构工作的核心区域。

### 2.1 `src/api/` (接口层)
- **作用**: 封装所有的后端 API 请求。每个文件对应一个 Controller（如 `product.js` 对应后端商品模块）。
- **代码风格**: 导出函数，内部调用 `request.js`。
- **重构建议**:
  - 这是后端开发者最需要关注的目录。
  - **一一对应**: 确保新后端的 Controller 路径与此处的 URL 保持一致，或者修改此处 URL 适配新后端。
  - **参数检查**: 查看 `params` (Query参数) 和 `data` (Body参数) 的传递方式。

### 2.2 `src/utils/` (工具层)
- **核心文件**:
  - `request.js`: **Axios 封装**。包含请求拦截（加 Token）和响应拦截（错误处理）。重构时需确保后端返回的 JSON 结构（code/message/data）能被此拦截器正确解析。
  - `auth.js`: Token 存取（Cookie）。
  - `validate.js`: 正则校验。
- **重构建议**: 如果后端鉴权机制改变（如从 JWT 变 Session），需重写 `request.js` 和 `auth.js`。

### 2.3 `src/router/` (路由层)
- **核心文件**: `index.js`。
- **逻辑**: 定义了 URL 路径与 Vue 组件 (`views/`) 的映射关系。
- **重构建议**:
  - **权限路由**: 目前大部分路由是静态配置的。如果需要实现**动态菜单**（后端控制菜单权限），需大幅改造此处，结合 `permission.js` 使用 `router.addRoutes`。

### 2.4 `src/store/` (状态管理)
- **作用**: Vuex 全局状态管理。
- **模块**:
  - `modules/user.js`: 存储登录用户信息（Token, Roles, Avatar）。
  - `modules/app.js`: 存储侧边栏开关状态。
- **重构建议**: 登录逻辑的修改（如登录接口返回字段变化）会直接影响 `user.js` 中的 `Login` 和 `GetInfo` action。

### 2.5 `src/views/` (视图层 - 业务核心)
这是前端页面展示逻辑的聚集地，按业务模块划分：

| 目录 | 模块名称 | 关键功能 | 复杂度 |
| :--- | :--- | :--- | :--- |
| `layout/` | **布局骨架** | 包含侧边栏、顶部导航、主内容区。 | ⭐⭐ |
| `login/` | **登录页** | 处理登录表单提交。 | ⭐ |
| `home/` | **首页** | 仪表盘数据统计。 | ⭐⭐ |
| `pms/` | **商品模块** | 商品列表、**商品添加/编辑**（极复杂，涉及 4 步表单、SKU 生成）。 | ⭐⭐⭐⭐⭐ |
| `oms/` | **订单模块** | 订单列表、**订单详情**（状态流转逻辑）、退货申请。 | ⭐⭐⭐⭐ |
| `sms/` | **营销模块** | 秒杀、优惠券、品牌推荐。 | ⭐⭐⭐ |

- **重构建议**:
  - **PMS (商品)**: `views/pms/product/components/ProductDetail.vue` 是全项目最复杂的组件，包含大量表单逻辑和 SKU 笛卡尔积算法。重构后端商品模块时，务必对照此组件的数据结构。
  - **OMS (订单)**: `views/oms/order/orderDetail.vue` 包含订单操作（发货、关闭、备注），需确保后端状态机逻辑与前端按钮显示逻辑一致。

### 2.6 `src/components/` (通用组件)
- **作用**: 项目级可复用组件。
- **关键组件**:
  - `Upload/`: **文件上传**。目前逻辑可能绑定了阿里云 OSS 前端直传。**重构注意**: 如果改为后端代理上传或 MinIO，需修改此组件的 `action` 和上传逻辑。
  - `Tinymce/`: 富文本编辑器。

### 2.7 `src/icons/` & `src/styles/`
- **Icons**: SVG 图标自动加载机制。
- **Styles**: 全局 SCSS 变量和样式复位。

---

## 3. 重构与迁移策略 (Refactoring Strategy)

如果你打算重构这个项目，建议遵循以下路径：

### 场景 A: 仅重构后端 (Backend Refactoring)
1.  **接口契约**: 严格遵守 `src/api/` 下定义的 URL 和参数结构。
2.  **响应格式**: 确保后端返回 `{code: 200, message: "...", data: ...}` 格式，否则需修改 `src/utils/request.js`。
3.  **鉴权对接**: 确保登录接口返回的 Token 能被前端识别，且 `/admin/info` 接口返回的角色信息能通过 `permission.js` 的校验。

### 场景 B: 升级前端技术栈 (Frontend Upgrade -> Vue 3 + Vite)
1.  **构建工具**: 抛弃 `build/` 和 `config/`，使用 `vite.config.js`。
2.  **依赖升级**:
    - `vue` -> `vue` (v3)
    - `vuex` -> `pinia` (推荐)
    - `vue-router` -> `vue-router` (v4)
    - `element-ui` -> `element-plus`
3.  **代码迁移**:
    - **Options API -> Composition API**: 虽然 Vue 3 支持 Options API，但建议逐步迁移。
    - **全局 API 变化**: `Vue.use`, `new Vue` 等语法需调整。
    - **Element Plus 破坏性更新**: 许多组件属性名和插槽语法发生了变化，需要逐个文件修改（工作量巨大）。

### 场景 C: 保持现状，仅维护
- 确保 Node.js 版本兼容（建议 Node 10-14，过高版本可能导致 `node-sass` 编译失败）。
- 关注 `npm audit` 安全漏洞，适当升级次要版本依赖。

---

## 4. 总结

`mall-admin-web` 是一个典型的**中后台管理系统**，其核心价值在于**复杂的表单处理（商品发布）**和**数据展示（订单管理）**。

- **对于后端开发者**: 请死磕 `src/api` 和 `src/views/pms`，这是业务逻辑的深水区。
- **对于前端开发者**: 这是一个很好的 Vue 2 实践案例，但在 2025 年，它已经属于“遗留系统”，维护时需注意依赖包的过时问题。
