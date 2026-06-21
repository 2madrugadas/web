import { getVideos, initializeFromGitHub } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initializeFromGitHub();
  renderVideos();
});

function renderVideos() {
  const gallery = document.getElementById('video-gallery');
  if (!gallery) return;

  const videos = getVideos();

  if (videos.length === 0) {
    gallery.innerHTML = '<p style="color: var(--muted); text-align: center; grid-column: 1 / -1; font-family: \'JMH Typewriter\', monospace;">No hay videos</p>';
    return;
  }

  gallery.innerHTML = videos.map(video => {
    const videoId = extractYouTubeId(video.link);
    return `
      <a href="#" class="grid-item video-item" data-id="${video.id}">
        <video muted loop playsinline preload="metadata">
          <source src="${video.link}" type="video/mp4">
        </video>
        <h3>${video.title}</h3>
        <div class="card-meta">${formatDate(video.date)}</div>
      </a>
    `;
  }).join('');

  initVideoClickHandlers();
  initVideoHover();
}

function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function initVideoClickHandlers() {
  const videoItems = document.querySelectorAll('.video-item');
  videoItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.openVideoPopup) {
        const index = Array.from(document.querySelectorAll('.video-item')).indexOf(item);
        window.openVideoPopup(index);
      }
    });
  });
}

function initVideoHover() {
  document.querySelectorAll('.video-item video').forEach(video => {
    video.addEventListener('mouseenter', function() {
      this.play().catch(() => {});
    });

    video.addEventListener('mouseleave', function() {
      this.pause();
      this.currentTime = 0;
    });
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(2);
  return `${dd}-${mm}-${yy}`;
}
