export function setupContentGrid() {
  document.querySelectorAll('.grid-item').forEach(item => {
    const title = item.querySelector('img')?.alt || '';
    if (title) item.setAttribute('data-title', title);
    const img = item.querySelector('img');
    if (img) img.classList.add('loaded');
  });
}