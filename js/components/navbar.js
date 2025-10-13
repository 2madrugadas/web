export function buildNavbar({
  title = '2madrugadas',
  links = [
    { href: 'videos.html', label: 'Videos' },
    { href: 'fotos.html', label: 'Fotos' },
    { href: 'ensayos.html', label: 'Ensayos' },
  ],
} = {}) {
  let header = document.querySelector('header');
  if (!header) {
    header = document.createElement('header');
    document.body.insertAdjacentElement('afterbegin', header);
  }

  const navHtml = `
    <h1><a href="index.html">${title}</a></h1>
    <nav>
      ${links.map(l => `<a href="${l.href}" class="nav-link">${l.label}</a>`).join('\n')}
    </nav>
  `;
  header.innerHTML = navHtml;
  }