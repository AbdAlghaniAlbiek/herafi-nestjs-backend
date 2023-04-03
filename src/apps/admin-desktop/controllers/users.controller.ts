import {
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Put,
	Query,
	VERSION_NEUTRAL
} from '@nestjs/common';
import { ApiController } from 'src/helpers/decorators/swagger.decorator';
import { UsersRepo } from '../../../data/repositories/admin-repos/users.repo';
import { Authorized } from 'src/helpers/decorators/auth.decorator';
import { UserRole } from 'src/helpers/constants/user-role.constants';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery
} from '@nestjs/swagger';
import {
	GeneralUserDto,
	NewMembersUserDto,
	UserDetailsProfileDto
} from 'src/data/dtos/admin-dtos/responses/users-response.dto';

@Authorized(UserRole.Admin)
@ApiController({ path: 'users', version: VERSION_NEUTRAL })
export class UsersController {
	constructor(private usersRepo: UsersRepo) {}

	//#region swagger config
	@ApiOperation({
		summary: 'Getting general users (already registered to Herafi system)'
	})
	@ApiOkResponse({
		description: 'Returning users that already registered successfuly',
		isArray: true,
		type: [GeneralUserDto]
	})
	@ApiBadRequestResponse({
		description: "When Query don't match specified rules"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TyprOrm related error just occurs'
	})
	@ApiQuery({
		name: 'page_size',
		description: "size of page's data list",
		type: Number,
		required: true
	})
	@ApiQuery({
		name: 'offset',
		description: 'offset after getting previous data',
		type: Number,
		required: true
	})
	//#endregion
	@Get('general-user')
	@HttpCode(HttpStatus.OK)
	public getGeneralUser(
		@Query('page_size', ParseIntPipe) pageSize: number,
		@Query('offset', ParseIntPipe) offset: number
	) {
		return this.usersRepo.getGeneralUsers(pageSize, offset);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Getting registerd user details profile'
	})
	@ApiOkResponse({
		description: "Returning details of user's profile successfuly",
		type: UserDetailsProfileDto
	})
	@ApiBadRequestResponse({
		description: "When Query don't match specified rules"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TyprOrm related error just occurs'
	})
	@ApiParam({
		name: 'userId',
		description: 'user id that existed in db',
		type: Number,
		required: true
	})
	//#endregion
	@Get('user-details-profile/:userId')
	@HttpCode(HttpStatus.OK)
	public getUserDetailsProfile(
		@Param('userId', ParseIntPipe) userId: number
	) {
		return this.usersRepo.getUserDetailsProfile(userId);
	}

	//#region swagger config
	@ApiOperation({
		summary: "Getting details of user's request"
	})
	@ApiOkResponse({
		description: "Returning details of user's request succesfuly",
		type: UserDetailsProfileDto
	})
	@ApiBadRequestResponse({
		description: "When Param don't match specified rules"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TyprOrm related error just occurs'
	})
	@ApiParam({
		name: 'userId',
		description: 'user id that existed in db',
		type: Number,
		required: true
	})
	//#endregion
	@Get('user-details-requests')
	@HttpCode(HttpStatus.OK)
	public getUserDetailsRequest(
		@Param('userId', ParseIntPipe) userId: number
	) {
		return this.usersRepo.getUserDetailsRequest(userId);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Getting new users members Ids'
	})
	@ApiOkResponse({
		description: 'Returning new registered users members Ids successfuly',
		isArray: true,
		type: [Number]
	})
	@ApiBadRequestResponse({
		description: "When Query don't match specified rules"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TyprOrm related error just occurs'
	})
	@ApiQuery({
		name: 'page_size',
		description: "size of page's data list",
		type: Number,
		required: true
	})
	@ApiQuery({
		name: 'offset',
		description: 'offset after getting previous data',
		type: Number,
		required: true
	})
	//#endregion
	@Get('new-members-ids')
	@HttpCode(HttpStatus.OK)
	public getNewMemebersUsersIds(
		@Query('page_size', ParseIntPipe) pageSize: number,
		@Query('offset', ParseIntPipe) offset: number
	) {
		return this.usersRepo.getNewMemebersUsersIds(pageSize, offset);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Getting new member user'
	})
	@ApiOkResponse({
		description: 'Returning new user based on his id succesfuly',
		type: NewMembersUserDto
	})
	@ApiBadRequestResponse({
		description: "When Param don't match specified rules"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TyprOrm related error just occurs'
	})
	@ApiParam({
		name: 'userId',
		description: 'user id that existed in db',
		type: Number,
		required: true
	})
	//#endregion
	@Get('new-member-user/:userId')
	@HttpCode(HttpStatus.OK)
	public getNewMemeberUser(@Param('userId', ParseIntPipe) userId: number) {
		return this.usersRepo.getNewMemeberUser(userId);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Accepting new member user to Herafi system'
	})
	@ApiOkResponse({
		description: 'Returning email and verify code of this new user'
	})
	@ApiBadRequestResponse({
		description: "When Param don't match specified rules"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TyprOrm related error just occurs'
	})
	@ApiParam({
		name: 'userId',
		description: 'user id that existed in db',
		type: Number,
		required: true
	})
	//#endregion
	@Put('accept-new-member-user/:userId')
	@HttpCode(HttpStatus.OK)
	public acceptNewMemeberUser(@Param('userId', ParseIntPipe) userId: number) {
		return this.usersRepo.acceptNewMemeberUser(userId);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Getting'
	})
	@ApiOkResponse({
		description: 'Returning email and verify code of this new user'
	})
	@ApiBadRequestResponse({
		description: "When Param don't match specified rules"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TyprOrm related error just occurs'
	})
	@ApiParam({
		name: 'userId',
		description: 'user id that existed in db',
		type: Number,
		required: true
	})
	//#endregion
	@Get('refused-new-member-user/:userId')
	@HttpCode(HttpStatus.OK)
	public getRefusedNewMemeberUserPhotos(
		@Param('userId', ParseIntPipe) userId: number
	) {
		return this.usersRepo.refusedNewMemeberUser(userId);
	}
}
