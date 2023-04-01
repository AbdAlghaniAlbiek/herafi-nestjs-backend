export class GeneralCraftmanDto {
	constructor(
		public id: number,
		public name: string,
		public imagePath: string
	) {}
}

export class CraftmanDetailsProfileDto {
	constructor(
		public id: number,
		public name: number,
		public email: string,
		public phoneNumber: string,
		public nationalNumber: string,
		public city: string,
		public dateJoin: Date,
		public level: string,
		public status: string,
		public blocksNumber: number,
		public craftsNumber: number,
		public certificationsNumber: number,
		public projectsNumber: number,
		public requestsNumber: number,
		public lowestCost: number,
		public highestCost: number,
		public profileImage: string,
		public personalIdentityImage: string,
		public usersFavrouties: number,
		public usersSearchs: number
	) {}
}

export class CraftmanCategoryCrafts {
	constructor(public name: string, public skills: string[]) {}
}

export class CraftmanDetailsRequests {
	constructor(
		public id: number,
		public name: string,
		public process: string,
		public startDate: Date,
		public endDate: Date,
		public cost: number,
		public comment: string,
		public status: string,
		public rating: number,
		public userName: string
	) {}
}

export class CraftmanDetailsProjects {
	constructor(
		public id: number,
		public name: string,
		public process: string,
		public startDate: Date,
		public endDate: Date,
		public cost: number,
		public comment: string,
		public status: string,
		public rating: number,
		public imagePath: string,
		public userName: string
	) {}
}

export class NewMembersCraftmanProfile {
	constructor(
		public id: number,
		public name: string,
		public email: string,
		public phoneNumber: string,
		public nationalNumber: Date,
		public city: number,
		public dateJoin: Date,
		public craftsNumber: string,
		public certificationNumber: number,
		public lowestCost: string,
		public imagePath: string,
		public profileImage: string,
		public personalIdentityImage: string
	) {}
}

export class NewMembersCraftmanCrafts {
	constructor(public name: string, public skill: string) {}
}
