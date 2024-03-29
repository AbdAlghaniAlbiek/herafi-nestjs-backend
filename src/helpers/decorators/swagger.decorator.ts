import { applyDecorators, Controller, ControllerOptions } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions, ApiTags } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { Allow } from 'class-validator';

export function ApiController(controllerName: ControllerOptions) {
	return applyDecorators(
		Controller(controllerName),
		ApiTags(controllerName.path[0])
	);
}

// export function ApiHttpResponse(
// 	httpStatusCode: number,
// 	description: string,
// 	type: any | undefined = undefined
// ) {
// 	return applyDecorators(
// 		HttpCode(httpStatusCode),
// 		ApiResponse({ status: httpStatusCode, description, type })
// 	);
// }

export function AutoMapApiProperty(apiPropertyOptions?: ApiPropertyOptions) {
	return applyDecorators(AutoMap, ApiProperty(apiPropertyOptions));
}

export function AutoMappedAllowedApiProperty(
	apiPropertyOptions?: ApiPropertyOptions
) {
	return applyDecorators(AutoMap, Allow, ApiProperty(apiPropertyOptions));
}
