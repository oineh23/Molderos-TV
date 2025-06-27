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

let moviePage = 1;
let movieGenre = '';
let currentAnimePage = 1;
let pinoyPage = 1;
let pinoyGenre = '';
let tvGenre = '';
let tvPage = 1;
let koreanPage = 1;

// ====== HELPER FUNCTIONS ======
function getGenreName(id) {
  return genreMap[id] || 'Genre';
}

function debounce(func, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
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

// ====== INIT ======
async function init() {
  const [movies, tvShows, anime] = await Promise.all([
    fetchTrending('movie'),
    fetchTrending('tv'),
    fetchTrendingAnime()
  ]);

  displayBanner(movies[Math.floor(Math.random() * movies.length)]);
  displayList(movies, 'movies-list');
  displayList(tvShows, 'tvshows-list');
  displayList(anime, 'anime-list');

  fetchPinoyMoviesPaginated();
  setupPinoyControls();
  setupTVControls();
  loadKoreanMovies();
}

document.addEventListener("DOMContentLoaded", init);

// ====== DISPLAY FUNCTIONS ======
function displayBanner(item) {
  const banner = document.getElementById('banner');
  if (!item) return;
  banner.style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name || 'Unknown Title';
}

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
  yearEl.textContent = year ? `📅 ${year}` : '';

  const rating = document.createElement('p');
  rating.textContent = `⭐ ${item.vote_average?.toFixed(1)} / 10`;

  info.appendChild(title);
  info.appendChild(yearEl);
  info.appendChild(rating);

  card.append(genreBadge, img, button, info);
  return card;
}

// ====== API FETCHING ======
const fetchTrending = (type) =>
  fetchData(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);

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

// ====== FILTER BY GENRE (Movies Only) ======
async function filterByGenre(genreId) {
  movieGenre = genreId;
  fetchTrendingMoviesPaginated(true);
}

// ====== TV SHOWS ======
function setupTVControls() {
  const btn = document.getElementById('load-more-tvshows');
  if (btn) {
    btn.addEventListener('click', () => {
      tvPage++;
      fetchTrendingTVShows();
    });
  }
}

async function fetchTrendingTVShows(reset = false) {
  const container = document.getElementById('tvshows-list');
  if (!container) return;

  if (reset) {
    container.innerHTML = '';
    tvPage = 1;
  }

  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&page=${tvPage}${tvGenre ? `&with_genres=${tvGenre}` : ''}`;
  const results = await fetchData(url);

  results.forEach(tv => {
    if (!tv.poster_path) return;
    tv.media_type = 'tv';
    container.appendChild(createCard(tv));
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

// ====== ANIME ======
const animeList = document.getElementById("anime-list");

async function fetchAnime(page = 1) {
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&sort_by=popularity.desc&page=${page}`;
  const results = await fetchData(url);

  results.forEach(anime => {
    anime.media_type = 'tv';
    animeList.appendChild(createCard(anime));
  });
}

// ====== PINOY MOVIES ======
async function fetchPinoyMoviesPaginated(reset = false) {
  if (reset) {
    pinoyPage = 1;
    document.getElementById('pinoy-movie-list').innerHTML = '';
  }

  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=PH&with_original_language=tl&sort_by=popularity.desc&page=${pinoyPage}` +
              (pinoyGenre ? `&with_genres=${pinoyGenre}` : '');

  const results = await fetchData(url);
  const container = document.getElementById('pinoy-movie-list');
  if (!container) return;

  results.forEach(movie => {
    if (!movie.poster_path) return;
    movie.media_type = 'movie';
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

// ====== KOREAN MOVIES ======
const koreanMovieList = document.getElementById('korean-movie-list');

async function loadKoreanMovies(genre = '') {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=ko&page=${koreanPage}${genre ? `&with_genres=${genre}` : ''}`;
  const results = await fetchData(url);
  if (!results.length) return;

  results.forEach(movie => {
    if (!movie.poster_path) return;
    const card = createCard(movie);
    koreanMovieList.appendChild(card);
  });
}

function filterByKoreanGenre(genreId) {
  koreanPage = 1;
  koreanMovieList.innerHTML = '';
  loadKoreanMovies(genreId);
}

// ====== MODALS ======
function showDetails(item) {
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview || 'No description available.';
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2)) || 'N/A';

  window.currentItem = item;
  changeServer();
  document.getElementById('modal').style.display = 'flex';
}

function changeServer() {
  const server = document.getElementById('server')?.value;
  const item = window.currentItem;
  if (!server || !item) return;

  const type = item.media_type === 'movie' ? 'movie' : 'tv';
  const id = item.id;
  let embedURL = '';

  switch (server) {
    case 'vidsrc.cc':
      embedURL = `https://vidsrc.cc/v2/embed/${type}/${id}`;
      break;
    case 'vidsrc.me':
      embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${id}`;
      break;
    case 'player.videasy.net':
      embedURL = `https://player.videasy.net/${type}/${id}`;
      break;
  }

  document.getElementById('modal-video').src = embedURL;
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

// ====== SEARCH ======
function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
}

const searchTMDB = debounce(async () => {
  const query = document.getElementById('search-input').value.trim();
  const container = document.getElementById('search-results');
  if (!query || !container) {
    container.innerHTML = '';
    return;
  }

  const results = await fetchData(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  container.innerHTML = '';

  results.forEach(item => {
    if (!item.poster_path) return;

    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name || 'Search result';
    img.onclick = () => {
      closeSearchModal();
      showDetails(item);
    };

    container.appendChild(img);
  });
}, 400);

// ====== INFINITE SCROLL ======
let isFetching = false;

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
    fetchTrendingTVShows().finally(() => isFetching = false);
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
  return rect.top < window.innerHeight && rect.bottom > 0;
}

function scrollLeft(id) {
  const row = document.getElementById(id);
  if (!row) return;
  row.scrollBy({ left: -400, behavior: 'smooth' });
}

function scrollRight(id) {
  const row = document.getElementById(id);
  if (!row) return;
  row.scrollBy({ left: 400, behavior: 'smooth' });
}
