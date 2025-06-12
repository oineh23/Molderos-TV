// movies.js

import { createCard } from './utils.js';
import { openModal } from './modal.js';

const MOVIES_SECTION_ID = 'trending-movies';
const TMDB_API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb';
const MOVIES_API = `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`;

export async function loadMovies() {
  try {
    const response = await fetch(MOVIES_API);
    const data = await response.json();
    const movies = data.results || [];

    const moviesSection = document.getElementById(MOVIES_SECTION_ID);
    moviesSection.innerHTML = ''; // Clear existing content

    movies.forEach(movie => {
      const card = createCard({
        id: movie.id,
        title: movie.title || movie.name,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        overview: movie.overview,
        releaseDate: movie.release_date,
        type: 'movie'
      });

      card.addEventListener('click', () => {
        openModal({
          id: movie.id,
          title: movie.title,
          type: 'movie'
        });
      });

      moviesSection.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading movies:', error);
  }
}
