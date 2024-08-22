<script lang="ts">
	import * as Card from '$lib/components/ui/card';
</script>

<svelte:head>
	<title>NoteLocker - Success</title>
</svelte:head>

<div class="flex h-full items-center justify-center">
	<Card.Root class="flex flex-col items-center md:block md:w-2/5">
		<Card.Header>
			<Card.Title>Email verification completed</Card.Title>
		</Card.Header>
		<Card.Content>
			You can now <a class="underline" href="/login">log in</a>.
		</Card.Content>
	</Card.Root>
</div>
