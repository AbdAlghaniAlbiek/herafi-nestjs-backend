import {
	AutoMappedColumn,
	AutoMappedPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Person } from './person.entity';

@Entity()
export class Favourite {
	@AutoMappedPrimaryGeneratedColumn()
	public id: number;

	@AutoMappedColumn()
	public personId: number;

	@AutoMappedColumn()
	public personDealedWithId: number;

	@ManyToOne(() => Person, (person) => person.favourites)
	@JoinColumn({
		name: 'person_id',
		referencedColumnName: 'id'
	})
	public person: Person;
}
