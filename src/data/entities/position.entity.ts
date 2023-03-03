import { Entity, OneToMany } from 'typeorm';
import {
	AutoMappedPrimaryGeneratedColumn,
	AutoMappedColumn
} from 'src/helpers/decorators/orm.decorator';
import { CraftmanPosition } from './constants/craftman-position.constants';
import { Person } from './person.entity';

@Entity()
export class Position {
	@AutoMappedPrimaryGeneratedColumn()
	public id: number;

	@AutoMappedColumn({
		enum: CraftmanPosition,
		enumName: 'craftman_position',
		default: CraftmanPosition.Free
	})
	public craftmanPostion: CraftmanPosition;

	@OneToMany(() => Person, (person) => person.position, {
		onDelete: 'NO ACTION',
		nullable: true
	})
	public persons: Person[];
}
