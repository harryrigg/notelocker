<script lang="ts">
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { register as schema } from '$lib/schemas';
	import { formHandleServerError } from '$lib/utils';
	import { Loader } from 'lucide-svelte';
	import { Turnstile } from 'svelte-turnstile';
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
	const { form: formData, submitting, enhance, message } = form;
</script>

<svelte:head>
	<title>NoteLocker - Register</title>
</svelte:head>

<div class="flex h-full items-center justify-center">
	<Card.Form>
		{#if $message == 'success'}
			<Card.Message>
				<Card.Header>
					<Card.Title>Check your inbox</Card.Title>
				</Card.Header>
				<Card.Content>
					To complete your registration, please check your email for a confirmation link.
				</Card.Content>
			</Card.Message>
		{:else}
			<Card.Header>
				<Card.Title>Register</Card.Title>
				<Card.Description>
					Already have an account? <a class="underline" href="/login">Login here</a>
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
					<Form.Field {form} name="firstName">
						<Form.Control let:attrs>
							<Form.Label>First Name</Form.Label>
							<Input {...attrs} bind:value={$formData.firstName} />
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
					<Form.Field {form} name="passwordConfirmation">
						<Form.Control let:attrs>
							<Form.Label>Confirm Password</Form.Label>
							<Input type="password" {...attrs} bind:value={$formData.passwordConfirmation} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="turnstileToken" class="mt-3">
						<Form.Control>
							<Turnstile siteKey={PUBLIC_TURNSTILE_SITE_KEY} responseFieldName="turnstileToken" />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
				<Card.Footer>
					<Form.Button class="w-20" disabled={$submitting}>
						{#if $submitting}
							<Loader size="16" class="animate-spin" />
						{:else}
							Submit
						{/if}
					</Form.Button>
				</Card.Footer>
			</form>
		{/if}
	</Card.Form>
</div>
