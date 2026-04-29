import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { todoRoutes } from './routes/todo.routes';
import { vaultAccountsRoutes } from './routes/vault-accounts.routes';
import { Bindings, Variables } from './types/index';
import { errorHandler } from './middlewares';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', logger());
app.use('*', cors());
app.use('*', errorHandler());

app.route('/todos', todoRoutes);
app.route('/vault-accounts', vaultAccountsRoutes);

app.get('/', (c) => c.json({ status: 'ok', message: 'Vault API is running' }));

export default app;
