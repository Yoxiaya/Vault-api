import { Context } from 'hono';
import { CommonService } from '../services/common.service';
import { AppError } from '../utils';

export class CommonController {
	constructor(private commonService: CommonService) {}
	async uploadImage(c: Context) {
		const data = await c.req.parseBody();
		const image = data['file'] as File;
		if (!image) {
			throw new AppError('请提供图片文件', 400);
		}
		const result = await this.commonService.uploadImage(image);
		return c.json({ success: true, data: result });
	}
	async deleteImage(c: Context) {
		const data = await c.req.parseBody();
		const url = data['url'] as string;
		if (!url) {
			throw new AppError('请提供图片URL', 400);
		}
		await this.commonService.deleteImage(url);
		return c.json({ success: true });
	}
}
