import { resetPassword as schema } from '$lib/schemas';
import { lucia } from '$lib/server/auth';
import prisma from '$lib/server/db';
import { hashToken } from '$lib/server/token';
import { hash } from '@node-rs/argon2';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

async function getTokenData(token: string) {
	const tokenHash = hashToken(token);
	return await prisma.passwordResetToken.findUnique({
		where: { tokenHash }
	});
}

export const load: PageServerLoad = async ({ params }) => {
	const tokenData = await getTokenData(params.token);
	if (!tokenData) error(404);

	const form = await superValidate(zod(schema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const tokenData = await getTokenData(params.token);
		if (!tokenData) error(404);

		const form = await superValidate(request, zod(schema));

		if (!form.valid) return fail(400, { form });

		// Update user password and delete token
		const passwordHash = await hash(form.data.password);
		await prisma.$transaction([
			prisma.user.update({
				where: {
					id: tokenData.userId
				},
				data: {
					passwordHash
				}
			}),
			prisma.passwordResetToken.delete({
				where: {
					tokenHash: tokenData.tokenHash
				}
			})
		]);

		await lucia.invalidateUserSessions(tokenData.userId);

		redirect(303, '/reset/success');
	}
};
