
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

  try {
    document.getElementById('loading-spinner').style.display = 'flex';
    const res = await fetch(url);
    const data = await res.json();
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';

    data.results.forEach(movie => {
      if (!movie.poster_path) return;
      // Ensure media_type is set for embed URL building
      movie.media_type = 'movie';
      const card = createCard(movie);
      moviesList.appendChild(card);
    });

    document.getElementById('loading-spinner').style.display = 'none';
  } catch (err) {
    console.error('Error loading genre movies:', err);
    document.getElementById('loading-spinner').style.display = 'none';
  }
}

    // Step 3: Render
    renderSeasonsAndEpisodes(seasonsData);

  } catch (error) {
    console.error('Failed to load seasons and episodes:', error);
    seasonContainer.innerHTML = '<p>Error loading episodes.</p>';
  }
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
    const card = createCard(item);
    container.appendChild(card);
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

  info.appendChild(title);
  info.appendChild(rating);

  card.appendChild(genre);
  card.appendChild(img);
  card.appendChild(button);
  card.appendChild(info);

  return card;
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
    default:
      embedURL = '';
  }

  document.getElementById('modal-video').src = embedURL;
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

const TMDB_API_KEY = "b8c2d0fa80cd79b5d28d9fe2853806bb"; // Replace this

// Call this when opening a TV show in the modal
function openTvShowModal(tvShowId, title, imageUrl, rating, description) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-image").src = imageUrl;
  document.getElementById("modal-rating").textContent = `⭐ ${rating}`;
  document.getElementById("modal-description").textContent = description;

  populateSeasons(tvShowId);

  // Show modal
  document.getElementById("modal").style.display = "block";
}

// Fetch and populate the season dropdown
function populateSeasons(tvShowId) {
  fetch(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${TMDB_API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("season-select");
      select.innerHTML = "";

      data.seasons.forEach(season => {
        const option = document.createElement("option");
        option.value = season.season_number;
        option.textContent = season.name;
        select.appendChild(option);
      });

      // Load episodes for the first season by default
      loadEpisodesForSeason(select.value, tvShowId);

      // Save TV show ID for later use on change
      select.setAttribute("data-tvshow-id", tvShowId);
    })
    .catch(err => {
      console.error("Error fetching seasons:", err);
    });
}

// Load episodes for a specific season
function loadEpisodesForSeason(seasonNumber, tvShowId = null) {
  const select = document.getElementById("season-select");
  if (!tvShowId) {
    tvShowId = select.getAttribute("data-tvshow-id");
  }

  fetch(`https://api.themoviedb.org/3/tv/${tvShowId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const episodeList = document.getElementById("episode-list");
      episodeList.innerHTML = "";

      data.episodes.forEach(ep => {
        const epDiv = document.createElement("div");
        epDiv.className = "episode-card";
        epDiv.innerHTML = `
          <strong>S${ep.season_number}E${ep.episode_number}:</strong> ${ep.name}
          <p>${ep.overview || "No description available."}</p>
        `;
        episodeList.appendChild(epDiv);
      });
    })
    .catch(err => {
      console.error("Error fetching episodes:", err);
    });
}

// ====== SEARCH MODAL ======

function openSearchModal() {
  document.getElementById("search-modal").classList.add("active");
  document.getElementById("search-input").focus();
}

function closeSearchModal() {
  document.getElementById("search-modal").classList.remove("active");
}


const searchTMDB = debounce(async () => {
  const query = document.getElementById('search-input').value.trim();
  if (!query) {
    document.getElementById('search-results').innerHTML = '';
    return;
  }

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
}

init();
