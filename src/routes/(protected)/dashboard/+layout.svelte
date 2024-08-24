<script lang="ts">
	import * as Card from '$lib/components/ui/card';
</script>

<div class="flex h-full md:items-center md:justify-center">
	<Card.Root class="w-full p-6 md:h-[70%] md:w-4/5 lg:w-3/5">
		<slot />
	</Card.Root>
</div>
