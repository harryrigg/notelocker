import { register as schema } from '$lib/schemas';
import prisma from '$lib/server/db';
import { sendVerificationEmail } from '$lib/server/email';
import { generateToken } from '$lib/server/token';
import { validateToken } from '$lib/server/turnstile';
import { hash } from '@node-rs/argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { fail } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(schema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Validate CAPTCHA
		const turnstileResponse = await validateToken(form.data.turnstileToken);
		if (!turnstileResponse.success) {
			return setError(form, 'turnstileToken', 'CAPTCHA validation failed');
		}

		// Create verification token
		const token = generateToken();

		// Create user
		const id = generateIdFromEntropySize(10);
		const passwordHash = await hash(form.data.password);

		// Database transaction
		try {
			await prisma.$transaction([
				prisma.user.create({
					data: {
						id,
						email: form.data.email,
						firstName: capitalize(form.data.firstName),
						passwordHash
					}
				}),
				prisma.emailToken.create({
					data: {
						userId: id,
						tokenHash: token.hash
					}
				})
			]);
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
				return setError(form, 'email', 'Email is already in use');
			}
			throw e;
		}

		sendVerificationEmail(form.data.email, token.urlencoded);

		return setMessage(form, 'success');
	}
};

function capitalize(name: string): string {
	return name[0].toUpperCase() + name.slice(1);
}
