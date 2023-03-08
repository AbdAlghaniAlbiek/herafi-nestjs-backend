import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { MailBody } from 'src/data/types/mail.type';
import { ProcessNames } from 'src/helpers/constants/processors.constants';
import { QueuesNames } from 'src/helpers/constants/queues.constants';
import { ResultMessages } from 'src/helpers/constants/result-messages.constants';

@Injectable()
export class MailQueueProducer {
	constructor(@InjectQueue(QueuesNames.MailSend) private mailQueue: Queue) {}

	public async sendMailConfirmation(mailBody: MailBody) {
		try {
			this.mailQueue.add(ProcessNames.SendEmailConfirmation, mailBody, {
				attempts: 10
			});
			console.log(ResultMessages.EmailSendingOperation());
		} catch (err) {
			console.log(ResultMessages.QueueAddingJobFailed(`${err}`));
		}
	}
}
