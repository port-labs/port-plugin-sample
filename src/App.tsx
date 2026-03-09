import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import './App.css';
import { DataCard } from './DataCard';
import { useBlueprints } from './hooks/useBlueprints';

export default function App() {
	const [params, setParams] = useState<Record<string, unknown>>({});
	const [page, setPage] = useState<Record<string, unknown>>({});
	const [user, setUser] = useState<Record<string, unknown>>({});
	const [entity, setEntity] = useState<Record<string, unknown>>({});
	const [portToken, setPortToken] = useState<string | null>(null);

	const blueprints = useBlueprints(portToken);

	useEffect(() => {
		// Tell host we're ready so it can send PORT_TOKEN (avoids missing it due to React Strict Mode double-mount)
		if (window.parent !== window) {
			window.parent.postMessage({ type: 'REQUEST_PORT_TOKEN' }, '*');
		}

		const handler = (event: MessageEvent) => {
			if (event.data?.type === 'PORT_TOKEN') {
				setPortToken(event.data.token ?? null);
			}
			if (event.data?.type === 'PLUGIN_DATA') {
				setParams(event.data.params ?? {});
				setPage(event.data.page ?? {});
				setUser(event.data.user ?? {});
				setEntity(event.data.entity ?? {});
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
			<section className="data-card">
				<h2 className="data-card__title"><span className="data-card__icon">📋</span>Blueprints</h2>
				{!portToken && <p className="data-card__empty">Waiting for token…</p>}
				{portToken && blueprints.isLoading && <p className="data-card__empty">Loading blueprints…</p>}
				{portToken && blueprints.isError && (
					<p className="blueprints-error">Error: {blueprints.error instanceof Error ? blueprints.error.message : 'Failed to load'}</p>
				)}
				{portToken && blueprints.isSuccess && (
					<pre className="data-value-json">{JSON.stringify(blueprints.data, null, 2)}</pre>
				)}
			</section>
			<DataCard title="Page data" data={page} icon="📄" />
			<DataCard title="Params" data={params} icon="⚙️" />
			{entity && Object.keys(entity).length > 0 && (
				<DataCard title="Entity" data={entity} icon="📦" />
			)}
			<DataCard title="User" data={user} icon="👤" />
		</div>
	);
}
