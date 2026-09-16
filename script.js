const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const currentLang = (document.documentElement.lang || 'nl').toLowerCase().startsWith('en') ? 'en' : 'nl';

if (mainNav && !mainNav.querySelector('.lang-switch')) {
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

const facilitatorSection = document.getElementById('facilitators');
if (facilitatorSection && !document.querySelector('link[data-facilitator-styles]')) {
  const facilitatorStyles = document.createElement('link');
  facilitatorStyles.rel = 'stylesheet';
  facilitatorStyles.href = currentLang === 'en' ? '../facilitators.css' : 'facilitators.css';
  facilitatorStyles.dataset.facilitatorStyles = 'true';
  document.head.appendChild(facilitatorStyles);
}

if (facilitatorSection && !facilitatorSection.querySelector('.facilitator-profiles')) {
  const copy = {
    nl: {
      eyebrow: 'Een eerste selectie',
      heading: 'Vind de juiste facilitator.',
      intro: 'We werken met ervaren begeleiders en inhoudelijke experts voor managementteams. Niet iedereen past bij ieder vraagstuk. Hieronder zie je een eerste selectie; de match volgt uit het onderwerp, het team en de gewenste stijl van begeleiden.'
    },
    en: {
      eyebrow: 'A first selection',
      heading: 'Find the right facilitator.',
      intro: 'We work with experienced facilitators and subject-matter experts for management teams. Not everyone fits every challenge. Below is a first selection; the right match depends on the topic, the team and the facilitation style required.'
    }
  }[currentLang];

  const eyebrow = facilitatorSection.querySelector('.eyebrow');
  const heading = facilitatorSection.querySelector('h2');
  const intro = facilitatorSection.querySelector('.facilitator-copy > p');
  if (eyebrow) eyebrow.textContent = copy.eyebrow;
  if (heading) heading.textContent = copy.heading;
  if (intro) intro.textContent = copy.intro;

  const profiles = {
    nl: [
      ['fons-trompenaars','Fons Trompenaars','Cultuur, dilemma’s & internationaal leiderschap','Internationaal expert in cultuur en leiderschap, met ruim drie decennia ervaring in het begeleiden van leiders en organisaties.','Cultuur & waarden · Dilemma thinking · Global leadership'],
      ['bas-kemme','Bas Kemme','Strategie, innovatie & aanpassingsvermogen','Helpt managementteams strategische richting, innovatiekracht en organisatieverandering te verbinden aan concrete performance.','Future-back strategy · Innovation · Culture transformation · Bureaucracy busting'],
      ['behdad-shahsavari','Behdad Shahsavari','AI, strategie & transformatie','Combineert senior ervaring in strategieconsulting, industrie, ventures en digitale transformatie.','AI strategy · Corporate strategy · Digital transformation · Operating models'],
      ['marijke-shahsavari-jansen','Marijke Shahsavari-Jansen','Strategie, samenwerking & stakeholderfacilitatie','Begeleidt leiders en teams bij strategieontwikkeling, samenwerking en complexe vraagstukken met meerdere stakeholders.','Strategy · Collaboration · Stakeholder alignment · Team facilitation'],
      ['niels-janssen','Niels Janssen','Strategie, facilitatie & executive coaching','Coacht al meer dan 15 jaar individuen en teams en combineert dat met senior facilitatie en de hoogste UK-accreditatie als facilitator.','Strategy development · Breakthrough sessions · Executive coaching · Facilitation'],
      ['genieke-hertoghs','Genieke Hertoghs','Leiderschap, invloed & gedragsverandering','Maakt gedragswetenschap praktisch en helpt leiders draagvlak, eigenaarschap en intrinsieke motivatie versterken.','Behavioural change · Influence · Ownership · Leadership'],
      ['robbert-wolff','Robbert Wolff','Leiderschapsvaardigheden & moeilijke gesprekken','Gespecialiseerd in praktische leiderschapsvaardigheden, omgaan met weerstand en het geven en ontvangen van feedback.','Leadership skills · Feedback · Resistance · Difficult conversations'],
      ['sabine-de-rooij','Sabine de Rooij','Werkplekwelzijn, mentale gezondheid & preventie','Bedrijfspsycholoog en coach met ruim 20 jaar ervaring in het creëren van veilige, gezonde werkomgevingen en het voorkomen van langdurige uitval.','Burn-outpreventie · Veerkracht · Psychologische veiligheid · Workplace wellbeing'],
      ['nemos-kostoulas','Nemos Kostoulas','Productinnovatie & digitale ventures','Helpt organisaties ideeën vertalen naar gevalideerde digitale producten en nieuwe ventures, van discovery tot product-market fit.','Product innovation · Digital ventures · Product strategy · Product-market fit']
    ],
    en: [
      ['fons-trompenaars','Fons Trompenaars','Culture, dilemmas & global leadership','An internationally recognised expert in culture and leadership with more than three decades of experience advising leaders and organisations.','Culture & values · Dilemma thinking · Global leadership'],
      ['bas-kemme','Bas Kemme','Strategy, innovation & organisational adaptability','Helps management teams connect strategic direction, innovation and organisational change to measurable performance.','Future-back strategy · Innovation · Culture transformation · Bureaucracy busting'],
      ['behdad-shahsavari','Behdad Shahsavari','AI, strategy & transformation','Combines senior experience in strategy consulting, industry, ventures and digital transformation.','AI strategy · Corporate strategy · Digital transformation · Operating models'],
      ['marijke-shahsavari-jansen','Marijke Shahsavari-Jansen','Strategy, collaboration & stakeholder facilitation','Helps leaders and teams develop strategy, strengthen collaboration and navigate complex multi-stakeholder challenges.','Strategy · Collaboration · Stakeholder alignment · Team facilitation'],
      ['niels-janssen','Niels Janssen','Strategy, facilitation & executive coaching','Has coached individuals and teams for more than 15 years, combining this with senior facilitation and the highest UK facilitator accreditation.','Strategy development · Breakthrough sessions · Executive coaching · Facilitation'],
      ['genieke-hertoghs','Genieke Hertoghs','Leadership, influence & behavioural change','Turns behavioural science into practical tools that help leaders build buy-in, ownership and intrinsic motivation.','Behavioural change · Influence · Ownership · Leadership'],
      ['robbert-wolff','Robbert Wolff','Leadership skills & difficult conversations','Specialises in practical leadership skills, handling resistance, and giving and receiving feedback, particularly in expert environments.','Leadership skills · Feedback · Resistance · Difficult conversations'],
      ['sabine-de-rooij','Sabine de Rooij','Workplace wellbeing, mental health & prevention','Business psychologist and coach with more than 20 years of experience creating safe, healthy workplaces and helping prevent long-term absence.','Burnout prevention · Resilience · Psychological safety · Workplace wellbeing'],
      ['nemos-kostoulas','Nemos Kostoulas','Product innovation & digital ventures','Helps organisations turn ideas into validated digital products and new ventures, from discovery to product-market fit.','Product innovation · Digital ventures · Product strategy · Product-market fit']
    ]
  }[currentLang];

  const grid = document.createElement('div');
  grid.className = 'facilitator-profiles';

  profiles.forEach(([slug, name, role, desc, best]) => {
    const card = document.createElement('article');
    card.className = 'facilitator-card';
    card.innerHTML = `
      <div class="facilitator-photo facilitator-photo--${slug}" role="img" aria-label="${name}"></div>
      <div class="facilitator-card-body">
        <h3>${name}</h3>
        <p class="facilitator-role">${role}</p>
        <p class="facilitator-desc">${desc}</p>
        <p class="facilitator-best"><strong>Best for</strong><span>${best}</span></p>
      </div>`;
    grid.appendChild(card);
  });

  const container = facilitatorSection.querySelector('.container');
  if (container) container.appendChild(grid);
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
