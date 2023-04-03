export interface NodeConfig {
	NODE_ENV: string;
	PORT: number;
}

export interface AesConfig {
	KEY: string;
	IV: string;
}

export interface HashingConfig {
	SALT: string;
}

export interface JwtConfig {
	ALGORITHM: string;
	ACCESS_TOKEN_EXPIRES_IN: string;
	REFRESH_TOKEN_EXPIRES_IN: string;
	NO_TIMESTAMP: boolean;
	KEY_ID: string;
	AUDIENCE: string;
	ISSUER: string;
	JWT_ID: string;
	PUBLIC_KEY: string;
	PRIVATE_KEY: string;
}

export interface PostgresConfig {
	PG_HOST: string;
	PG_USER: string;
	PG_PASSWORD: string;
	PG_PORT: number;
	PG_DB_NAME: string;
	PG_CONNNECTION_STRING: string;
}

export interface MailConfig {
	HOST: string;
	PORT: string;
	IS_SECURE: boolean;
	DEFAULT_FROM_USER: string;
	AUTH_USER: string;
	AUTH_PASSWORD: string;
}

export interface RedisConfig {
	HOST: string;
	PORT: string;
	USER: string;
	PASSWORD: string;
}

export interface CloudinaryConfig {
	CLOUD_NAME: string;
	API_KEY: string;
	API_SECRET: string;
}
