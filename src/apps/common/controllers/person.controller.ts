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
import { Person } from 'src/data/entities/person.entity';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import {
	CreatePersonDto,
	ReadPersonDto,
	UpdatePersonDto
} from 'src/data/dtos/person.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ResultMessages } from 'src/helpers/constants/result-messages.constants';
import { CRUD } from 'src/helpers/constants/crud.contants';
import { PersonRepo } from 'src/data/repositories/controllers-repos/common-repos/person.repo';

@ApiController({ path: 'person', version: VERSION_NEUTRAL })
export class PersonController {
	constructor(
		private readonly personRepo: PersonRepo,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	@Get('')
	@ApiHttpResponse(HttpStatus.OK, 'This route for getting all persons in db')
	public getAll(): Promise<ReadPersonDto[]> {
		try {
			return this.personRepo.getAll();
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	@Post('')
	@ApiHttpResponse(
		HttpStatus.CREATED,
		'this route for creating new person into Herafi system'
	)
	@ApiBody({ type: CreatePersonDto, required: true, examples: {} })
	public async create(
		@Body() createPerson: CreatePersonDto
	): Promise<string> {
		try {
			return this.personRepo.create(createPerson);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	@Put(':id')
	@ApiHttpResponse(
		HttpStatus.OK,
		'this route for updating existing person',
		UpdatePersonDto.name.toString()
	)
	@ApiParam({
		example: 1,
		description: 'person id in db',
		required: true,
		type: Number,
		name: 'id'
	})
	@ApiBody({ type: UpdatePersonDto, required: true, examples: {} })
	public async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updatePerson: UpdatePersonDto
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
