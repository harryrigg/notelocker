<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { SortProperty, SortState } from '$lib/types';
	import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-svelte';

	const iconSize = '16';

	export let state: SortState;

	function toggleProperty(property: SortProperty) {
		if (state.property !== property) {
			state.property = property;
			state.order = 'ascending';
		} else {
			state.order = state.order === 'ascending' ? 'descending' : 'ascending';
		}
	}
</script>

<DropdownMenu.Root closeOnItemClick={false}>
	<DropdownMenu.Trigger>
		<Button variant="outline" class="gap-1.5"><ArrowUpDown size="16" />Sort</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="bottom" align="end" class="w-36">
		<DropdownMenu.Item class="justify-between" on:click={() => toggleProperty('title')}>
			Title
			{#if state.property === 'title'}
				{#if state.order == 'ascending'}
					<ArrowUp size={iconSize} />
				{:else}
					<ArrowDown size={iconSize} />
				{/if}
			{/if}
		</DropdownMenu.Item>
		<DropdownMenu.Item class="justify-between" on:click={() => toggleProperty('created_at')}>
			Created at
			{#if state.property === 'created_at'}
				{#if state.order == 'ascending'}
					<ArrowUp size={iconSize} />
				{:else}
					<ArrowDown size={iconSize} />
				{/if}
			{/if}
		</DropdownMenu.Item>
		<DropdownMenu.Item class="justify-between" on:click={() => toggleProperty('updated_at')}>
			Last updated
			{#if state.property === 'updated_at'}
				{#if state.order == 'ascending'}
					<ArrowUp size={iconSize} />
				{:else}
					<ArrowDown size={iconSize} />
				{/if}
			{/if}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
