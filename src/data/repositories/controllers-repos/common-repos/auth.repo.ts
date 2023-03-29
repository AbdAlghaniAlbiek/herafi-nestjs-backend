import { BadRequestException, Injectable } from '@nestjs/common';
import {
	AuthPerson,
	CreatePersonDto
} from 'src/data/dtos/common-dtos/requests/auth-request.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HashCryptography } from '../../../../services/security/cryptography/hash.crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from 'src/data/entities/person.entity';
import { Repository } from 'typeorm';
import { JwtConfig } from 'src/configurations/config.interfaces';
import {
	AuthResultMessages,
	CrudResultMessages
} from 'src/helpers/constants/result-messages.constants';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CRUD } from 'src/helpers/constants/crud.contants';
import { AESCryptography } from '../../../../services/security/cryptography/aes.crypto';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { MailQueueProducer } from 'src/services/enhancers/queues/producers/mail.producer';
import { SocialProvider } from 'src/data/entities/social-provider.entity';

@Injectable()
export class AuthRepo {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>,
		@InjectRepository(SocialProvider)
		private socialProviderRepo: Repository<SocialProvider>,
		private jwtService: JwtService,
		private hashService: HashCryptography,
		private aesService: AESCryptography,
		private configService: ConfigService<JwtConfig>,
		private mailQueueProducer: MailQueueProducer,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	async signUp(createPersonDto: CreatePersonDto): Promise<string> {
		try {
			// Check if person exists
			const userExists = await this.personRepo.findOneBy({
				email: createPersonDto.email
			});

			if (userExists) {
				throw new BadRequestException(
					AuthResultMessages.personsAlreadyExist(
						createPersonDto.email
					)
				);
			}

			// Make Hashed password for the person
			createPersonDto.password = await this.hashData(
				createPersonDto.password
			);

			/* 
				Important Note:
				Generating verify code will be in CreatePersonDtoMapper in person profile (mapper folder)
			*/

			// Mapping from createPerons dto to Person entity
			const person = await this.mapper.mapAsync(
				createPersonDto,
				CreatePersonDto,
				Person
			);

			// Creating user in db
			const newPerson = this.personRepo.create(person);
			await this.personRepo.save(newPerson);

			// generate specific tokens for this person
			const accessToken = await this.getAccessToken(
				newPerson.id,
				`${newPerson.firstName} ${newPerson.lastName}`,
				[newPerson.role.personRole.toString()]
			);
			const refreshToken = await this.getRefreshToken(
				newPerson.id,
				`${newPerson.firstName} ${newPerson.lastName}`,
				[newPerson.role.personRole.toString()]
			);

			await this.updateRefreshToken(newPerson.id, refreshToken);

			await this.mailQueueProducer.sendMailVerification({
				to: newPerson.email,
				subject: 'Confirmaion email from Herafi team',
				text: `We Herafi team sended this email to you for completion your verification process, last step is to copy this veriy code to ensure that your account is verified \n\nVerify code: ${person.socialProvider.verifyCode}`
			});
			return accessToken;
		} catch (err) {
			throw new InternalServerErrorException(
				CrudResultMessages.failedCRUD(
					`Person with email ${createPersonDto.email}`,
					CRUD.create,
					err.message
				)
			);
		}
	}

	async verifAccount(personId: number, verifyCode: string) {
		try {
			const socialProviderPerson = this.socialProviderRepo.findOneBy({
				personId,
				verifyCode
			});
			if (!socialProviderPerson)
				throw new BadRequestException(
					CrudResultMessages.itemNotFound(
						`Person with id: ${personId}`
					)
				);

			await this.socialProviderRepo.update(
				{ personId },
				{ verifyCode: null }
			);

			await this.personRepo.update({ id: personId }, { verified: true });

			return CrudResultMessages.successCRUD(
				`Person with id: ${personId}`,
				CRUD.Update,
				''
			);
		} catch (err) {
			throw new InternalServerErrorException(
				CrudResultMessages.failedCRUD(
					`Person with id: ${personId}`,
					CRUD.Update,
					`${err}`
				)
			);
		}
	}

