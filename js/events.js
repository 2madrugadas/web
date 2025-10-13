import { closePhotoPopup, navigatePhotos } from './photos.js';
import { closeVideoPopup } from './videos.js';
import { closeEssayPopup } from './essays.js';

export function setupMediaHover() {
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

export function restrictExternalLinks() {
  const anchors = document.querySelectorAll('a[href]');
  anchors.forEach(a => {
    try {
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || /^[^.\/]|^\.\//.test(href) || href.endsWith('.html')) return;
      const isHttp = /^https?:\/\//i.test(href);
      if (!isHttp) return;

      if (a.dataset.href === href) return;

      a.dataset.href = href;
      a.setAttribute('href', '#');
      a.setAttribute('rel', 'nofollow noopener');
      a.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
    } catch {}
  });
}

export function setupGlobalEventListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById('photo-popup')?.style.display === 'flex') {
        closePhotoPopup();
      }
      if (document.getElementById('video-popup')?.style.display === 'flex') {
        closeVideoPopup();
      }
      if (document.getElementById('essay-popup')?.style.display === 'flex') {
        closeEssayPopup();
      }
    }

    if (document.getElementById('photo-popup')?.style.display === 'flex') {
      if (e.key === 'ArrowLeft') navigatePhotos(-1);
      if (e.key === 'ArrowRight') navigatePhotos(1);
    }
  });

  document.getElementById('photo-popup')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closePhotoPopup();
  });

  document.getElementById('video-popup')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeVideoPopup();
  });

  document.getElementById('essay-popup')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeEssayPopup();
  });
}