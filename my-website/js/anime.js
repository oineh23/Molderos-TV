// anime.js

import { createCard } from './utils.js';
import { showLoader, hideLoader, showError } from './ui.js';

const animeSection = document.getElementById('trending-anime');
const TMDB_API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb'; // Replace with your actual TMDb key

async function fetchAnimeTVShows() {
  showLoader(animeSection);
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&sort_by=popularity.desc&language=en-US&page=1`
    );
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      displayAnime(data.results);
    } else {
      showError(animeSection, 'No anime found.');
    }
  } catch (err) {
    showError(animeSection, 'Failed to load anime.');
    console.error(err);
  } finally {
    hideLoader(animeSection);
  }
}

function displayAnime(animeList) {
  animeSection.innerHTML = ''; // Clear previous content
  animeList.forEach(anime => {
    const card = createCard({
      id: anime.id,
      type: 'tv', // TMDb treats anime as TV series
      title: anime.name,
      posterPath: anime.poster_path,
      releaseDate: anime.first_air_date,
      voteAverage: anime.vote_average
    });
    animeSection.appendChild(card);
  });
}

export function loadAnime() {
  fetchAnimeTVShows();
}
