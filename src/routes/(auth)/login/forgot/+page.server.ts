import { forgotPassword as schema } from '$lib/schemas';
import prisma from '$lib/server/db';
import { sendPasswordResetEmail } from '$lib/server/email';
import { generateToken } from '$lib/server/token';
import { validateToken } from '$lib/server/turnstile';
import { error, fail } from '@sveltejs/kit';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { rateLimiter } from '$lib/server/rate_limit';

export const load: PageServerLoad = async (event) => {
	await rateLimiter.cookieLimiter?.preflight(event);

	const form = await superValidate(zod(schema));

	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		if (await rateLimiter.isLimited(event)) error(429);

		const { request } = event;

		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Validate CAPTCHA
		const turnstileResponse = await validateToken(form.data.turnstileToken);
		if (!turnstileResponse.success) {
			return setError(form, 'turnstileToken', 'CAPTCHA validation failed');
		}

		// Get user ID
		const user = await prisma.user.findUnique({
			where: {
				email: form.data.email,
				verified: true
			},
			select: {
				id: true
			}
		});
		if (!user) {
			return setError(form, 'email', 'Email address does not belong to an account');
		}

		const token = generateToken();
		await prisma.passwordResetToken.create({
			data: {
				userId: user.id,
				tokenHash: token.hash
			}
		});

		await sendPasswordResetEmail(form.data.email, token.urlencoded);

		return setMessage(form, 'success');
	}
};
