<script lang="ts">
	import NotesTable from '$lib/components/main/notes-table/notes-table.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Card from '$lib/components/ui/card';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	const user = data.user;
	$: notes = data.notes;
</script>

<svelte:head>
	<title>NoteLocker - Dashboard</title>
</svelte:head>

<div class="flex h-full min-h-0 flex-col">
	<div class="mb-5 flex">
		<div class="flex flex-col space-y-1.5">
			<Card.Title>Welcome {user.firstName}</Card.Title>
			<Card.Description>You can view your notes below</Card.Description>
		</div>
		<a href="/dashboard/account" class="ml-auto">
			<Avatar.Root>
				<Avatar.Fallback>{user.firstName[0]}</Avatar.Fallback>
			</Avatar.Root>
		</a>
	</div>
	<NotesTable class="min-h-0 flex-1" {notes} />
</div>
