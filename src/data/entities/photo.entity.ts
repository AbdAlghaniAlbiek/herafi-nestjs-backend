import {
	AutoMappedColumn,
	AutoMappedPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ImageType } from './constants/image-type.constants';
import { Person } from './person.entity';
import { Request } from './request.entity';

@Entity()
export class Photo {
	@AutoMappedPrimaryGeneratedColumn()
	public id: number;

	@AutoMappedColumn()
	public imagePath: string;

	@AutoMappedColumn()
	public personId: number;

	@AutoMappedColumn()
	public requestId: number;

	@AutoMappedColumn({
		enum: ImageType,
		enumName: 'image_type',
		default: ImageType.Personal
	})
	public imageType: ImageType;

	@AutoMappedColumn()
	public banner: boolean;

	@ManyToOne(() => Request, (request) => request.photos, {
		nullable: true
	})
	@JoinColumn({
		name: 'request_id',
		referencedColumnName: 'id'
	})
	public request: Request;

	@ManyToOne(() => Person, (person) => person.photos)
	@JoinColumn({
		name: 'person_id',
		referencedColumnName: 'id'
	})
	public person: Person;
}
