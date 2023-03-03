import envFilePath from '../helpers/env-resolver/env-path-resolver';
import { resolve } from 'path';

envFilePath(resolve(process.cwd(), '.env'));

function nodeConfig() {
	return {
		NODE_ENV: process.env.NODE_ENV,
		PORT: parseInt(<string>process.env.PORT, 10)
	};
}

function aesConfig() {
	return {
		KEY: process.env.AES_KEY?.toString(),
		IV: process.env.AES_IV?.toString()
	};
}

function hashConfig() {
	return {
		SALT: parseInt(<string>process.env.HASH_SALT, 10)
	};
}

function jwtConfig() {
	return {
		ALGORITHM: process.env.JWT_ALGORITHM,
		ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
		REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
		NO_TIMESTAMP: Boolean(process.env.JWT_NO_TIMESTAMP),
		KEY_ID: parseInt(<string>process.env.JWT_KEY_ID, 10),
		AUDIENCE: process.env.JWT_AUDIENCE,
		ISSUER: process.env.JWT_ISSUER,
		JWT_ID: process.env.JWT_ID?.toString(),
		PUBLIC_KEY: process.env.JWT_PUBLIC_KEY.toString(),
		PRIVATE_KEY: process.env.JWT_PRIVATE_KEY.toString()
	};
}

function pgConfig() {
	return {
		PG_HOST: process.env.PG_HOST,
		PG_USER: process.env.PG_USER,
		PG_PASSWORD: process.env.PG_PASSWORD,
		PG_PORT: process.env.PG_PORT,
		PG_DB_NAME: process.env.PG_DB_NAME,
		PG_CONNNECTION_STRING: process.env.PG_CONNNECTION_STRING
	};
}

function mailConfig() {
	return {
		HOST: process.env.MAIL_HOST,
		PORT: process.env.MAIL_PORT,
		IS_SECURE: Boolean(process.env.MAIL_IS_SECURE),
		AUTH_USER: process.env.MAIL_AUTH_USER,
		AUTH_PASSWORD: process.env.MAIL_AUTH_PASSWORD
	};
}

export { nodeConfig, aesConfig, hashConfig, jwtConfig, pgConfig, mailConfig };
