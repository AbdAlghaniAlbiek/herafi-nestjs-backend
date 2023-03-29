export class GeneralUserDto {
	constructor(
		public id: number,
		public name: string,
		public imagePath: string
	) {}
}

export class UserDetailsProfileDto {
	constructor(
		public id: number,
		public name: number,
		public phoneNumber: string,
		public identityNumber: string,
		public nationalNumber: string,
		public city: string,
		public dateJoin: Date,
		public requestsNumber: number,
		public profileImage: string,
		public personalIdentityImage: string,
		public favourties: number,
		public searchs: number
	) {}
}

export class UserDetailsRequestsDto {
	constructor(
		public id: number,
		public name: string,
		public process: string,
		public startDate: Date,
		public endDate: Date,
		public totalCost: number,
		public comment: string,
		public status: string,
		public rating: number,
		public craftmanName: string
	) {}
}

export class NewMembersUserDto {
	constructor(
		public id: number,
		public name: string,
		public email: string,
		public phoneNumber: string,
		public nationalNumber: string,
		public city: string,
		public dateJoin: Date,
		public profileImage: string,
		public personalIdentityImage: string
	) {}
}
