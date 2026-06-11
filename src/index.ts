import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { vaultAccountsRoutes } from './routes/vault-accounts.routes';
import { profileRoutes } from './routes/profile.routes';
import { Bindings, Variables } from './types/index';
import { authRoutes } from './routes/auth.routes';
import { CORS_ORIGIN } from './config';
import { onError } from './middlewares';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use(
	'*',
	cors({
		origin: CORS_ORIGIN,
		credentials: true,
		allowHeaders: ['Content-Type', 'Authorization'],
	})
);
app.use('*', logger());

app.route('/vault-accounts', vaultAccountsRoutes);
app.route('/auth', authRoutes);
app.route('/user', profileRoutes);

app.get('/', (c) => c.json({ status: 'ok', message: 'Vault API is running' }));

app.onError(onError);

export default app;
