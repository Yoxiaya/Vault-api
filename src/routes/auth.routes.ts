import { Hono } from 'hono';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { Bindings, Variables } from '../types';

export const authRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

authRoutes.use('*', async (c, next) => {
	const authService = new AuthService(c.env.vault_db);
	c.set('authController', new AuthController(authService));
	await next();
});
authRoutes.post('/register', (c) => c.get('authController')!.register(c));
