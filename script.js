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
        data.results.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');

            const img = movie.poster_path ? `<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">` : '';

            movieDiv.innerHTML = `
                ${img}
                <span class="movie-title">${movie.title}</span>
                <p>${movie.release_date}</p>
                <p>${movie.overview}</p>
            `;
            results.appendChild(movieDiv);
        });
    }
});
