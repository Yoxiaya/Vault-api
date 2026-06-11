import { Context } from 'hono';
import { VaultAccountsService } from '../services/vault-accounts.service';
import { CommonService } from '../services/common.service';
import { AppError } from '../utils';

export class VaultAccountsController {
	constructor(
		private service: VaultAccountsService,
		private commonService: CommonService
	) {}

	async getAllAccounts(c: Context) {
		const session = c.get('session');
		const accounts = await this.service.findAll(session.user_id);
		return c.json({ success: true, data: accounts });
	}

	async createAccount(c: Context) {
		const session = c.get('session');
		const formData = await c.req.parseBody();
		const data = JSON.parse(formData['data'] as string);
		const imagefile = formData['image'] as File;
		const action = formData['action'] as string;
		let logoUrl = '';
		if (action === 'update') {
			const imageInfo = await this.commonService.uploadImage(imagefile);
			logoUrl = imageInfo.url;
		}
		await this.service.createAccount({ ...data, userId: session.user_id, logoUrl });
		return c.json({ success: true, message: '创建成功' }, 201);
	}

	async updateAccount(c: Context) {
		const id = this.parseId(c.req.param('id'));
		const formData = await c.req.parseBody();
		const session = c.get('session');
		const data = JSON.parse(formData['data'] as string);
		const imagefile = formData['image'] as File;
		const action = formData['action'] as string;
		const account = await this.service.findById(id);
		let logoUrl = '';

		if (action === 'update') {
			await this.commonService.deleteImage(logoUrl);
			const imageInfo = await this.commonService.uploadImage(imagefile);
			logoUrl = imageInfo.url;
		}
		if (action === 'delete') {
			await this.commonService.deleteImage(logoUrl);
			logoUrl = '';
		}
		if (action === 'keep') {
			logoUrl = account?.logoUrl || '';
		}

		await this.service.updateAccount(id, { ...data, userId: session.user_id, logoUrl });
		return c.json({ success: true, message: '更新成功' }, 200);
	}

	async deleteAccount(c: Context) {
		const id = this.parseId(c.req.param('id'));
		const session = c.get('session');
		await this.service.deleteAccount(id, session.user_id);
		return c.json({ success: true, message: '删除成功' }, 200);
	}

	async findById(c: Context) {
		const id = this.parseId(c.req.param('id'));
		const account = await this.service.findById(id);
		if (!account) {
			throw new AppError('账户不存在', 404);
		}
		return c.json({ success: true, data: account });
	}

	private parseId(param: string | undefined): number {
		const id = parseInt(param || '');
		if (isNaN(id)) {
			throw new AppError('无效的ID', 400);
		}
		return id;
	}
}
