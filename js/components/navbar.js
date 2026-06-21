export function buildNavbar({
  title = '2madrugadas',
  links = [
    { href: 'videos.html', label: 'Videos' },
    { href: 'fotos.html', label: 'Fotos' },
    { href: 'ensayos.html', label: 'Ensayos' },
  ],
  showLoginButton = true,
  showLogoutButton = false,
  isAdminPage = false,
} = {}) {
  let header = document.querySelector('header');
  if (!header) {
    header = document.createElement('header');
    document.body.insertAdjacentElement('afterbegin', header);
  }

  const hasToken = localStorage.getItem('authToken');
  let extraButtonHtml = '';

  if (showLogoutButton) {
    extraButtonHtml = `<a href="#" id="logout-btn" class="nav-link logout-btn">Cerrar sesión</a>`;
  } else if (hasToken && !isAdminPage) {
    extraButtonHtml = `<a href="admin.html" class="nav-link login-btn">+</a>`;
  } else if (showLoginButton) {
    extraButtonHtml = `<a href="login.html" class="nav-link login-btn">+</a>`;
  }

  const linksHtml = isAdminPage ? '' : links.map(l => `<a href="${l.href}" class="nav-link">${l.label}</a>`).join('\n');

  const navHtml = `
    <h1><a href="index.html">${title}</a></h1>
    <nav>
      ${linksHtml}
      ${extraButtonHtml}
    </nav>
  `;
  header.innerHTML = navHtml;
  }