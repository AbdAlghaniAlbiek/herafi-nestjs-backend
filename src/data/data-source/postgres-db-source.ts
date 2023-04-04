import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConfig } from 'src/configurations/config.interfaces';

export function HerafiDbSource(
	postgresConfig: ConfigService<PostgresConfig>
): TypeOrmModuleOptions {
	return {
		type: 'postgres',
		host: postgresConfig.get('PG_HOST'),
		port: postgresConfig.get('PG_PORT'),
		username: postgresConfig.get('PG_USER'),
		password: postgresConfig.get('PG_PASSWORD'),
		database: postgresConfig.get('PG_DB_NAME')
	};
}
