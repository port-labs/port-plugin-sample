import './App.css';
import { BlueprintDataCard, PluginDataCard } from './components';
import { usePostMessageData } from './hooks/usePostMessageData';

export default function App() {
	const { params, page, user, entity } = usePostMessageData();

	return (
		<div className="plugin-container">
			<h1>Hello {user.fullName as string}</h1>
			<p>This is a sample plugin bundled with InlineChunkHtmlPlugin.</p>
			<p>All JS and CSS are inlined into a single HTML file.</p>
			<PluginDataCard title="Page data" data={page} icon="📄" />
			<PluginDataCard title="Params" data={params} icon="⚙️" />
			{entity && (
				<PluginDataCard title="Entity" data={entity} icon="📦" />
			)}
			<PluginDataCard title="User" data={user} icon="👤" />
			<BlueprintDataCard />
		</div>
	);
}
