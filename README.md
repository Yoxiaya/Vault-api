# Vault API

一个基于 Cloudflare Workers 和 Hono 框架的 API 服务，提供用户认证、个人资料管理和保险库账户管理功能。

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
├── script/                    # SQL 脚本（数据库诊断等）
│   ├── add-vault-accounts-field.sql
│   ├── check-schema.sql
│   ├── create-email-verifications.sql
│   ├── create-user.sql
│   ├── create-vault-accounts.sql
│   └── syncDbData.sh
├── src/
│   ├── config/                # 非敏感配置
│   │   └── index.ts
│   ├── controllers/           # 控制器层（HTTP 请求/响应处理）
│   │   ├── auth.controller.ts
│   │   ├── email-code.controller.ts
│   │   ├── profile.controller.ts
│   │   └── vault-accounts.controller.ts
│   ├── db/schema/             # Drizzle ORM 数据模型
│   │   ├── accounts.ts
│   │   ├── email-verifications.ts
│   │   ├── index.ts
│   │   ├── profile.ts
│   │   ├── sessions.ts
│   │   └── users.ts
│   ├── middlewares/           # 中间件（认证、错误处理）
│   │   ├── auth.middleware.ts
│   │   ├── error-handler.ts
│   │   └── index.ts
│   ├── repositories/          # 数据访问层
│   │   ├── auth.repositories.ts
│   │   ├── profile.repositories.ts
│   │   └── vault-accounts.repository.ts
│   ├── routes/                # 路由定义
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   └── vault-accounts.routes.ts
│   ├── services/              # 业务逻辑层
│   │   ├── auth.service.ts
│   │   ├── email-code.service.ts
│   │   ├── profile.service.ts
│   │   └── vault-accounts.service.ts
│   ├── types/                 # TypeScript 类型定义
│   │   ├── auth.type.ts
│   │   └── index.ts
│   ├── utils/                 # 工具函数
│   │   ├── app-error.ts
│   │   ├── image.utils.ts
│   │   └── index.ts
│   └── index.ts               # 应用入口
├── .dev.vars                  # 本地开发环境变量（不提交）
├── .gitignore
├── .prettierrc
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── wrangler.jsonc
```

## 架构说明

项目采用分层架构设计，职责清晰：

- **controllers**: 处理 HTTP 请求和响应，参数校验
- **services**: 业务逻辑处理
- **repositories**: 数据库访问操作
- **middlewares**: 中间件（认证、统一错误处理）
- **utils**: 通用工具函数（图片上传、自定义错误类）

错误处理采用全局统一处理模式：业务层抛出 `AppError`，由全局 `errorHandler` 中间件捕获并按状态码返回。

## 环境变量

项目使用 Cloudflare Workers 环境变量管理敏感配置。本地开发时在 `.dev.vars` 中配置：

```bash
IMAGE_API_TOKEN=your_image_api_token
EMAIL_API_TOKEN=your_resend_api_token
```

生产环境使用 `wrangler secret put` 设置：

```bash
wrangler secret put IMAGE_API_TOKEN
wrangler secret put EMAIL_API_TOKEN
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

### 3. 配置环境变量

复制 `.dev.vars.example` 或直接创建 `.dev.vars` 文件，填入必要的 API 密钥。

### 4. 配置 Cloudflare Workers

```bash
wrangler login
```

## 数据库初始化

### 创建数据库

```bash
wrangler d1 create vault
```

### 创建表结构

```bash
npx wrangler d1 execute vault --local --file "script/create-user.sql"
npx wrangler d1 execute vault --local --file "script/create-vault-accounts.sql"
npx wrangler d1 execute vault --local --file "script/create-email-verifications.sql"
```

## 开发和部署

### 本地开发

```bash
npm run dev
```

### 部署到 Cloudflare

```bash
npm run deploy
```

### 同步线上数据库到本地

```bash
npm run sync
```

### 查看数据库表结构

```bash
npx wrangler d1 execute vault_db --local --file "script/check-schema.sql"
```

## API 端点

### 认证 API

| 方法 | 端点              | 描述           |
| ---- | ----------------- | -------------- |
| POST | `/auth/register`  | 用户注册       |
| POST | `/auth/login`     | 用户登录       |
| POST | `/auth/send-code` | 发送邮箱验证码 |

### 用户资料 API（需要认证）

| 方法 | 端点                  | 描述             |
| ---- | --------------------- | ---------------- |
| GET  | `/user/profile`       | 获取当前用户资料 |
| POST | `/user/updateProfile` | 更新用户资料     |
| POST | `/user/updateAvatar`  | 上传用户头像     |

### 保险库账户 API（需要认证）

| 方法   | 端点                           | 描述               |
| ------ | ------------------------------ | ------------------ |
| GET    | `/vault-accounts`              | 获取所有保险库账户 |
| POST   | `/vault-accounts`              | 创建新的保险库账户 |
| GET    | `/vault-accounts/:id`          | 获取单个保险库账户 |
| PUT    | `/vault-accounts/:id`          | 更新保险库账户     |
| DELETE | `/vault-accounts/:id`          | 删除保险库账户     |
| POST   | `/vault-accounts/upload-image` | 上传图片           |
| POST   | `/vault-accounts/delete-image` | 删除图片           |

### 健康检查

| 方法 | 端点 | 描述         |
| ---- | ---- | ------------ |
| GET  | `/`  | 健康检查端点 |

## 统一响应格式

成功响应：

```json
{
  "success": true,
  "data": ...,
  "message": "操作成功"
}
```

失败响应：

```json
{
  "success": false,
  "error": "错误信息"
}
```

## 许可证

MIT
