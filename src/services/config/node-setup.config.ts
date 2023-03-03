import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeConfig } from 'src/configurations/config.interfaces';

@Injectable()
export class NodeSetupConfig {
	constructor(private configService: ConfigService<NodeConfig>) {}

	get getEnvironment() {
		return this.configService.get('NODE_ENV');
	}

	get getPort() {
		return this.configService.get('PORT');
	}
}
