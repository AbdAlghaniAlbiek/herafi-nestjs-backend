import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Person } from 'src/data/entities/person.entity';
import {
	CreatePersonDto,
	ReadPersonDto,
	UpdatePersonDto
} from 'src/data/dtos/person.dto';

@Injectable()
export class personProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}

	override get profile() {
		return (mapper) => {
			this.createPersonMap(mapper);
			this.updatePersonMap(mapper);
			this.readPersonMap(mapper);
		};
	}

	private createPersonMap(mapper: any) {
		createMap(mapper, Person, CreatePersonDto);
		createMap(
			mapper,
			CreatePersonDto,
			Person,
			forMember((dest) => dest.id, ignore())
		);
		createMap(mapper, CreatePersonDto, Person);
	}

	private updatePersonMap(mapper: any) {
		createMap(mapper, Person, UpdatePersonDto);
		createMap(
			mapper,
			UpdatePersonDto,
			Person,
			forMember((dest) => dest.id, ignore())
		);
		createMap(mapper, UpdatePersonDto, Person);
	}

	private readPersonMap(mapper: any) {
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
