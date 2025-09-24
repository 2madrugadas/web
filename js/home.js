async function fetchJSON(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (e) {
    console.error('Error cargando', url, e);
    return null;
  }
}

function formatDate(dateString) {
  try {
    let d;
    const m = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(dateString || '');
    if (m) {
      const [, y, mo, da] = m;
      d = new Date(Number(y), Number(mo) - 1, Number(da));
    } else {
      d = new Date(dateString);
    }
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(2);
    return `${dd}-${mm}-${yy}`;
  } catch {
    return '';
  }
}

function createCard(post) {
  const a = document.createElement('a');
  a.className = 'home-card';
  a.href = post.url || '#';
  a.innerHTML = `
    <div class="home-card_media">
      <img src="${post.image}" alt="${post.title}" />
    </div>
    <h3 class="home-card_title">${post.title}</h3>
    <div class="home-card_meta mono">${formatDate(post.date)}</div>
  `;
  return a;
}

export async function initHome() {
  const mount = document.getElementById('home-latest');
  if (!mount) return;

  const data = await fetchJSON('assets/data/posts.json');
  const fallback = [
    { title: '...', date: '...', image: 'assets/videos/poster1.jpg', url: 'videos.html' },
    { title: 'Neblina por Pablo Urra', date: '2025-09-17', image: 'assets/fotos/foto1.JPG', url: 'fotos.html' },
    { title: '...', date: '...', image: 'assets/ensayos/placeholder.jpg', url: 'ensayos.html' },
  ];

  const groups = data
    ? [data.videos?.[0], data.photos?.[0], data.essays?.[0]].filter(Boolean)
    : fallback;

  mount.innerHTML = '';
  groups.forEach(p => mount.appendChild(createCard(p)));
}