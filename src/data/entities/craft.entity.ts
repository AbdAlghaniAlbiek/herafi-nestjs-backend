import {
	AutoMappedColumn,
	AutoMappedPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Craft {
	@AutoMappedPrimaryGeneratedColumn()
	public id: number;

	@AutoMappedColumn()
	public name: string;

	@AutoMappedColumn()
	public categoryId: number;

	@ManyToOne(() => Category, (category) => category.crafts)
	@JoinColumn({
		name: 'category_id',
		referencedColumnName: 'id'
	})
	public category: Category;
}
