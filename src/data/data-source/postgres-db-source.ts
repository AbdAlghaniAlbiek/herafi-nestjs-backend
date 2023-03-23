import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { PostgresConfig } from 'src/configurations/config.interfaces';
import { Environment } from 'src/helpers/constants/environments.constants';
import { NodeSetupConfig } from 'src/services/config/node-setup.config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export function postgresDbSource(
	postgresConfig: ConfigService<PostgresConfig>,
	nodeSetupConfig: NodeSetupConfig
): TypeOrmModuleOptions {
	return {
		type: 'postgres',
		host: postgresConfig.get('PG_HOST'),
		port: postgresConfig.get('PG_PORT'),
		username: postgresConfig.get('PG_USER'),
		password: postgresConfig.get('PG_PASSWORD'),
		database: postgresConfig.get('PG_DB_NAME'),
		// url: postgresConfig.get('PG_CONNNECTION_STRING'), Doesn't work fortunatly
		entities: [join(__dirname, '../**', '*.entity.js')],
		migrations: [join(__dirname, '..', 'migrations/*.js')],
		synchronize:
			nodeSetupConfig.getEnvironment === Environment.Development
				? true
				: false,
		logging: ['error', 'info', 'warn', 'migration', 'schema', 'log'],
		autoLoadEntities: true,
		connectTimeoutMS: 3000,
		maxQueryExecutionTime: 1000 * 60 * 1,
		migrationsRun: false,
		metadataTableName: 'metadata',
		migrationsTableName: 'migration',
		namingStrategy: new SnakeNamingStrategy(),
		applicationName: 'herafi',
		poolErrorHandler(err) {
			throw new InternalServerErrorException(`${err}`);
		},
		retryAttempts: 10,
		retryDelay: 3000
	};
}
