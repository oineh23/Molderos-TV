// utils.js

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export function createCard({ id, title, posterPath, backdropPath, overview, releaseDate, type }) {
  const card = document.createElement('div');
  card.classList.add('media-card');
  card.setAttribute('data-id', id);
  card.setAttribute('data-type', type);

  const img = document.createElement('img');
  img.classList.add('media-poster');
  img.src = posterPath ? `${IMAGE_BASE_URL}${posterPath}` : './assets/no-image.png';
  img.alt = title;

  const overlay = document.createElement('div');
  overlay.classList.add('media-overlay');

  const titleEl = document.createElement('h3');
  titleEl.classList.add('media-title');
  titleEl.textContent = title;

  const dateEl = document.createElement('p');
  dateEl.classList.add('media-date');
  dateEl.textContent = releaseDate || '';

  overlay.appendChild(titleEl);
  overlay.appendChild(dateEl);

  card.appendChild(img);
  card.appendChild(overlay);

  return card;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function truncateText(text, maxLength = 120) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}
