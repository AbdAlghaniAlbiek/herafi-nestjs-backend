import { Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import {
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common/exceptions';
import { AuthResultMessages } from 'src/helpers/constants/result-messages.constants';
import { AESCryptography } from '../cryptography/aes.crypto';
import { Strategies } from 'src/helpers/constants/strategies-specifics.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from 'src/data/entities/person.entity';

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard(Strategies.RefreshToken) {
	constructor(
		private aesService: AESCryptography,
		@InjectRepository(Person) private personRepo: Repository<Person>
	) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		if (req.user.isAuth) return true;

		this.personRepo
			.findOneBy({ id: req.user['sub'] })
			.then((person) => {
				req.headers['Authorization'] = this.aesService.decryption(
					person.socialProvider.refreshToken
				);
				return super.canActivate(context);
			})
			.catch((err) => {
				throw new InternalServerErrorException(`${err}`);
			});
	}

	handleRequest(err, user, info: Error) {
		if (info instanceof TokenExpiredError) {
			throw new UnauthorizedException(
				AuthResultMessages.unauthorizedUser()
			);
		}

		// For updating refreshToken in db in CompleteAuth middleware
		user.requiredRefreshToken = true;

		return user;
	}
}
