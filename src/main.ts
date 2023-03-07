import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './helpers/security/errors/exception-filter';
import {
	BadRequestException,
	ValidationError,
	ValidationPipe,
	VersioningType,
	VERSION_NEUTRAL
} from '@nestjs/common';
import { TimeoutInterceptor } from './helpers/increptors/timeout.increptor';
import helmet from 'helmet';
import * as csurf from 'csurf';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerDocuments } from './helpers/documents/swagger.document';
import { NodeConfig } from './configurations/config.interfaces';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		snapshot: true,
		logger: console
	});

	// Global Enhancers
	app.setGlobalPrefix('api');
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalPipes(
		new ValidationPipe({
			// validateCustomDecorators: true,
			// transform: true,  The best way is to use the common pipes like: parseIntPipe, parseBooleanPipe
			whitelist: true,
			forbidNonWhitelisted: true,
			stopAtFirstError: true,
			validateCustomDecorators: true,
			exceptionFactory: (validationErrors: ValidationError[] = []) => {
				return new BadRequestException(`${validationErrors}`);
			}
		})
	);
	app.useGlobalInterceptors(new TimeoutInterceptor());

	// Versioning of application
	app.enableVersioning({
		type: VersioningType.HEADER,
		header: 'Version',
		defaultVersion: VERSION_NEUTRAL
	});

	// Security stuff
	app.use(helmet());
	app.use(csurf());
	app.enableCors();

	// Serve static assets
	app.useStaticAssets(join(__dirname, 'public'));

	// Swagger setup
	SwaggerModule.setup(
		'common',
		app,
		SwaggerDocuments.commonSwaggerDocument(app),
		{ useGlobalPrefix: true }
	);
	SwaggerModule.setup(
		'admin',
		app,
		SwaggerDocuments.adminSwaggerDocument(app),
		{ useGlobalPrefix: true }
	);
	SwaggerModule.setup(
		'user',
		app,
		SwaggerDocuments.userSwaggerDocument(app),
		{ useGlobalPrefix: true }
	);
	SwaggerModule.setup(
		'craftman',
		app,
		SwaggerDocuments.craftmanSwaggerDocument(app),
		{ useGlobalPrefix: true }
	);

	await app.listen(app.get(ConfigService<NodeConfig>).get('PORT'));

	// $ npx @compodoc/compodoc -p tsconfig.json -s  Run this Cli comman in the end of project
}

bootstrap();
