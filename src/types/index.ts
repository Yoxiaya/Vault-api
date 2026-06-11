import type { Session } from '../db/schema/sessions';
import type { Context } from 'hono';

export type Bindings = {
	vault_db: D1Database;
	IMAGE_API_URL: string;
	IMAGE_API_TOKEN: string;
	EMAIL_API_TOKEN: string;
};
export * from './auth.type';

export type Variables = {
	vaultAccountsController?: VaultAccountsController;
	authController?: AuthController;
	profileController?: ProfileController;
	emailCodeController?: EmailCodeController;
	session?: Session | null;
};

// Controller 类型定义 — 用于 Variables 中 c.get()/c.set() 的类型推断
export interface AuthController {
	register(c: Context): Promise<Response>;
	login(c: Context): Promise<Response>;
}

export interface ProfileController {
	getProfile(c: Context): Promise<Response>;
	updateProfile(c: Context): Promise<Response>;
	uploadAvatar(c: Context): Promise<Response>;
}

export interface VaultAccountsController {
	getAllAccounts(c: Context): Promise<Response>;
	createAccount(c: Context): Promise<Response>;
	updateAccount(c: Context): Promise<Response>;
	deleteAccount(c: Context): Promise<Response>;
	findById(c: Context): Promise<Response>;
}

export interface EmailCodeController {
	sendCode(c: Context): Promise<Response>;
}
