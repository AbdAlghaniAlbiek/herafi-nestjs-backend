import {
	BadRequestException,
	Injectable,
	InternalServerErrorException
} from '@nestjs/common';
import { CreatePerson } from 'src/data/dtos/person.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthUser } from 'src/data/dtos/auth.dto';
import { HashCryptography } from './cryptography/hash.crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from 'src/data/entities/person.entity';
import { Repository } from 'typeorm';
import { JwtConfig } from 'src/configurations/config.interfaces';
import { ResultMessages } from 'src/helpers/constants/result-messages.constants';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>,
		private jwtService: JwtService,
		private hashService: HashCryptography,
		private configService: ConfigService<JwtConfig>,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	async signUp(createPerson: CreatePerson): Promise<any> {
		try {
			// Check if user exists
			const userExists = await this.personRepo.findOneByOrFail({
				email: createPerson.email
			});

			if (userExists) {
				throw new BadRequestException(
					ResultMessages.UserIsAlreadyExist()
				);
			}

			// Make Hashed password for the person
			createPerson.password = await this.hashData(createPerson.password);

			// Mapping from createPerons dto to Person entity
			const person = await this.mapper.mapAsync(
				createPerson,
				CreatePerson,
				Person
			);

			// Creating user in db
			const newPerson = this.personRepo.create(person);
			await this.personRepo.save(newPerson);

			// generate specific tokens for this person
			const tokens = await this.getTokens(
				newPerson.id,
				`${newPerson.firstName} ${newPerson.lastName}`,
				[newPerson.role.personRole.toString()]
			);

			await this.updateRefreshToken(newPerson.id, tokens.refreshToken);

			return tokens;
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	async signIn(data: AuthUser) {
		// Check if person exists
		const person = await this.personRepo.findOneBy({ email: data.email });
		if (!person)
			throw new BadRequestException(ResultMessages.itemNotFound('User'));

		/* Compare if the sended password from person is actually equally to his registered hashed password in db */
		const passwordMatches = this.verifyPlainAndHashedData(
			data.password,
			person.password
		);
		if (!passwordMatches)
			throw new BadRequestException('Password is incorrect');

		const tokens = await this.getTokens(
			person.id,
			`${person.firstName} ${person.lastName}`,
			[person.role.personRole.toString()]
		);
		await this.updateRefreshToken(person.id, tokens.refreshToken);
		return tokens;
	}

	async logout(personId: string) {
		return this.personRepo.update(personId, { refreshToken: null });
	}

	async hashData(data: string) {
		return await this.hashService.hashingPlainText(data);
	}

	async verifyPlainAndHashedData(plainText: string, hashedText: string) {
		const passwordMatches = await this.hashService.comparePlainTextWithHash(
			plainText,
			hashedText
		);
		return passwordMatches;
	}

	// Note: when you use Mongo db you must convert "personId" type to "string"
	async updateRefreshToken(personId: number, refreshToken: string) {
		await this.personRepo.update(personId, {
			refreshToken
		});
	}

	// Note: when you use Mongo db you must convert "personId" type to "string"
	async getTokens(personId: number, name: string, roles: string[]) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
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
			),
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
			)
		]);

		return {
			accessToken,
			refreshToken
		};
	}
}
