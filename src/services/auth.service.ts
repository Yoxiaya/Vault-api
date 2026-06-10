import { AuthRepository } from '../repositories/auth.repositories';
import { EmailCodeService } from './email-code.service';
import { Bindings, LoginInfo, RegisterUser } from '../types';
import { AppError } from '../utils';

export class AuthService {
	private authRepository: AuthRepository;
	private emailCodeService: EmailCodeService;
	constructor(database: Bindings['vault_db'], emailApiToken: string) {
		this.authRepository = new AuthRepository(database);
		this.emailCodeService = new EmailCodeService(database, emailApiToken);
	}
	async register(user: RegisterUser) {
		const isValid = await this.emailCodeService.verifyCode(user.email, user.code);

		if (!isValid) {
			throw new AppError('验证码无效或已过期', 400);
		}
		await this.authRepository.register(user);
	}
	async login(loginInfo: LoginInfo) {
		return await this.authRepository.login(loginInfo);
	}
}
