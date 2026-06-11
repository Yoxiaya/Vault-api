import { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { HTTPException } from 'hono/http-exception';
import { AppError } from '../utils';

/**
 * 全局异常处理中间件
 *
 * 注意：Cloudflare Workers 打包后 instanceof 检查可能失效，
 * 因此通过 name 属性区分错误类型。
 */
export const errorHandler = () => {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (error) {
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

      // 业务异常 — 优先用 name 判断，兼容 Workers 打包后 instanceof 失效
      if (name === AppError.name) {
        const statusCode = (error as AppError).statusCode;
        return c.json(
          { success: false, error: message },
          statusCode
        );
      }

      // 兜底：未知异常
      return c.json(
        { success: false, error: message || '服务器内部错误' },
        500
      );
    }
  };
};
