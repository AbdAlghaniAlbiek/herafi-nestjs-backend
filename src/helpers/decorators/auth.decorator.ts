import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AccessTokenAuthGuard } from 'src/services/security/guards/access-token.guard';
import { RefreshTokenAuthGuard } from 'src/services/security/guards/refresh-token.guard';
import { RolesGuard } from 'src/services/security/guards/roles.guard';
import { UserRole } from 'src/helpers/constants/user-role.constants';
import { Roles } from '../security/meta-data/roles.meta-data';
import { AuthResultMessages } from '../constants/result-messages.constants';

export function Authenticated() {
	return applyDecorators(
		UseGuards(AccessTokenAuthGuard, RefreshTokenAuthGuard),
		ApiBearerAuth(),
		ApiUnauthorizedResponse({
			description: AuthResultMessages.unauthorizedUser()
		})
	);
}

export function Authorized(...roles: UserRole[]) {
	return applyDecorators(
		Roles(...roles),
		UseGuards(AccessTokenAuthGuard, RefreshTokenAuthGuard, RolesGuard),
		ApiBearerAuth(),
		ApiUnauthorizedResponse({
			description: AuthResultMessages.forbiddenAccessOnThisResource()
		})
	);
}

// export const AuthUser = createParamDecorator(
// 	(data: unknown, ctx: ExecutionContext) => {
// 		const request = ctx.switchToHttp().getRequest();
// 		return request.user;
// 	}
// );
