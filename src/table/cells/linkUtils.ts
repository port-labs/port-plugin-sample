export function getLinkAttributes(url?: string): { target?: string; rel?: string } {
	if (!url) {
		return {};
	}

	const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
	try {
		const linkOrigin = new URL(url, currentOrigin || 'http://localhost').origin;
		if (currentOrigin && linkOrigin !== currentOrigin) {
			return {
				target: '_blank',
				rel: 'noopener noreferrer',
			};
		}
		return {
			target: '_self',
		};
	} catch {
		return {};
	}
}

export function isInternalUrl(url: string): boolean {
	if (url.startsWith('/')) {
		return true;
	}

	if (url.startsWith('//')) {
		try {
			const parsedUrl = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
			return typeof window !== 'undefined' && parsedUrl.origin === window.location.origin;
		} catch {
			return false;
		}
	}

	try {
		const parsedUrl = new URL(url);
		return typeof window !== 'undefined' && parsedUrl.origin === window.location.origin;
	} catch {
		return false;
	}
}
