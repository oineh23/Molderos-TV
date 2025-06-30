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

// ====== GLOBAL STATE ======
let currentItem;
let currentAnimePage = 1;
let pinoyPage = 1;
let pinoyGenre = '';
let tvGenre = '';
let tvPage = 1;
let koreanPage = 1;
let currentSeriesIndex = 0;
const seriesPerPage = 3;

// ====== INIT ======
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
  setupAnimeControls();
  loadKoreanMovies();
  setupKoreanControls();
  loadMovieSeries();
});

// ====== FETCHERS ======
const fetchData = async url => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
};

const fetchTrending = type =>
  fetchData(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);

const fetchTrendingAnime = async () => {
  let all = [];
  for (let i = 1; i <= 3; i++) {
    const results = await fetchData(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${i}`);
    all = all.concat(results.filter(r => r.original_language === 'ja' && r.genre_ids.includes(16)));
  }
  return all;
};

// ====== DISPLAY ======
function displayBanner(item) {
  if (!item) return;
  document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name;
}

function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => item.poster_path && container.appendChild(createCard(item)));
}

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <span class="genre-badge">${getGenreName(item.genre_ids?.[0])}</span>
    <img src="${IMG_URL}${item.poster_path}" alt="${item.title || item.name}" loading="lazy" />
    <button class="watch-button">Watch Now</button>
    <div class="card-info">
      <h3>${item.title || item.name}</h3>
      <p class="movie-year">📅 ${(item.release_date || item.first_air_date || '').slice(0, 4)}</p>
      <p>⭐ ${item.vote_average?.toFixed(1)} / 10</p>
    </div>
  `;
  card.querySelector('button').onclick = () => showDetails(item);
  return card;
}

function getGenreName(id) {
  return genreMap[id] || 'Genre';
}

// ====== MODAL ======
function showDetails(item) {
  currentItem = item;
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview || 'No description';
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  changeServer();
}

function changeServer() {
  const server = document.getElementById('server').value;
  const id = currentItem?.id;
  const type = currentItem?.media_type || 'movie';
  if (!id || !server) return;

  const embedURL = {
    'vidsrc.cc': `https://vidsrc.cc/v2/embed/${type}/${id}`,
    'vidsrc.me': `https://vidsrc.net/embed/${type}/?tmdb=${id}`,
    'player.videasy.net': `https://player.videasy.net/${type}/${id}`
  }[server];

  document.getElementById('modal-video').src = embedURL || '';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

// ====== FILTERS ======
async function filterByGenre(id) {
  const url = id
    ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${id}`
    : `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;

  document.getElementById('loading-spinner').style.display = 'flex';
  const results = await fetchData(url);
  displayList(results, 'movies-list');
  document.getElementById('loading-spinner').style.display = 'none';
}

function setupTVControls() {
  const select = document.getElementById('tv-genre-filter');
  const btn = document.getElementById('load-more-tvshows');
  select?.addEventListener('change', () => {
    tvGenre = select.value;
    tvPage = 1;
    fetchTrendingTVShows(true);
  });
  btn?.addEventListener('click', () => {
    tvPage++;
    fetchTrendingTVShows();
  });
}

async function fetchTrendingTVShows(reset = false) {
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${tvGenre}&sort_by=popularity.desc&page=${tvPage}`;
  const container = document.getElementById('tvshows-list');
  if (reset) container.innerHTML = '';
  const results = await fetchData(url);
  results.forEach(tv => tv.poster_path && container.appendChild(createCard(tv)));
}

// ====== ANIME ======
function setupAnimeControls() {
  const btn = document.getElementById('load-more-anime');
  btn?.addEventListener('click', () => {
    currentAnimePage++;
    fetchAnime(currentAnimePage);
  });
}

async function fetchAnime(page = 1) {
  const results = await fetchData(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&page=${page}`);
  const container = document.getElementById('anime-list');
  results.forEach(anime => container.appendChild(createCard(anime)));
}

// ====== PINOY ======
function setupPinoyControls() {
  const select = document.getElementById('pinoy-genre-filter');
  const btn = document.getElementById('load-more-pinoy');
  select?.addEventListener('change', () => {
    pinoyGenre = select.value;
    pinoyPage = 1;
    fetchPinoyMoviesPaginated(true);
  });
  btn?.addEventListener('click', () => {
    pinoyPage++;
    fetchPinoyMoviesPaginated();
  });
}

async function fetchPinoyMoviesPaginated(reset = false) {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=PH&with_original_language=tl&page=${pinoyPage}` +
              (pinoyGenre ? `&with_genres=${pinoyGenre}` : '');
  const container = document.getElementById('pinoy-movie-list');
  if (reset) container.innerHTML = '';
  const results = await fetchData(url);
  results.forEach(movie => movie.poster_path && container.appendChild(createCard(movie)));
}

// ====== KOREAN ======
function setupKoreanControls() {
  const btn = document.getElementById('load-more-korean');
  const select = document.getElementById('korean-genre-filter');
  btn?.addEventListener('click', () => {
    koreanPage++;
    loadKoreanMovies(select.value);
  });
  select?.addEventListener('change', () => {
    koreanPage = 1;
    document.getElementById('korean-movie-list').innerHTML = '';
    loadKoreanMovies(select.value);
  });
}

async function loadKoreanMovies(genre = '') {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=ko&page=${koreanPage}${genre ? `&with_genres=${genre}` : ''}`;
  const results = await fetchData(url);
  const container = document.getElementById('korean-movie-list');
  results.forEach(movie => container.appendChild(createCard(movie)));
}

// ====== MOVIE SERIES ======
const seriesIds = [1241, 9485, 10, 328, 86311, 453993, 529892, 404609, 131635];

async function loadMovieSeries() {
  const slice = seriesIds.slice(currentSeriesIndex, currentSeriesIndex + seriesPerPage);
  const container = document.getElementById("series-list");
  for (const id of slice) {
    const res = await fetch(`${BASE_URL}/collection/${id}?api_key=${API_KEY}`);
    const data = await res.json();
    if (data.parts?.length) renderSeriesCard(data, container);
  }
  currentSeriesIndex += seriesPerPage;
  if (currentSeriesIndex >= seriesIds.length) {
    document.getElementById("load-more-series")?.style.setProperty("display", "none");
  }
}

function renderSeriesCard(series, container) {
  const poster = series.parts[0]?.poster_path;
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${poster}" alt="${series.name}" loading="lazy">
    <div class="card-body">
      <h3>${series.name}</h3>
      <p>${series.overview || 'A movie series collection.'}</p>
    </div>
  `;
  card.onclick = () => openModalWithSeries(series);
  container.appendChild(card);
}

function openModalWithSeries(series) {
  const modal = document.getElementById("modal");
  const parts = document.getElementById("series-parts");
  parts.innerHTML = '';
  series.parts.forEach(movie => {
    const div = document.createElement('div');
    div.className = 'series-part';
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
      <p>${movie.title}</p>
    `;
    div.onclick = () => {
      document.getElementById("modal-video").src = `https://vidsrc.to/embed/movie/${movie.id}`;
    };
    parts.appendChild(div);
  });

  document.getElementById("modal-title").textContent = series.name;
  document.getElementById("modal-description").textContent = series.overview;
  document.getElementById("modal-image").src = `https://image.tmdb.org/t/p/w500${series.poster_path || series.parts[0]?.poster_path}`;
  modal.style.display = "flex";
}

// ====== SEARCH ======
const debounce = (fn, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const searchTMDB = debounce(async () => {
  const input = document.getElementById('search-input');
  const container = document.getElementById('search-results');
  const query = input.value.trim();
  if (!query) return (container.innerHTML = '');

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

function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
}
