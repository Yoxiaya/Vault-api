import { Context } from 'hono';

export const errorHandler = () => {
	return async (c: Context, next: () => Promise<void>) => {
		try {
			await next();
		} catch (error) {
			console.error('Error:', error);
			return c.json({
				success: false,
				error: error instanceof Error ? error.message : '服务器内部错误',
			}, 500);
		}
	};
};