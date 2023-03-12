import { ApiController } from 'src/helpers/decorators/swagger.decorator';
import {
	HttpStatus,
	ParseFilePipeBuilder,
	Post,
	UploadedFile,
	UploadedFiles,
	VERSION_NEUTRAL,
	Body
} from '@nestjs/common';
import { UploadRepo } from 'src/data/repositories/controllers-repos/common-repos/upload.repo';
import { ApiOperation } from '@nestjs/swagger';
import {
	PhotoPersonDto,
	PhotosRequestDto
} from 'src/data/dtos/common-dtos/requests/upload-request.dto';
import { ImageType } from 'src/data/entities/constants/image-type.constants';
import {
	ApiFileFields,
	ApiFiles,
	ApiImageFile
} from 'src/helpers/decorators/file.decortor';
import { AcceptedImageMimeType } from 'src/helpers/constants/accepted-mime-type.constants';
import { ParseFilePipe } from 'src/helpers/pipes/parse-file.pipe';

@ApiController({ path: 'upload', version: VERSION_NEUTRAL })
export class UploadController {
	constructor(private uploadRepo: UploadRepo) {}

	@Post('')
	@ApiOperation({ summary: 'Upload single specified image for a person' })
	@ApiImageFile('file', true, [
		AcceptedImageMimeType.Jpeg,
		AcceptedImageMimeType.Png
	])
	uploadFile(
		@UploadedFile(ParseFilePipe)
		file: Express.Multer.File,
		@Body() photoPersonDto: PhotoPersonDto
	) {
		console.log(file);
	}

	@Post('person-multiple-images')
	@ApiOperation({ summary: 'Upload Multiple specified images for a person' })
	@ApiFileFields([
		{ name: ImageType.Personal, maxCount: 1, required: true },
		{ name: ImageType.Identity, maxCount: 1, required: true },
		{ name: ImageType.Certificate, maxCount: 3 }
	])
	uploadMultipleFiles(
		@UploadedFiles(ParseFilePipe)
		files: {
			personal: Express.Multer.File;
			identity: Express.Multer.File;
			certificate: Express.Multer.File[];
		},
		@Body() photoPersonDto: PhotoPersonDto
	) {
		console.log(files);
	}

	@Post('multipe-request-images')
	@ApiFiles('files', true)
	uploadMultipleRequestImages(
		@UploadedFiles(ParseFilePipe) files: Array<Express.Multer.File>,
		@Body() PhotosRequestDto: PhotosRequestDto
	) {
		console.log(files);
	}
}
