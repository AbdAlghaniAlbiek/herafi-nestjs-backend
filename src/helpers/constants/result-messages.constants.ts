import { JobId } from 'bull';
import { CRUD } from './crud.contants';

export class CrudResultMessages {
	public static successCRUD(
		entityInfo: string,
		crud: CRUD,
		additionalInfo: string = ''
	): string {
		return additionalInfo
			? `${entityInfo} has been ${crud}d successfully > Additional info: ${additionalInfo}`
			: `${entityInfo} has been ${crud}d successfully`;
	}

	public static failedCRUD(
		entityInfo: string,
		crud: CRUD,
		additionalInfo: string = ''
	): string {
		return additionalInfo
			? `Fortunatlly ${entityInfo} hasn't been ${crud}d > Additional info: ${additionalInfo}`
			: `Fortunatlly ${entityInfo} hasn't been ${crud}d`;
	}

	public static itemNotFound(
		entityInfo: string,
		additionalInfo: string = ''
	): string {
		return additionalInfo
			? `${entityInfo} not found > Additional info: ${additionalInfo}`
			: `${entityInfo} not found `;
	}

	public static errorOccursWhenQueryingDb(additionalInfo: string = '') {
		return `Error occurs when making query on db > Additional info: ${additionalInfo}`;
	}
}

export class AuthResultMessages {
	public static personsAlreadyExist(email: string): string {
		return `Person with email: ${email} is already exist, please register with another email`;
	}

	public static unauthorizedUser() {
		return 'Unauthorized user';
	}

	public static forbiddenAccessOnThisResource(): string {
		return 'Forbidden access on this resource';
	}

	public static emailOrPasswordIsIncorrect() {
		return 'Email or password is incorrect';
	}
}

export class EmailResultMessages {
	public static emailSendingFailed(
		emailSendedTo: string,
		additionalInfo: string = ''
	) {
		return additionalInfo
			? `Sending email to:<${emailSendedTo}> has been failed > Additional info: ${additionalInfo}`
			: `Sending email to:<${emailSendedTo}> has been failed`;
	}

	public static emailSendingSuccess(
		emailSendedTo: string,
		additionalInfo: string = ''
	) {
		return additionalInfo
			? `Sending email to:<${emailSendedTo}> is sended successfuly > Additional info: ${additionalInfo}`
			: `Sending email to:<${emailSendedTo}> is sended successfuly`;
	}
}

export class QueueResuleMessages {
	public static queueAdditionJobSucceeded(
		queueName: string,
		additionalInfo: string = ''
	) {
		return additionalInfo
			? `Job has been added to queue: ${queueName} successfuly > Additional info: ${additionalInfo}`
			: `Job has been added to queue: ${queueName} successfuly`;
	}

	public static queueAdditionJobFailed(
		queueName: string,
		additionalInfo: string = ''
	) {
		return additionalInfo
			? `Job has been failed to add to queue: ${queueName} > Additional info: ${additionalInfo}`
			: `Job has been failed to add to queue: ${queueName}`;
	}
}

export class ProcessorsResultMessages {
	public static jobRunning(
		jobId: JobId | undefined = undefined,
		jobName: string | undefined = undefined,
		jobData: any | undefined = undefined
	) {
		return `Processor:@OnQueueActive - Processing job ${jobId} of type ${jobName}. Data: ${JSON.stringify(
			jobData
		)}`;
	}

	public static jobCompleted(
		jobId: JobId | undefined = undefined,
		jobName: string | undefined = undefined
	) {
		return `Processor:@OnQueueCompleted - Completed job ${jobId} of type ${jobName}.`;
	}

	public static jobFailed(
		jobId: JobId | undefined = undefined,
		jobName: string | undefined = undefined,
		jobError: any
	) {
		return `Processor:@OnQueueFailed - Failed job ${jobId} of type ${jobName}: ${jobError}`;
	}
}

export class HashCryptoResultMessage {
	public static generateSaltError(errorDetails: any) {
		return `Error caused when it generate salt for hashing | Details: ${errorDetails}`;
	}

	public static hashDataError(errorDetails: any) {
		return `Error caused when make hashing for plain text | Details: ${errorDetails}`;
	}

	public static comparePlainCipherError(errorDetails: any) {
		return `\nError caused when compare hash to palin text | Details: ${errorDetails}`;
	}
}

export class AesCryptoResultMessage {
	public static encryptionError(errorDetails: any) {
		return `Error caused when make Encryption for plain text | Details: ${errorDetails}`;
	}

	public static decryptionError(errorDetails: any) {
		return `Error caused when make Decryption for plain text | Details: ${errorDetails}`;
	}
}
