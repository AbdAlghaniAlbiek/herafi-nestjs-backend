import { CRUD } from './crud.contants';

export class ResultMessages {
	public static itemNotFound(
		entityInfo: string,
		completeInfo: string
	): string {
		return completeInfo
			? `${entityInfo} not found`
			: `${entityInfo} not found > Complete info: ${completeInfo}`;
	}

	public static successCRUD(
		entityInfo: string,
		crud: CRUD,
		completeInfo: string
	): string {
		return completeInfo
			? `${entityInfo} has been ${crud}d successfully`
			: `${entityInfo} has been ${crud}d successfully > Complete info: ${completeInfo}`;
	}

	public static failedCRUD(
		entityInfo: string,
		crud: CRUD,
		completeInfo: string
	): string {
		return completeInfo
			? `Fortunatlly ${entityInfo} hasn't been ${crud}d`
			: `Fortunatlly ${entityInfo} hasn't been ${crud}d > Complete info: ${completeInfo}`;
	}

	public static UserIsAlreadyExist(): string {
		return 'User is already exist';
	}

	public static ForbiddenAccessOnThisResource(): string {
		return 'Forbidden access on this resource';
	}
}
