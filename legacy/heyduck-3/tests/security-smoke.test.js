const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');

const root = join(__dirname, '..');
const source = readFileSync(join(root, 'index.html'), 'utf8');

test('renders user messages as text and assistant markup through an allowlist', () => {
  assert.match(source, /if \(role === 'user'\)[\s\S]*?div\.textContent = text/);
  assert.match(source, /allowedTags = new Set\(\['BR', 'STRONG'\]\)/);
  assert.doesNotMatch(source, /div\.innerHTML\s*=\s*text/);
});

test('declares one production canonical URL', () => {
  const canonicals = [...source.matchAll(/<link rel="canonical" href="([^"]+)">/g)];
  assert.equal(canonicals.length, 1);
  assert.equal(canonicals[0][1], 'https://heyduck.netlify.app/');
});

test('preserves the two audited portfolio variants', () => {
  assert.equal(existsSync(join(root, '02-DUCK-FUSIONADO-COMPLETO.html')), true);
  assert.equal(existsSync(join(root, 'DUCK-MEGA-UNIFICADO.html')), true);
});
