import { AuthRepository } from '../repositories/auth.repositories';
import { Bindings, LoginInfo, RegisterUser } from '../types';

export class AuthService {
	private authRepository: AuthRepository;
	constructor(database: Bindings['vault_db']) {
		this.authRepository = new AuthRepository(database);
	}
	async register(user: RegisterUser) {
		await this.authRepository.register(user);
	}
	async login(loginInfo: LoginInfo) {
		return await this.authRepository.login(loginInfo);
	}
}
