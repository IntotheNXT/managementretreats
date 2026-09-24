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

  const makeLangLink = (href, label, flag, lang) => {
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('lang', lang);
    link.style.display = 'inline-flex';
    link.style.flexDirection = 'column';
    link.style.alignItems = 'center';
    link.style.gap = '1px';
    link.style.lineHeight = '1.05';
    link.style.textDecoration = 'none';

    const labelEl = document.createElement('span');
    labelEl.textContent = label;

    const flagEl = document.createElement('span');
    flagEl.textContent = flag;
    flagEl.setAttribute('aria-hidden', 'true');
    flagEl.style.fontSize = '0.95rem';
    flagEl.style.lineHeight = '1';

    link.append(labelEl, flagEl);
    return link;
  };

  const nlLink = makeLangLink('/nl/', 'NL', '🇳🇱', 'nl');

  const separator = document.createElement('span');
  separator.textContent = '/';
  separator.setAttribute('aria-hidden', 'true');
  separator.style.opacity = '0.4';
  separator.style.alignSelf = 'flex-start';
  separator.style.marginTop = '0.05rem';

  const enLink = makeLangLink('/', 'EN', '🇬🇧', 'en');

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
  facilitatorStyles.href = currentLang === 'en' ? 'facilitators.css' : '../facilitators.css';
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
      ['fons-trompenaars','Fons Trompenaars','Cultuur, dilemma’s & internationaal leiderschap','Internationaal expert in cultuur en leiderschap, met ruim drie decennia ervaring in het begeleiden van leiders en organisaties.','Cultuur & waarden · Dilemma thinking · Global leadership',['culture-change-organisation']],
      ['bas-kemme','Bas Kemme','Strategie, innovatie & aanpassingsvermogen','Helpt managementteams strategische richting, innovatiekracht en organisatieverandering te verbinden aan concrete performance.','Future-back strategy · Innovation · Culture transformation · Bureaucracy busting',['strategy-execution','innovation-growth','ai-emerging-technology','commercial-excellence','culture-change-organisation','leadership-management','teams-collaboration-wellbeing','communication-influence']],
      ['behdad-shahsavari','Behdad Shahsavari','AI, strategie & transformatie','Combineert senior ervaring in strategieconsulting, industrie, ventures en digitale transformatie.','AI strategy · Corporate strategy · Digital transformation · Operating models',['strategy-execution','innovation-growth','ai-emerging-technology','commercial-excellence','culture-change-organisation']],
      ['marijke-shahsavari-jansen','Marijke Shahsavari-Jansen','Strategie, samenwerking & stakeholderfacilitatie','Begeleidt leiders en teams bij strategieontwikkeling, samenwerking en complexe vraagstukken met meerdere stakeholders.','Strategy · Collaboration · Stakeholder alignment · Team facilitation',['teams-collaboration-wellbeing','communication-influence']],
      ['niels-janssen','Niels Janssen','Strategie, facilitatie & executive coaching','Coacht al meer dan 15 jaar individuen en teams en combineert dat met senior facilitatie en de hoogste UK-accreditatie als facilitator.','Strategy development · Breakthrough sessions · Executive coaching · Facilitation',['strategy-execution','leadership-management','teams-collaboration-wellbeing','communication-influence']],
      ['genieke-hertoghs','Genieke Hertoghs','Leiderschap, invloed & gedragsverandering','Maakt gedragswetenschap praktisch en helpt leiders draagvlak, eigenaarschap en intrinsieke motivatie versterken.','Behavioural change · Influence · Ownership · Leadership',['culture-change-organisation','teams-collaboration-wellbeing','communication-influence']],
      ['robbert-wolff','Robbert Wolff','Leiderschapsvaardigheden & moeilijke gesprekken','Gespecialiseerd in praktische leiderschapsvaardigheden, omgaan met weerstand en het geven en ontvangen van feedback.','Leadership skills · Feedback · Resistance · Difficult conversations',['leadership-management','teams-collaboration-wellbeing','communication-influence']],
      ['sabine-de-rooij','Sabine de Rooij','Werkplekwelzijn, mentale gezondheid & preventie','Bedrijfspsycholoog en coach met ruim 20 jaar ervaring in het creëren van veilige, gezonde werkomgevingen en het voorkomen van langdurige uitval.','Burn-outpreventie · Veerkracht · Psychologische veiligheid · Workplace wellbeing',['teams-collaboration-wellbeing']],
      ['nemos-kostoulas','Nemos Kostoulas','Productinnovatie & digitale ventures','Helpt organisaties ideeën vertalen naar gevalideerde digitale producten en nieuwe ventures, van discovery tot product-market fit.','Product innovation · Digital ventures · Product strategy · Product-market fit',['innovation-growth']],
      ['olivier-rikken','Dr. Olivier Rikken','AI, emerging technology & digitale weerbaarheid','Olivier helpt organisaties zich voorbereiden op de impact van AI, quantum computing, blockchain en andere opkomende technologieën, met bijzondere aandacht voor governance, weerbaarheid en business continuity.','AI strategy · Future tech readiness · Digital resilience · Governance · Business continuity',['ai-emerging-technology']]
    ],
    en: [
      ['fons-trompenaars','Fons Trompenaars','Culture, dilemmas & global leadership','An internationally recognised expert in culture and leadership with more than three decades of experience advising leaders and organisations.','Culture & values · Dilemma thinking · Global leadership',['culture-change-organisation']],
      ['bas-kemme','Bas Kemme','Strategy, innovation & organisational adaptability','Helps management teams connect strategic direction, innovation and organisational change to measurable performance.','Future-back strategy · Innovation · Culture transformation · Bureaucracy busting',['strategy-execution','innovation-growth','ai-emerging-technology','commercial-excellence','culture-change-organisation','leadership-management','teams-collaboration-wellbeing','communication-influence']],
      ['behdad-shahsavari','Behdad Shahsavari','AI, strategy & transformation','Combines senior experience in strategy consulting, industry, ventures and digital transformation.','AI strategy · Corporate strategy · Digital transformation · Operating models',['strategy-execution','innovation-growth','ai-emerging-technology','commercial-excellence','culture-change-organisation']],
      ['marijke-shahsavari-jansen','Marijke Shahsavari-Jansen','Strategy, collaboration & stakeholder facilitation','Helps leaders and teams develop strategy, strengthen collaboration and navigate complex multi-stakeholder challenges.','Strategy · Collaboration · Stakeholder alignment · Team facilitation',['teams-collaboration-wellbeing','communication-influence']],
      ['niels-janssen','Niels Janssen','Strategy, facilitation & executive coaching','Has coached individuals and teams for more than 15 years, combining this with senior facilitation and the highest UK facilitator accreditation.','Strategy development · Breakthrough sessions · Executive coaching · Facilitation',['strategy-execution','leadership-management','teams-collaboration-wellbeing','communication-influence']],
      ['genieke-hertoghs','Genieke Hertoghs','Leadership, influence & behavioural change','Turns behavioural science into practical tools that help leaders build buy-in, ownership and intrinsic motivation.','Behavioural change · Influence · Ownership · Leadership',['culture-change-organisation','teams-collaboration-wellbeing','communication-influence']],
      ['robbert-wolff','Robbert Wolff','Leadership skills & difficult conversations','Specialises in practical leadership skills, handling resistance, and giving and receiving feedback, particularly in expert environments.','Leadership skills · Feedback · Resistance · Difficult conversations',['leadership-management','teams-collaboration-wellbeing','communication-influence']],
      ['sabine-de-rooij','Sabine de Rooij','Workplace wellbeing, mental health & prevention','Business psychologist and coach with more than 20 years of experience creating safe, healthy workplaces and helping prevent long-term absence.','Burnout prevention · Resilience · Psychological safety · Workplace wellbeing',['teams-collaboration-wellbeing']],
      ['nemos-kostoulas','Nemos Kostoulas','Product innovation & digital ventures','Helps organisations turn ideas into validated digital products and new ventures, from discovery to product-market fit.','Product innovation · Digital ventures · Product strategy · Product-market fit',['innovation-growth']],
      ['olivier-rikken','Dr. Olivier Rikken','AI, emerging technology & digital resilience','Olivier helps organisations prepare for the impact of AI, quantum computing, blockchain and other emerging technologies, with a strong focus on governance, resilience and business continuity.','AI strategy · Future tech readiness · Digital resilience · Governance · Business continuity',['ai-emerging-technology']]
    ]
  }[currentLang];

  const grid = document.createElement('div');
  grid.className = 'facilitator-profiles';

  profiles.forEach(([slug, name, role, desc, best, topics]) => {
    const card = document.createElement('article');
    card.className = 'facilitator-card';
    card.dataset.topics = topics.join(' ');
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

  const filterChips = facilitatorSection.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      filterChips.forEach(item => {
        const isActive = item === chip;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      grid.querySelectorAll('.facilitator-card').forEach(card => {
        card.hidden = filter !== 'all' && !card.dataset.topics.split(' ').includes(filter);
      });
    });
  });
}


