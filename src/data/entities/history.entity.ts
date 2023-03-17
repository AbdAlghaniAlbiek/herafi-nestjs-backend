import {
	AutoMapColumn,
	AutoMapPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Person } from './person.entity';

@Entity()
export class History {
	@AutoMapPrimaryGeneratedColumn()
	public id: number;

	@AutoMapColumn()
	public personId: number;

	@AutoMapColumn()
	public personDealedWithId: number;

	@ManyToOne(() => Person, (person) => person.history)
	@JoinColumn({
		name: 'person_id',
		referencedColumnName: 'id'
	})
	public person: Person;
}
