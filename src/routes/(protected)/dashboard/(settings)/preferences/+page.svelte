<script lang="ts">
	import { preferences } from '$lib/client/preferences';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Select from '$lib/components/ui/select';
	import { Moon, Sun } from 'lucide-svelte';
	import { mode, setMode } from 'mode-watcher';

	const intervalOptions = [5, 10, 15, 30, 60].map((v) => ({
		value: v * 1000,
		label: v.toString()
	}));
</script>

<svelte:head>
	<title>NoteLocker - Preferences</title>
</svelte:head>

<div class="flex flex-col gap-3">
	<div class="flex flex-col rounded-xl border p-3">
		<span class="mb-3 text-sm font-bold">Appearance</span>
		<div class="flex gap-2">
			<button
				class="
          flex flex-col items-center rounded-2xl border p-3
          {$mode == 'light' && 'bg-accent'}
        "
				on:click={() => setMode('light')}
			>
				<Sun size="46" />
			</button>
			<button
				class="
          flex flex-col items-center rounded-2xl border p-3
          {$mode == 'dark' && 'bg-accent'}
        "
				on:click={() => setMode('dark')}
			>
				<Moon size="46" />
			</button>
		</div>
	</div>
	<div class="flex flex-col gap-2 rounded-xl border p-3">
		<span class="mb-1 text-sm font-bold">Saving</span>
		<div class="flex items-center gap-3">
			<span class="basis-[150px] text-sm">Save on exit</span>
			<Checkbox
				class="flex h-5 w-5 items-center justify-center"
				checked={$preferences.autosave.saveOnExit}
				onCheckedChange={(enable) => preferences.setSaveOnExit(enable == true)}
			/>
		</div>
		<div class="flex items-center gap-3">
			<span class="basis-[150px] text-sm">Autosave</span>
			<Checkbox
				class="flex h-5 w-5 items-center justify-center"
				checked={$preferences.autosave.enabled}
				onCheckedChange={(enable) => preferences.setAutosaveEnabled(enable == true)}
			/>
		</div>
		<div class="flex items-center gap-3">
			<span class="basis-[150px] text-sm">Autosave Interval (seconds)</span>
			<Select.Root
				disabled={!$preferences.autosave.enabled}
				items={intervalOptions}
				selected={intervalOptions.find((v) => v.value == $preferences.autosave.interval)}
				onSelectedChange={(value) => value && preferences.setAutosaveInterval(value.value / 1)}
			>
				<Select.Trigger class="w-[100px]">
					<Select.Value placeholder="Interval" />
				</Select.Trigger>
				<Select.Content>
					{#each intervalOptions as option}
						<Select.Item value={option.value}>{option.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>
</div>
