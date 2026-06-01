import { AuthRepository } from '../repositories/auth.repositories';
import { EmailCodeService } from './email-code.service';
import { Bindings, LoginInfo, RegisterUser } from '../types';

export class AuthService {
	private authRepository: AuthRepository;
	private emailCodeService: EmailCodeService;
	constructor(database: Bindings['vault_db']) {
		this.authRepository = new AuthRepository(database);
		this.emailCodeService = new EmailCodeService(database);
	}
	async register(user: RegisterUser) {
		const isValid = await this.emailCodeService.verifyCode(user.email, user.code);

		if (!isValid) {
			throw new Error('验证码无效或已过期');
		}
		await this.authRepository.register(user);
	}
	async login(loginInfo: LoginInfo) {
		return await this.authRepository.login(loginInfo);
	}
}
