// theme.js

const toggleThemeBtn = document.getElementById('toggle-theme');
const body = document.body;

// Initialize theme
export function initTheme() {
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = storedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(theme);
}

// Apply selected theme
function applyTheme(theme) {
  body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateToggleButton(theme);
}

// Update toggle button icon/text
function updateToggleButton(theme) {
  if (!toggleThemeBtn) return;
  toggleThemeBtn.innerHTML = theme === 'dark' ? '🌙 Dark' : '☀️ Light';
}

// Toggle theme on button click
toggleThemeBtn?.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});
