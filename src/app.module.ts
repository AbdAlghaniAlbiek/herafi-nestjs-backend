import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import {
	CacheModule,
	ClassSerializerInterceptor,
	Module,
	ValidationPipe
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
	APP_GUARD,
	APP_INTERCEPTOR,
	APP_PIPE,
	RouterModule
} from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
	aesConfig,
	hashConfig,
	jwtConfig,
	mailConfig,
	nodeConfig,
	pgConfig,
	redisConfig
} from './configurations/config.env';
import {
	PostgresConfig,
	RedisConfig
} from './configurations/config.interfaces';
import { TimeoutInterceptor } from './helpers/increptors/timeout.increptor';
import { CoreServicesModule } from './services/core-services.module';
import { NodeSetupConfig } from './services/config/node-setup.config';
import { postgresDbSource } from 'src/data/data-source/postgres-db-source';

import { AdminDesktopModule } from './apps/admin-desktop/admin-desktop.module';
import { CraftmanMobileModule } from './apps/craftman-mobile/craftman-mobile.module';
import { UserMobileModule } from './apps/user-mobile/user-mobile.module';
import { CommonControllersModule } from './apps/common/common-controllers.module';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MappingExcetion } from './helpers/security/errors/custom-exceptions';

@Module({
	imports: [
		ConfigModule.forRoot({
			expandVariables: true,
			isGlobal: true,
			cache: true,
			load: [
				aesConfig,
				hashConfig,
				jwtConfig,
				mailConfig,
				nodeConfig,
				pgConfig,
				redisConfig
			]
		}),
		TypeOrmModule.forRootAsync({
			name: 'herafi_pgConnection',
			useFactory: (
				postgresConfig: ConfigService<PostgresConfig>,
				nodeSetupConfig: NodeSetupConfig
			) => postgresDbSource(postgresConfig, nodeSetupConfig),
			dataSourceFactory: async (options) => {
				const dataSource = await new DataSource(options).initialize();
				return dataSource;
			},
			inject: [ConfigService, NodeSetupConfig]
		}),
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 10
		}),
		AutomapperModule.forRoot({
			strategyInitializer: classes(),
			errorHandler: {
				handle: (error) => {
					throw new MappingExcetion(
						MappingExcetion.name,
						`${error.toString()}`
					);
				}
			}
		}),
		BullModule.forRootAsync({
			useFactory: (redisConfig: ConfigService<RedisConfig>) => ({
				redis: {
					host: redisConfig.get('HOST'),
					port: redisConfig.get('PORT')
				}
			}),
			inject: [ConfigService]
		}),
		ScheduleModule.forRoot(),
		CacheModule.registerAsync({
			useFactory: (redisConfig: ConfigService<RedisConfig>) =>
				<RedisClientOptions>{
					isGlobal: true,
					store: redisStore,
					host: redisConfig.get('HOST'),
					port: redisConfig.get('PORT')
				},
			inject: [ConfigService]
		}),
		RouterModule.register([
			{
				path: 'common',
				module: CommonControllersModule
			},
			{
				path: 'admin',
				module: AdminDesktopModule
			},
			{
				path: 'craftman',
				module: CraftmanMobileModule
			},
			{
				path: 'user',
				module: UserMobileModule
			}
		]),
		EventEmitterModule.forRoot({ global: true }),
		CoreServicesModule
	],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ValidationPipe
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TimeoutInterceptor
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
