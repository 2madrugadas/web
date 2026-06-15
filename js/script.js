let currentPhotoIndex = 0;
let photos = [];
let currentVideoIndex = 0;
let videos = [];
document.addEventListener('DOMContentLoaded', function() {
  initLazyLoading();
  setupMediaHover();
  
  if (document.querySelector('#photo-gallery')) {
    initPhotoGallery();
  }
  
  if (document.querySelector('#video-gallery')) {
    initVideoGallery();
  }
  
  setupGlobalEventListeners();
});

function initLazyLoading() {
  const lazyMedia = document.querySelectorAll('img[data-src], video source[data-src]');
  
  const lazyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        if (element.tagName === 'IMG') {
          element.src = element.dataset.src;
          element.onload = () => {
            element.classList.add('loaded');
            element.removeAttribute('data-src');
          };
        }
        
        if (element.tagName === 'SOURCE') {
          const video = element.parentElement;
          element.src = element.dataset.src;
          video.load();
          video.classList.add('loaded');
          element.removeAttribute('data-src');
        }
        
        observer.unobserve(element);
      }
    });
  }, {
    rootMargin: '200px',
    threshold: 0.01
  });

  lazyMedia.forEach(media => {
    lazyObserver.observe(media);
  });
}

function initPhotoGallery() {
  const photoItems = document.querySelectorAll('.photo-item');
  photos = Array.from(photoItems).map(item => ({
    element: item,
    img: item.querySelector('img'),
    title: item.querySelector('h3')?.textContent || '',
    link: item.getAttribute('href')
  }));

  photoItems.forEach((item, index) => {
    if (!item.getAttribute('href')) {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openPhotoPopup(index);
      });
    }
    
    item.addEventListener('touchstart', () => {
      item.classList.add('hover-effect');
    }, { passive: true });
    
    item.addEventListener('touchend', () => {
      setTimeout(() => item.classList.remove('hover-effect'), 200);
    }, { passive: true });
  });
}

function openPhotoPopup(index) {
  currentPhotoIndex = index;
  const popup = document.getElementById('photo-popup');
  const popupImg = document.getElementById('popup-photo');
  const popupInfo = document.querySelector('.photo-info');
  
  if (!popup || !popupImg) return;

  popupImg.style.opacity = 0;
  setTimeout(() => {
    popupImg.src = photos[index].img.src || photos[index].img.dataset.src;
    if (popupInfo) popupInfo.textContent = photos[index].title;
    popupImg.style.opacity = '';
  }, 150);

  popup.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function navigatePhotos(direction) {
  currentPhotoIndex = (currentPhotoIndex + direction + photos.length) % photos.length;
  openPhotoPopup(currentPhotoIndex);
}

function closePhotoPopup() {
  const popup = document.getElementById('photo-popup');
  if (popup) {
    popup.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function initVideoGallery() {
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
  });
}

function openVideoPopup(index) {
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
  
  const playPromise = popupVideo.play();
  
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      popupVideo.controls = true;
    });
  }
}

function closeVideoPopup() {
  const popup = document.getElementById('video-popup');
  const video = document.getElementById('popup-video');
  
  if (popup && video) {
    video.pause();
    video.currentTime = 0;
    video.controls = false;
    popup.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function setupMediaHover() {
  document.querySelectorAll('.video-item video').forEach(video => {
    video.addEventListener('mouseenter', function() {
      this.play().catch(e => console.log("Auto-play prevented:", e));
    });
    
    video.addEventListener('mouseleave', function() {
      this.pause();
      this.currentTime = 0;
    });
  });
}

function setupGlobalEventListeners() {
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

function setupContentGrid() {
  document.querySelectorAll('.grid-item').forEach(item => {
    const title = item.querySelector('img')?.alt || '';
    item.setAttribute('data-title', title);
  });
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
if (document.querySelector('.grid')) {
  setupContentGrid();
}

if ('scrollBehavior' in document.documentElement.style === false) {
  import('smoothscroll-polyfill').then(module => {
    module.polyfill();
  });
}