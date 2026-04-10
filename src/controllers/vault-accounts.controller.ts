import { Context } from 'hono';
import { VaultAccountsService } from '../services/vault-accounts.service';
import { Bindings } from '../types';
import { Account, NewAccount } from '../db/schema';

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
			const data = await c.req.json();

			await this.service.createAccount(data);
			return c.json({ success: true, message: '创建成功' }, 201);
		} catch (error) {
			console.error('创建账户失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}
	// 更新账户
	async updateAccount(c: Context) {
		try {
			const id = parseInt(c.req.param('id') || '');
			const data = await c.req.json();

			await this.service.updateAccount(id, data);
			return c.json({ success: true, message: '更新成功' }, 200);
		} catch (error) {
			console.error('更新账户失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}
	// 删除账户
	async deleteAccount(c: Context) {
		try {
			const id = parseInt(c.req.param('id') || '');

			await this.service.deleteAccount(id);
			return c.json({ success: true, message: '删除成功' }, 200);
		} catch (error) {
			console.error('删除账户失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}
}
