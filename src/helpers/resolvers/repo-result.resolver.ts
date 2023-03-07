export class RepoResult<T> {
	public result: T;
	public error: string;

	constructor(result: T, error: string) {
		this.result = result;
		this.error = error;
	}
}
