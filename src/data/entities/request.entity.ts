import {
	AutoMappedColumn,
	AutoMappedPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Person } from './person.entity';
import { Photo } from './photo.entity';
import { Process } from './process.entity';
import { Report } from './report.entity';
import { Status } from './status.entity';

@Entity()
export class Request {
	@AutoMappedPrimaryGeneratedColumn()
	public id: number;

	@AutoMappedColumn()
	public name: string;

	@AutoMappedColumn()
	public comment: string;

	@AutoMappedColumn()
	public personId: number;

	@AutoMappedColumn()
	public personDealedWithId: number;

	@AutoMappedColumn()
	public statusId: number;

	@AutoMappedColumn()
	public processId: number;

	@AutoMappedColumn()
	public userCode: number;

	@AutoMappedColumn()
	public craftmanCode: number;

	@AutoMappedColumn()
	public totalCost: number;

	@AutoMappedColumn()
	public startDate: Date;

	@AutoMappedColumn()
	public endDate: Date;

	@AutoMappedColumn()
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
