import { TypeORMError } from 'typeorm';
import { MappingExcetion, TypeOrmException } from './custom-exceptions';

export function exceptionHandler(err: any, errorMessage: any) {
	if (err instanceof TypeORMError) {
		throw new TypeOrmException(err.name, errorMessage, err.stack);
	}

	throw new MappingExcetion(err.name, errorMessage, err.stack);
}
