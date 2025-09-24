let currentPhotoIndex = 0;
let photos = [];

export function initPhotoGallery() {
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

export function openPhotoPopup(index) {
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
    if (popup) {
      popup.classList.remove('show-info');
      void popup.offsetWidth;
      popup.classList.add('show-info');
    }
  }, 150);

  popup.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

export function navigatePhotos(direction) {
  if (!photos.length) return;
  currentPhotoIndex = (currentPhotoIndex + direction + photos.length) % photos.length;
  openPhotoPopup(currentPhotoIndex);
}

export function closePhotoPopup() {
  const popup = document.getElementById('photo-popup');
  if (popup) {
    popup.style.display = 'none';
    document.body.style.overflow = '';
    popup.classList.remove('show-info');
  }
}