import { VaultAccountsDatabase } from '../db/vault-accounts';
import { Account } from '../db/schema';
import { Bindings } from '../types';
import axios from 'axios';

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
		const result = await axios({
			method: 'post',
			// url: 'https://api.superbed.cn/upload',
			url: 'http://127.0.0.1:8787/vault-accounts/form',
			data,
		});
		return result.data;
	}
}
