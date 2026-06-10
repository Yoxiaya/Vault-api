import { eq } from 'drizzle-orm';
import { sessions } from '../db/schema';
import { Bindings } from '../types/index';
import { drizzle } from 'drizzle-orm/d1';
import { AppError } from '../utils';

export async function authMiddleware(db: Bindings['vault_db'], authHeader: string) {
	const drizzleDb = drizzle(db);

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new AppError('未提供有效的 Authorization header', 401);
	}

	const token = authHeader.split(' ')[1];

	if (!token) {
		throw new AppError('token 不能为空', 401);
	}

	const session = await drizzleDb.select().from(sessions).where(eq(sessions.token, token)).get();
	if (!session || new Date(session.expires_at) < new Date()) {
		throw new AppError('无效或过期的 token', 401);
	}
	return session;
}
