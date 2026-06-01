import { Bindings } from '../types';
import { eq, and } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { emailVerifications } from '../db/schema/email-verifications';

export class EmailCodeService {
	constructor(private vault_db: Bindings['vault_db']) {}

	async sendVerificationCode(email: string) {
		const drizzleDb = drizzle(this.vault_db);

		const existing = await drizzleDb
			.select()
			.from(emailVerifications)
			.where(eq(emailVerifications.email, email))
			.get();

		if (existing && existing.createdAt && new Date(existing.createdAt) > new Date(Date.now() - 60000)) {
			throw new Error('发送过于频繁，请稍后再试');
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
		console.log(`发送验证码到 ${email}：${code}`);
	}
}
