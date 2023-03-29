import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersRepo } from 'src/data/repositories/admin-repos/users.repo';

@Module({
	controllers: [UsersController],
	providers: [UsersRepo]
})
export class AdminDesktopModule {}
