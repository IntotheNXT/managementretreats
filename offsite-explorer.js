(() => {
  'use strict';

  const root = document.getElementById('offsite-explorer');
  if (!root) return;

  const lang = document.body.dataset.lang === 'nl' ? 'nl' : 'en';
  const content = document.getElementById('explorer-content');
  const live = document.getElementById('explorer-live');
  const progressLabel = document.getElementById('progress-label');
  const progressPercent = document.getElementById('progress-percent');
  const progressBar = document.getElementById('progress-bar');

  const copy = {
    nl: {
      question: 'Vraag', of: 'van', followup: 'Eén korte vervolgvraag', review: 'Controleer jullie antwoorden', proposal: 'Jullie eerste voorstel',
      next: 'Volgende', back: 'Terug', reviewButton: 'Bekijk samenvatting', create: 'Dit klopt, maak het voorstel',
      required: 'Beantwoord deze vraag om verder te gaan.', chooseAtLeast: 'Kies minimaal één optie.',
      maxSelected: maximum => `Kies maximaal ${maximum} opties.`, selected: (count, maximum) => `${count} van maximaal ${maximum} gekozen`,
      loadingErrorTitle: 'De Verkenner kon niet worden geladen', loadingError: 'Probeer de pagina opnieuw te laden. Als het probleem blijft bestaan, neem dan rechtstreeks contact met ons op.',
      occasion: {
        kicker: 'De aanleiding', title: 'Waarom plannen jullie juist nu een offsite?',
        help: 'Beschrijf kort wat er speelt. Feiten en concrete voorbeelden helpen meer dan algemene termen.',
        placeholder: 'Bijvoorbeeld: we hebben een nieuwe strategie, maar te veel prioriteiten en nog geen gedeelde keuzes over wat eerst moet…'
      },
      outcomes: {
        kicker: 'De uitkomst', title: 'Wat moet aan het einde aantoonbaar anders zijn?',
        help: 'Kies maximaal drie uitkomsten die echt prioriteit hebben.'
      },
      themes: {
        kicker: 'Het onderwerp', title: 'Waar moet de offsite inhoudelijk vooral over gaan?',
        help: 'Kies één of twee gebieden. De Verkenner gebruikt dit om de juiste inhoud te selecteren.'
      },
      blockers: {
        kicker: 'Wat houdt jullie tegen?', title: 'Waardoor lukt dit nu nog onvoldoende?',
        help: 'Kies maximaal drie belemmeringen die het meest herkenbaar zijn.'
      },
      participants: {
        kicker: 'De deelnemers', title: 'Wie nemen deel en in welke taal werken jullie?',
        help: 'Dit bepaalt welke inhoud en facilitators passend zijn.',
        audience: 'Type team', size: 'Aantal deelnemers', language: 'Taal van de offsite'
      },
      format: {
        kicker: 'Het format', title: 'Hoeveel tijd willen jullie reserveren?',
        help: 'Kies wat nu het meest waarschijnlijk is. We kunnen dit later nog aanpassen.'
      },
      practical: {
        kicker: 'De praktische context', title: 'Wanneer en waar denken jullie aan?',
        help: 'Een globale indicatie is voldoende. Voeg alleen toe wat al bekend is.',
        timing: 'Gewenste periode', location: 'Plaats of type locatie', notes: 'Nog belangrijk om te weten?',
        locationPlaceholder: 'Bijvoorbeeld: centraal in Nederland of op eigen locatie',
        notesPlaceholder: 'Eventuele randvoorwaarden, gevoeligheden of wensen'
      },
      audiences: {
        'management-teams': 'Managementteam', 'executive-teams': 'Directieteam / ExCo', boards: 'RvC / Raad van Toezicht'
      },
      languages: { nl: 'Nederlands', en: 'Engels' },
      formats: {
        'two-hours': ['Twee uur', 'Gerichte werksessie rond één kernvraag'],
        'half-day': ['Halve dag', 'Verdieping met vertaling naar besluiten'],
        'full-day': ['Hele dag', 'Ruimte voor keuzes, verdieping en acties'],
        'two-days': ['Twee dagen', 'Voor complexe vragen en teamontwikkeling']
      },
      timings: {
        'within-three-months': 'Binnen drie maanden', 'three-to-six-months': 'Over drie tot zes maanden',
        later: 'Later dan zes maanden', unsure: 'Nog niet bepaald'
      },
      reviewIntro: 'Lees de samenvatting voordat de Verkenner het voorstel samenstelt.',
      reviewLabels: { occasion: 'Aanleiding', outcomes: 'Gewenste uitkomst', themes: 'Onderwerp', blockers: 'Belemmeringen', participants: 'Deelnemers', format: 'Format', practical: 'Praktisch', followup: 'Verdieping' },
      edit: 'Wijzig', adjustAnswers: 'Antwoorden aanpassen',
      confirmation: 'Deze samenvatting geeft onze vraag voldoende goed weer.',
      resultKicker: 'Eerste inhoudelijke richting',
      resultTitle: outcome => `${outcome}: een eerste opzet voor jullie offsite`,
      initialDirection: 'Onze eerste aanbeveling', yourQuestion: 'Jullie vraag', proposedContent: 'Voorgestelde inhoud',
      coreModule: 'Kernmodule', supportingModule: 'Aanvullende module', programme: 'Indicatieve opbouw',
      facilitation: 'Mogelijke begeleiding', assumptions: 'Aannames en open vragen', refine: 'Samen aanscherpen',
      disclaimer: 'Dit is een eerste inhoudelijke richting op basis van jullie antwoorden. Het is nog geen definitief programma, offerte of bevestiging van beschikbaarheid.',
      context: ({ occasion, audience, size, outcomes }) => `${occasion} De offsite is bedoeld voor een ${audience.toLowerCase()} van circa ${size} deelnemers. Aan het einde willen jullie vooral bereiken: ${outcomes}.`,
      recommendation: ({ module, outcomes }) => `Gebruik de beschikbare tijd om met ${module} gericht te werken aan ${outcomes}. Het programma begint bij de eigen context en eindigt met expliciete keuzes, eigenaarschap en concrete vervolgstappen.`,
      moduleContribution: (description, role) => `${description} ${role === 'core' ? 'Dit vormt de inhoudelijke ruggengraat van de offsite.' : 'Dit vult de kernmodule aan waar een tweede perspectief nodig is.'}`,
      facilitatorFit: ({ name, language }) => `${name} kan de voorgestelde inhoud begeleiden, heeft ervaring met dit type team en kan in het ${language} werken. Beschikbaarheid wordt persoonlijk bevestigd.`,
      noFacilitator: 'De juiste facilitator bepalen we in het vervolggesprek op basis van inhoud, team en gewenste stijl.',
      assumptionText: 'Deze opzet gaat ervan uit dat de mensen die de belangrijkste keuzes kunnen maken tijdens de offsite aanwezig zijn.',
      questions: {
        decisions: 'Welke besluiten mogen tijdens de offsite definitief worden genomen?',
        preparation: 'Welke informatie, eerdere besluiten of perspectieven moeten vooraf beschikbaar zijn?',
        timing: 'Welke datum of periode is praktisch haalbaar?',
        location: 'Welke locatie en setting ondersteunen het beoogde gesprek?',
        preserve: 'Welke bestaande werkwijze of afspraak moet in de nieuwe aanpak behouden blijven?'
      },
      refineText: 'In een persoonlijk gesprek scherpen we de vraag, gewenste uitkomst, deelnemers, begeleiding en praktische inrichting verder aan. Daarna kunnen we een definitief programma en voorstel maken.',
      discuss: 'Bespreek dit voorstel', copyProposal: 'Kopieer voorstel', printProposal: 'Print of bewaar als PDF', startOver: 'Opnieuw beginnen',
      copied: 'Het voorstel is gekopieerd.', copyFailed: 'Kopiëren lukte niet. Selecteer de tekst of gebruik de printfunctie.',
      emailSubject: 'Eerste voorstel management offsite', emailIntro: 'Hallo,\n\nWe hebben de Offsite Verkenner ingevuld en willen dit eerste voorstel graag bespreken.',
      emailProposal: 'VOLLEDIG VOORSTEL', emailIntake: 'INGEVULDE INTAKE',
      noMatchTitle: 'Deze vraag vraagt om persoonlijk overleg',
      noMatchText: 'De combinatie van onderwerp, doelgroep, taal en format levert nog geen verantwoorde match op. We stellen daarom liever geen generiek programma voor.',
      directContact: 'Neem direct contact op'
    },
    en: {
      question: 'Question', of: 'of', followup: 'One short follow-up', review: 'Check your answers', proposal: 'Your initial proposal',
      next: 'Next', back: 'Back', reviewButton: 'Review summary', create: 'This is accurate, create the proposal',
      required: 'Answer this question to continue.', chooseAtLeast: 'Choose at least one option.',
      maxSelected: maximum => `Choose no more than ${maximum} options.`, selected: (count, maximum) => `${count} of ${maximum} selected`,
      loadingErrorTitle: 'The Explorer could not be loaded', loadingError: 'Please reload the page. If the problem persists, contact us directly.',
      occasion: {
        kicker: 'The occasion', title: 'Why are you planning an offsite now?',
        help: 'Briefly describe what is happening. Facts and concrete examples are more useful than general terms.',
        placeholder: 'For example: we have a new strategy, but too many priorities and no shared choices about what should come first…'
      },
      outcomes: {
        kicker: 'The outcome', title: 'What should be demonstrably different at the end?',
        help: 'Choose no more than three outcomes that genuinely matter most.'
      },
      themes: {
        kicker: 'The topic', title: 'What should the offsite primarily address?',
        help: 'Choose one or two areas. The Explorer uses these to select suitable content.'
      },
      blockers: {
        kicker: 'What gets in the way?', title: 'Why is this not happening sufficiently today?',
        help: 'Choose no more than three barriers that feel most recognisable.'
      },
      participants: {
        kicker: 'The participants', title: 'Who will take part and in which language?',
        help: 'This determines which content and facilitators are suitable.',
        audience: 'Type of team', size: 'Number of participants', language: 'Offsite language'
      },
      format: {
        kicker: 'The format', title: 'How much time do you want to set aside?',
        help: 'Choose what seems most likely now. This can still be adjusted later.'
      },
      practical: {
        kicker: 'The practical context', title: 'When and where might it take place?',
        help: 'A broad indication is enough. Add only what is already known.',
        timing: 'Preferred timing', location: 'Place or type of location', notes: 'Anything else we should know?',
        locationPlaceholder: 'For example: near Amsterdam or at our own location',
        notesPlaceholder: 'Any constraints, sensitivities or preferences'
      },
      audiences: {
        'management-teams': 'Management team', 'executive-teams': 'Executive team / ExCo', boards: 'Board / Supervisory board'
      },
      languages: { nl: 'Dutch', en: 'English' },
      formats: {
        'two-hours': ['Two hours', 'Focused working session around one core question'],
        'half-day': ['Half day', 'Deep work translated into decisions'],
        'full-day': ['Full day', 'Time for choices, deep work and action'],
        'two-days': ['Two days', 'For complex questions and team development']
      },
      timings: {
        'within-three-months': 'Within three months', 'three-to-six-months': 'Three to six months from now',
        later: 'More than six months from now', unsure: 'Not yet decided'
      },
      reviewIntro: 'Read the summary before the Explorer composes the proposal.',
      reviewLabels: { occasion: 'Occasion', outcomes: 'Desired outcome', themes: 'Topic', blockers: 'Barriers', participants: 'Participants', format: 'Format', practical: 'Practical', followup: 'Further context' },
      edit: 'Edit', adjustAnswers: 'Adjust answers',
      confirmation: 'This summary reflects our question sufficiently well.',
      resultKicker: 'Initial content direction',
      resultTitle: outcome => `${outcome}: an initial direction for your offsite`,
      initialDirection: 'Our initial recommendation', yourQuestion: 'Your question', proposedContent: 'Proposed content',
      coreModule: 'Core module', supportingModule: 'Supporting module', programme: 'Indicative structure',
      facilitation: 'Possible facilitation', assumptions: 'Assumptions and open questions', refine: 'Refine it together',
      disclaimer: 'This is an initial direction based on your answers. It is not yet a final programme, quotation or confirmation of availability.',
      context: ({ occasion, audience, size, outcomes }) => `${occasion} The offsite is intended for ${audience.toLowerCase()}, with around ${size} participants. At the end, you primarily want to achieve: ${outcomes}.`,
      recommendation: ({ module, outcomes }) => `Use the available time to work with ${module} on ${outcomes}. The programme starts with your own context and ends with explicit choices, ownership and concrete next steps.`,
      moduleContribution: (description, role) => `${description} ${role === 'core' ? 'This forms the content backbone of the offsite.' : 'This complements the core module where a second perspective is useful.'}`,
      facilitatorFit: ({ name, language }) => `${name} can facilitate the proposed content, has experience with this type of team and can work in ${language}. Availability will be confirmed personally.`,
      noFacilitator: 'We will determine the right facilitator in the follow-up conversation based on the content, team and preferred style.',
      assumptionText: 'This outline assumes that the people able to make the main decisions will be present during the offsite.',
      questions: {
        decisions: 'Which decisions may be made conclusively during the offsite?',
        preparation: 'Which information, earlier decisions or perspectives should be available in advance?',
        timing: 'Which date or period is practically feasible?',
        location: 'Which location and setting would support the intended conversation?',
        preserve: 'Which existing way of working or agreement should be preserved?'
      },
      refineText: 'In a personal conversation, we refine the question, desired outcome, participants, facilitation and practical arrangements. We can then prepare a final programme and proposal.',
      discuss: 'Discuss this proposal', copyProposal: 'Copy proposal', printProposal: 'Print or save as PDF', startOver: 'Start again',
      copied: 'The proposal has been copied.', copyFailed: 'Copying failed. Select the text or use the print function.',
      emailSubject: 'Initial management offsite proposal', emailIntro: 'Hello,\n\nWe completed the Offsite Explorer and would like to discuss this initial proposal.',
      emailProposal: 'FULL PROPOSAL', emailIntake: 'COMPLETED INTAKE',
      noMatchTitle: 'This question needs a personal conversation',
      noMatchText: 'The combination of topic, audience, language and format does not yet produce a responsible match. We would rather not suggest a generic programme.',
      directContact: 'Contact us directly'
    }
  }[lang];

  const outcomeIds = [
    'shared-direction', 'clear-strategic-choices', 'prioritised-action-plan', 'future-readiness',
    'faster-better-decisions', 'stronger-execution', 'adaptive-operating-model', 'innovation-opportunities',
    'validated-options', 'balanced-growth-portfolio', 'responsible-ai-use', 'human-ai-work-design',
    'ai-adoption-plan', 'customer-value-clarity', 'commercial-decisions', 'culture-change-agenda',
    'lived-values-behaviours', 'organisational-adaptability', 'leadership-practice', 'stronger-team-dynamics',
    'stakeholder-alignment', 'productive-dialogue', 'psychological-safety', 'sustainable-performance',
    'clear-accountability', 'improved-communication', 'difficult-conversations', 'effective-meetings',
    'integration-after-merger', 'motivation-engagement'
  ];

  const outcomeGroups = [
    {
      label: { nl: 'Richting en strategie', en: 'Direction and strategy' },
      ids: ['shared-direction', 'clear-strategic-choices', 'future-readiness']
    },
    {
      label: { nl: 'Uitvoering en besluitvorming', en: 'Execution and decision-making' },
      ids: ['prioritised-action-plan', 'faster-better-decisions', 'stronger-execution', 'adaptive-operating-model', 'clear-accountability', 'effective-meetings']
    },
    {
      label: { nl: 'Groei, innovatie en AI', en: 'Growth, innovation and AI' },
      ids: ['innovation-opportunities', 'validated-options', 'balanced-growth-portfolio', 'responsible-ai-use', 'human-ai-work-design', 'ai-adoption-plan', 'customer-value-clarity', 'commercial-decisions']
    },
    {
      label: { nl: 'Cultuur en leiderschap', en: 'Culture and leadership' },
      ids: ['culture-change-agenda', 'lived-values-behaviours', 'organisational-adaptability', 'leadership-practice', 'sustainable-performance', 'motivation-engagement']
    },
    {
      label: { nl: 'Samenwerking en alignment', en: 'Teamwork and alignment' },
      ids: ['stronger-team-dynamics', 'stakeholder-alignment', 'productive-dialogue', 'psychological-safety', 'improved-communication', 'difficult-conversations', 'integration-after-merger']
    }
  ];

  const blockerIdsByTheme = {
    'strategy-sharp-choices': ['unclear-direction', 'too-many-priorities', 'short-term-bias', 'weak-follow-through', 'slow-decisions', 'rigid-planning-budgeting'],
    'ai-impact-work': ['low-ai-literacy', 'unclear-ai-accountability', 'resistance-to-ai', 'weak-governance', 'siloed-thinking'],
    'growth-innovation': ['weak-customer-insight', 'untested-assumptions', 'fragmented-innovation', 'core-business-dominance', 'short-term-bias'],
    'culture-collaboration': ['strategy-culture-misalignment', 'values-not-lived', 'avoided-tensions', 'change-resistance', 'organisational-inertia'],
    leadership: ['weak-accountability', 'low-autonomy', 'feedback-avoidance', 'messages-do-not-land', 'change-resistance'],
    'team-development': ['low-trust', 'conflict-avoidance', 'unproductive-conflict', 'relationship-strain', 'weak-accountability'],
    'dilemmas-tensions': ['avoided-tensions', 'conflict-avoidance', 'unproductive-conflict', 'cultural-friction', 'relationship-strain'],
    'faster-decision-making': ['slow-decisions', 'meeting-overload', 'weak-follow-through', 'too-many-priorities', 'siloed-thinking'],
    'burnout-resilience': ['chronic-overload', 'low-energy-recovery', 'weak-accountability', 'low-trust']
  };

  const state = {
    occasion: '', outcomes: [], themes: [], blockers: [], audience: '', size: 8,
    language: lang, format: '', timing: '', location: '', notes: '', followup: ''
  };

  const baseSteps = ['occasion', 'themes', 'blockers', 'outcomes', 'participants', 'format', 'practical'];
  let flowIndex = 0;
  let mode = 'questions';
  let data;
  let proposalText = '';

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const byId = (items, id) => items.find(item => item.id === id);
  const labelsFor = (kind, ids) => ids.map(id => byId(data.matching.vocabulary[kind], id)?.[lang] || id);
  const joinLabels = values => values.join(lang === 'nl' ? ', ' : ', ');

  function getFollowup() {
    const has = id => state.blockers.includes(id) || state.themes.includes(id);
    if (has('conflict-avoidance') || has('unproductive-conflict') || has('avoided-tensions')) {
      return lang === 'nl'
        ? 'Wat is op dit moment het moeilijkst om open met elkaar te bespreken?'
        : 'What is currently most difficult to discuss openly with each other?';
    }
    if (has('strategy-sharp-choices')) {
      return lang === 'nl'
        ? 'Welke keuze of prioriteit moet na deze offsite echt duidelijker zijn?'
        : 'Which choice or priority must be clearer after this offsite?';
    }
    if (has('ai-impact-work')) {
      return lang === 'nl'
        ? 'Waar moet AI de komende twaalf maanden het grootste verschil maken?'
        : 'Where should AI make the biggest difference over the next twelve months?';
    }
    if (has('growth-innovation')) {
      return lang === 'nl'
        ? 'Welke groeikans of aanname moet het team het meest kritisch toetsen?'
        : 'Which growth opportunity or assumption does the team most need to test critically?';
    }
    if (has('burnout-resilience')) {
      return lang === 'nl'
        ? 'Welke druk of gewoonte maakt de huidige manier van presteren niet duurzaam?'
        : 'Which pressure or habit makes the current way of performing unsustainable?';
    }
    return '';
  }

  function getFlow() {
    const followup = getFollowup();
    return followup
      ? [...baseSteps.slice(0, 3), 'followup', ...baseSteps.slice(3)]
      : [...baseSteps];
  }

  function setProgress(stepId) {
    if (mode === 'proposal') {
      progressLabel.textContent = copy.proposal;
      progressPercent.textContent = '100%';
      progressBar.style.width = '100%';
      return;
    }
    if (mode === 'review') {
      progressLabel.textContent = copy.review;
      progressPercent.textContent = '100%';
      progressBar.style.width = '100%';
      return;
    }
    if (stepId === 'followup') {
      progressLabel.textContent = copy.followup;
      progressPercent.textContent = '43%';
      progressBar.style.width = '43%';
      return;
    }
    const number = baseSteps.indexOf(stepId) + 1;
    const percent = Math.round((number / baseSteps.length) * 100);
    progressLabel.textContent = `${copy.question} ${number} ${copy.of} 7`;
    progressPercent.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
  }

  function questionShell(stepId, fieldHtml, options = {}) {
    const text = options.text || copy[stepId];
    const number = baseSteps.indexOf(stepId) + 1;
    const nextLabel = stepId === 'practical' ? copy.reviewButton : copy.next;
    return `
      <div class="question-view" data-step="${stepId}">
        <span class="question-kicker">${escapeHtml(text.kicker || `${copy.question} ${number}`)}</span>
        <h2 class="question-title" id="question-title">${escapeHtml(text.title)}</h2>
        <p class="question-help">${escapeHtml(text.help || '')}</p>
        <div class="question-field">${fieldHtml}</div>
        <p class="field-error" id="field-error" role="alert"></p>
        <div class="explorer-actions">
          ${flowIndex > 0 ? `<button class="explorer-button explorer-button--secondary" type="button" data-action="back">${copy.back}</button>` : '<span></span>'}
          <button class="explorer-button" type="button" data-action="next">${nextLabel}</button>
        </div>
      </div>`;
  }

  function choiceMarkup(name, options, selected, type = 'checkbox') {
    return options.map(option => {
      const checked = type === 'checkbox' ? selected.includes(option.id) : selected === option.id;
      return `<label class="choice-item">
        <input type="${type}" name="${name}" value="${escapeHtml(option.id)}" ${checked ? 'checked' : ''}>
        <span>${escapeHtml(option.label)}${option.description ? `<small>${escapeHtml(option.description)}</small>` : ''}</span>
      </label>`;
    }).join('');
  }

  function renderOccasion() {
    return questionShell('occasion', `<textarea class="explorer-textarea" data-state="occasion" maxlength="700" placeholder="${escapeHtml(copy.occasion.placeholder)}">${escapeHtml(state.occasion)}</textarea>`);
  }

  function renderOutcomes() {
    const groups = outcomeGroups.map((group, index) => ({
      ...group,
      options: group.ids.map(id => ({ id, label: byId(data.matching.vocabulary.outcomes, id)?.[lang] || id })),
      headingId: `outcome-group-${index}`
    }));
    return questionShell('outcomes', `
      <div class="choice-groups">${groups.map(group => `
        <section class="choice-group" role="group" aria-labelledby="${group.headingId}">
          <h3 class="choice-group-title" id="${group.headingId}">${escapeHtml(group.label[lang])}</h3>
          <div class="choice-grid">${choiceMarkup('outcomes', group.options, state.outcomes)}</div>
        </section>`).join('')}
      </div>
      <p class="selection-count" id="selection-count">${copy.selected(state.outcomes.length, 3)}</p>`);
  }

  function renderThemes() {
    const options = data.matching.vocabulary.themes.map(item => ({ id: item.id, label: item[lang] }));
    return questionShell('themes', `
      <div class="choice-grid">${choiceMarkup('themes', options, state.themes)}</div>
      <p class="selection-count" id="selection-count">${copy.selected(state.themes.length, 2)}</p>`);
  }

  function availableBlockers() {
    const ids = new Set();
    state.themes.forEach(theme => (blockerIdsByTheme[theme] || []).forEach(id => ids.add(id)));
    ['unclear-direction', 'too-many-priorities', 'weak-follow-through', 'siloed-thinking', 'weak-accountability'].forEach(id => ids.add(id));
    return data.matching.vocabulary.blockers.filter(item => ids.has(item.id));
  }

  function renderBlockers() {
    const options = availableBlockers().map(item => ({ id: item.id, label: item[lang] }));
    state.blockers = state.blockers.filter(id => options.some(option => option.id === id));
    return questionShell('blockers', `
      <div class="choice-grid">${choiceMarkup('blockers', options, state.blockers)}</div>
      <p class="selection-count" id="selection-count">${copy.selected(state.blockers.length, 3)}</p>`);
  }

  function renderFollowup() {
    const text = {
      kicker: copy.followup,
      title: getFollowup(),
      help: lang === 'nl' ? 'Een kort en direct antwoord is voldoende.' : 'A brief, direct answer is enough.'
    };
    return questionShell('followup', `<textarea class="explorer-textarea" data-state="followup" maxlength="500">${escapeHtml(state.followup)}</textarea>`, { text });
  }

  function renderParticipants() {
    const audiences = Object.entries(copy.audiences).map(([id, label]) => ({ id, label }));
    const languages = Object.entries(copy.languages).map(([id, label]) => ({ id, label }));
    return questionShell('participants', `
      <span class="field-label">${copy.participants.audience}</span>
      <div class="choice-grid">${choiceMarkup('audience', audiences, state.audience, 'radio')}</div>
      <div class="field-grid" style="margin-top:24px">
        <label><span class="field-label">${copy.participants.size}</span><input class="explorer-input" type="number" min="2" max="100" inputmode="numeric" data-state="size" value="${escapeHtml(state.size)}"></label>
        <div><span class="field-label">${copy.participants.language}</span><div class="choice-grid choice-grid--single" style="margin-top:0">${choiceMarkup('language', languages, state.language, 'radio')}</div></div>
      </div>`);
  }

  function renderFormat() {
    const options = Object.entries(copy.formats).map(([id, value]) => ({ id, label: value[0], description: value[1] }));
    return questionShell('format', `<div class="choice-grid choice-grid--single">${choiceMarkup('format', options, state.format, 'radio')}</div>`);
  }

  function renderPractical() {
    const timings = Object.entries(copy.timings).map(([id, label]) => ({ id, label }));
    return questionShell('practical', `
      <span class="field-label">${copy.practical.timing}</span>
      <div class="choice-grid">${choiceMarkup('timing', timings, state.timing, 'radio')}</div>
      <div class="field-grid" style="margin-top:24px">
        <label><span class="field-label">${copy.practical.location}</span><input class="explorer-input" type="text" maxlength="120" data-state="location" value="${escapeHtml(state.location)}" placeholder="${escapeHtml(copy.practical.locationPlaceholder)}"></label>
        <label><span class="field-label">${copy.practical.notes}</span><input class="explorer-input" type="text" maxlength="240" data-state="notes" value="${escapeHtml(state.notes)}" placeholder="${escapeHtml(copy.practical.notesPlaceholder)}"></label>
      </div>`);
  }

  function renderQuestion() {
    mode = 'questions';
    const flow = getFlow();
    if (flowIndex >= flow.length) {
      mode = 'review';
      renderReview();
      return;
    }
    const stepId = flow[flowIndex];
    setProgress(stepId);
    const renders = {
      occasion: renderOccasion, outcomes: renderOutcomes, themes: renderThemes, blockers: renderBlockers,
      followup: renderFollowup, participants: renderParticipants, format: renderFormat, practical: renderPractical
    };
    content.innerHTML = renders[stepId]();
    bindQuestionEvents(stepId);
    content.querySelector('textarea, input')?.focus({ preventScroll: true });
    live.textContent = stepId === 'followup' ? copy.followup : `${copy.question} ${baseSteps.indexOf(stepId) + 1} ${copy.of} 7`;
  }

  function bindQuestionEvents(stepId) {
    content.querySelectorAll('[data-state]').forEach(field => {
      field.addEventListener('input', () => {
        state[field.dataset.state] = field.type === 'number' ? Number(field.value) : field.value;
      });
    });

    content.querySelectorAll('input[type="radio"]').forEach(field => {
      field.addEventListener('change', () => { state[field.name] = field.value; });
    });

    content.querySelectorAll('input[type="checkbox"]').forEach(field => {
      field.addEventListener('change', () => {
        const maximum = field.name === 'themes' ? 2 : 3;
        const selected = [...content.querySelectorAll(`input[name="${field.name}"]:checked`)].map(item => item.value);
        if (selected.length > maximum) {
          field.checked = false;
          showError(copy.maxSelected(maximum));
          return;
        }
        const previousFollowup = getFollowup();
        state[field.name] = selected;
        if (['themes', 'blockers'].includes(field.name) && getFollowup() !== previousFollowup) state.followup = '';
        const counter = document.getElementById('selection-count');
        if (counter) counter.textContent = copy.selected(selected.length, maximum);
        clearError();
      });
    });

    content.querySelector('[data-action="back"]')?.addEventListener('click', () => {
      flowIndex = Math.max(0, flowIndex - 1);
      renderQuestion();
    });
    content.querySelector('[data-action="next"]')?.addEventListener('click', () => {
      if (!validateStep(stepId)) return;
      flowIndex += 1;
      renderQuestion();
    });
  }

  function validateStep(stepId) {
    let valid = true;
    let message = copy.required;
    if (stepId === 'occasion') valid = state.occasion.trim().length >= 20;
    if (stepId === 'outcomes') { valid = state.outcomes.length >= 1 && state.outcomes.length <= 3; message = copy.chooseAtLeast; }
    if (stepId === 'themes') { valid = state.themes.length >= 1 && state.themes.length <= 2; message = copy.chooseAtLeast; }
    if (stepId === 'blockers') { valid = state.blockers.length >= 1 && state.blockers.length <= 3; message = copy.chooseAtLeast; }
    if (stepId === 'followup') valid = state.followup.trim().length >= 10;
    if (stepId === 'participants') valid = Boolean(state.audience && state.language && Number(state.size) >= 2 && Number(state.size) <= 100);
    if (stepId === 'format') valid = Boolean(state.format);
    if (stepId === 'practical') valid = Boolean(state.timing);
    if (!valid) showError(message); else clearError();
    return valid;
  }

  function showError(message) {
    const error = document.getElementById('field-error');
    if (!error) return;
    error.textContent = message;
    error.classList.add('is-visible');
    error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearError() {
    const error = document.getElementById('field-error');
    if (!error) return;
    error.textContent = '';
    error.classList.remove('is-visible');
  }

  function answerSummary() {
    const practical = [copy.timings[state.timing], state.location, state.notes].filter(Boolean).join(' · ');
    return {
      occasion: state.occasion,
      outcomes: joinLabels(labelsFor('outcomes', state.outcomes)),
      themes: joinLabels(labelsFor('themes', state.themes)),
      blockers: joinLabels(labelsFor('blockers', state.blockers)),
      participants: `${copy.audiences[state.audience]} · ${state.size} · ${copy.languages[state.language]}`,
      format: copy.formats[state.format]?.[0] || state.format,
      practical,
      followup: getFollowup() ? state.followup : ''
    };
  }

  function renderReview() {
    mode = 'review';
    setProgress();
    const summary = answerSummary();
    const rows = Object.entries(summary)
      .filter(([, value]) => value)
      .map(([key, value]) => `<div class="review-row"><dt>${escapeHtml(copy.reviewLabels[key])}</dt><dd>${escapeHtml(value)}</dd><button class="review-edit" type="button" data-edit-step="${escapeHtml(key)}">${copy.edit}</button></div>`)
      .join('');
    content.innerHTML = `
      <div class="review-view">
        <span class="question-kicker">${copy.review}</span>
        <h2 class="question-title" id="question-title">${copy.review}</h2>
        <p class="question-help">${copy.reviewIntro}</p>
        <dl class="review-list">${rows}</dl>
        <label class="confirmation"><input type="checkbox" id="confirm-summary"><span>${copy.confirmation}</span></label>
        <div class="explorer-actions">
          <button class="explorer-button explorer-button--secondary" type="button" data-action="back">${copy.back}</button>
          <button class="explorer-button" type="button" data-action="create" disabled>${copy.create}</button>
        </div>
      </div>`;
    const confirm = document.getElementById('confirm-summary');
    const create = content.querySelector('[data-action="create"]');
    confirm.addEventListener('change', () => { create.disabled = !confirm.checked; });
    content.querySelectorAll('[data-edit-step]').forEach(button => {
      button.addEventListener('click', () => {
        const targetIndex = getFlow().indexOf(button.dataset.editStep);
        if (targetIndex < 0) return;
        flowIndex = targetIndex;
        renderQuestion();
      });
    });
    content.querySelector('[data-action="back"]').addEventListener('click', () => {
      flowIndex = getFlow().length - 1;
      renderQuestion();
    });
    create.addEventListener('click', renderProposal);
    live.textContent = copy.review;
  }

  const overlap = (values = [], requested = []) => requested.filter(value => new Set(values).has(value));
  const proportionalScore = (values, requested, maximum) => requested.length ? (overlap(values, requested).length / requested.length) * maximum : 0;
  const formatScore = { strong: 10, focused: 7, supporting: 4, 'not-suitable': 0 };

  function resolveFacilitators(module) {
    const byAcademyName = new Map();
    data.facilitators.facilitators.forEach(profile => (profile.academyNames || []).forEach(name => byAcademyName.set(name, profile)));
    return (module.facilitators || [])
      .map(name => byAcademyName.get(name))
      .filter(profile => profile?.active && profile?.offsiteEligible)
      .filter(profile => profile.languages.includes(state.language))
      .filter(profile => profile.audiences.includes(state.audience));
  }

  function matchOffsite() {
    const audienceMap = lang === 'nl'
      ? { 'management-teams': 'Managementteams', 'executive-teams': 'Directieteams / ExCo', boards: 'Raden van Commissarissen / Toezicht' }
      : { 'management-teams': 'Management Teams', 'executive-teams': 'Executive Teams / ExCo', boards: 'Boards / Supervisory Boards' };
    const catalogById = new Map(data.catalog.modules.map(module => [module.id, module]));
    const ranked = data.matching.modules.map(metadata => {
      const module = catalogById.get(metadata.moduleId);
      if (!module || metadata.recommendationStatus !== 'active') return null;
      if (!module.audiences.includes(audienceMap[state.audience])) return null;
      const fit = metadata.formatFit[state.format];
      if (!fit || fit === 'not-suitable') return null;
      const facilitators = resolveFacilitators(module);
      if (!facilitators.length) return null;
      const primaryThemeScore = proportionalScore(metadata.primaryThemes, state.themes, 25);
      const unmatchedThemes = state.themes.filter(theme => !metadata.primaryThemes.includes(theme));
      const secondaryThemeScore = proportionalScore(metadata.secondaryThemes, unmatchedThemes, 12.5);
      const themeScore = Math.min(25, primaryThemeScore + secondaryThemeScore);
      const outcomeScore = proportionalScore(metadata.outcomes, state.outcomes, 30);
      const blockerScore = proportionalScore(metadata.blockers, state.blockers, 20);
      return {
        moduleId: metadata.moduleId,
        title: module.title,
        description: module.description,
        score: themeScore + outcomeScore + blockerScore + 15 + formatScore[fit],
        matchedOutcomes: overlap(metadata.outcomes, state.outcomes),
        matchedBlockers: overlap(metadata.blockers, state.blockers),
        matchedThemes: overlap([...metadata.primaryThemes, ...metadata.secondaryThemes], state.themes),
        proposalRoles: metadata.proposalRoles,
        facilitators
      };
    }).filter(Boolean).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

    const core = ranked.find(candidate => candidate.proposalRoles.includes('core')) || null;
    if (!core) return { core: null, supporting: [] };
    const supportLimit = ['two-hours', 'half-day'].includes(state.format) ? 1 : 2;
    const covered = {
      outcomes: new Set(core.matchedOutcomes), blockers: new Set(core.matchedBlockers), themes: new Set(core.matchedThemes)
    };
    let remaining = ranked.filter(candidate => candidate.moduleId !== core.moduleId && candidate.proposalRoles.includes('supporting'));
    const supporting = [];
    while (supporting.length < supportLimit) {
      const options = remaining.map(candidate => {
        const adds = {
          outcomes: candidate.matchedOutcomes.filter(value => !covered.outcomes.has(value)),
          blockers: candidate.matchedBlockers.filter(value => !covered.blockers.has(value)),
          themes: candidate.matchedThemes.filter(value => !covered.themes.has(value))
        };
        return { ...candidate, adds, complementScore: candidate.score + adds.outcomes.length * 8 + adds.blockers.length * 5 + adds.themes.length * 3 };
      }).filter(candidate => Object.values(candidate.adds).flat().length > 0)
        .sort((a, b) => b.complementScore - a.complementScore || b.score - a.score);
      if (!options.length) break;
      const selected = options[0];
      supporting.push(selected);
      selected.adds.outcomes.forEach(value => covered.outcomes.add(value));
      selected.adds.blockers.forEach(value => covered.blockers.add(value));
      selected.adds.themes.forEach(value => covered.themes.add(value));
      remaining = remaining.filter(candidate => candidate.moduleId !== selected.moduleId);
    }
    return { core, supporting };
  }

  function programmeMarkup() {
    const blueprint = data.template.programmeBlueprints[state.format];
    if (blueprint.blocks) {
      return `<ol class="programme-list">${blueprint.blocks.map(block => `<li>${escapeHtml(block[lang])}</li>`).join('')}</ol>${blueprint.note ? `<p>${escapeHtml(blueprint.note[lang])}</p>` : ''}`;
    }
    return `<ol class="programme-list">${blueprint.days.map(day => `<li>${escapeHtml(day[lang])}</li>`).join('')}</ol>`;
  }

  function proposalPlainText(match, facilitators, questions) {
    const summary = answerSummary();
    const modules = [match.core, ...match.supporting];
    const programme = data.template.programmeBlueprints[state.format];
    const programmeLines = programme.blocks
      ? programme.blocks.map(block => `- ${block[lang]}`).join('\n')
      : programme.days.map(day => `- ${day[lang]}`).join('\n');
    return [
      copy.resultTitle(labelsFor('outcomes', state.outcomes)[0]),
      '', copy.yourQuestion, copy.context({ occasion: state.occasion.trim(), audience: copy.audiences[state.audience], size: state.size, outcomes: summary.outcomes }),
      state.followup ? `\n${state.followup}` : '',
      '', copy.initialDirection, copy.recommendation({ module: match.core.title, outcomes: summary.outcomes.toLowerCase() }),
      '', copy.proposedContent,
      ...modules.map((module, index) => `${index === 0 ? copy.coreModule : copy.supportingModule}: ${module.title}\n${copy.moduleContribution(module.description, index === 0 ? 'core' : 'supporting')}`),
      '', copy.programme, programmeLines,
      '', copy.facilitation, facilitators.length ? facilitators.map(profile => profile.academyNames[0]).join(', ') : copy.noFacilitator,
      '', copy.assumptions, copy.assumptionText, ...questions.map(question => `- ${question}`),
      '', copy.refine, copy.refineText, '', copy.disclaimer
    ].filter(value => value !== '').join('\n');
  }

  function intakePlainText(summary) {
    return Object.entries(summary)
      .filter(([, value]) => value)
      .map(([key, value]) => `${copy.reviewLabels[key]}:\n${value}`)
      .join('\n\n');
  }

  function renderProposal() {
    mode = 'proposal';
    setProgress();
    const match = matchOffsite();
    if (!match.core) {
      content.innerHTML = `<div class="data-error"><h2 id="question-title">${copy.noMatchTitle}</h2><p>${copy.noMatchText}</p><div class="proposal-actions"><a class="explorer-button" href="mailto:info@intothenxt.com?subject=${encodeURIComponent(copy.emailSubject)}">${copy.directContact}</a><button class="explorer-button explorer-button--secondary" type="button" data-action="restart">${copy.startOver}</button></div></div>`;
      content.querySelector('[data-action="restart"]').addEventListener('click', restart);
      return;
    }

    const summary = answerSummary();
    const modules = [match.core, ...match.supporting];
    const facilitatorMap = new Map();
    modules.flatMap(module => module.facilitators).forEach(profile => facilitatorMap.set(profile.id, profile));
    const facilitators = [...facilitatorMap.values()].slice(0, 2);
    const questions = [copy.questions.decisions, copy.questions.preparation];
    if (state.timing === 'unsure') questions.push(copy.questions.timing);
    if (!state.location.trim()) questions.push(copy.questions.location);
    questions.push(copy.questions.preserve);
    const openQuestions = questions.slice(0, 5);
    const title = copy.resultTitle(labelsFor('outcomes', state.outcomes)[0]);
    const contextText = copy.context({ occasion: state.occasion.trim(), audience: copy.audiences[state.audience], size: state.size, outcomes: summary.outcomes });
    proposalText = proposalPlainText(match, facilitators, openQuestions);
    const mailBody = `${copy.emailIntro}\n\n${copy.emailProposal}\n\n${proposalText}\n\n${copy.emailIntake}\n\n${intakePlainText(summary)}`;
    const mailto = `mailto:info@intothenxt.com?subject=${encodeURIComponent(copy.emailSubject)}&body=${encodeURIComponent(mailBody)}`;
    content.innerHTML = `
      <article class="proposal-view" id="proposal-document">
        <span class="question-kicker">${copy.resultKicker}</span>
        <h1 class="question-title" id="question-title">${escapeHtml(title)}</h1>
        <div class="proposal-meta"><span>${escapeHtml(summary.format)}</span><span>${escapeHtml(copy.audiences[state.audience])}</span><span>${escapeHtml(copy.languages[state.language])}</span></div>
        <p class="proposal-disclaimer">${copy.disclaimer}</p>

        <section class="proposal-section"><h2>${copy.yourQuestion}</h2><p>${escapeHtml(contextText).replaceAll('\n', '<br>')}</p>${state.followup ? `<p><strong>${escapeHtml(getFollowup())}</strong><br>${escapeHtml(state.followup)}</p>` : ''}</section>
        <section class="proposal-section"><h2>${copy.initialDirection}</h2><p>${escapeHtml(copy.recommendation({ module: match.core.title, outcomes: summary.outcomes.toLowerCase() }))}</p></section>
        <section class="proposal-section"><h2>${copy.proposedContent}</h2><div class="module-list">${modules.map((module, index) => `<article class="module-card"><small>${index === 0 ? copy.coreModule : copy.supportingModule}</small><h3>${escapeHtml(module.title)}</h3><p>${escapeHtml(copy.moduleContribution(module.description, index === 0 ? 'core' : 'supporting'))}</p></article>`).join('')}</div></section>
        <section class="proposal-section"><h2>${copy.programme}</h2>${programmeMarkup()}</section>
        <section class="proposal-section"><h2>${copy.facilitation}</h2>${facilitators.length ? facilitators.map(profile => `<p><strong>${escapeHtml(profile.academyNames[0])}</strong><br>${escapeHtml(copy.facilitatorFit({ name: profile.academyNames[0], audience: copy.audiences[state.audience], language: copy.languages[state.language] }))}</p>`).join('') : `<p>${copy.noFacilitator}</p>`}</section>
        <section class="proposal-section"><h2>${copy.assumptions}</h2><p>${copy.assumptionText}</p><ul>${openQuestions.map(question => `<li>${escapeHtml(question)}</li>`).join('')}</ul></section>
        <section class="proposal-section"><h2>${copy.refine}</h2><p>${copy.refineText}</p></section>
        <div class="proposal-actions">
          <a class="explorer-button" href="${mailto}">${copy.discuss}</a>
          <button class="explorer-button explorer-button--secondary" type="button" data-action="adjust">${copy.adjustAnswers}</button>
          <button class="explorer-button explorer-button--secondary" type="button" data-action="copy">${copy.copyProposal}</button>
          <button class="explorer-button explorer-button--secondary" type="button" data-action="print">${copy.printProposal}</button>
          <button class="explorer-button explorer-button--secondary" type="button" data-action="restart">${copy.startOver}</button>
          <span class="copy-status" id="copy-status" aria-live="polite"></span>
        </div>
      </article>`;
    content.querySelector('[data-action="adjust"]').addEventListener('click', renderReview);
    content.querySelector('[data-action="copy"]').addEventListener('click', copyResult);
    content.querySelector('[data-action="print"]').addEventListener('click', () => window.print());
    content.querySelector('[data-action="restart"]').addEventListener('click', restart);
    live.textContent = copy.proposal;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function copyResult() {
    const status = document.getElementById('copy-status');
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(proposalText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = proposalText;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        if (!document.execCommand('copy')) throw new Error('Copy command failed');
        textarea.remove();
      }
      status.textContent = copy.copied;
    } catch {
      status.textContent = copy.copyFailed;
    }
  }

  function restart() {
    Object.assign(state, {
      occasion: '', outcomes: [], themes: [], blockers: [], audience: '', size: 8,
      language: lang, format: '', timing: '', location: '', notes: '', followup: ''
    });
    flowIndex = 0;
    mode = 'questions';
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function load() {
    try {
      const [catalog, matching, facilitators, template] = await Promise.all([
        fetch(root.dataset.catalog, { cache: 'no-store' }),
        fetch(root.dataset.matching, { cache: 'no-store' }),
        fetch(root.dataset.facilitators, { cache: 'no-store' }),
        fetch(root.dataset.template, { cache: 'no-store' })
      ]);
      if (![catalog, matching, facilitators, template].every(response => response.ok)) throw new Error('Data load failed');
      data = {
        catalog: await catalog.json(), matching: await matching.json(),
        facilitators: await facilitators.json(), template: await template.json()
      };
      renderQuestion();
    } catch (error) {
      console.error(error);
      content.innerHTML = `<div class="data-error"><h2 id="question-title">${copy.loadingErrorTitle}</h2><p>${copy.loadingError}</p></div>`;
    }
  }

  load();
})();
