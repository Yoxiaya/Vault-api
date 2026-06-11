import { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { HTTPException } from 'hono/http-exception';
import { AppError } from '../utils';

const isDev = (c: Context): boolean => {
  const hostname = new URL(c.req.url).hostname;
  return hostname === 'localhost' || hostname.startsWith('127.');
};

export const errorHandler = () => {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (error) {
      console.error({
        method: c.req.method,
        path: c.req.path,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Hono 内置异常（如 404 Not Found、401 Unauthorized 等）
      if (error instanceof HTTPException) {
        return c.json(
          { success: false, error: error.message },
          error.status as ContentfulStatusCode
        );
      }

      // 业务自定义异常
      if (error instanceof AppError) {
        return c.json(
          { success: false, error: error.message },
          error.statusCode
        );
      }

      // 未知异常：开发环境返回具体错误便于调试，生产环境返回通用消息防止信息泄露
      return c.json(
        {
          success: false,
          error:
            isDev(c) && error instanceof Error
              ? error.message
              : '服务器内部错误',
        },
        500
      );
    }
  };
};
