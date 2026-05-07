import { Profile } from '../db/schema';
import { ProfileRepository } from '../repositories/profile.repositories';
import { Bindings } from '../types';

export class ProfileService {
	private profileRepository: ProfileRepository;
	constructor(database: Bindings['vault_db']) {
		this.profileRepository = new ProfileRepository(database);
	}

	async getProfile(userId: number) {
		return await this.profileRepository.getProfile(userId);
	}
	async updateProfile(userId: number, profile: Partial<Profile>) {
		await this.profileRepository.updateProfile(userId, profile);
	}
}
