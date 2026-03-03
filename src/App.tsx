import React, { useState } from 'react';
import './App.css';

export default function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="plugin-container">
			<h1>Sample Plugin</h1>
			<p>This is a sample plugin bundled with InlineChunkHtmlPlugin.</p>
			<p>All JS and CSS are inlined into a single HTML file.</p>
			<button type="button" className="counter-btn" onClick={() => setCount((c) => c + 1)}>
				Count: {count}
			</button>
		</div>
	);
}
