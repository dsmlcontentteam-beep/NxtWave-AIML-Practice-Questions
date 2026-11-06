/**
 * data/questions.csv → src/data/questions.generated.json, after checking every row.
 * Runs automatically before `npm run dev`, `npm run build` and `npm test`.
 * Set SHOW_DRAFTS=true (e.g. on Vercel Preview) to include draft rows, marked "Draft".
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { loadQuestions } from './sheet.mjs';

const root = new URL('../', import.meta.url);
const csv = readFileSync(new URL('data/questions.csv', root), 'utf8');
const categories = JSON.parse(readFileSync(new URL('data/categories.json', root), 'utf8'));
const showDrafts = /^(1|true|yes)$/i.test(process.env.SHOW_DRAFTS ?? '');

const { questions, errors, stats } = loadQuestions(csv, categories, { showDrafts });
if (errors.length) {
  console.error(`\n✗ data/questions.csv has ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error('\nFix the sheet (see docs/QUESTIONS-SHEET.md) and run again.\n');
  process.exit(1);
}
writeFileSync(
  new URL('src/data/questions.generated.json', root),
  `${JSON.stringify({ showDrafts, questions }, null, 2)}\n`,
);
console.log(
  `✓ questions: ${questions.length} on the page (${stats.live} live, ${stats.draft} draft${showDrafts ? ' shown' : ' hidden'}, ${stats.hidden} hidden)`,
);
