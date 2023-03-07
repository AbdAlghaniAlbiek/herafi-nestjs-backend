import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePersonDto, ReadPersonDto } from 'src/data/dtos/person.dto';
import { Person } from 'src/data/entities/person.entity';
import { CRUD } from 'src/helpers/constants/crud.contants';
import { ResultMessages } from 'src/helpers/constants/result-messages.constants';
import { Repository } from 'typeorm';

@Injectable()
export class PersonRepo {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>,
		@InjectMapper() private mapper: Mapper
	) {}

	async getAll() {
		try {
			const people = await this.personRepo.find();
			return this.mapper.mapArrayAsync(people, Person, ReadPersonDto);
		} catch (err) {
			return ResultMessages.errorOccursWhenQueryDb(`${err}`);
		}
	}

	async create(createPersonDto: CreatePersonDto) {
		try {
			const existedPerson = this.personRepo.findOneBy({
				email: createPersonDto.email
			});
			if (existedPerson) return ResultMessages.userIsAlreadyExist();

			const person = await this.mapper.mapAsync(
				createPersonDto,
				CreatePersonDto,
				Person
			);

			return ResultMessages.successCRUD(
				`Person with email: ${person.email}`,
				CRUD.create,
				''
			);
		} catch (err) {
			throw new InternalServerErrorException(
				ResultMessages.failedCRUD(
					`Person with email: ${createPersonDto.email}`,
					CRUD.create,
					`${err}`
				)
			);
		}
	}

	async update() {}
}
