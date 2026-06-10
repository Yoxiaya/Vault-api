import { Context } from 'hono';
import { AuthService } from '../services/auth.service';
import { LoginInfo, RegisterUser } from '../types';

export class AuthController {
	constructor(private service: AuthService) {}

	async register(c: Context) {
		const user = await c.req.json<RegisterUser>();
		await this.service.register(user);
		return c.json({ success: true, message: '注册成功' });
	}
	async login(c: Context) {
		const loginInfo = await c.req.json<LoginInfo>();
		const result = await this.service.login(loginInfo);
		return c.json({ success: true, message: '登录成功', data: result });
	}
}
