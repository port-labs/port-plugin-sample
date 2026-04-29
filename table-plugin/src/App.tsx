import { usePortPluginData } from '@port-labs/plugins-sdk/react';
import { useEffect, useMemo } from 'react';

import './App.css';
import TypedTableDemo from './components/TypedTableDemo';
import { hostThemeModeToColorScheme } from './portHostTheme';

export default function App() {
	const { applyThemeCss, theme } = usePortPluginData();

	useEffect(() => {
		applyThemeCss();
	}, [applyThemeCss]);

	const colorScheme = useMemo(() => hostThemeModeToColorScheme(theme?.mode), [theme?.mode]);

	return (
		<div className="plugin-container" style={{ colorScheme }}>
			<TypedTableDemo />
		</div>
	);
}
