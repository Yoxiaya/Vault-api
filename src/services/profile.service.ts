import { Profile } from '../db/schema';
import { ProfileRepository } from '../repositories/profile.repositories';
import { Bindings } from '../types';
import { deleteImage, uploadImage } from '../utils';

export class ProfileService {
	private profileRepository: ProfileRepository;
	private imageApiUrl: string;
	private imageApiToken: string;

	constructor(database: Bindings['vault_db'], imageApiUrl: string, imageApiToken: string) {
		this.profileRepository = new ProfileRepository(database);
		this.imageApiUrl = imageApiUrl;
		this.imageApiToken = imageApiToken;
	}

	async getProfile(userId: number) {
		return await this.profileRepository.getProfile(userId);
	}
	async updateProfile(userId: number, profile: Partial<Profile>) {
		await this.profileRepository.updateProfile(userId, profile);
	}
	async updateAvatar(userId: number, avatar: File) {
		const profile = await this.getProfile(userId);
		if (profile?.profileAvatar) {
			await deleteImage(profile.profileAvatar, this.imageApiUrl, this.imageApiToken);
		}
		const result = await uploadImage(avatar, this.imageApiUrl, this.imageApiToken);
		await this.updateProfile(userId, { profileAvatar: result.url });
	}
}
