import { PrismaClient } from '@prisma/client';
import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';
import { customAlphabet } from 'nanoid';

const prisma = new PrismaClient();

const generateId = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	16
);

// Generate user
const passwordHash = await hash('password123');
await prisma.user.create({
	data: {
		id: generateIdFromEntropySize(10),
		email: 'test@test.com',
		passwordHash,
		verified: true,
		firstName: 'John'
	}
});

// Generate 100 notes
for (let i = 0; i < 100; i++) {
	const id = generateId();
	const title = `Note ${i + 1}`;
	const content = `This is the content of note ${i + 1}`;

	await prisma.note.create({
		data: {
			id,
			title,
			content,
			author: {
				connect: {
					email: 'test@test.com'
				}
			}
		}
	});
}
