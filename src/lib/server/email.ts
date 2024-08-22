import { RESEND_API_KEY } from '$env/static/private';
import { PUBLIC_URL } from '$env/static/public';
import { Resend } from 'resend';

const resend = new Resend(RESEND_API_KEY);
const from = 'NoteLocker <noreply@notelocker.harryrigg.com>';

export async function sendVerificationEmail(email: string, token: string) {
	const { error } = await resend.emails.send({
		from,
		to: [email],
		subject: 'Verify your NoteLocker email address',
		html: `<p><b>Thanks for creating an account with NoteLocker.</b></p><p><a href="${PUBLIC_URL}/verify/${token}">Click here</a> to verify your email address</p>`
	});

	if (error) {
		throw new Error('Failed to send verification email');
	}
}

export async function sendPasswordResetEmail(email: string, token: string) {
	const { error } = await resend.emails.send({
		from,
		to: [email],
		subject: 'Reset your NoteLocker password',
		html: `<p><b>You requested a password reset for your NoteLocker account.</b></p><p><a href="${PUBLIC_URL}/reset/${token}">Click here</a> to reset your password</p>`
	});

	if (error) {
		throw new Error('Failed to send verification email');
	}
}

export async function sendChangeEmailEmail(email: string, token: string) {
	const { error } = await resend.emails.send({
		from,
		to: [email],
		subject: 'Change your NoteLocker email address',
		html: `<p><b>You recently requested to change the email associated with your NoteLocker account</b></p><p>Requested new email: <i>${email}</i></p><p><a href="${PUBLIC_URL}/change-email/${token}">Click here</a> to change to this email</p>`
	});

	if (error) {
		throw new Error('Failed to send verification email');
	}
}
