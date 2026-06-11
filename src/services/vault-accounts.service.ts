import { VaultAccountsRepository } from '../repositories/vault-accounts.repository';
import { Account } from '../db/schema';
import { Bindings } from '../types';
import { deleteImage, uploadImage } from '../utils';

export class VaultAccountsService {
	private repository: VaultAccountsRepository;
	private imageApiUrl: string;
	private imageApiToken: string;

	constructor(database: Bindings['vault_db'], imageApiUrl: string, imageApiToken: string) {
		this.repository = new VaultAccountsRepository(database);
		this.imageApiUrl = imageApiUrl;
		this.imageApiToken = imageApiToken;
	}

	async findAll(userId: number): Promise<Account[]> {
		return this.repository.findAll(userId);
	}

	async createAccount(account: Account): Promise<void> {
		await this.repository.create(account);
	}

	async updateAccount(id: number, account: Account): Promise<void> {
		await this.repository.update(id, account);
	}

	async deleteAccount(id: number, userId: number): Promise<void> {
		await this.repository.delete(id, userId);
	}

	async findById(id: number): Promise<Account | null> {
		return this.repository.findById(id);
	}
}
