export function formatLinkDisplay(rawUrl) {
	try {
		const urlObj = new URL(rawUrl);
		const hostname = urlObj.hostname;
		const parts = urlObj.pathname.split('/').filter(Boolean);
		const tail = parts.slice(-2).join('/');
		let display = hostname + (tail ? `/…/${tail}` : '');
		if (display.length > 40) display = display.slice(0, 40) + '…';
		return display;
	} catch {
		return rawUrl.length > 40 ? rawUrl.slice(0, 40) + '…' : rawUrl;
	}
}

