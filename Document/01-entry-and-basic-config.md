# 01. 入口与基础配置分析 (Entry & Basic Config)

本文档分析 `mall-admin-web` 项目的入口、基础配置、状态管理、网络请求及路由权限体系，为后续重构（Refactor）提供逻辑基础。

## 1. 入口与基础配置

### `src/main.js` (项目入口)
- **作用**: Vue 实例的初始化中心。
- **核心逻辑**:
  - **插件注册**: 引入并注册了 `ElementUI` (UI组件库), `VCharts` (图表库)。
  - **全局样式**: 引入 `normalize.css` 和自定义全局样式 `@/styles/index.scss`。
  - **路由与状态**: 挂载 `router` 和 `store` 到 Vue 根实例。
  - **权限控制**: 引入 `@/permission`，触发路由守卫逻辑（虽然是 import 引入，但会执行其中的代码）。
  - **图标**: 引入 `@/icons`，自动注册 SVG 图标组件。

### `index.html` (模板文件)
- **作用**: 单页应用 (SPA) 的宿主 HTML 文件。
- **关键点**:
  - `<div id="app"></div>`: Vue 实例挂载的 DOM 节点。
  - **外部脚本**: 引入了 `tinymce` (富文本编辑器) 的 CDN 资源。
  - **统计脚本**: 包含 Google Analytics 和 Baidu Analytics 的统计代码（重构时可考虑移除或替换）。

## 2. 状态管理与数据流 (Vuex)

### `src/store/index.js` (Store 入口)
- **作用**: 组装 Vuex Store。
- **模块**: 注册了 `app` (应用全局状态) 和 `user` (用户状态) 两个模块。

### `src/store/modules` (业务模块)
- **`user.js`**:
  - **State**: 存储 `token`, `name`, `avatar`, `roles`。
  - **Actions**:
    - `Login`: 调用登录接口，获取 Token 并存入 Cookie 和 State。
    - `GetInfo`: 获取用户信息（角色、头像等）。
    - `LogOut` / `FedLogOut`: 处理登出逻辑，清除 Token 和用户信息。
- **`app.js`**:
  - **State**: 管理侧边栏 (`sidebar`) 的展开/收起状态，以及设备类型 (`device`)。

### `src/store/getters.js` (计算属性)
- **作用**: 提供访问 State 的快捷方式，屏蔽模块内部结构。
- **映射**:
  - `sidebar`, `device` -> `state.app.*`
  - `token`, `avatar`, `name`, `roles` -> `state.user.*`

## 3. 网络请求与工具库

### `src/utils/request.js` (Axios 封装)
- **作用**: 统一 HTTP 请求处理。
- **配置**:
  - `baseURL`: 读取 `process.env.BASE_API` (在 `config/dev.env.js` 中配置)。
  - `timeout`: 设置为 15000ms。
- **拦截器**:
  - **Request**: 自动在 Header 中添加 `Authorization` (Token)。
  - **Response**:
    - 拦截非 200 状态码。
    - 处理业务错误码（如 401/403 未登录/无权限），触发登出弹窗。
    - 统一错误提示 (`Message` 组件)。

### `src/utils/auth.js` (Token 管理)
- **作用**: 基于 `js-cookie` 的 Token 存取工具。
- **方法**: `getToken()`, `setToken()`, `removeToken()`。
- **Key**: 默认 Key 为 `loginToken`。

### `src/api/` (接口层)
- **结构**: 按业务模块拆分文件（如 `product.js`, `order.js`, `login.js`）。
- **模式**: 导出函数，内部调用 `request.js` 发送请求。
- **示例**: `login.js` 包含 `login`, `getInfo`, `logout` 接口。

## 4. 路由与权限控制

### `src/router/index.js` (路由配置)
- **路由表**:
  - `constantRouterMap`: 基础路由（登录、404、首页），所有用户可见。
  - **动态路由**: 项目中目前主要使用静态路由配置，但在 `src/views/layout/components/Sidebar/index.vue` 中结合 `permission` 逻辑进行菜单渲染。
- **结构**: 典型的嵌套路由，使用 `Layout` 作为父组件，子页面作为 `children`。

### `src/permission.js` (权限守卫)
- **核心**: 全局 `router.beforeEach` 钩子。
- **逻辑流程**:
  1. **有 Token**:
     - 访问 `/login` -> 重定向到 `/`。
     - 访问其他页 -> 检查是否有用户信息 (`roles`)。
       - 无信息 -> 调用 `store.dispatch('GetInfo')` 拉取用户信息。
       - 有信息 -> 放行。
  2. **无 Token**:
     - 访问白名单 (`/login`) -> 放行。
     - 访问其他页 -> 重定向到 `/login`。

## 5. 其他辅助模块

### `config/` (环境配置)
- **`dev.env.js`**: 开发环境配置，定义 `BASE_API` (后端接口地址)。
- **`prod.env.js`**: 生产环境配置。

### `src/utils/`
- **`validate.js`**: 包含用户名、URL、小写字母等正则校验工具。
- **`index.js`**: 包含时间格式化 (`parseTime`)、URL 参数解析等通用工具函数。

### `package.json`
- **依赖**:
  - `vue`: ^2.5.2
  - `element-ui`: ^2.3.7
  - `axios`: ^0.18.0
- **脚本**:
  - `npm run dev`: 启动开发服务器 (`webpack-dev-server`)。
  - `npm run build`: 生产环境构建。
