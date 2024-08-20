export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const query = url.searchParams.get('query');

        if (!query) {
            return new Response(JSON.stringify({ results: [] }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const apiKey = env.TMDB_API_KEY;
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
