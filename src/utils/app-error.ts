import type { ContentfulStatusCode } from 'hono/utils/http-status';

/**
 * 应用自定义错误类 — 支持 HTTP 状态码
 * 在业务层抛出，由全局 errorHandler 统一捕获并返回
 */
export class AppError extends Error {
	constructor(
		message: string,
		public statusCode: ContentfulStatusCode = 400
	) {
		super(message);
		this.name = 'AppError';
	}
}
