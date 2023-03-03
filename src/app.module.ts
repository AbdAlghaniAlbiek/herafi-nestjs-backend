import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import {
	ClassSerializerInterceptor,
	Module,
	ValidationPipe
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
	APP_FILTER,
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
	pgConfig
} from './configurations/config.env';
import { PostgresConfig } from './configurations/config.interfaces';
import { HttpExceptionFilter } from './helpers/errors/exception-filter';
import { TimeoutInterceptor } from './helpers/increptors/timeout.increptor';
import { CoreModule } from './services/core.module';
import { NodeSetupConfig } from './services/config/node-setup.config';
import { postgresDbSource } from 'src/data/data-source/postgres-db-source';

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
				pgConfig
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
			strategyInitializer: classes()
		}),
		CoreModule
		// RouterModule.register([
		// 	{
		// 		path: 'admin',
		// 		module: adminDesktopModule
		// 	},
		// 	{
		// 		path: 'craftman',
		// 		module: craftmanMobileModule
		// 	},
		// 	{
		// 		path: 'user',
		// 		module: userMobileModule
		// 	}
		// ])
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter
		},
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
