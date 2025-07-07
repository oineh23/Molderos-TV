// === TMDB CONFIG ===
const API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

// === FETCH AND DISPLAY TRENDING MOVIES ===
async function fetchTrendingMovies() {
  try {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await res.json();
    displayMovies(data.results);
  } catch (err) {
    console.error('Failed to fetch trending movies:', err);
  }
}

function displayMovies(movies) {
  const movieList = document.querySelector(".movie-list");
  movieList.innerHTML = ''; // Clear existing

  movies.forEach(movie => {
    const movieItem = document.createElement("div");
    movieItem.classList.add("movie-list-item");

    movieItem.innerHTML = `
      <img class="movie-list-item-img" src="${IMG_URL}${movie.poster_path}" alt="${movie.title}">
      <span class="movie-list-item-title">${movie.title}</span>
    `;

    movieList.appendChild(movieItem);
  });
}

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
