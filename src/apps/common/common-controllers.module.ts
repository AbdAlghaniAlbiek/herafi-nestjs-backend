import { Module } from '@nestjs/common';
import { AuthRepo } from 'src/data/repositories/controllers-repos/common-repos/auth.repo';
import { AuthController } from './controllers/auth.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './controllers/upload.controller';
import { UploadRepo } from 'src/data/repositories/controllers-repos/common-repos/upload.repo';
import { diskStorage } from 'multer';
import { fileNameModifier } from 'src/helpers/resolvers/upload-file.resolver';
import { ConfigService } from '@nestjs/config';
import {
	CloudinaryConfig,
	NodeConfig
} from 'src/configurations/config.interfaces';
import { Environment } from 'src/helpers/constants/environments.constants';
import { resolve } from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { CompleteAuthMiddleware } from 'src/middlewares/complete-auth.middleware';

@Module({
	imports: [
		MulterModule.registerAsync({
			useFactory: (nodeConfig: ConfigService<NodeConfig>) =>
				<MulterOptions>{
					dest:
						nodeConfig.get('NODE_ENV') === Environment.Development
							? resolve(process.cwd(), 'src/assets/upload/images')
							: '',
					storage: diskStorage({
						filename: fileNameModifier
					})
				},
			inject: [ConfigService]
		}),
		CloudinaryModule.forRootAsync({
			useFactory: (
				cloudinaryConfig: ConfigService<CloudinaryConfig>
			) => ({
				cloud_name: cloudinaryConfig.get('CLOUD_NAME'),
				api_key: cloudinaryConfig.get('API_KEY'),
				api_secret: cloudinaryConfig.get('API_SECRET')
			}),
			inject: [ConfigService]
		})
	],
	controllers: [AuthController, UploadController],
	providers: [AuthRepo, UploadRepo, CompleteAuthMiddleware]
})
export class CommonControllersModule {}
