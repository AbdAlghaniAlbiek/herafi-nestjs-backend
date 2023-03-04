import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
	IsEmail,
	IsStrongPassword,
	IsPhoneNumber,
	IsInt,
	Min,
	Max,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsNumber,
	MinLength,
	MaxLength
} from 'class-validator';
import { AutoMappedApiProperty } from 'src/helpers/decorators/swagger.decorator';
export class CreatePerson {
	@IsNotEmpty()
	@IsEmail({ domain_specific_validation: true })
	@AutoMappedApiProperty()
	public email: string;

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

	@IsNotEmpty()
	@IsPhoneNumber('SY')
	@AutoMappedApiProperty()
	public phoneNumber: string;

	@Min(1)
	@Max(10)
	@IsInt()
	@IsNotEmpty()
	@AutoMappedApiProperty()
	public sizeQueue: number;

	@IsOptional()
	@IsString()
	@AutoMappedApiProperty()
	public facebookId: string;

	@IsOptional()
	@IsString()
	@AutoMappedApiProperty()
	public microsoftId: string;

	@IsOptional()
	@IsString()
	@AutoMappedApiProperty()
	public googleId: string;

	@IsOptional()
	@IsString()
	@AutoMappedApiProperty()
	public fingerprintId: string;

	@IsOptional()
	@IsNumber()
	@AutoMappedApiProperty()
	public secureId: number;

	@IsOptional()
	@IsNumber()
	@AutoMappedApiProperty()
	public verifyCode: number;

	@IsNotEmpty()
	@IsString()
	@AutoMappedApiProperty()
	public identityNumber: string;

	@IsOptional()
	@IsNumber()
	@Min(5000)
	@AutoMappedApiProperty()
	public lowestCost: number;

	@IsOptional()
	@IsNumber()
	@Max(25000)
	@AutoMappedApiProperty()
	public highestCost: number;
}

export class UpdatePerson extends PartialType(CreatePerson) {}
