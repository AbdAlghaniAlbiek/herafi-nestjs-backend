import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Person } from 'src/data/entities/person.entity';
import { CreatePerson } from 'src/data/dtos/person.dto';

@Injectable()
export class personProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}

	override get profile() {
		return (mapper) => {
			createMap(mapper, Person, CreatePerson);
			createMap(
				mapper,
				CreatePerson,
				Person,
				forMember((dest) => dest.id, ignore())
			);
			createMap(mapper, CreatePerson, Person);
		};
	}
}
