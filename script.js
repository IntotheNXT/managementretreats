const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const tijnImage = document.querySelector('img[alt="Tijn Akersloot aan het strand in Zandvoort"]');
if (tijnImage) {
  tijnImage.src = 'assets/images/tijnakersloot-interieur-dark.png';
  tijnImage.alt = 'Interieur van Tijn Akersloot in Zandvoort';
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
