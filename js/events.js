import { closePhotoPopup, navigatePhotos } from './photos.js';
import { closeVideoPopup } from './videos.js';

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

export function setupGlobalEventListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById('photo-popup')?.style.display === 'flex') {
        closePhotoPopup();
      }
      if (document.getElementById('video-popup')?.style.display === 'flex') {
        closeVideoPopup();
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
}