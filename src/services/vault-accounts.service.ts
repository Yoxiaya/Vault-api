import { VaultAccountsDatabase } from '../db/vault-accounts';
import { Account } from '../db/schema';
import { Bindings } from '../types';

export class VaultAccountsService {
	private db: VaultAccountsDatabase;
	constructor(database: Bindings['vault_db']) {
		this.db = new VaultAccountsDatabase(database);
	}
	// 获取所有账户
	async findAll(): Promise<Account[]> {
		return this.db.findAll();
	}
	// 创建账户
	async createAccount(account: Account): Promise<void> {
		await this.db.create(account);
	}
}
