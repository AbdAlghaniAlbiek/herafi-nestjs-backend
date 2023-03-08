import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthPerson } from 'src/data/dtos/common-dtos/requests/auth-request.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreatePersonDto } from 'src/data/dtos/common-dtos/requests/person.dto';
import { HashCryptography } from '../../../../services/security/cryptography/hash.crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from 'src/data/entities/person.entity';
import { Repository } from 'typeorm';
import { JwtConfig } from 'src/configurations/config.interfaces';
import { ResultMessages } from 'src/helpers/constants/result-messages.constants';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CRUD } from 'src/helpers/constants/crud.contants';
import { AESCryptography } from '../../../../services/security/cryptography/aes.crypto';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { MailQueueProducer } from 'src/services/enhancers/queues/producers/mail.producer';

@Injectable()
export class AuthRepo {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>,
		private jwtService: JwtService,
		private hashService: HashCryptography,
		private aesService: AESCryptography,
		private configService: ConfigService<JwtConfig>,
		private mailQueueProducer: MailQueueProducer,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	async signUp(createPerson: CreatePersonDto): Promise<string> {
		try {
			// Check if user exists
			const userExists = await this.personRepo.findOneBy({
				email: createPerson.email
			});

			if (userExists) {
				throw new BadRequestException(
					ResultMessages.userIsAlreadyExist()
				);
			}

			// Make Hashed password for the person
			createPerson.password = await this.hashData(createPerson.password);
			createPerson.verifyCode = await this.getRandomVerificationCode();

			// Mapping from createPerons dto to Person entity
			const person = await this.mapper.mapAsync(
				createPerson,
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

			await this.mailQueueProducer.sendMailConfirmation({
				to: newPerson.email,
				subject: 'Confirmaion email form Herafi team',
				text: `This email confirms that you are successfuly registered in Herafi system, last step is to copy this veriy code to ensure that your account is verified \n\n Verify code: ${person.verifyCode}`,
				html: ''
			});
			return accessToken;
		} catch (err) {
			throw new InternalServerErrorException(
				ResultMessages.failedCRUD(
					`Person with email: ${createPerson.email}`,
					CRUD.create,
					`${err}`
				)
			);
		}
	}

	async verifAccount(personId: number, verifyCode: string) {
		try {
			const person = this.personRepo.findOneBy({
				id: personId,
				verifyCode
			});
			if (!person)
				throw new BadRequestException(
					ResultMessages.itemNotFound(
						`Person with id: ${personId}`,
						''
					)
				);

			await this.personRepo.update(
				{ id: personId },
				{ verifyCode: null }
			);
			return ResultMessages.successCRUD(
				`Person with id: ${personId}`,
				CRUD.Update,
				''
			);
		} catch (err) {
			throw new InternalServerErrorException(
				ResultMessages.failedCRUD(
					`Person with id: ${personId}`,
					CRUD.Update,
					`${err}`
				)
			);
		}
	}

	async signIn(data: AuthPerson): Promise<string> {
		try {
			// Check if person exists
			const person = await this.personRepo.findOneBy({
				email: data.email
			});
			if (!person)
				throw new BadRequestException(
					ResultMessages.itemNotFound('Person', '')
				);

			/* Compare if the sended password from person is actually equally to his registered hashed password in db */
			const passwordMatches = this.verifyPlainAndHashedData(
				data.password,
				person.password
			);
			if (!passwordMatches)
				throw new BadRequestException(
					ResultMessages.passwordIsIncorrect()
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
				ResultMessages.failedCRUD(
					`Person with email: `,
					CRUD.Update,
					`${err}`
				)
			);
		}
	}

	// Note: when you use Mongo db you must convert "personId" type to "string"
	async logout(personId: number): Promise<string> {
		try {
			await this.personRepo.update(personId, { refreshToken: null });

			return ResultMessages.successCRUD(
				`Person with: ${personId}`,
				CRUD.Update,
				''
			);
		} catch (err) {
			throw new InternalServerErrorException(
				ResultMessages.failedCRUD(
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
			await this.personRepo.update(personId, {
				refreshToken: encryptedRefreshToken
			});

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

	getRandomVerificationCode() {
		const min = Math.ceil(100000);
		const max = Math.floor(900000);
		return Math.floor(Math.random() * (max - min) + min).toString(); // The maximum is exclusive and the minimum is inclusive
	}
}
