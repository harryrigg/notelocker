import prisma from '$lib/server/db';
import { hashToken } from '$lib/server/token';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const token = params.token;
	const tokenHash = hashToken(token);

	const emailToken = await prisma.emailToken.findUnique({
		where: {
			tokenHash
		}
	});
	if (!emailToken) error(404);

	await prisma.$transaction([
		prisma.user.update({
			where: {
				id: emailToken.userId
			},
			data: {
				verified: true
			}
		}),
		prisma.emailToken.delete({
			where: {
				tokenHash
			}
		})
	]);

	redirect(303, '/verify/success');
};
