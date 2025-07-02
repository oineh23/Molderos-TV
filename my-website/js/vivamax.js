const pinoyMovieList = document.getElementById("pinoy-movie-list");
const loadMorePinoyBtn = document.getElementById("load-more-pinoy");
const pinoyGenreFilter = document.getElementById("pinoy-genre-filter");

let pinoyPage = 1;
let selectedPinoyGenre = "";

const TMDB_API_KEY = "b8c2d0fa80cd79b5d28d9fe2853806bb"; // Replace with your real key

function fetchPinoyMovies() {
  const genreParam = selectedPinoyGenre ? `&with_genres=${selectedPinoyGenre}` : "";
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${pinoyPage}${genreParam}&region=PH`)
    .then(res => res.json())
    .then(data => {
      data.results.forEach(movie => {
        const card = document.createElement("div");
        card.className = "search-card";
        card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
          <h3>${movie.title}</h3>
        `;
        pinoyMovieList.appendChild(card);
      });
    })
    .catch(err => console.error("Error loading Pinoy movies:", err));
}

loadMorePinoyBtn.addEventListener("click", () => {
  pinoyPage++;
  fetchPinoyMovies();
});

function filterByPinoyGenre(genreId) {
  selectedPinoyGenre = genreId;
  pinoyPage = 1;
  pinoyMovieList.innerHTML = "";
  fetchPinoyMovies();
}

fetchPinoyMovies();
