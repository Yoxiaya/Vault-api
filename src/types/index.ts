// @ts-nocheck
export type Bindings = {
	vault_db: D1Database;
	DATABASE_URL: string;
	API_KEY: string;
};
export * from './auth.type';

export type Variables = {
	vaultAccountsController?: VaultAccountsController;
	authController?: AuthController;
	profileController?: ProfileController;
	emailCodeController?: EmailCodeController;
	session?: Session | null;
};

export type AuthController = {
	register: (c: any) => Promise<any>;
	login: (c: any) => Promise<any>;
};

export type ProfileController = {
	getProfile: (c: any) => Promise<any>;
	updateProfile: (c: any) => Promise<any>;
	updateAvatar: (c: any) => Promise<any>;
};

export type VaultAccountsController = {
	getAllAccounts: (c: any) => Promise<any>;
	createAccount: (c: any) => Promise<any>;
	updateAccount: (c: any) => Promise<any>;
	deleteAccount: (c: any) => Promise<any>;
	findById: (c: any) => Promise<any>;
	uploadImage: (c: any) => Promise<any>;
	deleteImage: (c: any) => Promise<any>;
};

export type EmailCodeController = {
	sendCode: (c: any) => Promise<any>;
};
