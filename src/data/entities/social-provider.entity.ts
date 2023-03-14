import { AutoMappedColumn } from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SocialProviderType } from './constants/social-provider.constants';
import { Person } from './person.entity';

@Entity()
export class SocialProvider {
	@PrimaryGeneratedColumn()
	public id: number;

	@AutoMappedColumn({
		enum: SocialProviderType,
		enumName: 'social_provider_type'
	})
	public providerType: SocialProviderType;

	@AutoMappedColumn()
	public socialProviderId: string;

	@AutoMappedColumn()
	public refreshToken: string;

	@AutoMappedColumn()
	public verifyCode: string;

	@AutoMappedColumn()
	public personId: number;

	@OneToOne(() => Person, (person) => person.socialProvider)
	@JoinColumn({ name: 'person_id', referencedColumnName: 'id' })
	public person: Person;
}
