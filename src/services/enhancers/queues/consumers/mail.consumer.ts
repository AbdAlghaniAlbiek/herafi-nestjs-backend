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
import { ProcessorsResultMessages } from 'src/helpers/constants/result-messages.constants';
import { MailService } from '../../mail.service';

@Processor(QueuesNames.MailQueue)
export class MailQueueConsumer {
	constructor(
		private readonly mailService: MailService,
		private mailEvents: EventEmitter2
	) {}

	@OnQueueActive()
	onActive(job: Job) {
		this.mailEvents.emit(
			MailEvents.MailBeforeSendingEvent,
			ProcessorsResultMessages.jobRunning(job.id, job.name, job.data)
		);
	}

	@OnQueueCompleted()
	onComplete(job: Job) {
		this.mailEvents.emit(
			MailEvents.MailSendingEvent,
			ProcessorsResultMessages.jobCompleted(job.id, job.name)
		);
	}

	@OnQueueFailed()
	onError(job: Job<any>, error) {
		this.mailEvents.emit(
			MailEvents.MailFailedSendingEvent,
			ProcessorsResultMessages.jobFailed(job.id, job.name, error)
		);
	}

	@Process(ProcessNames.SendEmailVerification)
	sendEmail(job: Job) {
		this.mailService.sendMail(<MailBody>job.data);
	}
}
