import prisma from '$lib/server/db';
import { Prisma } from '@prisma/client';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

const schema = z
	.object({
		title: z.string().max(100),
		content: z.string()
	})
	.strict();

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	try {
		const data = schema.parse(await request.json());
		await prisma.note.update({
			where: {
				id: params.id,
				authorId: locals.user!.id
			},
			data: {
				title: data.title,
				content: data.content
			}
		});
	} catch (e) {
		if (e instanceof z.ZodError) {
			error(400);
		} else if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
			error(404);
		} else {
			throw e;
		}
	}

	return new Response(null, { status: 200 });
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	await prisma.note.delete({
		where: {
			id: params.id,
			authorId: locals.user!.id
		}
	});
	return new Response(null, { status: 200 });
};
