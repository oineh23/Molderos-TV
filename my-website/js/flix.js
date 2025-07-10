const API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb'; // Replace with your TMDB key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

async function fetchData(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

function renderHeroSlider(movies) {
  const container = $('#hero-carousel');
  container.html('');
  movies.forEach(movie => {
    const item = `
      <div class="hero-slide-item">
        <img src="${IMG_URL + movie.backdrop_path}" alt="${movie.title}">
        <div class="overlay"></div>
        <div class="hero-slide-item-content">
          <div class="item-content-wraper">
            <div class="item-content-title top-down">${movie.title}</div>
            <div class="movie-infos top-down delay-2">
              <div class="movie-info"><i class="bx bxs-star"></i><span>${movie.vote_average.toFixed(1)}</span></div>
              <div class="movie-info"><i class="bx bxs-time"></i><span>${movie.release_date || movie.first_air_date}</span></div>
              <div class="movie-info"><span>HD</span></div>
              <div class="movie-info"><span>16+</span></div>
            </div>
            <div class="item-content-description top-down delay-4">
              ${movie.overview || 'No description available.'}
            </div>
            <div class="item-action top-down delay-6">
              <a href="#" class="btn btn-hover">
                <i class="bx bxs-right-arrow"></i><span>Watch now</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;
    container.append(item);
  });
  container.owlCarousel({ items: 1, loop: true, nav: true, dots: false, autoplay: true, autoplayTimeout: 5000, smartSpeed: 450 });
}

function renderMovies(movies, containerId) {
  const container = $(`#${containerId}`);
  container.html('');
  movies.forEach(movie => {
    const title = movie.title || movie.name;
    const date = movie.release_date || movie.first_air_date;
    const item = `
      <div class="movie-item">
        <img src="${IMG_URL + movie.poster_path}" alt="${title}">
        <div class="movie-item-content">
          <div class="movie-item-title">${title}</div>
          <div class="movie-infos">
            <div class="movie-info"><i class="bx bxs-star"></i><span>${movie.vote_average.toFixed(1)}</span></div>
            <div class="movie-info"><i class="bx bxs-time"></i><span>${date}</span></div>
            <div class="movie-info"><span>HD</span></div>
            <div class="movie-info"><span>16+</span></div>
          </div>
        </div>
      </div>`;
    container.append(item);
  });
  container.owlCarousel({ items: 5, loop: true, nav: true, dots: false, margin: 20, responsive: { 0: { items: 2 }, 600: { items: 3 }, 1000: { items: 5 } } });
}

async function init() {
  const heroMovies = await fetchData('/movie/now_playing');
  const latestMovies = await fetchData('/trending/movie/week');
  const latestSeries = await fetchData('/trending/tv/week');
  const cartoons = await fetchData('/discover/movie&with_genres=16');
  renderHeroSlider(heroMovies.slice(0, 5));
  renderMovies(latestMovies.slice(0, 10), 'latest-movies');
  renderMovies(latestSeries.slice(0, 10), 'latest-series');
  renderMovies(cartoons.slice(0, 10), 'latest-cartoons');
}
init();