const capabilityCatalog = document.getElementById('capability-catalog');

if (capabilityCatalog) {
  const catalogUrl = capabilityCatalog.dataset.catalog;
  const labels = currentLang === 'nl'
    ? {
        showAll: 'Toon alles',
        facilitators: 'Facilitators',
        allCapabilities: 'Alle capabilities',
        module: 'module',
        modules: 'modules',
        emptyGroup: 'Er zijn nog geen modules beschikbaar in deze groep.',
        emptyArea: 'Er zijn nog geen modules beschikbaar in dit gebied.',
        loadError: 'Het capability menu kon niet worden geladen. Ververs de pagina.'
      }
    : {
        showAll: 'Show all',
        facilitators: 'Facilitators',
        allCapabilities: 'All capabilities',
        module: 'module',
        modules: 'modules',
        emptyGroup: 'No modules are available in this group yet.',
        emptyArea: 'No modules are available in this capability area yet.',
        loadError: 'The capability menu could not be loaded. Please refresh the page.'
      };

  const moduleCount = count => `${count} ${count === 1 ? labels.module : labels.modules}`;

  fetch(catalogUrl, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`Capability catalogue could not be loaded (${response.status})`);
      return response.json();
    })
    .then(catalog => {
      let selectedCategory = catalog.categories[0];

      const questionHtml = catalog.questions.map((group, index) => `
        <article class="catalog-question">
          <span class="catalog-question-label">${group.question}</span>
          <div class="catalog-category-list">
            ${group.categories.map(category => `<button type="button" class="catalog-category-btn" data-category="${category}">${category}</button>`).join('')}
            ${group.categories.length > 1 ? `<button type="button" class="catalog-category-btn catalog-group-show-all" data-category="Group:${index}">${labels.showAll}</button>` : ''}
          </div>
        </article>`).join('');

      capabilityCatalog.innerHTML = `
        <div class="catalog-show-all-row">
          <button type="button" class="catalog-category-btn" data-category="All">${labels.showAll}</button>
        </div>
        <div class="catalog-question-grid">${questionHtml}</div>
        <div class="catalog-result-head">
          <h3 id="catalog-result-title"></h3>
          <span class="catalog-count" id="catalog-count"></span>
        </div>
        <div class="catalog-modules" id="catalog-modules"></div>`;

      const resultTitle = capabilityCatalog.querySelector('#catalog-result-title');
      const count = capabilityCatalog.querySelector('#catalog-count');
      const modulesEl = capabilityCatalog.querySelector('#catalog-modules');
      const categoryButtons = [...capabilityCatalog.querySelectorAll('.catalog-category-btn')];

      const moduleCard = module => {
        const facilitators = (module.facilitators || []).length
          ? `<div class="catalog-facilitators"><strong>${labels.facilitators}</strong> ${module.facilitators.join(' · ')}</div>`
          : '';
        return `<article class="catalog-module"><h4>${module.title}</h4><p>${module.description}</p>${facilitators}</article>`;
      };

      function renderGroups(categories, matches) {
        modulesEl.classList.add('show-all');
        modulesEl.innerHTML = categories.map(category => {
          const group = matches.filter(module => module.category === category);
          if (!group.length) return '';
          return `<section class="catalog-all-group"><h4 class="catalog-all-group-title">${category}</h4><div class="catalog-all-grid">${group.map(moduleCard).join('')}</div></section>`;
        }).join('') || `<div class="catalog-empty">${labels.emptyGroup}</div>`;
      }

      function render() {
        categoryButtons.forEach(button => button.classList.toggle('is-active', button.dataset.category === selectedCategory));

        if (selectedCategory === 'All') {
          resultTitle.textContent = labels.allCapabilities;
          count.textContent = moduleCount(catalog.modules.length);
          renderGroups(catalog.categories, catalog.modules);
          return;
        }

        if (selectedCategory.startsWith('Group:')) {
          const groupIndex = Number(selectedCategory.split(':')[1]);
          const questionGroup = catalog.questions[groupIndex];
          const matches = catalog.modules.filter(module => questionGroup.categories.includes(module.category));
          resultTitle.textContent = questionGroup.question;
          count.textContent = moduleCount(matches.length);
          renderGroups(questionGroup.categories, matches);
          return;
        }

        const matches = catalog.modules.filter(module => module.category === selectedCategory);
        resultTitle.textContent = selectedCategory;
        count.textContent = moduleCount(matches.length);
        modulesEl.classList.remove('show-all');
        modulesEl.innerHTML = matches.length
          ? matches.map(moduleCard).join('')
          : `<div class="catalog-empty">${labels.emptyArea}</div>`;
      }

      categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
          selectedCategory = button.dataset.category;
          render();
        });
      });

      render();
    })
    .catch(error => {
      console.error(error);
      capabilityCatalog.innerHTML = `<p class="catalog-loading">${labels.loadError}</p>`;
    });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
