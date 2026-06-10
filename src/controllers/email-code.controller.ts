import { Context } from 'hono';
import { EmailCodeService } from '../services/email-code.service';
import { AppError } from '../utils';

export class EmailCodeController {
	constructor(private service: EmailCodeService) {}

	async sendCode(c: Context) {
		const { email } = await c.req.json<{ email: string }>();
		if (!email) {
			throw new AppError('请输入邮箱', 400);
		}
		await this.service.sendVerificationCode(email);
		return c.json({ success: true, message: '验证码已发送到邮箱' });
	}
}
