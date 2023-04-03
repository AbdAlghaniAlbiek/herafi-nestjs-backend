import { Entity, OneToMany } from 'typeorm';
import {
	AutoMapPrimaryGeneratedColumn,
	AutoMapColumn
} from 'src/helpers/decorators/orm.decorator';
import { CraftmanPosition } from './constants/craftman-position.constants';
import { Person } from './person.entity';

@Entity()
export class Position {
	@AutoMapPrimaryGeneratedColumn()
	public id: number;

	@AutoMapColumn({
		enum: CraftmanPosition,
		enumName: 'craftman_position',
		default: CraftmanPosition.Free
	})
	public craftmanPosition: CraftmanPosition;

	@OneToMany(() => Person, (person) => person.position, {
		onDelete: 'NO ACTION',
		nullable: true
	})
	public persons: Person[];
}
