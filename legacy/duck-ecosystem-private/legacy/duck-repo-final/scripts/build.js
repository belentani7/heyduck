/**
 * DUCK PROD - Build Script
 * Prepara um pacote estático para produção.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const BUILD_DIR = path.join(ROOT_DIR, 'dist');
const cssFiles = [
  'css/tokens.css', 'css/tokens-premium.css', 'css/base.css', 'css/utilities.css',
  'css/accessibility.css', 'css/navigation.css', 'css/hero.css', 'css/sections.css',
  'css/instruments.css', 'css/components.css', 'css/buttons.css', 'css/buttons-premium.css',
  'css/cards.css', 'css/cards-premium.css', 'css/forms.css', 'css/modals.css',
  'css/animations-premium.css', 'css/cursor.css', 'css/responsive.css',
];
const jsFiles = [
  'js/data.js', 'js/animations.js', 'js/hover-effects.js', 'js/micro-interactions.js',
  'js/particles.js', 'js/main.js',
];

function concatFiles(files) {
  return files.map((file) => {
    const filePath = path.join(ROOT_DIR, file);
    if (!fs.existsSync(filePath)) throw new Error(`Missing build input: ${file}`);
    console.debug(`  bundled ${file}`);
    return fs.readFileSync(filePath, 'utf8');
  }).join('\n');
}

function copyFile(relativePath) {
  const destination = path.join(BUILD_DIR, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(ROOT_DIR, relativePath), destination);
  console.debug(`  copied ${relativePath}`);
}

function copyDirectory(sourceDir, destinationDir) {
  fs.mkdirSync(destinationDir, { recursive: true });
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const source = path.join(sourceDir, entry.name);
    const destination = path.join(destinationDir, entry.name);
    if (entry.isDirectory()) copyDirectory(source, destination);
    else fs.copyFileSync(source, destination);
  }
}

fs.mkdirSync(BUILD_DIR, { recursive: true });
console.debug('DUCK PROD build\n');

console.debug('Bundling CSS...');
const cssContent = concatFiles(cssFiles).replace(/\.\.\/images\//g, 'images/');
fs.writeFileSync(path.join(BUILD_DIR, 'styles.min.css'), cssContent);
console.debug(`  dist/styles.min.css (${(cssContent.length / 1024).toFixed(1)}KB)\n`);

console.debug('Copying ES modules...');
jsFiles.forEach(copyFile);
console.debug('');

console.debug('Copying media...');
copyDirectory(path.join(ROOT_DIR, 'images'), path.join(BUILD_DIR, 'images'));
console.debug('  dist/images\n');

const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const optimizedHtml = indexHtml
  .replace(/<!-- Modular CSS \(dependency order\)-->/g, '<link rel="stylesheet" href="styles.min.css">')
  .replace(/\s*<link rel="stylesheet" href="css\/[^\"]*">/g, '');

fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), optimizedHtml);
console.debug('dist/index.html ready\n');
console.debug('Build complete: /dist');
