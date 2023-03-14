import {
	INestApplication,
	ValidationError,
	ValidationPipe
} from '@nestjs/common';
import { TimeoutInterceptor } from 'src/helpers/increptors/timeout.increptor';
import { ValidationExcetion } from 'src/helpers/security/errors/custom-exceptions';
import {
	AnyExceptionsFilter,
	HttpExceptionsFilter,
	ValidationExcetionsFilter
} from 'src/helpers/security/errors/exception-filter';

export function globalSetup(app: INestApplication) {
	app.setGlobalPrefix('api');

	app.useGlobalPipes(
		new ValidationPipe({
			// transform: true,  The best way is to use the common pipes like: parseIntPipe, parseBooleanPipe
			whitelist: true,
			forbidNonWhitelisted: true,
			stopAtFirstError: false,
			validateCustomDecorators: true,
			exceptionFactory: (validationErrors: ValidationError[] = []) => {
				throw new ValidationExcetion(
					ValidationExcetion.name,
					JSON.stringify(validationErrors)
				);
			}
		})
	);

	app.useGlobalFilters(
		new ValidationExcetionsFilter(),
		new AnyExceptionsFilter(),
		new HttpExceptionsFilter()
	);

	app.useGlobalInterceptors(new TimeoutInterceptor());
}
