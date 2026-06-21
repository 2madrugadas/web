import { buildNavbar } from './components/navbar.js';
import {
  getPhotos, addPhoto, deletePhoto,
  getVideos, addVideo, deleteVideo,
  getEssays, addEssay, deleteEssay,
  initializeFromGitHub
} from './storage.js';
import { setGitHubToken, testGitHubToken } from './github-api.js';

document.addEventListener('DOMContentLoaded', () => {
  buildNavbar({ showLogoutButton: true, showLoginButton: false, isAdminPage: true });

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('authToken');
      window.location.href = 'index.html';
    });
  }

  initGitHubConfig();
  initTabs();
  initPhotoForm();
  initVideoForm();
  initEssayForm();
});

async function initGitHubConfig() {
  const tokenInput = document.getElementById('github-token');
  const saveTokenBtn = document.getElementById('save-token-btn');
  const tokenStatus = document.getElementById('token-status');
  const tokenToggle = document.getElementById('token-toggle');
  const eyeIcon = tokenToggle?.querySelector('.eye-icon');

  if (!tokenInput || !saveTokenBtn || !tokenStatus) return;

  const savedToken = localStorage.getItem('githubToken');
  if (savedToken) {
    tokenInput.value = savedToken;
    const isValid = await testGitHubToken(savedToken);
    tokenStatus.textContent = isValid ? 'Token configurado correctamente' : 'Token inválido';
    tokenStatus.className = isValid ? 'success' : 'error';
  }

  if (tokenToggle && eyeIcon) {
    tokenToggle.addEventListener('click', () => {
      const type = tokenInput.getAttribute('type') === 'password' ? 'text' : 'password';
      tokenInput.setAttribute('type', type);
      
      if (type === 'password') {
        eyeIcon.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        `;
      } else {
        eyeIcon.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 5.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
      }
    });
  }

  saveTokenBtn.addEventListener('click', async () => {
    const token = tokenInput.value.trim();
    if (!token) {
      tokenStatus.textContent = 'Por favor ingresa un token';
      tokenStatus.className = 'error';
      return;
    }

    const isValid = await testGitHubToken(token);
    if (isValid) {
      setGitHubToken(token);
      tokenStatus.textContent = 'Token guardado correctamente';
      tokenStatus.className = 'success';
      await initializeFromGitHub();
      renderPhotosList();
      renderVideosList();
      renderEssaysList();
    } else {
      tokenStatus.textContent = 'Token inválido';
      tokenStatus.className = 'error';
    }
  });
}

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`${tab}-tab`).classList.add('active');

      if (tab === 'photos') renderPhotosList();
      if (tab === 'videos') renderVideosList();
      if (tab === 'essays') renderEssaysList();
    });
  });

  const activeTab = document.querySelector('.tab-btn.active');
  if (activeTab) {
    const tab = activeTab.dataset.tab;
    if (tab === 'photos') renderPhotosList();
    if (tab === 'videos') renderVideosList();
    if (tab === 'essays') renderEssaysList();
  }
}

async function initPhotoForm() {
  const form = document.getElementById('photo-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const photo = {
      id: Date.now().toString(),
      title: form.title.value,
      date: form.date.value,
      link: form.link.value,
      description: form.description.value
    };

    await addPhoto(photo);
    form.reset();
    await renderPhotosList();
  });
}

function renderPhotosList() {
  const list = document.getElementById('photos-list');
  if (!list) return;

  const photos = getPhotos();

  if (photos.length === 0) {
    list.innerHTML = '<p style="color: var(--muted); text-align: center; font-family: \'JMH Typewriter\', monospace;">No hay fotos</p>';
    return;
  }

  list.innerHTML = photos.map(photo => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-title">${photo.title}</div>
        <div class="admin-item-date">${formatDate(photo.date)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="delete-btn" onclick="window.deletePhoto('${photo.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

async function initVideoForm() {
  const form = document.getElementById('video-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const video = {
      id: Date.now().toString(),
      title: form.title.value,
      date: form.date.value,
      link: form.link.value,
      description: form.description.value
    };

    await addVideo(video);
    form.reset();
    await renderVideosList();
  });
}

function renderVideosList() {
  const list = document.getElementById('videos-list');
  if (!list) return;

  const videos = getVideos();

  if (videos.length === 0) {
    list.innerHTML = '<p style="color: var(--muted); text-align: center; font-family: \'JMH Typewriter\', monospace;">No hay videos</p>';
    return;
  }

  list.innerHTML = videos.map(video => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-title">${video.title}</div>
        <div class="admin-item-date">${formatDate(video.date)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="delete-btn" onclick="window.deleteVideo('${video.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

async function initEssayForm() {
  const form = document.getElementById('essay-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const essay = {
      id: Date.now().toString(),
      title: form.title.value,
      date: form.date.value,
      content: form.content.value
    };

    await addEssay(essay);
    form.reset();
    await renderEssaysList();
  });
}

function renderEssaysList() {
  const list = document.getElementById('essays-list');
  if (!list) return;

  const essays = getEssays();

  if (essays.length === 0) {
    list.innerHTML = '<p style="color: var(--muted); text-align: center; font-family: \'JMH Typewriter\', monospace;">No hay ensayos</p>';
    return;
  }

  list.innerHTML = essays.map(essay => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-title">${essay.title}</div>
        <div class="admin-item-date">${formatDate(essay.date)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="delete-btn" onclick="window.deleteEssay('${essay.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(2);
  return `${dd}-${mm}-${yy}`;
}

window.deletePhoto = async (id) => {
  if (confirm('¿Eliminar esta foto?')) {
    await deletePhoto(id);
    await renderPhotosList();
  }
};

window.deleteVideo = async (id) => {
  if (confirm('¿Eliminar este video?')) {
    await deleteVideo(id);
    await renderVideosList();
  }
};

window.deleteEssay = async (id) => {
  if (confirm('¿Eliminar este ensayo?')) {
    await deleteEssay(id);
    await renderEssaysList();
  }
};
