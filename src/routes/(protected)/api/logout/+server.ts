import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function GET({ locals, cookies }) {
	// Invalidate session
	if (locals.session) await lucia.invalidateSession(locals.session.id);

	// Clear cookie
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	redirect(303, '/login');
}
