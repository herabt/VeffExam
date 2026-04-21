/**
 * HTML post-processing: inject anchor IDs on headings so TOC links work.
 *
 * Ports the logic from `/tmp/fix-toc.py` in the VeffExam project:
 *   1. Every h2/h3/h4 that lacks an `id` gets `id="slug(text)"`.
 *   2. Every `<li>` whose text exactly matches a heading text (ignoring
 *      leading numbering like "1." or "1.2") is wrapped with `<a href="#id">`.
 */

export function slugify(text: string, prefix: string): string {
  const stripped = text
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/gi, "")
    .trim()
    .toLowerCase();
  const slug = stripped.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug ? `${prefix}-${slug}` : prefix;
}

function normalise(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function stripLeadingNumbering(text: string): string {
  return text.replace(/^\s*[\d.]+\s*[-.]?\s*/, "").trim();
}

/**
 * Transform a fragment HTML string:
 *   - Add missing `id=` on h2/h3/h4.
 *   - Rewrite matching `<li>` entries to anchor links.
 *
 * The prefix is used to namespace IDs so they don't collide with anchors
 * from other fragments rendered on the same page.
 */
export function injectAnchors(html: string, prefix: string): string {
  const headingMap = new Map<string, string>();
  const used = new Set<string>();

  const withIds = html.replace(
    /<(h[234])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_full, tag: string, attrs: string, inner: string) => {
      const existing = /\sid="([^"]+)"/.exec(attrs);
      if (existing) {
        headingMap.set(normalise(inner), existing[1]);
        return `<${tag}${attrs}>${inner}</${tag}>`;
      }
      const base = slugify(inner, prefix);
      let slug = base;
      let i = 2;
      while (used.has(slug)) {
        slug = `${base}-${i++}`;
      }
      used.add(slug);
      headingMap.set(normalise(inner), slug);
      return `<${tag}${attrs} id="${slug}">${inner}</${tag}>`;
    },
  );

  // Second pass: rewrite <li>TEXT</li> that matches a heading.
  return withIds.replace(/<li>([\s\S]*?)<\/li>/gi, (full, inner: string) => {
    if (/<a\b/i.test(inner)) return full; // already linked
    const key = normalise(inner);
    const slug =
      headingMap.get(key) ??
      (() => {
        const s = stripLeadingNumbering(key);
        if (!s) return undefined;
        for (const [hk, v] of headingMap) {
          if (stripLeadingNumbering(hk) === s) return v;
        }
        return undefined;
      })();
    if (!slug) return full;
    return `<li><a href="#${slug}">${inner}</a></li>`;
  });
}
