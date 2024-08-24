<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { resetPassword as schema } from '$lib/schemas';
	import { formHandleServerError } from '$lib/utils';
	import { Loader } from 'lucide-svelte';
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
	const { form: formData, submitting, enhance } = form;
</script>

<svelte:head>
	<title>NoteLocker - Update Password</title>
</svelte:head>

<div class="flex h-full items-center justify-center">
	<Card.Form>
		<Card.Header>
			<Card.Title>Change Password</Card.Title>
			<Card.Description>Enter your new password below</Card.Description>
		</Card.Header>
		<form method="POST" use:enhance>
			<Card.Content class="flex flex-col gap-1">
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
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Form.Button class="w-20" disabled={$submitting}>
					{#if $submitting}
						<Loader size="16" class="animate-spin" />
					{:else}
						Submit
					{/if}
				</Form.Button>
			</Card.Footer>
		</form>
	</Card.Form>
</div>
