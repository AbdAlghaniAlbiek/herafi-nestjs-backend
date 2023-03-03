import {
	AutoMappedColumn,
	AutoMappedPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Person } from './person.entity';
import { Request } from './request.entity';

@Entity()
export class Report {
	@AutoMappedPrimaryGeneratedColumn()
	public id: number;

	@AutoMappedColumn()
	public peronsId: number;

	@AutoMappedColumn()
	public personReportedOnId: number;

	@AutoMappedColumn()
	public requestId: number;

	@AutoMappedColumn()
	public title: string;

	@AutoMappedColumn()
	public context: string;

	@AutoMappedColumn()
	public speed: number;

	@AutoMappedColumn()
	public dealing: number;

	@AutoMappedColumn()
	public price: number;

	@AutoMappedColumn()
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
