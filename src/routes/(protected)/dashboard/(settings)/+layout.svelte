<script lang="ts">
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import { X } from 'lucide-svelte';

	$: child = $page.url.pathname == '' ? 'account' : $page.url.pathname.split('/').pop();
</script>

<div class="flex pb-2">
	<div class="flex flex-col space-y-1.5">
		<Card.Title>Account and Settings</Card.Title>
	</div>
	<a href="/dashboard" class="ml-auto">
		<X />
	</a>
</div>
<div class="mb-2 border-t"></div>
<div class="flex flex-col gap-5 md:flex-row">
	<div class="flex gap-1 md:flex-col">
		<a
			href="/dashboard/account"
			class="rounded px-3 py-1 hover:bg-muted {child == 'account' && 'bg-muted'}"
		>
			Account
		</a>
		<a
			href="/dashboard/preferences"
			class="rounded px-3 py-1 hover:bg-muted {child == 'preferences' && 'bg-muted'}"
		>
			Preferences
		</a>
	</div>
	<div class="flex-1">
		<slot />
	</div>
</div>
