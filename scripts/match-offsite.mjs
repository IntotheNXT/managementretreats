import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

export async function loadMatchingData({
  academyPath = resolve(here, '../catalog-en.json'),
  matchingPath = resolve(here, '../data/offsite-matching.json'),
  facilitatorsPath = resolve(here, '../data/facilitators.json')
} = {}) {
  const [academy, matching, facilitatorData] = await Promise.all(
    [academyPath, matchingPath, facilitatorsPath].map(async path => JSON.parse(await readFile(path, 'utf8')))
  );
  return { academy, matching, facilitatorData };
}

const academyAudience = {
  'management-teams': 'Management Teams',
  'executive-teams': 'Executive Teams / ExCo',
  boards: 'Boards / Supervisory Boards'
};

const formatScore = {
  strong: 10,
  focused: 7,
  supporting: 4,
  'not-suitable': 0
};

const intakeThemes = {
  'strategy-execution': { category: 'Strategy & Execution', aliases: ['strategy-sharp-choices', 'faster-decision-making'] },
  'innovation-growth': { category: 'Innovation & Growth', aliases: ['growth-innovation'] },
  'ai-emerging-technology': { category: 'AI & Emerging Technology', aliases: ['ai-impact-work'] },
  'commercial-excellence': { category: 'Commercial Excellence', aliases: [] },
  'culture-change-organisation': { category: 'Culture, Change & Organisation', aliases: ['culture-collaboration'] },
  'leadership-management': { category: 'Leadership & Management', aliases: ['leadership'] },
  'teams-collaboration-wellbeing': { category: 'Teams, Collaboration & Wellbeing', aliases: ['team-development', 'burnout-resilience'] },
  'communication-influence': { category: 'Communication & Influence', aliases: ['dilemmas-tensions'] }
};

function overlap(values = [], requested = []) {
  const available = new Set(values);
  return requested.filter(value => available.has(value));
}

function proportionalScore(values, requested, maximum) {
  if (!requested.length) return 0;
  return (overlap(values, requested).length / requested.length) * maximum;
}

function resolveFacilitators(academyModule, facilitatorData, scenario) {
  const profilesByAcademyName = new Map();
  for (const profile of facilitatorData.facilitators) {
    for (const academyName of profile.academyNames || []) profilesByAcademyName.set(academyName, profile);
  }

  return (academyModule.facilitators || [])
    .map(name => profilesByAcademyName.get(name))
    .filter(profile => profile?.active && profile?.offsiteEligible)
    .filter(profile => !scenario.language || profile.languages.includes(scenario.language))
    .filter(profile => !scenario.audience || profile.audiences.includes(scenario.audience));
}

function scoreModule(metadata, academyModule, facilitatorData, scenario) {
  if (metadata.recommendationStatus !== 'active') return null;
  if (!academyModule.audiences.includes(academyAudience[scenario.audience])) return null;
  const fit = metadata.formatFit[scenario.format];
  if (!fit || fit === 'not-suitable') return null;

  const facilitators = resolveFacilitators(academyModule, facilitatorData, scenario);
  if (!facilitators.length) return null;

  const selectedThemeCategories = scenario.themes.filter(theme => theme !== 'other');
  const requestedThemes = selectedThemeCategories.flatMap(theme => intakeThemes[theme]?.aliases || []);
  const requestedOutcomes = scenario.outcomes.filter(outcome => outcome !== 'other');
  const requestedBlockers = scenario.blockers.filter(blocker => blocker !== 'other');
  const moduleCategory = selectedThemeCategories.find(theme => intakeThemes[theme]?.category === academyModule.category);
  const categoryMatched = Boolean(moduleCategory);
  const primaryThemeScore = proportionalScore(metadata.primaryThemes, requestedThemes, 25);
  const unmatchedThemes = requestedThemes.filter(theme => !metadata.primaryThemes.includes(theme));
  const secondaryThemeScore = proportionalScore(metadata.secondaryThemes, unmatchedThemes, 12.5);
  const themeScore = categoryMatched ? 25 : Math.min(25, primaryThemeScore + secondaryThemeScore);
  const outcomeScore = proportionalScore(metadata.outcomes, requestedOutcomes, 30);
  const blockerScore = proportionalScore(metadata.blockers, requestedBlockers, 20);
  const audienceScore = 15;
  const durationScore = formatScore[fit];

  return {
    moduleId: metadata.moduleId,
    title: academyModule.title,
    score: Number((themeScore + outcomeScore + blockerScore + audienceScore + durationScore).toFixed(2)),
    scoreBreakdown: {
      themes: Number(themeScore.toFixed(2)),
      outcomes: Number(outcomeScore.toFixed(2)),
      blockers: Number(blockerScore.toFixed(2)),
      audience: audienceScore,
      format: durationScore
    },
    matchedOutcomes: overlap(metadata.outcomes, requestedOutcomes),
    matchedBlockers: overlap(metadata.blockers, requestedBlockers),
    matchedThemes: categoryMatched ? [moduleCategory] : overlap([...metadata.primaryThemes, ...metadata.secondaryThemes], requestedThemes),
    primaryThemes: metadata.primaryThemes,
    proposalRoles: metadata.proposalRoles,
    formatFit: fit,
    facilitators: facilitators.map(profile => ({ id: profile.id, name: profile.academyNames[0] }))
  };
}

