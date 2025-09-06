const { initTRPC } = require('@trpc/server');
const { fetchRequestHandler } = require('@trpc/server/adapters/fetch');
const { z } = require('zod');

const t = initTRPC.create();

const router = t.router({
  hello: t.procedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => ({
      greeting: `Hello, ${input.name || 'World'}!`,
    })),
});

exports.handler = async (event, context) => {
  try {
    // Log the incoming event
    console.log('Incoming event:', JSON.stringify(event, null, 2));

    // Construct the full URL, including the procedure path
    const baseUrl = process.env.NODE_ENV === 'production'
      ? `https://${event.headers.host}`
      : 'http://localhost:8888';
    const url = `${baseUrl}${event.path}${event.rawQuery ? `?${event.rawQuery}` : ''}`;
    console.log('Constructed URL:', url);

    // Log the endpoint configuration
    console.log('tRPC endpoint:', '/.netlify/functions/trpc');
    console.log('Expected procedure path:', event.path.replace('/.netlify/functions/trpc', ''));

    // Create the request object
    const req = new Request(url, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body ? event.body : undefined,
    });

    // Log the request path tRPC will process
    const parsedUrl = new URL(url);
    console.log('Request path tRPC sees:', parsedUrl.pathname);

    const response = await fetchRequestHandler({
      endpoint: '/.netlify/functions/trpc', // Match the full Netlify Functions path
      req,
      router,
      createContext: () => ({}),
    });

    // Read the response body once and reuse it
    const responseBody = await response.text();
    console.log('tRPC response status:', response.status);
    console.log('tRPC response headers:', Object.fromEntries(response.headers));
    console.log('tRPC response body:', responseBody);

    return {
      statusCode: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        'Content-Type': 'application/json',
      },
      body: responseBody,
    };
  } catch (error) {
    console.error('tRPC error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};