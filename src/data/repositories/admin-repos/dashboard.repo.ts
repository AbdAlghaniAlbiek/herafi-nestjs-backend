import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	NewMember,
	ProfitsPerDays
} from 'src/data/dtos/admin-dtos/responses/dashboard-response.dto';
import { PersonRole } from 'src/data/entities/constants/person-role.constants';
import { Person } from 'src/data/entities/person.entity';
import { Request } from 'src/data/entities/request.entity';
import { Role } from 'src/data/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardRepo {
	constructor(
		@InjectRepository(Request) private requestRepo: Repository<Request>,
		@InjectRepository(Person) private personRepo: Repository<Person>
	) {}

	public async getProfitsPerDay() {
		try {
			const queryResult = await this.requestRepo
				.createQueryBuilder('r')
				.select('temp_year.last_year')
				.addSelect('temp_month.last_month')
				.addSelect('DATE_PART(r.end_date)', 'day')
				.addSelect('SUN(r.total_cost)', 'paids')
				.innerJoin(
					(qb) => {
						return qb
							.select('MAX(YEAR_PART(re.end_date))', 'last_year')
							.from(Request, 're');
					},
					'temp_year',
					'YEAR_PART(r.end_date) = temp_year.last_year'
				)
				.innerJoin(
					(qb) => {
						return qb
							.select(
								'MAX(MONTH_PART(req.end_date))',
								'last_month'
							)
							.from(Request, 'req')
							.innerJoin(
								(qb) => {
									return qb
										.select(
											'MAX(YEAR_PART(requ.end_date))',
											'last_year'
										)
										.from(Request, 'requ');
								},
								'temp',
								'YEAR_PART(req.end_date) = temp.last_year'
							);
					},
					'temp_month',
					'MONTH_PART(r.end_date) = temp_month.last_month'
				)
				.groupBy('temp_year.last_year')
				.addGroupBy('temp_month.last_month')
				.addGroupBy('DAY_PART(r.end_date)')
				.getRawOne();

			return new ProfitsPerDays(
				queryResult.last_year,
				queryResult.last_month,
				queryResult.day,
				queryResult.paids
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}

	public async getNewMembers() {
		try {
			const newMember = await this.personRepo
				.createQueryBuilder()
				.select('cr.new_members_num')
				.addSelect('us.new_members_users_num')
				.from((qb) => {
					return qb
						.select('COUNT(pe.id)', 'new_members_craftmen_num')
						.from(Person, 'pe')
						.where(
							'pe.lowest_cost <> 0 AND pe.highest_cost <> 0 AND pe.verified = f'
						);
				}, 'cr')
				.addFrom((qb) => {
					return qb
						.select('COUNT(per.id)', 'per.new_members_users_num')
						.from(Person, 'per')
						.innerJoin(Role, 'rol', 'rol.id = per.role_id')
						.where('rol.person_role = :role', {
							role: PersonRole.Admin
						})
						.where(
							'per.lowest_cost = 0 AND per.highest_cost = 0 AND per.verified = f'
						);
				}, 'us')
				.getRawOne();

			return new NewMember(
				newMember.new_members_craftmen_num,
				newMember.new_members_users_num
			);
		} catch (err) {
			throw new InternalServerErrorException(`${err}`);
		}
	}
}
