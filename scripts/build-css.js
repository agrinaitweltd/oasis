// Dedupe all Jetpack-Boost combined CSS bundles + inline block styles into styles/globals.css
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mirror = path.join(root, 'arbor-education.com');
const jbDir = path.join(mirror, '_jb_static');

function splitTopLevel(css) {
  // split into top-level statements respecting brace depth
  const out = [];
  let depth = 0, start = 0;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        out.push(css.slice(start, i + 1).trim());
        start = i + 1;
      }
    }
  }
  return out.filter(Boolean);
}

const seen = new Set();
const rules = [];

// 1. jb_static combined bundles (theme + plugin CSS, already minified)
const cssFiles = fs.readdirSync(jbDir).filter(f => f.endsWith('.css'));
for (const f of cssFiles) {
  const content = fs.readFileSync(path.join(jbDir, f), 'utf8');
  for (const stmt of splitTopLevel(content)) {
    if (!seen.has(stmt)) { seen.add(stmt); rules.push(stmt); }
  }
}

fs.writeFileSync(path.join(root, 'styles', 'globals.css'), rules.join('\n') + '\n');
console.log('globals.css rules:', rules.length, 'from', cssFiles.length, 'bundles');

// 2. dedupe inline <style> blocks (core-block-supports-inline-css etc.) across ALL pages -> blocks.css
const glob = require('./lib-find-pages');
const pages = glob.findPages(mirror);
const blockSeen = new Set(seen); // avoid re-adding dupes already in globals
const blockRules = [];
const cheerio = require('cheerio');
for (const p of pages) {
  const html = fs.readFileSync(p.file, 'utf8');
  const $ = cheerio.load(html);
  $('style').each((i, el) => {
    const txt = $(el).html() || '';
    for (const stmt of splitTopLevel(txt)) {
      if (!blockSeen.has(stmt)) { blockSeen.add(stmt); blockRules.push(stmt); }
    }
  });
}
fs.writeFileSync(path.join(root, 'styles', 'blocks.css'), blockRules.join('\n') + '\n');
console.log('blocks.css rules:', blockRules.length);
