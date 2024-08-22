<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { emailForm as emailSchema, firstNameForm as firstNameSchema } from '$lib/schemas';
	import { formHandleServerError } from '$lib/utils';
	import { SquarePen } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let firstNameDialogOpen = false;
	const firstNameForm = superForm(data.firstNameForm, {
		validators: zod(firstNameSchema),
		onResult: ({ result }) => {
			if (result.type == 'success') firstNameDialogOpen = false;
		},
		onError: ({ result }) => {
			formHandleServerError(result);
		}
	});
	const { form: firstNameFormData } = firstNameForm;

	let emailDialogState: boolean | 'success' = false;
	const emailForm = superForm(data.emailForm, {
		validators: zod(emailSchema),
		onResult: ({ result }) => {
			if (result.type == 'success') emailDialogState = 'success';
		},
		onError: ({ result }) => {
			formHandleServerError(result);
		}
	});
	const { form: emailFormData } = emailForm;
</script>

<svelte:head>
	<title>NoteLocker - Account</title>
</svelte:head>

<div class="flex flex-col gap-2">
	<div class="flex items-center">
		<span class="shrink-0 basis-[100px] text-sm font-bold">First Name</span>
		<div
			class="flex min-w-0 basis-[300px] items-center justify-between rounded-md border border-input px-4 py-2 text-sm opacity-70"
		>
			<span class="mr-2 overflow-hidden">{data.user.firstName}</span>
			<Dialog.Root
				onOpenChange={(state) => {
					if (state) $firstNameFormData.firstNme = data.user.firstName;
				}}
				bind:open={firstNameDialogOpen}
			>
				<Dialog.Trigger>
					<SquarePen size="18" />
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Edit First Name</Dialog.Title>
						<Dialog.Description>Please enter your new first name below</Dialog.Description>
					</Dialog.Header>
					<form method="POST" action="?/firstName" use:firstNameForm.enhance>
						<Form.Field form={firstNameForm} name="firstNme">
							<Form.Control let:attrs>
								<Input
									type="text"
									class="mb-3"
									{...attrs}
									bind:value={$firstNameFormData.firstNme}
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Dialog.Footer>
							<Form.Button disabled={$firstNameFormData.firstNme == data.user.firstName}>
								Submit
							</Form.Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
	<div class="flex items-center">
		<span class="shrink-0 basis-[100px] text-sm font-bold">Email</span>
		<div
			class="flex min-w-0 basis-[300px] items-center justify-between rounded-md border border-input px-4 py-2 text-sm opacity-70"
		>
			<span class="mr-2 overflow-hidden">{data.user.email}</span>
			<Dialog.Root
				onOpenChange={(state) => {
					if (state) {
						$emailFormData.email = data.user.email;
						emailDialogState = true;
					}
				}}
				open={emailDialogState != false}
			>
				<Dialog.Trigger>
					<SquarePen size="18" />
				</Dialog.Trigger>
				<Dialog.Content>
					{#if emailDialogState == 'success'}
						<Dialog.Header>
							<Dialog.Title class="mb-3">Verification email sent</Dialog.Title>
							To finish changing your email, please follow the link sent to your new email
						</Dialog.Header>
						<Dialog.Footer>
							<Button variant="outline" on:click={() => (emailDialogState = false)}>Close</Button>
						</Dialog.Footer>
					{:else}
						<Dialog.Header>
							<Dialog.Title>Edit Email</Dialog.Title>
							<Dialog.Description class="flex flex-col">
								<span>Please enter your new email below</span>
								<span>You will have to verify your new email address</span>
							</Dialog.Description>
						</Dialog.Header>
						<form method="POST" action="?/email" use:emailForm.enhance>
							<Form.Field form={emailForm} name="email">
								<Form.Control let:attrs>
									<Input type="text" class="mb-3" {...attrs} bind:value={$emailFormData.email} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Dialog.Footer>
								<Form.Button disabled={$emailFormData.email == data.user.email}>Submit</Form.Button>
							</Dialog.Footer>
						</form>
					{/if}
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
	<Button variant="destructive" href="/api/logout" class="self-start">Sign Out</Button>
</div>
