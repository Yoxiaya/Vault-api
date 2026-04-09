import type { Todo, CreateTodoInput } from '../types/todo';
import type { Bindings } from '../types/index';

export class TodoDatabase {
	constructor(private todo_db: Bindings['todo_db']) {}

	// 获取所有待办事项
	async findAll(): Promise<Todo[]> {
		const todos = await this.todo_db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
		return todos.results as Todo[];
	}

	// 创建待办事项
	async create(input: CreateTodoInput): Promise<void> {
		await this.todo_db.prepare('INSERT INTO todos (title) VALUES (?)').bind(input.title).run();
	}

	// 切换完成状态
	async toggleComplete(id: number): Promise<void> {
		await this.todo_db.prepare('UPDATE todos SET completed = NOT completed WHERE id = ?').bind(id).run();
	}

	// 删除待办事项
	async delete(id: number): Promise<void> {
		await this.todo_db.prepare('DELETE FROM todos WHERE id = ?').bind(id).run();
	}

	// 检查待办事项是否存在
	async exists(id: number): Promise<boolean> {
		const result = await this.todo_db.prepare('SELECT id FROM todos WHERE id = ?').bind(id).first();
		return !!result;
	}
}
