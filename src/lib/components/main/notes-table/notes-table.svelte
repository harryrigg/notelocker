<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import type { SortState } from '$lib/types';
	import { cn } from '$lib/utils';
	import { CirclePlus } from 'lucide-svelte';
	import ActionMenu from './action-menu.svelte';
	import Checkbox from './checkbox.svelte';
	import SortMenu from './sort-menu.svelte';

	let className;
	export { className as class };

	export let notes: {
		id: string;
		title: string;
		updatedAt: Date;
		createdAt: Date;
	}[];

	let selected: Array<string> = [];
	$: allSelected = notes.every((note) => selected.includes(note.id));

	let filter = '';
	$: filtered = notes.filter((note) =>
		note.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
	);

	let sortState: SortState = { property: 'updated_at', order: 'descending' };
	$: sorted = filtered.toSorted((a, b) => {
		let val;
		if (sortState.property === 'title') {
			val = b.title.localeCompare(a.title);
		} else if (sortState.property === 'created_at') {
			val = a.createdAt.getTime() - b.createdAt.getTime();
		} else if (sortState.property === 'updated_at') {
			val = a.updatedAt.getTime() - b.updatedAt.getTime();
		}
		return val * (sortState.order === 'ascending' ? 1 : -1);
	});

	function onSelectAll(state) {
		if (state) {
			selected = notes.map((note) => note.id);
		} else {
			selected = [];
		}
	}

	function onSelectedChange(state, id) {
		if (state) {
			selected = [...selected, id];
		} else {
			selected = selected.filter((sId) => sId != id);
		}
	}
</script>

<div class={cn('flex min-h-0 flex-col gap-2', className)}>
	<div class="flex flex-col-reverse gap-1.5 lg:flex-row">
		<div class="flex gap-1.5">
			<Input
				type="search"
				placeholder="Filter notes..."
				class="h-[40px] flex-grow basis-[300px]"
				bind:value={filter}
			/>
			<SortMenu bind:state={sortState} />
		</div>

		<div class="inline-flex gap-1 lg:ml-auto">
			<form method="POST" action="?/new" use:enhance>
				<Button type="submit" variant="default" class="gap-1.5">
					<CirclePlus size="18" />
					New
				</Button>
			</form>
			<ActionMenu bind:selected />
		</div>
	</div>
	<div class="flex flex-1 flex-col overflow-auto rounded-md border">
		{#if notes.length == 0}
			<span class="m-auto text-muted-foreground">No notes</span>
		{:else}
			<div class="flex items-center gap-4 border-b px-3 py-2">
				<Checkbox onCheckedChange={onSelectAll} checked={allSelected} />
				<span class="text-sm text-muted-foreground">Title</span>
			</div>
			{#each sorted as note}
				<div class="flex items-center gap-4 border-b px-3">
					<Checkbox
						checked={selected.includes(note.id)}
						onCheckedChange={(state) => onSelectedChange(state, note.id)}
					/>
					<a href={`/dashboard/${note.id}`} class="flex-1 py-3">
						<span>{note.title}</span>
					</a>
				</div>
			{/each}
		{/if}
	</div>
</div>
