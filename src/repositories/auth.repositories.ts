import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/d1';
import { eq, or } from 'drizzle-orm';
import { Bindings, LoginInfo, RegisterUser } from '../types/index';
import { users, sessions, profiles } from '../db/schema';
import { AppError, EMAIL_REGEX } from '../utils';

export class AuthRepository {
	constructor(private vault_db: Bindings['vault_db']) {}

	async register(user: RegisterUser) {
		const drizzleDb = drizzle(this.vault_db);
		const exists = await drizzleDb
			.select()
			.from(users)
			.where(or(eq(users.username, user.username), eq(users.email, user.email)))
			.run();
		if (exists.results.length > 0) {
			throw new AppError('用户名或邮箱已存在', 409);
		}
		const passwordHash = await bcrypt.hash(user.password, 10);
		const [newUser] = await drizzleDb
			.insert(users)
			.values({
				username: user.username,
				passwordHash: passwordHash,
				email: user.email,
			})
			.returning();
		await drizzleDb.insert(profiles).values({
			userId: newUser.id,
			profileName: user.username,
		});
	}
	async login(loginInfo: LoginInfo) {
		const drizzleDb = drizzle(this.vault_db);

		const isEmail = EMAIL_REGEX.test(loginInfo.account);
		let user;
		if (isEmail) {
			user = await drizzleDb.select().from(users).where(eq(users.email, loginInfo.account)).get();
		} else {
			user = await drizzleDb.select().from(users).where(eq(users.username, loginInfo.account)).get();
		}
		if (!user) {
			throw new AppError('用户不存在', 404);
		}
		const isMatch = await bcrypt.compare(loginInfo.password, user.passwordHash);
		if (!isMatch) {
			throw new AppError('账号或密码错误', 401);
		}
		const existingSession = await drizzleDb.select().from(sessions).where(eq(sessions.user_id, user.id)).get();
		const token = crypto.randomUUID();
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);
		if (existingSession) {
			await drizzleDb.update(sessions).set({ token, expires_at: expiresAt }).where(eq(sessions.user_id, user.id));
		} else {
			await drizzleDb.insert(sessions).values({
				user_id: user.id,
				token,
				expires_at: expiresAt,
			});
		}

		return {
			token,
			user: { id: user.id, username: user.username, email: user.email },
		};
	}
}
