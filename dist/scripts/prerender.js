const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'dist'
]);

async function copyRecursive(src, dest) {
  const stat = await fs.stat(src);
  if (stat.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await copyRecursive(path.join(src, entry.name), path.join(dest, entry.name));
    }
    return;
  }

  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

async function resolveIncludes(filePath, seen = new Set()) {
  const key = path.resolve(filePath);
  if (seen.has(key)) {
    throw new Error(`Zirkuläres Include erkannt: ${filePath}`);
  }

  seen.add(key);
  const source = await fs.readFile(filePath, 'utf8');
  const includePattern = /<div\s+data-include=["']([^"']+)["']\s*><\/div>/g;

  let replaced = source;
  let match;
  while ((match = includePattern.exec(source)) !== null) {
    const includeTarget = match[1];
    const includePath = path.resolve(path.dirname(filePath), includeTarget);
    const includeContent = await resolveIncludes(includePath, new Set(seen));
    replaced = replaced.replace(match[0], includeContent);
  }

  return replaced;
}

async function prerenderHtmlFiles() {
  const entries = await fs.readdir(DIST_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const htmlPath = path.join(DIST_DIR, entry.name);
    const output = await resolveIncludes(htmlPath);
    await fs.writeFile(htmlPath, output, 'utf8');
  }
}

async function updateSitemapLastmod() {
  const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
  try {
    const xml = await fs.readFile(sitemapPath, 'utf8');
    const buildDate = new Date().toISOString().slice(0, 10);
    const updated = xml.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${buildDate}</lastmod>`);
    await fs.writeFile(sitemapPath, updated, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') return;
    throw error;
  }
}

async function main() {
  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await fs.mkdir(DIST_DIR, { recursive: true });

  const entries = await fs.readdir(ROOT_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const src = path.join(ROOT_DIR, entry.name);
    const dest = path.join(DIST_DIR, entry.name);
    await copyRecursive(src, dest);
  }

  await prerenderHtmlFiles();
  await updateSitemapLastmod();
  console.log('Prerender abgeschlossen: dist/*.html enthält aufgelöste Komponenten.');
}

main().catch((error) => {
  console.error('Prerender fehlgeschlagen:', error);
  process.exit(1);
});
