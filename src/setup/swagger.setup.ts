import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerDocuments } from './documents/swagger.document';
import { INestApplication } from '@nestjs/common';

export function SwaggerSetup(app: INestApplication) {
	SwaggerModule.setup(
		'common',
		app,
		SwaggerDocuments.commonSwaggerDocument(app),
		{ useGlobalPrefix: true }
	);
	SwaggerModule.setup(
		'admin',
		app,
		SwaggerDocuments.adminSwaggerDocument(app),
		{ useGlobalPrefix: true }
	);
	SwaggerModule.setup(
		'user',
		app,
		SwaggerDocuments.userSwaggerDocument(app),
		{ useGlobalPrefix: true }
	);
	SwaggerModule.setup(
		'craftman',
		app,
		SwaggerDocuments.craftmanSwaggerDocument(app),
		{ useGlobalPrefix: true }
	);
}
