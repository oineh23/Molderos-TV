// main.js

import { loadMovies } from './movies.js';
import { loadTVShows } from './tvshows.js';
import { loadAnime } from './anime.js';
import { setupModalPlayer } from './modal.js';
import { initThemeToggle } from './theme.js';
import { showLoading, hideLoading } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // Show loading spinner
  showLoading();

  // Load content sections
  loadMovies();
  loadTVShows();
  loadAnime();

  // Setup modal functionality
  setupModalPlayer();

  // Init dark/light mode toggle
  initThemeToggle();

  // Hide loading spinner after everything is ready
  setTimeout(hideLoading, 1500); // Simulate content load delay
});
