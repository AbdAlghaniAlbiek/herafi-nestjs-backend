import {
	AutoMapColumn,
	AutoMapPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, OneToMany } from 'typeorm';
import { Craft } from './craft.entity';

@Entity()
export class Category {
	@AutoMapPrimaryGeneratedColumn()
	public id: number;

	@AutoMapColumn()
	public name: string;

	@OneToMany(() => Craft, (craft) => craft.category, {
		cascade: true,
		onDelete: 'CASCADE',
		eager: true,
		nullable: true
	})
	public crafts: Craft[];
}
