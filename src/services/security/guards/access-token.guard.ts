import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard('jwt') {
	handleRequest(err, user, info: Error) {
		if (info instanceof TokenExpiredError) {
			user.isAuth = false;
			return user;
		}
		user.isAuth = true;
		return user;
	}
}
