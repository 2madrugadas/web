const VALID_EMAIL = 'pablourra26070@gmail.com';
const VALID_PASSWORD = '2madrugadas';

export function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const token = generateToken();
      localStorage.setItem('authToken', token);
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'admin.html';
    } else {
      alert('Credenciales incorrectas');
    }
  });

  const passwordToggle = document.getElementById('password-toggle');
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eye-icon');
  
  if (passwordToggle && passwordInput && eyeIcon) {
    passwordToggle.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
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
}

function generateToken() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
});
