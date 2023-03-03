import { InternalServerErrorException } from '@nestjs/common';
import { expand } from 'dotenv-expand';
import { config } from 'dotenv-vault-core';

export default function envFilePath(path: string): void {
	const envConfig = config({
		path
	});

	if (envConfig.error) {
		if (envConfig.error) {
			throw new InternalServerErrorException(`${envConfig.error}`);
		}
	}

	expand(envConfig);
}
