# CSS Glossary -- Vefforritun 2 Lokaprof

Based on teacher's slides (Glaerur (3).pdf). Page numbers reference slide pages.

---

## 1. Flexbox (pages 1-60)

### display: flex
- **Definition:** Setting `display: flex` on a container makes it a **flex container**. Its direct children become **flex items**.
- **Default:** `display: block` (normal flow)
- **Page:** ~2-5

### Flex Axes
- **Main axis:** The primary axis along which flex items are laid out. Determined by `flex-direction`.
- **Cross axis:** The axis perpendicular to the main axis.
- When `flex-direction: row` -- main axis is horizontal (left to right), cross axis is vertical.
- When `flex-direction: column` -- main axis is vertical (top to bottom), cross axis is horizontal.
- **Page:** ~6-8

### flex-direction
- **Definition:** Defines the direction of the main axis (and therefore how flex items are placed in the flex container).
- **Values:** `row` | `row-reverse` | `column` | `column-reverse`
- **Default:** `row`
- **Page:** ~9-12
```css
.container {
  display: flex;
  flex-direction: row; /* default */
}
```

### flex-wrap
- **Definition:** Controls whether flex items are forced onto one line or can wrap onto multiple lines.
- **Values:** `nowrap` | `wrap` | `wrap-reverse`
- **Default:** `nowrap`
- **Page:** ~13-15
```css
.container {
  flex-wrap: wrap;
}
```

### flex-flow (shorthand)
- **Definition:** Shorthand for `flex-direction` and `flex-wrap`.
- **Default:** `row nowrap`
- **Page:** ~16
```css
.container {
  flex-flow: row wrap;
}
```

### justify-content
- **Definition:** Defines how flex items are distributed along the **main axis**.
- **Values (from slides):** `flex-start` | `center` | `space-around` | `space-between` | `flex-end`
- **Default:** `flex-start`
- **Page:** ~17-22
```css
.container {
  justify-content: space-between;
}
```

### align-items
- **Definition:** Defines how flex items are aligned along the **cross axis**.
- **Values:** `stretch` | `flex-start` | `flex-end` | `center` | `baseline`
- **Default:** `stretch`
- `stretch` -- items stretch to fill the container.
- `baseline` -- items aligned by their text baselines.
- **Page:** ~23-27
```css
.container {
  align-items: center;
}
```

### align-content
- **Definition:** Aligns a flex container's **lines** within the flex container when there is extra space in the **cross-axis** direction. Only applies when there are **multiple lines** (i.e., `flex-wrap: wrap`).
- **CRITICAL DISTINCTION from align-items (from slides handwritten note):**
  - **align-items** = controls how individual **items** are aligned within their flex line (cross-axis)
  - **align-content** = controls how the **lines themselves** are distributed (cross-axis). "Styra hvernig linurnar fara en ekki itemin sjalf"
- **Values:** `flex-start` | `flex-end` | `center` | `space-between` | `space-around` | `stretch`
- **Default:** `stretch` (highlighted on slide)
- **Has NO effect when there is only one line of flex items.** "Wirkar bara pegar vid erum ad nota wrap" (Works only when we are using wrap -- handwritten note on slide)
- **Page:** ~28-30
```css
.container {
  display: flex;
  flex-wrap: wrap;          /* REQUIRED for align-content to work */
  align-content: space-between;
}
```

### gap
- **Definition:** Sets the gap (spacing) between flex items. Works on both main axis and cross axis.
- **Page:** ~31
```css
.container {
  gap: 10px;
  gap: 10px 20px; /* row-gap column-gap */
}
```

---

### Flex Item Properties

### order
- **Definition:** Controls the order in which flex items appear in the flex container.
- **Default:** `0`
- Items with the same order value are laid out in source order.
- Lower values appear first.
- **Page:** ~32-34
```css
.item {
  order: 2;
}
```

### flex-grow
- **Definition:** Defines how much a flex item should **grow** relative to the other flex items when there is extra space available.
- **Default:** `0` (items do not grow)
- The value is a proportion. If one item has `flex-grow: 2` and another has `flex-grow: 1`, the first item will take twice as much of the available extra space.
- **Calculation:** Available space is divided proportionally among items based on their flex-grow values.
- **Page:** ~35-40
```css
.item {
  flex-grow: 1;
}
```

**Growth factor calculation (from slides):**
- Container: 750px, three items each 100px wide.
- Remaining space: 750 - 300 = 450px.
- flex-grow values: 1, 1, 3 (total = 5):
  - 1 unit = 450 / 5 = 90px
  - Item 1: 100 + 90 * 1 = 190px
  - Item 2: 100 + 90 * 1 = 190px
  - Item 3: 100 + 90 * 3 = 370px

### flex-shrink
- **Definition:** Defines how much a flex item should **shrink** relative to the other flex items when there is not enough space.
- **Default:** `1` (items shrink equally)
- A value of `0` means the item will not shrink.
- **Page:** ~41-44
```css
.item {
  flex-shrink: 0; /* will not shrink */
}
```

**Shrink factor calculation (from slides):**
- Container: 750px, three items each 300px wide.
- Overflow: 900 - 750 = 150px.
- flex-shrink values: 1, 1, 3 (total = 5):
  - 1 unit = 150 / 5 = 30px
  - Item 1: 300 - 30 * 1 = 270px
  - Item 2: 300 - 30 * 1 = 270px
  - Item 3: 300 - 30 * 3 = 210px

### flex-basis
- **Definition:** Defines the default size of a flex item before remaining space is distributed. Sets the initial main size.
- **Default:** `auto` (looks at width/height of the item)
- Can be a length (e.g., `200px`, `50%`) or `auto`.
- **Page:** ~45-47
```css
.item {
  flex-basis: 200px;
}
```

