// modal.js

const modal = document.getElementById('video-modal');
const modalContent = document.getElementById('modal-content');
const modalCloseBtn = document.getElementById('modal-close');
const serverButtons = document.querySelectorAll('.server-btn');
let currentIframe = null;
let currentTitle = '';
let currentId = '';
let currentType = '';

// Generate video player URL for different servers
function getServerUrl(server, id, type) {
  switch (server) {
    case 'vidsrc':
      return `https://vidsrc.to/embed/${type}/${id}`;
    case 'vidsrcme':
      return `https://vidsrc.me/embed/${type}?id=${id}`;
    case 'videasy':
      return `https://player.videasy.net/${type}/${id}`;
    default:
      return '';
  }
}

// Inject iframe into modal
function loadIframe(server, id, type) {
  const src = getServerUrl(server, id, type);
  if (!src) return;

  modalContent.innerHTML = `
    <iframe src="${src}" frameborder="0" allowfullscreen></iframe>
  `;
}

// Open modal with default server (vidsrc)
export function openModal(id, type, title) {
  currentId = id;
  currentType = type;
  currentTitle = title;

  loadIframe('vidsrc', id, type);
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  modal.classList.remove('show');
  document.body.style.overflow = '';
  modalContent.innerHTML = ''; // Clean up iframe
}

// Server button handlers
serverButtons.forEach(button => {
  button.addEventListener('click', () => {
    const server = button.dataset.server;
    loadIframe(server, currentId, currentType);
  });
});

// Close modal on click
modalCloseBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
