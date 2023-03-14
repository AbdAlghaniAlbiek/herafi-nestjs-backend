import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
	IsEmail,
	IsStrongPassword,
	IsPhoneNumber,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
	MaxLength,
	IsEnum
} from 'class-validator';
import { PersonRole } from 'src/data/entities/constants/person-role.constants';
import { AutoMappedApiProperty } from 'src/helpers/decorators/swagger.decorator';

export class AuthPerson {
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

export class CreatePersonDto {
	@IsNotEmpty()
	@IsEmail({ domain_specific_validation: true })
	@AutoMappedApiProperty()
	public email: string;

	@Exclude()
	@IsNotEmpty()
	@IsStrongPassword({
		minLength: 12,
		minUppercase: 3,
		minLowercase: 3,
		minNumbers: 3,
		minSymbols: 3
	})
	@AutoMappedApiProperty()
	public password: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(30)
	@AutoMappedApiProperty()
	public firstName: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(30)
	@AutoMappedApiProperty()
	public lastName: string;

	@IsNotEmpty()
	@IsPhoneNumber('SY')
	@AutoMappedApiProperty()
	public phoneNumber: string;

	@IsNotEmpty()
	@IsString()
	@AutoMappedApiProperty()
	public identityNumber: string;

	@IsOptional()
	@IsString()
	@AutoMappedApiProperty()
	public fingerprintId: string;

	@IsEnum(PersonRole)
	@AutoMappedApiProperty()
	public personRole: PersonRole;
}

export class UpdatePersonDto extends PartialType(CreatePersonDto) {}
