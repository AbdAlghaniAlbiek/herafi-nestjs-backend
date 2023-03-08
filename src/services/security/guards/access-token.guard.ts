import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { StrategiesSpecifics } from 'src/helpers/constants/strategies-specifics.constants';

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard(
	StrategiesSpecifics.AccessToken
) {
	handleRequest(err, user, info: Error) {
		if (info instanceof TokenExpiredError) {
			user.isAuth = false;
			return user;
		}
		user.isAuth = true;
		return user;
	}
}
