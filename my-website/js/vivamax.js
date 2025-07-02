// ====== PINOY MOVIES ======
async function fetchPinoyMoviesPaginated(reset = false) {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=PH&with_original_language=tl&sort_by=popularity.desc&page=${pinoyPage}` +
              (pinoyGenre ? `&with_genres=${pinoyGenre}` : '');

  const results = await fetchData(url);
  const container = document.getElementById('pinoy-movie-list');
  if (!container) return;

  if (reset) {
    container.innerHTML = '';
    pinoyPage = 1;
  }

  results.forEach(movie => {
    if (!movie.poster_path) return;
    movie.media_type = 'movie';
    container.appendChild(createCard(movie));
  });
}

function setupPinoyControls() {
  const genreSelect = document.getElementById('pinoy-genre-filter');
  const loadMoreBtn = document.getElementById('load-more-pinoy');

  genreSelect?.addEventListener('change', () => {
    pinoyGenre = genreSelect.value;
    fetchPinoyMoviesPaginated(true);
  });

  loadMoreBtn?.addEventListener('click', () => {
    pinoyPage++;
    fetchPinoyMoviesPaginated();
  });
}
