import { LIMITER_COOKIE_SECRET_KEY } from '$env/static/private';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

// Strict limits for endpoints which send email
export const rateLimiter = new RateLimiter({
	IP: [4, 'h'],
	IPUA: [2, '30m'],
	cookie: {
		name: 'limiterid',
		secret: LIMITER_COOKIE_SECRET_KEY,
		rate: [1, '5m'],
		preflight: true
	}
});
