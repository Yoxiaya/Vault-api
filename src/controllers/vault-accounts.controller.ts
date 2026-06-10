import { Context } from 'hono';
import { VaultAccountsService } from '../services/vault-accounts.service';
import { AppError } from '../utils';

export class VaultAccountsController {
	constructor(private service: VaultAccountsService) {}

	async getAllAccounts(c: Context) {
		const session = c.get('session');
		const accounts = await this.service.findAll(session.user_id);
		return c.json({ success: true, data: accounts });
	}

	async createAccount(c: Context) {
		const data = await c.req.json();
		const session = c.get('session');
		await this.service.createAccount({ ...data, userId: session.user_id });
		return c.json({ success: true, message: '创建成功' }, 201);
	}

	async updateAccount(c: Context) {
		const id = parseInt(c.req.param('id') || '');
		const data = await c.req.json();
		const session = c.get('session');
		if (isNaN(id)) {
			throw new AppError('无效的ID', 400);
		}

		await this.service.updateAccount(id, { ...data, userId: session.user_id });
		return c.json({ success: true, message: '更新成功' }, 200);
	}

	async deleteAccount(c: Context) {
		const id = parseInt(c.req.param('id') || '');
		const session = c.get('session');

		if (isNaN(id)) {
			throw new AppError('无效的ID', 400);
		}

		await this.service.deleteAccount(id, session.user_id);
		return c.json({ success: true, message: '删除成功' }, 200);
	}

	async findById(c: Context) {
		const id = parseInt(c.req.param('id') || '');

		if (isNaN(id)) {
			throw new AppError('无效的ID', 400);
		}

		const account = await this.service.findById(id);
		if (!account) {
			throw new AppError('账户不存在', 404);
		}

		return c.json({ success: true, data: account });
	}

	async uploadImage(c: Context) {
		const data = await c.req.parseBody();
		const image = data['file'] as File;

		if (!image) {
			throw new AppError('请提供图片文件', 400);
		}

		const result = await this.service.uploadImage(image);
		return c.json({ success: true, data: result });
	}

	async deleteImage(c: Context) {
		const { url } = await c.req.json();

		if (!url) {
			throw new AppError('请提供图片URL', 400);
		}

		await this.service.deleteImage(url);
		return c.json({ success: true, message: '删除成功' });
	}
}
