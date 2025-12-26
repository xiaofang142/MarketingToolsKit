# 一站式智能营销解决方案

## 简介（Description）
🚀 **高效触达，智能转化**

SmartPromo-Toolkit 是一套集成的营销自动化工具，专为多平台推广设计。通过整合短信、邮件、社交媒体卡片及聊天机器人，实现精准用户触达与自动化互动，显著提升营销效率与转化率。

## 核心功能（Features）

### 全渠道营销覆盖
- **短信营销**：批量发送个性化内容，支持模板化操作
- **邮件营销**：自动化邮件序列，优化用户生命周期管理
- **社交媒体卡片**：一键生成抖音、快手、小红书、闲鱼等平台的推广卡片，适配移动端分享
- **智能自动回复**：基于用户行为触发实时响应，减少人工干预

### 跨平台聊天机器人
- **Telegram 机器人**：支持关键词回复、任务调度及用户数据分析
- **WhatsApp 机器人**：集成消息模板，实现快速客服与促销通知

### 自动化工作流
- 自定义营销漏斗，从用户触达、互动到转化全程自动化
- 支持数据追踪与效果分析，优化营销策略

## 技术亮点（Technical Highlights）
- 模块化设计，轻松扩展新渠道
- 轻量级 API 接口，支持快速集成
- 私有部署选项，保障数据安全

## 适用场景（Use Cases）
- 电商促销活动自动化
- 社交媒体内容分发与互动管理
- 跨境营销（支持多语言与本地化平台）

## 技术栈（Tech Stack）
- **前端框架**：Vue 3
- **构建工具**：Vite
- **UI 组件库**：Element Plus
- **HTTP 客户端**：Axios
- **图标库**：@element-plus/icons-vue
- **富文本编辑器**：TinyMCE
- **图表库**：ECharts

## 快速开始（Quick Start）

### 环境要求
- Node.js 14.x 或更高版本
- npm、yarn 或 pnpm 包管理器

### 安装依赖
```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm
pnpm install
```

### 开发环境启动
```bash
# 使用 npm
npm run dev

# 使用 yarn
yarn dev

# 使用 pnpm
pnpm dev
```

开发服务器启动后，访问 `http://localhost:5173` 即可查看应用。

### 生产环境构建
```bash
# 使用 npm
npm run build

# 使用 yarn
yarn build

# 使用 pnpm
pnpm build
```

构建产物将生成在 `dist` 目录中。

### 预览生产构建
```bash
# 使用 npm
npm run preview

# 使用 yarn
yarn preview

# 使用 pnpm
pnpm preview
```

## 部署说明（Deployment）

### 环境配置
1. 复制环境变量示例文件：
   ```bash
   cp .env.development.example .env.development
   cp .env.production.example .env.production
   ```

2. 根据实际情况修改环境变量配置：
   - `VITE_API_BASE_URL`：API 基础地址
   - `VITE_APP_TITLE`：应用标题
   - 其他配置项根据项目需求修改

### 部署方式

#### 静态文件部署
将 `dist` 目录中的所有文件部署到任意静态文件服务器即可，如：
- Nginx
- Apache
- GitHub Pages
- Vercel
- Netlify

#### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 项目结构（Project Structure）
```
├── dist/              # 构建产物目录
├── node_modules/      # 依赖包目录
├── src/               # 源代码目录
│   ├── assets/        # 静态资源
│   ├── components/    # Vue 组件
│   ├── config/        # 配置文件
│   ├── views/         # 页面视图
│   ├── main.js        # 应用入口
│   └── App.vue        # 根组件
├── .env.development   # 开发环境变量
├── .env.production    # 生产环境变量
├── .gitignore         # Git 忽略文件
├── index.html         # HTML 入口
├── package.json       # 项目配置
└── vite.config.js     # Vite 配置
```

## 许可证（License）
MIT License

## 贡献（Contributing）
欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 联系方式（Contact）
如有问题或建议，请通过以下方式联系我们：
- 微信：xiao142000
- QQ：1036698712
- 邮箱：myloveisphp@126.com
- GitHub：https://github.com/xiaofang142/MarketingToolsKit