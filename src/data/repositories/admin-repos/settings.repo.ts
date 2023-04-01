import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminProfileDto } from 'src/data/dtos/admin-dtos/responses/settings-respons.dto';
import { City } from 'src/data/entities/city.entity';
import { ImageType } from 'src/data/entities/constants/image-type.constants';
import { Person } from 'src/data/entities/person.entity';
import { Photo } from 'src/data/entities/photo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettingsRepo {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>
	) {}

	public async getAdminProfile(adminId) {
		try {
			const adminProfile = await this.personRepo
				.createQueryBuilder()
				.select(['p.id', 'p.name', 'p.email', 'p.phone_number'])
				.addSelect('p.identity_number', 'national_number')
				.addSelect('c.name', 'city')
				.addSelect('p.date_join')
				.addSelect('per_img.profile_image')
				.addSelect('ident_img.personal_identity_image')
				.from(Person, 'p')
				.innerJoin(
					(qb) => {
						return qb
							.select('ph.person_id')
							.addSelect(
								'ph.image_path',
								'personal_identity_image'
							)
							.from(Photo, 'ph')
							.where('ph.image_type = :identityTypeImage', {
								identityTypeImage: ImageType.Identity
							});
					},
					'ident_img',
					'p.i = ident_img.person_id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('pho.person_id')
							.addSelect('pho.image_path', 'profile_image')
							.from(Photo, 'pho')
							.where('pho.image_type = :personalImageType', {
								personalImageType: ImageType.Personal
							});
					},
					'per_img',
					'per_img.person_id = p.id'
				)
				.innerJoin(
					(qb) => {
						return qb.select(['ci.id', 'ci.name']).from(City, 'ci');
					},
					'c',
					'p.city_id = c.id'
				)
				.where('p.id = :adminId', { adminId })
				.getRawOne();

			return new AdminProfileDto(
				adminProfile.id,
				adminProfile.name,
				adminProfile.phone_number,
				adminProfile.national_number,
				adminProfile.city,
				adminProfile.date_join,
				adminProfile.profile_image,
				adminProfile.personal_identity_image
			);
		} catch (err) {}
	}
}