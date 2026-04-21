# CSS & Layout — Complete Study Guide
### Web Programming II Final Exam

> This guide covers every CSS topic from the slides. For each concept: definition, syntax, defaults, gotchas, and exam questions.

---

## Table of Contents

1. [Flexbox](#1-flexbox)
2. [CSS Grid](#2-css-grid)
3. [Grid vs Flexbox](#3-grid-vs-flexbox)
4. [BEM](#4-bem-block-element-modifier)
5. [CSS Custom Properties (Variables)](#5-css-custom-properties-variables)
6. [Background Properties](#6-background-properties)
7. [Gradients](#7-gradients)
8. [Shadows (box-shadow)](#8-shadows-box-shadow)
9. [Transitions vs Animations](#9-transitions-vs-animations)
10. [Transforms](#10-transforms)
11. [Perspective](#11-perspective)
12. [Rounded Corners (border-radius)](#12-rounded-corners-border-radius)
13. [Box Sizing](#13-box-sizing)
14. [Attribute Selectors](#14-attribute-selectors)
15. [Structural Pseudo-classes](#15-structural-pseudo-classes)
16. [Pseudo-elements](#16-pseudo-elements)
17. [Key Defaults Table](#17-key-defaults-to-memorize)
18. [Worked Math Examples](#18-worked-math-examples)
19. [Quick-Reference Cheat Sheet](#19-quick-reference-cheat-sheet)

---

## 1. Flexbox

### Definition
Flexbox makes the once-difficult task of laying out your page, widget, application, or gallery almost simple. It provides functionality for equal-height columns (default behaviour). Before flexbox, developers depended heavily on floats and width/height percentages.

**Key rule:** `display: flex` only affects **immediate children** — not deeper descendants. Descendants must be made flex containers themselves for further control.

---

### 1.1 The Two Axes

| Axis | Direction | Set by |
|------|-----------|--------|
| **Main axis** | Where flex items are laid out | `flex-direction` |
| **Cross axis** | Perpendicular to main axis | Determined automatically |

- `flex-direction: row` → main axis = horizontal (left→right), cross axis = vertical (top→down)
- `flex-direction: column` → main axis = vertical (top→down), cross axis = horizontal

---

### 1.2 Container Properties

#### `display: flex`
```css
.container {
  display: flex;       /* block-level flex container */
  display: inline-flex; /* inline-level flex container */
}
```

#### `flex-direction`
- **Definition:** Defines the direction of the main axis.
- **Default:** `row`
- **Values:** `row` | `row-reverse` | `column` | `column-reverse`

```css
.container { flex-direction: row; } /* default: left to right */
.container { flex-direction: column; } /* top to bottom */
```

**Gotcha:** `row-reverse` / `column-reverse` reverse visual order but NOT DOM order.

#### `flex-wrap`
- **Definition:** Controls whether items are forced onto one line or can wrap.
- **Default:** `nowrap`
- **Values:** `nowrap` | `wrap` | `wrap-reverse`

```css
.container { flex-wrap: wrap; }
```

**Gotcha:** When wrapping, the height of each line is determined by the **tallest and widest** element in that line.

#### `flex-flow` (shorthand)
- **Definition:** Shorthand for `flex-direction` + `flex-wrap`
- **Default:** `row nowrap`

```css
.container { flex-flow: row wrap; }
```

#### `justify-content`
- **Definition:** Distributes flex items along the **main axis**.
- **Default:** `flex-start`
- **Values:** `flex-start` | `flex-end` | `center` | `space-between` | `space-around` | `space-evenly`

```css
.container { justify-content: space-between; }
```

| Value | Behaviour |
|-------|-----------|
| `flex-start` | Items packed at start |
| `flex-end` | Items packed at end |
| `center` | Items centered |
| `space-between` | First at start, last at end, equal gaps between |
| `space-around` | Equal space around each item (half-size at edges) |
| `space-evenly` | Equal space between all items AND edges |

#### `align-items`
- **Definition:** Aligns flex items along the **cross axis** within their flex line.
- **Default:** `stretch`
- **Values:** `stretch` | `flex-start` | `flex-end` | `center` | `baseline`

```css
.container { align-items: center; }
```

#### `align-content`
- **Definition:** Aligns the **flex lines themselves** (not items) when there is extra cross-axis space.
- **Default:** `stretch`
- **Values:** `stretch` | `flex-start` | `flex-end` | `center` | `space-between` | `space-around`

```css
.container {
  display: flex;
  flex-wrap: wrap;           /* REQUIRED — align-content only works with wrap */
  align-content: space-between;
}
```

**Critical distinction:**
- `align-items` = aligns **items within** their flex line (cross-axis)
- `align-content` = aligns **the lines themselves** (cross-axis). Has NO effect when there is only one line.

**Gotcha:** `align-content` only works when `flex-wrap: wrap` is set and there are multiple lines.

#### `gap`
```css
.container {
  gap: 10px;        /* equal row and column gap */
  gap: 10px 20px;   /* row-gap column-gap */
}
```

---

### 1.3 Flex Item Properties

#### `flex-grow`
- **Definition:** How much a flex item grows relative to siblings when extra space is available.
- **Default:** `0` (items do NOT grow by default)
- **Values:** Non-negative number only (cannot be negative)

```css
.item { flex-grow: 1; }
```

**Calculation (see worked example in Section 18):**
```
remaining space = container width - sum of all item base widths
1 unit = remaining space / total flex-grow factors
item final width = base width + (unit × item's flex-grow)
```

#### `flex-shrink`
- **Definition:** How much a flex item shrinks relative to siblings when there is not enough space.
- **Default:** `1` (items shrink equally by default)
- **Values:** Non-negative number. `0` = item will NOT shrink.

```css
.item { flex-shrink: 0; } /* item never shrinks */
```

**Calculation:**
```
overflow = sum of all item widths - container width
1 unit = overflow / total flex-shrink factors
item final width = base width - (unit × item's flex-shrink)
```

#### `flex-basis`
- **Definition:** The initial/default size of a flex item before remaining space is distributed. Sets the "base" that grow/shrink work from.
- **Default:** `auto` (looks at the item's `width` or `height`)
- **Values:** `auto` | `content` | length (`200px`, `50%`) | `0`

```css
.item { flex-basis: 200px; }
```

**Gotcha:** When both `flex-basis` and `width` are set on an item, **`flex-basis` wins (trumps width)**.

#### `flex` (shorthand)
- **Default:** `0 1 auto` (grow shrink basis)

```css
.item { flex: 1; }           /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */
.item { flex: 1 0 100%; }    /* grow:1, shrink:0, basis:100% */
.item { flex: 1 1 200px; }   /* grow shrink basis */
```

#### `align-self`
- **Definition:** Overrides `align-items` for an individual flex item.
- **Default:** `auto` (inherits container's `align-items`)
- **Values:** `auto` | `flex-start` | `flex-end` | `center` | `baseline` | `stretch`

```css
.item:last-child { align-self: flex-end; }
```

#### `order`
- **Definition:** Controls the visual order of flex items (does not change DOM order).
- **Default:** `0`
- **Values:** Any integer. Lower values appear first.

```css
.item { order: 2; } /* appears after items with order 0 or 1 */
```

---

### 1.4 Important Flexbox Rules (from slides)

| Rule | Detail |
|------|--------|
| `float` on flex items | Has NO effect |
| `clear` on flex items | Has NO effect |
| `vertical-align` on flex items | Has NO effect |
| `absolute positioning` on flex items | Removes them from the flow |
| `flex-grow` values | Cannot be negative |
| `flex-basis` vs `width` | flex-basis wins |

**Centering with flexbox (modern vs old):**
```css
/* Modern flexbox */
.parent { display: flex; justify-content: center; align-items: center; }

/* Old method */
.child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
```

---

### 1.5 Likely Exam Questions — Flexbox

| Question type | Answer |
|---------------|--------|
| Default of `flex-direction` | `row` |
| Default of `flex-wrap` | `nowrap` |
| Default of `justify-content` | `flex-start` |
| Default of `align-items` | `stretch` |
| Default of `align-content` | `stretch` |
| Default of `flex-grow` | `0` |
| Default of `flex-shrink` | `1` |
| Default of `order` | `0` |
| Default of `align-self` | `auto` |
| `flex-flow: row wrap` means | `flex-direction: row; flex-wrap: wrap;` |
| When does `align-content` work? | Only when `flex-wrap: wrap` and multiple lines exist |
| What does `align-items` align? | Items within their line (cross-axis) |
| What does `align-content` align? | The lines themselves (cross-axis) |
| Does float affect flex items? | No |
| Which takes priority: `flex-basis` or `width`? | `flex-basis` |
| What is flex-grow: 0? | Item will NOT grow (this is the default) |

---

## 2. CSS Grid

### Definition
CSS Grid Layout enables more complex, two-dimensional layouts and gives full control. On the basic level it is similar to flexbox, but it works in both rows AND columns simultaneously.

`display: grid` only affects **direct children** (grid items), not deeper descendants.

---

### 2.1 Grid Terminology

| Term | Definition |
|------|-----------|
| **Grid container** | Element with `display: grid` applied |
| **Grid item** | Direct child of a grid container |
| **Grid line** | The dividing lines that make up the grid structure (horizontal and vertical) |
| **Grid track** | The space between two adjacent grid lines — essentially a row or column |
| **Grid cell** | Smallest unit — bounded by four grid lines, no lines running through it |
| **Grid area** | Any rectangular area bounded by four grid lines; made of one or more cells |

---

### 2.2 Defining the Grid

#### `display: grid`
```css
.container { display: grid; }        /* block-level grid */
.container { display: inline-grid; } /* inline-level grid */
```

#### `grid-template-columns` / `grid-template-rows`
- **Definition:** Defines the columns/rows of the grid.
- **Values:** `px`, `%`, `auto`, `fr`, `minmax()`, `repeat()`

```css
.container {
  grid-template-columns: 200px 200px 200px;   /* 3 fixed columns */
  grid-template-columns: 1fr 2fr 1fr;          /* fraction-based */
  grid-template-columns: auto 1fr;             /* auto + remaining */
  grid-template-rows: 100px auto;
}
```

**Named grid lines:**
```css
grid-template-columns: [start col-a] 200px [col-b] 50% [col-c] 100px [stop end last];
/* Multiple names per line are allowed */
```

#### The `fr` Unit
- **Definition:** Stands for "fraction". Represents a fraction of the available space.
- All `fr` values are added up, then each `fr` gets its proportional share.

```css
.container {
  grid-template-columns: 1fr 2fr 1fr;
  /* Total = 4 fractions. 1fr = 25%, 2fr = 50%, 1fr = 25% */
}
```

**Gotcha:** `fr` distributes available space AFTER fixed-size tracks are allocated.

#### `repeat()`
```css
.container {
  grid-template-columns: repeat(3, 1fr);           /* same as: 1fr 1fr 1fr */
  grid-template-columns: repeat(3, 1fr 2fr);       /* pattern: 1fr 2fr 1fr 2fr 1fr 2fr */
  grid-template-columns: 40px repeat(1, 1fr) 40px; /* mixed */
}
```

#### Responsive grid (no media queries):
```css
/* THIS IS A HIGH-PRIORITY EXAM ANSWER */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

| Keyword | Behaviour |
|---------|-----------|
| `auto-fit` | Fits as many columns as possible; expands columns to fill remaining space |
| `auto-fill` | Similar but keeps empty tracks (doesn't collapse them) |

#### `minmax()`
```css
.container {
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  /* Each column: minimum 100px, maximum 1fr */
}
```

#### `min-content` / `max-content`
- `max-content` — takes up the maximum amount of space needed for content
- `min-content` — takes up the minimum amount of space needed for content

---

### 2.3 Named Areas

#### `grid-template-areas`
- **Definition:** Defines named layout regions.
- Use `.` (one or more dots) for empty cells — this is called the **null cell token**.
- **All areas must be rectangular** — non-rectangular shapes will break the layout.

```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main   main"
    "footer footer  footer";
  grid-template-columns: 250px 1fr;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

**Empty cell example:**
```css
grid-template-areas:
  "header header"
  ".      main"    /* dot = empty cell */
  "footer footer";
```

---

### 2.4 Placing Grid Items

#### `grid-column` / `grid-row`
```css
.item {
  grid-column: 1 / 3;       /* start at line 1, end at line 3 (spans 2 columns) */
  grid-row: 1 / 2;           /* occupies row 1 */

  grid-column: 1 / span 2;  /* start at line 1, span 2 columns */
  grid-column: span 2;       /* span 2 columns from auto-placed position */
}
```

#### `grid-area` (item)
```css
.item {
  grid-area: header;               /* named area */
  grid-area: 1 / 1 / 2 / 4;       /* row-start / col-start / row-end / col-end */
}
```

---

### 2.5 Auto Placement

#### `grid-auto-flow`
- **Default:** `row`
- **Values:** `row` | `column` | `dense` | `row dense` | `column dense`

```css
.container { grid-auto-flow: column; }       /* fill columns first */
.container { grid-auto-flow: row dense; }    /* fill holes in the grid */
```

---

### 2.6 Grid Alignment

#### On the container (aligns items within their cells):
```css
.container {
  justify-items: center;    /* horizontal alignment within cell (default: stretch) */
  align-items: center;      /* vertical alignment within cell (default: stretch) */
}
```

#### On the container (aligns the whole grid):
```css
.container {
  justify-content: center;  /* horizontal position of grid in container */
  align-content: center;    /* vertical position of grid in container */
}
```

#### On items (override for individual items):
```css
.item {
  justify-self: end;   /* horizontal alignment in its own cell */
  align-self: start;   /* vertical alignment in its own cell */
}
```

---

### 2.7 Grid Spacing

```css
.container {
  gap: 10px;           /* same gap for rows and columns */
  gap: 10px 20px;      /* row-gap column-gap */
  row-gap: 10px;
  column-gap: 20px;
}
```

**Note:** The slides use `grid-gap`, `grid-row-gap`, `grid-column-gap` (prefixed). Modern CSS uses `gap`. Know both.

---

### 2.8 Things Grid Ignores (from slides)

| Property | Effect on grid |
|----------|---------------|
| `column` properties | Ignored when applied to grid containers |
| `::first-line` | Ignored when applied to grid containers |
| `::first-letter` | Ignored when applied to grid containers |
| `float` | Ignored when applied to grid items |
| `clear` | Ignored when applied to grid items |
| `vertical-align` | Has no effect on grid items |

---

### 2.9 Likely Exam Questions — Grid

| Question | Answer |
|----------|--------|
| What does `fr` stand for? | Fraction |
| `repeat(auto-fit, minmax(250px, 1fr))` does what? | Responsive grid without media queries |
| Difference: `auto-fit` vs `auto-fill`? | auto-fit expands columns to fill space; auto-fill keeps empty tracks |
| What is the null cell token in grid-template-areas? | `.` (one or more dots) |
| Must grid areas be rectangular? | Yes — non-rectangular breaks the layout |
| `grid-column: 1 / 3` spans how many columns? | 2 (from line 1 to line 3) |
| Default of `grid-auto-flow`? | `row` |
| Default of `justify-items` and `align-items` in grid? | `stretch` |

---

## 3. Grid vs Flexbox

| Feature | CSS Grid | Flexbox |
|---------|----------|---------|
| **Dimensions** | Two-dimensional (rows AND columns) | One-dimensional (row OR column) |
| **Best for** | Page-level layout (header, sidebar, main, footer) | Component-level layout (cards, navbars, alignment) |
| **Layout direction** | Both axes simultaneously | One axis at a time |
| **Complexity** | More complex layouts, full control | Simpler flowing content |
| **Equal height columns** | Yes (default) | Yes (default — this is a Flexbox strength) |
| **When to use** | Defining page structure with `grid-template-areas` | Arranging items within a component |

**Correct mental model:**
- Use **Grid** for the overall page structure (outer shell)
- Use **Flexbox** inside components (nav items, card content, buttons)

**Exam answer for "Grid and Flexbox do the same thing":**
They complement each other. Grid is 2D (both rows AND columns); Flexbox is 1D (one direction at a time). Use Grid for page layout, Flexbox for component layout.

---

## 4. BEM (Block Element Modifier)

### Definition
BEM is a naming convention for CSS classes. It stands for **Block, Element, Modifier**. Used to maintain consistency in large teams.

### The Pattern
```
.block { }
.block__element { }
.block--modifier { }
.block__element--modifier { }
```

### Core Concepts

| Concept | Definition | Separator | Example |
|---------|-----------|-----------|---------|
| **Block** | Standalone component with meaning on its own | (none) | `.card` |
| **Element** | Part of a block, semantically tied to it | `__` (double underscore) | `.card__title` |
| **Modifier** | Flag that changes appearance or behaviour | `--` (double dash) | `.card--featured` |

### Naming Rules
- **Block names:** lowercase Latin letters, digits, dashes only
- **Element names:** lowercase Latin letters, digits, dashes, underscores
- **Modifier names:** lowercase Latin letters, digits, dashes, underscores
- **Use class name selectors only** — no tag names, no IDs, no dependency on other blocks

### Full Example (from slides)
```html
<form class="form form--theme-xmas form--simple">
  <input class="form__input" type="text" />
  <input class="form__submit form__submit--disabled" type="submit" />
</form>
```
```css
.form { }                      /* Block */
.form--theme-xmas { }          /* Block modifier */
.form--simple { }              /* Block modifier */
.form__input { }               /* Element */
.form__submit { }              /* Element */
.form__submit--disabled { }    /* Element modifier */
```

### Button Example (from slides)
```html
<button class="button">Normal button</button>
<button class="button button--state-success">Success button</button>
<button class="button button--state-danger">Danger button</button>
```

### Valid vs Invalid BEM

| Class name | Valid? | Why |
|------------|--------|-----|
| `.card__title--active` | YES | Correct: block__element--modifier |
| `.navigation__link--disabled` | YES | Correct BEM format |
| `.cardTitleActive` | NO | camelCase, no separators |
| `.card-title-active` | NO | Single dashes only — missing __ and -- |
| `.Card__Title` | NO | PascalCase/uppercase — BEM is lowercase only |
| `.navItemActive` | NO | camelCase, no separators |

### Exam Questions — BEM

| Question | Answer |
|----------|--------|
| Separator for Elements? | `__` (double underscore) |
| Separator for Modifiers? | `--` (double dash) |
| Can BEM use tag or ID selectors? | No — class names only |
| Is `.Nav__Item` valid BEM? | No — uppercase not allowed |
| Is `.nav-item-active` valid BEM? | No — missing __ and -- separators |

---

## 5. CSS Custom Properties (Variables)

### Definition
CSS variables (cascading variables) are entities defined by CSS authors that represent specific values to be reused throughout a document. They are defined using the `--` (double dash) prefix.

**Why use them:** Centralizes repeated values. One change updates the whole site. Without variables, changing a brand color requires a global find/replace.

### Syntax

```css
/* Define on :root for global access */
:root {
  --primary-color: #63B4D1;
  --navigation-bar-height: 100px;
  --font-size-base: 16px;
}

/* Use with var() */
.nav {
  height: var(--navigation-bar-height);
  background-color: var(--primary-color);
}

/* Fallback value */
body {
  color: var(--main-text-color, white);  /* 'white' is fallback if var not defined */
}
```

### Rules

| Rule | Detail |
|------|--------|
| **Scoping** | Variables cascade down the DOM. Defined on `:root` = global. Defined on `.aside` = only inside `<aside>` and descendants |
| **Case sensitive** | `--Main-color` and `--main-color` are different properties |
| **Inheritance** | Variables defined with `--` always inherit from parent (by default) |
| **JavaScript access** | `getComputedStyle(element).getPropertyValue("--my-var")` |
| **JavaScript set** | `element.style.setProperty("--my-var", value)` |

### `@property` At-Rule (Advanced)

Allows you to associate a type, set a default, and control inheritance:

```css
@property --main-red-color {
  syntax: "<color>";
  inherits: false;
  initial-value: rgb(255, 0, 0);
}
```

- `inherits: false` — property does NOT inherit from parent
- `inherits: true` — property inherits (this is default for regular `--` variables)

### JavaScript Manipulation

```javascript
// Read
const value = getComputedStyle(element).getPropertyValue("--my-var");

// Write
element.style.setProperty("--my-var", value + 4);
```

### Exam Questions — CSS Variables

| Question | Answer |
|----------|--------|
| How are CSS variables defined? | `--variable-name: value;` with `--` prefix |
| How are they used? | `var(--variable-name)` |
| Do CSS variables replace CSS preprocessors? | NO — preprocessors offer mixins, nesting, functions that CSS variables alone cannot provide |
| Are variable names case-sensitive? | YES |
| Where is `:root` typically used? | For global variables accessible everywhere |
| Can CSS variables be changed by JavaScript? | Yes — via `element.style.setProperty()` |
| Do `--` variables inherit? | Yes, always |

---

## 6. Background Properties

### `background-image`
```css
background-image: url('image.jpg');
```

### `background-size`
- **Default:** `auto`

| Value | Behaviour |
|-------|-----------|
| `cover` | Scales image to fill container; may crop. "Covers everything, though overflow" |
| `contain` | Scales image to fit inside; may leave space. "Tries to fit the whole image in" |
| `200px 200px` | Explicit width height |

```css
background-size: cover;
background-size: contain;
background-size: 200px auto;
```

### `background-position`
```css
background-position: center center;
background-position: 50% 50%;
background-position: 200px bottom;   /* 200px from left, at bottom */
background-position: 0 0;             /* top left */
```

### `background-repeat`
- **Default:** `repeat`
- **Values:** `repeat` | `no-repeat` | `repeat-x` | `repeat-y`

```css
background-repeat: no-repeat;
```

### Multiple Backgrounds
- Comma-separated. **First listed = on top, last listed = on bottom.**
- Each comma-separated value maps to the corresponding image.

```css
.scene {
  background-image:
    url(heman.png),       /* 1st = ON TOP */
    url(skeletor.png),    /* 2nd = middle */
    url(grayskull.jpg);   /* 3rd = BOTTOM */
  background-repeat: no-repeat;
  background-size: 200px, 200px, cover;
  background-position:
    200px bottom,         /* heman: 200px from left, at bottom */
    450px bottom,         /* skeletor: 450px from left, at bottom */
    center center;        /* grayskull: centered, covers all */
}
```

### Exam Questions — Background

| Question | Answer |
|----------|--------|
| Default of `background-repeat`? | `repeat` |
| `cover` vs `contain`? | cover = may crop; contain = no crop but may leave space |
| With multiple backgrounds, which is on top? | The FIRST one listed |
| Does `border-box` include margin? | No — border-box includes padding and border, NOT margin |

---

## 7. Gradients

Gradients are applied to `background-image` (or `background`), NOT `background-color`.

### `linear-gradient()`
- **Default direction:** top to bottom

```css
/* Basic */
background: linear-gradient(red, blue);            /* top to bottom */
background: linear-gradient(to right, red, blue);  /* left to right */
background: linear-gradient(45deg, red, blue);      /* 45-degree angle */
background: linear-gradient(to bottom right, red, yellow, blue); /* diagonal, 3 colors */
```

**Angle reference:**
| Angle | Direction |
|-------|-----------|
| `0deg` | bottom to top |
| `90deg` | left to right |
| `180deg` | top to bottom (same as default) |
| `-90deg` | right to left |
| `to right` | same as 90deg |

### `radial-gradient()`
- Radiates from center outward by default.
- Shape: `circle` or `ellipse`

```css
background: radial-gradient(red, blue);
background: radial-gradient(circle, red, blue);
background: radial-gradient(circle at 75% 75%, red, blue);  /* custom center */
background: radial-gradient(circle at top left, red, blue);
```

### Repeating Gradients
```css
background: repeating-linear-gradient(
  45deg,
  red,
  red 10px,
  blue 10px,
  blue 20px
);

background: repeating-radial-gradient(
  circle,
  red,
  red 10px,
  blue 10px,
  blue 20px
);
```

### Stacking Gradients
```css
background-image:
  linear-gradient(rgba(255,0,0,0.5), rgba(0,0,255,0.5)),  /* ON TOP */
  linear-gradient(to right, yellow, green);                  /* BELOW */
```

**Gotcha:** Use `rgba` with transparency when stacking so layers below are visible.

### Exam Questions — Gradients

| Question | Answer |
|----------|--------|
| Default direction of `linear-gradient`? | Top to bottom |
| What does `0deg` mean? | Bottom to top |
| What does `90deg` mean? | Left to right |
| Which property do gradients go on? | `background-image` (or `background`) |
| With stacked gradients, which is on top? | The first listed |
| `radial-gradient` default center? | Center of the element |

---

## 8. Shadows (box-shadow)

### Syntax
```
box-shadow: offset-x offset-y blur-radius spread-radius color;
box-shadow: inset offset-x offset-y blur-radius spread-radius color;
```

| Part | Required? | Description |
|------|-----------|-------------|
| `offset-x` | YES | Horizontal offset. Positive = right, negative = left |
| `offset-y` | YES | Vertical offset. Positive = down, negative = up |
| `blur-radius` | no | Blur amount. `0` = sharp shadow. Default: `0` |
| `spread-radius` | no | Expands/contracts shadow. Positive = larger, negative = smaller. Default: `0` |
| `color` | no | Shadow color |
| `inset` | no | Keyword. Places shadow INSIDE the element |

**Default:** `none`

```css
/* Basic shadow */
box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.5);

/* Sharp shadow */
box-shadow: 5px 5px 0 black;

/* Inner shadow */
box-shadow: inset 0 0 10px black;

/* Negative spread — smaller than element */
box-shadow: 0 10px 20px -5px rgba(0,0,0,0.5);
```

### Multiple Shadows
- Comma-separated. First listed = on top.

```css
/* Replicating elements with shadows */
box-shadow:
  90px 0 0 black,
  46px 30px 0 40px yellow,
  46px 50px 0 30px red;
```

### `text-shadow`
```css
text-shadow: h-offset v-offset blur color;
/* NO spread-radius. NO inset. */
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
```

### Exam Questions — box-shadow

| Question | Answer |
|----------|--------|
| Order of box-shadow values? | offset-x offset-y blur spread color |
| What does `inset` do? | Places shadow inside the element |
| Default of blur-radius? | 0 (sharp) |
| Default of spread-radius? | 0 |
| Does `text-shadow` have spread? | No |
| Does `text-shadow` have inset? | No |

---

## 9. Transitions vs Animations

### Key Difference (from slides)
- **Transitions** only take effect when the property they are applied to **changes value** (requires a trigger — `:hover`, class change, etc.)
- **Animations** can execute **independently** — they change state on their own without needing a trigger. They can also loop, reverse, and have multiple keyframes.

---

### 9.1 Transitions

#### Shorthand
```
transition: property duration timing-function delay;
```

```css
.box {
  transition: background-color 1s ease-in 0s;
  transition: background-color 1s ease-in-out 0.1s;
}
.box:hover {
  background-color: red;
}
```

#### Multiple transitions
```css
.box {
  transition: background-color 1s, width 2s, height 3s;
}
```

#### Sub-properties

| Property | Default | Values |
|----------|---------|--------|
| `transition-property` | `all` | CSS property name, `all`, `none` |
| `transition-duration` | `0s` | `1s`, `200ms` |
| `transition-timing-function` | `ease` | `ease`, `ease-in`, `ease-out`, `ease-in-out`, `linear`, `cubic-bezier()`, `steps()` |
| `transition-delay` | `0s` | `0.5s`, `200ms` |

**Timing function meanings:**
| Value | Effect |
|-------|--------|
| `ease` | Slow start, fast middle, slow end |
| `linear` | Constant speed throughout |
| `ease-in` | Slow start |
| `ease-out` | Slow end |
| `ease-in-out` | Slow start and slow end |

---

### 9.2 Animations

#### `@keyframes`
```css
/* from/to syntax */
@keyframes slidein {
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
}

/* Percentage syntax — allows intermediate steps */
@keyframes colorchange {
  0%   { background-color: red; }
  50%  { background-color: blue; }
  100% { background-color: green; }
}
```

**`from` = 0%, `to` = 100%**

#### Animation Shorthand
```
animation: name duration timing-function delay iteration-count direction fill-mode play-state;
```

```css
.element {
  animation: myAnimation 5s ease-in 2s 10 reverse backwards running;
}
```

Breakdown:
1. `myAnimation` = animation-name
2. `5s` = animation-duration
3. `ease-in` = animation-timing-function
4. `2s` = animation-delay
5. `10` = animation-iteration-count
6. `reverse` = animation-direction
7. `backwards` = animation-fill-mode
8. `running` = animation-play-state

#### Animation Sub-properties

| Property | Default | Values |
|----------|---------|--------|
| `animation-name` | `none` | name of `@keyframes` |
| `animation-duration` | `0s` | time value |
| `animation-timing-function` | `ease` | same as transition |
| `animation-delay` | `0s` | time value |
| `animation-iteration-count` | `1` | number or `infinite` |
| `animation-direction` | `normal` | `normal` / `reverse` / `alternate` / `alternate-reverse` |
| `animation-fill-mode` | `none` | `none` / `forwards` / `backwards` / `both` |
| `animation-play-state` | `running` | `running` / `paused` |

**`animation-fill-mode` key values:**
- `forwards` — element retains the styles from the last keyframe after animation ends
- `backwards` — applies first keyframe styles during the delay period
- `both` — combines forwards and backwards

#### Full Example

```css
@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.button {
  animation: pulse 2s ease-in infinite alternate;
}
```

### Exam Questions — Transitions & Animations

| Question | Answer |
|----------|--------|
| Key difference: transition vs animation? | Transitions need a trigger; animations run independently |
| Default of `transition-property`? | `all` |
| Default of `animation-direction`? | `normal` |
| Default of `animation-iteration-count`? | `1` |
| What does `animation-fill-mode: forwards` do? | Keeps element at last keyframe's state after animation ends |
| `from` equals what percentage? | 0% |
| `to` equals what percentage? | 100% |
| Shorthand order for animation? | name duration timing-function delay iteration-count direction fill-mode play-state |

---

## 10. Transforms

### Definition
The `transform` CSS property applies 2D or 3D transformations. Transforms are either 2D or 3D.

**Coordinate system:** X-axis goes right (positive), Y-axis goes down (positive), Z-axis comes toward the viewer.

### `transform-origin`
- **Definition:** Sets the origin point for transformations.
- **Default:** `50% 50%` (center of the element)

```css
transform-origin: 50% 50%;      /* default — center */
transform-origin: 50px 70px;
transform-origin: top left;
```

---

### 10.1 2D Transform Functions

#### `rotate()`
```css
transform: rotate(45deg);          /* rotates around Z-axis (same as rotateZ) */
transform: rotateX(45deg);         /* tilts forward/backward */
transform: rotateY(45deg);         /* tilts left/right */
transform: rotateZ(45deg);         /* same as rotate(45deg) */
transform: rotate3d(1, 1, 1, 45deg); /* rotate around custom axis vector */
```

**Key fact from slides:** `rotate(45deg)` = `rotateZ(45deg)` — they are identical.

#### `scale()`
```css
transform: scale(2);            /* doubles size in both dimensions */
transform: scaleX(2);           /* doubles width only */
transform: scaleY(2);           /* doubles height only */
transform: scaleZ(2);           /* Z-axis (only visible with perspective) */
transform: scale3d(1.5, 2, 2);  /* 3D scale */
```

- `scale(2)` = double size
- `scale(0.5)` = half size

#### `skew()`
```css
transform: skew(30deg, 30deg);  /* skews both X and Y */
transform: skewX(30deg);        /* slants along X axis */
transform: skewY(30deg);        /* slants along Y axis */
/* Note: there is NO skewZ or skew3d */
```

#### `translate()`
```css
transform: translate(10px);          /* = translateX(10px) */
transform: translate(10px, 10px);    /* X and Y */
transform: translateX(10px);         /* horizontal only */
transform: translateY(10px);         /* vertical only */
transform: translateZ(10px);         /* toward/away from viewer (needs perspective) */
transform: translate3d(10px, 20px, 30px);
```

**Key fact:** `translate` does NOT affect surrounding elements — it moves over its position (unlike `position` changes which affect layout flow).

---

### 10.2 Multiple Transforms — ORDER MATTERS

Multiple transforms are **space-separated** (NOT comma-separated).

```css
/* !! ORDER MATTERS !! */

/* Rotation first, then translate: */
transform: rotate(180deg) translateY(20px);
/* Y-axis is flipped after 180deg rotation, so translateY(20px) moves UP */

/* Translate first, then rotate: */
transform: translateY(20px) rotate(180deg);
/* Element moves DOWN 20px, then rotates 180deg in place */
```

**Gotcha:** When you `rotate(180deg)` first, the entire coordinate system flips. A subsequent `translateY(20px)` then moves in the flipped direction (i.e., UP instead of down).

---

### Exam Questions — Transforms

| Question | Answer |
|----------|--------|
| Default of `transform-origin`? | `50% 50%` (center) |
| `rotate(45deg)` equals what? | `rotateZ(45deg)` |
| Does `translate` affect surrounding elements? | No |
| Multiple transforms: space or comma separated? | Space-separated |
| Does order of multiple transforms matter? | Yes — first is applied first, changes the coordinate system |
| `rotate(180deg) translateY(20px)` moves element which direction? | UP (Y-axis is flipped by the rotation) |
| Is there a `skewZ`? | No |

---

## 11. Perspective

### Two Ways to Apply Perspective

| Method | Applied on | Effect | Vanishing point |
|--------|-----------|--------|-----------------|
| `perspective` (CSS property) | **Parent/container** | Creates shared 3D space for all children | Shared — all children share one vanishing point (realistic) |
| `perspective(n)` (transform value) | **Element itself** | Each element gets its own 3D space | Individual — each element gets its own vanishing point (uniform) |

### `perspective` (CSS Property — on parent)
```css
/* Applied to PARENT */
.wrapper {
  perspective: 1000px;
}
.card {
  transform: rotateY(50deg);  /* shares parent's 3D space */
}
```

Effect: All children share ONE vanishing point. Creates realistic 3D effect (like cards fanning out from one point).

### `perspective()` (Transform Value — on element)
```css
/* Applied to ELEMENT ITSELF */
.card {
  transform: perspective(1000px) rotateY(50deg);
}
```

Effect: Each element gets its OWN vanishing point. All elements look identical (uniform effect).

### `perspective-origin`
- **Definition:** Sets the viewer's position (viewpoint).
- **Default:** `50% 50%` (center)
- Values: x-position (left/right/center/%) + y-position (top/bottom/center/%)

```css
.wrapper {
  perspective: 1000px;
  perspective-origin: 25% 75%;
}
```

### Depth Value
- **Lower value** = more dramatic 3D effect
- **Higher value** = subtler 3D effect

### Exam Questions — Perspective

| Question | Answer |
|----------|--------|
| Where is the `perspective` CSS property applied? | On the parent/container |
| Where is the `perspective()` transform function applied? | On the element itself |
| Difference: property vs transform value? | Property = shared vanishing point for all children; transform value = each element gets its own |
| Default of `perspective-origin`? | `50% 50%` |
| Lower or higher perspective value = more dramatic? | Lower value |

---

## 12. Rounded Corners (border-radius)

### Definition
`border-radius` creates rounded corners. Accepts `px`, `em`, `%`.

### Syntax

```css
/* All four corners equal */
border-radius: 10px;

/* Individual corners: TL TR BR BL (clockwise from top-left) */
border-radius: 5px 10px 15px 20px;
/*              TL  TR   BR   BL  */

/* Circle (on a square element) */
border-radius: 50%;

/* Leaf shape */
border-radius: 50% 0 50% 0;
```

### Elliptical Corners
```css
/* horizontal-radius / vertical-radius */
border-radius: 20px / 100%;
/* Before / = horizontal radius. After / = vertical radius */

/* If only one set, used for both horizontal and vertical */
border-radius: 50%;  /* same as 50% / 50% */
```

### Common Shapes

| Shape | CSS |
|-------|-----|
| Circle | `border-radius: 50%` on a square |
| Pill/capsule | `border-radius: 100px` on a wide element |
| Stadium | `border-radius: 50%` on a wider-than-tall element |
| Ellipse | `border-radius: 50% / 25%` |

### Exam Questions — border-radius

| Question | Answer |
|----------|--------|
| Order of 4 values? | Top-Left, Top-Right, Bottom-Right, Bottom-Left (clockwise) |
| `border-radius: 50%` on a square = ? | Circle |
| What does `/` mean in border-radius? | Before = horizontal radius, After = vertical radius |

---

## 13. Box Sizing

### Definition
`box-sizing` defines how the browser calculates the total width and height of an element.

### Values

#### `content-box` (default)
- Width/height applies to the **content area only**
- Padding and border are **added on top** on both sides

```css
.content-box {
  box-sizing: content-box; /* DEFAULT */
  width: 100px;
  padding: 10px;
  border: 10px solid black;
  /* Rendered width = 100 + 10 + 10 + 10 + 10 = 140px TOTAL */
}
```

#### `border-box`
- Width/height **includes** padding and border
- Element is always exactly the stated size
- Content area shrinks to accommodate padding and border

```css
.border-box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 10px solid black;
  /* Rendered width = 100px TOTAL (content area shrinks) */
}
```

### Comparison

| | `content-box` (default) | `border-box` |
|-|------------------------|--------------|
| What width includes | Content only | Content + padding + border |
| Includes margin? | No | No (margin is NEVER included) |
| Predictability | Less predictable | More predictable |

**Common pattern:**
```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

### Exam Questions — Box Sizing

| Question | Answer |
|----------|--------|
| Default of `box-sizing`? | `content-box` |
| `content-box`: 100px width + 10px padding + 10px border = ? | 140px total |
| `border-box`: 100px width + 10px padding + 10px border = ? | 100px total |
| Does `border-box` include margin? | No — margin is never included |

---

## 14. Attribute Selectors

### Definition
CSS3 allows selecting elements based on their attributes and attribute values.

| Selector | Meaning | Memory hook |
|----------|---------|-------------|
| `a[href]` | Has the attribute (any value) | "all elements with href" |
| `a[href="value"]` | Attribute exactly equals value | "exact match" |
| `a[title~="word"]` | Attribute contains word as space-separated value | "within" / "contains whole word" |
| `a[href^="http"]` | Attribute begins with value | "begins with" (^ = start) |
| `a[href$="pdf"]` | Attribute ends with value | "ends with" ($ = end) |
| `a[href*="facebook"]` | Attribute contains substring anywhere | "wildcard" / "anywhere" |

### Examples

```css
/* Has the attribute */
a[href] { text-decoration: underline; }

/* Exact match */
a[href="mailto:info@example.com"] { color: red; }

/* Contains word (space-separated) */
a[title~="title"] { color: lightblue; }

/* Begins with */
a[href^="http"]:after {
  content: " (" attr(href) ") ";
}

/* Ends with */
a[href$="pdf"]:before {
  content: "PDF: ";
  color: red;
}

/* Contains substring (wildcard) */
a[href*="facebook"]:before {
  content: "FB: ";
}
```

### Exam Questions — Attribute Selectors

| Question | Answer |
|----------|--------|
| Select all links that have an href? | `a[href]` |
| Select links where href starts with "https"? | `a[href^="https"]` |
| Select links where href ends with ".pdf"? | `a[href$=".pdf"]` |
| Select links where href contains "google"? | `a[href*="google"]` |
| Which selector: "space-separated word match"? | `[attr~="word"]` |

---

## 15. Structural Pseudo-classes

### Definition
Selectors based on position/structure in the DOM — extra information that can't be represented by simple selectors.

### `:nth-child()` vs `:nth-of-type()`

| Selector | What it counts |
|----------|---------------|
| `:nth-child(n)` | ALL siblings regardless of type |
| `:nth-of-type(n)` | Only siblings of the SAME type |

### Complete Reference Table

| Selector | Description | Gotcha |
|----------|-------------|--------|
| `:nth-child(2n+1)` | Odd children (1, 3, 5...) = same as `:nth-child(odd)` | Counts ALL siblings, any type |
| `:nth-child(even)` | Even children (2, 4, 6...) | Counts ALL siblings |
| `:nth-child(3)` | The 3rd child specifically | Counts ALL siblings |
| `:nth-of-type(2n+1)` | Odd elements of that specific type | Only counts same-type siblings |
| `:nth-of-type(even)` | Even elements of that specific type | Only counts same-type siblings |
| `:first-child` | First child of parent | Fails if element is not FIRST among all siblings |
| `:last-child` | Last child of parent | — |
| `:first-of-type` | First element of its type | Works even if non-matching types come before it |
| `:last-of-type` | Last element of its type | — |
| `:empty` | Elements with no children | — |
| `:not(selector)` | Negation — elements NOT matching selector | — |

### Critical Distinction

```html
<div>
  <div>I am a div</div>   <!-- first child, but NOT a p -->
  <p>First paragraph</p>   <!-- second child, but first-of-type p -->
  <p>Second paragraph</p>
</div>
```

```css
/* p:first-child -- WILL NOT match <p> because the first child is <div> */
p:first-child { color: red; }      /* matches NOTHING here */

/* p:first-of-type -- WILL match first <p> even with <div> before it */
p:first-of-type { color: red; }   /* matches "First paragraph" */
```

### `:not()` Negation
```css
p:not(:first-child) { background-color: red; }  /* all p except the first child */
```

### Formula for `:nth-child(An+B)`
- `A` = cycle size
- `n` = counter starting at 0
- `B` = offset

Examples:
- `2n+1` = odd (1, 3, 5...)
- `2n` = even (2, 4, 6...)
- `3n` = every 3rd (3, 6, 9...)
- `n+4` = from 4th onwards

### Practical: Table Striping
```css
table > tbody > tr:nth-child(even) {
  background-color: rgba(155, 155, 155, .5);
}
```

### Exam Questions — Structural Pseudo-classes

| Question | Answer |
|----------|--------|
| `p:first-child` — what must be true? | The `<p>` must be the FIRST child of its parent (any type) |
| `p:first-of-type` vs `p:first-child`? | first-of-type finds first `<p>` regardless of other element types before it; first-child requires p to be the literal first sibling |
| `nth-child(2n+1)` = same as? | `nth-child(odd)` |
| `nth-child` counts what? | ALL siblings regardless of type |
| `nth-of-type` counts what? | Only siblings of the same type |

---

## 16. Pseudo-elements

### Definition
Pseudo-elements provide authors a way to refer to **content that does not exist in the source document**. They are content generated or styled by CSS.

**Notation:** Double colon `::` (CSS3 standard), though single colon `:` also works for legacy.

### The Four Pseudo-elements (from slides)

#### `::first-line`
Styles the first line of a block element. The "first line" changes dynamically with viewport size.
```css
p::first-line {
  font-variant: small-caps;
}
```

#### `::first-letter`
Styles the first letter (drop-cap effect).
```css
p::first-letter {
  font-size: 6em;
  font-weight: bold;
}
```

#### `::before`
Inserts generated content BEFORE the element's actual content.
- **`content` property is mandatory**

```css
div::before {
  content: 'Before ';
}

/* Common use: insert icon/text before links */
a[href^="http"]::before {
  content: "External: ";
}
```

#### `::after`
Inserts generated content AFTER the element's actual content.
- **`content` property is mandatory**

```css
div::after {
  content: ' After';
}

/* Print URLs after links */
@media print {
  a[href^="http"]::after {
    content: " (" attr(href) ") ";
  }
}
```

### `attr()` Function in Content
The `attr()` function reads an element's attribute value and inserts it as text:
```css
/* Adds the href URL in parentheses after external links */
a[href^="http"]::after {
  content: " (" attr(href) ") ";
}
```

### Creative Use
Using `::before` and `::after` together with a single `<div>`, you can create complex visuals (the teacher's example: a smiley face using only `box-shadow`).

### Exam Questions — Pseudo-elements

| Question | Answer |
|----------|--------|
| What property is mandatory for `::before` / `::after`? | `content` |
| How many pseudo-elements are there (from slides)? | 4: `::first-line`, `::first-letter`, `::before`, `::after` |
| What does `::first-line` select? | The first rendered line of a block element |
| What function reads an attribute value into `content`? | `attr()` |
| `::before` inserts content where? | Before the element's actual content |
| `::after` inserts content where? | After the element's actual content |

---

## 17. Key Defaults to Memorize

| Property | Default Value | Notes |
|----------|--------------|-------|
| `flex-direction` | `row` | Items go left to right |
| `flex-wrap` | `nowrap` | Items stay on one line |
| `flex-flow` | `row nowrap` | Shorthand default |
| `justify-content` | `flex-start` | Items at start of main axis |
| `align-items` | `stretch` | Items fill cross-axis height |
| `align-content` | `stretch` | Lines fill cross-axis space |
| `flex-grow` | `0` | Items do NOT grow |
| `flex-shrink` | `1` | Items DO shrink |
| `flex-basis` | `auto` | Uses item's own width/height |
| `flex` shorthand | `0 1 auto` | grow shrink basis |
| `order` | `0` | Source order |
| `align-self` | `auto` | Inherits container's `align-items` |
| `grid-auto-flow` | `row` | Items fill row first |
| `justify-items` (grid) | `stretch` | Items fill cell horizontally |
| `align-items` (grid) | `stretch` | Items fill cell vertically |
| `transform-origin` | `50% 50%` | Center of element |
| `perspective-origin` | `50% 50%` | Center |
| `box-sizing` | `content-box` | Width = content only |
| `background-repeat` | `repeat` | Background tiles |
| `background-size` | `auto` | Original image size |
| `transition-property` | `all` | All animatable properties |
| `transition-duration` | `0s` | No transition |
| `transition-timing-function` | `ease` | Slow-fast-slow |
| `transition-delay` | `0s` | No delay |
| `animation-name` | `none` | |
| `animation-duration` | `0s` | No animation |
| `animation-timing-function` | `ease` | |
| `animation-delay` | `0s` | No delay |
| `animation-iteration-count` | `1` | Plays once |
| `animation-direction` | `normal` | Forward |
| `animation-fill-mode` | `none` | |
| `animation-play-state` | `running` | |
| `box-shadow` | `none` | |
| `border-radius` | `0` | Square corners |

---

## 18. Worked Math Examples

### 18.1 flex-grow Calculation

**From the slides (the exact example you will likely see):**

```
Container: 750px wide
Three items: each 100px wide
flex-grow values: item1=1, item2=1, item3=3
```

**Step 1: Remaining space**
```
750 - (100 + 100 + 100) = 450px remaining
```

**Step 2: Total growth factors**
```
1 + 1 + 3 = 5 total factors
```

**Step 3: Value per unit**
```
450px / 5 = 90px per unit
```

**Step 4: Final widths**
```
Item 1: 100 + (90 × 1) = 190px
Item 2: 100 + (90 × 1) = 190px
Item 3: 100 + (90 × 3) = 370px   ← This is the answer the exam uses!
```

**Total check:** 190 + 190 + 370 = 750px ✓

---

### 18.2 flex-shrink Calculation

**From slides:**

```
Container: 750px wide
Three items: each 300px wide
Total without shrinking: 900px (overflow: 150px)
flex-shrink values: item1=1, item2=1, item3=3
```

**Step 1: Overflow (negative space)**
```
(300 + 300 + 300) - 750 = 150px overflow
```

**Step 2: Total shrink factors**
```
1 + 1 + 3 = 5 total factors
```

**Step 3: Value per unit**
```
150px / 5 = 30px per unit
```

**Step 4: Final widths**
```
Item 1: 300 - (30 × 1) = 270px
Item 2: 300 - (30 × 1) = 270px
Item 3: 300 - (30 × 3) = 210px
```

**Total check:** 270 + 270 + 210 = 750px ✓

---

### 18.3 fr Unit Calculation

```css
.container {
  width: 800px;
  grid-template-columns: 1fr 2fr 1fr;
}
```

**Step 1: Total fr units**
```
1 + 2 + 1 = 4 fr total
```

**Step 2: Value per fr**
```
800px / 4 = 200px per fr
```

**Step 3: Column widths**
```
Column 1: 1 × 200 = 200px
Column 2: 2 × 200 = 400px
Column 3: 1 × 200 = 200px
```

**Total check:** 200 + 400 + 200 = 800px ✓

---

### 18.4 grid-template-areas Worked Example

**Goal:** Create a two-column layout with header and footer spanning full width.

```css
.container {
  display: grid;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 10px;
}

/* Assign items to areas */
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

**Corresponding HTML:**
```html
<div class="container">
  <header class="header">Header</header>
  <aside class="sidebar">Sidebar</aside>
  <main class="main">Main Content</main>
  <footer class="footer">Footer</footer>
</div>
```

**Rules to remember:**
- Each area name creates a named region
- Rows and columns are defined by the quoted strings
- Same name across multiple cells = that area spans those cells
- ALL areas must be rectangular
- Use `.` (dot) for empty cells

---

### 18.5 box-sizing Math

```css
.element {
  width: 100px;
  padding: 10px;
  border: 10px solid black;
}
```

| `box-sizing` | Total rendered width |
|-------------|---------------------|
| `content-box` (default) | 100 + 10 + 10 + 10 + 10 = **140px** |
| `border-box` | **100px** (content shrinks to ~60px) |

Formula for `content-box`:
```
total = width + padding-left + padding-right + border-left + border-right
total = 100 + 10 + 10 + 10 + 10 = 140px
```

---

## 19. Quick-Reference Cheat Sheet

### Flexbox Container Properties
```css
.flex-container {
  display: flex;                     /* enable flexbox */
  flex-direction: row;               /* row | row-reverse | column | column-reverse */
  flex-wrap: nowrap;                 /* nowrap | wrap | wrap-reverse */
  flex-flow: row nowrap;             /* shorthand: direction + wrap */
  justify-content: flex-start;       /* main-axis distribution */
  align-items: stretch;              /* cross-axis item alignment */
  align-content: stretch;            /* cross-axis line alignment (wrap only) */
  gap: 10px;                         /* space between items */
}
```

### Flexbox Item Properties
```css
.flex-item {
  flex-grow: 0;             /* how much to grow (default: 0, don't grow) */
  flex-shrink: 1;           /* how much to shrink (default: 1, do shrink) */
  flex-basis: auto;         /* base size before grow/shrink */
  flex: 0 1 auto;           /* shorthand: grow shrink basis */
  align-self: auto;         /* override container's align-items */
  order: 0;                 /* visual order (lower = first) */
}
```

### Grid Container Properties
```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-auto-flow: row;         /* row | column | dense */
  gap: 10px;
  justify-items: stretch;       /* item alignment in cell (horizontal) */
  align-items: stretch;         /* item alignment in cell (vertical) */
  justify-content: start;       /* grid in container (horizontal) */
  align-content: start;         /* grid in container (vertical) */
}
```

### Grid Item Properties
```css
.grid-item {
  grid-column: 1 / 3;       /* col-start / col-end */
  grid-row: 1 / span 2;     /* row-start / span n */
  grid-area: header;         /* named area OR row-start/col-start/row-end/col-end */
  justify-self: center;      /* override justify-items */
  align-self: center;        /* override align-items */
}
```

### BEM Quick Reference
```css
.block { }
.block__element { }
.block--modifier { }
.block__element--modifier { }
/* Separators: __ (element), -- (modifier). All lowercase. Class only. */
```

### CSS Variables Quick Reference
```css
:root { --color: #63B4D1; }           /* define */
.el { color: var(--color); }          /* use */
.el { color: var(--color, fallback); } /* with fallback */
```

### box-shadow Quick Reference
```css
/* offset-x | offset-y | blur | spread | color */
box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.5);
box-shadow: inset 0 0 10px black;   /* inner shadow */
box-shadow: 5px 5px 0 red, 10px 10px 0 blue; /* multiple */
```

### Transition Quick Reference
```css
/* property | duration | timing | delay */
transition: background-color 1s ease-in 0s;
transition: all 0.3s ease;
transition: color 1s, width 2s;  /* multiple */
```

### Animation Quick Reference
```css
@keyframes name {
  from { /* start state */ }
  to   { /* end state */ }
}
@keyframes name {
  0%   { }
  50%  { }
  100% { }
}

/* name | duration | timing | delay | count | direction | fill-mode | play-state */
animation: name 2s ease-in 0s infinite alternate forwards running;
```

### Transform Quick Reference
```css
transform: rotate(45deg);           /* = rotateZ(45deg) */
transform: rotateX(45deg);          /* tilt forward/back */
transform: rotateY(45deg);          /* tilt left/right */
transform: scale(2);                /* double size */
transform: scaleX(2) scaleY(0.5);   /* stretch/squish */
transform: skew(30deg, 30deg);      /* slant */
transform: translate(10px, 20px);   /* move (doesn't affect layout) */
/* SPACE-separated for multiple. ORDER MATTERS. */
transform: rotate(180deg) translateY(20px); /* Y-axis flipped! moves UP */
```

### Attribute Selectors Quick Reference
```css
[attr]          /* has attribute */
[attr="val"]    /* exactly equals */
[attr~="val"]   /* contains whole word (space-separated) */
[attr^="val"]   /* begins with */
[attr$="val"]   /* ends with */
[attr*="val"]   /* contains substring (wildcard) */
```

### Structural Pseudo-classes Quick Reference
```css
:nth-child(odd)      /* 1st, 3rd, 5th... — all siblings */
:nth-child(even)     /* 2nd, 4th, 6th... — all siblings */
:nth-child(3n)       /* every 3rd */
:nth-of-type(odd)    /* odd elements of same type */
:first-child         /* must be the literal first child */
:first-of-type       /* first of its type (ignores other types) */
:last-child
:last-of-type
:empty
:not(.class)
```

### Pseudo-elements Quick Reference
```css
p::first-line   { }   /* first rendered line */
p::first-letter { }   /* first character */
div::before { content: "text"; }  /* content is REQUIRED */
div::after  { content: attr(href); }  /* attr() reads attribute value */
```

### Perspective Quick Reference
```css
/* On PARENT — shared vanishing point (realistic) */
.parent { perspective: 1000px; }
.child  { transform: rotateY(45deg); }

/* On ELEMENT — each has own vanishing point (uniform) */
.element { transform: perspective(1000px) rotateY(45deg); }
```

### box-sizing Quick Reference
```css
/* content-box (DEFAULT): total = width + padding + border */
/* 100px width + 10px padding + 10px border = 140px TOTAL */

/* border-box: total = width (content shrinks) */
/* 100px width + 10px padding + 10px border = 100px TOTAL */
```

---

## Common Exam Traps Summary

1. **`flex-grow: 0` is the DEFAULT** — items do NOT grow unless you set this
2. **`flex-shrink: 1` is the DEFAULT** — items DO shrink by default
3. **`align-content` requires `flex-wrap: wrap`** to have any effect
4. **`float`, `clear`, `vertical-align` have NO effect on flex items**
5. **`flex-basis` beats `width`** when both are set
6. **BEM uses lowercase only** — no camelCase, no PascalCase
7. **BEM uses class selectors only** — no tag names, no IDs
8. **`::before` / `::after` require `content` property** — even `content: ""` if no text needed
9. **`p:first-child` fails** if the first child of the parent is not a `<p>` element
10. **`transform` order matters** — `rotate(180deg) translateY(20px)` moves UP
11. **Multiple transforms: space-separated**, NOT comma-separated
12. **`perspective` property on parent** = shared vanishing point (realistic); **`perspective()` transform on element** = each element's own vanishing point (uniform)
13. **Gradient direction: default is top-to-bottom** (`linear-gradient(red, blue)`)
14. **`0deg` = bottom-to-top**, `90deg` = left-to-right, `180deg` = top-to-bottom
15. **Multiple backgrounds: first listed = on top**, last listed = on bottom
16. **`border-box` does NOT include margin** in its calculation
17. **CSS variables do NOT replace preprocessors** (no mixins, nesting, etc.)
18. **CSS variable names are case-sensitive** (`--Color` ≠ `--color`)
19. **Grid areas must be rectangular** — L-shapes and other non-rectangular shapes will break
20. **`fr` distributes available space AFTER fixed-size tracks** are subtracted
