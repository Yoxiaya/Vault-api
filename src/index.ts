import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { TodoController } from './controllers/todo.controller';
import { VaultAccountsController } from './controllers/vault-accounts.controller';
import { Bindings } from './types/index';

const app = new Hono<{ Bindings: Bindings }>();

// 全局中间件
app.use('*', logger());
app.use('*', cors());

// 初始化控制器
let todoController: TodoController;
let vaultAccountsController: VaultAccountsController;

app.use('*', async (c, next) => {
	if (!todoController) {
		todoController = new TodoController(c.env.todo_db);
	}

	if (!vaultAccountsController) {
		vaultAccountsController = new VaultAccountsController(c.env.vault_db);
	}
	await next();
});

// 路由定义
app.get('/todos', (c) => todoController.getTodos(c));
app.post('/todos', (c) => todoController.createTodo(c));
app.put('/todos/:id', (c) => todoController.toggleTodo(c));
app.delete('/todos/:id', (c) => todoController.deleteTodo(c));

app.get('/vault-accounts', (c) => vaultAccountsController.getAllAccounts(c));
app.post('/vault-accounts', (c) => vaultAccountsController.createAccount(c));

// 健康检查
app.get('/', (c) => c.json({ status: 'ok', message: 'Todo API is running' }));

export default app;
