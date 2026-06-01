import { Context } from 'hono';
import { EmailCodeService } from '../services/email-code.service';

export class EmailCodeController {
	constructor(private service: EmailCodeService) {}

	async sendCode(c: Context) {
		try {
			const { email } = await c.req.json<{ email: string }>();
			if (!email) {
				return c.json({ success: false, message: '请输入邮箱' }, 400);
			}
			await this.service.sendVerificationCode(email);
			return c.json({ success: true, message: '验证码已发送到邮箱' });
		} catch (error: any) {
			console.log('发送验证码失败', error);
			return c.json({ success: false, message: error.message || '发送失败' }, 400);
		}
	}
}
