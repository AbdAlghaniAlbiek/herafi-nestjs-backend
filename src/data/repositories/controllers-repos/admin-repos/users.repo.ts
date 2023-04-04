import { Process } from '@nestjs/bull';
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'nestjs-cloudinary';
import { NodeConfig } from 'src/configurations/config.interfaces';
import {
	GeneralUserDto,
	NewMembersUserDto,
	UserDetailsProfileDto,
	UserDetailsRequestsDto
} from 'src/data/dtos/admin-dtos/responses/users-response.dto';
import { City } from 'src/data/entities/city.entity';
import { ImageType } from 'src/data/entities/constants/image-type.constants';
import { Favourite } from 'src/data/entities/favourite.entity';
import { Person } from 'src/data/entities/person.entity';
import { Photo } from 'src/data/entities/photo.entity';
import { Status } from 'src/data/entities/status.entity';
import { CRUD } from 'src/helpers/constants/crud.contants';
import { Environment } from 'src/helpers/constants/environments.constants';
import {
	CrudResultMessages,
	EmailResultMessages
} from 'src/helpers/constants/result-messages.constants';
import { MailQueueProducer } from 'src/services/enhancers/queues/producers/mail.producer';
import { Equal, Repository } from 'typeorm';
import * as fs from 'fs';
import { promisify } from 'util';

