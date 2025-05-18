const apiKey = 'b8c2d0fa80cd79b5d28d9fe2853806bb'; // Replace this with your TMDB API Key
const apiUrl = 'https://api.themoviedb.org/3/search/movie';

async function searchMovies() {
  const query = document.getElementById('searchInput').value;
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  if (!query) return;

  try {
    const response = await fetch(`${apiUrl}?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.results.length === 0) {
      resultsContainer.innerHTML = '<p>No results found.</p>';
      return;
    }

    data.results.forEach(movie => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');

      movieElement.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>Rating: ${movie.vote_average}</p>
        <p>${movie.release_date}</p>
      `;

      resultsContainer.appendChild(movieElement);
    });

  } catch (error) {
    console.error('Error fetching movies:', error);
    resultsContainer.innerHTML = '<p>Error fetching results. Try again later.</p>';
  }
}
