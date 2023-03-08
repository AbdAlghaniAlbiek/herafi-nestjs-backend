import { CRUD } from './crud.contants';

export class ResultMessages {
	public static itemNotFound(
		entityInfo: string,
		additionalInfo: string
	): string {
		return additionalInfo
			? `${entityInfo} not found`
			: `${entityInfo} not found > Additional info: ${additionalInfo}`;
	}

	public static successCRUD(
		entityInfo: string,
		crud: CRUD,
		additionalInfo: string
	): string {
		return additionalInfo
			? `${entityInfo} has been ${crud}d successfully`
			: `${entityInfo} has been ${crud}d successfully > Additional info: ${additionalInfo}`;
	}

	public static failedCRUD(
		entityInfo: string,
		crud: CRUD,
		additionalInfo: string
	): string {
		return additionalInfo
			? `Fortunatlly ${entityInfo} hasn't been ${crud}d`
			: `Fortunatlly ${entityInfo} hasn't been ${crud}d > Additional info: ${additionalInfo}`;
	}

	public static userIsAlreadyExist(): string {
		return 'User is already exist';
	}

	public static unauthorizedUser() {
		return 'Unauthorized user';
	}

	public static forbiddenAccessOnThisResource(): string {
		return 'Forbidden access on this resource';
	}

	public static errorOccursWhenQueryDb(additionalInfo: string) {
		return `Error occurs when query db > Additional info: ${additionalInfo}`;
	}

	public static passwordIsIncorrect() {
		return 'password is incorrect';
	}

	public static EmailSendingFailed(additionalInfo: string) {
		return `Error in sending email to user > Additional info: ${additionalInfo}`;
	}

	public static EmailSendingSuccess(additionalInfo: string) {
		return `Email is sended successfuly > Additional info: ${additionalInfo}`;
	}

	public static QueueAddingJobFailed(additionalInfo: string) {
		return `Error in sending email > Additional info: ${additionalInfo}`;
	}
}
