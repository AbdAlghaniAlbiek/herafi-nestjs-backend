import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailEvents } from 'src/helpers/constants/events.constants';

@Injectable()
export class MailSendEvents {
	private readonly logger = new Logger(this.constructor.name);

	@OnEvent(MailEvents.MailAlmostSendingEvent)
	handleMailAlmostSendingEvent(payload: any) {
		this.logger.log(payload);
	}

	@OnEvent(MailEvents.MailSendingEvent)
	handleMailSendingEvent(payload: any) {
		this.logger.log(payload);
	}

	@OnEvent(MailEvents.MailSendedEvent)
	handleMailSendedEvent(payload: any) {
		this.logger.log(payload);
	}

	@OnEvent(MailEvents.MailFailedSendingEvent)
	handleMailFailedSendingEvent(payload: any) {
		this.logger.log(payload);
	}
}
