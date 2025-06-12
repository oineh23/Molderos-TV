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

let currentItem;
let tvShowsPage = 1;
let currentAnimePage = 1;
let pinoyPage = 1;
let pinoyGenre = '';
let tvGenre = '';
let tvPage = 1;

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

// ====== INIT FUNCTION ======
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
}
document.addEventListener("DOMContentLoaded", init);

// ====== DISPLAY UTILITIES ======
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

  // === Add Movie/TV Year ===
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const yearEl = document.createElement('p');
  yearEl.className = 'movie-year';
  yearEl.textContent = year ? `📅 ${year}` : '';

  const rating = document.createElement('p');
  rating.textContent = `⭐ ${item.vote_average?.toFixed(1)} / 10`;

  info.appendChild(title);
  info.appendChild(yearEl); // <- Add year here
  info.appendChild(rating);

  card.append(genre, img, button, info);
  return card;
}

// ====== API FETCHERS ======
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

async function filterByGenre(genreId) {
  const url = genreId
    ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    : `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;

  document.getElementById('loading-spinner').style.display = 'flex';

  const results = await fetchData(url);
  const container = document.getElementById('movies-list');
  container.innerHTML = '';

  results.forEach(movie => {
    if (!movie.poster_path) return;
    movie.media_type = 'movie';
    container.appendChild(createCard(movie));
  });

  document.getElementById('loading-spinner').style.display = 'none';
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
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${tvGenre}&sort_by=popularity.desc&page=${tvPage}`;
  const container = document.getElementById('tvshows-list');
  if (!container) return;

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

// ====== ANIME ======
const animeList = document.getElementById("anime-list");
const loadMoreAnimeBtn = document.getElementById("load-more-anime");

async function fetchAnime(page = 1) {
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&sort_by=popularity.desc&page=${page}`;
  const results = await fetchData(url);

  results.forEach(anime => {
    anime.media_type = 'tv';
    animeList.appendChild(createCard(anime));
  });
}

loadMoreAnimeBtn?.addEventListener("click", () => {
  currentAnimePage++;
  fetchAnime(currentAnimePage);
});

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

function scrollPinoyMovies(direction) {
  const slider = document.getElementById('pinoy-movie-list');
  if (!slider) return;
  slider.scrollLeft += slider.offsetWidth * 0.8 * direction;
}

// ====== MODAL HANDLING ======
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

// ======================
// 🇰🇷 Korean Movies Section
// ======================

const koreanMovieList = document.getElementById('korean-movie-list');
const loadMoreKoreanBtn = document.getElementById('load-more-korean');
let koreanPage = 1;

// Replace this with your actual TMDB API key
const tmdbApiKey = 'b8c2d0fa80cd79b5d28d9fe2853806bb';

async function loadKoreanMovies(genre = '') {
  try {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&with_original_language=ko&page=${koreanPage}${genre ? `&with_genres=${genre}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      loadMoreKoreanBtn.style.display = 'none';
      return;
    }

    data.results.forEach(movie => {
      const card = document.createElement('div');
      card.classList.add('movie-card');
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average}</p>
      `;

      // Optional: Hook into your modal system if needed
      card.addEventListener('click', () => {
        openModalWithTMDB(movie.id);
      });

      koreanMovieList.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load Korean movies:', error);
  }
}

function filterByKoreanGenre(genreId) {
  koreanPage = 1;
  koreanMovieList.innerHTML = '';
  loadKoreanMovies(genreId);
}

loadMoreKoreanBtn.addEventListener('click', () => {
  koreanPage++;
  const selectedGenre = document.getElementById('korean-genre-filter').value;
  loadKoreanMovies(selectedGenre);
});

// Initial Korean movie load
loadKoreanMovies();
