import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common/decorators';
import { ConfigHelperModule } from './config/config-helper.module';
import { DataModule } from './data/data.module';
import { SecurityModule } from './security/security.module';

@Global()
@Module({
	imports: [SecurityModule, DataModule, ConfigHelperModule]
})
export class CoreServicesModule {}
