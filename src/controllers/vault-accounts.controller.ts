import { Context } from 'hono';
import { VaultAccountsService } from '../services/vault-accounts.service';

export class VaultAccountsController {
	constructor(private service: VaultAccountsService) {}

	async getAllAccounts(c: Context) {
		try {
			const accounts = await this.service.findAll();
			return c.json({ success: true, data: accounts });
		} catch (error) {
			console.error('获取账户失败:', error);
			return c.json({ success: false, error: '服务器内部错误' }, 500);
		}
	}

	async createAccount(c: Context) {
		try {
			const data = await c.req.json();
			await this.service.createAccount(data);
			return c.json({ success: true, message: '创建成功' }, 201);
		} catch (error) {
			console.error('创建账户失败:', error);
			return c.json({ success: false, error: '服务器内部错误' }, 500);
		}
	}

	async updateAccount(c: Context) {
		try {
			const id = parseInt(c.req.param('id') || '');
			const data = await c.req.json();

			if (isNaN(id)) {
				return c.json({ success: false, error: '无效的ID' }, 400);
			}

			await this.service.updateAccount(id, data);
			return c.json({ success: true, message: '更新成功' }, 200);
		} catch (error) {
			console.error('更新账户失败:', error);
			return c.json({ success: false, error: '服务器内部错误' }, 500);
		}
	}

	async deleteAccount(c: Context) {
		try {
			const id = parseInt(c.req.param('id') || '');

			if (isNaN(id)) {
				return c.json({ success: false, error: '无效的ID' }, 400);
			}

			await this.service.deleteAccount(id);
			return c.json({ success: true, message: '删除成功' }, 200);
		} catch (error) {
			console.error('删除账户失败:', error);
			return c.json({ success: false, error: '服务器内部错误' }, 500);
		}
	}

	async findById(c: Context) {
		try {
			const id = parseInt(c.req.param('id') || '');

			if (isNaN(id)) {
				return c.json({ success: false, error: '无效的ID' }, 400);
			}

			const account = await this.service.findById(id);
			if (!account) {
				return c.json({ success: false, error: '账户不存在' }, 404);
			}

			return c.json({ success: true, data: account });
		} catch (error) {
			console.error('获取账户失败:', error);
			return c.json({ success: false, error: '服务器内部错误' }, 500);
		}
	}

	async uploadImage(c: Context) {
		try {
			const data = await c.req.parseBody();
			const image = data['file'] as File;

			if (!image) {
				return c.json({ success: false, error: '请提供图片文件' }, 400);
			}

			const result = await this.service.uploadImage(image);
			return c.json({ success: true, data: result });
		} catch (error) {
			console.error('上传图片失败:', error);
			return c.json({ success: false, error: '服务器内部错误' }, 500);
		}
	}

	async deleteImage(c: Context) {
		try {
			const { url } = await c.req.json();

			if (!url) {
				return c.json({ success: false, error: '请提供图片URL' }, 400);
			}

			await this.service.deleteImage(url);
			return c.json({ success: true, message: '删除成功' });
		} catch (error) {
			console.error('删除图片失败:', error);
			return c.json({ success: false, error: '服务器内部错误' }, 500);
		}
	}
}