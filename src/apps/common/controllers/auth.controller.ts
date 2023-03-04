import { VERSION_NEUTRAL } from '@nestjs/common/interfaces';
import { Post, Body, Param } from '@nestjs/common';
import {
	ApiController,
	ApiHttpResponse
} from 'src/helpers/decorators/swagger.decorator';
import { AuthService } from 'src/services/security/auth.service';
import { HttpStatus } from '@nestjs/common/enums';
import { CreatePerson } from 'src/data/dtos/person.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthPerson } from 'src/data/dtos/auth.dto';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { ParseIntPipe } from '@nestjs/common/pipes';

@ApiController({ path: 'auth', version: VERSION_NEUTRAL })
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('sign-up')
	@ApiHttpResponse(
		HttpStatus.CREATED,
		'"sign-up" Route for registering a new user to db',
		CreatePerson.name.toString()
	)
	@ApiBody({ type: CreatePerson, required: true, examples: {} })
	public async SignUp(
		@Body() createPersonDto: CreatePerson
	): Promise<string> {
		try {
			return this.authService.signUp(createPersonDto);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	@Post('sign-in')
	@ApiHttpResponse(
		HttpStatus.OK,
		'"sign-in" route for login any person to herafi system'
	)
	@ApiBody({ type: AuthPerson, required: true, examples: {} })
	public async SignIn(@Body() authPerson: AuthPerson): Promise<string> {
		try {
			return this.authService.signIn(authPerson);
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
