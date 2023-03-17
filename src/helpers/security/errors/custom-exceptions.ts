export class ValidationExcetion extends Error {
	constructor(
		public name: string,
		public message: string,
		public stack?: string
	) {
		super(message);

		// capturing the stack trace keeps the reference to your error class
		Error.captureStackTrace(this, this.constructor);
	}
}

export class MappingExcetion extends Error {
	constructor(
		public name: string,
		public message: string,
		public stack?: string
	) {
		super(message);

		// capturing the stack trace keeps the reference to your error class
		Error.captureStackTrace(this, this.constructor);
	}
}

export class TypeOrmException extends Error {
	constructor(
		public name: string,
		public message: string,
		public stack?: string
	) {
		super(message);

		// capturing the stack trace keeps the reference to your error class
		Error.captureStackTrace(this, this.constructor);
	}
}

export class CryptographyException extends Error {
	constructor(
		public name: string,
		public message: string,
		public stack?: string
	) {
		super(message);

		// capturing the stack trace keeps the reference to your error class
		Error.captureStackTrace(this, this.constructor);
	}
}
