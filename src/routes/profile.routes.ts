import { Hono } from 'hono';
import { Bindings, Variables } from '../types';
import { authMiddleware } from '../middlewares';
import { ProfileController } from '../controllers/profile.controller';
import { ProfileService } from '../services/profile.service';
import { CommonService } from '../services/common.service';

export const profileRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

profileRoutes.use('*', async (c, next) => {
	const profileService = new ProfileService(c.env.vault_db);
	const commonService = new CommonService(c.env.IMAGE_API_URL, c.env.IMAGE_API_TOKEN);
	const session = await authMiddleware(c.env.vault_db, c.req.header('Authorization') || '');
	c.set('session', session);
	c.set('profileController', new ProfileController(profileService, commonService));
	await next();
});

profileRoutes.get('/profile', (c) => c.get('profileController')!.getProfile(c));
profileRoutes.post('/updateProfile', (c) => c.get('profileController')!.updateProfile(c));
profileRoutes.post('/uploadAvatar', (c) => c.get('profileController')!.uploadAvatar(c));
