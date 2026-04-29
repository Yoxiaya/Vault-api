import { Context } from 'hono';
import { AuthService } from '../services/auth.service';
import { LoginInfo, RegisterUser } from '../types';

export class AuthController {
	constructor(private service: AuthService) {}

	async register(c: Context) {
		try {
			const user = await c.req.json<RegisterUser>();
			await this.service.register(user);
			return c.json({ success: true, message: '注册成功' });
		} catch (error: any) {
			console.log('注册失败', error);
			return c.json({ success: false, message: error.message || '服务器内部错误' }, 500);
		}
	}
	async login(c: Context) {
		try {
			const loginInfo = await c.req.json<LoginInfo>();
			const result = await this.service.login(loginInfo);
			return c.json({ success: true, message: '登录成功', data: result });
		} catch (error: any) {
			console.log('登录失败', error);
			return c.json({ success: false, message: error.message || '服务器内部错误' }, 500);
		}
	}
}
