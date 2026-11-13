#!/usr/bin/env node

/** Serve the static DUCK prototype locally without exposing repository files. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_PORT = 3000;
const STATIC_ROOT = path.resolve(__dirname);
const MIME_TYPES = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
});

function isInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

function isPublicFile(root, candidate) {
  if (!isInside(root, candidate)) return false;
  const relative = path.relative(root, candidate);
  if (relative.split(path.sep).some((segment) => segment.startsWith('.'))) return false;
  return Object.hasOwn(MIME_TYPES, path.extname(candidate).toLowerCase());
}

function resolveRequestPath(requestUrl, root = STATIC_ROOT) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(requestUrl, 'http://127.0.0.1').pathname);
  } catch {
    return null;
  }

  if (pathname.includes('\0') || pathname.includes('\\')) return null;
  if (pathname === '/') pathname = '/index.html';

  const resolvedRoot = path.resolve(root);
  const candidate = path.resolve(resolvedRoot, `.${path.sep}${pathname.replace(/^\/+/, '')}`);
  if (!isInside(resolvedRoot, candidate)) return null;

  if (!isPublicFile(resolvedRoot, candidate)) return null;
  return candidate;
}

function send(res, status, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function createServer({ root = STATIC_ROOT } = {}) {
  const resolvedRoot = path.resolve(root);
  const realRoot = fs.realpathSync(resolvedRoot);

  return http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', 'GET, HEAD');
      send(res, 405, req.method === 'HEAD' ? '' : 'Method not allowed.\n');
      return;
    }

    const filePath = resolveRequestPath(req.url || '/', resolvedRoot);
    if (!filePath) {
      send(res, 404, req.method === 'HEAD' ? '' : 'Not found.\n');
      return;
    }

    fs.promises.realpath(filePath)
      .then((realPath) => {
        if (!isPublicFile(realRoot, realPath)) {
          send(res, 404, req.method === 'HEAD' ? '' : 'Not found.\n');
          return null;
        }
        return fs.promises.stat(realPath).then((stat) => ({ realPath, stat }));
      })
      .then((result) => {
        if (!result) return;
        if (!result.stat.isFile()) {
          send(res, 404, req.method === 'HEAD' ? '' : 'Not found.\n');
          return;
        }
        return fs.promises.readFile(result.realPath).then((content) => {
          send(res, 200, req.method === 'HEAD' ? '' : content, MIME_TYPES[path.extname(result.realPath).toLowerCase()]);
        });
      })
      .catch((error) => {
        if (['ENOENT', 'ENOTDIR', 'EISDIR', 'EACCES', 'EPERM'].includes(error.code)) {
          send(res, 404, req.method === 'HEAD' ? '' : 'Not found.\n');
          return;
        }
        send(res, 500, req.method === 'HEAD' ? '' : 'Internal server error.\n');
      });
  });
}

function start() {
  const port = Number(process.env.PORT || DEFAULT_PORT);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('PORT must be an integer between 0 and 65535.');
  }

  const server = createServer();
  server.on('error', (error) => {
    console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use.` : 'The local server could not start.');
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => {
    const address = server.address();
    console.debug(`DUCK local preview: http://127.0.0.1:${address.port}`);
  });
  return server;
}

if (require.main === module) start();

module.exports = { createServer, isInside, isPublicFile, resolveRequestPath };
