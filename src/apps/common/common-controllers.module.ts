import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AuthRepo } from 'src/data/repositories/controllers-repos/common-repos/auth.repo';
import { AuthController } from './controllers/auth.controller';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { MailConfig, RedisConfig } from 'src/configurations/config.interfaces';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { QueuesNames } from 'src/helpers/constants/queues.constants';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: (mailConfig: ConfigService<MailConfig>) => ({
				transport: {
					host: mailConfig.get('HOST'),
					port: mailConfig.get('PORT'),
					secure: mailConfig.get('IS_SECURE'),
					auth: {
						user: mailConfig.get('AUTH_USER'),
						pass: mailConfig.get('AUTH_PASSWORD')
					}
				},
				defaults: {
					from: mailConfig.get('DEFAULT_FROM_USER')
				},
				template: {
					dir: join(__dirname, '..', 'assets/templates'),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true
					}
				}
			}),
			inject: [ConfigService]
		}),
		BullModule.registerQueueAsync({
			name: QueuesNames.MailSend, // mail queue name
			useFactory: (redisConfig: ConfigService<RedisConfig>) => ({
				redis: {
					host: redisConfig.get('HOST'),
					port: redisConfig.get('PORT')
				}
			}),
			inject: [ConfigService]
		}),
		MulterModule.register({})
	],
	controllers: [AuthController],
	providers: [AuthRepo]
})
export class CommonControllersModule {}
