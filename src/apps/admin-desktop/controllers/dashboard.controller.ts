import { Get, VERSION_NEUTRAL } from '@nestjs/common';
import {
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger';
import { ProfitsPerDays } from 'src/data/dtos/admin-dtos/responses/dashboard-response.dto';
import { DashboardRepo } from 'src/data/repositories/admin-repos/dashboard.repo';
import { ApiController } from 'src/helpers/decorators/swagger.decorator';

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
	public getNewMembers() {
		return this.dashboardRepo.getNewMembers();
	}
}
