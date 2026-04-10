import type { CreateTodoInput } from '../types/todo';
import { todos, type Todo } from './schema';
import { drizzle } from 'drizzle-orm/d1';
import type { Bindings } from '../types/index';
import { eq, sql } from 'drizzle-orm';

export class TodoDatabase {
	constructor(private todo_db: Bindings['todo_db']) {}

	// 获取所有待办事项
	async findAll(): Promise<Todo[]> {
		const drizzleDb = drizzle(this.todo_db);
		const result = await drizzleDb.select().from(todos).orderBy(todos.id);
		return result;
	}

	// 创建待办事项
	async create(input: CreateTodoInput): Promise<void> {
		const drizzleDb = drizzle(this.todo_db);

		await drizzleDb.insert(todos).values(input).run();
	}

	// 切换完成状态
	async toggleComplete(id: number): Promise<void> {
		const drizzleDb = drizzle(this.todo_db);
		await drizzleDb
			.update(todos)
			.set({ completed: sql`NOT completed` })
			.where(eq(todos.id, id))
			.run();
	}

	// 删除待办事项
	async delete(id: number): Promise<void> {
		const drizzleDb = drizzle(this.todo_db);
		await drizzleDb.delete(todos).where(eq(todos.id, id)).run();
	}

	// 检查待办事项是否存在
	async exists(id: number): Promise<boolean> {
		const drizzleDb = drizzle(this.todo_db);
		const result = await drizzleDb.select().from(todos).where(eq(todos.id, id)).run();
		return !!result;
	}
}
