import { Context } from 'hono';
import { AppError } from '../utils';

export const errorHandler = () => {
	return async (c: Context, next: () => Promise<void>) => {
		try {
			await next();
		} catch (error) {
			console.error('Error:', error);

			if (error instanceof AppError) {
				return c.json({ success: false, error: error.message }, error.statusCode);
			}

			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : '服务器内部错误',
				},
				500
			);
		}
	};
};