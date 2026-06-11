import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { vaultAccountsRoutes } from './routes/vault-accounts.routes';
import { profileRoutes } from './routes/profile.routes';
import { Bindings, Variables } from './types/index';
import { authRoutes } from './routes/auth.routes';
import { CORS_ORIGIN } from './config';
import { AppError } from './utils';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use(
	'*',
	cors({
		origin: CORS_ORIGIN,
		credentials: true,
		allowHeaders: ['Content-Type', 'Authorization'],
	})
);
app.use('*', logger());

app.route('/vault-accounts', vaultAccountsRoutes);
app.route('/auth', authRoutes);
app.route('/user', profileRoutes);

app.get('/', (c) => c.json({ status: 'ok', message: 'Vault API is running' }));

/**
 * 全局异常处理
 *
 * 使用 Hono 官方的 onError 钩子替代中间件 try/catch，
 * 确保任何未捕获的错误都能被正确处理。
 * 通过 name 属性而非 instanceof 判断错误类型（兼容 Workers 打包）。
 */
app.onError((error, c) => {
	const message =
		error instanceof Error ? error.message : String(error);
	const name =
		error instanceof Error ? error.name : 'Error';

	console.error({
		method: c.req.method,
		path: c.req.path,
		name,
		message,
		stack: error instanceof Error ? error.stack : undefined,
	});

	// Hono 内置异常（404 / 401 等）
	if (name === 'HTTPException') {
		return c.json(
			{ success: false, error: message },
			(error as HTTPException).status as ContentfulStatusCode
		);
	}

	// 业务异常
	if (name === AppError.name) {
		return c.json(
			{ success: false, error: message },
			(error as AppError).statusCode
		);
	}

	// 兜底
	return c.json(
		{ success: false, error: message || '服务器内部错误' },
		500
	);
});

export default app;
