import {
	Get,
	HttpCode,
	HttpStatus,
	ParseIntPipe,
	Query,
	VERSION_NEUTRAL
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiQuery
} from '@nestjs/swagger';
import {
	EntityPerDateDetailsDto,
	EntityPerDayDetailsDto,
	ProfitsPerDateDetailsDto,
	ProfitsPerDayDetailsDto
} from 'src/data/dtos/admin-dtos/responses/analyzes-response.dto';
import { AnalyzesRepo } from 'src/data/repositories/admin-repos/analyzes.repo';
import { UserRole } from 'src/helpers/constants/user-role.constants';
import { Authorized } from 'src/helpers/decorators/auth.decorator';
import { ApiController } from 'src/helpers/decorators/swagger.decorator';

@Authorized(UserRole.Admin)
@ApiController({ path: 'analyzes', version: VERSION_NEUTRAL })
export class AnalyzesController {
	constructor(private analyzesRepo: AnalyzesRepo) {}

	//#region Profits routes

	//#region swagger config
	@ApiOperation({ summary: 'Get the yearly profits in Herafi system' })
	@ApiOkResponse({
		description: 'Getting the yearly profits successfuly',
		type: [Number],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	//#endregion
	@Get('get-profits-years')
	@HttpCode(HttpStatus.OK)
	public getProfitsYears() {
		return this.analyzesRepo.getProfitsYears();
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get the Monthly profits in Herafi system' })
	@ApiOkResponse({
		description: 'Getting the Monthly profits successfuly',
		type: [Number],
		isArray: true
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-profits-months')
	@HttpCode(HttpStatus.OK)
	public getProfitsMonths(@Query('year', ParseIntPipe) year: number) {
		return this.analyzesRepo.getProfitsMonths(year);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get the yearly details profits in Herafi system'
	})
	@ApiOkResponse({
		description: 'Getting the yearly details profits successfuly',
		type: [ProfitsPerDateDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	//#endregion
	@Get('get-profits-years-details')
	@HttpCode(HttpStatus.OK)
	public getProfitsYearsDetails() {
		return this.analyzesRepo.getProfitsYearsDetails();
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get the Monthly details profits in Herafi system'
	})
	@ApiOkResponse({
		description: 'Getting the Monthly details profits successfuly',
		type: [ProfitsPerDateDetailsDto],
		isArray: true
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	//#endregion
	@HttpCode(HttpStatus.OK)
	@Get('get-profits-months-details')
	public getProfitsMonthsDetails(@Query('year', ParseIntPipe) year: number) {
		return this.analyzesRepo.getProfitsMonthsDetails(year);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get the daily details profits in Herafi system'
	})
	@ApiOkResponse({
		description: 'Getting the daily details profits successfuly',
		type: [ProfitsPerDayDetailsDto],
		isArray: true
	})
	@ApiBadRequestResponse({
		description: 'When Param not match specific rules'
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	@ApiQuery({
		name: 'month',
		description: 'numeric month',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-profits-months-details')
	@HttpCode(HttpStatus.OK)
	public getProfitsDaysDetails(
		@Query('year', ParseIntPipe) year: number,
		@Query('month', ParseIntPipe) month: number
	) {
		return this.analyzesRepo.getProfitsDaysDetails(year, month);
	}

	//#endregion

	/*************************  Craftmen section  *************************/

	//#region Craftmen routes

	//#region swagger config
	@ApiOperation({ summary: 'Get yearly craftmen registeration average' })
	@ApiOkResponse({
		description:
			'Getting the yearly craftmen registeration average successfuly',
		type: [Number],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	//#endregion
	@Get('get-craftmen-years')
	@HttpCode(HttpStatus.OK)
	public getCraftmenYears() {
		return this.analyzesRepo.getCraftmenYears();
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get monthly craftmen registeration average' })
	@ApiOkResponse({
		description:
			'Getting the monthly craftmen registeration average successfuly',
		type: [Number],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	//#endregion
	@HttpCode(HttpStatus.OK)
	@Get('get-craftmen-months')
	public getCraftmenMonths(@Query('year', ParseIntPipe) year: number) {
		return this.analyzesRepo.getCraftmenMonths(year);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get details of yearly craftmen registeration average'
	})
	@ApiOkResponse({
		description:
			'Getting detaile of yearly craftmen registeration average successfuly',
		type: [EntityPerDateDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	//#endregion
	@Get('get-craftmen-years-details')
	@HttpCode(HttpStatus.OK)
	public getCraftmenYearsDetails() {
		return this.analyzesRepo.getCraftmenYearsDetails();
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get details of monthly craftmen registeration average'
	})
	@ApiOkResponse({
		description:
			'Getting detaile of monthly craftmen registeration average successfuly',
		type: [EntityPerDateDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-craftmen-months-details')
	@HttpCode(HttpStatus.OK)
	public getCraftmenMonthsDetails(@Query('year', ParseIntPipe) year: number) {
		return this.analyzesRepo.getCraftmenMonthsDetails(year);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get details of daily craftmen registeration average'
	})
	@ApiOkResponse({
		description:
			'Getting detaile of daily craftmen registeration average successfuly',
		type: [EntityPerDayDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	@ApiQuery({
		name: 'month',
		description: 'numeric month',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-craftmen-months-details')
	@HttpCode(HttpStatus.OK)
	public getCraftmenDaysDetail(
		@Query('year', ParseIntPipe) year: number,
		@Query('month', ParseIntPipe) month: number
	) {
		return this.analyzesRepo.getCraftmenDaysDetail(year, month);
	}

	//#endregion

	/*************************  Users section  *************************/

	//#region Users routes

	//#region swagger config
	@ApiOperation({ summary: 'Get yearly users registeration average' })
	@ApiOkResponse({
		description:
			'Getting the yearly users registeration average successfuly',
		type: [Number],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	//#endregion
	@Get('get-users-years')
	@HttpCode(HttpStatus.OK)
	public getUsersYears() {
		return this.analyzesRepo.getUsersYears();
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get monthly users registeration average' })
	@ApiOkResponse({
		description:
			'Getting the users craftmen registeration average successfuly',
		type: [Number],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-users-months')
	@HttpCode(HttpStatus.OK)
	public getUsersMonths(@Query('year', ParseIntPipe) year: number) {
		return this.analyzesRepo.getUsersMonths(year);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get details of yearly users registeration average'
	})
	@ApiOkResponse({
		description:
			'Getting detaile of yearly users registeration average successfuly',
		type: [EntityPerDateDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	//#endregion
	@Get('get-users-years-details')
	@HttpCode(HttpStatus.OK)
	public getUsersYearsDetail() {
		return this.analyzesRepo.getUsersYearsDetail();
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get details of monthly users registeration average'
	})
	@ApiOkResponse({
		description:
			'Getting detaile of monthly users registeration average successfuly',
		type: [EntityPerDateDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-users-months-details')
	@HttpCode(HttpStatus.OK)
	public getUsersMonthsDetail(@Query('year', ParseIntPipe) year: number) {
		return this.analyzesRepo.getUsersMonthsDetail(year);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get details of daily users registeration average'
	})
	@ApiOkResponse({
		description:
			'Getting details of daily users registeration average successfuly',
		type: [EntityPerDayDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	@ApiQuery({
		name: 'month',
		description: 'numeric month',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-users-days-details')
	@HttpCode(HttpStatus.OK)
	public getUsersDaysDetail(
		@Query('year', ParseIntPipe) year: number,
		@Query('month', ParseIntPipe) month: number
	) {
		return this.analyzesRepo.getUsersDaysDetail(year, month);
	}

	//#endregion

	/*************************  Requests section  *************************/

	//#region Requests routes

	//#region swagger config
	@ApiOperation({ summary: 'Get yearly requests registeration average' })
	@ApiOkResponse({
		description:
			'Getting the yearly requests registeration average successfuly',
		type: [Number],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	//#endregion
	@Get('get-requests-years')
	@HttpCode(HttpStatus.OK)
	public getRequestsYears() {
		return this.analyzesRepo.getRequestsYears();
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get monthly requests registeration average' })
	@ApiOkResponse({
		description:
			'Getting the requests craftmen registeration average successfuly',
		type: [Number],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-requests-months')
	@HttpCode(HttpStatus.OK)
	public getRequestsMonths(@Query('year', ParseIntPipe) year: number) {
		return this.analyzesRepo.getRequestsMonths(year);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get details of yearly requests registeration average'
	})
	@ApiOkResponse({
		description:
			'Getting details of yearly requests registeration average successfuly',
		type: [EntityPerDateDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	//#endregion
	@Get('get-requests-years-details')
	@HttpCode(HttpStatus.OK)
	public getRequestsYearsDetail() {
		return this.analyzesRepo.getRequestsYearsDetail();
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get details of monthly requests registeration average'
	})
	@ApiOkResponse({
		description:
			'Getting detaile of monthly requests registeration average successfuly',
		type: [EntityPerDateDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-requests-months-details')
	@HttpCode(HttpStatus.OK)
	public getRequestsMonthsDetail(@Query('year', ParseIntPipe) year: number) {
		return this.analyzesRepo.getRequestsMonthsDetail(year);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get details of daily requests registeration average'
	})
	@ApiOkResponse({
		description:
			'Getting details of daily requests registeration average successfuly',
		type: [EntityPerDayDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	@ApiQuery({
		name: 'month',
		description: 'numeric month',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-requests-days-details')
	@HttpCode(HttpStatus.OK)
	public getRequestsDaysDetail(
		@Query('year', ParseIntPipe) year: number,
		@Query('month', ParseIntPipe) month: number
	) {
		return this.analyzesRepo.getRequestsDaysDetail(year, month);
	}

	//#endregion

	/*************************  Reports section  *************************/

	//#region Reports routes

	//#region swagger config
	@ApiOperation({ summary: 'Get yearly reports registeration average' })
	@ApiOkResponse({
		description:
			'Getting the yearly reports registeration average successfuly',
		type: [Number],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	//#endregion
	@Get('get-reports-years')
	@HttpCode(HttpStatus.OK)
	public getReportsYears() {
		return this.analyzesRepo.getReportsYears();
	}

	//#region swagger config
	@ApiOperation({ summary: 'Get monthly reports registeration average' })
	@ApiOkResponse({
		description:
			'Getting the reports craftmen registeration average successfuly',
		type: [Number],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-reports-months')
	@HttpCode(HttpStatus.OK)
	public getReportsMonths(@Query('year', ParseIntPipe) year: number) {
		return this.analyzesRepo.getReportsMonths(year);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get details of yearly reports registeration average'
	})
	@ApiOkResponse({
		description:
			'Getting details of yearly reports registeration average successfuly',
		type: [EntityPerDateDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	//#endregion
	@Get('get-reports-years-details')
	@HttpCode(HttpStatus.OK)
	public getReportsYearsDetail() {
		return this.analyzesRepo.getReportsYearsDetail();
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get details of monthly reports registeration average'
	})
	@ApiOkResponse({
		description:
			'Getting detaile of monthly reports registeration average successfuly',
		type: [EntityPerDateDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-reports-months-details')
	@HttpCode(HttpStatus.OK)
	public getReportsMonthsDetail(@Query('year', ParseIntPipe) year: number) {
		return this.analyzesRepo.getReportsMonthsDetail(year);
	}

	//#region swagger config
	@ApiOperation({
		summary: 'Get details of daily reports registeration average'
	})
	@ApiOkResponse({
		description:
			'Getting details of daily reports registeration average successfuly',
		type: [EntityPerDayDetailsDto],
		isArray: true
	})
	@ApiInternalServerErrorResponse({
		description: 'When TypeOrm related error just occurs'
	})
	@ApiQuery({
		name: 'year',
		description: 'numeric year',
		required: true,
		type: Number
	})
	@ApiQuery({
		name: 'month',
		description: 'numeric month',
		required: true,
		type: Number
	})
	//#endregion
	@Get('get-reports-days-details')
	@HttpCode(HttpStatus.OK)
	public getReportsDaysDetail(
		@Query('year', ParseIntPipe) year: number,
		@Query('month', ParseIntPipe) month: number
	) {
		return this.analyzesRepo.getReportsDaysDetail(year, month);
	}

	//#endregion
}
