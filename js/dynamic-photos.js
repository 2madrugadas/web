import { getPhotos, initializeFromGitHub } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initializeFromGitHub();
  renderPhotos();
});

function renderPhotos() {
  const gallery = document.getElementById('photo-gallery');
  if (!gallery) return;

  const photos = getPhotos();

  if (photos.length === 0) {
    gallery.innerHTML = '<p style="color: var(--muted); text-align: center; grid-column: 1 / -1; font-family: \'JMH Typewriter\', monospace;">No hay fotos</p>';
    return;
  }

  gallery.innerHTML = photos.map(photo => {
    const directLink = convertDriveLink(photo.link);
    return `
      <a href="#" class="grid-item photo-item" data-id="${photo.id}">
        <img src="${directLink}" alt="${photo.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+no+disponible'">
        <h3>${photo.title}</h3>
        <div class="card-meta">${formatDate(photo.date)}</div>
      </a>
    `;
  }).join('');

  initPhotoClickHandlers();
}

function convertDriveLink(url) {
  if (!url) return url;
  
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=w500-h500`;
    }
  }
  
  return url;
}

function initPhotoClickHandlers() {
  const photoItems = document.querySelectorAll('.photo-item');
  photoItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const img = item.querySelector('img');
      if (img && window.openPhotoPopup) {
        const index = Array.from(document.querySelectorAll('.photo-item')).indexOf(item);
        window.openPhotoPopup(index);
      }
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
