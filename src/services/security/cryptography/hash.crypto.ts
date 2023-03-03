import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import bcrypt from 'bcryptjs';

@Injectable()
export class HashCryptography {
	constructor(private hashSalt: number) {}

	hashingPlainText(plainText: string): Promise<string> {
		return new Promise((resolve, reject) => {
			bcrypt.genSalt(this.hashSalt, function (err, salt) {
				if (err) {
					reject(
						`\nError caused when it generate salt for hashing | Details: ${err}`
					);
				}
				bcrypt.hash(plainText, salt, function (err, hash) {
					if (err) {
						reject(
							`\nError caused when make hashing for plain text | Details: ${err}`
						);
					}

					resolve(hash);
				});
			});
		});
	}

	comparePlainTextWithHash(
		plaintext: string,
		hashText: string
	): Promise<boolean> {
		return new Promise((resolve, reject) => {
			bcrypt.compare(plaintext, hashText, function (err, compareResult) {
				if (err) {
					reject(
						`\nError caused when compare hash to palin text | Details: ${err}`
					);
				}

				resolve(compareResult);
			});
		});
	}
}
