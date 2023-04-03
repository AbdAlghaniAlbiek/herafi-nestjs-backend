import {
	BadRequestException,
	Injectable,
	InternalServerErrorException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'nestjs-cloudinary';
import { NodeConfig } from 'src/configurations/config.interfaces';
import {
	CraftmanCategoryCrafts,
	CraftmanDetailsProfileDto,
	CraftmanDetailsProjects,
	CraftmanDetailsRequests,
	GeneralCraftmanDto,
	NewMembersCraftmanProfile
} from 'src/data/dtos/admin-dtos/responses/craftmen-response.dto';
import { Category } from 'src/data/entities/category.entity';
import { City } from 'src/data/entities/city.entity';
import { ImageType } from 'src/data/entities/constants/image-type.constants';
import { Craft } from 'src/data/entities/craft.entity';
import { Favourite } from 'src/data/entities/favourite.entity';
import { Level } from 'src/data/entities/level.entity';
import { Person } from 'src/data/entities/person.entity';
import { Photo } from 'src/data/entities/photo.entity';
import { Position } from 'src/data/entities/position.entity';
import { Process } from 'src/data/entities/process.entity';
import { Status } from 'src/data/entities/status.entity';
import { Environment } from 'src/helpers/constants/environments.constants';
import {
	CrudResultMessages,
	EmailResultMessages
} from 'src/helpers/constants/result-messages.constants';
import { MailQueueProducer } from 'src/services/enhancers/queues/producers/mail.producer';
import { Equal, Not, Repository } from 'typeorm';
import * as fs from 'fs';
import { promisify } from 'util';
import { CRUD } from 'src/helpers/constants/crud.contants';
import { CraftmanLevel } from 'src/data/entities/constants/craftman-level.constants';

@Injectable()
export class CraftmenRepo {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>,
		@InjectRepository(Photo) private photoRepo: Repository<Photo>,
		private mailService: MailQueueProducer,
		private cloudinaryService: CloudinaryService,
		private nodeConfig: ConfigService<NodeConfig>
	) {}

	private async checkCraftmanExisted(craftmanId: number) {
		const isCraftmanExist = await this.personRepo.findOneBy({
			id: craftmanId
		});

		if (!isCraftmanExist) {
			throw new BadRequestException(
				CrudResultMessages.itemNotFound(
					`Craftman with id ${craftmanId}`
				)
			);
		}
	}

	private getCategoryCrafts(queryResult: any) {
		const craftmanCategoryCrafts: CraftmanCategoryCrafts[] = [];

		queryResult.forEach((categoryCrafts) => {
			if (craftmanCategoryCrafts.length === 0) {
				craftmanCategoryCrafts.push(
					new CraftmanCategoryCrafts(categoryCrafts.name, [
						categoryCrafts.skill
					])
				);
			}

			let isNewCategory: boolean = true;

			craftmanCategoryCrafts.forEach((cdc) => {
				if (cdc.name === categoryCrafts.name) {
					isNewCategory = false;
					cdc.skills.push(categoryCrafts.skill);
				}
			});

			if (isNewCategory) {
				craftmanCategoryCrafts.push(
					new CraftmanCategoryCrafts(categoryCrafts.name, [
						categoryCrafts.skill
					])
				);
			}
		});

		return craftmanCategoryCrafts;
	}

	public async getGeneralCraftman(
		pageSize: number,
		offset: number
	): Promise<GeneralCraftmanDto[]> {
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
					'p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = t'
				)
				.skip(pageSize)
				.take(offset)
				.getRawMany();

			return queryResult.map(
				(generalCraftman) =>
					new GeneralCraftmanDto(
						generalCraftman.id,
						generalCraftman.name,
						generalCraftman.imagePath
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getCraftmanDetailsProfile(
		craftmanId: number
	): Promise<CraftmanDetailsProfileDto> {
		try {
			await this.checkCraftmanExisted(craftmanId);

			const craftmanDetailsProfile = await this.personRepo
				.createQueryBuilder()
				.select(['p.id', 'p.name', 'p.email', 'p.phone_number'])
				.addSelect('p.identity_num', 'national_number')
				.addSelect('c.name', 'city')
				.addSelect('p.data_join')
				.addSelect('l.craftman_level', 'level')
				.addSelect('pos.craftman_position', 'status')
				.addSelect('p.block_num', 'blocks_num')
				.addSelect('cra_num.crafts_num')
				.addSelect('cer_num.certifications_num')
				.addSelect('proj_num.projects_num')
				.addSelect('req_num.requests_num')
				.addSelect(['p.lowest_cost', 'p.highest_cost'])
				.addSelect('per_img.profile_image')
				.addSelect('iden_img.personal_identity_image')
				.addSelect('fav.users_favourties')
				.addSelect('sear.users_searchs')
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
							.where('image_type = :personalType', {
								personalType: ImageType.Personal
							});
					},
					'per_img',
					'p.id = per_img.person_id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('ph.image_path', 'profile_image')
							.addSelect('ph.person_id')
							.from(Photo, 'ph')
							.where('image_type = :identityType', {
								personalType: ImageType.Identity
							});
					},
					'iden_img',
					'p.id = iden_img.perons_id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('l.id', 'craftman_id')
							.addSelect('l.craftman_level', 'type')
							.from(Level, 'l');
					},
					'l',
					'p.level_id = l.craftman_id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('cp.craftman_id')
							.addSelect('COUNT(cp.craft_id)', 'crafts_num')
							.from(Craft, 'cp')
							.groupBy('cp.craftman_id');
					},
					'cra_num',
					'cra_num.craftman_id = p.id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('pho.person_id')
							.addSelect(
								'COUNT(image_path)',
								'certifications_num'
							)
							.from(Photo, 'pho')
							.where('pho.image_type = :imageType', {
								ImageType: ImageType.Personal
							})
							.groupBy('pho.person_id');
					},
					'cer_num',
					'cer_num.person_id = p.id'
				)
				.innerJoin(
					(qp) => {
						return qp
							.distinctOn(['pr.craftman_id'])
							.addSelect('COUNT(ph.request_id)', 'projects_num')
							.from(Request, 'pr')
							.innerJoin(Photo, 'ph', 'pr.id = ph.request_id')
							.groupBy('pr.craftman_id')
							.orderBy('pr.craftman_id');
					},
					'proj_num',
					'proj_num.craftman_id = p.id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('full_req.craftman_id')
							.addSelect('COUNT(full_req.id)', 'requests_num')
							.from((subQuery) => {
								return subQuery
									.select(['re.id', 're.craftman_id'])
									.addSelect('ph.request_id')
									.from(Request, 're')
									.leftJoin(
										Photo,
										'ph',
										're.id = ph.request_id'
									);
							}, 'full_req')
							.where('full_req.request_id IS NULL')
							.groupBy('full_req.craftman_id');
					},
					'req_num',
					'req_num.craftman_id = p.id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('h.person_id')
							.addSelect('COUNT(h.id)', 'users_searchs')
							.from(History, 'h')
							.groupBy('h.person_id');
					},
					'sear',
					'sear.craftman_id = p.id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('f.person_id')
							.addSelect('COUNT(f.id)', 'users_favourites')
							.from(Favourite, 'f')
							.groupBy('f.person_id');
					},
					'fav',
					'fav.person_id = p.id'
				)
				.innerJoin(Position, 'pos', 'pos.id = p.position_id')
				.where(
					'p.id = :craftmanId AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = t'
				)
				.setParameter('craftmanId', craftmanId)
				.getRawOne();

			return new CraftmanDetailsProfileDto(
				craftmanDetailsProfile.id,
				craftmanDetailsProfile.name,
				craftmanDetailsProfile.email,
				craftmanDetailsProfile.phoneNumber,
				craftmanDetailsProfile.national_number,
				craftmanDetailsProfile.city,
				craftmanDetailsProfile.data_join,
				craftmanDetailsProfile.level,
				craftmanDetailsProfile.status,
				craftmanDetailsProfile.block_num,
				craftmanDetailsProfile.crafts_num,
				craftmanDetailsProfile.certifications_num,
				craftmanDetailsProfile.projects_num,
				craftmanDetailsProfile.requests_num,
				craftmanDetailsProfile.lowest_cost,
				craftmanDetailsProfile.highest_cost,
				craftmanDetailsProfile.profile_image,
				craftmanDetailsProfile.personal_identity_image,
				craftmanDetailsProfile.users_favourties,
				craftmanDetailsProfile.users_searchs
			);
		} catch (err) {
			throw new BadRequestException(`${err}`);
		}
	}

	public async getCraftmanDetailsCrafts(craftmanId: number) {
		try {
			await this.checkCraftmanExisted(craftmanId);

			const queryResult = await this.personRepo
				.createQueryBuilder()
				.select('ca.name')
				.addSelect('cr.name', 'skill')
				.from(Category, 'ca')
				.innerJoin(Craft, 'cr', 'ca.id = cr.category_id')
				.innerJoin('person_craft', 'cp', 'cr.id = cp.craft_id')
				.innerJoin(Person, 'p', 'cp.craftman_id = p.id')
				.where('p.id = :craftmanId', { craftmanId })
				.andWhere(
					'p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = t'
				)
				.getRawMany();

			return this.getCategoryCrafts(queryResult);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getCraftmanDetailsCertifications(
		craftmanId: number
	): Promise<string[]> {
		try {
			await this.checkCraftmanExisted(craftmanId);

			const craftmanCertifcates = await this.personRepo
				.createQueryBuilder('p')
				.select('ph.image_path')
				.innerJoin('p.photos', 'ph')
				.where('ph.image_type = :certImage', {
					certImag: ImageType.Certificate
				})
				.andWhere('p.id = :craftmanId', { craftmanId })
				.andWhere('p.lowest_cost <> 0 AND p.verified = t')
				.getRawMany();

			return craftmanCertifcates.map((cert) => cert.image_path);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getCraftmanDetailsRequests(craftmanId: number) {
		try {
			await this.checkCraftmanExisted(craftmanId);

			const craftmanDetailsRequests = await this.personRepo
				.createQueryBuilder()
				.select(['r.id', 'r.name'])
				.addSelect('pr.name', 'process')
				.addSelect(['r.start_date', 'r.end_date'])
				.addSelect('r.total_cost', 'cost')
				.addSelect('r.comment')
				.addSelect('s.request_status', 'status')
				.addSelect('r.total_rate', 'rating')
				.addSelect('u.name', 'user_name')
				.from(Request, 'r')
				.innerJoin(Process, 'pr', 'pr.id = r.process_id')
				.innerJoin(Status, 's', 's.id = r.status_id')
				.innerJoin(Person, 'c', 'c.id = r.person_id')
				.innerJoin(Person, 'u', 'u.id = r.person_id')
				.leftJoin(Photo, 'ph', 'r.id = ph.request_id')
				.where('c.id = :craftmanId', { craftmanId })
				.where(
					'ph.request_id IS NULL AND c.lowest_cost <> 0 AND c.highest_cost <> 0 AND c.verified = t'
				)
				.orderBy('r.id')
				.limit(10)
				.getRawOne();

			return new CraftmanDetailsRequests(
				craftmanDetailsRequests.id,
				craftmanDetailsRequests.name,
				craftmanDetailsRequests.process,
				craftmanDetailsRequests.start_date,
				craftmanDetailsRequests.end_date,
				craftmanDetailsRequests.cost,
				craftmanDetailsRequests.comment,
				craftmanDetailsRequests.status,
				craftmanDetailsRequests.rating,
				craftmanDetailsRequests.user_name
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getCraftmanDetailsProjects(craftmanId: number) {
		try {
			await this.checkCraftmanExisted(craftmanId);

			const craftmanDetailsProjects = await this.personRepo
				.createQueryBuilder()
				.select(['r.id', 'r.name'])
				.addSelect('pr.name', 'process')
				.addSelect(['r.start_date', 'r.end_date'])
				.addSelect('r.total_cost', 'cost')
				.addSelect('r.comment')
				.addSelect('s.request_status', 'status')
				.addSelect('r.total_rate', 'rating')
				.addSelect('ph.image_path')
				.addSelect('u.name', 'user_name')
				.from(Request, 'r')
				.innerJoin(Process, 'pr', 'pr.id = r.process_id')
				.innerJoin(Status, 's', 's.id = r.status_id')
				.innerJoin(Person, 'c', 'c.id = r.person_id')
				.innerJoin(Person, 'u', 'u.id = r.person_id')
				.leftJoin(Photo, 'ph', 'r.id = ph.request_id')
				.where('c.id = :craftmanId', { craftmanId })
				.where(
					'c.lowest_cost <> 0 AND c.highest_cost <> 0 AND c.verified = t'
				)
				.orderBy('r.id')
				.limit(10)
				.getRawOne();

			return new CraftmanDetailsProjects(
				craftmanDetailsProjects.id,
				craftmanDetailsProjects.name,
				craftmanDetailsProjects.process,
				craftmanDetailsProjects.start_date,
				craftmanDetailsProjects.end_date,
				craftmanDetailsProjects.cost,
				craftmanDetailsProjects.comment,
				craftmanDetailsProjects.status,
				craftmanDetailsProjects.rating,
				craftmanDetailsProjects.image_path,
				craftmanDetailsProjects.user_name
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getNewMembersCraftmenIds(pageSize: number, offset: number) {
		try {
			const newMembersCraftmenIds = await this.personRepo.find({
				select: { id: true },
				where: {
					lowestCost: Not(Equal(0)),
					highestCost: Not(Equal(0)),
					verified: true,
					isChecked: true
				},
				skip: offset,
				take: pageSize
			});

			return newMembersCraftmenIds.map((newMem) => newMem.id);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getNewMemberCraftmanProfile(craftmanId: number) {
		try {
			await this.checkCraftmanExisted(craftmanId);

			const newMembersCraftmanProfile = await this.personRepo
				.createQueryBuilder()
				.select(['p.id', 'p.name', 'p.email', 'p.phone_number'])
				.addSelect('p.identity_number', 'national_number')
				.addSelect('c.name', 'city')
				.addSelect('p.date_join')
				.addSelect('cra_num.crafts_num')
				.addSelect('cer.num.certification_num')
				.addSelect(['p.lowest_cost', 'p.image_path'])
				.addSelect('per_img.profile_image')
				.addSelect('iden_img.personal_identity_image')
				.from(Person, 'p')
				.innerJoin(
					(qb) => {
						return qb.select(['ci.id', 'ci.name']).from(City, 'ci');
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
						return qb
							.select('pho.image_path', 'personal_identity_image')
							.addSelect('pho.person_id')
							.from(Photo, 'pho')
							.where('pho.image_type = :identityImage', {
								identityImage: ImageType.Identity
							});
					},
					'iden_img',
					'p.id = iden_img.person_id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('cp.person_id')
							.addSelect('COUNT(cp.craft_id)', 'crafts_num')
							.from('person_craft', 'cp')
							.groupBy('cp.person_id');
					},
					'cra_num',
					'cra_num.craftman_id = p.id'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select('photo.person_id')
							.addSelect(
								'COUNT(photo.image_path)',
								'certifications_num'
							)
							.from(Photo, 'photo')
							.where('photo.image_type = :certImageType', {
								certImageType: ImageType.Certificate
							})
							.groupBy('photo.person_id');
					},
					'cer_num',
					'cer_num.person_id = p.id'
				)
				.where(
					'p.id = :craftmane AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = t'
				)
				.getRawOne();

			return new NewMembersCraftmanProfile(
				newMembersCraftmanProfile.id,
				newMembersCraftmanProfile.name,
				newMembersCraftmanProfile.email,
				newMembersCraftmanProfile.phone_number,
				newMembersCraftmanProfile.national_number,
				newMembersCraftmanProfile.city,
				newMembersCraftmanProfile.date_join,
				newMembersCraftmanProfile.crafts_num,
				newMembersCraftmanProfile.certification_num,
				newMembersCraftmanProfile.lowest_cost,
				newMembersCraftmanProfile.image_path,
				newMembersCraftmanProfile.profile_image,
				newMembersCraftmanProfile.personal_identity_image
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getNewMembersCraftmanCrafts(craftmanId: number) {
		try {
			await this.checkCraftmanExisted(craftmanId);

			const queryResult = await this.personRepo
				.createQueryBuilder()
				.select('ca.name')
				.addSelect('cr.name', 'skill')
				.from(Category, 'ca')
				.innerJoin(Craft, 'cr', 'ca.id = cr.category_id')
				.innerJoin('person_craft', 'cp', 'cr.id = cp.craft_id')
				.innerJoin(Person, 'p', 'cp.craftman_id = p.id')
				.where(
					'p.id = :craftmanId AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = f',
					{ craftmanId }
				)
				.getRawMany();

			return this.getCategoryCrafts(queryResult);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getNewMembersCraftmanCertifications(
		craftmanId: number
	): Promise<string[]> {
		try {
			await this.checkCraftmanExisted(craftmanId);

			const queryResult = await this.personRepo
				.createQueryBuilder()
				.select('ph.image_path')
				.from(Person, 'p')
				.innerJoin(Photo, 'ph', 'p.id = ph.person_id')
				.where(
					'ph.imageType = :cerImageType AND p.id = :carftmanId AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = f',
					{ cerImageType: ImageType.Certificate, craftmanId }
				)
				.getRawMany();

			return queryResult.map((obj) => obj.image_path);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async acceptNewMemberCraftman(
		craftmanId: number,
		level: CraftmanLevel
	) {
		try {
			this.checkCraftmanExisted(craftmanId);

			await this.personRepo.update(
				{ isChecked: true },
				{ isChecked: true, level: { craftmanLevel: level } }
			);

			const acceptNewMemberCraftman = await this.personRepo.find({
				select: { email: true, socialProvider: { verifyCode: true } },
				relations: { socialProvider: true },
				where: { id: Equal(craftmanId) }
			});

			await this.mailService.sendMailVerification({
				subject: 'Verify Craftman Account',
				text: `Gradualations you're now successfuly a officialy an craftman in Herafi system, you just need one step to be verified on your account, please insert this verify code in your Herafi application \n\n verify code: ${acceptNewMemberCraftman[0].socialProvider.verifyCode}`,
				to: acceptNewMemberCraftman[0].email
			});

			return EmailResultMessages.emailSendingSuccess(
				acceptNewMemberCraftman[0].email
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async refusedNewMemeberCraftman(craftmanId: number) {
		try {
			await this.checkCraftmanExisted(craftmanId);

			const personalImagePath = await this.photoRepo.find({
				select: { imagePath: true },
				where: { imageType: ImageType.Personal, id: Equal(craftmanId) }
			});

			const identityImagePath = await this.photoRepo.find({
				select: { imagePath: true },
				where: { imageType: ImageType.Identity, id: Equal(craftmanId) }
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

			await this.personRepo.delete({ id: Equal(craftmanId) });

			return CrudResultMessages.successCRUD(
				`User with id ${craftmanId}`,
				CRUD.Delete,
				'with his photos'
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}
}
