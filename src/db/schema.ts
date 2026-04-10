import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todos', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	completed: integer('completed', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).$default(() => new Date()),
});

export const accounts = sqliteTable('accounts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	appName: text('app_name').notNull(),
	username: text('username').notNull(),
	password: text('password').notNull(),
	email: text('email'),
	webSite: text('web_site'),
	category: text('category'),
	logoUrl: text('logo_url'),
	lastUpdated: text('last_updated'),
	twoFactorEnabled: integer('two_factor_enabled', { mode: 'boolean' }).default(false),
	storageType: text('storage_type'),
});

// 导出类型

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
