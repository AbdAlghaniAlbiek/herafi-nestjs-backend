import { UnsupportedMediaTypeException } from '@nestjs/common';
import { AcceptedImageMimeType } from '../constants/accepted-mime-type.constants';
import { generateRandomExtendedImageNameValue } from './generate-random-values.resolver';
import { UploadResultMessages } from '../constants/result-messages.constants';

export function fileMimetypeFilter(...mimetypes: AcceptedImageMimeType[]) {
	return (
		req,
		file: Express.Multer.File,
		callback: (error: Error | null, acceptFile: boolean) => void
	) => {
		if (mimetypes.some((m) => file.mimetype.includes(m))) {
			callback(null, true);
		} else {
			throw new UnsupportedMediaTypeException(
				UploadResultMessages.fileMimeTypeNotAcceptable(...mimetypes)
			);
		}
	};
}

export function fileNameModifier() {
	return (
		req,
		file: Express.Multer.File,
		callback: (error: Error | null, fileName: string) => void
	) => {
		const fileName = file.originalname.split('.')[0];
		const fileExt = file.originalname.split('.')[1];

		callback(
			null,
			`${fileName}-${Date.now().toLocaleString()}-${generateRandomExtendedImageNameValue()}.${fileExt}`
		);
	};
}
