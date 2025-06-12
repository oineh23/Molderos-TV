// movies.js

import { createCard } from './utils.js';
import { showLoader, hideLoader, showError } from './ui.js';

const moviesSection = document.getElementById('trending-movies');
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your key

async function fetchTrendingMovies() {
  showLoader(moviesSection);
  try {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      displayMovies(data.results);
    } else {
      showError(moviesSection, 'No trending movies found.');
    }
  } catch (err) {
    showError(moviesSection, 'Failed to load movies.');
    console.error(err);
  } finally {
    hideLoader(moviesSection);
  }
}

function displayMovies(movies) {
  moviesSection.innerHTML = ''; // Clear old cards
  movies.forEach(movie => {
    const card = createCard({
      id: movie.id,
      type: 'movie',
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average
    });
    moviesSection.appendChild(card);
  });
}

export function loadMovies() {
  fetchTrendingMovies();
}
