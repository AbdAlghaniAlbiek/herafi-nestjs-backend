import {
	BadRequestException,
	HttpStatus,
	INestApplication,
	ValidationPipe
} from '@nestjs/common';
import { HttpExceptionsFilter } from 'src/helpers/security/errors/exception-filter';

export function globalSetup(app: INestApplication) {
	app.setGlobalPrefix('api');

	app.useGlobalPipes(
		new ValidationPipe({
			// transform: true,  The best way is to use the common pipes like: parseIntPipe, parseBooleanPipe
			whitelist: true,
			forbidNonWhitelisted: true,
			stopAtFirstError: false,
			errorHttpStatusCode: HttpStatus.BAD_REQUEST,
			validateCustomDecorators: true,
			exceptionFactory(errors) {
				throw new BadRequestException(JSON.stringify(errors));
			}
		})
	);

	app.useGlobalFilters(new HttpExceptionsFilter());
}
