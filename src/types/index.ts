// @ts-nocheck
export type Bindings = {
	todo_db: D1Database;
	vault_db: D1Database;
	DATABASE_URL: string;
	API_KEY: string;
};
export * from './auth.type';

export type Variables = {
	todoController?: TodoController;
	vaultAccountsController?: VaultAccountsController;
	authController?: AuthController;
};

export type AuthController = {
	register: (c: any) => Promise<any>;
};

export type TodoController = {
	getAllTodos: (c: any) => Promise<any>;
	createTodo: (c: any) => Promise<any>;
	toggleComplete: (c: any) => Promise<any>;
	deleteTodo: (c: any) => Promise<any>;
};

export type VaultAccountsController = {
	getAllAccounts: (c: any) => Promise<any>;
	createAccount: (c: any) => Promise<any>;
	updateAccount: (c: any) => Promise<any>;
	deleteAccount: (c: any) => Promise<any>;
	findById: (c: any) => Promise<any>;
	uploadImage: (c: any) => Promise<any>;
	deleteImage: (c: any) => Promise<any>;
};
