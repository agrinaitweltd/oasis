const fs = require('fs');
const path = require('path');

const SKIP_DIRS = new Set([
  'wp-json', 'feed', 'comments', 'tag', 'category', 'srv', '_jb_static',
  'wp-content', 'wp-includes',
]);

function findPages(mirrorDir) {
  const pages = [];
  // top-level index.html -> route "/"
  pages.push({ route: '/', file: path.join(mirrorDir, 'index.html'), slug: '' });
  // workflows.html -> /workflows
  const wf = path.join(mirrorDir, 'workflows.html');
  if (fs.existsSync(wf)) pages.push({ route: '/workflows', file: wf, slug: 'workflows' });

  const entries = fs.readdirSync(mirrorDir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (SKIP_DIRS.has(e.name)) continue;
    const idx = path.join(mirrorDir, e.name, 'index.html');
    if (fs.existsSync(idx)) {
      pages.push({ route: '/' + e.name, file: idx, slug: e.name });
    }
    // one level of real nested content pages (about-us/*, products/*)
    // but exclude WP infra: feed, comments
    const subEntries = fs.readdirSync(path.join(mirrorDir, e.name), { withFileTypes: true });
    for (const sub of subEntries) {
      if (!sub.isDirectory()) continue;
      if (sub.name === 'feed' || sub.name === 'comments') continue;
      const subIdx = path.join(mirrorDir, e.name, sub.name, 'index.html');
      if (fs.existsSync(subIdx)) {
        pages.push({
          route: '/' + e.name + '/' + sub.name,
          file: subIdx,
          slug: e.name + '/' + sub.name,
        });
      }
    }
  }
  return pages;
}

module.exports = { findPages };
