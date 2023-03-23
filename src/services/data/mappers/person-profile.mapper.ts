import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
	createMap,
	forMember,
	fromValue,
	ignore,
	Mapper,
	mapWith
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Person } from 'src/data/entities/person.entity';
import {
	CreatePersonDto,
	UpdatePersonDto
} from 'src/data/dtos/common-dtos/requests/auth-request.dto';
import { ReadPersonDto } from 'src/data/dtos/common-dtos/responses/auth-response.dto';
import { generateRandomVerificationCode } from 'src/helpers/resolvers/generate-random-values.resolver';

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
		createMap(
			mapper,
			CreatePersonDto,
			Person,
			forMember((dest) => dest.id, ignore()),
			forMember(
				(dest) => dest.socialProvider.verifyCode,
				fromValue(generateRandomVerificationCode())
			),
			forMember(
				(dest) => dest.role.personRole,
				mapWith(Person, CreatePersonDto, (src) => src.personRole)
			)
		);
	}

	private updatePersonDtoMap(mapper: any) {
		createMap(
			mapper,
			UpdatePersonDto,
			Person,
			forMember((dest) => dest.id, ignore())
		);
	}

	private readPersonDtoMap(mapper: any) {
		createMap(mapper, Person, ReadPersonDto);
	}
}
