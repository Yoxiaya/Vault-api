import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { todoRoutes } from './routes/todo.routes';
import { vaultAccountsRoutes } from './routes/vault-accounts.routes';
import { Bindings } from './types/index';

const app = new Hono<{ Bindings: Bindings }>();

// 全局中间件
app.use('*', logger());
app.use('*', cors());

// 路由定义
app.route('/todos', todoRoutes);
app.route('/vault-accounts', vaultAccountsRoutes);

// 健康检查
app.get('/', (c) => c.json({ status: 'ok', message: 'Todo API is running' }));

export default app;
