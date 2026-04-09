// import { Hono } from 'hono';

// type Bindings = {
// 	// @ts-ignore
// 	todo_db: D1Database;
// };

// type Todo = {
// 	id: number;
// 	title: string;
// 	completed: number;
// 	created_at: number;
// };

// const app = new Hono<{ Bindings: Bindings }>();

// // 获取所有待办事项
// app.get('/todos', async (c) => {
// 	const todos = await c.env.todo_db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
// 	return c.json(todos.results);
// });

// // 创建待办事项
// app.post('/todos', async (c) => {
// 	const { title } = await c.req.json();
// 	if (!title) {
// 		return c.json({ error: '标题不能为空' }, 400);
// 	}
// 	await c.env.todo_db.prepare('INSERT INTO todos (title) VALUES (?)').bind(title).run();
// 	return c.json({ success: true, message: '创建成功' }, 201);
// });

// // 更新待办事项（切换完成状态）
// app.put('/todos/:id', async (c) => {
// 	const id = parseInt(c.req.param('id'));
// 	await c.env.todo_db.prepare('UPDATE todos SET completed = NOT completed WHERE id = ?').bind(id).run();
// 	return c.json({ success: true, message: '更新成功' });
// });

// // 删除待办事项
// app.delete('/todos/:id', async (c) => {
// 	const id = parseInt(c.req.param('id'));

// 	await c.env.todo_db.prepare('DELETE FROM todos WHERE id = ?').bind(id).run();
// 	return c.json({ success: true, message: '删除成功' });
// });
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { TodoController } from './controllers/todo.controller';
import { Bindings } from './types/index';

const app = new Hono<{ Bindings: Bindings }>();

// 全局中间件
app.use('*', logger());
app.use('*', cors());

// 初始化控制器
let todoController: TodoController;

app.use('*', async (c, next) => {
	if (!todoController) {
		todoController = new TodoController(c.env.todo_db);
	}
	await next();
});

// 路由定义
app.get('/todos', (c) => todoController.getTodos(c));
app.post('/todos', (c) => todoController.createTodo(c));
app.put('/todos/:id', (c) => todoController.toggleTodo(c));
app.delete('/todos/:id', (c) => todoController.deleteTodo(c));

// 健康检查
app.get('/', (c) => c.json({ status: 'ok', message: 'Todo API is running' }));

export default app;
