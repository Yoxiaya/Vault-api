import { Hono } from 'hono';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { EmailCodeService } from '../services/email-code.service';
import { EmailCodeController } from '../controllers/email-code.controller';
import { Bindings, Variables } from '../types';

export const authRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

authRoutes.use('*', async (c, next) => {
	const authService = new AuthService(c.env.vault_db);
	const emailCodeService = new EmailCodeService(c.env.vault_db);

	c.set('authController', new AuthController(authService));
	c.set('emailCodeController', new EmailCodeController(emailCodeService));
	await next();
});
authRoutes.post('/register', (c) => c.get('authController')!.register(c));
authRoutes.post('/login', (c) => c.get('authController')!.login(c));
authRoutes.post('/send-code', (c) => c.get('emailCodeController')!.sendCode(c));
