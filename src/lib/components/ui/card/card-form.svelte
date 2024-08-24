<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div
	class={cn(
		'w-full rounded-lg bg-card text-card-foreground shadow-sm md:w-3/5 md:border lg:w-2/5',
		className
	)}
	{...$$restProps}
>
	<slot />
</div>
