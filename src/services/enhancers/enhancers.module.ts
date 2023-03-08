import { Module } from '@nestjs/common';
import { MailSendEvents } from './events/mail-send.event';
import { CustomLoggerService } from './logger.service';
import { MailService } from './mail.service';
import { MailQueueConsumer } from './queues/consumers/mail.consumer';
import { MailQueueProducer } from './queues/producers/mail.producer';

@Module({
	exports: [
		CustomLoggerService,
		MailService,
		MailQueueProducer,
		MailQueueConsumer,
		MailSendEvents
	],
	providers: [
		CustomLoggerService,
		MailService,
		MailQueueProducer,
		MailQueueConsumer,
		MailSendEvents
	]
})
export class EnhancersModule {}
