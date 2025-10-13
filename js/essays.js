let currentEssayId = null;

export function initEssayGallery() {
  const items = document.querySelectorAll('.essay-item');
  items.forEach(item => {
    const target = item.getAttribute('data-target');
    const source = target ? document.getElementById(target) : null;
    const excerptEl = item.querySelector('.essay-excerpt');
    if (source && excerptEl) {
      const raw = source.textContent || '';
      const trimmed = raw.replace(/\s+/g, ' ').trim();
      const base = trimmed.slice(0, 20);
      excerptEl.textContent = base + '...';
    }

    item.addEventListener('click', (e) => {
      e.preventDefault();
      const title = item.querySelector('h3')?.textContent?.trim() || item.getAttribute('data-title') || 'Ensayo';
      openEssayPopup(target, title);
    });

    item.addEventListener('touchstart', () => {
      item.classList.add('hover-effect');
    }, { passive: true });

    item.addEventListener('touchend', () => {
      setTimeout(() => item.classList.remove('hover-effect'), 300);
    }, { passive: true });
  });
}

export function openEssayPopup(essayId, title = 'Ensayo') {
  currentEssayId = essayId;
  const popup = document.getElementById('essay-popup');
  const bodyEl = document.getElementById('essay-body');
  const titleEl = document.getElementById('essay-title');
  const source = document.getElementById(essayId);
  if (!popup || !bodyEl || !source) return;

  titleEl.textContent = title;
  bodyEl.innerHTML = source.innerHTML;

  popup.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

export function closeEssayPopup() {
  const popup = document.getElementById('essay-popup');
  if (popup) {
    popup.style.display = 'none';
    document.body.style.overflow = '';
  }
}
