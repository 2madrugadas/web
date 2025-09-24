export function initLazyLoading() {
  const lazyMedia = document.querySelectorAll('img[data-src], video source[data-src]');

  const lazyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;

      if (element.tagName === 'IMG') {
        element.src = element.dataset.src;
        element.onload = () => {
          element.classList.add('loaded');
          element.removeAttribute('data-src');
          element.closest('.photo-item, .video-item, .grid-item, .home-card')?.classList.add('revealed');
        };
      }

      if (element.tagName === 'SOURCE') {
        const video = element.parentElement;
        element.src = element.dataset.src;
        video.load();
        video.classList.add('loaded');
        element.removeAttribute('data-src');
        video.closest('.video-item')?.classList.add('revealed');
      }

      observer.unobserve(element);
    });
  }, { rootMargin: '200px', threshold: 0.01 });

  lazyMedia.forEach(media => lazyObserver.observe(media));

  const cards = document.querySelectorAll('.photo-item, .video-item, .grid-item, .home-card');
  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '50px', threshold: 0.1 });

  cards.forEach(card => cardObserver.observe(card));
}