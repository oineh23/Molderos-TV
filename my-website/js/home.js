
// === DARK/LIGHT MODE ===
function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle("light");
  localStorage.setItem("molderos_theme", isLight ? "light" : "dark");
}

function applySavedTheme() {
  const saved = localStorage.getItem("molderos_theme");
  if (saved === "light") {
    document.body.classList.add("light");
    document.getElementById("theme-toggle").checked = true;
  }
}



// === USER LOGIN SYSTEM ===
function checkUsername() {
  const name = localStorage.getItem("molderos_username");
  const modal = document.getElementById("login-modal");
  if (!name) {
    modal.style.display = "flex";
  } else {
    document.getElementById("user-greeting").textContent = "👋 Hi, " + name;
  }
}

function saveUsername() {
  const input = document.getElementById("username-input");
  if (input.value.trim()) {
    localStorage.setItem("molderos_username", input.value.trim());
    document.getElementById("login-modal").style.display = "none";
    document.getElementById("user-greeting").textContent = "👋 Hi, " + input.value.trim();
  }
}


const API_KEY = 'b8c2d0fa80cd79b5d28d9fe2853806bb';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_URL = 'https://image.tmdb.org/t/p/original';
    let currentItem;

    async function fetchTrending(type) {
      const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
      const data = await res.json();
      return data.results;
    }

    async function fetchTrendingAnime() {
  let allResults = [];

  // Fetch from multiple pages to get more anime (max 3 pages for demo)
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    const filtered = data.results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    allResults = allResults.concat(filtered);
  }

  return allResults;
}


    function displayBanner(item) {
      document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
      document.getElementById('banner-title').textContent = item.title || item.name;
    }

    function displayList(items, containerId) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = `${IMG_URL}${item.backdrop_path || item.poster_path}`;
        img.alt = item.title || item.name;
        img.onclick = () => showDetails(item);

        const btn = document.createElement('button');
        btn.textContent = "❤️ Watchlist";
        btn.className = "watchlist-btn";
        btn.onclick = (e) => {
          e.stopPropagation();
          addToWatchlist(item);
        };

        card.appendChild(img);
        card.appendChild(btn);
        container.appendChild(card);
});
    }

    function showDetails(item) {
      currentItem = item;
      document.getElementById('modal-title').textContent = item.title || item.name;
      document.getElementById('modal-description').textContent = item.overview;
      document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
      document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
      changeServer();
      document.getElementById('modal').style.display = 'flex';
    }

    
function changeServer(preferred) {
  const server = preferred || document.getElementById('server').value;
  const type = currentItem.media_type === "movie" ? "movie" : "tv";
  const id = currentItem.id;
  let embedURL = "";

  if (server === "vidsrc.cc") {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${id}`;
  } else if (server === "vidsrc.me") {
    embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${id}`;
  } else if (server === "player.videasy.net") {
    embedURL = `https://player.videasy.net/${type}/${id}`;
  }

  const iframe = document.getElementById('modal-video');
  iframe.src = embedURL;

  // Fallback check after 6s
  setTimeout(() => {
    if (!iframe.contentWindow || iframe.contentWindow.length === 0) {
      const fallback = server === "vidsrc.cc" ? "vidsrc.me" :
                       server === "vidsrc.me" ? "player.videasy.net" : "vidsrc.cc";
      changeServer(fallback);
    }
  }, 6000);
}


function displayWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
  if (watchlist.length > 0) {
    displayList(watchlist, "watchlist-list");
  } else {
    document.getElementById("watchlist-list").innerHTML = "<p style='color:#ccc'>Your watchlist is empty.</p>";
  }
}
