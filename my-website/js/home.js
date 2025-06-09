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
  // Add more as needed
};

let currentItem;
let tvShowsPage = 1;
let tvGenre = '';
let tvPage = 1;

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

const animeList = document.getElementById("anime-list");
const loadMoreAnimeBtn = document.getElementById("load-more-anime");
let currentAnimePage = 1;

// Fetch and display anime
async function fetchAnime(page = 1) {
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&sort_by=popularity.desc&page=${page}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    data.results.forEach(anime => {
      anime.media_type = 'tv';
      const card = createCard(anime);
      animeList.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching anime:", error);
  }
}

// Load more anime when button is clicked
loadMoreAnimeBtn.addEventListener("click", () => {
  currentAnimePage++;
  fetchAnime(currentAnimePage);
});

// ====== API FETCHERS ======

const fetchTrending = (type) =>
  fetchData(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);

async function fetchTrendingAnime() {
  let allResults = [];
  for (let page = 1; page <= 3; page++) {
    const results = await fetchData(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
