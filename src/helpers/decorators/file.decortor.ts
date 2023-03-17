import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
	FileFieldsInterceptor,
	FileInterceptor,
	FilesInterceptor
} from '@nestjs/platform-express';
import {
	MulterField,
	MulterOptions
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
	ReferenceObject,
	SchemaObject
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AcceptedImageMimeType } from '../constants/accepted-mime-type.constants';
import { fileMimetypeFilter } from '../resolvers/upload-file.resolver';

export type UploadFields = MulterField & { required?: boolean };

export function ApiFileFields(
	uploadFields: UploadFields[],
	localOptions?: MulterOptions
) {
	const bodyProperties: Record<string, SchemaObject | ReferenceObject> =
		Object.assign(
			{},
			...uploadFields.map((field) => {
				return { [field.name]: { type: 'string', format: 'binary' } };
			})
		);
	const apiBody = ApiBody({
		schema: {
			type: 'object',
			properties: bodyProperties,
			required: uploadFields.filter((f) => f.required).map((f) => f.name)
		}
	});

	return applyDecorators(
		UseInterceptors(FileFieldsInterceptor(uploadFields, localOptions)),
		ApiConsumes('multipart/form-data'),
		apiBody
	);
}

export function ApiFiles(
	fieldName: string = 'files',
	maxCount: number = 10,
	localOptions?: MulterOptions
) {
	return applyDecorators(
		UseInterceptors(FilesInterceptor(fieldName, maxCount, localOptions)),
		ApiConsumes('multipart/form-data')
	);
}

export function ApiFile(
	fieldName: string = 'file',
	localOptions?: MulterOptions
) {
	return applyDecorators(
		UseInterceptors(FileInterceptor(fieldName, localOptions)),
		ApiConsumes('multipart/form-data')
	);
}

export function ApiImageFile(
	fileName: string = 'file',
	mimeTypes: AcceptedImageMimeType[]
) {
	return ApiFile(fileName, {
		fileFilter: fileMimetypeFilter(...mimeTypes)
	});
}

export function ApiImageFiles(
	fileName: string = 'file',
	maxCount: number = 10,
	mimeTypes: AcceptedImageMimeType[]
) {
	return ApiFiles(fileName, maxCount, {
		fileFilter: fileMimetypeFilter(...mimeTypes)
	});
}
