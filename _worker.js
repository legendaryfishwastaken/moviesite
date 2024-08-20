export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const pathname = url.pathname;

        if (pathname === '/search') {
            // Handle the search query
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
        } else {
            // Serve the static HTML page
            return new Response(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Movie Search</title>
                    <link rel="stylesheet" href="style.css">
                </head>
         
