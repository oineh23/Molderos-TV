// js/app.js

const API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// Fetch "Now Playing" movies from TMDB
async function fetchMovies() {
  try {
    const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return [];
  }
}

// Display movies inside #movie-list
function displayMovies(movies) {
  const container = document.getElementById('movie-list');
  if (!container) {
    console.error('Movie container not found');
    return;
  }

  container.innerHTML = movies.map(movie => `
    <div class="movie-list-item">
      <img class="movie-list-item-img" src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
      <span class="movie-list-item-title">${movie.title}</span>
      <p class="movie-list-item-desc">${movie.overview ? movie.overview.slice(0, 100) + '...' : 'No description available.'}</p>
      <button class="movie-list-item-button">Watch</button>
    </div>
  `).join('');
}

// Load and display movies on page load
fetchMovies().then(displayMovies);


// === CAROUSEL ARROW HANDLING ===
const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".movie-list");

arrows.forEach((arrow, i) => {
  const itemNumber = movieLists[i].querySelectorAll("img").length;
  let clickCounter = 0;
  arrow.addEventListener("click", () => {
    const ratio = Math.floor(window.innerWidth / 270);
    clickCounter++;
    if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
      movieLists[i].style.transform = `translateX(${
        movieLists[i].computedStyleMap().get("transform")[0].x.value - 300
      }px)`;
    } else {
      movieLists[i].style.transform = "translateX(0)";
      clickCounter = 0;
    }
  });

  console.log(Math.floor(window.innerWidth / 270));
});

// === DARK/LIGHT TOGGLE ===
const ball = document.querySelector(".toggle-ball");
const items = document.querySelectorAll(
  ".container,.movie-list-title,.navbar-container,.sidebar,.left-menu-icon,.toggle"
);

ball.addEventListener("click", () => {
  items.forEach((item) => {
    item.classList.toggle("active");
  });
  ball.classList.toggle("active");
});

// === INIT ===
fetchTrendingMovies();
