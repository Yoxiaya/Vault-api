import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

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
	description: text('description').default(''),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
