// tvshows.js

import { createCard } from './utils.js';
import { showLoader, hideLoader, showError } from './ui.js';

const tvSection = document.getElementById('trending-tv');
const TMDB_API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb'; // Replace with your actual key

async function fetchTrendingTVShows() {
  showLoader(tvSection);
  try {
    const res = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}`);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      displayTVShows(data.results);
    } else {
      showError(tvSection, 'No trending TV shows found.');
    }
  } catch (err) {
    showError(tvSection, 'Failed to load TV shows.');
    console.error(err);
  } finally {
    hideLoader(tvSection);
  }
}

function displayTVShows(tvShows) {
  tvSection.innerHTML = ''; // Clear previous content
  tvShows.forEach(show => {
    const card = createCard({
      id: show.id,
      type: 'tv',
      title: show.name,
      posterPath: show.poster_path,
      releaseDate: show.first_air_date,
      voteAverage: show.vote_average
    });
    tvSection.appendChild(card);
  });
}

export function loadTVShows() {
  fetchTrendingTVShows();
}
