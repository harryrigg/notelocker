import prisma from '$lib/server/db';
import { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

const schema = z.object({
	notes: z.array(z.string())
});

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const data = schema.parse(await request.json());
		const notes = await prisma.note.findMany({
			where: {
				id: {
					in: data.notes
				},
				authorId: locals.user!.id
			},
			select: {
				id: true,
				title: true,
				content: true,
				updatedAt: true,
				createdAt: true
			}
		});
		return json({ notes: notes }, { status: 200 });
	} catch (e) {
		if (e instanceof z.ZodError) {
			error(400);
		} else if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
			error(404);
		} else {
			throw e;
		}
	}
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	try {
		const data = schema.parse(await request.json());
		await prisma.note.deleteMany({
			where: {
				id: {
					in: data.notes
				},
				authorId: locals.user!.id
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
