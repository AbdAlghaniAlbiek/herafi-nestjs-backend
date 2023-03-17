import {
	AutoMapColumn,
	AutoMapPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, OneToMany } from 'typeorm';
import { PersonRole } from './constants/person-role.constants';
import { Person } from './person.entity';

@Entity()
export class Role {
	@AutoMapPrimaryGeneratedColumn()
	public id: number;

	@AutoMapColumn({
		enum: PersonRole,
		enumName: 'person_role',
		default: PersonRole.User
	})
	public personRole: PersonRole;

	@OneToMany(() => Person, (person) => person.role, {
		onDelete: 'NO ACTION',
		nullable: true
	})
	public persons: Person[];
}
