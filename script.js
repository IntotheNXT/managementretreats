const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (mainNav && !mainNav.querySelector('.lang-switch')) {
  const currentLang = (document.documentElement.lang || 'nl').toLowerCase().startsWith('en') ? 'en' : 'nl';
  const langSwitch = document.createElement('span');
  langSwitch.className = 'lang-switch';
  langSwitch.setAttribute('aria-label', currentLang === 'en' ? 'Language' : 'Taal');
  langSwitch.style.display = 'inline-flex';
  langSwitch.style.alignItems = 'center';
  langSwitch.style.gap = '0.35rem';
  langSwitch.style.whiteSpace = 'nowrap';
  langSwitch.style.fontSize = '0.78rem';
  langSwitch.style.letterSpacing = '0.08em';

  const nlLink = document.createElement('a');
  nlLink.href = currentLang === 'en' ? '../' : './';
  nlLink.textContent = 'NL';
  nlLink.setAttribute('lang', 'nl');

  const separator = document.createElement('span');
  separator.textContent = '/';
  separator.setAttribute('aria-hidden', 'true');
  separator.style.opacity = '0.4';

  const enLink = document.createElement('a');
  enLink.href = currentLang === 'en' ? './' : 'en/';
  enLink.textContent = 'EN';
  enLink.setAttribute('lang', 'en');

  const activeLink = currentLang === 'en' ? enLink : nlLink;
  const inactiveLink = currentLang === 'en' ? nlLink : enLink;
  activeLink.style.fontWeight = '700';
  activeLink.setAttribute('aria-current', 'page');
  inactiveLink.style.opacity = '0.55';

  langSwitch.append(nlLink, separator, enLink);

  const cta = mainNav.querySelector('.btn-small');
  if (cta) mainNav.insertBefore(langSwitch, cta);
  else mainNav.appendChild(langSwitch);
}

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

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
