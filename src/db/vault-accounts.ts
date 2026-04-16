import { Bindings } from '../types';
import { drizzle } from 'drizzle-orm/d1';
import { accounts, type Account } from './schema';
import { eq } from 'drizzle-orm';

export class VaultAccountsDatabase {
	constructor(private vault_db: Bindings['vault_db']) {}
	// 获取所有账户
	async findAll(): Promise<Account[]> {
		const drizzleDb = drizzle(this.vault_db);
		const result = await drizzleDb.select().from(accounts).orderBy(accounts.id);
		return result;
	}
	// 创建账户
	async create(account: Account): Promise<void> {
		const drizzleDb = drizzle(this.vault_db);
		await drizzleDb.insert(accounts).values(account).run();
	}
	// 更新账户
	async update(id: number, account: Account): Promise<void> {
		const drizzleDb = drizzle(this.vault_db);
		await drizzleDb.update(accounts).set(account).where(eq(accounts.id, id)).run();
	}
	// 删除账户
	async delete(id: number): Promise<void> {
		const drizzleDb = drizzle(this.vault_db);
		await drizzleDb.delete(accounts).where(eq(accounts.id, id)).run();
	}
	async findById(id: number): Promise<Account | null> {
		const drizzleDb = drizzle(this.vault_db);
		const result = await drizzleDb.select().from(accounts).where(eq(accounts.id, id)).run();
		const account = result.results[0];
		return account;
	}
}
