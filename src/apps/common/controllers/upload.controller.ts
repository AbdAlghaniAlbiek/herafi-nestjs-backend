import { ApiController } from 'src/helpers/decorators/swagger.decorator';
import {
	Post,
	UploadedFile,
	UploadedFiles,
	VERSION_NEUTRAL,
	HttpCode,
	HttpStatus,
	Param,
	Query,
	ParseIntPipe,
	ParseEnumPipe
} from '@nestjs/common';
import { UploadRepo } from 'src/data/repositories/controllers-repos/common-repos/upload.repo';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnsupportedMediaTypeResponse
} from '@nestjs/swagger';
import { ImageType } from 'src/data/entities/constants/image-type.constants';
import { ApiFiles, ApiImageFile } from 'src/helpers/decorators/file.decortor';
import { AcceptedImageMimeType } from 'src/helpers/constants/accepted-mime-type.constants';
import { ParseFilePipe } from 'src/helpers/pipes/parse-file.pipe';
import { ValidationExcetion } from 'src/helpers/security/errors/custom-exceptions';

@ApiController({ path: 'upload', version: VERSION_NEUTRAL })
export class UploadController {
	constructor(private uploadRepo: UploadRepo) {}

	//#region swagger api config
	@ApiOperation({
		summary: `Upload single specified image for a person this image may ${ImageType.Personal}, ${ImageType.Certificate} or ${ImageType.Identity}`
	})
	@ApiImageFile('file', [
		AcceptedImageMimeType.Jpeg,
		AcceptedImageMimeType.Png
	])
	@ApiOkResponse({
		description: 'File uploaded on this server successfuly'
	})
	@ApiUnsupportedMediaTypeResponse({
		description: "The mime type of file isn't accepatable"
	})
	@ApiBadRequestResponse({
		description: 'When person with specified sended id not found'
	})
	@ApiInternalServerErrorResponse({
		description:
			"Cloudinary service doesn't work properly || TypeOrm related error occurs"
	})
	@ApiBody({
		schema: {
			type: 'object',
			required: ['file'],
			description:
				'This body is multipart/form-data that contains a file that will uploaded to server',
			properties: {
				['file']: {
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	//#endregion
	@Post(':personId')
	@HttpCode(HttpStatus.CREATED)
	uploadFile(
		@UploadedFile(ParseFilePipe) file: Express.Multer.File,
		@Param(
			'persondId',
			new ParseIntPipe({
				exceptionFactory(error) {
					throw new ValidationExcetion(
						ValidationExcetion.name,
						error
					);
				}
			})
		)
		personId: number,
		@Query(
			'image_type',
			new ParseEnumPipe(ImageType, {
				exceptionFactory(error) {
					throw new ValidationExcetion(
						ValidationExcetion.name,
						error
					);
				}
			})
		)
		imageType: ImageType
	) {
		this.uploadRepo.uploadSingleFile(file, personId, imageType);
	}

	// @Post('person-multiple-images')
	// @HttpCode(HttpStatus.CREATED)
	// @ApiOperation({ summary: 'Upload Multiple specified images for a person' })
	// @ApiFileFields([
	// 	{ name: ImageType.Personal, maxCount: 1, required: true },
	// 	{ name: ImageType.Identity, maxCount: 1, required: true },
	// 	{ name: ImageType.Certificate, maxCount: 3 }
	// ])
	// uploadMultipleFiles(
	// 	@UploadedFiles(ParseFilePipe)
	// 	files: {
	// 		personal: Express.Multer.File;
	// 		identity: Express.Multer.File;
	// 		certificate: Express.Multer.File[];
	// 	},
	// 	@Body() photoPersonDto: PhotoPersonDto
	// ) {
	// 	console.log(files);
	// }

	//#region swagger api config
	@ApiOperation({
		summary: 'Upload mutiple files to the server'
	})
	@ApiFiles('files')
	@ApiOkResponse({
		description: 'Files is uploades successfuly'
	})
	@ApiBadRequestResponse({
		description:
			"When Person or Request isn't found with specified sended id"
	})
	@ApiInternalServerErrorResponse({
		description:
			"Cloud service isn't work properly || TypeOrm related error"
	})
	@ApiBody({
		schema: {
			type: 'object',
			required: ['files'],
			properties: {
				['files']: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary'
					}
				}
			}
		}
	})
	//#endregion
	@Post(':personId/multipe-request-images/:requestId')
	@HttpCode(HttpStatus.CREATED)
	@ApiFiles('files')
	uploadMultipleRequestImages(
		@UploadedFiles(ParseFilePipe) files: Array<Express.Multer.File>,
		@Param(
			'personId',
			new ParseIntPipe({
				exceptionFactory(error) {
					throw new ValidationExcetion(
						ValidationExcetion.name,
						error
					);
				}
			})
		)
		personId: number,
		@Param(
			'requestId',
			new ParseIntPipe({
				exceptionFactory(error) {
					throw new ValidationExcetion(
						ValidationExcetion.name,
						error
					);
				}
			})
		)
		requestId: number,
		@Query(
			'banner',
			new ParseIntPipe({
				exceptionFactory(error) {
					throw new ValidationExcetion(
						ValidationExcetion.name,
						error
					);
				}
			})
		)
		banner: number
	) {
		this.uploadRepo.uploadMultipeFiles(files, personId, requestId, banner);
	}
}
