import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { loadMatchingData, matchOffsite } from './match-offsite.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const scenarios = JSON.parse(await readFile(resolve(here, '../tests/offsite-scenarios.json'), 'utf8'));
const data = await loadMatchingData();
let failures = 0;

for (const scenario of scenarios) {
  const result = matchOffsite(scenario, data);
  const actual = result.core?.moduleId || 'NO_MATCH';
  const actualSupporting = result.supporting.map(item => item.moduleId);
  const supportPassed = !scenario.expectedSupportingAny
    || scenario.expectedSupportingAny.some(moduleId => actualSupporting.includes(moduleId));
  const passed = actual === scenario.expectedCore && supportPassed;
  if (!passed) failures += 1;

  console.log(`${passed ? 'PASS' : 'FAIL'} ${scenario.id}`);
  console.log(`  expected: ${scenario.expectedCore}`);
  console.log(`  actual:   ${actual}${result.core ? ` (${result.core.score})` : ''}`);
  console.log(`  support:  ${actualSupporting.join(', ') || 'none'}`);
  if (scenario.expectedSupportingAny) console.log(`  expected support includes: ${scenario.expectedSupportingAny.join(' or ')}`);
  if (!passed) console.log(`  top five: ${result.candidates.map(item => `${item.moduleId} (${item.score})`).join(', ')}`);
}

console.log(`\n${scenarios.length - failures}/${scenarios.length} scenarios passed.`);
if (failures) process.exit(1);
