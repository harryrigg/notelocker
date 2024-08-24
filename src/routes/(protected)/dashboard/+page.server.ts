import prisma from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { customAlphabet } from 'nanoid';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// User will never be null as route is protected
	const user = locals.user!;

	// Fetch notes
	const notes = await prisma.note.findMany({
		where: {
			authorId: user.id
		},
		select: {
			id: true,
			title: true,
			createdAt: true,
			updatedAt: true
		}
	});

	const setTitle = (note: (typeof notes)[number]) => {
		if (note.title.trim() === '') {
			note.title = 'Untitled Note';
		}
		return note;
	};

	return {
		user,
		notes: notes.map(setTitle)
	};
};

const generateId = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	16
);

export const actions: Actions = {
	new: async ({ locals }) => {
		// Create a new note
		const id = generateId();
		await prisma.note.create({
			data: {
				id,
				authorId: locals.user!.id,
				title: '',
				content: ''
			}
		});

		redirect(303, `/dashboard/${id}`);
	}
};
