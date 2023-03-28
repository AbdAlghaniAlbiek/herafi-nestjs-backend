import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Strategies } from 'src/helpers/constants/strategies-specifics.constants';

@Injectable()
export class MicrosoftAuthGuard extends AuthGuard(Strategies.Microsoft) {}
