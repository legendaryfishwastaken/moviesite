document.getElementById('search-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the form from submitting normally

    const query = document.getElementById('search-input').value;
    if (!query) return;

    const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();

    const results = document.getElementById('results');
    results.innerHTML = '';

    if (data.results.length === 0) {
        results.innerHTML = '<p>No results found.</p>';
    } else {
        data.results.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            const img = item.poster_path ? `<img src="https://image.tmdb.org/t/p/w200${item.poster_path}" alt="${item.title}">` : '';
            
            // Determine if the item is a movie or a TV show
            let link;
            if (item.media_type === 'movie') {
                link = `https://autoembed.co/movie/tmdb/${item.id}`;
            } else if (item.media_type === 'tv') {
                const seasonNumber = 1; // Replace with actual season number if available
                const episodeNumber = 1; // Replace with actual episode number if available
                link = `https://autoembed.co/tv/tmdb/${item.id}-${seasonNumber}-${episodeNumber}`;
            }

            itemDiv.innerHTML = `
                <a href="${link}" target="_blank" class="item-link">
                    ${img}
                    <span class="item-title">${item.title || item.name}</span>
                </a>
            `;
            results.appendChild(itemDiv);
        });
    }
});
