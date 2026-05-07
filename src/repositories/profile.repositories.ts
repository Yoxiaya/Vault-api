import { Bindings } from '../types/index';
import { drizzle } from 'drizzle-orm/d1';
import { Profile, profiles } from '../db/schema';
import { eq } from 'drizzle-orm';

export class ProfileRepository {
	constructor(private vault_db: Bindings['vault_db']) {}

	async getProfile(userId: number) {
		const drizzleDb = drizzle(this.vault_db);
		const profile = await drizzleDb.select().from(profiles).where(eq(profiles.userId, userId)).get();
		return profile;
	}
	async updateProfile(userId: number, profile: Partial<Profile>) {
		const drizzleDb = drizzle(this.vault_db);
		await drizzleDb.update(profiles).set(profile).where(eq(profiles.userId, userId));
	}
}
