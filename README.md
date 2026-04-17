# Vault API

一个基于 Cloudflare Workers 和 Hono 框架的 API 服务，提供待办事项管理和保险库账户管理功能。

## 技术栈

- **框架**: Hono
- **运行环境**: Cloudflare Workers
- **数据库**: D1 Database
- **ORM**: Drizzle ORM
- **开发工具**: Wrangler
- **语言**: TypeScript

## 项目结构

```
Vault-api/
├── script/                # SQL 脚本
│   ├── check-schema.sql     # 检查数据库结构
│   ├── create-todo.sql      # 创建待办事项表
│   └── create-vault-accounts.sql  # 创建保险库账户表
├── src/
│   ├── config/            # 配置文件
│   ├── controllers/       # 控制器
│   │   ├── todo.controller.ts      # 待办事项控制器
│   │   └── vault-accounts.controller.ts  # 保险库账户控制器
│   ├── db/                # 数据库相关
│   │   ├── database.ts    # 数据库连接
│   │   ├── schema.ts      # 待办事项数据模型
│   │   └── vault-accounts.ts  # 保险库账户数据模型
│   ├── routes/            # 路由
│   │   ├── todo.routes.ts      # 待办事项路由
│   │   └── vault-accounts.routes.ts  # 保险库账户路由
│   ├── services/          # 服务层
│   │   ├── todo.service.ts      # 待办事项服务
│   │   └── vault-accounts.service.ts  # 保险库账户服务
│   ├── types/             # 类型定义
│   └── index.ts           # 应用入口
├── .gitignore
├── README.md
├── drizzle.config.ts      # Drizzle ORM 配置
├── package.json
├── tsconfig.json          # TypeScript 配置
└── wrangler.jsonc         # Wrangler 配置
```

## 安装和设置

### 1. 克隆项目

```bash
git clone <repository-url>
cd Vault-api
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Cloudflare Workers

确保你已经安装了 Wrangler 并登录到 Cloudflare 账户：

```bash
npm install -g wrangler
wrangler login
```

## 数据库初始化

### 创建数据库

```bash
wrangler d1 create todo-db
wrangler d1 create vault
```

### 创建表结构

```bash
npx wrangler d1 execute todo-db --local --file "script/create-todo.sql"
npx wrangler d1 execute vault --local --file "script/create-vault-accounts.sql"
```

## 开发和部署

### wrangler 命令

> 使用本地数据库开发

```bash
npx wrangler dev --local
```

> 运行 SQL 语句

```bash
npx wrangler d1 execute 数据库名称 --local --command "SQL 语句"
```

> 运行 SQL 脚本

```bash
npx wrangler d1 execute 数据库名称 --local --file "SQL 脚本路径"
```

### 部署到 Cloudflare

```bash
npm run deploy
```

## API 端点

### 待办事项 API

| 方法   | 端点         | 描述                 |
| ------ | ------------ | -------------------- |
| GET    | `/todos`     | 获取所有待办事项     |
| POST   | `/todos`     | 创建新的待办事项     |
| PUT    | `/todos/:id` | 切换待办事项完成状态 |
| DELETE | `/todos/:id` | 删除待办事项         |

### 保险库账户 API

| 方法   | 端点                  | 描述               |
| ------ | --------------------- | ------------------ |
| GET    | `/vault-accounts`     | 获取所有保险库账户 |
| POST   | `/vault-accounts`     | 创建新的保险库账户 |
| PUT    | `/vault-accounts/:id` | 更新保险库账户     |
| DELETE | `/vault-accounts/:id` | 删除保险库账户     |

### 健康检查

| 方法 | 端点 | 描述         |
| ---- | ---- | ------------ |
| GET  | `/`  | 健康检查端点 |

## 请求和响应示例

### 创建待办事项

**请求**:

```json
POST /todos
Content-Type: application/json

{
  "title": "完成项目文档"
}
```

**响应**:

```json
{
	"success": true,
	"message": "创建成功"
}
```

### 获取待办事项

**响应**:

```json
[
	{
		"id": 1,
		"title": "完成项目文档",
		"completed": false,
		"created_at": "2024-01-01T00:00:00Z"
	}
]
```

## 环境变量

项目使用 Cloudflare Workers 的绑定功能，需要在 `wrangler.jsonc` 中配置以下绑定：

- `todo_db`: D1 数据库绑定，用于待办事项
- `vault_db`: D1 数据库绑定，用于保险库账户

## 注意事项

- 本项目使用 TypeScript 开发，确保代码符合 TypeScript 类型定义
- 所有 API 端点都支持 CORS 跨域请求
- 开发环境使用本地数据库，部署时使用 Cloudflare D1 数据库

## 许可证

MIT
