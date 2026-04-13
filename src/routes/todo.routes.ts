import { Hono } from 'hono';
import { TodoController } from '../controllers/todo.controller';

let todoController: TodoController;

export const todoRoutes = new Hono();

todoRoutes.use('*', async (c, next) => {
	if (!todoController) {
		// @ts-ignore
		const db = c.env.todo_db;
		todoController = new TodoController(db);
	}
	await next();
});

todoRoutes.get('/', (c) => todoController.getTodos(c));
todoRoutes.post('/', (c) => todoController.createTodo(c));
todoRoutes.put('/:id', (c) => todoController.toggleTodo(c));
todoRoutes.delete('/:id', (c) => todoController.deleteTodo(c));
