// ===================== CONFIG =====================
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

const DOM = {
  animeList: document.getElementById("anime-list"),
  loadMoreAnimeBtn: document.getElementById("load-more-anime"),
  pinoyGenreSelect: document.getElementById("pinoy-genre-filter"),
  pinoyLoadMoreBtn: document.getElementById("load-more-pinoy"),
  tvShowsList: document.getElementById('tvshows-list'),
  modal: document.getElementById('modal'),
  searchInput: document.getElementById('search-input'),
  searchModal: document.getElementById('search-modal'),
  searchResults: document.getElementById('search-results'),
  modalVideo: document.getElementById('modal-video'),
  modalTitle: document.getElementById('modal-title'),
  modalDescription: document.getElementById('modal-description'),
  modalImage: document.getElementById('modal-image'),
  modalRating: document.getElementById('modal-rating'),
};

// ===================== UTILS =====================
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

async function fetchData(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

function createCard(item) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img src="${IMG_URL + item.poster_path}" alt="${item.title || item.name}"/>
    <div class="info">
      <h4>${item.title || item.name}</h4>
      <p>${genreMap[item.genre_ids?.[0]] || 'Unknown'} | ⭐ ${item.vote_average}</p>
    </div>
  `;
  card.onclick = () => showDetails(item);
  return card;
}

function getEmbedURL(type, id, server) {
  switch (server) {
    case 'vidsrc.cc': return `https://vidsrc.cc/v2/embed/${type}/${id}`;
    case 'vidsrc.me': return `https://vidsrc.net/embed/${type}/?tmdb=${id}`;
    case 'player.videasy.net': return `https://player.videasy.net/${type}/${id}`;
    default: return '';
  }
}

// ===================== FETCH & RENDER =====================
let tvGenre = '';
let tvShowsPage = 1;
async function fetchTrendingTVShows(page = 1, reset = false) {
  const url = tvGenre
    ? `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${tvGenre}&sort_by=popularity.desc&page=${page}`
    : `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`;

  if (reset) DOM.tvShowsList.innerHTML = '';

  const results = await fetchData(url);
  results.forEach(tv => {
    if (!tv.poster_path) return;
    tv.media_type = 'tv';
    DOM.tvShowsList.appendChild(createCard(tv));
  });
}

let animePage = 1;
async function fetchAnimeSeries() {
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&sort_by=popularity.desc&page=${animePage}`;
  const results = await fetchData(url);
  results.forEach(anime => {
    anime.media_type = 'tv';
    DOM.animeList.appendChild(createCard(anime));
  });
}

let pinoyGenre = '';
let pinoyPage = 1;
async function fetchPinoyMoviesPaginated(reset = false) {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=tl&sort_by=popularity.desc&page=${pinoyPage}`;
  if (pinoyGenre) {
    url += `&with_genres=${pinoyGenre}`;
  }
  const results = await fetchData(url);
  const container = document.getElementById('pinoy-movies');
  if (reset) container.innerHTML = '';
  results.forEach(movie => {
    if (movie.poster_path) container.appendChild(createCard(movie));
  });
}

// ===================== EVENT HANDLERS =====================
function showDetails(item) {
  DOM.modalTitle.textContent = item.title || item.name;
  DOM.modalDescription.textContent = item.overview;
  DOM.modalImage.src = IMG_URL + item.backdrop_path;
  DOM.modalRating.textContent = `⭐ ${item.vote_average}`;
  DOM.modal.style.display = "block";
  const type = item.media_type;
  const server = document.getElementById('server').value;
  DOM.modalVideo.src = getEmbedURL(type, item.id, server);
  currentItem = item;
}

function closeModal() {
  DOM.modal.style.display = "none";
  DOM.modalVideo.src = "";
}

function closeSearchModal() {
  DOM.searchModal.style.display = "none";
}

function changeServer() {
  const server = document.getElementById('server').value;
  const type = currentItem.media_type;
  DOM.modalVideo.src = getEmbedURL(type, currentItem.id, server);
}

const searchTMDB = debounce(async () => {
  const query = DOM.searchInput.value.trim();
  if (!query) return DOM.searchResults.innerHTML = '';
  const results = await fetchData(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  DOM.searchResults.innerHTML = '';
  results.forEach(item => {
    if (!item.poster_path) return;
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => {
      closeSearchModal();
      showDetails(item);
    };
    DOM.searchResults.appendChild(img);
  });
}, 400);

// ===================== INIT =====================
function setupPinoyControls() {
  DOM.pinoyGenreSelect.addEventListener("change", () => {
    pinoyGenre = DOM.pinoyGenreSelect.value;
    pinoyPage = 1;
    fetchPinoyMoviesPaginated(true);
  });

  DOM.pinoyLoadMoreBtn.addEventListener("click", () => {
    pinoyPage++;
    fetchPinoyMoviesPaginated();
  });
}

function setupTVControls() {
  document.getElementById('tv-genre-filter').addEventListener("change", (e) => {
    tvGenre = e.target.value;
    tvShowsPage = 1;
    fetchTrendingTVShows(1, true);
  });

  document.getElementById("load-more-tvshows").addEventListener("click", () => {
    tvShowsPage++;
    fetchTrendingTVShows(tvShowsPage);
  });
}

async function init() {
  await fetchTrendingTVShows();
  await fetchAnimeSeries();
}

document.addEventListener("DOMContentLoaded", async () => {
  await init();
  fetchPinoyMoviesPaginated();
  setupPinoyControls();
  setupTVControls();
});
