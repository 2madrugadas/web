import { getEssays, initializeFromGitHub } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initializeFromGitHub();
  renderEssays();
  initEssayPopup();
});

function renderEssays() {
  const gallery = document.getElementById('essays-gallery');
  if (!gallery) return;

  const essays = getEssays();

  if (essays.length === 0) {
    gallery.innerHTML = '<p style="color: var(--muted); text-align: center; grid-column: 1 / -1; font-family: \'JMH Typewriter\', monospace;">No hay ensayos</p>';
    return;
  }

  gallery.innerHTML = essays.map(essay => `
    <a href="#" class="grid-item essay-item" data-id="${essay.id}">
      <h3>${essay.title}</h3>
      <div class="card-meta">${formatDate(essay.date)}</div>
    </a>
  `).join('');

  initEssayClickHandlers();
}

function initEssayClickHandlers() {
  const essayItems = document.querySelectorAll('.essay-item');
  essayItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const essayId = item.getAttribute('data-id');
      const essays = getEssays();
      const essay = essays.find(e => e.id === essayId);
      if (essay && window.openEssayPopup) {
        window.openEssayPopup(essayId, essay.title);
        loadEssayContent(essay);
      }
    });
  });
}

function loadEssayContent(essay) {
  const essayBody = document.getElementById('essay-body');
  if (!essayBody) return;

  const paragraphs = essay.content.split('\n').filter(p => p.trim());
  essayBody.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
}

function initEssayPopup() {
  const popup = document.getElementById('essay-popup');
  if (!popup) return;

  popup.addEventListener('click', (e) => {
    if (e.target === popup && window.closeEssayPopup) {
      window.closeEssayPopup();
    }
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(2);
  return `${dd}-${mm}-${yy}`;
}
