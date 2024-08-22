import { login as schema } from '$lib/schemas';
import { lucia } from '$lib/server/auth';
import prisma from '$lib/server/db';
import { verify } from '@node-rs/argon2';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(schema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) return fail(400, { form });

		const user = await prisma.user.findUnique({
			where: {
				email: form.data.email,
				verified: true
			}
		});

		if (!user) {
			return setError(form, 'email', 'Incorrect username or password');
		}

		const passwordValid = await verify(user.passwordHash, form.data.password);
		if (!passwordValid) {
			return setError(form, 'email', 'Incorrect username or password');
		}

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		return { form };
	}
};
