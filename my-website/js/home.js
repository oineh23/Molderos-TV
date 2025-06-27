// ====== CONFIGURATION ======
const API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

const genreMap = {
  28: 'Action',
  35: 'Comedy',
  18: 'Drama',
  10765: 'Sci-Fi',
  16: 'Anime',
  80: 'Crime',
  10749: 'Romance',
};

let currentAnimePage = 1;
let pinoyPage = 1;
let pinoyGenre = '';
let tvPage = 1;
let tvGenre = '';
let koreanPage = 1;
let moviePage = 1;
let movieGenre = '';
let isFetching = false;

// ====== INIT FUNCTION ======
async function init() {
  const [tvShows, anime] = await Promise.all([
    fetchTrendingTVShows(),
    fetchTrendingAnime()
  ]);

  fetchTrendingMoviesPaginated(true);
  displayList(tvShows, 'tvshows-list');
  displayList(anime, 'anime-list');

  fetchPinoyMoviesPaginated();
  setupPinoyControls();
  setupTVControls();
  loadKoreanMovies();
}

document.addEventListener("DOMContentLoaded", init);

// ====== DISPLAY UTILITIES ======
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  items.forEach(item => {
    if (!item.poster_path) return;
    container.appendChild(createCard(item));
  });
}

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  const genreBadge = document.createElement('span');
  genreBadge.className = 'genre-badge';
  genreBadge.textContent = getGenreName(item.genre_ids?.[0]);

  const img = document.createElement('img');
  img.src = `${IMG_URL}${item.poster_path}`;
  img.alt = item.title || item.name;
  img.loading = 'lazy';

  const button = document.createElement('button');
  button.className = 'watch-button';
  button.textContent = 'Watch Now';
  button.onclick = () => showDetails(item);

  const info = document.createElement('div');
  info.className = 'card-info';

  const title = document.createElement('h3');
  title.textContent = item.title || item.name;

  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const yearEl = document.createElement('p');
  yearEl.className = 'movie-year';
  yearEl.textContent = year ? `ðŸ“… ${year}` : '';

  const rating = document.createElement('p');
  rating.textContent = `â­ ${item.vote_average?.toFixed(1)} / 10`;

  info.appendChild(title);
  info.appendChild(yearEl);
  info.appendChild(rating);

  card.append(genreBadge, img, button, info);
  return card;
}

function getGenreName(id) {
  return genreMap[id] || 'Genre';
}

async function fetchData(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

// ====== FETCHERS ======
async function fetchTrendingTVShows(reset = false) {
  const container = document.getElementById('tvshows-list');
  if (!container) return;

  if (reset) {
    container.innerHTML = '';
    tvPage = 1;
  }

  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&page=${tvPage}${tvGenre ? `&with_genres=${tvGenre}` : ''}`;
  return fetchData(url);
}

async function fetchTrendingAnime() {
  let allResults = [];
  for (let page = 1; page <= 3; page++) {
    const results = await fetchData(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const filtered = results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    allResults = allResults.concat(filtered);
  }
  return allResults;
}

async function fetchAnime(page = 1) {
  const results = await fetchData(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&sort_by=popularity.desc&page=${page}`);
  results.forEach(anime => {
    anime.media_type = 'tv';
    document.getElementById("anime-list").appendChild(createCard(anime));
  });
}

async function fetchTrendingMoviesPaginated(reset = false) {
  const container = document.getElementById('movies-list');
  if (!container) return;

  if (reset) {
    moviePage = 1;
    container.innerHTML = '';
  }

  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${moviePage}${movieGenre ? `&with_genres=${movieGenre}` : ''}`;
  const results = await fetchData(url);
  results.forEach(movie => {
    if (!movie.poster_path) return;
    movie.media_type = 'movie';
    container.appendChild(createCard(movie));
  });
}

async function fetchPinoyMoviesPaginated(reset = false) {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=PH&with_original_language=tl&sort_by=popularity.desc&page=${pinoyPage}` +
              (pinoyGenre ? `&with_genres=${pinoyGenre}` : '');
  const container = document.getElementById('pinoy-movie-list');
  if (!container) return;

  if (reset) {
    container.innerHTML = '';
    pinoyPage = 1;
  }

  const results = await fetchData(url);
  results.forEach(movie => {
    if (!movie.poster_path) return;
    movie.media_type = 'movie';
    container.appendChild(createCard(movie));
  });
}

async function loadKoreanMovies(genre = '') {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=ko&page=${koreanPage}${genre ? `&with_genres=${genre}` : ''}`;
  const results = await fetchData(url);
  const container = document.getElementById('korean-movie-list');
  results.forEach(movie => {
    if (!movie.poster_path) return;
    container.appendChild(createCard(movie));
  });
}

function setupPinoyControls() {
  const genreSelect = document.getElementById('pinoy-genre-filter');
  genreSelect?.addEventListener('change', () => {
    pinoyGenre = genreSelect.value;
    fetchPinoyMoviesPaginated(true);
  });
}

function setupTVControls() {
  const btn = document.getElementById('load-more-tvshows');
  if (btn) {
    btn.addEventListener('click', () => {
      tvPage++;
      fetchTrendingTVShows().then(results => displayList(results, 'tvshows-list'));
    });
  }
}

function filterByGenre(genreId) {
  movieGenre = genreId;
  fetchTrendingMoviesPaginated(true);
}

// ====== INFINITE SCROLL ======
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  if (scrollTop + windowHeight >= docHeight - 500) {
    handleInfiniteScroll();
  }
});

function handleInfiniteScroll() {
  if (isFetching) return;

  const movieListEl = document.getElementById("movies-list");
  const tvListEl = document.getElementById("tvshows-list");
  const animeListEl = document.getElementById("anime-list");
  const pinoyListEl = document.getElementById("pinoy-movie-list");
  const koreanListEl = document.getElementById("korean-movie-list");

  if (isElementInViewport(movieListEl)) {
    isFetching = true;
    moviePage++;
    fetchTrendingMoviesPaginated().finally(() => isFetching = false);
  } else if (isElementInViewport(tvListEl)) {
    isFetching = true;
    tvPage++;
    fetchTrendingTVShows().then(results => {
      displayList(results, 'tvshows-list');
      isFetching = false;
    });
  } else if (isElementInViewport(animeListEl)) {
    isFetching = true;
    currentAnimePage++;
    fetchAnime(currentAnimePage).finally(() => isFetching = false);
  } else if (isElementInViewport(pinoyListEl)) {
    isFetching = true;
    pinoyPage++;
    fetchPinoyMoviesPaginated().finally(() => isFetching = false);
  } else if (isElementInViewport(koreanListEl)) {
    isFetching = true;
    koreanPage++;
    const selectedGenre = document.getElementById('korean-genre-filter')?.value || '';
    loadKoreanMovies(selectedGenre).finally(() => isFetching = false);
  }
}

function isElementInViewport(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom >= 0;
}
