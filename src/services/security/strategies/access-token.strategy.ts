import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/data/types/jwt.type';
import { StrategiesSpecifics } from 'src/helpers/constants/strategies-specifics.constants';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
	Strategy,
	StrategiesSpecifics.AccessToken
) {
	constructor(
		publickKey: string,
		issuer: string,
		audience: string,
		algorithm: string,
		jwtid
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: publickKey,
			ignoreExpiration: false,
			algorithms: [algorithm],
			audience,
			issuer,
			jwtid
		});
	}

	validate(payload: JwtPayload) {
		return payload;
	}
}
