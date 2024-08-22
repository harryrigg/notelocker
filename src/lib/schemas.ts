import { z } from 'zod';

const email = z.string().email();
const password = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.max(128, 'Password must be at most 128 characters');
const firstName = z
	.string()
	.min(1, 'First name is required')
	.max(50, 'First name must be less than 50 characters')
	.regex(/^\p{L}+$/u, 'First name must only consist of alphabetic characters');
const turnstileToken = z.string();

export const login = z.object({
	email,
	password
});

export const forgotPassword = z.object({
	email,
	turnstileToken
});

export const register = z
	.object({
		email,
		firstName,
		password,
		passwordConfirmation: z.string(),
		turnstileToken
	})
	.refine((a) => a.password === a.passwordConfirmation, {
		message: 'Passwords must match',
		path: ['passwordConfirmation']
	});

export const resetPassword = z
	.object({
		password,
		passwordConfirmation: z.string()
	})
	.refine((a) => a.password === a.passwordConfirmation, {
		message: 'Passwords must match',
		path: ['passwordConfirmation']
	});

export const firstNameForm = z.object({
	firstNme: firstName
});

export const emailForm = z.object({
	email
});
