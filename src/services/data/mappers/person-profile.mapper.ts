import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Person } from 'src/data/entities/person.entity';
import {
	CreatePersonDto,
	UpdatePersonDto
} from 'src/data/dtos/common-dtos/requests/auth-request.dto';
import { ReadPersonDto } from 'src/data/dtos/common-dtos/responses/auth-response.dto';

@Injectable()
export class PersonProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}

	override get profile() {
		return (mapper) => {
			this.createPersonDtoMap(mapper);
			this.updatePersonDtoMap(mapper);
			this.readPersonDtoMap(mapper);
		};
	}

	private createPersonDtoMap(mapper: any) {
		createMap(mapper, Person, CreatePersonDto);
		createMap(
			mapper,
			CreatePersonDto,
			Person,
			forMember((dest) => dest.id, ignore())
		);
		createMap(mapper, CreatePersonDto, Person);
	}

	private updatePersonDtoMap(mapper: any) {
		createMap(mapper, Person, UpdatePersonDto);
		createMap(
			mapper,
			UpdatePersonDto,
			Person,
			forMember((dest) => dest.id, ignore())
		);
		createMap(mapper, UpdatePersonDto, Person);
	}

	private readPersonDtoMap(mapper: any) {
		createMap(mapper, Person, ReadPersonDto);
		createMap(
			mapper,
			ReadPersonDto,
			Person,
			forMember((dest) => dest.id, ignore())
		);
		createMap(mapper, ReadPersonDto, Person);
	}
}
