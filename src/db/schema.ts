import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// 用户表
export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').unique().notNull(),
	age: integer('age'),
	createdAt: integer('created_at', { mode: 'timestamp' }).$default(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
});

// 文章表
export const posts = sqliteTable('posts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	content: text('content').notNull(),
	userId: integer('user_id').references(() => users.id),
	published: integer('published', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).$default(() => new Date()),
});

// 导出类型
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
