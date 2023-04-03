import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	EntityPerDateDetailsDto,
	ProfitsPerDayDetailsDto,
	ProfitsPerDateDetailsDto,
	EntityPerDayDetailsDto
} from 'src/data/dtos/admin-dtos/responses/analyzes-response.dto';
import { PersonRole } from 'src/data/entities/constants/person-role.constants';
import { Person } from 'src/data/entities/person.entity';
import { Request } from 'src/data/entities/request.entity';
import { Role } from 'src/data/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyzesRepo {
	constructor(
		@InjectRepository(Request) private requestRepo: Repository<Request>,
		@InjectRepository(Person) private personRepo: Repository<Person>,
		@InjectRepository(Report) private reportsRepo: Repository<Report>
	) {}

	//#region profits analyzes

	public async getProfitsYears() {
		try {
			const requestsYears = await this.requestRepo
				.createQueryBuilder('r')
				.select("DATE_PART('YEAR', TIMESTAMP r.end_date)", 'year')
				.distinct(true)
				.where('r.end_date IS NOT NULL')
				.orderBy('year', 'DESC')
				.getRawMany();

			return requestsYears.map((req) => req.year);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getProfitsMonths(year: number) {
		try {
			const requestsMonths = await this.requestRepo
				.createQueryBuilder('r')
				.select("DATE_PART('MONTH', TIMESTAMP r.end_date)', 'month")
				.distinct(true)
				.where(
					"DATE_PART('MONTH', TIMESTAMP r.end_date) = :year AND r.end_date IS NOT NULL",
					{
						year
					}
				)
				.orderBy('month', 'DESC')
				.getRawMany();

			return requestsMonths.map((req) => req.month);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getProfitsYearsDetails() {
		try {
			const queryResult = await this.requestRepo
				.createQueryBuilder('r')
				.select("DATE_PART('YEAR', TIMESTAMP r.end_date)", 'year')
				.addSelect('SUM(r.total_cost)', 'paids')
				.where('r.end_date IS NOT NULL')
				.groupBy('year')
				.getRawMany();

			return queryResult.map(
				(proDet) =>
					new ProfitsPerDateDetailsDto(proDet.year, proDet.paids)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getProfitsMonthsDetails(year: number) {
		try {
			const queryResult = await this.requestRepo
				.createQueryBuilder('r')
				.select("DATE_PART('MONTH', TIMESTAMP r.end_date)", 'month')
				.addSelect('SUM(r.total_cost)', 'paids')
				.where('r.end_date IS NOT NULL')
				.andWhere("DATE_PART('YEAR', TIMESTAMP r.end_date) = :year", {
					year
				})
				.groupBy('month')
				.getRawMany();

			return queryResult.map(
				(proDet) =>
					new ProfitsPerDateDetailsDto(proDet.month, proDet.paids)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getProfitsDaysDetails(year: number, month: number) {
		try {
			const queryResult = await this.requestRepo
				.createQueryBuilder('r')
				.select("DATE_PART('YEAR', TIMESTAMP r.end_date)", 'year')
				.addSelect("DATE_PART('MONTH', TIMESTAMP r.end_date)", 'month')
				.addSelect("DATE_PART('DAY', TIMESTAMP r.end_date)", 'day')
				.addSelect('SUM(r.total_cost)', 'paids')
				.where('r.end_date IS NOT NULL')
				.andWhere("DATE_PART('YEAR', TIMESTAMP r.end_date) = :year", {
					year
				})
				.andWhere("DATE_PART('MONTH', TIMESTAMP r.end_date) = :month", {
					month
				})
				.groupBy('year')
				.addGroupBy('month')
				.addGroupBy('day')
				.getRawOne();

			return queryResult.map(
				(proDet) =>
					new ProfitsPerDayDetailsDto(
						proDet.year,
						proDet.month,
						proDet.day,
						proDet.paids
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	//#endregion

	//#region craftmen analyzes

	public async getCraftmenYears(): Promise<number[]> {
		try {
			const craftmenYears = await this.personRepo
				.createQueryBuilder('p')
				.select("DATE_PART('YEAR', TIMESTAMP p.date_join)", 'year')
				.distinct(true)
				.where(
					'p.date_join IS NOT NULL AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = t'
				)
				.orderBy('year')
				.getRawMany();

			return craftmenYears.map((crafYear) => crafYear.year);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getCraftmenMonths(year: number): Promise<number[]> {
		try {
			const craftmenMonths = await this.personRepo
				.createQueryBuilder('p')
				.select("DATE_PART('MONTH', TIMESTAMP p.date_join)", 'month')
				.distinct(true)
				.where("DATE_PART('YEAR', TIMESTAMP p.date_join) = :year", {
					year
				})
				.andWhere(
					'p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = t'
				)
				.orderBy('month')
				.getRawMany();

			return craftmenMonths.map((crafMon) => crafMon.month);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getCraftmenYearsDetails() {
		try {
			const craftmenYearsDetails = await this.personRepo
				.createQueryBuilder('p')
				.select("DATE_PART('YEAR', TIMESTAMP p.date_join)", 'year')
				.addSelect('COUNT(p.id)', 'users_number')
				.where(
					"DATE_PART('YEAR', TIMESTAMP p.date_join) <> 0 AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = t"
				)
				.groupBy('year')
				.getRawMany();

			return craftmenYearsDetails.map(
				(craftYeaDet) =>
					new EntityPerDateDetailsDto(
						craftYeaDet.year,
						craftYeaDet.craftman_number
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getCraftmenMonthsDetails(year: number) {
		try {
			const craftmenMonthsDetails = await this.personRepo
				.createQueryBuilder('p')
				.select("DATE_PART('MONTH', TIMESTAMP p.date_join)", 'month')
				.addSelect('COUNT(p.id)', 'users_number')
				.where(
					"DATE_PART('MONTH', TIMESTAMP p.date_join) <> 0 AND DATE_PART('YEAR', TIMESTAMP p.date_join) = :year AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = t",
					{
						year
					}
				)
				.groupBy('month')
				.getRawMany();

			return craftmenMonthsDetails.map(
				(craftYeaDet) =>
					new EntityPerDateDetailsDto(
						craftYeaDet.month,
						craftYeaDet.craftman_number
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getCraftmenDaysDetail(year: number, month: number) {
		try {
			const craftmenDayDetails = await this.personRepo
				.createQueryBuilder('p')
				.select("DATE_PART('YEAR', TIMESTAMP p.date_join)", 'year')
				.addSelect("DATE_PART('MONTH', TIMESTAMP p.date_join)", 'month')
				.addSelect("DATE_PART('DAY', TIMESTAMP p.date_join)", 'day')
				.addSelect('COUNT(p.id)', 'users_number')
				.where(
					"DATE_PART('YEAR', TIMESTAMP p.date_join) = :year AND DATE_PART('MONTH', TIMESTAMP p.date_join) = :month AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = t",
					{
						year,
						month
					}
				)
				.groupBy('year')
				.addGroupBy('month')
				.addGroupBy('day')
				.getRawMany();

			return craftmenDayDetails.map(
				(craftDayDet) =>
					new EntityPerDayDetailsDto(
						craftDayDet.year,
						craftDayDet.month,
						craftDayDet.day,
						craftDayDet.craftman_number
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	//#endregion

	//#region users analyzes

	public async getUsersYears(): Promise<number[]> {
		try {
			const usersYears = await this.personRepo
				.createQueryBuilder()
				.select("DATE_PART('YEAR', TIMESTAMP p.date_join)", 'year')
				.distinct(true)
				.from(Person, 'p')
				.innerJoin(Role, 'role', 'p.role_id = role.id')
				.where(
					'p.date_join IS NOT NULL AND p.lowest_cost = 0 AND p.highest_cost = 0 AND p.verified = t'
				)
				.andWhere('rol.person_role = :persRole', {
					persRole: PersonRole.Admin
				})
				.orderBy('year')
				.getRawMany();

			return usersYears.map((userYear) => userYear.year);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getUsersMonths(year: number): Promise<number[]> {
		try {
			const usersMonths = await this.personRepo
				.createQueryBuilder()
				.select("DATE_PART('MONTH', TIMESTAMP p.date_join)", 'month')
				.distinct(true)
				.from(Person, 'p')
				.innerJoin(Role, 'role', 'role.id = p.role_id')
				.where("DATE_PART('YEAR', TIMESTAMP p.date_join) = :year", {
					year
				})
				.andWhere(
					'p.lowest_cost = 0 AND p.highest_cost = 0 AND p.verified = t'
				)
				.andWhere('role.person_role = :persRole', {
					persRole: PersonRole.Admin
				})
				.orderBy('month')
				.getRawMany();

			return usersMonths.map((userMon) => userMon.month);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getUsersYearsDetail() {
		try {
			const usersYearsDetails = await this.personRepo
				.createQueryBuilder()
				.select("DATE_PART('YEAR', TIMESTAMP p.date_join)", 'year')
				.addSelect('COUNT(p.id)', 'users_number')
				.from(Person, 'p')
				.innerJoin(Role, 'role', 'role.id = p.role_id')
				.where(
					"DATE_PART('YEAR', TIMESTAMP p.date_join) <> 0 AND p.lowest_cost = 0 AND p.highest_cost = 0 AND p.verified = t"
				)
				.andWhere('role.person_role = :persRole', {
					persRole: PersonRole.Admin
				})
				.groupBy('year')
				.getRawMany();

			return usersYearsDetails.map(
				(userYeaDet) =>
					new EntityPerDateDetailsDto(
						userYeaDet.year,
						userYeaDet.users_number
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getUsersMonthsDetail(year: number) {
		try {
			const usersMonthsDetails = await this.personRepo
				.createQueryBuilder()
				.select("DATE_PART('MONTH', TIMESTAMP p.date_join)", 'month')
				.addSelect('COUNT(p.id)', 'users_number')
				.from(Person, 'p')
				.innerJoin(Role, 'role', 'role.id = p.role_id')
				.where(
					"DATE_PART('MONTH', TIMESTAMP p.date_join) <> 0 AND DATE_PART('YEAR', TIMESTAMP p.date_join) = :year AND p.lowest_cost = 0 AND p.highest_cost = 0 AND p.verified = t",
					{
						year
					}
				)
				.andWhere('role.person_role = :persRole', {
					persRole: PersonRole.Admin
				})
				.groupBy('month')
				.getRawMany();

			return usersMonthsDetails.map(
				(userYeaDet) =>
					new EntityPerDateDetailsDto(
						userYeaDet.month,
						userYeaDet.users_number
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getUsersDaysDetail(year: number, month: number) {
		try {
			const usersDayDetails = await this.personRepo
				.createQueryBuilder()
				.select("DATE_PART('YEAR', TIMESTAMP p.date_join)", 'year')
				.addSelect("DATE_PART('MONTH', TIMESTAMP p.date_join)", 'month')
				.addSelect("DATE_PART('DAY', TIMESTAMP p.date_join)", 'day')
				.addSelect('COUNT(p.id)', 'users_number')
				.from(Person, 'p')
				.innerJoin(Role, 'role', 'role.id = p.role_id')
				.where(
					"DATE_PART('YEAR', TIMESTAMP p.date_join) = :year AND DATE_PART('MONTH', TIMESTAMP p.date_join) = :month AND p.lowest_cost = 0 AND p.highest_cost = 0 AND p.verified = t",
					{
						year,
						month
					}
				)
				.andWhere('role.person_role = :persRole', {
					persRole: PersonRole.Admin
				})
				.groupBy('year')
				.addGroupBy('month')
				.addGroupBy('day')
				.getRawMany();

			return usersDayDetails.map(
				(craftDayDet) =>
					new EntityPerDayDetailsDto(
						craftDayDet.year,
						craftDayDet.month,
						craftDayDet.day,
						craftDayDet.users_number
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	//#endregion

	//#region requests analyzes

	public async getRequestsYears(): Promise<number[]> {
		try {
			const requestsYears = await this.requestRepo
				.createQueryBuilder('r')
				.select("DATE_PART('YEAR', TIMESTAMP r.start_date)", 'year')
				.distinct(true)
				.where('r.start_join IS NOT NULL')
				.orderBy('year', 'DESC')
				.getRawMany();

			return requestsYears.map((reqYear) => reqYear.year);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getRequestsMonths(year: number): Promise<number[]> {
		try {
			const requestsMonths = await this.requestRepo
				.createQueryBuilder('r')
				.select("DATE_PART('MONTH', TIMESTAMP r.start_date)", 'month')
				.distinct(true)
				.where("DATE_PART('YEAR', TIMESTAMP r.start_date) = :year", {
					year
				})
				.andWhere('r.start_date IS NOT NULL')
				.orderBy('month', 'DESC')
				.getRawMany();

			return requestsMonths.map((reqMon) => reqMon.month);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getRequestsYearsDetail() {
		try {
			const requestsYearsDetails = await this.requestRepo
				.createQueryBuilder('r')
				.select("DATE_PART('YEAR', TIMESTAMP r.start_date)", 'year')
				.addSelect('COUNT(r.id)', 'requests_number')
				.where('r.start_date IS NOT NULL')
				.groupBy('year')
				.getRawMany();

			return requestsYearsDetails.map(
				(reqYeaDet) =>
					new EntityPerDateDetailsDto(
						reqYeaDet.year,
						reqYeaDet.requests_number
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getRequestsMonthsDetail(year: number) {
		try {
			const requestsMonthsDetails = await this.requestRepo
				.createQueryBuilder('r')
				.select("DATE_PART('MONTH', TIMESTAMP r.start_date)", 'month')
				.addSelect('COUNT(r.id)', 'requests_number')
				.where(
					"r.start_date IS NOT NULL AND DATE_PART('YEAR', TIMESTAMP r.start_date) = :year",
					{
						year
					}
				)
				.groupBy('month')
				.getRawMany();

			return requestsMonthsDetails.map(
				(reqYeaDet) =>
					new EntityPerDateDetailsDto(
						reqYeaDet.month,
						reqYeaDet.requests_number
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getRequestsDaysDetail(year: number, month: number) {
		try {
			const requestsDayDetails = await this.requestRepo
				.createQueryBuilder('r')
				.select("DATE_PART('YEAR', TIMESTAMP r.start_date)", 'year')
				.addSelect(
					"DATE_PART('MONTH', TIMESTAMP r.start_date)",
					'month'
				)
				.addSelect("DATE_PART('DAY', TIMESTAMP r.start_date)", 'day')
				.addSelect('COUNT(r.id)', 'requests_number')
				.where(
					"DATE_PART('YEAR', TIMESTAMP r.start_date) = :year AND DATE_PART('MONTH', TIMESTAMP r.start_date) = :month AND r.start_date IS NOT NULL",
					{
						year,
						month
					}
				)
				.groupBy('year')
				.addGroupBy('month')
				.addGroupBy('day')
				.getRawMany();

			return requestsDayDetails.map(
				(reqDayDet) =>
					new EntityPerDayDetailsDto(
						reqDayDet.year,
						reqDayDet.month,
						reqDayDet.day,
						reqDayDet.requests_number
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	//#endregion

	//#region reports analyzes

	public async getReportsYears(): Promise<number[]> {
		try {
			const reportsYears = await this.reportsRepo
				.createQueryBuilder('r')
				.select("DATE_PART('YEAR', TIMESTAMP r.date)", 'year')
				.distinct(true)
				.where('r.date IS NOT NULL')
				.orderBy('year', 'DESC')
				.getRawMany();

			return reportsYears.map((repYear) => repYear.year);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getReportsMonths(year: number): Promise<number[]> {
		try {
			const reportsMonths = await this.reportsRepo
				.createQueryBuilder('r')
				.select("DATE_PART('MONTH', TIMESTAMP r.date)", 'month')
				.distinct(true)
				.where("DATE_PART('YEAR', TIMESTAMP r.date) = :year", {
					year
				})
				.andWhere('r.date IS NOT NULL')
				.orderBy('month', 'DESC')
				.getRawMany();

			return reportsMonths.map((repMon) => repMon.month);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getReportsYearsDetail() {
		try {
			const reportsYearsDetails = await this.reportsRepo
				.createQueryBuilder('r')
				.select("DATE_PART('YEAR', TIMESTAMP r.date)", 'year')
				.addSelect('COUNT(r.id)', 'reports_number')
				.where('r.date IS NOT NULL')
				.groupBy('year')
				.getRawMany();

			return reportsYearsDetails.map(
				(repYeaDet) =>
					new EntityPerDateDetailsDto(
						repYeaDet.year,
						repYeaDet.reports_number
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getReportsMonthsDetail(year: number) {
		try {
			const reportsMonthsDetails = await this.reportsRepo
				.createQueryBuilder('r')
				.select("DATE_PART('MONTH', TIMESTAMP r.date)", 'month')
				.addSelect('COUNT(r.id)', 'reports_number')
				.where(
					"r.start_date IS NOT NULL AND DATE_PART('YEAR', TIMESTAMP r.date) = :year",
					{
						year
					}
				)
				.groupBy('month')
				.getRawMany();

			return reportsMonthsDetails.map(
				(repYeaDet) =>
					new EntityPerDateDetailsDto(
						repYeaDet.month,
						repYeaDet.reports_number
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getReportsDaysDetail(year: number, month: number) {
		try {
			const reportsDayDetails = await this.reportsRepo
				.createQueryBuilder('r')
				.select("DATE_PART('YEAR', TIMESTAMP r.date)", 'year')
				.addSelect("DATE_PART('MONTH', TIMESTAMP r.date)", 'month')
				.addSelect("DATE_PART('DAY', TIMESTAMP r.date)", 'day')
				.addSelect('COUNT(r.id)', 'reports_number')
				.where(
					"DATE_PART('YEAR', TIMESTAMP r.date) = :year AND DATE_PART('MONTH', TIMESTAMP r.date) = :month AND r.date IS NOT NULL",
					{
						year,
						month
					}
				)
				.groupBy('year')
				.addGroupBy('month')
				.addGroupBy('day')
				.getRawMany();

			return reportsDayDetails.map(
				(repDayDet) =>
					new EntityPerDayDetailsDto(
						repDayDet.year,
						repDayDet.month,
						repDayDet.dat,
						repDayDet.reports_number
					)
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	//#endregion
}
