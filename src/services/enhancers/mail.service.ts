import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { MailBody } from 'src/data/types/mail.type';
import { QueuesNames } from 'src/helpers/constants/queues.constants';
import { ResultMessages } from 'src/helpers/constants/result-messages.constants';

@Injectable()
export class MailService {
	constructor(
		@InjectQueue(QueuesNames.MailSend)
		private mailQueue: Queue,
		private readonly mailerService: MailerService
	) {}
	public sendMail(mailBody: MailBody) {
		this.mailerService
			.sendMail({
				to: mailBody.to,
				from: mailBody.from,
				subject: mailBody.subject,
				text: mailBody.text,
				html: mailBody.html
			})
			.then((success) => {
				console.log(
					ResultMessages.EmailSendingSuccess(JSON.stringify(success))
				);
				return success;
			})
			.catch((err) => {
				console.log(ResultMessages.EmailSendingFailed(`${err}`));
			});
	}
}