export function matchOffsite(scenario, { academy, matching, facilitatorData }) {
  const academyById = new Map(academy.modules.map(module => [module.id, module]));
  const ranked = matching.modules
    .map(metadata => {
      const academyModule = academyById.get(metadata.moduleId);
      return academyModule ? scoreModule(metadata, academyModule, facilitatorData, scenario) : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const core = ranked.find(candidate => candidate.proposalRoles.includes('core')) || null;
  if (!core) return { scenario, core: null, supporting: [], candidates: ranked.slice(0, 5) };

  const supportLimit = scenario.format === 'two-hours' || scenario.format === 'half-day' ? 1 : 2;
  const covered = {
    outcomes: new Set(core.matchedOutcomes),
    blockers: new Set(core.matchedBlockers),
    themes: new Set(core.matchedThemes)
  };
  let remaining = ranked.filter(candidate => candidate.moduleId !== core.moduleId && candidate.proposalRoles.includes('supporting'));
  const supporting = [];

  while (supporting.length < supportLimit) {
    const options = remaining
      .map(candidate => {
        const newOutcomes = candidate.matchedOutcomes.filter(value => !covered.outcomes.has(value));
        const newBlockers = candidate.matchedBlockers.filter(value => !covered.blockers.has(value));
        const newThemes = candidate.matchedThemes.filter(value => !covered.themes.has(value));
        return {
          ...candidate,
          adds: { outcomes: newOutcomes, blockers: newBlockers, themes: newThemes },
          complementScore: candidate.score + newOutcomes.length * 8 + newBlockers.length * 5 + newThemes.length * 3
        };
      })
      .filter(candidate => candidate.adds.outcomes.length + candidate.adds.blockers.length + candidate.adds.themes.length > 0)
      .sort((a, b) => b.complementScore - a.complementScore || b.score - a.score);

    if (!options.length) break;
    const selected = options[0];
    supporting.push(selected);
    selected.adds.outcomes.forEach(value => covered.outcomes.add(value));
    selected.adds.blockers.forEach(value => covered.blockers.add(value));
    selected.adds.themes.forEach(value => covered.themes.add(value));
    remaining = remaining.filter(candidate => candidate.moduleId !== selected.moduleId);
  }

  return { scenario, core, supporting, candidates: ranked.slice(0, 5) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const scenarioPath = process.argv[2];
  if (!scenarioPath) {
    console.error('Usage: node scripts/match-offsite.mjs <scenario.json>');
    process.exit(1);
  }
  const scenario = JSON.parse(await readFile(resolve(scenarioPath), 'utf8'));
  const data = await loadMatchingData();
  console.log(JSON.stringify(matchOffsite(scenario, data), null, 2));
}
