import { CRUD } from './crud.contants';

export class ResultMessages {
	public static itemNotFound(info: string): string {
		return `${info} not found`;
	}

	public static successCRUD(info: string, crud: CRUD): string {
		return `${info} has been ${crud}d successfully`;
	}

	public static failedCRUD(info: string, crud: CRUD): string {
		return `${info} hasn't been ${crud}d`;
	}

	public static UserIsAlreadyExist(): string {
		return 'User is already exist';
	}

	public static ForbiddenAccessOnThisResource(): string {
		return 'Forbidden access on this resource';
	}
}
