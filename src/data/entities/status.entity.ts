import {
	AutoMappedColumn,
	AutoMappedPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, OneToMany } from 'typeorm';
import { RequestStatus } from './constants/request-status.constants';
import { Request } from './request.entity';

@Entity()
export class Status {
	@AutoMappedPrimaryGeneratedColumn()
	public id: number;

	@AutoMappedColumn({
		enum: RequestStatus,
		enumName: 'request_status',
		default: RequestStatus.Request
	})
	public requestStatus: RequestStatus;

	@OneToMany(() => Request, (request) => request.status, {
		onDelete: 'NO ACTION',
		nullable: true
	})
	public requests: Request[];
}
