import {
	AutoMappedColumn,
	AutoMappedPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, OneToMany } from 'typeorm';
import { Request } from './request.entity';

@Entity()
export class Process {
	@AutoMappedPrimaryGeneratedColumn()
	public id: number;

	@AutoMappedColumn()
	public name: string;

	@OneToMany(() => Request, (request) => request.process, {
		onDelete: 'NO ACTION',
		nullable: true
	})
	public requests: Request[];
}
