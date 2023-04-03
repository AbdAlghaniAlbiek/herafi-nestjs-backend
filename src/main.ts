import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { NodeConfig } from './configurations/config.interfaces';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { globalSetup as appGlobalSetup } from './setup/globals.setup';
import { securitySetup as appSecuritySetup } from './setup/security.setup';
import { appSwaggerSetup } from './setup/swagger.setup';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: console,
		bodyParser: false
	});

	// Global Enhancers
	appGlobalSetup(app);

	// Versioning of application
	app.enableVersioning({
		type: VersioningType.HEADER,
		header: 'Version',
		defaultVersion: VERSION_NEUTRAL
	});

	// Security stuff
	appSecuritySetup(app);

	// Serve static assets
	app.useStaticAssets(join(__dirname, 'assets'));

	// Swagger setup
	appSwaggerSetup(app);

	await app.listen(app.get(ConfigService<NodeConfig>).get('PORT'));

	// $ npx @compodoc/compodoc -p tsconfig.json -s  Run this Cli comman in the end of project
}

bootstrap();
