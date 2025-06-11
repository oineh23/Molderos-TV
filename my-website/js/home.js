import { fetchTrendingTVShows, setupTVControls } from './tvshows.js';
import { fetchAnime, currentAnimePage, loadMoreAnimeBtn } from './anime.js';
import { fetchPinoyMoviesPaginated, setupPinoyControls } from './pinoy.js';

// ====== CONFIGURATION ======
const API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

const genreMap = {
  28: 'Action', 35: 'Comedy', 18: 'Drama',
  10765: 'Sci-Fi', 16: 'Anime', 80: 'Crime',
  10749: 'Romance',
};

let currentItem, tvGenre = '', tvPage = 1, pinoyGenre = '', pinoyPage = 1, currentAnimePage = 1;

// ====== HELPER FUNCTIONS ======
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

function debounce(func, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// ====== DISPLAY FUNCTIONS ======
function displayBanner(item) {
  const banner = document.getElementById('banner');
  banner.style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name || 'Unknown Title';
}

function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    if (!item.poster_path) return;
    container.appendChild(createCard(item));
  });
}

function createCard(item) {
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

  const title = document.createElement('h3');
  title.textContent = item.title || item.name;

  const rating = document.createElement('p');
  rating.textContent = `⭐ ${item.vote_average?.toFixed(1)} / 10`;

  info.append(title, rating);
  card.append(genre, img, button, info);

  return card;
}

// ====== API FETCHERS ======
const fetchTrending = (type) => fetchData(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);

async function fetchTrendingAnime() {
  let allResults = [];
  for (let page = 1; page <= 3; page++) {
    const results = await fetchData(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    allResults.push(...results.filter(item => item.original_language === 'ja' && item.genre_ids.includes(16)));
  }
  return allResults;
}

async function filterByGenre(genreId) {
  const url = genreId
    ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    : `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;

  try {
    document.getElementById('loading-spinner').style.display = 'flex';
    const data = await fetchData(url);
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';

    data.forEach(movie => {
      if (!movie.poster_path) return;
      movie.media_type = 'movie';
      moviesList.appendChild(createCard(movie));
    });

    document.getElementById('loading-spinner').style.display = 'none';
  } catch (err) {
    console.error('Genre fetch error:', err);
    document.getElementById('loading-spinner').style.display = 'none';
  }
}

// ====== Anime Fetching ======
const animeList = document.getElementById("anime-list");
const loadMoreAnimeBtn = document.getElementById("load-more-anime");

async function fetchAnime(page = 1) {
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&sort_by=popularity.desc&page=${page}`;
  const data = await fetchData(url);
  data.forEach(anime => {
    anime.media_type = 'tv';
    animeList.appendChild(createCard(anime));
  });
}

loadMoreAnimeBtn.addEventListener("click", () => {
  currentAnimePage++;
  fetchAnime(currentAnimePage);
});

// ====== TV Show Fetching ======
async function fetchTrendingTVShows(reset = false) {
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${tvGenre}&sort_by=popularity.desc&page=${tvPage}`;
  const container = document.getElementById('tvshows-list');

  if (reset) {
    container.innerHTML = '';
    tvPage = 1;
  }

  const results = await fetchData(url);
  results.forEach(tv => {
    if (!tv.poster_path) return;
    tv.media_type = 'tv';
    container.appendChild(createCard(tv));
  });
}

document.getElementById('load-more-tvshows').addEventListener('click', () => {
  tvPage++;
  fetchTrendingTVShows();
});

// ====== Pinoy Movies ======
async function fetchPinoyMoviesPaginated(reset = false) {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=PH&with_original_language=tl&sort_by=popularity.desc&page=${pinoyPage}` +
              (pinoyGenre ? `&with_genres=${pinoyGenre}` : '');

  const results = await fetchData(url);
  const container = document.getElementById('pinoy-movie-list');

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

  genreSelect.addEventListener('change', () => {
    pinoyGenre = genreSelect.value;
    fetchPinoyMoviesPaginated(true);
  });

  loadMoreBtn.addEventListener('click', () => {
    pinoyPage++;
    fetchPinoyMoviesPaginated();
  });
}

function scrollPinoyMovies(direction) {
  const slider = document.getElementById('pinoy-movie-list');
  slider.scrollLeft += direction * (slider.offsetWidth * 0.8);
}

// ====== MODAL FUNCTIONS ======
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
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === 'movie' ? 'movie' : 'tv';
  let embedURL = '';

  switch (server) {
    case 'vidsrc.cc':
      embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
      break;
    case 'vidsrc.me':
      embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
      break;
    case 'player.videasy.net':
      embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
      break;
  }

  document.getElementById('modal-video').src = embedURL;
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

// ====== SEARCH MODAL ======
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
  if (!query) return (document.getElementById('search-results').innerHTML = '');

  const results = await fetchData(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const container = document.getElementById('search-results');
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

  fetchAnime(); // First page
  fetchPinoyMoviesPaginated();
  setupPinoyControls();
}

document.addEventListener("DOMContentLoaded", init);
