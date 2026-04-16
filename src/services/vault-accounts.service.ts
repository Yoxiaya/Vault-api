import { VaultAccountsDatabase } from '../db/vault-accounts';
import { Account } from '../db/schema';
import { IMAGE_API_URL, IMAGE_API_TOKEN } from '../config/index';
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
	// 根据ID获取账户
	async findById(id: number): Promise<Account | null> {
		return this.db.findById(id);
	}
	// 上传图片
	async uploadImage(image: File): Promise<any> {
		const formData = new FormData();
		formData.append('file', image);
		formData.append('token', IMAGE_API_TOKEN);
		const result = await fetch(`${IMAGE_API_URL}/upload`, {
			method: 'POST',
			body: formData,
		});
		return result.json();
	}
	// 删除图片
	async deleteImage(url: string): Promise<void> {
		const formData = new FormData();
		formData.append('urls', url);
		formData.append('token', IMAGE_API_TOKEN);
		const result = await fetch(`${IMAGE_API_URL}/delete`, {
			method: 'POST',
			body: formData,
		});
		return result.json();
	}
}
