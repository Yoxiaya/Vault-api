import { Context } from 'hono';
import { ProfileService } from '../services/profile.service';
import { CommonService } from '../services/common.service';
import { Profile } from '../db/schema';

export class ProfileController {
	constructor(
		private service: ProfileService,
		private commonService: CommonService
	) {}

	async getProfile(c: Context) {
		const session = c.get('session');
		const profile = await this.service.getProfile(session.user_id);
		return c.json({ success: true, message: '获取用户信息成功', data: profile });
	}
	async updateProfile(c: Context) {
		const session = c.get('session');
		const profile = await c.req.json<Partial<Profile>>();
		await this.service.updateProfile(session.user_id, profile);
		return c.json({ success: true, message: '更新用户信息成功' });
	}
	async uploadAvatar(c: Context) {
		const session = c.get('session');
		const data = await c.req.parseBody();
		const avatar = data['file'] as File;
		const profile = await this.service.getProfile(session.user_id);
		if (profile?.profileAvatar) {
			await this.commonService.deleteImage(profile.profileAvatar);
		}
		const result = await this.commonService.uploadImage(avatar);
		await this.service.uploadAvatar(session.user_id, result.url);
		return c.json({ success: true, message: '上传用户头像成功' });
	}
}
