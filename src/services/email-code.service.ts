import { Resend } from 'resend';
import { eq, and } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Bindings } from '../types';
import { emailVerifications } from '../db/schema';
import { AppError } from '../utils';

export class EmailCodeService {
	private resend: Resend | null = null;

	constructor(
		private vault_db: Bindings['vault_db'],
		private emailApiToken: string
	) {}

	private getResend(): Resend {
		if (!this.resend) {
			if (!this.emailApiToken) {
				throw new AppError('邮件服务未配置（缺少 EMAIL_API_TOKEN）', 500);
			}
			this.resend = new Resend(this.emailApiToken);
		}
		return this.resend;
	}

	async sendVerificationCode(email: string) {
		const drizzleDb = drizzle(this.vault_db);

		const existing = await drizzleDb
			.select()
			.from(emailVerifications)
			.where(eq(emailVerifications.email, email))
			.get();

		if (existing && existing.createdAt && new Date(existing.createdAt) > new Date(Date.now() - 60000)) {
			throw new AppError('发送过于频繁，请稍后再试', 429);
		}

		const code = this.generateCode();
		const expiresAt = new Date();
		expiresAt.setMinutes(expiresAt.getMinutes() + 5);

		if (existing) {
			await drizzleDb
				.update(emailVerifications)
				.set({ code, expiresAt, createdAt: new Date() })
				.where(eq(emailVerifications.email, email));
		} else {
			await drizzleDb.insert(emailVerifications).values({ email, code, expiresAt });
		}
		await this.sendEmail(email, code);

		return { success: true, message: '验证码已发送' };
	}

	async verifyCode(email: string, code: string): Promise<boolean> {
		const drizzleDb = drizzle(this.vault_db);

		const verification = await drizzleDb
			.select()
			.from(emailVerifications)
			.where(and(eq(emailVerifications.email, email), eq(emailVerifications.code, code)))
			.get();

		if (!verification) {
			return false;
		}

		if (new Date(verification.expiresAt) < new Date()) {
			return false;
		}

		await drizzleDb.delete(emailVerifications).where(eq(emailVerifications.email, email));

		return true;
	}

	private generateCode(): string {
		return Math.floor(100000 + Math.random() * 900000).toString();
	}
	private async sendEmail(email: string, code: string) {
		const resend = this.getResend();
		await resend.emails.send({
			from: 'Vault<noreply@yoxiaya.com>',
			to: [email],
			subject: 'Vault 验证码',
			html: `<p>您的验证码是：${code}</p>`,
		});
	}
}
