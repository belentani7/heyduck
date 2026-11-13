const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');

const manifest = require('../package.json');
const { createServer } = require('../server');

let temporaryRoot;
let siteRoot;
let server;
let port;

function request(requestPath, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: requestPath, method }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: Buffer.concat(chunks).toString('utf8'),
      }));
    });
    req.on('error', reject);
    req.end();
  });
}

before(async () => {
  temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'duck-static-test-'));
  siteRoot = path.join(temporaryRoot, 'site');
  await fs.mkdir(siteRoot);
  await fs.writeFile(path.join(siteRoot, 'index.html'), '<main>local preview</main>');
  await fs.writeFile(path.join(siteRoot, '.env'), 'must stay private');
  await fs.writeFile(path.join(temporaryRoot, 'outside.html'), '<main>outside root</main>');
  await fs.symlink(path.join(temporaryRoot, 'outside.html'), path.join(siteRoot, 'linked.html'));
  await fs.symlink(path.join(siteRoot, '.env'), path.join(siteRoot, 'linked-secret.html'));

  server = createServer({ root: siteRoot });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  port = server.address().port;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  if (temporaryRoot) await fs.rm(temporaryRoot, { recursive: true, force: true });
});

test('manifest starts the CommonJS server and defines no missing workspaces', () => {
  assert.equal(manifest.type, 'commonjs');
  assert.equal(manifest.scripts.start, 'node server.js');
  assert.equal(manifest.workspaces, undefined);
});

test('serves the site root with safe response headers', async () => {
  const result = await request('/');
  assert.equal(result.status, 200);
  assert.match(result.headers['content-type'], /^text\/html/);
  assert.equal(result.headers['x-content-type-options'], 'nosniff');
  assert.match(result.body, /local preview/);
});

test('blocks traversal, symlink escapes, dotfiles, and repository metadata', async () => {
  for (const route of ['/%2e%2e%2foutside.html', '/linked.html', '/linked-secret.html', '/.env', '/package.json']) {
    const result = await request(route);
    assert.equal(result.status, 404, `Expected ${route} to be hidden`);
    assert.doesNotMatch(result.body, /outside root|must stay private|scripts/);
  }
});

test('does not reflect an attacker-controlled URL into the error page', async () => {
  const result = await request('/%3Cscript%3Ealert(1)%3C%2Fscript%3E.html');
  assert.equal(result.status, 404);
  assert.equal(result.body, 'Not found.\n');
});

test('supports HEAD and rejects methods other than GET or HEAD', async () => {
  const head = await request('/', 'HEAD');
  assert.equal(head.status, 200);
  assert.equal(head.body, '');
  const post = await request('/', 'POST');
  assert.equal(post.status, 405);
  assert.equal(post.headers.allow, 'GET, HEAD');
});
