import {
	AutoMapColumn,
	AutoMapPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { Person } from './person.entity';

@Entity()
export class Craft {
	@AutoMapPrimaryGeneratedColumn()
	public id: number;

	@AutoMapColumn()
	public name: string;

	@AutoMapColumn()
	public categoryId: number;

	@ManyToOne(() => Category, (category) => category.crafts)
	@JoinColumn({
		name: 'category_id',
		referencedColumnName: 'id'
	})
	public category: Category;

	@ManyToMany(() => Person, (person) => person.crafts)
	public people: Person[];
}
