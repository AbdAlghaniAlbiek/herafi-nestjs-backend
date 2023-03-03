import { Module } from '@nestjs/common';
import { personProfile } from './mappers/person-profile.mapper';

@Module({
	exports: [personProfile],
	providers: [personProfile]
})
export class DataModule {}
