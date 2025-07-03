const seriesContainer = document.getElementById('series-container');
const apiKey = 'YOUR_TMDB_API_KEY'; // Replace with your TMDb API Key

const fetchSeries = async () => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc`);
    const data = await res.json();
    displaySeries(data.results);
  } catch (error) {
    console.error('Failed to fetch series:', error);
  }
};

const displaySeries = (seriesList) => {
  seriesContainer.innerHTML = '';

  seriesList.forEach(series => {
    const { id, name, poster_path } = series;

    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${name}" />
      <div class="card-info">
        <h3>${name}</h3>
      </div>
    `;

    card.addEventListener('click', () => openModal(id));
    seriesContainer.appendChild(card);
  });
};

const openModal = (seriesId) => {
  const modal = document.getElementById('modal');
  const videoFrame = document.getElementById('video-frame');

  fetch(`https://api.themoviedb.org/3/tv/${seriesId}/videos?api_key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const trailer = data.results.find(vid => vid.type === "Trailer" && vid.site === "YouTube");
      if (trailer) {
        videoFrame.src = `https://www.youtube.com/embed/${trailer.key}`;
        modal.style.display = 'block';
      }
    });
};

document.querySelector('.close-button').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('video-frame').src = '';
});

fetchSeries();
