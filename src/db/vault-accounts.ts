import { Bindings } from '../types';
import { drizzle } from 'drizzle-orm/d1';
import { accounts, type Account } from './schema';

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
		await drizzleDb.insert(accounts).values(account);
	}
}
