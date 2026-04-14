import { VaultAccountsDatabase } from '../db/vault-accounts';
import { Account } from '../db/schema';
import { IMAGE_API_URL } from '../config/index';
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
	// 更新账户
	async updateAccount(id: number, account: Account): Promise<void> {
		await this.db.update(id, account);
	}
	// 删除账户
	async deleteAccount(id: number): Promise<void> {
		await this.db.delete(id);
	}
	// 上传图片
	async uploadImage(data: FormData): Promise<any> {
		const result = await fetch(`${IMAGE_API_URL}/upload`, {
			method: 'POST',
			body: data,
		});
		return result.json();
	}
	// 删除图片
	async deleteImage(data: FormData): Promise<void> {
		const result = await fetch(`${IMAGE_API_URL}/delete`, {
			method: 'POST',
			body: data,
		});
		return result.json();
	}
}
