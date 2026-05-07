import { Bindings, LoginInfo, RegisterUser } from '../types/index';
import { drizzle } from 'drizzle-orm/d1';
import { users, sessions, profiles } from '../db/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

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
			throw new Error('用户名或邮箱已存在');
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

		const isEmail = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(loginInfo.account);
		let user;
		if (isEmail) {
			user = await drizzleDb.select().from(users).where(eq(users.email, loginInfo.account)).get();
		} else {
			user = await drizzleDb.select().from(users).where(eq(users.username, loginInfo.account)).get();
		}
		if (!user) {
			throw new Error('用户不存在');
		}
		const isMatch = await bcrypt.compare(loginInfo.password, user.passwordHash);
		if (!isMatch) {
			throw new Error('账号或密码错误');
		}
		const isLogin = await drizzleDb.select().from(sessions).where(eq(sessions.user_id, user.id)).get();
		const token = crypto.randomUUID();
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);
		if (isLogin) {
			await drizzleDb
				.update(sessions)
				.set({ token, expires_at: new Date(expiresAt) })
				.where(eq(sessions.user_id, user.id));
		} else {
			await drizzleDb.insert(sessions).values({
				user_id: user.id,
				token,
				expires_at: new Date(expiresAt),
			});
		}

		return {
			token,
			user: { id: user.id, username: user.username, email: user.email },
		};
	}

	async authMiddleware(token: string) {
		const drizzleDb = drizzle(this.vault_db);
		const session = await drizzleDb.select().from(sessions).where(eq(sessions.token, token)).get();
		if (!session || new Date(session.expires_at) < new Date()) {
			throw new Error('无效或过期的 token');
		}
		return session;
	}
}
