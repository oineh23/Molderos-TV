document.addEventListener("DOMContentLoaded", () => {
  const movieList = document.getElementById("vivamax-movie-list");

  fetch('https://api.themoviedb.org/3/discover/movie?region=PH&with_original_language=tl&api_key=YOUR_API_KEY')
    .then(res => res.json())
    .then(data => {
      movieList.innerHTML = data.results.map(movie => `
        <div class="card">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
          <div class="card-title">${movie.title}</div>
        </div>
      `).join('');
    })
    .catch(err => {
      movieList.innerHTML = "<p>Failed to load Vivamax movies.</p>";
      console.error(err);
    });
});
