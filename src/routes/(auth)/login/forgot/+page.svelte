<script lang="ts">
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { forgotPassword as schema } from '$lib/schemas';
	import { formHandleServerError } from '$lib/utils';
	import { Turnstile } from 'svelte-turnstile';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageServerData } from './$types';
	import { Loader } from 'lucide-svelte';

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
	<title>NoteLocker - Forgot Password</title>
</svelte:head>

<div class="flex h-full items-center justify-center">
	<Card.Root class="w-full md:w-2/5">
		{#if $message == 'success'}
			<Card.Header>
				<Card.Title>Check your inbox</Card.Title>
			</Card.Header>
			<Card.Content>We've sent you an email with instructions to reset your password</Card.Content>
		{:else}
			<Card.Header>
				<Card.Title>Forgot Password</Card.Title>
				<Card.Description>
					Enter your email and we'll send you an email with the next step
				</Card.Description>
			</Card.Header>
			<form method="POST" use:enhance>
				<Card.Content class="flex flex-col gap-3">
					<Form.Field {form} name="email">
						<Form.Control let:attrs>
							<Form.Label>Email</Form.Label>
							<Input {...attrs} bind:value={$formData.email} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="turnstileToken">
						<Form.Control>
							<Turnstile siteKey={PUBLIC_TURNSTILE_SITE_KEY} responseFieldName="turnstileToken" />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
				<Card.Footer class="flex justify-between">
					<Button variant="outline" href="/login">Back to Login</Button>
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
	</Card.Root>
</div>
