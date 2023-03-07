import { Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from 'src/data/entities/person.entity';
import { Repository } from 'typeorm';
import { TokenExpiredError } from 'jsonwebtoken';
import {
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common/exceptions';
import { AuthRepo } from 'src/data/repositories/controllers-repos/common-repos/auth.repo';
import { ResultMessages } from 'src/helpers/constants/result-messages.constants';
import { AESCryptography } from '../cryptography/aes.crypto';

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard('jwt-refresh') {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>,
		private authRepo: AuthRepo,
		private aesService: AESCryptography
	) {
		super();
	}

	private refreshToken: string;

	canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		if (req.user.isAuth) return true;

		this.personRepo
			.findOneBy({ id: req.user['sub'] })
			.then((person) => {
				req.headers['Authorization'] = this.aesService.decryption(
					person.refreshToken
				);
				return super.canActivate(context);
			})
			.catch((err) => {
				throw new InternalServerErrorException(`${err}`);
			});
	}

	handleRequest(err, user, info: Error) {
		if (info instanceof TokenExpiredError) {
			throw new UnauthorizedException(ResultMessages.unauthorizedUser());
		}

		this.authRepo.updateRefreshToken(user['sub'], user.refreshToken);

		return user;
	}
}
