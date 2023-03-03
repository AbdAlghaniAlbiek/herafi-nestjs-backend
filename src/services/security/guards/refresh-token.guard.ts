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
import { AuthService } from 'src/services/security/auth.service';

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard('jwt-refresh') {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>,
		private readonly authService: AuthService
	) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		if (req.user.isAuth) return true;

		this.personRepo
			.findOneBy({ id: req.user['sub'] })
			.then((person) => {
				req.headers['Authorization'] = person.refreshToken;
				return super.canActivate(context);
			})
			.catch((err) => {
				throw new InternalServerErrorException(`${err}`);
			});
	}

	handleRequest(err, user, info: Error) {
		if (info instanceof TokenExpiredError) {
			throw new UnauthorizedException('Unauthorized user');
		}

		this.authService.updateRefreshToken(user['sub'], user.refreshToken);

		return user;
	}
}
