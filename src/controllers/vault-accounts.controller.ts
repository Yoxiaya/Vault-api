import { Context } from 'hono';
import { VaultAccountsService } from '../services/vault-accounts.service';
import { Bindings } from '../types';

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
	// 根据ID获取账户
	async findById(c: Context) {
		try {
			const id = parseInt(c.req.param('id') || '');
			const account = await this.service.findById(id);
			if (account) {
				return c.json({ success: true, data: account });
			} else {
				return c.json({ success: false, message: '账户不存在' }, 404);
			}
		} catch (error) {
			console.error('根据账户ID获取账户失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}
	// 删除账户
	async deleteAccount(c: Context) {
		try {
			const id = parseInt(c.req.param('id') || '');
			const account = await this.service.findById(id);
			if (account && account.logoUrl) {
				await this.service.deleteImage(account.logoUrl);
			}
			await this.service.deleteAccount(id);
			return c.json({ success: true, message: '删除成功' }, 200);
		} catch (error) {
			console.error('删除账户失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}
	// 上传应用图标
	async uploadImage(c: Context) {
		try {
			const data = await c.req.parseBody();
			const image = data['file'] as File;
			const url = await this.service.uploadImage(image);
			return c.json({ success: true, data: url });
		} catch (error) {
			console.error('上传图片失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}
	// 删除图片
	async deleteImage(c: Context) {
		try {
			const data = await c.req.parseBody();
			const url = data['url'] as string;
			await this.service.deleteImage(url);
			return c.json({ success: true, message: '删除成功' }, 200);
		} catch (error) {
			console.error('删除图片失败:', error);
			return c.json({ error: '服务器内部错误' }, 500);
		}
	}
}
