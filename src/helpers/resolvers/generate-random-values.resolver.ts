export function generateRandomVerificationCode() {
	const min = Math.ceil(100000);
	const max = Math.floor(900000);
	return Math.floor(Math.random() * (max - min) + min).toString(); // The maximum is exclusive and the minimum is inclusive
}

export function generateRandomExtendedImageNameValue() {
	const min = Math.ceil(10000);
	const max = Math.floor(90000);
	return Math.floor(Math.random() * (max - min) + min).toString(); // The maximum is exclusive and the minimum is inclusive
}
