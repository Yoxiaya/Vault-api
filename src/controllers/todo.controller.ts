import { Context } from 'hono';
import { TodoService } from '../services/todo.service';

export class TodoController {
	constructor(private service: TodoService) {}

	async getAllTodos(c: Context) {
		try {
			const todos = await this.service.findAll();
			return c.json({ success: true, data: todos });
		} catch (error) {
			console.error('获取待办事项失败:', error);
			return c.json({ success: false, error: '服务器内部错误' }, 500);
		}
	}

	async createTodo(c: Context) {
		try {
			const { title } = await c.req.json();

			if (!title || title.trim() === '') {
				return c.json({ success: false, error: '标题不能为空' }, 400);
			}

			if (title.length > 100) {
				return c.json({ success: false, error: '标题不能超过100个字符' }, 400);
			}

			await this.service.create({ title });
			return c.json({ success: true, message: '创建成功' }, 201);
		} catch (error) {
			console.error('创建待办事项失败:', error);
			return c.json({ success: false, error: '服务器内部错误' }, 500);
		}
	}

	async toggleComplete(c: Context) {
		try {
			const id = parseInt(c.req.param('id') || '');

			if (isNaN(id)) {
				return c.json({ success: false, error: '无效的ID' }, 400);
			}

			const exists = await this.service.exists(id);
			if (!exists) {
				return c.json({ success: false, error: '待办事项不存在' }, 404);
			}

			await this.service.toggleComplete(id);
			return c.json({ success: true, message: '更新成功' });
		} catch (error) {
			console.error('更新待办事项失败:', error);
			return c.json({ success: false, error: '服务器内部错误' }, 500);
		}
	}

	async deleteTodo(c: Context) {
		try {
			const id = parseInt(c.req.param('id') || '');

			if (isNaN(id)) {
				return c.json({ success: false, error: '无效的ID' }, 400);
			}

			const exists = await this.service.exists(id);
			if (!exists) {
				return c.json({ success: false, error: '待办事项不存在' }, 404);
			}

			await this.service.delete(id);
			return c.json({ success: true, message: '删除成功' });
		} catch (error) {
			console.error('删除待办事项失败:', error);
			return c.json({ success: false, error: '服务器内部错误' }, 500);
		}
	}
}