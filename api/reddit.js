// Vercel Serverless Function to proxy Reddit API requests
// Avoids client-side CORS/adblock issues by fetching server-side

export default async function handler(req, res) {
  try {
    const incomingUrl = new URL(req.url, 'http://localhost');
    const searchParams = incomingUrl.searchParams;
    const pathParam = searchParams.get('path');

    if (!pathParam || !pathParam.startsWith('/')) {
      res.statusCode = 400;
      return res.json({ error: 'Missing or invalid path parameter' });
    }

    // Build target URL to Reddit
    const forwardParams = new URLSearchParams(incomingUrl.search);
    forwardParams.delete('path');

    // Ensure raw_json=1 for cleaner media URLs
    if (!forwardParams.has('raw_json')) {
      forwardParams.set('raw_json', '1');
    }

    const query = forwardParams.toString();
    const targetUrl = `https://www.reddit.com${pathParam}${query ? `?${query}` : ''}`;

    // Fetch from Reddit
    const redditResponse = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
        // Provide a clear UA per Reddit API guidance
        'User-Agent': 'LivePeek/1.0 (+cs206-livepeek.vercel.app)'
      }
    });

    const contentType = redditResponse.headers.get('content-type') || 'application/json; charset=utf-8';
    const status = redditResponse.status;

    // Stream JSON through
    const data = await redditResponse.json().catch(() => null);
    res.statusCode = status;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    return res.end(JSON.stringify(data));
  } catch (error) {
    res.statusCode = 500;
    return res.json({ error: 'Proxy error', details: String(error && error.message ? error.message : error) });
  }
}


