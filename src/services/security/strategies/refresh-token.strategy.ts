import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh'
) {
	constructor(
		privateKey: string,
		issuer: string,
		audience: string,
		algorithm: string,
		jwtid
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			passReqToCallback: true,
			secretOrKey: privateKey,
			ignoreExpiration: false,
			algorithms: [algorithm],
			audience,
			issuer,
			jwtid
		});
	}

	validate(req: Request, payload: any) {
		const refreshToken = req
			.get('Authorization')
			.replace('Bearer', '')
			.trim();
		return { ...payload, refreshToken };
	}
}
