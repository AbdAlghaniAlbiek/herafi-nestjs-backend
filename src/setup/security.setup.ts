import helmet from 'helmet';
import * as csurf from 'csurf';
import { INestApplication } from '@nestjs/common';

export function securitySetup(app: INestApplication) {
	app.use(helmet());
	app.use(csurf());
	app.enableCors();
}
