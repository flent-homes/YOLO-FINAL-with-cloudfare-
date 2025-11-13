/**
 * YOLO Rewards Worker
 *
 * This Worker serves the React SPA on /yolo/* paths
 * and proxies all other traffic to the Webflow origin.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Check if the request is for the /yolo path or subpaths
    if (url.pathname === '/yolo' || url.pathname.startsWith('/yolo/')) {
      // Normalize the path for asset serving
      // Remove /yolo prefix for asset lookup
      let assetPath = url.pathname.replace(/^\/yolo/, '');

      // If the path is empty or just /, serve index.html
      if (assetPath === '' || assetPath === '/') {
        assetPath = '/index.html';
      }

      // Create a new request with the modified path for the assets
      const assetUrl = new URL(assetPath, url.origin);
      assetUrl.search = url.search;

      const assetRequest = new Request(assetUrl, request);

      try {
        // Try to serve the static asset
        const response = await env.ASSETS.fetch(assetRequest);

        // For SPA routing: if we get a 404 and it's a navigation request,
        // serve index.html instead
        if (response.status === 404 && request.headers.get('Sec-Fetch-Dest') === 'document') {
          const indexRequest = new Request(new URL('/index.html', url.origin), request);
          return await env.ASSETS.fetch(indexRequest);
        }

        return response;
      } catch (error) {
        // If asset fetch fails, return error
        return new Response(`Error serving asset: ${error.message}`, {
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }

    // For all other paths, proxy to Webflow
    // Forward the request to the Webflow origin
    const webflowOrigin = 'https://flent.webflow.io';
    const webflowUrl = new URL(url.pathname + url.search, webflowOrigin);

    // Create a new request to Webflow
    const webflowRequest = new Request(webflowUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'manual'
    });

    // Fetch from Webflow
    const response = await fetch(webflowRequest);

    // Create a new response with the Webflow response
    const newResponse = new Response(response.body, response);

    return newResponse;
  },
};
