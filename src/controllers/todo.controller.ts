import { Context } from 'hono';
import { TodoService } from '../services/todo.service';
import { Bindings } from '../types/index';
export class TodoController {
	private service: TodoService;

	constructor(db: Bindings['todo_db']) {
		this.service = new TodoService(db);
	}

	// 获取所有待办事项
	async getTodos(c: Context) {
		try {
			const todos = await this.service.getAllTodos();
			return c.json(todos);
		} catch (error) {
			console.error('获取待办事项失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}

	// 创建待办事项
	async createTodo(c: Context) {
		try {
			const { title } = await c.req.json();

			await this.service.createTodo(title);
			return c.json({ success: true, message: '创建成功' }, 201);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === '标题不能为空') {
					return c.json({ error: error.message }, 400);
				}
				if (error.message === '标题不能超过100个字符') {
					return c.json({ error: error.message }, 400);
				}
			}
			console.error('创建待办事项失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}

	// 更新待办事项（切换完成状态）
	async toggleTodo(c: Context) {
		try {
			const id = parseInt(c.req.param('id') || '');

			if (isNaN(id)) {
				return c.json({ error: '无效的ID' }, 400);
			}

			await this.service.toggleTodoStatus(id);
			return c.json({ success: true, message: '更新成功' });
		} catch (error) {
			if (error instanceof Error && error.message === '待办事项不存在') {
				return c.json({ error: error.message }, 404);
			}
			console.error('更新待办事项失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}

	// 删除待办事项
	async deleteTodo(c: Context) {
		try {
			const id = parseInt(c.req.param('id') || '');

			if (isNaN(id)) {
				return c.json({ error: '无效的ID' }, 400);
			}

			await this.service.deleteTodo(id);
			return c.json({ success: true, message: '删除成功' });
		} catch (error) {
			if (error instanceof Error && error.message === '待办事项不存在') {
				return c.json({ error: error.message }, 404);
			}
			console.error('删除待办事项失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}
}
