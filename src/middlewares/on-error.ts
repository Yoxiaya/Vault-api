import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { HTTPException } from 'hono/http-exception';
import { AppError } from '../utils';

/**
 * Hono onError 全局异常处理器
 *
 * 通过 name 属性而非 instanceof 判断错误类型（兼容 Workers 打包）。
 */
export function onError(error: Error, c: Context): Response {
	const message = error instanceof Error ? error.message : String(error);
	const name = error instanceof Error ? error.name : 'Error';

	console.error({
		method: c.req.method,
		path: c.req.path,
		name,
		message,
		stack: error instanceof Error ? error.stack : undefined,
	});

	// Hono 内置异常（404 / 401 等）
	if (name === 'HTTPException') {
		return c.json({ success: false, error: message }, (error as HTTPException).status as ContentfulStatusCode);
	}

	// 业务异常
	if (name === AppError.name) {
		return c.json({ success: false, error: message }, (error as AppError).statusCode);
	}

	// 兜底
	return c.json({ success: false, error: message || '服务器内部错误' }, 500);
}
