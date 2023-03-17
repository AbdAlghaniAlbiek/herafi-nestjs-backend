import {
	AutoMapColumn,
	AutoMapPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Person } from './person.entity';
import { Request } from './request.entity';

@Entity()
export class Report {
	@AutoMapPrimaryGeneratedColumn()
	public id: number;

	@AutoMapColumn()
	public peronsId: number;

	@AutoMapColumn()
	public personReportedOnId: number;

	@AutoMapColumn()
	public requestId: number;

	@AutoMapColumn()
	public title: string;

	@AutoMapColumn()
	public context: string;

	@AutoMapColumn()
	public speed: number;

	@AutoMapColumn()
	public dealing: number;

	@AutoMapColumn()
	public price: number;

	@AutoMapColumn()
	public lates: number;

	@ManyToOne(() => Person, (person) => person.reports)
	@JoinColumn({
		name: 'person_id',
		referencedColumnName: 'id'
	})
	public person: Person;

	@OneToOne(() => Request, (request) => request.report)
	@JoinColumn({
		name: 'request_id',
		referencedColumnName: 'id'
	})
	public request: Request;
}
