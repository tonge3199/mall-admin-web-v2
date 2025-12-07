# 03. 营销模块与系统构建 (Marketing & System Build)

本文档分析 `mall-admin-web` 的营销模块 (SMS)、首页仪表盘 (Dashboard) 以及项目的构建与部署配置，完成对前端项目的全面解析。

## 1. 营销管理模块 (SMS - Sales Management System)

营销模块是电商系统中用于提升销量和用户活跃度的关键部分，主要包含秒杀、优惠券、品牌推荐等功能。

### 1.1 秒杀活动 (Flash Promotion)
- **入口**: `src/views/sms/flash/index.vue`
- **核心逻辑**:
  - **活动管理**: 列表展示秒杀活动（标题、状态、起止时间）。
  - **时间段管理**: 点击“秒杀时间段列表” (`handleShowSessionList`)，跳转到 `flashSession.vue`，管理每天的秒杀场次（如 10:00, 12:00）。
  - **商品关联**: 在秒杀活动中，可以关联具体的商品，设置秒杀价格和数量。
- **数据结构**:
  ```javascript
  // 秒杀活动对象
  {
    title: '春季大促',
    startDate: '2023-01-01',
    endDate: '2023-01-03',
    status: 1 // 1:上线, 0:下线
  }
  ```

### 1.2 优惠券管理 (Coupon)
- **入口**: `src/views/sms/coupon/index.vue`
- **领取记录**: `src/views/sms/coupon/history.vue`
- **核心逻辑**:
  - **类型**: 全场赠券、会员赠券、购物赠券、注册赠券。
  - **使用范围**: 全场通用、指定分类、指定商品。
  - **统计**: 在 `history.vue` 中展示了详细的统计数据（发行量、领取量、使用量），这部分数据通常需要后端聚合查询。

### 1.3 推荐管理 (Brand/New/Hot)
- **功能**: 管理首页展示的“品牌推荐”、“新品推荐”、“人气推荐”。
- **实现**: 实际上是维护关联表数据，将商品 ID 与推荐位进行绑定，并设置排序 (`sort`)。

## 2. 首页仪表盘 (Dashboard)

### `src/views/home/index.vue`
- **作用**: 管理员登录后的默认页面，展示核心业务指标。
- **数据展示**:
  - **统计卡片**: 今日订单、今日销售额、昨日销售额。
  - **待处理事务**: 待付款、待发货、退款申请等数量统计，点击可跳转到对应订单列表。
  - **图表**: 使用 `v-charts` (基于 ECharts 封装) 展示订单和销售额的趋势图。
- **数据流**:
  - 页面加载时调用 `home.js` 中的接口获取聚合数据。
  - **注意**: 这部分接口通常涉及复杂的 SQL 统计，后端需注意性能优化（如使用缓存或定时任务预计算）。

## 3. 构建与部署 (Build & Deploy)

### 3.1 配置文件
- **`package.json`**:
  - `scripts`:
    - `dev`: `webpack-dev-server`，开发环境热更新。
    - `build`: `node build/build.js`，生产环境打包。
  - `dependencies`: 核心依赖 `vue`, `element-ui`, `axios`, `vuex`, `vue-router`。
- **`config/prod.env.js`**:
  - 生产环境配置，通常只需修改 `BASE_API` 为线上后端地址。

### 3.2 Nginx 部署策略
前端打包后会生成 `dist` 目录（包含 `index.html` 和 `static` 文件夹）。

**推荐 Nginx 配置**:
```nginx
server {
    listen 80;
    server_name your.domain.com;

    # 1. 静态资源服务
    location / {
        root /usr/share/nginx/html/dist; # 指向打包后的 dist 目录
        index index.html;
        try_files $uri $uri/ /index.html; # 解决 Vue Router History 模式刷新 404 问题
    }

    # 2. 后端接口代理 (解决跨域)
    location /prod-api/ {
        proxy_pass http://backend-service:8080/; # 转发到后端服务
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 4. 总结与重构建议 (Refactoring Guide)

### 给后端开发者的建议
1. **接口规范**: 前端大量使用了 `PageHelper` 分页格式 (`pageNum`, `pageSize`, `total`, `list`)，后端重构时应保持该响应结构，避免前端大规模修改。
2. **枚举管理**: 前端代码中存在大量硬编码的状态值（如订单状态 0-5），建议后端提供一个 `/api/common/enums` 接口，前端初始化时获取字典，或在文档中严格对齐。
3. **权限体系**: 目前前端通过 `roles` 数组控制路由权限。如果后端引入 Spring Security 动态权限，需提供 `/api/user/menus` 接口，前端需改造 `permission.js` 以支持动态添加路由 (`router.addRoutes`)。
4. **日期处理**: 前端依赖 `yyyy-MM-dd HH:mm:ss` 格式字符串，后端序列化 JSON 时需注意日期格式配置。

---
**至此，`mall-admin-web` 的前端架构解析文档（共三部分）已完成。**
1. **基础架构**: 入口、配置、网络、路由。
2. **核心业务**: 商品、订单模块详解。
3. **营销与部署**: 营销模块、仪表盘及上线指南。
