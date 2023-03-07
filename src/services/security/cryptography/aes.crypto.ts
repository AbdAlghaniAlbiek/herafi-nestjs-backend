import { Injectable } from '@nestjs/common';
import cryptoObj from 'crypto';

export enum AlgorithmTypes {
	aes128 = 'aes-128',
	aes192 = 'aes-192',
	aes256 = 'aes-256'
}

export enum BufferEncryption {
	base64 = 'base64',
	hash = 'hash'
}

export enum EncryptionMode {
	cbc = 'cbc',
	ecb = 'ecb',
	cfb = 'cfb',
	ofb = 'ofb',
	ctr = 'ctr'
}

export enum EncryptionEncoding {
	utf8 = 'utf-8',
	asci = 'asci'
}

@Injectable()
export class AESCryptography {
	constructor(
		private alrorithmType: any,
		private bufferEncryption: any,
		private encryptionMode: any,
		private encryptionEncoding: any,
		private key: any,
		private iv: any
	) {}

	public encryption(plainText: string): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const key = Buffer.from(this.key, this.encryptionEncoding);
				const iv = Buffer.from(this.iv, this.encryptionEncoding);
				const cipher = cryptoObj.createCipheriv(
					this.alrorithmType + '-' + this.encryptionMode,
					key,
					iv
				);
				let cipherText = cipher.update(
					plainText,
					this.encryptionEncoding,
					this.bufferEncryption
				);
				cipherText += cipher.final(this.encryptionEncoding);
				resolve(cipherText);
			} catch (err) {
				reject(
					`\nError caused when make Encryption for plain text | Details: ${err}`
				);
			}
		});
	}

	public decryption(cipherText: string): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const buff = Buffer.from(cipherText, this.bufferEncryption);
				const key = Buffer.from(this.key, this.encryptionEncoding);
				const iv = Buffer.from(this.iv, this.encryptionEncoding);
				const decipher = cryptoObj.createDecipheriv(
					this.alrorithmType + '-' + this.encryptionMode,
					key,
					iv
				);
				const plainText =
					decipher.update(buff).toString() +
					decipher.final().toString();
				resolve(plainText);
			} catch (err) {
				reject(
					`\nError caused when make Decryption for plain text | Details: ${err}`
				);
			}
		});
	}
}
