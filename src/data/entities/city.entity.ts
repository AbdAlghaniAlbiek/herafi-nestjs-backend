import {
	AutoMappedColumn,
	AutoMappedPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity } from 'typeorm';

@Entity()
export class City {
	@AutoMappedPrimaryGeneratedColumn()
	public id: number;

	@AutoMappedColumn()
	public name: string;
}
