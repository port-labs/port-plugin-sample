import React, { useState, useEffect } from 'react';
import './App.css';
import { DataCard } from './DataCard';

export default function App() {
	const [params, setParams] = useState<Record<string, unknown>>({});
	const [page, setPage] = useState<Record<string, unknown>>({});
	const [user, setUser] = useState<Record<string, unknown>>({});
	const [entity, setEntity] = useState<Record<string, unknown>>({});

	useEffect(() => {
		// Tell host we're ready so it can send PORT_TOKEN (avoids missing it due to React Strict Mode double-mount)
		if (window.parent !== window) {
			window.parent.postMessage({ type: 'REQUEST_PORT_TOKEN' }, '*');
		}

		const handler = (event: MessageEvent) => {
			if (event.data?.type === 'PORT_TOKEN') {
				// Todo: use token to make API calls
			}
			if (event.data?.type === 'PLUGIN_DATA') {
				setParams(event.data.params);
				setPage(event.data.page);
				setUser(event.data.user);
				setEntity(event.data.entity);
			}
		};
		window.addEventListener('message', handler);
		return () => window.removeEventListener('message', handler);
	}, []);

	return (
		<div className="plugin-container">
			<h1>Hello {user.fullName as string}</h1>
			<p>This is a sample plugin bundled with InlineChunkHtmlPlugin.</p>
			<p>All JS and CSS are inlined into a single HTML file.</p>
			<DataCard title="Page data" data={page} icon="📄" />
			<DataCard title="Params" data={params} icon="⚙️" />
			{entity && Object.keys(entity).length > 0 && (
				<DataCard title="Entity" data={entity} icon="📦" />
			)}
			<DataCard title="User" data={user} icon="👤" />
		</div>
	);
}
