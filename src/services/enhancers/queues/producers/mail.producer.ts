import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { MailBody } from 'src/data/types/mail.type';
import { ProcessNames } from 'src/helpers/constants/processors.constants';
import { QueuesNames } from 'src/helpers/constants/queues.constants';
import { QueueResuleMessages } from 'src/helpers/constants/result-messages.constants';

@Injectable()
export class MailQueueProducer {
	constructor(@InjectQueue(QueuesNames.MailQueue) private mailQueue: Queue) {}

	public async sendMailVerification(mailBody: MailBody) {
		try {
			this.mailQueue.add(ProcessNames.SendEmailVerification, mailBody, {
				attempts: 10
			});
			console.log(
				QueueResuleMessages.queueAdditionJobSucceeded(
					QueuesNames.MailQueue
				)
			);
		} catch (err) {
			console.log(
				QueueResuleMessages.queueAdditionJobFailed(
					QueuesNames.MailQueue,
					`${err}`
				)
			);
		}
	}
}
