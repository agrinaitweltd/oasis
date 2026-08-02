const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const MIRROR = path.join(ROOT, "arbor-education.com");

const dirs = fs
  .readdirSync(path.join(ROOT, "app"))
  .filter((d) => d.startsWith("blog-"));

const posts = dirs
  .map((slug) => {
    const mirrorFile = path.join(MIRROR, slug, "index.html");
    if (!fs.existsSync(mirrorFile)) return null;
    const html = fs.readFileSync(mirrorFile, "utf8");
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
    let title = titleMatch ? titleMatch[1] : slug;
    title = title.replace(/&#8211;.*$/, "").replace(/&amp;/g, "&").trim();
    return { slug, title };
  })
  .filter(Boolean)
  .sort((a, b) => a.title.localeCompare(b.title));

const tsx = `import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - Arbor",
  description: "Management Information System (MIS) for schools",
};

const posts = ${JSON.stringify(posts, null, 2)};

export default function BlogIndexPage() {
  return (
    <div className="wp-block-group is-layout-flow wp-block-group-is-layout-flow has-global-padding" style={{ paddingTop: 64, paddingBottom: 64, maxWidth: 1000, margin: "0 auto" }}>
      <h1>Blog</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((p) => (
          <li key={p.slug} style={{ marginBottom: "1em" }}>
            <Link href={\`/\${p.slug}/\`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.mkdirSync(path.join(ROOT, "app", "blog"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "app", "blog", "page.tsx"), tsx);
console.log("Blog index built with", posts.length, "posts");
