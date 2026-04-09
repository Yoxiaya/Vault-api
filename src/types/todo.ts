export type Todo = {
	id: number;
	title: string;
	completed: number; // 0: 未完成, 1: 已完成
	created_at: number;
};

export type CreateTodoInput = {
	title: string;
};

export type UpdateTodoInput = {
	completed: number;
};
