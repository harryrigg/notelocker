import prisma from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	// Will never be null as the route is protected by server hook
	const user = locals.user!;

	// Fetch note
	const note = await prisma.note.findUnique({
		where: {
			id: params.id,
			authorId: user.id
		},
		select: {
			title: true,
			content: true
		}
	});

	if (!note) error(404, 'Note not found');

	return { id: params.id, title: note.title, content: note.content };
};
