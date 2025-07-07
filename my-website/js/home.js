// home.js

const API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

$(document).ready(() => {
  loadSection(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`, '#hero-carousel', true); // Hero
  loadSection(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`, '#top-movies-slide');
  loadSection(`${BASE_URL}/movie/popular?api_key=${API_KEY}`, '.section:contains("latest movies") .movies-slide');
  loadSection(`${BASE_URL}/tv/popular?api_key=${API_KEY}`, '.section:contains("latest series") .movies-slide');
  loadSection(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16`, '.section:contains("latest cartoons") .movies-slide'); // Anime
});

// Load movies/TV into a carousel container
function loadSection(url, targetSelector, isHero = false) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const results = data.results.slice(0, 10); // Limit to 10 items
      const container = $(targetSelector);
      results.forEach(item => {
        const isMovie = !!item.title;
        const title = isMovie ? item.title : item.name;
        const imgSrc = IMG_URL + (item.backdrop_path || item.poster_path);
        const rating = item.vote_average.toFixed(1);

        const itemHTML = isHero
          ? getHeroSlideHTML(imgSrc, title, rating)
          : getMovieItemHTML(imgSrc, title, rating);

        container.trigger('add.owl.carousel', [$(itemHTML)]).trigger('refresh.owl.carousel');
      });
    })
    .catch(err => console.error('TMDB API Error:', err));
}

function getHeroSlideHTML(img, title, rating) {
  return `
    <div class="hero-slide-item">
      <img src="${img}" alt="${title}">
      <div class="overlay"></div>
      <div class="hero-slide-item-content">
        <div class="item-content-wraper">
          <div class="item-content-title top-down">${title}</div>
          <div class="movie-infos top-down delay-2">
            <div class="movie-info"><i class="bx bxs-star"></i><span>${rating}</span></div>
            <div class="movie-info"><span>HD</span></div>
            <div class="movie-info"><span>PG-13</span></div>
          </div>
          <div class="item-content-description top-down delay-4">Watch now on Flix streaming platform.</div>
          <div class="item-action top-down delay-6">
            <a href="#" class="btn btn-hover"><i class="bx bxs-right-arrow"></i><span>Watch now</span></a>
          </div>
        </div>
      </div>
    </div>`;
}

function getMovieItemHTML(img, title, rating) {
  return `
    <a href="#" class="movie-item">
      <img src="${img}" alt="${title}">
      <div class="movie-item-content">
        <div class="movie-item-title">${title}</div>
        <div class="movie-infos">
          <div class="movie-info"><i class="bx bxs-star"></i><span>${rating}</span></div>
          <div class="movie-info"><span>HD</span></div>
          <div class="movie-info"><span>PG-13</span></div>
        </div>
      </div>
    </a>`;
}
