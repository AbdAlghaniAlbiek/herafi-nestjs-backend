import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersRepo } from 'src/data/repositories/admin-repos/users.repo';
import { CraftmenController } from './controllers/craftmen.controller';
import { CraftmenRepo } from 'src/data/repositories/admin-repos/craftmen.repo';
import { SettingsController } from './controllers/settings.controller';
import { SettingsRepo } from 'src/data/repositories/admin-repos/settings.repo';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardRepo } from 'src/data/repositories/admin-repos/dashboard.repo';

@Module({
	controllers: [
		UsersController,
		CraftmenController,
		SettingsController,
		DashboardController
	],
	providers: [UsersRepo, CraftmenRepo, SettingsRepo, DashboardRepo]
})
export class AdminDesktopModule {}
