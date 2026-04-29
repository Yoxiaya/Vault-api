import { Hono } from 'hono';
import { TodoController } from '../controllers/todo.controller';
import { TodoService } from '../services/todo.service';
import { Bindings, Variables } from '../types';

export const todoRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

todoRoutes.use('*', async (c, next) => {
	const todoService = new TodoService(c.env.todo_db);
	c.set('todoController', new TodoController(todoService));
	await next();
});

todoRoutes.get('/', (c) => c.get('todoController')!.getAllTodos(c));
todoRoutes.post('/', (c) => c.get('todoController')!.createTodo(c));
todoRoutes.put('/:id', (c) => c.get('todoController')!.toggleComplete(c));
todoRoutes.delete('/:id', (c) => c.get('todoController')!.deleteTodo(c));
