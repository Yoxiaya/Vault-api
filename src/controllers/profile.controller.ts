import { Context } from 'hono';
import { ProfileService } from '../services/profile.service';
import { Profile } from '../db/schema';
import { deleteImage, uploadImage } from '../utils';

export class ProfileController {
	constructor(private service: ProfileService) {}

	async getProfile(c: Context) {
		try {
			const session = c.get('session');
			const profile = await this.service.getProfile(session.user_id);
			return c.json({ success: true, message: '获取用户信息成功', data: profile });
		} catch (error: any) {
			console.log('获取用户信息失败失败', error);
			return c.json({ success: false, message: error.message || '服务器内部错误' }, 500);
		}
	}
	async updateProfile(c: Context) {
		try {
			const session = c.get('session');
			const profile = await c.req.json<Partial<Profile>>();
			await this.service.updateProfile(session.user_id, profile);
			return c.json({ success: true, message: '更新用户信息成功' });
		} catch (error: any) {
			console.log('更新用户信息失败', error);
			return c.json({ success: false, message: error.message || '服务器内部错误' }, 500);
		}
	}
	async updateAvatar(c: Context) {
		try {
			const session = c.get('session');
			const data = await c.req.parseBody();
			const avatar = data['file'] as File;
			const profile = await this.service.getProfile(session.user_id);
			if (profile?.profileAvatar) {
				await deleteImage(profile.profileAvatar);
			}
			const result = await uploadImage(avatar);

			await this.service.updateProfile(session.user_id, { profileAvatar: result.url });
			return c.json({ success: true, message: '更新用户头像成功' });
		} catch (error: any) {
			console.log('更新用户头像失败', error);
			return c.json({ success: false, message: error.message || '服务器内部错误' }, 500);
		}
	}
}
