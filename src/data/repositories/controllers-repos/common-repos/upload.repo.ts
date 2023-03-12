import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import {
	BadRequestException,
	InternalServerErrorException
} from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'nestjs-cloudinary/dist/cloudinary.service';
import { NodeConfig } from 'src/configurations/config.interfaces';
import { PhotoPersonDto } from 'src/data/dtos/common-dtos/requests/upload-request.dto';
import { Person } from 'src/data/entities/person.entity';
import { Photo } from 'src/data/entities/photo.entity';
import { CRUD } from 'src/helpers/constants/crud.contants';
import { Environment } from 'src/helpers/constants/environments.constants';
import { ResultMessages } from 'src/helpers/constants/result-messages.constants';
import { Repository } from 'typeorm';
import { UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class UploadRepo {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>,
		@InjectMapper() private mapper: Mapper,
		private nodeConfig: ConfigService<NodeConfig>,
		private readonly cloudinaryService: CloudinaryService
	) {}

	public async uploadSingleFile(
		file: Express.Multer.File,
		photoPersonDto: PhotoPersonDto
	) {
		if (this.nodeConfig.get('NODE_ENV') === Environment.Production) {
			try {
				const uploadedImage = await this.cloudinaryService.uploadFile(
					file
				);
				const person = await this.personRepo.findOneBy({
					id: photoPersonDto.personId
				});
				if (!person) {
					throw new BadRequestException(
						ResultMessages.itemNotFound('Person', '')
					);
				}
				const photo = await this.mapper.mapAsync(
					photoPersonDto,
					PhotoPersonDto,
					Photo
				);
				photo.imagePath = uploadedImage.public_id;
				person.photos = [photo];
				this.personRepo.update({ id: person.id }, person);

				return ResultMessages.successCRUD('Photo', CRUD.create, '');
			} catch (error) {
				if (error instanceof UploadApiErrorResponse) {
					throw new InternalServerErrorException(`${error}`);
				}
			}
		}
	}

	public uploadMultipeFiles(files: Express.Multer.File[]) {}
}
