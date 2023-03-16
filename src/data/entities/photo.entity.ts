import {
	AutoMapColumn,
	AutoMapPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ImageType } from './constants/image-type.constants';
import { Person } from './person.entity';
import { Request } from './request.entity';

@Entity()
export class Photo {
	@AutoMapPrimaryGeneratedColumn()
	public id?: number;

	@AutoMapColumn()
	public imagePath: string;

	@AutoMapColumn()
	public personId?: number;

	@AutoMapColumn()
	public requestId?: number;

	@AutoMapColumn({
		enum: ImageType,
		enumName: 'image_type',
		default: ImageType.Personal
	})
	public imageType?: ImageType;

	@AutoMapColumn()
	public banner?: boolean;

	@ManyToOne(() => Request, (request) => request.photos, {
		nullable: true
	})
	@JoinColumn({
		name: 'request_id',
		referencedColumnName: 'id'
	})
	public request?: Request;

	@ManyToOne(() => Person, (person) => person.photos)
	@JoinColumn({
		name: 'person_id',
		referencedColumnName: 'id'
	})
	public person?: Person;
}
