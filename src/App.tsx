import './App.css';
import { useEffect } from 'react';
import { BlueprintDataCard, EntitiesSearchExample, PluginDataCard } from './components';
import { usePostMessageData } from './hooks/usePostMessageData';

export default function App() {
	const { params, page, user, entity, applyThemeCss } = usePostMessageData();

	useEffect(() => {
		applyThemeCss();
	}, [applyThemeCss]);

	return (
		<div className="plugin-container">
			<h1>Hello {user?.firstName as string} {user?.lastName as string}</h1>
			<p>This is a sample plugin bundled with InlineChunkHtmlPlugin.</p>
			<p>All JS and CSS are inlined into a single HTML file.</p>
			<PluginDataCard title="Page data" data={page ?? {}} icon="📄" />
			<PluginDataCard title="Params" data={params} icon="⚙️" />
			{entity && (
				<PluginDataCard title="Entity" data={entity} icon="📦" />
			)}
			<PluginDataCard title="User" data={user ?? {}} icon="👤" />
			<EntitiesSearchExample />
			<BlueprintDataCard />
		</div>
	);
}
