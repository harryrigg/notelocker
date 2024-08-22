import { emailForm as emailSchema, firstNameForm as firstNameSchema } from '$lib/schemas';
import prisma from '$lib/server/db';
import { sendChangeEmailEmail } from '$lib/server/email';
import { generateToken } from '$lib/server/token';
import { error, fail } from '@sveltejs/kit';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { rateLimiter } from '$lib/server/rate_limit';

export const load: PageServerLoad = async (event) => {
	await rateLimiter.cookieLimiter?.preflight(event);
	const { locals } = event;

	// User will never be null as route is protected
	const user = locals.user!;

	const firstNameForm = await superValidate({ firstNme: user.firstName }, zod(firstNameSchema));
	const emailForm = await superValidate({ email: user.email }, zod(emailSchema));

	return {
		user,
		firstNameForm,
		emailForm
	};
};

export const actions: Actions = {
	firstName: async ({ request, locals }) => {
		const form = await superValidate(request, zod(firstNameSchema));
		if (!form.valid) return fail(400, { firstNameForm: form });

		await prisma.user.update({
			where: {
				id: locals.user!.id
			},
			data: {
				firstName: form.data.firstNme
			}
		});

		return setMessage(form, 'success');
	},
	email: async (event) => {
		if (await rateLimiter.isLimited(event)) return error(429);

		const { locals, request } = event;

		const user = locals.user!;

		const form = await superValidate(request, zod(emailSchema));
		if (!form.valid) return fail(400, { emailForm: form });

		const count = await prisma.user.count({
			where: {
				email: form.data.email
			}
		});
		if (count != 0) return setError(form, 'email', 'Email is already in use');

		const token = generateToken();
		await prisma.$transaction([
			prisma.changeEmailToken.deleteMany({
				where: {
					userId: user.id
				}
			}),
			prisma.changeEmailToken.create({
				data: {
					userId: user.id,
					tokenHash: token.hash,
					newEmail: form.data.email
				}
			})
		]);

		sendChangeEmailEmail(form.data.email, token.urlencoded);
		return setMessage(form, 'success');
	}
};
