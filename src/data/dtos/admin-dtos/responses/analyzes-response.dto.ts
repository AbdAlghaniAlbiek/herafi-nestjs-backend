export class ProfitsPerDateDetailsDto {
	constructor(public date: number, public paids: number) {}
}

export class ProfitsPerDayDetailsDto {
	constructor(
		public year: number,
		public month: number,
		public day: number,
		public paids: number
	) {}
}

export class EntityPerDateDetailsDto {
	constructor(public date: number, public craftmanNumber: number) {}
}

export class EntityPerDayDetailsDto {
	constructor(
		public year: number,
		public month: number,
		public day: number,
		public craftmanNumber: number
	) {}
}
