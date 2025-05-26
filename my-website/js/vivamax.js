const vivamaxMovies = [
  {
    title: "Deep Inside - Angeli Khang (2025)",
    logo: "https://image.tmdb.org/t/p/w342/lKP9okBAtcBYHPNb24LQJqoAMCo.jpg",
    group: "VIVAMAX",
    url: "https://gstream.hollymoviehd.cc/streamsvr/ZqeHKkC2u7/0-3"
  },
  {
    title: "Ang Pamumukadkad Ni Mirasol (2025)",
    logo: "https://image.tmdb.org/t/p/w342/72iBQcLM4ZxJgoyLzl7eNxGfPC.jpg",
    group: "VIVAMAX",
    url: "https://gstream.hollymoviehd.cc/streamsvr/h0er-78aTX/0-4"
  }
  // Add more...
];

function loadVivamax() {
  const container = document.getElementById("vivamax-section");
  vivamaxMovies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${movie.logo}" alt="${movie.title}">
      <h4>${movie.title}</h4>
      <button onclick="playMovie('${movie.url}')">Watch Now</button>
    `;
    container.appendChild(card);
  });
}

function playMovie(url) {
  const player = document.getElementById("movie-player");
  player.src = url;
  document.getElementById("player-modal").style.display = "block";
}