	async signIn(authPerson: AuthPerson): Promise<string> {
		try {
			// Check if person exists
			const person = await this.personRepo.findOneBy({
				email: authPerson.email
			});
			if (!person)
				throw new BadRequestException(
					CrudResultMessages.itemNotFound(
						`Person with email: ${authPerson.email}`
					)
				);

			/* Compare if the sended password from person is actually equally to his registered hashed password in db */
			const passwordMatches = this.verifyPlainAndHashedData(
				authPerson.password,
				person.password
			);
			if (!passwordMatches)
				throw new BadRequestException(
					AuthResultMessages.emailOrPasswordIsIncorrect()
				);

			// generate specific tokens for this person
			const accessToken = await this.getAccessToken(
				person.id,
				`${person.firstName} ${person.lastName}`,
				[person.role.personRole.toString()]
			);
			const refreshToken = await this.getRefreshToken(
				person.id,
				`${person.firstName} ${person.lastName}`,
				[person.role.personRole.toString()]
			);
			await this.updateRefreshToken(person.id, refreshToken);
			return accessToken;
		} catch (err) {
			throw new InternalServerErrorException(
				CrudResultMessages.failedCRUD(
					`Person with email: ${authPerson.email}`,
					CRUD.Update,
					`${err}`
				)
			);
		}
	}

	// Note: when you use Mongo db you must convert "personId" type to "string"
	async logout(personId: number): Promise<string> {
		try {
			const person = this.personRepo.findOneBy({ id: personId });
			if (!person) {
				throw new BadRequestException(
					CrudResultMessages.itemNotFound(
						`Person with id: ${personId}`
					)
				);
			}
			await this.socialProviderRepo.update(
				{ personId },
				{
					refreshToken: null
				}
			);

			return CrudResultMessages.successCRUD(
				`Person with: ${personId}`,
				CRUD.Update,
				''
			);
		} catch (err) {
			throw new InternalServerErrorException(
				CrudResultMessages.failedCRUD(
					`Person with id: ${personId}`,
					CRUD.Update,
					`${err}`
				)
			);
		}
	}

	async hashData(data: string): Promise<string> {
		try {
			return this.hashService.hashingPlainText(data);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	async verifyPlainAndHashedData(
		plainText: string,
		hashedText: string
	): Promise<boolean> {
		try {
			const passwordMatches =
				await this.hashService.comparePlainTextWithHash(
					plainText,
					hashedText
				);
			return passwordMatches;
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	// Note: when you use Mongo db you must convert "personId" type to "string"
	async updateRefreshToken(personId: number, refreshToken: string) {
		try {
			const encryptedRefreshToken = await this.aesService.encryption(
				refreshToken
			);
			await this.socialProviderRepo.update(
				{ personId },
				{
					refreshToken: encryptedRefreshToken
				}
			);

			return true;
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	// Note: when you use Mongo db you must convert "personId" type to "string"
	async getAccessToken(personId: number, name: string, roles: string[]) {
		try {
			return this.jwtService.signAsync(
				{
					sub: personId,
					name,
					roles
				},
				{
					secret: this.configService.get('PUBLIC_KEY'),
					expiresIn: this.configService.get(
						'ACCESS_TOKEN_EXPIRES_IN'
					),
					algorithm: this.configService.get('ALGORITHM'),
					issuer: this.configService.get('ISSUER'),
					audience: this.configService.get('AUDIENCE'),
					jwtid: this.configService.get('JWT_ID'),
					keyid: this.configService.get('KEY_ID'),
					noTimestamp: this.configService.get('NO_TIMESTAMP')
				}
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	// Note: when you use Mongo db you must convert "personId" type to "string"
	async getRefreshToken(personId: number, name: string, roles: string[]) {
		try {
			return this.jwtService.signAsync(
				{
					sub: personId,
					name,
					roles
				},
				{
					secret: this.configService.get('PRIVATE_KEY'),
					expiresIn: this.configService.get(
						'REFRESH_TOKEN_EXPIRES_IN'
					),
					algorithm: this.configService.get('ALGORITHM'),
					issuer: this.configService.get('ISSUER'),
					audience: this.configService.get('AUDIENCE'),
					jwtid: this.configService.get('JWT_ID'),
					keyid: this.configService.get('KEY_ID'),
					noTimestamp: this.configService.get('NO_TIMESTAMP')
				}
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}
}
