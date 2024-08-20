export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const pathname = url.pathname;

        // Handle the /search endpoint
        if (pathname === '/search') {
            const query = url.searchParams.get('query');
            if (!query) {
                return new Response(JSON.stringify({ results: [] }), {
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            try {
                const apiKey = env.TMDB_API_KEY;
                const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

                const response = await fetch(apiUrl);
                const data = await response.json();

                return new Response(JSON.stringify(data), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
            } catch (error) {
                return new Response('Error fetching data from TMDB API', { status: 500 });
            }
        }

        // Serve static files
        if (pathname === '/' || pathname === '/index.html') {
            return serveStaticFile('public/index.html', 'text/html');
        } else if (pathname === '/style.css') {
            return serveStaticFile('public/style.css', 'text/css');
        } else if (pathname === '/script.js') {
            return serveStaticFile('public/script.js', 'application/javascript');
        } else {
            return new Response('Not Found', { status: 404 });
        }
    }
};

// Function to serve static files with the correct Content-Type
async function serveStaticFile(path, contentType) {
    try {
        const file = await fetch(`https://moviesite-7vq.pages.dev/${path}`);
        return new Response(file.body, {
            headers: { 'Content-Type': contentType },
        });
    } catch (error) {
        return new Response('Error serving static file', { status: 500 });
    }
}
