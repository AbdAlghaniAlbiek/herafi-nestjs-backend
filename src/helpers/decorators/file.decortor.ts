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
	required: boolean = false,
	maxCount: number = 10,
	localOptions?: MulterOptions
) {
	return applyDecorators(
		UseInterceptors(FilesInterceptor(fieldName, maxCount, localOptions)),
		ApiConsumes('multipart/form-data'),
		ApiBody({
			schema: {
				type: 'object',
				required: required ? [fieldName] : [],
				properties: {
					[fieldName]: {
						type: 'array',
						items: {
							type: 'string',
							format: 'binary'
						}
					}
				}
			}
		})
	);
}

export function ApiFile(
	fieldName: string = 'file',
	required: boolean = false,
	localOptions?: MulterOptions
) {
	return applyDecorators(
		UseInterceptors(FileInterceptor(fieldName, localOptions)),
		ApiConsumes('multipart/form-data'),
		ApiBody({
			schema: {
				type: 'object',
				required: required ? [fieldName] : [],
				properties: {
					[fieldName]: {
						type: 'string',
						format: 'binary'
					}
				}
			}
		})
	);
}

export function ApiImageFile(
	fileName: string = 'image',
	required: boolean = false,
	mimeTypes: AcceptedImageMimeType[]
) {
	return ApiFile(fileName, required, {
		fileFilter: fileMimetypeFilter(...mimeTypes)
	});
}

export function ApiImageFiles(
	fileName: string = 'image',
	required: boolean = false,
	maxCount: number = 10,
	mimeTypes: AcceptedImageMimeType[]
) {
	return ApiFiles(fileName, required, maxCount, {
		fileFilter: fileMimetypeFilter(...mimeTypes)
	});
}
