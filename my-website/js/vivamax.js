let pinoyPage = 1;
const pinoyMovieList = document.getElementById("pinoy-movie-list");
const loadMoreButton = document.getElementById("load-more-pinoy");
const genreSelect = document.getElementById("pinoy-genre-filter");

const API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb'; // Replace with your TMDb API key

function fetchPinoyMovies(page = 1, genre = '') {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&region=PH&sort_by=popularity.desc&with_original_language=tl&page=${page}${genre ? `&with_genres=${genre}` : ''}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      data.results.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
          <div class="card-title">${movie.title}</div>
        `;
        pinoyMovieList.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Failed to load Vivamax movies:", err);
    });
}

function filterByPinoyGenre(genreId) {
  pinoyMovieList.innerHTML = '';
  pinoyPage = 1;
  fetchPinoyMovies(pinoyPage, genreId);
}

loadMoreButton.addEventListener('click', () => {
  pinoyPage++;
  fetchPinoyMovies(pinoyPage, genreSelect.value);
});

// Load first page on start
document.addEventListener('DOMContentLoaded', () => {
  fetchPinoyMovies();
});
