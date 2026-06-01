import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const emailVerifications = sqliteTable('email_verifications', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull(),
	code: text('code').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$default(() => new Date()),
});

export type EmailVerification = typeof emailVerifications.$inferSelect;
export type NewEmailVerification = typeof emailVerifications.$inferInsert;
