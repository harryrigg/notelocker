import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Preferences = {
	autosave: {
		enabled: boolean;
		saveOnExit: boolean;
		interval: number;
	};
};

const defaultPreferences: Preferences = {
	autosave: {
		enabled: true,
		saveOnExit: true,
		interval: 5000
	}
};

function createPreferences() {
	const { subscribe, update, set } = writable<Preferences>(defaultPreferences);

	if (browser) {
		if (localStorage.preferences) set(JSON.parse(localStorage.preferences));
		subscribe((v) => {
			localStorage.preferences = JSON.stringify(v);
		});
	}

	return {
		subscribe,
		setAutosaveEnabled: (enabled: boolean) =>
			update((p) => ({ ...p, autosave: { ...p.autosave, enabled } })),
		setSaveOnExit: (saveOnExit: boolean) =>
			update((p) => ({ ...p, autosave: { ...p.autosave, saveOnExit } })),
		setAutosaveInterval: (interval: number) =>
			update((p) => ({ ...p, autosave: { ...p.autosave, interval } }))
	};
}

export const preferences = createPreferences();
