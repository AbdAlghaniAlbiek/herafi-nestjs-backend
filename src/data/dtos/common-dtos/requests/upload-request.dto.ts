import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ImageType } from 'src/data/entities/constants/image-type.constants';
import { AutoMappedApiProperty } from 'src/helpers/decorators/swagger.decorator';

export class PhotoPersonDto {
	@IsNotEmpty()
	@IsNumber()
	@AutoMappedApiProperty()
	public personId: number;

	@IsNotEmpty()
	@IsEnum(ImageType)
	@AutoMappedApiProperty({
		enum: ImageType,
		enumName: 'ImageType',
		default: ImageType.Personal
	})
	public imageType: ImageType;
}

export class PhotosRequestDto {
	@IsNotEmpty()
	@IsNumber()
	@AutoMappedApiProperty()
	public personId: number;

	@IsNotEmpty()
	@IsNumber()
	@AutoMappedApiProperty()
	public requestId: number;

	@IsOptional()
	@IsNumber()
	@AutoMappedApiProperty()
	public banner: number; // Number of image that come in request body that will be a banner image
}
