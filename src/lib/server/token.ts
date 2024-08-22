import { createHash, randomBytes } from 'crypto';

export type GeneratedToken = {
	urlencoded: string;
	hash: string;
};

export function generateToken(): GeneratedToken {
	const bytes = randomBytes(26);
	const urlencoded = bytes.toString('base64url');
	const hash = createHash('sha256').update(bytes).digest('base64');
	return {
		urlencoded,
		hash
	};
}

export function hashToken(urlencoded: string): string {
	const bytes = Buffer.from(urlencoded, 'base64url');
	return createHash('sha256').update(bytes).digest('base64');
}
