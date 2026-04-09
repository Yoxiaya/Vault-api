import { Hono } from 'hono';

type Bindings = {
	// @ts-ignore
	todo_db: D1Database;
};

type Todo = {
	id: number;
	title: string;
	completed: number;
	created_at: number;
};

const app = new Hono<{ Bindings: Bindings }>();

// 获取所有待办事项
app.get('/todos', async (c) => {
	const todos = await c.env.todo_db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
	return c.json(todos.results);
});

// 创建待办事项
app.post('/todos', async (c) => {
	const { title } = await c.req.json();
	if (!title) {
		return c.json({ error: '标题不能为空' }, 400);
	}
	await c.env.todo_db.prepare('INSERT INTO todos (title) VALUES (?)').bind(title).run();
	return c.json({ success: true, message: '创建成功' }, 201);
});

// 更新待办事项（切换完成状态）
app.put('/todos/:id', async (c) => {
	const id = parseInt(c.req.param('id'));
	await c.env.todo_db.prepare('UPDATE todos SET completed = NOT completed WHERE id = ?').bind(id).run();
	return c.json({ success: true, message: '更新成功' });
});

// 删除待办事项
app.delete('/todos/:id', async (c) => {
	const id = parseInt(c.req.param('id'));

	await c.env.todo_db.prepare('DELETE FROM todos WHERE id = ?').bind(id).run();
	return c.json({ success: true, message: '删除成功' });
});

export default app;
