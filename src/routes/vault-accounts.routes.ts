import { Hono } from 'hono';
import { VaultAccountsController } from '../controllers/vault-accounts.controller';

let vaultAccountsController: VaultAccountsController;

export const vaultAccountsRoutes = new Hono();

vaultAccountsRoutes.use('*', async (c, next) => {
	if (!vaultAccountsController) {
		//@ts-ignore
		vaultAccountsController = new VaultAccountsController(c.env.vault_db);
	}
	await next();
});

vaultAccountsRoutes.get('/', (c) => vaultAccountsController.getAllAccounts(c));
vaultAccountsRoutes.post('/', (c) => vaultAccountsController.createAccount(c));
vaultAccountsRoutes.put('/:id', (c) => vaultAccountsController.updateAccount(c));
vaultAccountsRoutes.delete('/:id', (c) => vaultAccountsController.deleteAccount(c));
vaultAccountsRoutes.post('/upload-image', (c) => vaultAccountsController.uploadImageToImgbb(c));
