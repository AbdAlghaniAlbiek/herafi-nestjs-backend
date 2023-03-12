import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailBody } from 'src/data/types/mail.type';
import { EmailResultMessages } from 'src/helpers/constants/result-messages.constants';

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}
	public sendMail(mailBody: MailBody) {
		this.mailerService
			.sendMail({
				to: mailBody.to,
				subject: mailBody.subject,
				text: mailBody.text
			})
			.then((success) => {
				console.log(
					EmailResultMessages.emailSendingSuccess(
						mailBody.to,
						JSON.stringify(success)
					)
				);
			})
			.catch((err) => {
				console.log(
					EmailResultMessages.emailSendingFailed(
						mailBody.to,
						JSON.stringify(err)
					)
				);
			});
	}
}
