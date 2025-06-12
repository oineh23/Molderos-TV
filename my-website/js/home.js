// modal.js

const modal = document.getElementById('videoModal');
const modalCloseBtn = modal.querySelector('.modal-close');
const modalIframe = modal.querySelector('iframe');
const serverButtons = modal.querySelectorAll('.server-btn');

let currentId = null;
let currentType = null;

function buildIframeSrc(id, type, server) {
  const sources = {
    vidsrc: `https://vidsrc.to/embed/${type}/${id}`,
    vidsrcc: `https://vidsrc.cc/embed/${type}/${id}`,
    videasy: `https://player.videasy.net/${type}/${id}`
  };
  return sources[server] || sources.vidsrc;
}

export function openModal(id, type = 'movie') {
  currentId = id;
  currentType = type;

  modal.style.display = 'flex';
  modalIframe.src = buildIframeSrc(id, type, 'vidsrc');

  // Highlight default server
  serverButtons.forEach(btn => btn.classList.remove('active'));
  const defaultBtn = modal.querySelector('[data-server="vidsrc"]');
  if (defaultBtn) defaultBtn.classList.add('active');
}

function closeModal() {
  modal.style.display = 'none';
  modalIframe.src = '';
}

modalCloseBtn.addEventListener('click', closeModal);

// Server switching
serverButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selectedServer = button.getAttribute('data-server');
    modalIframe.src = buildIframeSrc(currentId, currentType, selectedServer);

    // Update button styles
    serverButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

export function setupModalTriggers() {
  document.body.addEventListener('click', (e) => {
    const card = e.target.closest('.media-card');
    if (card) {
      const id = card.getAttribute('data-id');
      const type = card.getAttribute('data-type') || 'movie';
      openModal(id, type);
    }
  });
}
