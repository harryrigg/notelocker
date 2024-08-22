<script lang="ts">
	import { goto } from '$app/navigation';
	import { preferences } from '$lib/client/preferences';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { CheckCheck, Loader, RefreshCw, Trash2, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const id = data.id;
	let title = data.title;
	let content = data.content;

	let justSaved = true;
	let modifiedWhileSaving = false;
	let saving = false;

	let autoSaveTimeoutId: NodeJS.Timeout | null = null;

	let titleRef: HTMLInputElement;
	onMount(() => {
		titleRef.focus();
	});

	function windowKeyDown(e: KeyboardEvent) {
		if (e.ctrlKey && e.key === 's') {
			e.preventDefault();
			save();
		}
	}

	async function delete_note() {
		await fetch(`/api/note/${id}`, { method: 'DELETE' });
		justSaved = true;
		await goto('/dashboard', { invalidateAll: true });
	}

	async function save() {
		if (saving) return;
		saving = true;
		await fetch(`/api/note/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title, content })
		});
		if (autoSaveTimeoutId != null) autoSaveTimeoutId = null;
		if (modifiedWhileSaving) {
			modifiedWhileSaving = false;
		} else {
			justSaved = true;
		}
		saving = false;
	}

	function onInput() {
		if (saving) {
			modifiedWhileSaving = true;
		} else {
			justSaved = false;
		}

		if ($preferences.autosave.enabled && autoSaveTimeoutId == null) {
			autoSaveTimeoutId = setTimeout(async () => {
				await save();
			}, $preferences.autosave.interval);
		}
	}

	async function returnToDashboard() {
		if (autoSaveTimeoutId != null) clearTimeout(autoSaveTimeoutId);
		let invalidateAll = false;
		if ($preferences.autosave.saveOnExit && !justSaved) {
			await save();
			invalidateAll = true;
		}
		await goto('/dashboard', { invalidateAll });
	}
</script>

<svelte:head>
	<title>{title == '' ? 'Untitled Note' : title}</title>
</svelte:head>

<svelte:window on:keydown={windowKeyDown} />

<div class="flex h-full flex-col gap-4">
	<div class="flex flex-1 flex-col gap-2 border-l pl-5">
		<div class="flex items-center gap-3">
			<!-- svelte-ignore a11y-positive-tabindex -->
			<input
				name="title"
				type="text"
				class="min-w-0 bg-background py-2 text-xl tracking-tight outline-none"
				placeholder="Enter note title..."
				tabindex="1"
				on:input={onInput}
				bind:this={titleRef}
				bind:value={title}
			/>

			<AlertDialog.Root>
				<AlertDialog.Trigger class="ml-auto">
					<button
						class="ml-auto flex items-center justify-center gap-1 rounded-md border border-destructive px-2 py-1 text-destructive"
					>
						<Trash2 />
					</button>
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Are you sure?</AlertDialog.Title>
						<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<AlertDialog.Action on:click={delete_note}>Continue</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
			<button class="flex items-center justify-center" on:click={returnToDashboard}>
				<X />
			</button>
		</div>
		<!-- svelte-ignore a11y-positive-tabindex -->
		<textarea
			name="content"
			placeholder="Enter your note here..."
			class="flex-1 resize-none bg-background text-sm outline-none"
			tabindex="2"
			on:input={onInput}
			bind:value={content}
		/>
	</div>
	<div class="flex flex-shrink">
		<button class="flex items-center gap-1.5 rounded bg-muted px-2 py-1 text-sm" on:click={save}>
			{#if justSaved}
				<CheckCheck size="16" />
				Saved
			{:else if saving}
				<Loader size="16" class="animate-spin" />
				Saving...
			{:else}
				<RefreshCw size="16" />
				Unsaved Changes (click to save)
			{/if}
		</button>
	</div>
</div>
