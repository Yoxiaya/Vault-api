import { TodoRepository } from '../repositories/todo.repository';
import { Todo } from '../db/schema';
import type { CreateTodoInput } from '../types/todo';
import type { Bindings } from '../types';

export class TodoService {
	private repository: TodoRepository;

	constructor(database: Bindings['todo_db']) {
		this.repository = new TodoRepository(database);
	}

	async findAll(): Promise<Todo[]> {
		return this.repository.findAll();
	}

	async create(input: CreateTodoInput): Promise<void> {
		await this.repository.create(input);
	}

	async toggleComplete(id: number): Promise<void> {
		await this.repository.toggleComplete(id);
	}

	async delete(id: number): Promise<void> {
		await this.repository.delete(id);
	}

	async exists(id: number): Promise<boolean> {
		return this.repository.exists(id);
	}
}
