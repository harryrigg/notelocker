<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { login as schema } from '$lib/schemas';
	import { formHandleServerError } from '$lib/utils';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const form = superForm(data.form, {
		validators: zodClient(schema),
		onError: ({ result }) => {
			formHandleServerError(result);
		}
	});
	const { form: formData, enhance } = form;
</script>

<svelte:head>
	<title>NoteLocker - Login</title>
</svelte:head>

<div class="flex h-full items-center justify-center">
	<Card.Root class="md:w-2/5">
		<Card.Header>
			<Card.Title>Login</Card.Title>
			<Card.Description>
				Don't have an account yet? <a class="underline" href="/register">Register here</a>
			</Card.Description>
		</Card.Header>
		<form method="POST" use:enhance>
			<Card.Content class="flex flex-col gap-1">
				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} bind:value={$formData.email} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Password</Form.Label>
						<Input type="password" {...attrs} bind:value={$formData.password} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Button variant="outline" href="/login/forgot">Forgot Password</Button>
				<Form.Button>Submit</Form.Button>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
