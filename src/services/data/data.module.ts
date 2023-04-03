import { Module } from '@nestjs/common';
import { PersonProfile } from './mappers/person-profile.mapper';

@Module({
	exports: [PersonProfile],
	providers: [PersonProfile]
})
export class DataModule {}
