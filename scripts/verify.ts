/**
 * Regression gate for the converter. Regenerates all derived output, then fails
 * if anything drifted from the committed "golden" copy under version control.
 *
 * The committed `docs/chapters/*.md`, `docs/index.md`, and
 * `docs/.vitepress/sidebar.generated.json` ARE the golden baseline: they were
 * produced by this converter and reviewed before commit. So "correct output" is
 * defined as "byte-identical to what is committed". A clean tree after a convert
 * run means the converter still produces the blessed output (and, run twice, is
 * idempotent). Any drift is either an intended converter change — review and
 * commit it as the new golden — or a regression.
 *
 * Usage:  bun run verify     (CI sets SOURCE_DIR to the freshly built HTML)
 * Exit 0 = output matches committed golden. Exit 1 = drift (diff printed).
 */
import { spawnSync } from 'node:child_process';

const GENERATED = [
  'docs/chapters',
  'docs/index.md',
  'docs/.vitepress/sidebar.generated.json',
];

function run(cmd: string, args: string[]) {
  return spawnSync(cmd, args, { encoding: 'utf8' });
}

// 1. Regenerate everything from source HTML.
const convert = run('bun', ['run', 'scripts/convert-to-md.ts']);
process.stdout.write(convert.stdout ?? '');
if (convert.status !== 0) {
  process.stderr.write(convert.stderr ?? '');
  console.error('\n✗ convert step failed.');
  process.exit(convert.status ?? 1);
}

// 2. Drift check: `git status --porcelain` catches BOTH modified tracked files
//    and brand-new untracked output (e.g. a newly added chapter) — `git diff`
//    alone would miss the latter.
const porcelain = run('git', ['status', '--porcelain', '--', ...GENERATED]).stdout.trim();

if (porcelain) {
  console.error('\n✗ Converter output drifted from the committed golden:\n');
  console.error(porcelain);
  console.error(`\n  Inspect:  git diff -- ${GENERATED.join(' ')}`);
  console.error('  If intended, commit the regenerated output as the new golden.');
  console.error('  If not, the converter regressed — fix it before committing.\n');
  process.exit(1);
}

console.log('\n✓ Converter output matches the committed golden (no drift, idempotent).');
