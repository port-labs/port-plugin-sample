import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
	const root = document.getElementById('plugin-root');
	if (root) {
		createRoot(root).render(<App />);
	}
});
