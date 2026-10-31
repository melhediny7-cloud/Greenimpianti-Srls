export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      let response = await env.ASSETS.fetch(request);
      
      // If asset found
      if (response && response.status !== 404) {
        // If it's HTML, prevent aggressive browser caching so updates show immediately
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html') || url.pathname === '/' || url.pathname === '') {
          const newHeaders = new Headers(response.headers);
          newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
          newHeaders.set('Pragma', 'no-cache');
          newHeaders.set('Expires', '0');
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        }
        return response;
      }
    } catch (err) {
      // Fallback
    }

    // Fallback to index.html with no-cache headers
    const indexReq = new Request(new URL('/index.html', request.url), request);
    const fallbackRes = await env.ASSETS.fetch(indexReq);
    const newHeaders = new Headers(fallbackRes.headers);
    newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    newHeaders.set('Pragma', 'no-cache');
    newHeaders.set('Expires', '0');
    return new Response(fallbackRes.body, {
      status: fallbackRes.status,
      statusText: fallbackRes.statusText,
      headers: newHeaders
    });
  }
};
