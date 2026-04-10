import { Context } from 'hono';
import { VaultAccountsService } from '../services/vault-accounts.service';
import { Bindings } from '../types';
import { Account } from '../db/schema';

export class VaultAccountsController {
	private service: VaultAccountsService;
	constructor(db: Bindings['vault_db']) {
		this.service = new VaultAccountsService(db);
	}
	// 获取所有账户
	async getAllAccounts(c: Context) {
		try {
			const accounts = await this.service.findAll();
			return c.json({ success: true, data: accounts });
		} catch (error) {
			console.error('获取账户失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}
	// 创建账户
	async createAccount(c: Context) {
		try {
			const { name, username, password, website, category, lastUpdated, twoFactorEnabled, storageType } =
				await c.req.json();
			const accounts = {
				name,
				username,
				password,
				website,
				category,
				lastUpdated,
				twoFactorEnabled,
				storageType,
			};
			await this.service.createAccount(accounts as unknown as Account);
			return c.json({ success: true, message: '创建成功' }, 201);
		} catch (error) {
			console.error('创建账户失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}
}
