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
import { AutoMapApiProperty } from 'src/helpers/decorators/swagger.decorator';

export class AuthPerson {
	@IsEmail({ domain_specific_validation: true })
	@IsNotEmpty()
	@AutoMapApiProperty()
	public email: string;

	@IsStrongPassword({
		minLength: 12,
		minLowercase: 3,
		minNumbers: 3,
		minSymbols: 3,
		minUppercase: 3
	})
	@IsNotEmpty()
	@AutoMapApiProperty()
	public password: string;
}

export class CreatePersonDto {
	@IsNotEmpty()
	@IsEmail({ domain_specific_validation: true })
	@AutoMapApiProperty()
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
	@AutoMapApiProperty()
	public password: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(30)
	@AutoMapApiProperty()
	public firstName: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(30)
	@AutoMapApiProperty()
	public lastName: string;

	@IsNotEmpty()
	@IsPhoneNumber('SY')
	@AutoMapApiProperty()
	public phoneNumber: string;

	@IsNotEmpty()
	@IsString()
	@AutoMapApiProperty()
	public identityNumber: string;

	@IsOptional()
	@IsString()
	@AutoMapApiProperty()
	public fingerprintId: string;

	@IsEnum(PersonRole)
	@AutoMapApiProperty()
	public personRole: PersonRole;
}

export class UpdatePersonDto extends PartialType(CreatePersonDto) {}
