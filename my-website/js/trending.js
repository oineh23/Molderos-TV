const API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const moviesList = document.getElementById('movies-list');
const loadingSpinner = document.getElementById('loading-spinner');
let allTrendingMovies = [];

// Fetch trending movies
async function fetchTrendingMovies() {
  loadingSpinner.style.display = 'block';
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await response.json();
    allTrendingMovies = data.results;
    displayMovies(allTrendingMovies);
  } catch (error) {
    console.error('Failed to fetch trending movies:', error);
    moviesList.innerHTML = `<p style="color:red;text-align:center;">⚠️ Failed to load trending movies.</p>`;
  } finally {
    loadingSpinner.style.display = 'none';
  }
}

// Display movies in the DOM
function displayMovies(movies) {
  moviesList.innerHTML = '';

  if (movies.length === 0) {
    moviesList.innerHTML = '<p style="text-align:center;">No movies found for this genre.</p>';
    return;
  }

  movies.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('search-card');
    card.onclick = () => openModal(movie.id);

    card.innerHTML = `
      <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
    `;
    moviesList.appendChild(card);
  });
}

// Genre filter
function filterByGenre(genreId) {
  if (!genreId) {
    displayMovies(allTrendingMovies);
  } else {
    const filtered = allTrendingMovies.filter(movie => movie.genre_ids.includes(parseInt(genreId)));
    displayMovies(filtered);
  }
}

// Search modal
function openSearchModal() {
  document.getElementById("search-modal").style.display = "flex";
  document.getElementById("search-input").focus();
}

function closeSearchModal() {
  document.getElementById("search-modal").style.display = "none";
  document.getElementById("search-results").innerHTML = "";
  document.getElementById("search-input").value = "";
}

async function searchTMDB() {
  const query = document.getElementById("search-input").value.trim();
  const results = document.getElementById("search-results");

  if (!query) {
    results.innerHTML = '';
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    results.innerHTML = '';

    data.results.forEach(item => {
      if (!item.poster_path) return;
      const resultCard = document.createElement('div');
      resultCard.classList.add('search-card');
      resultCard.innerHTML = `
        <img src="${IMG_URL + item.poster_path}" alt="${item.title || item.name}" />
        <h3>${item.title || item.name}</h3>
      `;
      resultCard.onclick = () => openModal(item.id);
      results.appendChild(resultCard);
    });
  } catch (err) {
    console.error("Search failed", err);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', fetchTrendingMovies);
