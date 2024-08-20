export default {
    async fetch(request, env) {
        // Extract the search query from the request URL
        const url = new URL(request.url);
        const query = url.searchParams.get('query');

        // If no query is provided, return an empty result
        if (!query) {
            return new Response(JSON.stringify({ results: [] }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        try {
            // Fetch data from the TMDB API
            const apiKey = env.TMDB_API_KEY;
            const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            // Return the data from the TMDB API
            return new Response(JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                    // Add necessary headers for security and CORS
                    'Access-Control-Allow-Origin': '*',
                    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'X-XSS-Protection': '1; mode=block'
                },
            });
        } catch (error) {
            // Handle any errors that occur during the fetch
            return new Response('Error fetching data from TMDB API', { status: 500 });
        }
    }
};
