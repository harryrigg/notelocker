<script lang="ts">
	import { Checkbox } from 'bits-ui';
	import { Check } from 'lucide-svelte';

	export let checked: boolean = false;
</script>

<Checkbox.Root
	class="h-[22px] w-[22px] rounded border data-[state=checked]:bg-primary"
	bind:checked
	{...$$restProps}
>
	<Checkbox.Indicator class="flex items-center justify-center" let:isChecked>
		{#if isChecked}
			<Check size="16" />
		{/if}
	</Checkbox.Indicator>
	<Checkbox.Input></Checkbox.Input>
</Checkbox.Root>
