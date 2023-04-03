import {
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseEnumPipe,
	ParseIntPipe,
	Post,
	Query,
	VERSION_NEUTRAL
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery
} from '@nestjs/swagger';
import {
	CraftmanCategoryCrafts,
	CraftmanDetailsProfileDto,
	GeneralCraftmanDto,
	NewMembersCraftmanProfile
} from 'src/data/dtos/admin-dtos/responses/craftmen-response.dto';
import { CraftmanLevel } from 'src/data/entities/constants/craftman-level.constants';
import { Person } from 'src/data/entities/person.entity';
import { CraftmenRepo } from 'src/data/repositories/admin-repos/craftmen.repo';
import { UserRole } from 'src/helpers/constants/user-role.constants';
import { Authorized } from 'src/helpers/decorators/auth.decorator';
import { ApiController } from 'src/helpers/decorators/swagger.decorator';

@Authorized(UserRole.Admin)
@ApiController({ path: 'craftmen', version: VERSION_NEUTRAL })
export class CraftmenController {
	constructor(private craftmenRepo: CraftmenRepo) {}

	//#region swagger config
	@ApiOperation({ summary: 'Get the registered craftmen in Herafi system' })
	@ApiOkResponse({
		description: 'Getting craftmen that are registered successfuly',
		type: GeneralCraftmanDto
	})
	@ApiBadRequestResponse({
		description: 'When Queries not match specified rules'
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm error related just happened'
	})
	@ApiQuery({
		name: 'pages_size',
		required: true,
		type: Number,
		description: 'size of page data'
	})
	@ApiQuery({
		name: 'offset',
		required: true,
		type: Number,
		description: 'offset that take the next data page'
	})
	//#endregion
	@Get('general-craftmen')
	@HttpCode(HttpStatus.OK)
	public getGeneralCraftmen(
		@Query('page_size', ParseIntPipe) pageSize: number,
		@Query('offset', ParseIntPipe) offset: number
	) {
		return this.craftmenRepo.getGeneralCraftman(pageSize, offset);
	}

	//#region swagger config
	@ApiOperation({ summary: "Get details of craftman's profile" })
	@ApiOkResponse({
		description: 'Getting details of craftman profile successfuly',
		type: CraftmanDetailsProfileDto
	})
	@ApiBadRequestResponse({
		description:
			"When Params not match specified rules || When id of craftman doesn't exist in db"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm error related just happened'
	})
	@ApiParam({
		name: 'craftmanId',
		required: true,
		type: Number,
		description: "craftman's id in db"
	})
	//#endregion
	@Get('get-craftman-details-profile/:craftmanId')
	@HttpCode(HttpStatus.OK)
	public getCraftmanDetailsProfile(
		@Param('craftmanId', ParseIntPipe) craftmanId: number
	) {
		return this.craftmenRepo.getCraftmanDetailsProfile(craftmanId);
	}

	//#region swagger config
	@ApiOperation({ summary: "Get craftman's categories with its crafts" })
	@ApiOkResponse({
		description:
			"Getting craftman's categories with its crafts successfuly",
		type: [CraftmanCategoryCrafts],
		isArray: true
	})
	@ApiBadRequestResponse({
		description:
			"When Params not match specified rules || When id of craftman doesn't exist in db"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm error related just happened'
	})
	@ApiParam({
		name: 'craftmanId',
		required: true,
		type: Number,
		description: "craftmsn's id in db"
	})
	//#endregion
	@Get('get-craftman-details-crafts/:craftmanId')
	@HttpCode(HttpStatus.OK)
	public getCraftmanDetailsCrafts(
		@Param('craftmanId', ParseIntPipe) craftmanId: number
	) {
		return this.craftmenRepo.getCraftmanDetailsCrafts(craftmanId);
	}

