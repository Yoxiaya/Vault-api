import { Context } from 'hono';
import { ProfileService } from '../services/profile.service';
import { Profile } from '../db/schema';

export class ProfileController {
	constructor(private service: ProfileService) {}

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
	async updateAvatar(c: Context) {
		const session = c.get('session');
		const data = await c.req.parseBody();
		const avatar = data['file'] as File;
		await this.service.updateAvatar(session.user_id, avatar);
		return c.json({ success: true, message: '更新用户头像成功' });
	}
}
