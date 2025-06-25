// ========== CONFIG ==========
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

// ========== STATE ==========
let currentItem;
let tvPage = 1;
let currentAnimePage = 1;
let pinoyPage = 1;
let koreanPage = 1;
let pinoyGenre = '';
let tvGenre = '';

// ========== UTILITY ==========
const getGenreName = id => genreMap[id] || 'Genre';

const debounce = (func, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const fetchData = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('Fetch Error:', err);
    return [];
  }
};

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", async () => {
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
});

// ========== DISPLAY ==========
const displayBanner = (item) => {
  if (!item) return;
  const banner = document.getElementById('banner');
  banner.style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name || 'Unknown Title';
};

const displayList = (items, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  items.forEach(item => {
    if (item.poster_path) container.appendChild(createCard(item));
  });
};

const createCard = (item) => {
  const card = document.createElement('div');
  card.className = 'card';

  const genre = document.createElement('span');
  genre.className = 'genre-badge';
  genre.textContent = getGenreName(item.genre_ids?.[0]);

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

  info.innerHTML = `
    <h3>${item.title || item.name}</h3>
    <p class="movie-year">📅 ${(item.release_date || item.first_air_date || '').slice(0, 4)}</p>
    <p>⭐ ${item.vote_average?.toFixed(1)} / 10</p>
  `;

  card.append(genre, img, button, info);
  return card;
};

// ========== API ==========
const fetchTrending = (type) =>
  fetchData(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);

const fetchTrendingAnime = async () => {
  let allResults = [];
  for (let page = 1; page <= 3; page++) {
    const results = await fetchData(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const filtered = results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    allResults = allResults.concat(filtered);
  }
  return allResults;
};

// ========== GENRE FILTER ==========
async function filterByGenre(genreId) {
  const url = genreId
    ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    : `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;

  const spinner = document.getElementById('loading-spinner');
  spinner.style.display = 'flex';

  const results = await fetchData(url);
  const container = document.getElementById('movies-list');
  container.innerHTML = '';

  results.forEach(movie => {
    if (movie.poster_path) container.appendChild(createCard(movie));
  });

  spinner.style.display = 'none';
}

// ========== TV ==========
function setupTVControls() {
  const btn = document.getElementById('load-more-tvshows');
  btn?.addEventListener('click', () => {
    tvPage++;
    fetchTrendingTVShows();
  });
}

async function fetchTrendingTVShows(reset = false) {
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${tvGenre}&sort_by=popularity.desc&page=${tvPage}`;
  const container = document.getElementById('tvshows-list');
  if (!container) return;

  if (reset) {
    container.innerHTML = '';
    tvPage = 1;
  }

  const results = await fetchData(url);
  results.forEach(tv => {
    if (tv.poster_path) container.appendChild(createCard(tv));
  });
}

// ========== ANIME ==========
async function fetchAnime(page = 1) {
  const results = await fetchData(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&sort_by=popularity.desc&page=${page}`);
  const animeList = document.getElementById("anime-list");
  results.forEach(anime => animeList.appendChild(createCard(anime)));
}

// ========== PINOY ==========
function setupPinoyControls() {
  const genreSelect = document.getElementById('pinoy-genre-filter');
  genreSelect?.addEventListener('change', () => {
    pinoyGenre = genreSelect.value;
    fetchPinoyMoviesPaginated(true);
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
  results.forEach(movie => container.appendChild(createCard(movie)));
}

// ========== KOREAN ==========
async function loadKoreanMovies(genre = '') {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=ko&page=${koreanPage}${genre ? `&with_genres=${genre}` : ''}`;
  const results = await fetchData(url);
  const container = document.getElementById('korean-movie-list');
  if (!container) return;

  results.forEach(movie => container.appendChild(createCard(movie)));
}

function filterByKoreanGenre(genreId) {
  koreanPage = 1;
  document.getElementById('korean-movie-list').innerHTML = '';
  loadKoreanMovies(genreId);
}

// ========== MODAL ==========
function showDetails(item) {
  currentItem = item;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview || 'No description available.';
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2)) || 'N/A';

  changeServer();
  document.getElementById('modal').style.display = 'flex';
}

function changeServer() {
  const server = document.getElementById('server')?.value;
  if (!server || !currentItem) return;

  const type = currentItem.media_type === 'movie' ? 'movie' : 'tv';
  const id = currentItem.id;
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

const closeModal = () => {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
};

// ========== SEARCH ==========
const openSearchModal = () => {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
};

const closeSearchModal = () => {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
};

const searchTMDB = debounce(async () => {
  const query = document.getElementById('search-input').value.trim();
  const container = document.getElementById('search-results');
  if (!query || !container) return (container.innerHTML = '');

  const results = await fetchData(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  container.innerHTML = '';

  results.forEach(item => {
    if (!item.poster_path) return;
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => {
      closeSearchModal();
      showDetails(item);
    };
    container.appendChild(img);
  });
}, 400);

// ========== INFINITE SCROLL ==========
let isFetching = false;

const isElementInViewport = el => {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom >= 0;
};

const handleInfiniteScroll = () => {
  if (isFetching) return;
  isFetching = true;

  const animeListEl = document.getElementById("anime-list");
  const pinoyListEl = document.getElementById("pinoy-movie-list");
  const koreanListEl = document.getElementById("korean-movie-list");

  if (isElementInViewport(animeListEl)) {
    currentAnimePage++;
    fetchAnime(currentAnimePage).finally(() => isFetching = false);
  } else if (isElementInViewport(pinoyListEl)) {
    pinoyPage++;
    fetchPinoyMoviesPaginated().finally(() => isFetching = false);
  } else if (isElementInViewport(koreanListEl)) {
    koreanPage++;
    const selectedGenre = document.getElementById('korean-genre-filter')?.value || '';
    loadKoreanMovies(selectedGenre).finally(() => isFetching = false);
  } else {
    isFetching = false;
  }
};

window.addEventListener('scroll', () => {
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 500) {
    handleInfiniteScroll();
  }
});

// ========== SCROLL ROWS ==========
const scrollLeft = id => document.getElementById(id)?.scrollBy({ left: -400, behavior: 'smooth' });
const scrollRight = id => document.getElementById(id)?.scrollBy({ left: 400, behavior: 'smooth' });
