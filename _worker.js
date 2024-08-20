export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const pathname = url.pathname;

        // Debugging
        console.log('Request URL:', request.url);
        console.log('Pathname:', pathname);

        // Handle /search requests
        if (pathname.startsWith('/search')) {
            return handleSearch(request, env);
        }

        // Serve static files from the /public directory
        if (pathname === '/' || pathname === '/index.html') {
            return serveStaticFile('index.html', 'text/html');
        } else if (pathname === '/style.css') {
            return serveStaticFile('style.css', 'text/css');
        } else if (pathname === '/script.js') {
            return serveStaticFile('script.js', 'application/javascript');
        } else {
            return new Response('Not Found', { status: 404 });
        }
    }
};

// Function to handle search requests
async function handleSearch(request, env) {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    if (!query) {
        return new Response(JSON.stringify({ results: [] }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const apiKey = env.TMDB_API_KEY;
        const apiUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch from TMDB API');
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Error fetching data from TMDB API:', error);
        return new Response('Error fetching data from TMDB API', { status: 500 });
    }
}

// Function to serve static files with the correct Content-Type
async function serveStaticFile(path, contentType) {
    try {
        const file = await fetch(`https://moviesite-7vq.pages.dev/public/${path}`);
        return new Response(file.body, {
            headers: { 'Content-Type': contentType },
        });
    } catch (error) {
        return new Response('Error serving static file', { status: 500 });
    }
}
