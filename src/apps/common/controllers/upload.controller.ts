import { ApiController } from 'src/helpers/decorators/swagger.decorator';
import { VERSION_NEUTRAL } from '@nestjs/common';

@ApiController({ path: 'upload', version: VERSION_NEUTRAL })
export class UploadController {}
