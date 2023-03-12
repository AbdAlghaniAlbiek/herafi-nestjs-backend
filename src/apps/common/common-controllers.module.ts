import { Module } from '@nestjs/common';
import { AuthRepo } from 'src/data/repositories/controllers-repos/common-repos/auth.repo';
import { AuthController } from './controllers/auth.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './controllers/upload.controller';
import { UploadRepo } from 'src/data/repositories/controllers-repos/common-repos/upload.repo';
import { diskStorage } from 'multer';
import {
	fileMimetypeFilter,
	fileNameModifier
} from 'src/helpers/resolvers/upload-file.resolver';
import { ConfigService } from '@nestjs/config';
import {
	CloudinaryConfig,
	NodeConfig
} from 'src/configurations/config.interfaces';
import { Environment } from 'src/helpers/constants/environments.constants';
import { resolve } from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { AcceptedImageMimeType } from 'src/helpers/constants/accepted-mime-type.constants';
import { CloudinaryModule } from 'nestjs-cloudinary';

@Module({
	imports: [
		MulterModule.registerAsync({
			useFactory: (nodeConfig: ConfigService<NodeConfig>) =>
				<MulterOptions>{
					dest:
						nodeConfig.get('NODE_ENV') === Environment.Development
							? resolve(process.cwd(), 'src/assets/upload/images')
							: '',
					fileFilter: fileMimetypeFilter(
						AcceptedImageMimeType.Jpeg,
						AcceptedImageMimeType.Png
					),
					storage: diskStorage({
						filename: fileNameModifier
					}),
					limits: {
						fileSize: 1024 * 1024 * 2,
						fields: 10
					}
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
	providers: [AuthRepo, UploadRepo]
})
export class CommonControllersModule {}
