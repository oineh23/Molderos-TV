// tvshows.js

import { createCard } from './utils.js';
import { openModal } from './modal.js';

const TV_SECTION_ID = 'trending-tv';
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY';
const TV_API = `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}`;

export async function loadTVShows() {
  try {
    const response = await fetch(TV_API);
    const data = await response.json();
    const tvShows = data.results || [];

    const tvSection = document.getElementById(TV_SECTION_ID);
    tvSection.innerHTML = ''; // Clear existing content

    tvShows.forEach(show => {
      const card = createCard({
        id: show.id,
        title: show.name || show.original_name,
        posterPath: show.poster_path,
        backdropPath: show.backdrop_path,
        overview: show.overview,
        releaseDate: show.first_air_date,
        type: 'tv'
      });

      card.addEventListener('click', () => {
        openModal({
          id: show.id,
          title: show.name,
          type: 'tv'
        });
      });

      tvSection.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading TV shows:', error);
  }
}
