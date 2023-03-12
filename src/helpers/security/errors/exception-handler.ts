import { HttpException } from '@nestjs/common';

export function exceptionHandler(err: any) {
	if (err instanceof HttpException) [];
}
