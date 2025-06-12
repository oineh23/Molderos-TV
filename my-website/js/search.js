// search.js

import { openModal } from './modal.js';
import { TMDB_API_KEY } from './config.js'; // Store your API key in a config file

const searchModal = document.getElementById('search-modal');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchCloseBtn = document.getElementById('search-close');

let debounceTimer;

// Open search modal
export function openSearchModal() {
  searchModal.classList.add('show');
  document.body.style.overflow = 'hidden';
  searchInput.focus();
}

// Close search modal
function closeSearchModal() {
  searchModal.classList.remove('show');
  document.body.style.overflow = '';
  searchInput.value = '';
  searchResults.innerHTML = '';
}

// Search TMDb
async function searchTMDb(query) {
  const endpoints = [
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`,
    `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${query}`,
    `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${query}`
  ];

  try {
    const [movieRes, tvRes, multiRes] = await Promise.all(endpoints.map(url => fetch(url)));
    const [movies, tvShows, multi] = await Promise.all([movieRes.json(), tvRes.json(), multiRes.json()]);

    const combinedResults = [...movies.results, ...tvShows.results, ...multi.results].filter(
      (item, index, self) =>
        item.poster_path &&
        self.findIndex(i => i.id === item.id) === index
    );

    renderSearchResults(combinedResults.slice(0, 20));
  } catch (error) {
    console.error('Search error:', error);
    searchResults.innerHTML = `<p class="error">Failed to load results. Please try again.</p>`;
  }
}

// Render results
function renderSearchResults(results) {
  searchResults.innerHTML = results.map(item => {
    const title = item.title || item.name || 'Unknown';
    const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'no-image.jpg';
    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');

    return `
      <div class="search-card" data-id="${item.id}" data-type="${type}">
        <img src="${poster}" alt="${title}" />
        <h4>${title}</h4>
      </div>
    `;
  }).join('');
}

// Event: Input with debounce
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  clearTimeout(debounceTimer);
  if (query.length > 1) {
    debounceTimer = setTimeout(() => searchTMDb(query), 300);
  } else {
    searchResults.innerHTML = '';
  }
});

// Event: Result click → open modal
searchResults.addEventListener('click', (e) => {
  const card = e.target.closest('.search-card');
  if (!card) return;

  const id = card.dataset.id;
  const type = card.dataset.type;
  const title = card.querySelector('h4').textContent;

  closeSearchModal();
  openModal(id, type, title);
});

// Close modal events
searchCloseBtn.addEventListener('click', closeSearchModal);
window.addEventListener('click', (e) => {
  if (e.target === searchModal) closeSearchModal();
});