### flex (shorthand)
- **Definition:** Shorthand for `flex-grow`, `flex-shrink`, and `flex-basis`.
- **Default:** `0 1 auto`
- **Page:** ~48-49
```css
.item {
  flex: 1;         /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */
  flex: 1 1 200px; /* grow shrink basis */
}
```

### align-self
- **Definition:** Allows a single flex item to override the `align-items` value for that item.
- **Values:** `auto` | `flex-start` | `flex-end` | `center` | `baseline` | `stretch`
- **Default:** `auto` (inherits from container's `align-items`)
- **Page:** ~50-52
```css
.item {
  align-self: flex-end;
}
```

### IMPORTANT FLEXBOX NOTES (from slides)

- **float, clear, and vertical-align have NO effect on flex items** (from slides)
- **Absolute positioning** of flex items takes them out of the flow
- **flex-grow accepts only non-negative numbers** — cannot be negative (from slides)
- **flex-basis trumps width** — when both flex-basis and width are set, flex-basis wins (from slides: "trounpar")
- **flex-basis values**: `auto | content | 100% | 100px | 0` (from slides)
- **display: inline-flex** — creates an inline-level flex container (like inline-grid for grids)
- **flex-wrap line height** — when using flex-wrap, the height of the line is determined by the tallest and widest element within that line (from slides)
- **Centering comparison (from slides):**
  - Flexbox way: `display: flex; justify-content: center; align-items: center;`
  - Old way: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`

### Grid vs Flexbox — WHEN TO USE EACH (HIGH exam risk — mock Q4)

| Grid | Flexbox |
|------|---------|
| **Two-dimensional** (rows AND columns) | **One-dimensional** (row OR column) |
| Best for **page-level layouts** (header, sidebar, main, footer) | Best for **component-level layouts** (cards, navbars, alignment) |
| Use `grid-template-areas` for complex layouts | Use for flexible, flowing content |
| Define structure on the **container** | Items determine their own sizing |

---

## 2. CSS Grid (pages 61-120)

### display: grid

- Two types: `grid` (block-level) and `inline-grid` (inline-level) (from slides)
- **Definition:** Setting `display: grid` on a container makes it a **grid container**. Its direct children become **grid items**.
- **Page:** ~62-65

### GRID: Things to Consider (from slides)
- All **column** properties are ignored when applied to grid containers
- **::first-line** and **::first-letter** are ignored when applied to grid containers
- **float** and **clear** are ignored when applied to grid items
- **vertical-align** has no effect on grid items

### Named Grid Lines (from slides)
Lines can be named using bracket syntax:
```css
grid-template-columns: [start col-a] 200px [col-b] 50% [col-c] 100px [stop end last];
```
Multiple names per line are allowed.

### min-content / max-content (from slides)
- **max-content**: takes up the maximum amount of space needed for the content
- **min-content**: takes up the minimum amount of space needed for the content
- Useful when you don't know the size of your grid items
```css
.container {
  display: grid;
}
```

### Grid Terminology
- **Grid container:** The element on which `display: grid` is applied.
- **Grid item:** Direct children of the grid container.
- **Grid line:** The dividing lines that make up the structure of the grid. They can be horizontal or vertical.
- **Grid track:** The space between two adjacent grid lines. Essentially a row or column.
- **Grid cell:** The space between two adjacent row grid lines and two adjacent column grid lines. A single "unit" of the grid.
- **Grid area:** The total space surrounded by four grid lines. May be composed of any number of grid cells.
- **Page:** ~66-72

### grid-template-columns / grid-template-rows
- **Definition:** Defines the columns and rows of the grid with a space-separated list of values representing the track size.
- **Page:** ~73-78
```css
.container {
  grid-template-columns: 200px 200px 200px;
  grid-template-rows: 100px 100px;
}
```

### The fr unit
- **Definition:** `fr` stands for "fraction". It represents a fraction of the available space in the grid container.
- Similar to flex-grow in flexbox -- distributes remaining space proportionally.
- **Page:** ~79-82
```css
.container {
  grid-template-columns: 1fr 2fr 1fr;
  /* First column gets 1/4, second gets 2/4, third gets 1/4 of available space */
}
```

### repeat()
- **Definition:** A function that allows you to repeat track definitions.
- **Page:** ~83-85
```css
.container {
  grid-template-columns: repeat(3, 1fr);
  /* Same as: 1fr 1fr 1fr */

  grid-template-columns: repeat(3, 1fr 2fr);
  /* Same as: 1fr 2fr 1fr 2fr 1fr 2fr */
}
```

### repeat(auto-fit, minmax(...)) — CONFIRMED by teacher's mock exam answers!
- **THIS IS THE ANSWER for mock Q1 blank 3:** `repeat(auto-fit, minmax(250px, 1fr))`
- Makes a responsive grid without media queries
- **auto-fit**: fits as many columns as possible, expands them to fill remaining space
- **auto-fill**: similar but keeps empty tracks instead of collapsing them
```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

### minmax()
- **Definition:** Defines a size range for a grid track, specifying a minimum and maximum value.
- **Page:** ~86-87
```css
.container {
  grid-template-columns: repeat(3, minmax(100px, 1fr));
}
```

### auto-fill vs auto-fit
- **auto-fill:** Fills the row with as many columns as it can fit, even if they are empty.
- **auto-fit:** Fits the existing columns into the space, expanding them to fill any remaining space.
- **Page:** ~88-90
```css
.container {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

### grid-template-areas
- **Definition:** Defines named grid areas, establishing the cells of the grid and assigning them names.
- Use `.` (period) for empty cells.
- **Page:** ~91-95
```css
.container {
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer  { grid-area: footer; }
```

### gap (grid)
- **Definition:** Sets the gap between grid rows and columns.
- `row-gap` -- sets gap between rows.
- `column-gap` -- sets gap between columns.
- `gap` -- shorthand for both.
- **Page:** ~96-98
```css
.container {
  gap: 10px 20px; /* row-gap column-gap */
  row-gap: 10px;
  column-gap: 20px;
}
```

### Grid Alignment: justify-items / align-items
- **justify-items:** Aligns grid items along the **row axis** (inline/horizontal).
- **align-items:** Aligns grid items along the **column axis** (block/vertical).
- **Values:** `start` | `end` | `center` | `stretch`
- **Default:** `stretch`
- Note: these align the ITEMS within their grid area (similar concept to flexbox align-items but for grid)
- **Page:** ~99-102

### Grid Alignment: justify-content / align-content
- **justify-content:** Aligns the **entire grid** along the **row axis** when the grid is smaller than the container.
- **align-content:** Aligns the **entire grid** along the **column axis**.
- **Values:** `start` | `end` | `center` | `stretch` | `space-around` | `space-between` | `space-evenly`
- The slides do not explicitly state a default for these properties.
- **Page:** ~103-106

### Grid Item Placement

### grid-column / grid-row
- **Definition:** Specifies a grid item's location within the grid by referring to specific grid lines.
- **Page:** ~107-112
```css
.item {
  grid-column: 1 / 3;    /* start at line 1, end at line 3 */
  grid-row: 1 / 2;

  grid-column: 1 / span 2; /* start at line 1, span 2 columns */
  grid-column: span 2;     /* span 2 columns from auto-placement */
}
```

### grid-area (item)
- **Definition:** Assigns a grid item to a named grid area, or can be shorthand for grid-row-start / grid-column-start / grid-row-end / grid-column-end.
- **Page:** ~113-115
```css
.item {
  grid-area: header;
  /* OR */
  grid-area: 1 / 1 / 2 / 4; /* row-start / col-start / row-end / col-end */
}
```

### justify-self / align-self (grid item)
- **Definition:** Aligns an individual grid item inside its cell.
- **justify-self:** Aligns along row axis.
- **align-self:** Aligns along column axis.
- **Values:** `start` | `end` | `center` | `stretch`
- **Default:** `stretch`
- **Page:** ~116-118

---

## 3. Gradients (pages ~121-135)

### linear-gradient
- **Definition:** Creates an image consisting of a progressive transition between two or more colors along a straight line.
- Default direction is top to bottom.
- **Page:** ~122-126
```css
background: linear-gradient(red, blue);
background: linear-gradient(to right, red, blue);
background: linear-gradient(45deg, red, blue);
background: linear-gradient(to bottom right, red, yellow, blue);
```

### radial-gradient
- **Definition:** Creates an image consisting of a progressive transition between two or more colors that radiate from an origin (center by default).
- **Page:** ~127-129
```css
background: radial-gradient(red, blue);
background: radial-gradient(circle, red, blue);
background: radial-gradient(circle at top left, red, blue);
```

### repeating-linear-gradient / repeating-radial-gradient
- **Definition:** Creates a repeating gradient pattern.
- **Page:** ~130-132
```css
background: repeating-linear-gradient(
  45deg,
  red,
  red 10px,
  blue 10px,
  blue 20px
);
```

### Stacking gradients
- **Definition:** Multiple gradients can be stacked using comma separation in `background-image`. The first gradient listed is on top.
- **Page:** ~133-135
```css
background-image:
  linear-gradient(rgba(255,0,0,0.5), rgba(0,0,255,0.5)),
  linear-gradient(to right, yellow, green);
```

---

## 4. Shadows (pages ~136-145)

### box-shadow
- **Definition:** Adds shadow effects around an element's frame.
- **Syntax:** `box-shadow: h-offset v-offset blur spread color;`
  - **h-offset** (required): Horizontal offset. Positive = right, negative = left.
  - **v-offset** (required): Vertical offset. Positive = down, negative = up.
  - **blur** (optional): Blur radius. Default `0` (sharp shadow).
  - **spread** (optional): Spread radius. Positive = larger, negative = smaller. Default `0`.
  - **color** (optional): Shadow color.
  - **inset** (optional keyword): Makes the shadow an inner shadow instead of outer.
- **Default:** none
- **Page:** ~137-140
```css
box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.5);
box-shadow: inset 0 0 10px black;
```

### Multiple shadows
- **Definition:** You can add multiple shadows to one element, comma-separated. They are stacked with the first shadow on top.
- **Page:** ~141-143
```css
box-shadow:
  90px 0 0 black,
  46px 30px 0 40px yellow,
  46px 50px 0 30px red;
```

### text-shadow
- **Definition:** Similar to `box-shadow` but applies to text.
- **Syntax:** `text-shadow: h-offset v-offset blur color;`
- Does NOT have spread or inset.
- **Page:** ~144-145

---

## 5. Transitions vs Animations (pages ~146-170)

### Transitions

### transition
- **Definition:** Allows property changes in CSS values to occur smoothly over a specified duration.
- **Shorthand:** `transition: property duration timing-function delay;`
- **Page:** ~147-152

### transition-property
- **Definition:** Specifies which CSS property (or properties) to apply the transition to.
- **Values:** A CSS property name, `all`, or `none`.
- **Default:** `all`
- **Page:** ~148

### transition-duration
- **Definition:** Specifies how long the transition takes to complete.
- **Default:** `0s` (no transition)
- **Page:** ~149

### transition-timing-function
- **Definition:** Specifies the speed curve of the transition.
- **Values:** `ease` | `linear` | `ease-in` | `ease-out` | `ease-in-out` | `cubic-bezier(n,n,n,n)` | `steps(n, start|end)`
- **Default:** `ease`
- `ease` -- slow start, fast middle, slow end.
- `linear` -- same speed throughout.
- `ease-in` -- slow start.
- `ease-out` -- slow end.
- `ease-in-out` -- slow start and slow end.
- **Page:** ~150-151

### transition-delay
- **Definition:** Specifies a delay before the transition starts.
- **Default:** `0s`
- **Page:** ~152
```css
.box {
  transition: background-color 0.3s ease-in-out 0.1s;
  /* property | duration | timing-function | delay */
}
.box:hover {
  background-color: red;
}
```

---

### Animations

### @keyframes
- **Definition:** Defines the stages/waypoints of a CSS animation. You specify the CSS styles at various points during the animation.
- Use `from` (0%) and `to` (100%), or specific percentages.
- **Page:** ~153-158
```css
@keyframes slidein {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes colorchange {
  0%   { background-color: red; }
  50%  { background-color: blue; }
  100% { background-color: green; }
}
```

### animation (shorthand)
- **Definition:** Shorthand for all animation properties.
- **Syntax:** `animation: name duration timing-function delay iteration-count direction fill-mode play-state;`
- **Page:** ~159-162
```css
.element {
  animation: slidein 2s ease-in-out 0s infinite alternate forwards running;
}
```

### animation-name
- **Definition:** Specifies the name of the `@keyframes` animation to apply.
- **Default:** `none`

### animation-duration
- **Definition:** How long the animation takes to complete one cycle.
- **Default:** `0s`

### animation-timing-function
- **Definition:** How the animation progresses through each cycle (same values as transition-timing-function).
- **Default:** `ease`

### animation-delay
- **Definition:** Delay before the animation starts.
- **Default:** `0s`

### animation-iteration-count
- **Definition:** How many times the animation should repeat.
- **Values:** A number or `infinite`
- **Default:** `1`

### animation-direction
- **Definition:** Whether the animation should play forward, backward, or alternate.
- **Values:** `normal` | `reverse` | `alternate` | `alternate-reverse`
- **Default:** `normal`

### animation-fill-mode
- **Definition:** Specifies how styles are applied before and after the animation executes.
- **Values:** `none` | `forwards` | `backwards` | `both`
- **Default:** `none`
- `forwards` -- element retains the style values from the last keyframe after the animation ends.
- `backwards` -- (not explicitly defined in slides)
- `both` -- (not explicitly defined in slides)
- The slides list the values as `forwards/backwards/both` with a handwritten note on `forwards`: "endur a staðnum sem endaði" (stays at the position where it ended)

### animation-play-state
- **Definition:** Whether the animation is running or paused.
- **Values:** `running` | `paused`
- **Default:** `running`
- **Page:** ~163-165

### Key difference: Transition vs Animation
- **Transitions** require a trigger (e.g., `:hover`, class change). They go from state A to state B.
- **Animations** can run automatically, loop, have multiple keyframes, and do not need a trigger.
- **Page:** ~166-170

---

## 6. Transforms (pages ~171-195)

### transform (property)
- **Definition:** "There are various transforms which can be applied to the **transform** CSS property." Transforms are either **2D** or **3D** transforms.
- **Page:** ~174-175

### Browser Viewport / Coordinate System
- "Every document viewport is a coordinate system."
- "By default we are start at point (0, 0) or 50% 50%."
- "All **transforms** take this in account."
- "When we add something to the X-axis we go further right and when we add something to the Y-axis we go further down."
- **Page:** ~172-173

### transform-origin
- **Definition:** "The default point (0, 0) can be changed using **transform-origin**."
- Sets the origin for an element's transformations.
- **Default:** `50% 50%` (center of the element)
- **Page:** ~173-174
```css
transform-origin: 50px 70px;
transform-origin: top left;
```

### Transform functions list
- rotate (X, Y, Z, 3d)
- scale (X, Y, Z, 3d)
- skew (X, Y)
- translate (X, Y, Z, 3d)
- perspective
- **Page:** ~175

### rotate
- **Definition:** Rotates an element around a fixed point.
- `rotate(angle)` -- rotates around Z-axis (same as `rotateZ()`).
- `rotateX(angle)` -- rotates around X-axis (tilts forward/backward).
- `rotateY(angle)` -- rotates around Y-axis (tilts left/right).
- `rotateZ(angle)` -- rotates around Z-axis (same as `rotate()`). Handwritten note on slide: "rotateZ(45deg) = rotate(45deg)".
- `rotate3d(x, y, z, angle)` -- rotates around an arbitrary axis.
- **Page:** ~176-178
```css
transform: rotate(45deg);
transform: rotateX(45deg);
transform: rotateY(45deg);
transform: rotateZ(45deg);   /* = rotate(45deg) */
transform: rotate3d(1, 1, 1, 45deg);
```

### scale
- **Definition:** Changes the size of an element.
- `scale(n)` -- scales both X and Y uniformly.
- `scaleX(n)` -- scales width only.
- `scaleY(n)` -- scales height only.
- `scaleZ(n)` -- scales Z-axis (only visible with 3D transforms/perspective).
- `scale3d(x, y, z)` -- scales all three axes.
- A value of `2` means double the size, `0.5` means half.
- **Page:** ~179-181
```css
transform: scale(2);
transform: scaleX(2);
transform: scaleY(2);
transform: scaleZ(2);
transform: scale3d(1.5, 2, 2);
```

### skew
- **Definition:** Skews/slants an element along the X and/or Y axis.
- `skew(x-angle, y-angle)` -- skews both axes.
- `skewX(angle)` -- skews along X-axis only.
- `skewY(angle)` -- skews along Y-axis only.
- No `skewZ` or `skew3d` exists.
- **Page:** ~182-184
```css
transform: skew(30deg, 30deg);
transform: skewX(30deg);
transform: skewY(30deg);
```

### translate
- **Definition:** Moves an element from its current position. "Hefur ekkert ahrif a adra hluti i kring, fer yfir stadinn" (Has no effect on other things around, moves over its position).
- `translate(x)` -- equivalent to `translateX(x)`.
- `translate(x, y)` -- equivalent to `translateX(x)` and `translateY(y)`.
- `translateX(n)` -- moves horizontally.
- `translateY(n)` -- moves vertically.
- `translateZ(n)` -- moves along Z-axis (requires perspective).
- `translate3d(x, y, z)` -- moves in 3D space.
- **Page:** ~185-189
```css
transform: translate(10px);         /* = translateX(10px) */
transform: translate(10px, 10px);   /* = translateX(10px) translateY(10px) */
```

### 3D Translations
- "3D translations work just like 2D translations, but add another axis (**Z**)."
- "When changing the translation value of the **Z**-axis it is perceived as how close the user is to the object."
- **Page:** ~189

### Multiple Transforms -- ORDER MATTERS
- "You can add multiple transforms which are **space-separated**."
- "The order of the **transform** values matter, because the first is applied and then the second and etc..."
- "Things to mention are when adding a rotation of 180deg and translationY of 20px in that order, the element will move up instead of down."
- **Page:** ~190-192
```css
/* Rotation first: element moves UP (Y-axis is flipped after 180deg rotation) */
transform: rotate(180deg) translateY(20px);

/* Translation first: element moves DOWN normally, then rotates */
transform: translateY(20px) rotate(180deg);
```

---

## 7. Perspective (pages ~193-200)

### perspective (property)
- **Definition:** "**perspective** creates a 3D-space shared by all its transformed children."
- Applied to the **parent** container. Affects all child elements.
- The value represents the distance from the user to the z=0 plane. Lower values = more dramatic 3D effect.
- **Page:** ~193-196
```css
.image-wrapper {
  perspective: 1000px;
}
.image {
  transform: rotateX(50deg);
}
```

### perspective (transform value)
- **Definition:** "This is a value of **transform** and not it's own property like the other one."
- "The difference with **perspective** property vs **perspective** transform value is the following:
  - **perspective** property is applied to all child elements
  - **perspective** transform value is applied to the element itself"
- When using as transform value, each element gets its own vanishing point. When using as property, all children share the same vanishing point.
- **Page:** ~197-199
```css
/* As transform value -- applied to element itself, each element identical */
transform: perspective(1000px) rotateY(50deg);

/* As property -- applied to parent, children share 3D space */
.parent {
  perspective: 1000px;
}
```

### perspective-origin
- **Definition:** "The **perspective-origin** CSS property takes in two values *x-position* and *y-position*."
- The *x-position* can be values: left/right/center, percentage or length values.
- The *y-position* can be values: top/bottom/center, percentage or length values.
- **Default:** `50% 50%` (center, annotated as "default" on slide)
- **Page:** ~200

---

## 8. Rounded Corners (pages ~201-210)

### border-radius
- **Definition:** "**border-radius** is a useful CSS property to create rounded corners."
- "It accepts **px, em, %** as units for example."
- "You can both create even and uneven rounded corners."
- **Page:** ~202-203

### Syntax breakdown
- **Four values:** `border-radius: top-left top-right bottom-right bottom-left;`
- The values go clockwise starting from top-left.
- **Page:** ~204
```css
border-radius: 5px 5px 5px 5px;
/*              TL   TR   BR   BL */
```

### Horizontal and vertical radius
- "The first set of values define the **horizontal radius**."
- "The optional second set of values, preceded by a **/** define the **vertical radius**."
- "If only one set of values are provided they are used for both **vertical** and **horizontal radius**."
- **Page:** ~207-209
```css
border-radius: 50%;           /* circle (if element is square) */
border-radius: 20px / 100%;   /* horizontal 20px, vertical 100% */
border-radius: 50% 0 50% 0;   /* leaf shape */
border-radius: 100px;         /* 100px horizontal and vertical radius */
```

---

## 9. Box Sizing (pages ~210-218)

### box-sizing
- **Definition:** "**box-sizing** CSS property defines how the browser should calculate the total width and height of an element."
- "By default a browser determines the total width and height based on the CSS Box Model."
- "For those we don't remember the Box Model it uses **width**, **height**, **padding**, **margin** and **border** to determine the size of the element."
- **Values:** `content-box` | `border-box`
- **Default:** `content-box` (annotated as "default" on slide)
- **Page:** ~211-213

### content-box (default)
- **Definition:** The default CSS box model behavior.
- Width and height only apply to the content area.
- Total element width = width + padding-left + padding-right + border-left + border-right.
- **Calculation example from slides:**
  - `width: 100px; padding: 10px; border: 10px;`
  - Rendered width = 100 + 10 + 10 + 10 + 10 = **140px**
- **Page:** ~214-215
```css
.content-box {
  /* The default */
  box-sizing: content-box;
  padding: 10px;
  margin: 10px;
  border: solid 10px black;
  width: 100px;
  height: 100px;
  /* Rendered: 140 x 140 */
}
```

### border-box
- **Definition:** "It offers a more concise way to size elements."
- "**border** and **padding** are automatically included in the **width** and **height** values."
- "This sometimes results in a shrinking element to fit in all the above values, but the element will always be exactly the **width** and **height** stated."
- **Calculation example from slides:**
  - `width: 100px; padding: 10px; border: 10px; box-sizing: border-box;`
  - Rendered width = **100px** (content area shrinks to accommodate padding and border)
  - Handwritten note: "contentid geti moguleg minnkad" (content can possibly shrink)
- **Page:** ~216-218
```css
.border-box {
  /* Overridden behaviour */
  box-sizing: border-box;
  padding: 10px;
  margin: 10px;
  border: solid 10px black;
  width: 100px;
  height: 100px;
  /* Rendered: 100 x 100 (content area shrinks) */
}
```

---

## 10. Background Sizing (pages ~219-232)

### background-image
- **Definition:** "**background-image** is used to either provide a valid image/s (URL) or linear/radial gradients."
- "It can be useful to apply image to **background-image** CSS property instead of **\<img\>** tag."
- "This gives us more control over the display of images."
- **Page:** ~220-222
```css
background-image: url('image.jpg');
```

### background-size
- **Definition:** "The **background-size** CSS property can have two values (at maximum) which are some valid CSS unit."
- "There are also keywords that can be applied such as **cover** and **contain**."
- "**background-size** can be comma-separated which applies custom size on multiple background images."
- **Page:** ~225-227

### cover
- Scales the image to be as large as possible so that the background area is completely covered. May crop/overflow parts of the image.
- Handwritten note: "coverar alt, tho overflow"
- **Page:** ~227
```css
background-size: cover;
```

### contain
- Scales the image as large as possible without cropping. The entire image is visible, but may leave empty space.
- Handwritten note: "reynir ad fitta alla myndina inn"
- **Page:** ~227
```css
background-size: contain;
```

### background-position
- **Definition:** "**background-position** is used to position the background image within the element."
- **Page:** ~223
```css
background-position: 50% 50%;  /* centered */
background-position: center center;
background-position: 0 0;      /* top left */
```

### background-repeat
- **Definition:** "**background-repeat** is used to determine if the background image should be repeated over the x-axis, y-axis, both or none."
- **Values:** `repeat` | `repeat-x` | `repeat-y` | `no-repeat`
- **Default:** `repeat`
- **Page:** ~223
```css
background-repeat: no-repeat;
```

### Multiple background images
- Multiple images can be stacked using comma separation. The first image is on top.
- Each property (size, position, repeat) can also be comma-separated to apply to each image individually.
- **Page:** ~228-231
```css
background-image: url('foreground.png'), url('background.jpg');
background-size: 100px, cover;
background-position: 50% 50%, 0 0;
background-repeat: no-repeat;
```

### EXAM-STYLE EXAMPLE: Multiple backgrounds (mock exam "Background sizing" question)
```css
.scene {
  width: 800px; height: 600px;
  background-image: url(heman.png),     /* 1st = on TOP */
                     url(skeletor.png),  /* 2nd = middle */
                     url(grayskull.jpg); /* 3rd = on BOTTOM */
  background-repeat: no-repeat;
  background-size: 200px, 200px, cover;  /* maps to 1st, 2nd, 3rd image */
  background-position: 200px bottom,     /* heman: 200px from left, at bottom */
                        450px bottom,     /* skeletor: 450px from left, at bottom */
                        center center;    /* grayskull: centered, covers all */
}
```
**Key rules:**
- First `background-image` is rendered on **TOP** (closest to viewer), last on **BOTTOM**
- Comma-separated `background-size` values map to images in the same order
- `background-position` supports mixed keyword/value: `200px bottom` = 200px from left, at bottom
- `cover` = fills entire container (may crop). `contain` = fits inside (may leave space)
- `border-box` does NOT include margin in its calculation

---

## 11. Selectors (pages ~233-250)

### Attribute Selectors
- **Definition:** "CSS3 offers a way to search after specific attributes and based on values of these attributes as well."
- Types: Has, Exactly, Within, Begins with, Ends with, Substring.
- **Page:** ~234-235

### Has attribute: `[attr]`
- Selects elements that have the specified attribute (regardless of value).
- Handwritten note: "allir sem hafa href"
```css
a[href] {
  text-decoration: underline;
}
```
- **Page:** ~236

### Exactly: `[attr="value"]`
- Selects elements where the attribute value exactly matches.
```css
a[href="mailto:arnarl@ru.is"] {
  color: red;
  font-weight: bold;
}
```
- **Page:** ~237

### Within (space-separated): `[attr~="value"]`
- Selects elements where the attribute value contains a space-separated word that matches.
- Handwritten note: "innihaldi space seperated 'title'"
```css
a[title~="title"] {
  color: lightblue;
  font-weight: bold;
}
```
- **Page:** ~238

### Begins with: `[attr^="value"]`
- Selects elements where the attribute value begins with the specified string.
- Handwritten note: "Begins with"
```css
a[href^="http"]:after {
  content: " (" attr(href) ") ";
}
```
- **Page:** ~239

### Ends with: `[attr$="value"]`
- Selects elements where the attribute value ends with the specified string.
- Handwritten note: "ends with"
```css
a[href$="pdf"]:before {
  font-family: 'FontAwesome';
  content: "\f1c1";
  margin-right: 5px;
  color: red;
}
```
- **Page:** ~240

### Substring (contains): `[attr*="value"]`
- Selects elements where the attribute value contains the specified substring anywhere.
- Handwritten note: "wildcard selector => kemur einhver stadar fyrir"
```css
a[href*="facebook"]:before {
  font-family: 'FontAwesome';
  content: "\f082";
  margin-right: 5px;
  color: blue;
}
```
- **Page:** ~241

### Structural Pseudo-classes
- **Definition:** "These selectors permit selection based on extra information that lies in the DOM but cannot be represented by other simple selectors."
- "These selectors are e.g. *nth-child, nth-of-type, first-child, last-child, first-of-type, last-of-type, empty*."
- **Page:** ~242

### :nth-child()
- Selects elements based on their position among ALL siblings (regardless of type).
- `nth-child(2n+1)` or `nth-child(odd)` -- selects odd children.
- `nth-child(even)` -- selects even children.
- `nth-child(3)` -- selects the 3rd child.
- Handwritten note: "oll born i oddatolu" (all children in odd numbers)
- **Page:** ~243
```css
p:nth-child(2n+1) /* nth-child(odd) */ {
  color: red;
}
p:nth-child(even) {
  background-color: yellow;
}
p:nth-child(3) {
  color: blue;
}
```

### :nth-of-type()
- Selects elements based on their position among siblings **of the same type**.
- Handwritten note: "skodar utfra sertinu a akvedi type" (looks from its own specific type)
- **Page:** ~244
```css
p:nth-of-type(2n+1) /* nth-of-type(odd) */ {
  color: red;
}
p:nth-of-type(even) {
  background-color: yellow;
}
p:nth-of-type(3) {
  color: blue;
}
```

### :first-child / :last-child
- `:first-child` -- selects the first child element (if it matches the selector type).
- `:last-child` -- selects the last child element.
- Note: If the first child is not a `<p>`, then `p:first-child` will NOT select anything. Handwritten note: "droppar, thvi first-child er her div" (drops, because first-child is a div here).
- **Page:** ~245
```css
p:first-child {
  background-color: blue;
}
p:last-child {
  background-color: red;
}
```

### :first-of-type / :last-of-type
- `:first-of-type` -- selects the first element of its type among siblings.
- `:last-of-type` -- selects the last element of its type among siblings.
- Unlike `:first-child`, this only considers elements of the same type.
- **Page:** ~246
```css
p:first-of-type {
  background-color: blue;
}
p:last-of-type {
  background-color: red;
}
```

### Practical example: table striping
```css
table > tbody > tr:nth-child(even) {
  background-color: rgba(155, 155, 155, .5);
}
```
- **Page:** ~247

### :not() (Negation)
- **Definition:** "It is a functional notation taking a simple selector as an argument. It represents an element that is not represented by its argument."
- "Can be useful to exclude styles on specific DOM elements."
- **Page:** ~248-249
```css
p:not(:first-child) {
  background-color: red;
}
```

### Pseudo-elements
- **Definition:** "**Pseudo-elements** provide authors a way to refer to content that does not exist in the source document."
- "There are four **pseudo-elements**:"
  - `::first-line`
  - `::first-letter`
  - `::before`
  - `::after`
- **Page:** ~250

### ::first-line
- Applies styles to the first line of a block-level element.
```css
p::first-line {
  font-variant: small-caps;
}
```

### ::first-letter
- Applies styles to the first letter of a block-level element.
```css
p::first-letter {
  font-size: 6em;
  font-weight: bold;
}
```

### ::before / ::after
- Inserts content before or after the element's content.
- **Requires the `content` property** (mandatory property -- annotated on slide).
- Handwritten note: "baeta vid contenti sem er ekkert til" (add content that does not exist).
```css
div::before {
  content: 'Before ';
}
div::after {
  content: ' After';
}
```
- **Page:** ~251-253

---

## 12. CSS Variables (pages ~241-252 in the later lecture set)

### CSS Variables (Custom Properties)
- **Definition:** "CSS variables (cascading variables) are entities defined by CSS authors that represent specific values to be reused throughout a document."
- "CSS variables are natively supported by all modern browsers and supported by 96.18% of global users."
- "CSS variables are defined using the custom property syntax prefixed by a -- (dash, dash)."
- **Page:** ~241-243

### IMPORTANT: CSS variables do NOT replace preprocessors (mock exam distractor!)
- CSS variables do NOT replace the need for a CSS preprocessor like SASS entirely
- Preprocessors offer features like mixins, nesting, functions that CSS variables alone cannot provide
- CSS variables ARE: dynamic (changeable at runtime), scoped, maintainable
- CSS variables are NOT: a full preprocessor replacement

### Definition syntax
```css
/* Definition */
:root {
  --primary-color: yellow;
}

/* Usage */
body {
  background-color: var(--primary-color);
}
```

### Why use CSS variables?
- "Similar to all other programming languages, variables and functions are essential to promote reusability."
- "Imagine a large and complex website consisting of multiple pages which all have similar styles... Let's say we decided to change that website to a different style forcing us to replace colors, paddings, and fonts which are hard-coded."
- "The scenario above is exactly the reason why it is more efficient in the long run to use variables."
- **Page:** ~244

### Double dash (--) definition
- "To define a CSS variable one option is to use a double dash prefix (--) followed by the property name, e.g. `--main-color`."
- "Like other properties this must be placed within a ruleset, e.g. `:root` for global reference."
- "Rulesets define scopes for CSS variables, meaning that CSS variables written inside the `aside` ruleset are only applicable to the `<aside>` element and its descendants in the DOM tree."
- "Custom property names are case sensitive, therefore `--Main-color` and `--main-color` are treated as separate properties."
- **Page:** ~245

### @property at-rule
- **Definition:** "The @property at-rule allows you to be more expressive with the definition of a custom property with the ability to associate a type with the property, set default values, and control inheritance."
- "Each @property is given a name, data type, inheritance configuration and an initial value."
- **Page:** ~246
```css
@property --main-red-color {
  syntax: "<color>";
  inherits: false;
  initial-value: rgb(255, 0, 0);
}
```

### Data types for @property
- "When defining a @property it must be associated with a specific data type."
- "The data type controls what values are considered valid when assigning the variable with a specific value."
- Examples: `<color>`, `<number>`, `<overflow>`, `<absolute-size>`
- **Page:** ~247

### Inheritance
- "When defining a @property you can specify whether it should inherit or not (*A custom property defined using two dashes -- instead of @property always inherits the value of its parent*)."
- `inherits: false` -- "The property will **not** inherit its value from parent elements in the DOM tree."
- `inherits: true` -- "The property will inherit its value from parent elements in the DOM tree." (Annotated as **default** on slide.)
- **Page:** ~248
```css
.parent {
  --main-red-color: red;
}
.child {
  /* With inherits: false */
  /* --main-red-color will be rgba(255, 0, 0) (initial value), NOT red */

  /* With inherits: true */
  /* --main-red-color would be red (inherited from parent) */
}
```

### var() function and fallbacks
- **Definition:** "Regardless of which method you choose to define a custom property, you use them by referencing the property in a `var()` function in place of a standard property value."
- Fallback values can be provided as the second argument.
- **Page:** ~249
```css
details {
  background-color: var(--main-red-color);
}

body {
  /* Provides 'white' as a fallback */
  color: var(--main-text-color, white);
}
```

### JS manipulation
- "CSS Variables can be manipulated through JS as well."
- **Page:** ~250
```javascript
const jsVar = getComputedStyle(element).getPropertyValue("--my-var");

// set variable on inline style
element.style.setProperty("--my-var", jsVar + 4);
```

---

## 13. BEM (pages ~251-258)

### BEM -- Block Element Modifier
- **Definition:** "BEM (Blocks, Elements, Modifiers) is a naming convention widely used in CSS."
- "Naming things are one of the hardest things to get right consistently in software development."
- "The reason for this struggle is partly due to missing naming systems in place - which breaks down consistency in a large team."
- Other methodologies exist (OOCSS, SMACSS, SUITCSS) but are not covered.
- **Page:** ~251-252

### Core concepts
- **Block:** "Blocks are standalone entities that have meaning on their own, e.g. `header`, `container`, `menu`, `checkbox`, `input`." Handwritten note: "alltaf tengd vid ahrverdi block" (always related to a specific block).
- **Element:** "Elements are items which are relevant in the context of a block and therefore semantically tied to the block, e.g. `menu item`, `list item`, `header title`."
- **Modifier:** "Modifiers are flags on a block or element. They are used to change appearance or behaviour, e.g. `disabled`, `highlighted`, `checked`, `size huge`."
- **Page:** ~253-254

### Naming convention rules
- **Blocks:**
  - Block names may consist of lowercase Latin letters, digits, and dashes.
  - Any DOM node can be a block if it accepts a class name.
  - Use class name selector only. No tag name or ids. No dependency on other blocks/elements on a page.
- **Elements:**
  - Element names may consist of lowercase Latin letters, digits, dashes and underscores.
  - Any DOM node within a block can be an element.
  - Separated from block name by double underscore `__`.
- **Modifiers:**
  - Modifier names may consist of lowercase Latin letters, digits, dashes and underscores.
  - Modifier is an extra class name which you add to a block/element DOM node.
  - Separated from block/element name by double dash `--`. Handwritten note: "modifier nafnid" (modifier name).

### BEM Anti-patterns (mock exam Q2 — know what is WRONG)
| Class name | Valid BEM? | Why? |
|-----------|-----------|------|
| `.card__title--active` | YES | Correct: block__element--modifier |
| `.cardTitleActive` | NO | camelCase, not BEM |
| `.card-title-active` | NO | Single dashes only, no __ or -- separators |
| `.Card__Title` | NO | PascalCase/uppercase, BEM uses lowercase only |
| `.navItemActive` | NO | camelCase, no separators |
| `.navigation__link--disabled` | YES | Correct BEM format |
- **Page:** ~256

### BEM naming pattern
```
.block { }
.block__element { }
.block--modifier { }
.block__element--modifier { }
```

### Full example from slides
```html
<form class="form form--theme-xmas form--simple">
  <input class="form__input" type="text" />
  <input
    class="form__submit form__submit--disabled"
    type="submit" />
</form>
```
```css
.form { }
.form--theme-xmas { }
.form--simple { }
.form__input { }
.form__submit { }
.form__submit--disabled { }
```
- Blocks: form
- Elements: input, submit
- Modifiers: XMAS theme, Simple, Disabled
- **Page:** ~257

### BEM button example from slides
```html
<button class="button">Normal button</button>
<button class="button button--state-success">Success button</button>
<button class="button button--state-danger">Danger button</button>
```
```css
.button {
  display: inline-block;
  border-radius: 3px;
  padding: 7px 12px;
  border: 1px solid #D5D5D5;
  background-image: linear-gradient(#EEE, #DDD);
  font: 700 13px/18px Helvetica, arial;
}
.button--state-success {
  color: #FFF;
  background: #569E3D linear-gradient(#79D858, #569E3D) repeat-x;
  border-color: #4A993E;
}
.button--state-danger {
  color: #900;
}
```
- **Page:** ~255

---

## 14. Tailwind CSS (pages ~258-265)

### Tailwind CSS
- **Definition:** "A utility-first CSS framework packed with classes like `flex`, `pt-4`, `text-center` and `rotate-90` that can be composed to build any design, directly in your markup."
- "Tailwind CSS works by scanning all of your HTML files, JavaScript components, and any other templates for class names, generating the corresponding styles and then writing them to a static CSS file."
- "Tailwind CSS is usually installed using Vite or PostCSS (Next uses PostCSS)."
- **Page:** ~259-260

### Why Tailwind?
- "Prevents context switching because you don't need to move from writing code to editing CSS in different files."
- "Prevents naming fatigue because all the class names are already defined and you don't need to come up with the names."
- "When you remove a component, you remove it styles as well."
- **Page:** ~261
```jsx
export default function Button({ children }) {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      {children}
    </button>
  );
}
```

### Tailwind Structure
- **Property-values:** "Most classes follow a logical shorthand, e.g. `text-center`, `bg-red-500`, etc."
- **Modifiers:** "You apply conditional styles using a prefix and a colon (`:`), e.g. `hover:bg-red-500`, `md:flex`, `dark:text-white`, etc."
- **Page:** ~262

### Tailwind VSCode
- "I recommend setting up the VSCode plugin Tailwind CSS Intellisense."
- "This helps tremendously as it provides auto-complete for Tailwind CSS classes that often can be hard to remember."
- **Page:** ~263
