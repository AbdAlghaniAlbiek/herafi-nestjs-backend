import {
	OnQueueActive,
	OnQueueCompleted,
	OnQueueFailed,
	Process,
	Processor
} from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bull';
import { MailBody } from 'src/data/types/mail.type';
import { MailEvents } from 'src/helpers/constants/events.constants';
import { ProcessNames } from 'src/helpers/constants/processors.constants';
import { QueuesNames } from 'src/helpers/constants/queues.constants';
import { MailService } from '../../mail.service';

@Processor(QueuesNames.MailSend)
export class MailQueueConsumer {
	constructor(
		private readonly mailService: MailService,
		private mailEvents: EventEmitter2
	) {}

	@OnQueueActive()
	onActive(job: Job) {
		this.mailEvents.emit(
			MailEvents.MailAlmostSendingEvent,
			`Processor:@OnQueueActive - Processing job ${job.id} of type ${
				job.name
			}. Data: ${JSON.stringify(job.data)}`
		);
	}

	@OnQueueCompleted()
	onComplete(job: Job) {
		this.mailEvents.emit(
			MailEvents.MailSendingEvent,
			`Processor:@OnQueueCompleted - Completed job ${job.id} of type ${job.name}.`
		);
	}

	@OnQueueFailed()
	onError(job: Job<any>, error) {
		console.log(
			`Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
			error.stack
		);
	}

	@Process(ProcessNames.Confirmation)
	async sendEmail(job: Job): Promise<any> {
		this.mailEvents.emit(
			MailEvents.MailSendedEvent,
			'Processor:@Process - Sending confirmation email.'
		);

		try {
			const result = await this.mailService.sendMail(<MailBody>job.data);
			return result;
		} catch (error) {
			console.log('Failed to send confirmation email.', error.stack);
		}
	}
}
