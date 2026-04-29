/**
 * Map Port PLUGIN_DATA `theme.mode` (see README) to CSS color-scheme and RDG theme classes.
 * When the host has not sent a theme yet (e.g. local `yarn dev`), default to **light** so the UI matches typical plugin previews.
 */
export function hostThemeModeToColorScheme(themeMode: string | undefined | null): 'dark' | 'light' {
	const normalized = typeof themeMode === 'string' ? themeMode.trim().toLowerCase() : '';
	if (normalized === 'dark') return 'dark';
	if (normalized === 'light') return 'light';
	return 'light';
}

export function hostThemeModeToRdgClass(themeMode: string | undefined | null): 'rdg-light' | 'rdg-dark' {
	return hostThemeModeToColorScheme(themeMode) === 'dark' ? 'rdg-dark' : 'rdg-light';
}
