// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { Request } from 'src/data/entities/request.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class CheckTimeoutCraftmanRequests {
// 	constructor(
// 		@InjectRepository(Request) private requestsRepo: Repository<Request>
// 	) {}

// 	@Cron(CronExpression.EVERY_DAY_AT_10AM)
// 	public async checkCraftmanRequestTimeout() {
//         this.requestsRepo.findBy({ startDate:  })
//     }
// }
