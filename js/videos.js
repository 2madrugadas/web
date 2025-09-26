let currentVideoIndex = 0;
let videos = [];

export function initVideoGallery() {
  const videoItems = document.querySelectorAll('.video-item');
  videos = Array.from(videoItems).map(item => ({
    element: item,
    video: item.querySelector('video'),
    title: item.querySelector('h3')?.textContent || ''
  }));

  videoItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      if (!item.getAttribute('href')) {
        e.preventDefault();
        openVideoPopup(index);
      }
    });

    item.addEventListener('touchstart', (e) => {
      if (item.getAttribute('href')) return;
      item.classList.add('hover-effect');
    }, { passive: true });

    item.addEventListener('touchend', () => {
      setTimeout(() => item.classList.remove('hover-effect'), 300);
    }, { passive: true });
  });
}

export function openVideoPopup(index) {
  currentVideoIndex = index;
  const popup = document.getElementById('video-popup');
  const popupVideo = document.getElementById('popup-video');
  const popupInfo = document.querySelector('.video-info');

  if (!popup || !popupVideo) return;

  const videoSource = videos[index].video.querySelector('source');
  popupVideo.src = videoSource?.src || videoSource?.dataset.src;

  if (popupInfo) popupInfo.textContent = videos[index].title;

  popup.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  if (popup) {
    popup.classList.remove('show-info');
    void popup.offsetWidth;
    popup.classList.add('show-info');
  }

  const playPromise = popupVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      popupVideo.controls = true;
    });
  }
}

export function closeVideoPopup() {
  const popup = document.getElementById('video-popup');
  const video = document.getElementById('popup-video');

  if (popup && video) {
    video.pause();
    video.currentTime = 0;
    video.controls = false;
    popup.style.display = 'none';
    document.body.style.overflow = '';
    popup.classList.remove('show-info');
  }
}