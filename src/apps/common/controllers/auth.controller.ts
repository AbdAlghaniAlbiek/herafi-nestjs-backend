import { VERSION_NEUTRAL } from '@nestjs/common/interfaces';
import { Post, Body, Param, Query } from '@nestjs/common';
import {
	ApiController,
	ApiHttpResponse
} from 'src/helpers/decorators/swagger.decorator';
import { AuthRepo } from 'src/data/repositories/controllers-repos/common-repos/auth.repo';
import { HttpStatus } from '@nestjs/common/enums';
import { CreatePersonDto } from 'src/data/dtos/person.dto';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthPerson } from 'src/data/dtos/auth.dto';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Authenticated } from 'src/helpers/decorators/auth.decorator';

@ApiController({ path: 'auth', version: VERSION_NEUTRAL })
export class AuthController {
	constructor(private readonly authService: AuthRepo) {}

	@Post('sign-up')
	@ApiHttpResponse(
		HttpStatus.CREATED,
		'Registering a new user to db',
		CreatePersonDto.name.toString()
	)
	@ApiBody({ type: CreatePersonDto, required: true, examples: {} })
	public async SignUp(
		@Body() createPersonDto: CreatePersonDto
	): Promise<string> {
		const repoResult = await this.authService.signUp(createPersonDto);
		if (repoResult.error) {
			throw new InternalServerErrorException(`${repoResult.error}`);
		}

		return repoResult.result;
	}

	@Post('sign-in')
	@ApiHttpResponse(HttpStatus.OK, 'Login any person to herafi system')
	@ApiBody({ type: AuthPerson, required: true, examples: {} })
	public async SignIn(@Body() authPerson: AuthPerson): Promise<string> {
		const repoResult = await this.authService.signIn(authPerson);
		if (repoResult.error) {
			throw new InternalServerErrorException(`${err}`);
		}

		return repoResult.result;
	}

	@Authenticated()
	@Post('verify-account/:personId')
	@ApiHttpResponse(
		HttpStatus.OK,
		'Verify user account when he firstly register to Herafi system'
	)
	@ApiQuery({
		name: 'verify_code',
		description:
			'verify code is about like multiple numbers that complete user registeration in Herafi system'
	})
	@ApiParam({
		name: 'personId',
		description: 'id of person that matched in db'
	})
	public async verifyAccount(
		@Param('id', ParseIntPipe) personId: number,
		@Query('verify_code') verifyCode: string
	): Promise<string> {
		const repoResult = await this.authService.verifAccount(
			personId,
			verifyCode
		);

		try {
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	@Post('logout/:personId')
	@ApiHttpResponse(
		HttpStatus.OK,
		'"log-out/:personId" route for making any person to logout from herafi system'
	)
	@ApiParam({
		example: 1,
		description: 'person id in db',
		required: true,
		type: Number,
		name: 'personId'
	})
	public logout(
		@Param('id', ParseIntPipe) personId: number
	): Promise<string> {
		try {
			return this.authService.logout(personId);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}
}
