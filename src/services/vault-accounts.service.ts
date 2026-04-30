import { VaultAccountsRepository } from '../repositories/vault-accounts.repository';
import { Account } from '../db/schema';
import { IMAGE_API_URL, IMAGE_API_TOKEN } from '../config/index';
import { Bindings } from '../types';

export class VaultAccountsService {
	private repository: VaultAccountsRepository;

	constructor(database: Bindings['vault_db']) {
		this.repository = new VaultAccountsRepository(database);
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

	async uploadImage(image: File): Promise<any> {
		const formData = new FormData();
		formData.append('file', image);
		formData.append('token', IMAGE_API_TOKEN);
		const result = await fetch(`${IMAGE_API_URL}/upload`, {
			method: 'POST',
			body: formData,
		});
		return result.json();
	}

	async deleteImage(url: string): Promise<any> {
		const formData = new FormData();
		formData.append('urls', url);
		formData.append('token', IMAGE_API_TOKEN);
		const result = await fetch(`${IMAGE_API_URL}/delete`, {
			method: 'POST',
			body: formData,
		});
		return result.json();
	}
}
