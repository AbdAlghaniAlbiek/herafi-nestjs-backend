import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategiesSpecifics } from 'src/helpers/constants/strategies-specifics.constants';

@Injectable()
export class MicrosoftAuthGuard extends AuthGuard(
	StrategiesSpecifics.Microsoft
) {}
