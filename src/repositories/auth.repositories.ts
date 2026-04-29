import { Bindings, LoginInfo, RegisterUser } from '../types/index';
import { drizzle } from 'drizzle-orm/d1';
import { users, type User } from '../db/schema';
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
		const result = await drizzleDb.insert(users).values({
			username: user.username,
			passwordHash: passwordHash,
			email: user.email,
		});
	}
	async login(loginInfo: LoginInfo) {
		const drizzleDb = drizzle(this.vault_db);
		const user = await drizzleDb.select().from(users).where(eq(users.email, loginInfo.email)).run();
		if (user.results.length === 0) {
			throw new Error('用户不存在');
		}
		const isMatch = await bcrypt.compare(loginInfo.password, user.results[0].passwordHash);
		if (!isMatch) {
			throw new Error('密码错误');
		}
	}
}
