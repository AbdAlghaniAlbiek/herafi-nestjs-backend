import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { PersonController } from './controllers/person.controller';

@Module({
	controllers: [AuthController, PersonController]
})
export class CommonControllersModule {}
