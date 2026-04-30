import { Bindings } from '../types';
import { drizzle } from 'drizzle-orm/d1';
import { accounts, type Account } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export class VaultAccountsRepository {
	constructor(private vault_db: Bindings['vault_db']) {}

	async findAll(userId: number): Promise<Account[]> {
		const drizzleDb = drizzle(this.vault_db);
		const result = await drizzleDb.select().from(accounts).where(eq(accounts.userId, userId)).orderBy(accounts.id);
		return result;
	}

	async create(account: Account): Promise<void> {
		const drizzleDb = drizzle(this.vault_db);
		await drizzleDb.insert(accounts).values(account).run();
	}

	async update(id: number, account: Account): Promise<void> {
		const drizzleDb = drizzle(this.vault_db);

		await drizzleDb
			.update(accounts)
			.set(account)
			.where(and(eq(accounts.id, id), eq(accounts.userId, account.userId)))
			.run();
	}

	async delete(id: number, userId: number): Promise<void> {
		const drizzleDb = drizzle(this.vault_db);
		await drizzleDb
			.delete(accounts)
			.where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
			.run();
	}

	async findById(id: number): Promise<Account | null> {
		const drizzleDb = drizzle(this.vault_db);
		const result = await drizzleDb.select().from(accounts).where(eq(accounts.id, id)).run();
		const account = result.results[0];
		return account;
	}
}
