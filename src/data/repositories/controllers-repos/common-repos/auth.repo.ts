import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePersonDto } from 'src/data/dtos/person.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthPerson } from 'src/data/dtos/auth.dto';
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
import { RepoResult } from 'src/helpers/resolvers/repo-result.resolver';
import { InternalServerErrorException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthRepo {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>,
		private jwtService: JwtService,
		private hashService: HashCryptography,
		private aesService: AESCryptography,
		private configService: ConfigService<JwtConfig>,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	async signUp(createPerson: CreatePersonDto): Promise<RepoResult<string>> {
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
			const tokens = (await this.getTokens(
				newPerson.id,
				`${newPerson.firstName} ${newPerson.lastName}`,
				[newPerson.role.personRole.toString()]
			)) as { accessToken; refreshToken };

			await this.updateRefreshToken(newPerson.id, tokens.refreshToken);
			return new RepoResult<string>(tokens.accessToken, '');
		} catch (err) {
			throw new InternalServerErrorException(
				ResultMessages.failedCRUD(
					`Person with name: ${createPerson.firstName} ${createPerson.lastName}`,
					CRUD.create,
					`${err}`
				)
			);
		}
	}

	async signIn(data: AuthPerson): Promise<RepoResult<string>> {
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

			const tokens = (await this.getTokens(
				person.id,
				`${person.firstName} ${person.lastName}`,
				[person.role.personRole.toString()]
			)) as { accessToken; refreshToken };
			await this.updateRefreshToken(person.id, tokens.refreshToken);
			return new RepoResult(tokens.accessToken, '');
		} catch (err) {
			return new RepoResult(
				null,
				ResultMessages.failedCRUD(
					`Person with email: `,
					CRUD.Update,
					`${err}`
				)
			);
		}
	}

	// Note: when you use Mongo db you must convert "personId" type to "string"
	async logout(personId: number): Promise<RepoResult<string>> {
		try {
			await this.personRepo.update(personId, { refreshToken: null });

			return new RepoResult<string>(
				ResultMessages.successCRUD(
					`Person with: ${personId}`,
					CRUD.Update,
					''
				),
				''
			);
		} catch (err) {
			return new RepoResult(
				null,
				ResultMessages.failedCRUD(
					`Person with id: ${personId}`,
					CRUD.Update,
					`${err}`
				)
			);
		}
	}

	async verifAccount(personId: number, verifyCode: string) {
		try {
			const person = this.personRepo.findOneBy({ id: personId });
			if (!person)
				throw new BadRequestException(
					ResultMessages.itemNotFound(
						`Person with id: ${personId}`,
						''
					)
				);

			await this.personRepo.update({ id: personId }, { verifyCode });
			return new RepoResult<string>(
				ResultMessages.successCRUD(
					`Person with id: ${personId}`,
					CRUD.Update,
					''
				),
				''
			);
		} catch (err) {
			return new RepoResult(
				null,
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
	async updateRefreshToken(
		personId: number,
		refreshToken: string
	): Promise<boolean> {
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
			this.jwtService.signAsync(
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
