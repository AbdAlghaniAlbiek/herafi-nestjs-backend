import { PartialType } from '@nestjs/swagger';
import { CreatePersonDto } from '../requests/auth-request.dto';

export class ReadPersonDto extends PartialType(CreatePersonDto) {}
