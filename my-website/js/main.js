import { fetchTrending } from './tvshows.js';
import { fetchTrendingAnime } from './anime.js';
import { fetchPinoyMoviesPaginated, setupPinoyControls } from './pinoy.js';
import { displayBanner, displayList } from './card.js';

async function init() {
  const [movies, tvShows, anime] = await Promise.all([
    fetchTrending('movie'),
    fetchTrending('tv'),
    fetchTrendingAnime()
  ]);

  displayBanner(movies[Math.floor(Math.random() * movies.length)]);
  displayList(movies, 'movies-list');
  displayList(tvShows, 'tvshows-list');
  displayList(anime, 'anime-list');
}

document.addEventListener('DOMContentLoaded', () => {
  init().then(() => {
    fetchPinoyMoviesPaginated();
    setupPinoyControls();
  });
});
