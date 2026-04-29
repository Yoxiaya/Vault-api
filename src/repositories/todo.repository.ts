import type { CreateTodoInput } from '../types/todo';
import { todos, type Todo } from '../db/schema';
import { drizzle } from 'drizzle-orm/d1';
import type { Bindings } from '../types/index';
import { eq, sql } from 'drizzle-orm';

export class TodoRepository {
	constructor(private todo_db: Bindings['todo_db']) {}

	async findAll(): Promise<Todo[]> {
		const drizzleDb = drizzle(this.todo_db);
		const result = await drizzleDb.select().from(todos).orderBy(todos.id);
		return result;
	}

	async create(input: CreateTodoInput): Promise<void> {
		const drizzleDb = drizzle(this.todo_db);
		await drizzleDb.insert(todos).values(input).run();
	}

	async toggleComplete(id: number): Promise<void> {
		const drizzleDb = drizzle(this.todo_db);
		await drizzleDb
			.update(todos)
			.set({ completed: sql`NOT completed` })
			.where(eq(todos.id, id))
			.run();
	}

	async delete(id: number): Promise<void> {
		const drizzleDb = drizzle(this.todo_db);
		await drizzleDb.delete(todos).where(eq(todos.id, id)).run();
	}

	async exists(id: number): Promise<boolean> {
		const drizzleDb = drizzle(this.todo_db);
		const result = await drizzleDb.select().from(todos).where(eq(todos.id, id)).run();
		return !!result;
	}
}
