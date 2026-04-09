import { TodoDatabase } from '../db/database';
import type { Todo } from '../types/todo';
import type { Bindings } from '../types/index';

export class TodoService {
	private db: TodoDatabase;

	constructor(database: Bindings['todo_db']) {
		this.db = new TodoDatabase(database);
	}

	// 获取所有待办事项
	async getAllTodos(): Promise<Todo[]> {
		return await this.db.findAll();
	}

	// 创建待办事项
	async createTodo(title: string): Promise<void> {
		// 可以在这里添加业务逻辑，例如：
		// - 标题长度验证
		// - 去除首尾空格
		// - 检查是否重复等

		const trimmedTitle = title.trim();
		if (!trimmedTitle) {
			throw new Error('标题不能为空');
		}

		if (trimmedTitle.length > 100) {
			throw new Error('标题不能超过100个字符');
		}
		await this.db.create({ title: trimmedTitle });
	}

	// 切换待办事项状态
	async toggleTodoStatus(id: number): Promise<void> {
		// 检查待办事项是否存在
		const exists = await this.db.exists(id);
		if (!exists) {
			throw new Error('待办事项不存在');
		}

		await this.db.toggleComplete(id);
	}

	// 删除待办事项
	async deleteTodo(id: number): Promise<void> {
		// 检查待办事项是否存在
		const exists = await this.db.exists(id);
		if (!exists) {
			throw new Error('待办事项不存在');
		}

		await this.db.delete(id);
	}
}
