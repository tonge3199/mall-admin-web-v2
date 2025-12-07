# Mall Admin Web 前端架构文档索引

本文档旨在为后端开发者提供 `mall-admin-web` 前端项目的完整架构解析，协助进行 Spring Boot 后端重构与对接。

## 文档列表

### [01. 入口与基础配置 (Entry & Basic Config)](./01-entry-and-basic-config.md)
- **核心内容**: 项目入口 (`main.js`), 状态管理 (`Vuex`), 网络请求封装 (`Axios`), 路由与权限控制 (`Router & Permission`).
- **阅读目标**: 理解前端是如何启动的，如何处理 Token，以及如何拦截请求。

### [02. 业务模块与数据流 (Business Modules)](./02-business-modules-and-components.md)
- **核心内容**:
  - **商品模块 (PMS)**: 复杂的商品发布流程、SKU 生成逻辑。
  - **订单模块 (OMS)**: 订单详情展示、状态流转与操作逻辑。
- **阅读目标**: 掌握核心业务的数据结构，明确后端需要提供的接口字段。

### [03. 营销模块与系统构建 (Marketing & System)](./03-marketing-and-system-modules.md)
- **核心内容**:
  - **营销模块 (SMS)**: 秒杀、优惠券、推荐管理。
  - **仪表盘 (Dashboard)**: 首页数据统计。
  - **构建部署**: Nginx 配置与生产环境打包。
- **阅读目标**: 了解营销活动的实现方式及项目上线部署流程。

### [04. 通用工具与重构路线图 (Utils & Roadmap)](./04-common-utils-and-api-mapping.md)
- **核心内容**:
  - **工具库**: 校验、日期处理、Cookie 操作。
  - **接口规范**: 统一响应结构与分页格式。
  - **重构路线**: 从基础建设到高级特性的分阶段重构建议。
- **阅读目标**: 获取具体的代码对接规范和重构步骤指引。

## 快速开始 (Quick Start for Backend Devs)

1.  **环境准备**: 确保本地安装 Node.js (v10+ 推荐) 和 npm。
2.  **安装依赖**:
    ```bash
    npm install
    ```
3.  **修改配置**:
    打开 `config/dev.env.js`，将 `BASE_API` 修改为你本地 Spring Boot 后端的地址（如 `http://localhost:8080`）。
4.  **启动项目**:
    ```bash
    npm run dev
    ```
5.  **对接调试**:
    - 优先实现 `/admin/login` 和 `/admin/info` 接口，打通登录流程。
    - 使用 Chrome 开发者工具 (F12) -> Network 面板查看前端发送的具体请求参数。

## 常见问题

- **Token 传递**: 前端会在 Header 中携带 `Authorization: Bearer <token>`，后端需解析此 Header。
- **跨域问题**: 开发环境由前端代理解决，生产环境需 Nginx 或后端配置 CORS。
- **日期格式**: 默认使用 `yyyy-MM-dd HH:mm:ss` 字符串交互。
