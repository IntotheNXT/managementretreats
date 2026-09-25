import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const academyPath = resolve(process.argv[2] || `${here}/../catalog-en.json`);
const matchingPath = resolve(process.argv[3] || `${here}/../data/offsite-matching.json`);
const facilitatorsPath = resolve(process.argv[4] || `${here}/../data/facilitators.json`);

const [academy, matching, facilitatorData] = await Promise.all(
  [academyPath, matchingPath, facilitatorsPath].map(async path => JSON.parse(await readFile(path, 'utf8')))
);

const errors = [];
const warnings = [];
const requiredFormats = ['two-hours', 'half-day', 'full-day', 'two-days'];

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  values.forEach(value => (seen.has(value) ? duplicates.add(value) : seen.add(value)));
  return [...duplicates];
}

function validateReferences(module, field, allowed) {
  for (const value of module[field] || []) {
    if (!allowed.has(value)) errors.push(`${module.moduleId}: unknown ${field} value '${value}'`);
  }
}

const academyModules = new Map(academy.modules.map(module => [module.id, module]));
const matchingModules = new Map(matching.modules.map(module => [module.moduleId, module]));
const facilitators = new Map(facilitatorData.facilitators.map(profile => [profile.id, profile]));
const academyNameToProfile = new Map();

for (const profile of facilitatorData.facilitators) {
  for (const academyName of profile.academyNames || []) {
    if (academyNameToProfile.has(academyName)) {
      errors.push(`Academy facilitator name '${academyName}' resolves to more than one profile`);
    }
    academyNameToProfile.set(academyName, profile);
  }
}

for (const duplicate of duplicateValues(academy.modules.map(module => module.id))) {
  errors.push(`Duplicate Academy module id '${duplicate}'`);
}
for (const duplicate of duplicateValues(matching.modules.map(module => module.moduleId))) {
  errors.push(`Duplicate offsite module id '${duplicate}'`);
}
for (const duplicate of duplicateValues(facilitatorData.facilitators.map(profile => profile.id))) {
  errors.push(`Duplicate facilitator id '${duplicate}'`);
}

for (const moduleId of academyModules.keys()) {
  if (!matchingModules.has(moduleId)) errors.push(`Academy module '${moduleId}' has no offsite metadata`);
}
for (const moduleId of matchingModules.keys()) {
  if (!academyModules.has(moduleId)) errors.push(`Offsite metadata references missing Academy module '${moduleId}'`);
}

const vocabulary = {
  primaryThemes: new Set(matching.vocabulary.themes.map(item => item.id)),
  secondaryThemes: new Set(matching.vocabulary.themes.map(item => item.id)),
  outcomes: new Set(matching.vocabulary.outcomes.map(item => item.id)),
  blockers: new Set(matching.vocabulary.blockers.map(item => item.id))
};
const formatFitValues = new Set(matching.vocabulary.formatFitValues);
const proposalRoles = new Set(matching.vocabulary.proposalRoles);
const recommendationStatuses = new Set(matching.vocabulary.recommendationStatuses);

for (const module of matching.modules) {
  for (const [field, allowed] of Object.entries(vocabulary)) validateReferences(module, field, allowed);

  if (!module.primaryThemes?.length) errors.push(`${module.moduleId}: at least one primary theme is required`);
  if (!module.outcomes?.length) errors.push(`${module.moduleId}: at least one outcome is required`);
  if (!module.blockers?.length) errors.push(`${module.moduleId}: at least one blocker is required`);

  for (const format of requiredFormats) {
    const value = module.formatFit?.[format];
    if (!value) errors.push(`${module.moduleId}: missing formatFit.${format}`);
    else if (!formatFitValues.has(value)) errors.push(`${module.moduleId}: invalid format fit '${value}'`);
  }

  for (const role of module.proposalRoles || []) {
    if (!proposalRoles.has(role)) errors.push(`${module.moduleId}: invalid proposal role '${role}'`);
  }

  if (!recommendationStatuses.has(module.recommendationStatus)) {
    errors.push(`${module.moduleId}: invalid recommendation status '${module.recommendationStatus}'`);
  }
  if (module.recommendationStatus === 'hold' && !module.holdReason) {
    errors.push(`${module.moduleId}: holdReason is required when recommendationStatus is hold`);
  }

  const academyModule = academyModules.get(module.moduleId);
  if (!academyModule) continue;
  const eligible = (academyModule.facilitators || [])
    .map(name => academyNameToProfile.get(name))
    .filter(profile => profile?.active && profile?.offsiteEligible);

  if (module.recommendationStatus === 'active' && eligible.length === 0) {
    errors.push(`${module.moduleId}: active module has no active, offsite-eligible facilitator profile`);
  }
}

const academyFacilitatorNames = new Set(academy.modules.flatMap(module => module.facilitators || []));
for (const name of academyFacilitatorNames) {
  if (!academyNameToProfile.has(name)) warnings.push(`Academy facilitator '${name}' has no Management Offsites profile`);
}
for (const profile of facilitators.values()) {
  const used = (profile.academyNames || []).some(name => academyFacilitatorNames.has(name));
  if (profile.active && profile.offsiteEligible && !used) {
    warnings.push(`Active offsite facilitator '${profile.id}' is not linked to any Academy module`);
  }
}

console.log(`Validated ${academyModules.size} Academy modules, ${matchingModules.size} offsite mappings and ${facilitators.size} facilitator profiles.`);
warnings.forEach(message => console.warn(`WARNING: ${message}`));
errors.forEach(message => console.error(`ERROR: ${message}`));

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s) and ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`Validation passed with ${warnings.length} warning(s).`);
