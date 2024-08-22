import { lucia } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';

function redirectAwayFromProtected(event) {
	if (event.route.id?.startsWith('/(protected)')) {
		redirect(303, '/login');
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;

		redirectAwayFromProtected(event);

		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirectAwayFromProtected(event);
	}

	// Redirect authenticated user away from auth routes
	if (event.route.id?.startsWith('/(auth)')) {
		redirect(303, '/dashboard');
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
