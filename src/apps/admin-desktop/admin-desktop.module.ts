import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersRepo } from 'src/data/repositories/admin-repos/users.repo';
import { CraftmenController } from './controllers/craftmen.controller';
import { CraftmenRepo } from 'src/data/repositories/admin-repos/craftmen.repo';
import { SettingsController } from './controllers/settings.controller';
import { SettingsRepo } from 'src/data/repositories/admin-repos/settings.repo';

@Module({
	controllers: [UsersController, CraftmenController, SettingsController],
	providers: [UsersRepo, CraftmenRepo, SettingsRepo]
})
export class AdminDesktopModule {}
