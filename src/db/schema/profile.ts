import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './index';

export const profiles = sqliteTable('profiles', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	profileName: text('profile_name').notNull(),
	profileAvatar: text('profile_avatar'),
	phoneNumber: text('phone_number'),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
