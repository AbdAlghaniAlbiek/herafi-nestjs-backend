export class AdminProfileDto {
	constructor(
		public id: number,
		public name: string,
		public phoneNumber: string,
		public nationalNumber: string,
		public city: string,
		public dateJoin: Date,
		public profileImage: string,
		public personalIdentityImage: string
	) {}
}
