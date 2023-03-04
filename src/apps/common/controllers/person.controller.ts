import {
	HttpStatus,
	VERSION_NEUTRAL,
	Body,
	Post,
	Get,
	Delete,
	Put,
	Param,
	ParseIntPipe,
	InternalServerErrorException,
	BadRequestException
} from '@nestjs/common';
import {
	ApiController,
	ApiHttpResponse
} from 'src/helpers/decorators/swagger.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from 'src/data/entities/person.entity';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { CreatePerson, UpdatePerson } from 'src/data/dtos/person.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ResultMessages } from 'src/helpers/constants/result-messages.constants';
import { CRUD } from 'src/helpers/constants/crud.contants';

@ApiController({ path: 'person', version: VERSION_NEUTRAL })
export class PersonController {
	constructor(
		@InjectRepository(Person) private personRepo: Repository<Person>,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	@Get('')
	@ApiHttpResponse(HttpStatus.OK, 'This route for getting all persons in db')
	public GetAll(): Promise<Person[]> {
		try {
			return this.personRepo.find();
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	@Post('')
	@ApiHttpResponse(
		HttpStatus.CREATED,
		'this route for creating new person into Herafi system'
	)
	@ApiBody({ type: CreatePerson, required: true, examples: {} })
	public async create(@Body() createPerson: CreatePerson): Promise<string> {
		try {
			const existedPerson = this.personRepo.findOneBy({
				email: createPerson.email
			});
			if (existedPerson) return ResultMessages.UserIsAlreadyExist();

			const person = await this.mapper.mapAsync(
				createPerson,
				CreatePerson,
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
					`Person with email: ${createPerson.email}`,
					CRUD.create,
					`${err}`
				)
			);
		}
	}

	@Put(':id')
	@ApiHttpResponse(
		HttpStatus.OK,
		'this route for updating existing person',
		UpdatePerson.name.toString()
	)
	@ApiParam({
		example: 1,
		description: 'person id in db',
		required: true,
		type: Number,
		name: 'id'
	})
	@ApiBody({ type: UpdatePerson, required: true, examples: {} })
	public async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updatePerson: UpdatePerson
	): Promise<string> {
		try {
			const person = await this.personRepo.findOneBy({ id });
			if (!person)
				throw new BadRequestException(
					ResultMessages.itemNotFound(`Person with id: ${id}`, '')
				);

			await this.personRepo.update({ id }, updatePerson);
			return ResultMessages.successCRUD(
				`Person with id: ${person.id}`,
				CRUD.Update,
				''
			);
		} catch (err) {
			throw new InternalServerErrorException(
				ResultMessages.failedCRUD(
					`Person with id: ${id}`,
					CRUD.Update,
					`${err}`
				)
			);
		}
	}

	@Delete(':id')
	@ApiHttpResponse(HttpStatus.OK, 'this route for deleting existing person')
	@ApiParam({
		example: 1,
		description: 'person id in db',
		required: true,
		type: Number,
		name: 'id'
	})
	public async delete(@Param('id', ParseIntPipe) id: number) {
		try {
			const person = await this.personRepo.findOneBy({ id });
			if (!person)
				throw new BadRequestException(
					ResultMessages.itemNotFound(`Person with id: ${id}`, '')
				);
			await this.personRepo.delete({ id });
			return ResultMessages.successCRUD(
				`Person with id: ${id}`,
				CRUD.Delete,
				''
			);
		} catch (err) {
			throw new InternalServerErrorException(
				ResultMessages.failedCRUD(
					`Person with id: ${id}`,
					CRUD.Delete,
					`${err}`
				)
			);
		}
	}
}
