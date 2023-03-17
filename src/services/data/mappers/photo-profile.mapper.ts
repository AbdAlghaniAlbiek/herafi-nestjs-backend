import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Photo } from 'src/data/entities/photo.entity';
import {
	PhotoPersonDto,
	PhotosRequestDto
} from 'src/data/dtos/common-dtos/requests/upload-request.dto';

@Injectable()
export class PhotoProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}

	override get profile() {
		return (mapper) => {
			this.photoPersonDto(mapper);
			this.photoRequestDto(mapper);
		};
	}

	private photoPersonDto(mapper: any) {
		createMap(
			mapper,
			PhotoPersonDto,
			Photo,
			forMember((dest) => dest.id, ignore())
		);
	}

	private photoRequestDto(mapper: any) {
		createMap(
			mapper,
			PhotosRequestDto,
			Photo,
			forMember((dest) => dest.id, ignore())
		);
	}
}
