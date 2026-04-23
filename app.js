const STORAGE_KEYS = {
  theme: "songs-theme"
};

const state = {
  songs: [],
  currentAudio: null,
  theme: "dark"
};

const elements = {};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheElements();
  bindEvents();
  applyTheme(getStoredTheme());
  await loadSongs();
}

function cacheElements() {
  elements.searchBar = document.getElementById("searchBar");
  elements.themeToggle = document.getElementById("themeToggle");
  elements.libraryStatus = document.getElementById("libraryStatus");
  elements.songCount = document.getElementById("songCount");
  elements.songList = document.getElementById("songList");
}

function bindEvents() {
  elements.searchBar.addEventListener("input", renderSongs);
  elements.themeToggle.addEventListener("click", toggleTheme);
}

function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.theme) || (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  } catch {
    return "dark";
  }
}

function applyTheme(theme) {
  state.theme = theme === "light" ? "light" : "dark";
  document.body.dataset.theme = state.theme;
  document.documentElement.style.colorScheme = state.theme;
  elements.themeToggle.textContent = state.theme === "light" ? "Switch to dark theme" : "Switch to light theme";
  elements.themeToggle.setAttribute("aria-pressed", state.theme === "light" ? "true" : "false");

  try {
    localStorage.setItem(STORAGE_KEYS.theme, state.theme);
  } catch {
    /* localStorage may be unavailable in restricted contexts */
  }
}

function toggleTheme() {
  applyTheme(state.theme === "light" ? "dark" : "light");
}

async function loadSongs() {
  try {
    const response = await fetch("songs.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const songs = await response.json();
    state.songs = normalizeSongs(songs);
    renderSongs();
    setStatus("Library ready.");
  } catch (error) {
    console.error("Failed to load songs", error);
    state.songs = [];
    renderSongs();
    setStatus("Could not load songs.json.", true);
  }
}

function normalizeSongs(songs) {
  if (!Array.isArray(songs)) {
    return [];
  }

  return songs
    .map((song) => ({
      title: String(song?.title || "").trim(),
      artist: String(song?.artist || "").trim(),
      filename: String(song?.filename || "").trim(),
      cover: String(song?.cover || "").trim()
    }))
    .filter((song) => song.title && song.artist && song.filename && song.cover);
}

function renderSongs() {
  const query = elements.searchBar.value.trim().toLowerCase();
  const filteredSongs = state.songs
    .map((song, index) => ({ song, index }))
    .filter(({ song }) => {
      if (!query) {
        return true;
      }

      return [song.title, song.artist, song.filename, song.cover].some((value) => value.toLowerCase().includes(query));
    });

  elements.songList.innerHTML = filteredSongs
    .map(({ song, index }) => createSongCard(song, index))
    .join("");

  elements.songCount.textContent = `${filteredSongs.length} track${filteredSongs.length === 1 ? "" : "s"}${query ? ` matching “${elements.searchBar.value.trim()}”` : ""} in the library`;
  bindCardAudio();
}

function createSongCard(song, index) {
  const title = escapeHtml(song.title);
  const artist = escapeHtml(song.artist);
  const filename = escapeHtml(song.filename);
  const cover = escapeHtml(song.cover);

  return `
    <article class="song-card" data-song-index="${index}">
      <div class="cover-frame">
        <img src="covers/${cover}" alt="${title} cover" loading="lazy" decoding="async">
      </div>

      <div class="song-body">
        <div class="song-heading">
          <div>
            <p class="eyebrow">Track ${index + 1}</p>
            <h3>${title}</h3>
            <p class="artist">${artist}</p>
          </div>
          <span class="pill">Streaming</span>
        </div>

        <audio controls preload="none" controlsList="nodownload noplaybackrate" src="songs/${filename}"></audio>
      </div>
    </article>
  `;
}

function bindCardAudio() {
  document.querySelectorAll(".song-card audio").forEach((audio) => {
    if (audio.dataset.bound === "true") {
      return;
    }

    audio.dataset.bound = "true";

    audio.addEventListener("play", () => {
      if (state.currentAudio && state.currentAudio !== audio) {
        state.currentAudio.pause();
      }

      state.currentAudio = audio;
      setCardPlaying(audio, true);
    });

    audio.addEventListener("pause", () => {
      if (state.currentAudio === audio) {
        state.currentAudio = null;
      }

      setCardPlaying(audio, false);
    });

    audio.addEventListener("ended", () => {
      if (state.currentAudio === audio) {
        state.currentAudio = null;
      }

      setCardPlaying(audio, false);
    });
  });
}

function setCardPlaying(audio, isPlaying) {
  const card = audio.closest(".song-card");

  if (card) {
    card.classList.toggle("is-playing", isPlaying);
  }
}

function setStatus(message, isError = false) {
  elements.libraryStatus.textContent = message;
  elements.libraryStatus.style.background = isError ? "rgba(220, 83, 76, 0.16)" : "var(--accent-soft)";
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
