import {
	ArgumentMetadata,
	Injectable,
	PipeTransform,
	ParseFilePipeBuilder,
	HttpStatus
} from '@nestjs/common';

@Injectable()
export class ParseFilePipe implements PipeTransform {
	transform(
		files: Express.Multer.File | Express.Multer.File[],
		metadata: ArgumentMetadata
	) {
		return new ParseFilePipeBuilder()
			.addFileTypeValidator({
				fileType: '/.(jpeg|png)/g'
			})
			.addMaxSizeValidator({
				maxSize: 1024 * 1024 * 2 // 2 MB
			})
			.build({
				errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				fileIsRequired: true
			});
	}
}
