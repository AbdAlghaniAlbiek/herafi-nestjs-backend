import {
	AutoMapColumn,
	AutoMapPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Person } from './person.entity';
import { Photo } from './photo.entity';
import { Process } from './process.entity';
import { Report } from './report.entity';
import { Status } from './status.entity';

@Entity()
export class Request {
	@AutoMapPrimaryGeneratedColumn()
	public id: number;

	@AutoMapColumn()
	public name: string;

	@AutoMapColumn()
	public comment: string;

	@AutoMapColumn()
	public personId: number;

	@AutoMapColumn()
	public personDealedWithId: number;

	@AutoMapColumn()
	public statusId: number;

	@AutoMapColumn()
	public processId: number;

	@AutoMapColumn()
	public userCode: number;

	@AutoMapColumn()
	public craftmanCode: number;

	@AutoMapColumn()
	public totalCost: number;

	@AutoMapColumn()
	public startDate: Date;

	@AutoMapColumn()
	public endDate: Date;

	@AutoMapColumn()
	public totalRate: number;

	@OneToMany(() => Photo, (photo) => photo.request, {
		cascade: true,
		eager: true,
		onDelete: 'CASCADE',
		nullable: true
	})
	public photos: Photo[];

	@OneToOne(() => Report, (report) => report.request, {
		cascade: true,
		onDelete: 'CASCADE',
		eager: true,
		nullable: true
	})
	public report: Report;

	@ManyToOne(() => Person, (person) => person.requests)
	@JoinColumn({
		name: 'person_id',
		referencedColumnName: 'id'
	})
	public person: Person;

	@ManyToOne(() => Status, (status) => status.requests, {
		eager: true
	})
	@JoinColumn({
		name: 'status_id',
		referencedColumnName: 'id'
	})
	public status: Status;

	@ManyToOne(() => Process, (process) => process.requests, {
		eager: true
	})
	@JoinColumn({
		name: 'process_id',
		referencedColumnName: 'id'
	})
	public process: Process;
}
