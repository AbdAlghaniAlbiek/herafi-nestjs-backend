import { Get, HttpCode, HttpStatus, VERSION_NEUTRAL } from '@nestjs/common';
import {
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger';
import { ProfitsPerDays } from 'src/data/dtos/admin-dtos/responses/dashboard-response.dto';
import { DashboardRepo } from 'src/data/repositories/controllers-repos/admin-repos/dashboard.repo';
import { UserRole } from 'src/helpers/constants/user-role.constants';
import { Authorized } from 'src/helpers/decorators/auth.decorator';
import { ApiController } from 'src/helpers/decorators/swagger.decorator';

@Authorized(UserRole.Admin)
@ApiController({ path: 'dashboard', version: VERSION_NEUTRAL })
export class DashboardController {
	constructor(private dashboardRepo: DashboardRepo) {}

	//#region swagger config
	@ApiOperation({ summary: 'Get profits per day for Herafi system' })
	@ApiOkResponse({
		description: 'Getting profits per day successfuly',
		type: ProfitsPerDays
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	//#endregion
	@Get('get-profits-per-day')
	@HttpCode(HttpStatus.OK)
	public getProfitsPerDay() {
		return this.dashboardRepo.getProfitsPerDay();
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get New members data' })
	@ApiOkResponse({
		description: 'Getting New members data successfuly',
		type: ProfitsPerDays
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	//#endregion
	@Get('get-new-members')
	@HttpCode(HttpStatus.OK)
	public getNewMembers() {
		return this.dashboardRepo.getNewMembers();
	}
}
