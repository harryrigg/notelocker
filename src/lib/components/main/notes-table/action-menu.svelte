<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { downloadString, formHandleServerError } from '$lib/utils';
	import { CircleEllipsis, Download, Trash2 } from 'lucide-svelte';

	const iconSize = '16';

	export let selected: Array<string>;

	async function deleteSelected() {
		const data = {
			notes: Array.from(selected)
		};

		const result = await fetch('/api/note/selected', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		formHandleServerError(result);
		await invalidateAll();

		selected = [];
	}

	async function downloadSelected() {
		const resp = await fetch('/api/note/selected', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ notes: selected })
		});
		formHandleServerError(resp);

		if (resp.status == 200) {
			const data: { notes: { title: string; content: string }[] } = await resp.json();
			data.notes.forEach((note) => {
				downloadString(`note_${note.title.replaceAll(' ', '_')}.txt`, note.content);
			});
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" disabled={selected.length == 0} class="gap-1.5" builders={[builder]}>
			<CircleEllipsis size="16" /><span class="w-[90px]">Selected ({selected.length})</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="bottom" align="end" class="w-36">
		<DropdownMenu.Item class="gap-2" on:click={deleteSelected}>
			<Trash2 size={iconSize} /> Delete
		</DropdownMenu.Item>
		<DropdownMenu.Item class="gap-2" on:click={downloadSelected}>
			<Download size={iconSize} /> Download
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
