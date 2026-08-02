const fs = require('fs');
const html = fs.readFileSync('arbor-education.com/index.html', 'utf8');
const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/g;
let m, blocks = [];
while ((m = styleRe.exec(html))) blocks.push(m[1]);
const seen = new Set();
const uniqueBlocks = blocks.filter(b => {
  const key = b.trim();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
fs.writeFileSync('styles/globals.css', uniqueBlocks.join('\n\n'));
console.log('blocks:', blocks.length, 'unique:', uniqueBlocks.length, 'size KB:', Math.round(uniqueBlocks.join('').length/1024));

const linkRe = /<link[^>]*rel=["']stylesheet["'][^>]*>/g;
let links = html.match(linkRe) || [];
fs.writeFileSync('scripts/_links.txt', links.join('\n'));
console.log('stylesheet links:', links.length);
