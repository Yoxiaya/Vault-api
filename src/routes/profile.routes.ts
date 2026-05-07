import { Hono } from 'hono';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { Bindings, Variables } from '../types';
import { authMiddleware } from '../middlewares';
import { ProfileController } from '../controllers/profile.controller';
import { ProfileService } from '../services/profile.service';

export const profileRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

profileRoutes.use('*', async (c, next) => {
	const profileService = new ProfileService(c.env.vault_db);
	try {
		const session = await authMiddleware(c.env.vault_db, c.req.header('Authorization') || '');
		c.set('session', session);
	} catch (error) {
		return c.json({ success: false, error: (error as Error).message }, 401);
	}
	c.set('profileController', new ProfileController(profileService));
	await next();
});

profileRoutes.get('/profile', (c) => c.get('profileController')!.getProfile(c));
profileRoutes.post('/updateProfile', (c) => c.get('profileController')!.updateProfile(c));
profileRoutes.post('/updateAvatar', (c) => c.get('profileController')!.updateAvatar(c));
