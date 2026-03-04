# Data Agent

智能数据分析助手 - 基于 AI 的数据分析与对话系统

## 功能特性

- **智能对话**: 通过自然语言与数据进行交互
- **多数据源支持**: 支持本地文件上传 (CSV/Excel) 和数据库连接 (MySQL/PostgreSQL)
- **数据分析**: 自动生成数据概览、统计分析和可视化
- **记忆系统**: 持久化存储对话上下文和用户偏好
- **自定义 Agent**: 支持创建和配置专属分析助手

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **后端**: Next.js API Routes, Python FastAPI
- **数据库**: PostgreSQL (Prisma ORM)
- **向量存储**: ChromaDB
- **LLM**: 支持 OpenAI 兼容接口 (GPT/Gemini/DeepSeek 等)
- **部署**: Docker Compose

## 快速开始

### 环境要求

- Node.js 22+
- Docker & Docker Compose
- pnpm (推荐) 或 npm

### 安装步骤

1. 克隆项目

```bash
git clone https://github.com/Estrella9527/ali-data-agent.git
cd ali-data-agent
```

2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置 LLM API Key:

```env
LLM_API_KEY="your-api-key-here"
LLM_BASE_URL="https://api.openai.com/v1"
LLM_MODEL="gpt-3.5-turbo"
```

3. 启动服务

```bash
docker compose up -d
```

4. 访问应用

打开浏览器访问 http://localhost:3000

## 项目结构

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API 路由
│   │   ├── chat/            # 对话页面
│   │   ├── data-source/     # 数据源管理
│   │   └── settings/        # 设置页面
│   ├── components/          # React 组件
│   ├── lib/                 # 工具函数
│   └── stores/              # 状态管理
├── agent-service/           # Python Agent 服务
│   ├── app/
│   │   ├── api/             # FastAPI 路由
│   │   └── services/        # 业务逻辑
│   └── Dockerfile
├── prisma/
│   └── schema.prisma        # 数据库模型
└── docker-compose.yml       # Docker 编排
```

## 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| Next.js | 3000 | 前端应用 |
| Agent Service | 8000 | Python AI 服务 |
| PostgreSQL | 5433 | 数据库 |
| ChromaDB | 8001 | 向量数据库 |

## 开发模式

```bash
# 启动开发环境 (包含热重载)
docker compose --profile dev up -d

# 或本地开发
pnpm install
pnpm dev
```

## API 接口

### 对话 API

- `POST /api/chat` - 发送消息
- `POST /api/chat/stream` - 流式响应

### 数据源 API

- `GET /api/data-sources` - 获取数据源列表
- `POST /api/data-sources` - 创建数据源
- `DELETE /api/data-sources/:id` - 删除数据源

### 文件 API

- `POST /api/files` - 上传文件
- `GET /api/files/:id` - 获取文件信息

## 数据库模型

- **Session**: 对话会话
- **Message**: 消息记录
- **DataSource**: 数据源配置
- **DataTable**: 数据表元信息
- **Memory**: 记忆存储
- **CustomAgent**: 自定义 Agent
- **UploadedFile**: 上传文件

## 配置说明

### LLM 配置

支持任何 OpenAI 兼容接口:

```env
# OpenAI
LLM_BASE_URL="https://api.openai.com/v1"
LLM_MODEL="gpt-4"

# Google Gemini (通过中转)
LLM_BASE_URL="https://your-proxy.com/v1"
LLM_MODEL="gemini-pro"

# DeepSeek
LLM_BASE_URL="https://api.deepseek.com/v1"
LLM_MODEL="deepseek-chat"
```

## License

MIT
