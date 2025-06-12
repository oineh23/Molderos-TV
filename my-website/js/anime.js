// anime.js

import { createCard } from './utils.js';
import { openModal } from './modal.js';

const ANIME_SECTION_ID = 'trending-anime';
const TMDB_API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb';
const ANIME_API = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&sort_by=popularity.desc`;

export async function loadAnime() {
  try {
    const response = await fetch(ANIME_API);
    const data = await response.json();
    const animeList = data.results || [];

    const animeSection = document.getElementById(ANIME_SECTION_ID);
    animeSection.innerHTML = ''; // Clear existing content

    animeList.forEach(anime => {
      const card = createCard({
        id: anime.id,
        title: anime.name || anime.original_name,
        posterPath: anime.poster_path,
        backdropPath: anime.backdrop_path,
        overview: anime.overview,
        releaseDate: anime.first_air_date,
        type: 'anime'
      });

      card.addEventListener('click', () => {
        openModal({
          id: anime.id,
          title: anime.name,
          type: 'anime'
        });
      });

      animeSection.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading anime:', error);
  }
}
