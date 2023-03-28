import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthRepo } from 'src/data/repositories/controllers-repos/common-repos/auth.repo';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(private authRepo: AuthRepo) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const { sub, name, roles, requiredRefreshToken }: any = req.user;

		if (requiredRefreshToken) {
			const newRefreshToken = await this.authRepo.getRefreshToken(
				sub,
				name,
				roles
			);
			await this.authRepo.updateRefreshToken(sub, newRefreshToken);
		}

		next();
	}
}
