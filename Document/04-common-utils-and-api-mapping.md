# 04. 通用工具与重构路线图 (Common Utils & Refactoring Roadmap)

本文档分析 `mall-admin-web` 的通用工具库，并为后端开发者提供一份基于 Spring Boot 的重构与对接路线图。

## 1. 通用工具库 (Utils)

前端的 `src/utils` 目录包含了一些基础的工具函数，后端在设计接口或处理数据时需要注意这些既定的格式和规则。

### 1.1 表单校验 (`validate.js`)
- **作用**: 提供常用的正则校验函数。
- **关键函数**:
  - `validateURL`: 校验 URL 格式（用于商品图片、品牌 Logo 等字段）。
  - `validateLowerCase` / `validateUpperCase`: 校验字母大小写。
- **后端注意**: 虽然前端有校验，但后端 **必须** 在 Controller 层使用 `@Valid` 或手动校验，防止非法数据绕过前端直接提交。

### 1.2 日期处理 (`date.js`)
- **作用**: 提供日期格式化与解析功能。
- **关键函数**:
  - `formatDate(date, fmt)`: 将 Date 对象格式化为字符串（如 `yyyy-MM-dd hh:mm:ss`）。
  - `str2Date(dateStr, separator)`: 将字符串解析为 Date 对象。
- **后端注意**:
  - 前端通常期望后端返回的时间字段为 **字符串格式** (`yyyy-MM-dd HH:mm:ss`) 或 **时间戳**。
  - 如果后端返回 ISO 8601 格式（如 `2023-01-01T12:00:00Z`），前端可能需要调整 `formatDate` 的调用方式或引入 `dayjs` 等库进行处理。

### 1.3 Cookie 支持 (`support.js`)
- **作用**: 封装 `js-cookie`，用于存储一些简单的用户偏好设置（如是否显示帮助文档）。
- **后端注意**: 这部分数据通常只在前端使用，无需后端存储。

## 2. 前后端对接规范 (Interface Specification)

为了保证重构后的后端能无缝对接现有前端，建议遵循以下规范：

### 2.1 统一响应结构
前端 `request.js` 拦截器强依赖以下 JSON 结构：

```json
{
  "code": 200,      // 200 表示成功，其他表示失败
  "message": "操作成功", // 提示信息
  "data": { ... }   // 业务数据
}
```

- **401 Unauthorized**: 未登录或 Token 过期，前端会强制登出。
- **403 Forbidden**: 无权限，前端会提示错误。

### 2.2 分页数据结构
列表页（如商品列表、订单列表）期望的响应结构：

```json
{
  "code": 200,
  "data": {
    "list": [ ... ],  // 当前页数据列表
    "total": 100,     // 总记录数
    "pageNum": 1,     // 当前页码
    "pageSize": 10,   // 每页大小
    "totalPage": 10   // 总页数
  }
}
```
后端使用 `PageHelper` 或 Spring Data JPA 时，需封装成此结构返回。

## 3. 重构路线图 (Refactoring Roadmap)

如果你计划使用 Spring Boot 重构后端，建议按照以下顺序进行：

### 第一阶段：基础建设 (Infrastructure)
1.  **搭建 Spring Boot 项目**: 集成 MyBatis/JPA, Redis, Swagger。
2.  **实现统一响应封装**: 创建 `CommonResult` 类，包含 `code`, `message`, `data`。
3.  **实现安全模块**:
    - 集成 Spring Security + JWT。
    - 实现 `/admin/login` (登录) 和 `/admin/info` (获取用户信息) 接口。
    - **验证**: 确保前端能成功登录并进入 Dashboard。

### 第二阶段：核心业务 (Core Business)
1.  **商品模块 (PMS)**:
    - 优先实现 `/product/list` (列表) 和 `/product/updateStatus` (状态修改)。
    - 攻克 `/product/create` 和 `/product/update` (复杂的表单提交，涉及多表关联)。
2.  **订单模块 (OMS)**:
    - 实现 `/order/list` 和 `/order/detail/{id}`。
    - 实现订单操作接口（发货、关闭、备注）。

### 第三阶段：营销与统计 (Marketing & Dashboard)
1.  **首页统计**: 实现 `/home/content` 接口，聚合订单和销售数据。
2.  **营销活动**: 实现秒杀 (`/flash`) 和优惠券 (`/coupon`) 相关接口。

### 第四阶段：高级特性 (Advanced)
1.  **权限控制**: 实现基于 RBAC 的动态权限，后端返回用户可访问的菜单列表，前端动态生成路由。
2.  **OSS 集成**: 替换前端的上传接口，对接阿里云/MinIO 对象存储。

## 4. 常见问题 (FAQ)

-   **Q: 前端请求跨域怎么办？**
    -   A: 开发环境在 `config/dev.env.js` 配置 `BASE_API`，生产环境使用 Nginx 反向代理。后端也可配置 `@CrossOrigin`。
-   **Q: 为什么修改了代码前端没变化？**
    -   A: 确保运行了 `npm run dev`，且浏览器缓存已清除。
-   **Q: 登录后一直跳回登录页？**
    -   A: 检查 `/admin/info` 接口返回的 `roles` 数组是否为空。前端 `permission.js` 会拦截无角色的用户。

---
**文档结束**
这四份文档构成了完整的 `mall-admin-web` 前端架构解析，希望能助你的重构工作一臂之力！
