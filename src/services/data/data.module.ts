import { Module } from '@nestjs/common';
import { PhotoProfile } from './mappers/photo-profile.mapper';
import { PersonProfile } from './mappers/person-profile.mapper';

@Module({
	exports: [PersonProfile, PhotoProfile],
	providers: [PersonProfile, PhotoProfile]
})
export class DataModule {}
