import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todos', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	completed: integer('completed', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).$default(() => new Date()),
});

export const accounts = sqliteTable('accounts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	appName: text('appName').notNull(),
	username: text('username').notNull(),
	password: text('password').notNull(),
	email: text('email'),
	webSite: text('webSite'),
	category: text('category'),
	logoUrl: text('logoUrl'),
	lastUpdated: text('lastUpdated'),
	twoFactorEnabled: integer('twoFactorEnabled', { mode: 'boolean' }).default(false),
	storageType: text('storageType'),
});

// 导出类型

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
