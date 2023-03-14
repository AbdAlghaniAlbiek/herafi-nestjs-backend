import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
	CryptographyException,
	MappingExcetion,
	TypeOrmException,
	ValidationExcetion
} from './custom-exceptions';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		response.status(status).json({
			exceptionType: exception.name,
			statusCode: status,
			message: exception.message,
			stack: exception.stack,
			timestamp: new Date().toISOString(),
			urlPath: request.url
		});
	}
}

@Catch(TypeOrmException, MappingExcetion, CryptographyException)
export class AnyExceptionsFilter implements ExceptionFilter {
	catch(
		exception: TypeOrmException | MappingExcetion | CryptographyException,
		host: ArgumentsHost
	) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = HttpStatus.INTERNAL_SERVER_ERROR;

		response.status(status).json({
			exceptionType: exception.name,
			statusCode: status,
			message: exception.message,
			stack: exception.stack,
			timestamp: new Date().toISOString(),
			urlPath: request.url
		});
	}
}

@Catch(ValidationExcetion)
export class ValidationExcetionsFilter implements ExceptionFilter {
	catch(exception: ValidationExcetion, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = HttpStatus.BAD_REQUEST;

		response.status(status).json({
			exceptionType: exception.name,
			statusCode: status,
			message: exception.message,
			stack: exception.stack,
			timestamp: new Date().toISOString(),
			urlPath: request.url
		});
	}
}
