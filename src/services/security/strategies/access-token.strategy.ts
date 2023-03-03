import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
	id: string;
	personName: string;
	roles: string[];
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
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
