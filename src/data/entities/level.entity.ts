import {
	AutoMapColumn,
	AutoMapPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, OneToMany } from 'typeorm';
import { CraftmanLevel } from './constants/craftman-level.constants';
import { Person } from './person.entity';

@Entity()
export class Level {
	@AutoMapPrimaryGeneratedColumn()
	public id: number;

	@AutoMapColumn({
		enum: CraftmanLevel,
		enumName: 'craftman_level',
		default: CraftmanLevel.Normal
	})
	public craftmanLevel: CraftmanLevel;

	@OneToMany(() => Person, (person) => person.level, {
		onDelete: 'NO ACTION',
		nullable: true
	})
	public persons: Person[];
}
