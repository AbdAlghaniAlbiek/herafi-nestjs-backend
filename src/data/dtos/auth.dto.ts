import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { AutoMappedApiProperty } from 'src/helpers/decorators/swagger.decorator';

export class AuthUser {
	@IsEmail({ domain_specific_validation: true })
	@IsNotEmpty()
	@AutoMappedApiProperty()
	public email: string;

	@IsStrongPassword({
		minLength: 12,
		minLowercase: 3,
		minNumbers: 3,
		minSymbols: 3,
		minUppercase: 3
	})
	@IsNotEmpty()
	@AutoMappedApiProperty()
	public password: string;
}
