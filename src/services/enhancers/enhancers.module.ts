import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailSendEvents } from './events/mail-send.event';
import { CustomLoggerService } from './logger.service';
import { MailService } from './mail.service';
import { MailQueueConsumer } from './queues/consumers/mail.consumer';
import { MailQueueProducer } from './queues/producers/mail.producer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailConfig, RedisConfig } from 'src/configurations/config.interfaces';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { QueuesNames } from 'src/helpers/constants/queues.constants';
import { pipeParsers } from './pipes/custom-pipes.pipe';

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
			name: QueuesNames.MailQueue, // mail queue name
			useFactory: (redisConfig: ConfigService<RedisConfig>) => ({
				redis: {
					host: redisConfig.get('HOST'),
					port: redisConfig.get('PORT')
				}
			}),
			inject: [ConfigService]
		})
	],
	exports: [
		CustomLoggerService,
		MailService,
		MailQueueProducer,
		MailQueueConsumer,
		MailSendEvents,
		pipeParsers
	],
	providers: [
		CustomLoggerService,
		MailService,
		MailQueueProducer,
		MailQueueConsumer,
		MailSendEvents,
		pipeParsers
	]
})
export class EnhancersModule {}
