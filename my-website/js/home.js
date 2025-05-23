const API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb';
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchTrending(category = 'movie') {
  const res = await fetch(`${BASE_URL}/trending/${category}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

async function renderTrending() {
  const movieList = document.getElementById('movies-list');
  const tvList = document.getElementById('tvshows-list');
  const animeList = document.getElementById('anime-list');

  const movies = await fetchTrending('movie');
  const tv = await fetchTrending('tv');
  const anime = await fetchTrending('tv'); // Use genres later to filter anime

  movies.forEach(movie => {
    const card = createCard(movie);
    movieList.appendChild(card);
  });

  tv.forEach(show => {
    const card = createCard(show);
    tvList.appendChild(card);
  });

  anime.forEach(anime => {
    const card = createCard(anime);
    animeList.appendChild(card);
  });
}

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'col-md-3 mb-4';
  card.innerHTML = `
    <div class="card h-100">
      <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" class="card-img-top" alt="${item.title || item.name}">
      <div class="card-body">
        <h5 class="card-title">${item.title || item.name}</h5>
        <p class="card-text">${item.overview.slice(0, 100)}...</p>
        <button class="btn btn-primary" onclick="openModal('${item.id}', '${item.media_type || 'movie'}')">Watch</button>
      </div>
    </div>
  `;
  return card;
}

document.addEventListener('DOMContentLoaded', renderTrending);
