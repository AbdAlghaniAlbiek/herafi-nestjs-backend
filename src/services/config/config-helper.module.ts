import { Module } from '@nestjs/common';
import { NodeSetupConfig } from './node-setup.config';

@Module({
	exports: [NodeSetupConfig],
	providers: [NodeSetupConfig]
})
export class ConfigHelperModule {}
