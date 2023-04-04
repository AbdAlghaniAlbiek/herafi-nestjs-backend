import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersRepo } from 'src/data/repositories/controllers-repos/admin-repos/users.repo';
import { CraftmenController } from './controllers/craftmen.controller';
import { CraftmenRepo } from 'src/data/repositories/controllers-repos/admin-repos/craftmen.repo';
import { SettingsController } from './controllers/settings.controller';
import { SettingsRepo } from 'src/data/repositories/controllers-repos/admin-repos/settings.repo';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardRepo } from 'src/data/repositories/controllers-repos/admin-repos/dashboard.repo';
import { AnalyzesController } from './controllers/analyzes.controller';

@Module({
	controllers: [
		UsersController,
		CraftmenController,
		SettingsController,
		DashboardController,
		AnalyzesController
	],
	providers: [
		UsersRepo,
		CraftmenRepo,
		SettingsRepo,
		DashboardRepo,
		AnalyzesController
	]
})
export class AdminDesktopModule {}
