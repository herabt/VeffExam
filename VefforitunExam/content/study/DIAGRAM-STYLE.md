# Diagram style reference

Every diagram must be **inline SVG** — no external images, no JS, no CSS files. Drop the SVG directly into the fragment HTML at the most educational position (usually right after the heading it illustrates). Each diagram is a teaching aid; if the diagram is decorative only, skip it.

## Wrapping

Wrap every diagram with:

```html
<figure class="fig-dia">
  <svg viewBox="0 0 W H" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Short description">
    ...content...
  </svg>
  <figcaption>One short sentence explaining what the diagram shows.</figcaption>
</figure>
```

Where:
- `W H` = sensible viewBox dimensions (no fixed width/height on the SVG — let CSS handle scaling).
- `role="img"` + `aria-label` is mandatory for accessibility.
- `figcaption` is mandatory — the caption is the "summary" of the diagram for a rushed reader.

## Colour tokens (use via CSS variables inside SVG)

These theme-aware tokens are available and render correctly in both light and dark mode:

| Variable | Use for |
|---|---|
| `var(--fg)` | primary text, primary strokes |
| `var(--fg-muted)` | secondary text, dotted lines |
| `var(--fg-subtle)` | tertiary text, background labels |
| `var(--border)` | box outlines, separators |
| `var(--border-strong)` | emphasised outlines |
| `var(--surface)` | plain box fills |
| `var(--surface-alt)` | alternate box fills (zebra) |
| `var(--bg)` | page background (useful as inner fill) |
| `var(--bg-raised)` | raised block fills |
| `var(--accent)` | primary accent (teal) — use for "current / selected / active" |
| `var(--success)` | correct/positive — green |
| `var(--warning)` | caution — amber |
| `var(--danger)` | error/trap — red |

Example: `<rect fill="var(--surface)" stroke="var(--border-strong)" />`, `<text fill="var(--fg)">Label</text>`.

For colour families beyond tokens (e.g. four distinct "lane" colours), use OKLCH directly — but low chroma: `oklch(0.70 0.10 200)`, `oklch(0.70 0.10 80)`, `oklch(0.70 0.10 320)`, `oklch(0.70 0.10 140)`. Avoid saturated primaries.

## Typography inside SVG

Use the app fonts:

- Monospace (for code, kbd, axis tick labels): `font-family: var(--f-mono)` or fall back to `"JetBrains Mono", monospace`.
- Sans (for narrative labels, body text): `font-family: var(--f-body)` or fall back to `Atkinson Hyperlegible, sans-serif`.

Text sizes: 10–14px inside SVG feels right at the ~660px content width.

## Layout constraints

- Content area is ~660px wide; your SVG should fit comfortably. ViewBox width ~600–900 is fine (it scales).
- Max height ~400px. If the content needs more, split into two figures.
- Leave ≥ 8px internal padding inside the viewBox — don't butt shapes against the edges.
- Align on an 8pt grid where possible for a crisp feel.

## Good diagram types for this project

| Type | When to use | Pattern |
|---|---|---|
| **Flow** (boxes + arrows) | Sequences, state machines, request cycles | rect → arrow → rect, vertical or horizontal |
| **Axis** (axes + labels) | Explaining coordinate systems (flexbox main/cross, z-index stack) | two perpendicular arrows + callouts |
| **Sequence** (lanes) | Client-server interactions, async ordering | vertical lanes with horizontal arrows |
| **Tree** (branches) | Component trees, prototype chains, file structures | indented nodes connected by lines |
| **Comparison** (side-by-side) | "Before/After", "A vs B" | two boxes with a divider |
| **Bar proportional** | `flex-grow` math, storage quotas | horizontal rects showing shares |
| **Stack / layers** | Cache layers, z-index stacking | offset rectangles |
| **Timeline** | Execution order, event loop ticks | horizontal axis with ticks and labels |

## Style hygiene

- Stroke width: 1.5 for primary outlines, 1 for secondary, 2 for emphasis.
- Corner radius: 6 for boxes, 3 for pills/tags, 0 for grids.
- Arrow heads: declare a `<marker>` once in `<defs>`; reuse. Keep arrow heads small (8×8 viewBox, triangle).
- Do NOT use drop shadows inside SVG — the depth system is handled outside.
- Do NOT use emojis inside SVG — they render inconsistently.
- Do NOT use icon fonts.

## Minimum quality bar

- At a glance, a student should be able to **name the concept** from the diagram without reading the caption.
- The caption then confirms/extends their understanding.
- Every arrow has a direction. Every label is legible at 100% zoom. No overlapping text.

## Example skeleton

```html
<figure class="fig-dia">
  <svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Main and cross axes of a flex container">
    <defs>
      <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M0,0 L8,4 L0,8 z" fill="var(--fg)"/>
      </marker>
    </defs>
    <rect x="40" y="40" width="520" height="140" fill="var(--surface-alt)" stroke="var(--border-strong)" stroke-width="1.5" rx="6"/>
    <line x1="60" y1="110" x2="540" y2="110" stroke="var(--accent)" stroke-width="2" marker-end="url(#arr)"/>
    <text x="300" y="130" text-anchor="middle" fill="var(--accent)" font-family="var(--f-mono)" font-size="11" font-weight="700">main-axis</text>
    <line x1="80" y1="60" x2="80" y2="170" stroke="var(--warning)" stroke-width="2" marker-end="url(#arr)"/>
    <text x="95" y="110" fill="var(--warning)" font-family="var(--f-mono)" font-size="11" font-weight="700">cross-axis</text>
  </svg>
  <figcaption>Flex items flow along the main-axis; wrapped lines stack along the cross-axis.</figcaption>
</figure>
```

The host CSS already styles `.fig-dia` so you don't need to add padding/margin — just emit the figure.

## What to inject

For each fragment, add **6–10 diagrams total**, placed at the most educationally valuable spots (not one per heading — only where a picture communicates more than prose). Err on the side of quality over quantity.
