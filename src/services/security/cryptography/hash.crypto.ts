import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashCryptography {
	constructor(private hashSalt: number) {}

	hashingPlainText(plainText: string): Promise<string> {
		return new Promise((resolve, reject) => {
			bcrypt.genSalt(this.hashSalt, function (err, salt) {
				if (err) {
					reject(err);
				}
				bcrypt.hash(plainText, salt, function (err, hash) {
					if (err) {
						reject(err);
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
					reject(err);
				}

				resolve(compareResult);
			});
		});
	}
}
