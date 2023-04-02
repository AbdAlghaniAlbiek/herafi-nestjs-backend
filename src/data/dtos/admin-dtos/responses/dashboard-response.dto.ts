export class ProfitsPerDays {
	constructor(
		public lastYear: Date,
		public lastMonth: Date,
		public day: Date,
		public paids: number
	) {}
}

export class NewMember {
	constructor(
		public newMembersCraftmenNumber: number,
		public newMembersUsersNumber: number
	) {}
}
