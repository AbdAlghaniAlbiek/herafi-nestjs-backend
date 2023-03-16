import {
	AutoMapColumn,
	AutoMapPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { SocialProviderType } from './constants/social-provider.constants';
import { Person } from './person.entity';

@Entity()
export class SocialProvider {
	@AutoMapPrimaryGeneratedColumn()
	public id: number;

	@AutoMapColumn({
		enum: SocialProviderType,
		enumName: 'social_provider_type'
	})
	public providerType: SocialProviderType;

	@AutoMapColumn()
	public socialProviderId: string;

	@AutoMapColumn()
	public refreshToken: string;

	@AutoMapColumn()
	public verifyCode: string;

	@AutoMapColumn()
	public personId: number;

	@OneToOne(() => Person, (person) => person.socialProvider)
	@JoinColumn({ name: 'person_id', referencedColumnName: 'id' })
	public person: Person;
}
