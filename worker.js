export default {
  async fetch(request, env) {
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return response;
      }
    } catch (err) {
      // Ignore and fallback
    }

    // Fallback to index.html
    return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
  }
};
