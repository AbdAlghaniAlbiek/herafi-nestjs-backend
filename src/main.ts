import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './helpers/errors/exception-filter';
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

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

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

	app.enableVersioning({
		type: VersioningType.HEADER,
		header: 'Version',
		defaultVersion: VERSION_NEUTRAL
	});

	app.use(helmet());
	app.use(csurf());
	app.enableCors();

	await app.listen(app.get(ConfigService).get('PORT'));
}

bootstrap();
