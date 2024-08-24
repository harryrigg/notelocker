<script lang="ts">
	import * as Card from '$lib/components/ui/card';
</script>

<svelte:head>
	<title>NoteLocker - Success</title>
</svelte:head>

<div class="flex h-full items-center justify-center">
	<Card.Form>
		<Card.Message>
			<Card.Header>
				<Card.Title>Password reset successfully</Card.Title>
			</Card.Header>
			<Card.Content>
				You can now <a href="/login" class="underline">login</a> with your new password
			</Card.Content>
		</Card.Message>
	</Card.Form>
</div>
