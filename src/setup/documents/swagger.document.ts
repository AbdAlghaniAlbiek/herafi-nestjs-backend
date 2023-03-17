import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminDesktopModule } from 'src/apps/admin-desktop/admin-desktop.module';
import { CommonControllersModule } from 'src/apps/common/common-controllers.module';
import { CraftmanMobileModule } from 'src/apps/craftman-mobile/craftman-mobile.module';
import { UserMobileModule } from 'src/apps/user-mobile/user-mobile.module';

export class SwaggerDocuments {
	static adminSwaggerDocument(app: INestApplication) {
		return SwaggerModule.createDocument(
			app,
			new DocumentBuilder()
				.setTitle('Admin application APIs')
				.setDescription(
					'APIs that admin application can consume it and fetch data from it'
				)
				.addBearerAuth()
				.setVersion('1.0')
				.addTag('admin')
				.build(),
			{
				include: [AdminDesktopModule]
			}
		);
	}

	static userSwaggerDocument(app: INestApplication) {
		return SwaggerModule.createDocument(
			app,
			new DocumentBuilder()
				.setTitle('User application APIs')
				.setDescription(
					'APIs that User application can consume it and fetch data from it'
				)
				.addBearerAuth()
				.setVersion('1.0')
				.addTag('user')
				.build(),
			{
				include: [UserMobileModule]
			}
		);
	}

	static craftmanSwaggerDocument(app: INestApplication) {
		return SwaggerModule.createDocument(
			app,
			new DocumentBuilder()
				.setTitle('Craftman application APIs')
				.setDescription(
					'APIs that Craftman application can consume it and fetch data from it'
				)
				.addBearerAuth()
				.setVersion('1.0')
				.addTag('craftman')
				.build(),
			{
				include: [CraftmanMobileModule]
			}
		);
	}

	static commonSwaggerDocument(app: INestApplication) {
		return SwaggerModule.createDocument(
			app,
			new DocumentBuilder()
				.setTitle('Common APIs')
				.setDescription(
					'APIs that Any application can consume it and fetch data from it'
				)
				.addBearerAuth()
				.setVersion('1.0')
				.addTag('common')
				.build(),
			{
				include: [CommonControllersModule]
			}
		);
	}
}
