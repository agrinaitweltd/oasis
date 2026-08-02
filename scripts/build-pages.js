// Converts each mirrored WordPress page into a Next.js app/<slug>/page.tsx
// using the shared Header/Footer + a raw-HTML content region (dangerouslySetInnerHTML)
// to guarantee pixel-perfect fidelity to the mirror at scale (~120 pages).
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MIRROR = path.join(ROOT, "arbor-education.com");
const APP = path.join(ROOT, "app");

function findIndexDirs(dir, base = "") {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (e.name.startsWith("_") || e.name.startsWith(".") || e.name === "wp-content" || e.name === "wp-includes" || e.name === "wp-json" || e.name === "wp-admin" || e.name === "xmlrpc.php") continue;
    const full = path.join(dir, e.name);
    const idx = path.join(full, "index.html");
    const rel = base ? base + "/" + e.name : e.name;
    if (fs.existsSync(idx)) {
      results.push({ slug: rel, file: idx });
    }
    // recurse one level for nested pages like products/group-mat-mis
    results.push(...findIndexDirs(full, rel));
  }
  return results;
}

function extractBetween(html, startMarker, endMarker) {
  const s = html.indexOf(startMarker);
  if (s === -1) return null;
  const e = html.indexOf(endMarker, s);
  if (e === -1) return null;
  return html.slice(s, e + endMarker.length);
}

function extractMain(html) {
  // Grab from <main id="wp--skip-link--target" ...> to its matching </main>
  const startIdx = html.indexOf('id="wp--skip-link--target"');
  if (startIdx === -1) return null;
  const mainOpenStart = html.lastIndexOf("<main", startIdx);
  if (mainOpenStart === -1) return null;
  const openTagEnd = html.indexOf(">", startIdx) + 1;
  // naive matching: find the FIRST "</main>" after start (single <main> per page in this theme)
  const closeIdx = html.indexOf("</main>", openTagEnd);
  if (closeIdx === -1) return null;
  return html.slice(openTagEnd, closeIdx);
}

function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/);
  if (!m) return "Arbor Education";
  return m[1]
    .replace(/&#8211;/g, "-")
    .replace(/&amp;/g, "&")
    .trim();
}

function extractDescription(html) {
  const m = html.match(/<meta name="description" content="([^"]*)"/);
  if (!m) return "";
  return m[1]
    .replace(/&hellip;/g, "…")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .trim();
}

function rewriteUrls(html) {
  return html
    .replace(/https?:\/\/arbor-education\.com/g, "")
    .replace(/https?:\/\/www\.arbor-education\.com/g, "")
    .replace(/\s(loading|decoding|fetchpriority)="[^"]*"/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function toComponentName(slug) {
  return (
    "Page_" +
    slug
      .split("/")
      .map((s) => s.replace(/[^a-zA-Z0-9]/g, "_"))
      .join("_")
  );
}

function buildPageTsx(title, description, innerHtml, mainClass) {
  const escapedHtml = innerHtml
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
  return `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(description)},
};

export default function Page() {
  return (
    <div
      className={${JSON.stringify(mainClass)}}
      dangerouslySetInnerHTML={{ __html: \`${escapedHtml}\` }}
    />
  );
}
`;
}

function main() {
  const pages = findIndexDirs(MIRROR);
  let ok = 0,
    fail = [];

  // homepage
  const homeHtml = fs.readFileSync(path.join(MIRROR, "index.html"), "utf8");
  processPage("", homeHtml, path.join(APP, "page.tsx"));

  // other top-level .html files (e.g. workflows.html -> /workflows)
  const topLevelHtml = fs
    .readdirSync(MIRROR, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".html") && e.name !== "index.html");
  for (const e of topLevelHtml) {
    const slug = e.name.replace(/\.html$/, "");
    const html = fs.readFileSync(path.join(MIRROR, e.name), "utf8");
    const outDir = path.join(APP, slug);
    fs.mkdirSync(outDir, { recursive: true });
    const success = processPage(slug, html, path.join(outDir, "page.tsx"));
    if (success) ok++;
    else fail.push(slug);
  }

  for (const { slug, file } of pages) {
    const html = fs.readFileSync(file, "utf8");
    const outDir = path.join(APP, slug);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, "page.tsx");
    const success = processPage(slug, html, outFile);
    if (success) ok++;
    else fail.push(slug);
  }

  console.log(`Converted ${ok} pages. Failed: ${fail.length}`);
  if (fail.length) console.log(fail.join("\n"));
}

function processPage(slug, html, outFile) {
  const mainInner = extractMain(html);
  if (!mainInner) return false;
  const title = extractTitle(html);
  const description = extractDescription(html);
  const rewritten = rewriteUrls(mainInner);
  // figure out main's class attribute from original for wrapper styling
  const classMatch = html.match(/<main id="wp--skip-link--target" class="([^"]*)"/);
  const mainClass = classMatch ? classMatch[1] : "wp-block-group is-layout-flow wp-block-group-is-layout-flow";
  const tsx = buildPageTsx(title, description, rewritten, mainClass);
  fs.writeFileSync(outFile, tsx);
  return true;
}

main();
