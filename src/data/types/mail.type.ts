export type MailBody = {
	to: string;
	subject: string;
	text: string;
	html?: any;
	attachments?: any[];
	context?: any;
};
