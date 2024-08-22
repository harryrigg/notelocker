<script>
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
</script>

<ModeWatcher />
<Toaster position="bottom-center" />

<a
	class="absolute left-1/2 top-6 hidden -translate-x-1/2 text-2xl tracking-tight md:block"
	href="/"
>
	NoteLocker
</a>

<slot />
