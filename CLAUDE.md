# Data Agent - 架构约定

## 项目概述

智能数据分析助手，基于 AI 的数据分析与对话系统。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **UI 组件库**: shadcn/ui (Nova 风格, Orange 主题)
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **字体**: Public Sans
- **状态管理**: Zustand
- **后端**: Next.js API Routes + Python FastAPI
- **数据库**: PostgreSQL (Prisma ORM)
- **向量存储**: ChromaDB
- **LLM**: OpenAI 兼容接口

## UI 组件规范

### shadcn/ui 配置

```json
{
  "style": "nova",
  "baseColor": "neutral",
  "theme": "orange",
  "iconLibrary": "lucide",
  "font": "public-sans",
  "rtl": true
}
```

### 组件使用原则

1. **优先使用 shadcn/ui 组件**
   - 所有基础 UI 元素使用 `@/components/ui/*`
   - 不要自行实现按钮、输入框、对话框等基础组件

2. **组件导入规范**
   ```typescript
   import { Button } from '@/components/ui/button'
   import { Input } from '@/components/ui/input'
   import { Card, CardHeader, CardContent } from '@/components/ui/card'
   ```

3. **添加新组件**
   ```bash
   pnpm dlx shadcn@latest add <component-name>
   ```

4. **颜色使用**
   - 主色调: `primary` (Orange)
   - 背景: `background`, `card`, `muted`
   - 文字: `foreground`, `muted-foreground`
   - 边框: `border`, `input`
   - 使用 CSS 变量而非硬编码颜色值

### 样式规范

```typescript
// 正确: 使用 Tailwind + CSS 变量
<Button className="bg-primary text-primary-foreground">

// 错误: 硬编码颜色
<Button className="bg-orange-500 text-white">
```

## 目录结构

```
src/
├── app/                    # Next.js App Router 路由
│   ├── api/                # API 路由
│   │   ├── chat/           # 对话相关 API
│   │   ├── data-sources/   # 数据源 API
│   │   └── files/          # 文件上传 API
│   ├── chat/               # 对话页面
│   ├── data-source/        # 数据源管理
│   └── settings/           # 设置页面
├── components/
│   ├── ui/                 # shadcn/ui 组件 (自动生成)
│   ├── layout/             # 布局组件
│   └── chat/               # 对话相关组件
├── lib/                    # 工具函数
│   ├── utils.ts            # 通用工具 (cn 函数等)
│   ├── prisma.ts           # Prisma 客户端
│   └── agent-client.ts     # Agent 服务客户端
├── stores/                 # Zustand 状态管理
└── styles/
    └── globals.css         # 全局样式 + CSS 变量
```

## API 设计规范

### 路由命名

- 使用 kebab-case: `/api/data-sources` 而非 `/api/dataSources`
- RESTful 风格: `GET /api/sessions`, `POST /api/sessions`, `DELETE /api/sessions/:id`

### 响应格式

```typescript
// 成功响应
{
  "success": true,
  "data": { ... }
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 流式响应

对话接口使用 Server-Sent Events (SSE):
```typescript
// /api/chat/stream
return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  },
})
```

## 数据库规范

### Prisma 模型命名

- 模型名: PascalCase (`DataSource`, `UploadedFile`)
- 表名: snake_case (`data_sources`, `uploaded_files`)
- 使用 `@@map()` 指定表名

### 常用字段

```prisma
model Example {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 状态管理

使用 Zustand 进行客户端状态管理:

```typescript
// stores/chat-store.ts
import { create } from 'zustand'

interface ChatState {
  messages: Message[]
  addMessage: (message: Message) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
}))
```

## 开发约定

### 文件命名

- 组件: PascalCase (`ChatMessage.tsx`)
- 工具函数: camelCase (`formatDate.ts`)
- 路由: 文件夹名即路由 (`app/chat/page.tsx` → `/chat`)

### TypeScript

- 启用严格模式
- 所有 Props 必须定义类型
- 避免使用 `any`

### 代码风格

- 使用 ESLint + Prettier
- 单引号
- 无分号
- 2 空格缩进

## MCP 工具

项目已配置 shadcn MCP 服务器，可以:
- 实时获取组件文档和源码
- 搜索可用组件
- 使用自然语言安装组件

## 环境变量

```env
# 必需
DATABASE_URL=          # PostgreSQL 连接字符串
LLM_API_KEY=           # LLM API 密钥
LLM_BASE_URL=          # LLM API 地址
LLM_MODEL=             # 模型名称

# 可选
AGENT_SERVICE_URL=     # Agent 服务地址
CHROMA_HOST=           # ChromaDB 主机
CHROMA_PORT=           # ChromaDB 端口
```

## Docker 部署

```bash
# 生产环境
docker compose up -d

# 开发环境 (热重载)
docker compose --profile dev up -d
```
