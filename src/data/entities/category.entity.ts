import {
	AutoMappedColumn,
	AutoMappedPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, OneToMany } from 'typeorm';
import { Craft } from './craft.entity';

@Entity()
export class Category {
	@AutoMappedPrimaryGeneratedColumn()
	public id: number;

	@AutoMappedColumn()
	public name: string;

	@OneToMany(() => Craft, (craft) => craft.category, {
		cascade: true,
		onDelete: 'CASCADE',
		eager: true,
		nullable: true
	})
	public crafts: Craft[];
}
