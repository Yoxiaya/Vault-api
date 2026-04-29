import { Hono } from 'hono';
import { VaultAccountsController } from '../controllers/vault-accounts.controller';
import { VaultAccountsService } from '../services/vault-accounts.service';
import { Bindings, Variables } from '../types';
import { authMiddleware } from '../middlewares';

export const vaultAccountsRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

vaultAccountsRoutes.use('*', async (c, next) => {
	const vaultAccountsService = new VaultAccountsService(c.env.vault_db);
	try {
		const session = await authMiddleware(c.env.vault_db, c.req.header('Authorization') || '');
		c.set('session', session);
	} catch (error) {
		return c.json({ success: false, error: (error as Error).message }, 401);
	}
	c.set('vaultAccountsController', new VaultAccountsController(vaultAccountsService));
	await next();
});

vaultAccountsRoutes.get('/', (c) => c.get('vaultAccountsController')!.getAllAccounts(c));
vaultAccountsRoutes.post('/', (c) => c.get('vaultAccountsController')!.createAccount(c));
vaultAccountsRoutes.put('/:id', (c) => c.get('vaultAccountsController')!.updateAccount(c));
vaultAccountsRoutes.delete('/:id', (c) => c.get('vaultAccountsController')!.deleteAccount(c));
vaultAccountsRoutes.get('/:id', (c) => c.get('vaultAccountsController')!.findById(c));
vaultAccountsRoutes.post('/upload-image', (c) => c.get('vaultAccountsController')!.uploadImage(c));
vaultAccountsRoutes.post('/delete-image', (c) => c.get('vaultAccountsController')!.deleteImage(c));
