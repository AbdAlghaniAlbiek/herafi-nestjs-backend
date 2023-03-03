import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {
	AesConfig,
	HashingConfig,
	JwtConfig
} from 'src/configurations/config.interfaces';
// import { AuthService } from './auth.service';
import {
	AESCryptography,
	AlgorithmTypes,
	BufferEncryption,
	EncryptionEncoding,
	EncryptionMode
} from 'src/services/security/cryptography/aes.crypto';
import { HashCryptography } from 'src/services/security/cryptography/hash.crypto';
import { AccessTokenStrategy } from 'src/services/security/strategies/access-token.strategy';
import { RefreshTokenStrategy } from 'src/services/security/strategies/refresh-token.strategy';
import { AuthService } from './auth.service';

@Module({
	imports: [JwtModule.register({})],
	exports: [
		AuthService,
		AESCryptography,
		HashCryptography,
		AccessTokenStrategy,
		RefreshTokenStrategy
	],
	providers: [
		{
			provide: AESCryptography,
			useFactory: (aesConfig: ConfigService<AesConfig>) => {
				return new AESCryptography(
					AlgorithmTypes.aes256,
					BufferEncryption.base64,
					EncryptionMode.cbc,
					EncryptionEncoding.utf8,
					aesConfig.get('KEY'),
					aesConfig.get('IV')
				);
			},
			inject: [ConfigService]
		},
		{
			provide: HashCryptography,
			useFactory: (hashConfig: ConfigService<HashingConfig>) => {
				return new HashCryptography(hashConfig.get('SALT'));
			},
			inject: [ConfigService]
		},
		{
			provide: AccessTokenStrategy,
			useFactory: (jwtConfig: ConfigService<JwtConfig>) => {
				return new AccessTokenStrategy(
					jwtConfig.get('PUBLIC_KEY'),
					jwtConfig.get('ISSUER'),
					jwtConfig.get('AUDIENCE'),
					jwtConfig.get('ALGORITHM'),
					jwtConfig.get('JWT_ID')
				);
			},
			inject: [ConfigService]
		},
		{
			provide: RefreshTokenStrategy,
			useFactory: (jwtConfig: ConfigService<JwtConfig>) => {
				return new RefreshTokenStrategy(
					jwtConfig.get('PRIVATE_KEY'),
					jwtConfig.get('ISSUER'),
					jwtConfig.get('AUDIENCE'),
					jwtConfig.get('ALGORITHM'),
					jwtConfig.get('JWT_ID')
				);
			},
			inject: [ConfigService]
		}
	]
})
export class SecurityModule {}
