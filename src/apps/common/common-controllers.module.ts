import { Module } from '@nestjs/common';
import { AuthRepo } from 'src/data/repositories/controllers-repos/common-repos/auth.repo';
import { PersonRepo } from 'src/data/repositories/controllers-repos/common-repos/person.repo';
import { AuthController } from './controllers/auth.controller';
import { PersonController } from './controllers/person.controller';

@Module({
	controllers: [AuthController, PersonController],
	providers: [AuthRepo, PersonRepo]
})
export class CommonControllersModule {}
