import { Injectable } from '@nestjs/common';
import {
	BadRequestException,
	InternalServerErrorException
} from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'nestjs-cloudinary/dist/cloudinary.service';
import { NodeConfig } from 'src/configurations/config.interfaces';
import { Person } from 'src/data/entities/person.entity';
import { CRUD } from 'src/helpers/constants/crud.contants';
import { Environment } from 'src/helpers/constants/environments.constants';
import { CrudResultMessages } from 'src/helpers/constants/result-messages.constants';
import { Repository, TypeORMError } from 'typeorm';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { ImageType } from 'src/data/entities/constants/image-type.constants';
import { TypeOrmException } from 'src/helpers/security/errors/custom-exceptions';
import { Photo } from 'src/data/entities/photo.entity';
import { Request } from 'src/data/entities/request.entity';

@Injectable()
export class UploadRepo {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>,
		@InjectRepository(Request) private requestRepo: Repository<Request>,
		private nodeConfig: ConfigService<NodeConfig>,
		private readonly cloudinaryService: CloudinaryService
	) {}

	public async uploadSingleFile(
		file: Express.Multer.File,
		personId: number,
		imageType: ImageType
	) {
		try {
			const uploadedImage =
				this.nodeConfig.get('NODE_ENV') === Environment.Production
					? await this.cloudinaryService.uploadFile(file)
					: file;

			const person = await this.personRepo.findOneBy({
				id: personId
			});
			if (!person) {
				throw new BadRequestException(
					CrudResultMessages.itemNotFound('Person', '')
				);
			}

			person.photos.push({
				imagePath:
					this.nodeConfig.get('NODE_ENV') === Environment.Production
						? (<UploadApiResponse>uploadedImage).public_id
						: (<Express.Multer.File>uploadedImage).path,
				imageType
			});

			await this.personRepo.save(person);

			return CrudResultMessages.successCRUD('Photo', CRUD.create, '');
		} catch (error) {
			if (error instanceof TypeORMError) {
				throw new TypeOrmException(
					error.name,
					error.message,
					error.stack
				);
			}

			throw new InternalServerErrorException(
				(<UploadApiErrorResponse>error).message
			);
		}
	}

	public uploadMultipeFiles(
		files: Express.Multer.File[],
		personId: number,
		requestId: number,
		banner: number
	) {
		files.forEach(async (file, index) => {
			try {
				const uploadedImage =
					this.nodeConfig.get('NODE_ENV') === Environment.Production
						? await this.cloudinaryService.uploadFile(file)
						: file;

				const person = await this.personRepo.findOneBy({
					id: personId
				});
				if (!person) {
					throw new BadRequestException(
						CrudResultMessages.itemNotFound(
							`Person with id: ${personId}`,
							''
						)
					);
				}

				const request = await this.requestRepo.findOneBy({
					id: requestId
				});
				if (!request) {
					throw new BadRequestException(
						CrudResultMessages.itemNotFound(
							`Request with id: ${requestId}`,
							''
						)
					);
				}

				const photo: Photo = new Photo();
				photo.imagePath =
					this.nodeConfig.get('NODE_ENV') === Environment.Production
						? (<UploadApiResponse>uploadedImage).public_id
						: (<Express.Multer.File>uploadedImage).path;
				photo.banner = banner === index + 1 ? true : false;

				person.photos.push(photo);

				await this.personRepo.save(person);

				return CrudResultMessages.successCRUD('Photo', CRUD.create, '');
			} catch (error) {
				if (error instanceof TypeORMError) {
					throw new TypeOrmException(
						error.name,
						error.message,
						error.stack
					);
				}

				throw new InternalServerErrorException(
					(<UploadApiErrorResponse>error).message
				);
			}
		});
	}
}