@Injectable()
export class UsersRepo {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>,
		@InjectRepository(Photo) private photoRepo: Repository<Photo>,
		private mailService: MailQueueProducer,
		private cloudinaryService: CloudinaryService,
		private nodeConfig: ConfigService<NodeConfig>
	) {}

	private async checkUserExisted(userId: number) {
		const isUersExist = await this.personRepo.findOneBy({ id: userId });

		if (!isUersExist) {
			throw new NotFoundException(
				CrudResultMessages.itemNotFound(`User with id ${userId}`)
			);
		}
	}

	public async getGeneralUsers(
		pageSize: number,
		offset: number
	): Promise<GeneralUserDto[]> {
		try {
			const queryResult = await this.personRepo
				.createQueryBuilder()
				.select(['p.id', 'p.name'])
				.addSelect('per_img.image_path')
				.from(Person, 'p')
				.innerJoin(
					(subQuery) => {
						return subQuery
							.select(['image_path', 'person_id'])
							.from(Photo, 'photo')
							.where('image_type = :type', {
								type: ImageType.Personal
							});
					},
					'per_img',
					'p.id = per_img.person_id'
				)
				.where(
					'p.lowest_cost = 0 AND p.highest_cost = 0 AND p.verified = t'
				)
				.skip(pageSize)
				.take(offset)
				.getRawMany();

			return queryResult.map(
				(generalUser) =>
					new GeneralUserDto(
						generalUser.id,
						generalUser.name,
						generalUser.imagePath
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getUserDetailsProfile(
		userId: number
	): Promise<UserDetailsProfileDto> {
		try {
			await this.checkUserExisted(userId);

			const userDetailsProfile = await this.personRepo
				.createQueryBuilder()
				.select(['p.id', 'p.name', 'p.email', 'p.phone_number'])
				.addSelect('p.identity_number', 'national_number')
				.addSelect('c.name', 'city')
				.addSelect('p.date_join')
				.addSelect('req_num.requests_num')
				.addSelect('per_img.profile_image')
				.addSelect('iden-img.personal_identity_image')
				.addSelect('fav.favourties')
				.addSelect('sear.searchs')
				.from(Person, 'p')
				.innerJoin(
					(qb) => {
						return qb.select(['c.id, c.name']).from(City, 'c');
					},
					'c',
					'p.city_id = c.id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('ph.image_path', 'profile_image')
							.addSelect('ph.person_id')
							.from(Photo, 'ph')
							.where('ph.image_type = :personalType', {
								personalType: ImageType.Personal
							});
					},
					'per_img',
					'p.id = per_img.person_id'
				)
				.innerJoin(
					(qb) => {
						qb.select([
							'pho.image_path, pho.personal_identity, pho.person_id'
						])
							.from(Photo, 'pho')
							.where('pho.image_type = :identityType', {
								identityType: ImageType.Identity
							});
					},
					'iden_img',
					'p.id = iden_img.person_id'
				)
				.innerJoin(
					(qb) => {
						qb.select('full_req.user_id')
							.addSelect('COUNT(full_req.id)', 'requests_num')
							.from((subQB) => {
								return subQB
									.select(['re.id', 're.user_id'])
									.addSelect('ph.request_id')
									.from(Request, 're')
									.leftJoin(
										Photo,
										'ph',
										're.id = ph.request_id'
									);
							}, 'full_req')
							.where('full_req.request_id IS NULL')
							.groupBy('full_req.user_id');
					},
					'req_num',
					'req_num.user_id = p.id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('h.user_id')
							.addSelect('COUNT(h.id)', 'searchs')
							.from(History, 'h')
							.groupBy('h.user_id');
					},
					'sear',
					'sear.user_id = p.id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('f.user_id')
							.addSelect('COUNT(f.id)', 'favourites')
							.from(Favourite, 'f')
							.groupBy('f.user_id');
					},
					'fav',
					'fav.user_id = p.id'
				)
				.where('p.id = :userId')
				.setParameter('userId', userId)
				.getRawOne();

			return new UserDetailsProfileDto(
				userDetailsProfile.id,
				userDetailsProfile.name,
				userDetailsProfile.email,
				userDetailsProfile.phone_number,
				userDetailsProfile.national_number,
				userDetailsProfile.city,
				userDetailsProfile.date_join,
				userDetailsProfile.requests_num,
				userDetailsProfile.profile_image,
				userDetailsProfile.personal_identity_image,
				userDetailsProfile.favourties,
				userDetailsProfile.searchs
			);
		} catch (err) {
			throw new BadRequestException(`${err}`);
		}
	}

	public async getUserDetailsRequest(
		userId: number
	): Promise<UserDetailsRequestsDto> {
		try {
			await this.checkUserExisted(userId);

			const userDetailsRequest = await this.personRepo
				.createQueryBuilder()
				.select(['r.id', 'r.name'])
				.addSelect('pr.name', 'process')
				.addSelect(['r.start_date', 'r.end_date'])
				.addSelect('r.total_cost', 'cost')
				.addSelect('r.comment')
				.addSelect('s.requestStatus', 'status')
				.addSelect('r.total_rate', 'rating')
				.addSelect('c.name', 'craftman_name')
				.from(Request, 'r')
				.innerJoin(Process, 'pr', 'pr.id = r.process_id')
				.innerJoin(Status, 's', 's.id = r.status_id')
				.innerJoin(Person, 'u', 'u.id = r.user_id')
				.innerJoin(Person, 'c', 'c.id = r.craftman_id')
				.leftJoin(Photo, 'ph', 'r.id = ph.request_id')
				.where('u.id = :userId')
				.andWhere('ph.request_id IS NULL')
				.orderBy('r.id')
				.limit(10)
				.setParameter('userId', userId)
				.getRawOne();

			return new UserDetailsRequestsDto(
				userDetailsRequest.id,
				userDetailsRequest.name,
				userDetailsRequest.process,
				userDetailsRequest.start_date,
				userDetailsRequest.end_date,
				userDetailsRequest.cost,
				userDetailsRequest.comment,
				userDetailsRequest.status,
				userDetailsRequest.rating,
				userDetailsRequest.craftman_name
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getNewMemebersUsersIds(
		pageSize: number,
		offset: number
	): Promise<number[]> {
		try {
			const usersIds: any[] = await this.personRepo
				.createQueryBuilder('p')
				.select('p.id')
				.where(
					'p.lowest_cost = 0 AND p.highest_cost = 0 AND p.verified = 0 AND p.verify_code <> 0 AND is_admin = 0 AND  is_checked = 0'
				)
				.skip(offset)
				.take(pageSize)
				.getMany();

			return usersIds.map((obj) => obj.id);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getNewMemeberUser(userId: number): Promise<NewMembersUserDto> {
		try {
			await this.checkUserExisted(userId);

			const newMemberUser = await this.personRepo
				.createQueryBuilder()
				.select(['p.id', 'p.name', 'p.email'])
				.addSelect('p.phone_num', 'phone_number')
				.addSelect('p.identity_num', 'national_number')
				.addSelect('c.name', 'city')
				.addSelect('p.date_join')
				.addSelect('per_img.profile_image')
				.addSelect('iden_img.personal_identity_image')
				.from(Person, 'p')
				.innerJoin(
					(qb) => {
						return qb.select(['c.id', 'c.name']).from(City, 'c');
					},
					'c',
					'p.city_id = c.id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('ph.image_path', 'profile_image')
							.addSelect('ph.person_id')
							.from(Photo, 'ph')
							.where('ph.image_type = :personalImage', {
								personalImage: ImageType.Personal
							});
					},
					'per_img',
					'p.id = per_img.person_id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('pho.image_path', 'profile_image')
							.addSelect('ph.person_id')
							.from(Photo, 'pho')
							.where('pho.image_type = :identityImage', {
								identityImage: ImageType.Identity
							});
					},
					'iden_img',
					'p.id = iden_img.person_id'
				)
				.where('p.id = :userId')
				.setParameter('userId', userId)
				.getRawOne();

			return new NewMembersUserDto(
				newMemberUser.id,
				newMemberUser.name,
				newMemberUser.email,
				newMemberUser.phone_number,
				newMemberUser.national_number,
				newMemberUser.city,
				newMemberUser.date_join,
				newMemberUser.profile_image,
				newMemberUser.personal_identity_image
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async acceptNewMemeberUser(userId: number) {
		try {
			this.checkUserExisted(userId);

			await this.personRepo.update({ id: userId }, { isChecked: false });

			const acceptNewMemberUser = await this.personRepo.find({
				select: {
					email: true,
					socialProvider: {
						verifyCode: true
					}
				},
				relations: {
					socialProvider: true
				},
				where: {
					id: Equal(userId)
				}
			});

			await this.mailService.sendMailVerification({
				subject: 'Verify User Account',
				text: `Gradualations you're now successfuly a officialy an user in Herafi system, you just need one step to be verified on your account, please insert this verify code in your Herafi application \n\n verify code: ${acceptNewMemberUser[0].socialProvider.verifyCode}`,
				to: acceptNewMemberUser[0].email
			});

			return EmailResultMessages.emailSendingSuccess(
				acceptNewMemberUser[0].email
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async refusedNewMemeberUser(userId: number) {
		try {
			await this.checkUserExisted(userId);

			const personalImagePath = await this.photoRepo.find({
				select: { imagePath: true },
				where: { imageType: ImageType.Personal, id: userId }
			});

			const identityImagePath = await this.photoRepo.find({
				select: { imagePath: true },
				where: { imageType: ImageType.Identity, id: userId }
			});

			if (this.nodeConfig.get('NODE_ENV') === Environment.Development) {
				const fsHandler = fs.promises;

				await fsHandler.unlink(personalImagePath[0].imagePath);
				await fsHandler.unlink(identityImagePath[0].imagePath);
			} else {
				//Production
				const deleteCloudinaryFile = promisify(
					this.cloudinaryService.cloudinary.uploader.destroy
				);

				await deleteCloudinaryFile(personalImagePath[0].imagePath);
				await deleteCloudinaryFile(identityImagePath[0].imagePath);
			}

			await this.personRepo.delete({ id: userId });

			return CrudResultMessages.successCRUD(
				`User with id ${userId}`,
				CRUD.Delete,
				'with his photos'
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}
}
