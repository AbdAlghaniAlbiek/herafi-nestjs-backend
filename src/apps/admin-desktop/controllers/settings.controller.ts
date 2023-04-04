import {
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	VERSION_NEUTRAL
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam
} from '@nestjs/swagger';
import { AdminProfileDto } from 'src/data/dtos/admin-dtos/responses/settings-respons.dto';
import { SettingsRepo } from 'src/data/repositories/admin-repos/settings.repo';
import { UserRole } from 'src/helpers/constants/user-role.constants';
import { Authorized } from 'src/helpers/decorators/auth.decorator';
import { ApiController } from 'src/helpers/decorators/swagger.decorator';

@Authorized(UserRole.Admin)
@ApiController({ path: 'settings', version: VERSION_NEUTRAL })
export class SettingsController {
	constructor(private settingsRepo: SettingsRepo) {}

	//#region swagger config
	@ApiOperation({ summary: 'Get admin profile data' })
	@ApiOkResponse({
		description: "Getting admin's profile successfuly",
		type: AdminProfileDto
	})
	@ApiBadRequestResponse({
		description:
			'When Param not match specified rules || When id not match any admin account in db'
	})
	@ApiNotFoundResponse({
		description: "When id of admin doesn't exist in db"
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiParam({
		name: 'adminId',
		required: true,
		type: Number,
		description: 'admin id in db'
	})
	//#endregion
	@Get('admin-profile/:adminId')
	@HttpCode(HttpStatus.OK)
	public getAdminProfile(@Param('adminId', ParseIntPipe) adminId: number) {
		return this.settingsRepo.getAdminProfile(adminId);
	}
}
