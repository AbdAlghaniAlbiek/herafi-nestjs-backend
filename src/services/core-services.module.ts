import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common/decorators';
import { ConfigHelperModule } from './config/config-helper.module';
import { DataModule } from './data/data.module';
import { EnhancersModule } from './enhancers/enhancers.module';
import { SecurityModule } from './security/security.module';

@Global()
@Module({
	exports: [SecurityModule, DataModule, ConfigHelperModule, EnhancersModule],
	imports: [SecurityModule, DataModule, ConfigHelperModule, EnhancersModule]
})
export class CoreServicesModule {}
