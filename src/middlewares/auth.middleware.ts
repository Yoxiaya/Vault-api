import { eq } from 'drizzle-orm';
import { sessions } from '../db/schema';
import { Bindings } from '../types/index';
import { drizzle } from 'drizzle-orm/d1';

export async function authMiddleware(db: Bindings['vault_db'], authHeader: string) {
	const drizzleDb = drizzle(db);

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new Error('未提供有效的 Authorization header');
	}

	const token = authHeader.split(' ')[1];

	if (!token) {
		throw new Error('token 不能为空');
	}

	const session = await drizzleDb.select().from(sessions).where(eq(sessions.token, token)).get();
	if (!session || new Date(session.expires_at) < new Date()) {
		throw new Error('无效或过期的 token');
	}
	return session;
}
