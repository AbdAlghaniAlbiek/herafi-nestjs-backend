import { PartialType } from '@nestjs/swagger';
import { CreatePersonDto } from '../requests/person.dto';

export class ReadPersonDto extends PartialType(CreatePersonDto) {}