	//#region swagger config
	@ApiOperation({ summary: "Get craftman's certifications" })
	@ApiOkResponse({
		description: "Getting craftman's certifications successfuly",
		type: [String]
	})
	@ApiBadRequestResponse({
		description:
			"When Params not match specified rules || When id of craftman doesn't exist in db"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm error related just happened'
	})
	@ApiParam({
		name: 'craftmanId',
		required: true,
		type: Number,
		description: "craftmsn's id in db"
	})
	//#endregion
	@Get('get-craftman-details-certifications/:craftmanId')
	@HttpCode(HttpStatus.OK)
	public getCraftmanDetailsCertifications(
		@Param('craftmanId', ParseIntPipe) craftmanId: number
	) {
		return this.craftmenRepo.getCraftmanDetailsCertifications(craftmanId);
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get Ids of New craftmen members' })
	@ApiOkResponse({
		description: 'Getting Ids of New craftmen members successfuly',
		type: [Number],
		isArray: true
	})
	@ApiBadRequestResponse({
		description: 'When Queries not match specified rules'
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm error related just happened'
	})
	@ApiQuery({
		name: 'page_size',
		required: true,
		type: Number,
		description: 'Data page size'
	})
	@ApiQuery({
		name: 'offset',
		required: true,
		type: Number,
		description: 'offset that will take data with specified page size'
	})
	//#endregion
	@Get('get-new-members-craftmen-ids')
	@HttpCode(HttpStatus.OK)
	public getNewMembersCraftmenIds(
		@Query('page_size', ParseIntPipe) pageSize: number,
		@Query('offset', ParseIntPipe) offset: number
	) {
		return this.craftmenRepo.getNewMembersCraftmenIds(pageSize, offset);
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get profile details of new memeber craftman' })
	@ApiOkResponse({
		description:
			'Getting profile details of new memeber craftman successfuly',
		type: NewMembersCraftmanProfile
	})
	@ApiBadRequestResponse({
		description:
			"When Param not match specified rules || When id of craftman doesn't exist in db"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm error related just happened'
	})
	@ApiParam({
		name: 'craftmanId',
		required: true,
		type: Number,
		description: 'id of craftman in db'
	})
	//#endregion
	@Get('get-new-member-craftman-profile/:craftmanId')
	@HttpCode(HttpStatus.OK)
	public getNewMembersCraftmanProfile(
		@Param('craftmanId', ParseIntPipe) craftmanId: number
	) {
		return this.craftmenRepo.getNewMemberCraftmanProfile(craftmanId);
	}

	//#region swagger config
	@ApiOperation({ summary: "Get categories' crafts of new craftman member" })
	@ApiOkResponse({
		description:
			"Getting categories' crafts of new craftman member successfuly",
		type: [CraftmanCategoryCrafts],
		isArray: true
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specified rules'
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm error related just happened'
	})
	@ApiParam({
		name: 'craftmanId',
		required: true,
		type: Number,
		description: 'id of craftman in db'
	})
	//#endregion
	@Get('get-new-members-craftman-crafts/:craftmanId')
	@HttpCode(HttpStatus.OK)
	public getNewMembersCraftmanCrafts(
		@Param('craftmanId', ParseIntPipe) craftmanId: number
	) {
		return this.craftmenRepo.getNewMembersCraftmanCrafts(craftmanId);
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get certifications of new craftman member' })
	@ApiOkResponse({
		description:
			'Getting certifications of new craftman member successfuly',
		type: [CraftmanCategoryCrafts],
		isArray: true
	})
	@ApiBadRequestResponse({
		description:
			"When Param not match specified rules || When id of craftman doesn't exist in db"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm error related just happened'
	})
	@ApiParam({
		name: 'craftmanId',
		required: true,
		type: Number,
		description: 'id of craftman in db'
	})
	//#endregion
	@Get('get-new-member-craftman-certifications')
	@HttpCode(HttpStatus.OK)
	public getNewMembersCraftmanCertifications(
		@Param('craftmanId', ParseIntPipe) craftmanId: number
	) {
		return this.craftmenRepo.getNewMembersCraftmanCertifications(
			craftmanId
		);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Accepting a new craftman member to Herafi system'
	})
	@ApiCreatedResponse({
		description:
			'Adding a new craftman member to Herafi system successfuly',
		type: Person
	})
	@ApiBadRequestResponse({
		description:
			"When Query/Param not match specified rules || When id of craftman doesn't exist in db"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm error related just happened'
	})
	@ApiParam({
		name: 'craftmanId',
		required: true,
		type: Number,
		description: 'id of craftman in db'
	})
	@ApiQuery({
		enumName: 'level',
		enum: CraftmanLevel,
		required: true,
		description: 'Level of craftman (Normal, Medium, Super)'
	})
	//#endregion
	@Post('accept-new-member-craftman/:craftmanId')
	@HttpCode(HttpStatus.CREATED)
	public acceptNewMemberCraftman(
		@Param('craftmanId', ParseIntPipe) craftmanId: number,
		@Query('level', new ParseEnumPipe(CraftmanLevel)) level: CraftmanLevel
	) {
		return this.craftmenRepo.acceptNewMemberCraftman(craftmanId, level);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Refuse a new craftman member'
	})
	@ApiOkResponse({
		description: 'Refusing a new craftman member without any error'
	})
	@ApiBadRequestResponse({
		description:
			"When Param not match specified rules || When id of craftman doesn't exist in db"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm error related just happened'
	})
	@ApiParam({
		name: 'craftmanId',
		required: true,
		type: Number,
		description: 'id of craftman in db'
	})
	//#endregion
	@Delete('refuse-new-member-craftman/:craftmanId')
	@HttpCode(HttpStatus.OK)
	public refuseNewMemberCraftman(
		@Param('craftmanId', ParseIntPipe) craftmanId: number
	) {
		return this.craftmenRepo.refusedNewMemeberCraftman(craftmanId);
	}
}
