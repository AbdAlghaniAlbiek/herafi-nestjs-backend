import {
	AutoMapColumn,
	AutoMapPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity } from 'typeorm';

@Entity()
export class City {
	@AutoMapPrimaryGeneratedColumn()
	public id: number;

	@AutoMapColumn()
	public name: string;
}
