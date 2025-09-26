import { initLazyLoading } from './lazyload.js';
import { buildNavbar } from './components/navbar.js';
import { initPhotoGallery, openPhotoPopup, closePhotoPopup, navigatePhotos } from './photos.js';
import { initVideoGallery, openVideoPopup, closeVideoPopup } from './videos.js';
import { setupMediaHover, setupGlobalEventListeners } from './events.js';
import { setupContentGrid } from './grid.js';

window.MediaApp = {
  openPhotoPopup,
  closePhotoPopup,
  navigatePhotos,
  openVideoPopup,
  closeVideoPopup,
};

document.addEventListener('DOMContentLoaded', () => {
  buildNavbar();
  initLazyLoading();
  setupMediaHover();
  setupGlobalEventListeners();

  if (document.querySelector('#photo-gallery')) {
    initPhotoGallery();
  }

function startIntroAnimation() {
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.body.classList.add('intro');
    }, 30);
  });
}
  if (document.querySelector('#video-gallery')) {
    initVideoGallery();
  }

  formatCardDates();
  startIntroAnimation();
  setupTouchHover();
});

function setupTouchHover() {
  const gridItems = document.querySelectorAll('.grid-item');
  gridItems.forEach(item => {
    item.addEventListener('touchstart', function() {
      this.classList.add('touch-hover');
    }, { passive: true });

    item.addEventListener('touchend', function() {
      setTimeout(() => {
        this.classList.remove('touch-hover');
      }, 300);
    }, { passive: true });
  });
}

function formatCardDates() {
  const metas = document.querySelectorAll('.card-meta[data-date]');
  metas.forEach(el => {
    const iso = el.getAttribute('data-date');
    if (!iso) return;
    let d;
    const m = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(iso || '');
    if (m) {
      const [, y, mo, da] = m;
      d = new Date(Number(y), Number(mo) - 1, Number(da));
    } else {
      d = new Date(iso);
    }
    if (isNaN(d)) return;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(2);
    el.textContent = `${dd}-${mm}-${yy}`;
  });
}

window.openPhotoPopup = openPhotoPopup;
window.closePhotoPopup = closePhotoPopup;
window.navigatePhotos = navigatePhotos;
window.openVideoPopup = openVideoPopup;
window.closeVideoPopup = closeVideoPopup;