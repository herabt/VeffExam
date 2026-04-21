# Practice Exam 13 -- CSS Animations & Media Queries

---

## Question 1 -- Fill in the Blank (Animations)

CSS Animations can be declared by using the `____________` keyword in CSS. The keyframes are a ____________ for the animation. The `animation` property is then applied within a specific CSS ____________.

---

## Question 2 -- Code Analysis (@keyframes syntax)

Look at the two @keyframes blocks below. Both are named `text-color-changer`.

**Block A:**
```css
@keyframes text-color-changer {
    from { color: blue; }
    to { color: red; }
}
```

**Block B:**
```css
@keyframes text-color-changer {
    0% { color: blue; }
    50% { color: red; }
    100% { color: yellow; }
}
```

a) What are the two different syntaxes for defining keyframe steps shown above?

b) Which block allows you to define an intermediate step at the halfway point of the animation?

c) In Block A, what does `from` correspond to in percentage terms? What does `to` correspond to?

---

## Question 3 -- Code Analysis (Applying Keyframes)

Given the following CSS:

```css
@keyframes text-color-changer {
    0% { color: blue; }
    50% { color: red; }
    100% { color: yellow; }
}

p {
    animation: text-color-changer 5s ease-in infinite;
}
```

a) What is the name of the keyframe being applied?

b) How long does one full cycle of the animation take?

c) What timing function is being used?

d) How many times will the animation repeat?

e) What color will the text be at the halfway point of each cycle?

---

## Question 4 -- Fill in the Blank (Animation Shorthand)

The `animation` shorthand property follows this order:

```
animation: [______] [______] [______] [______] [______] [______] [______] [______];
```

Fill in the eight values using the following example from the slides:

```css
.myElement {
    animation: myAnimation 5s ease-in 2s 10 reverse backwards running;
}
```

Identify what each value represents.

---

## Question 5 -- Multiple Choice (Animation Properties)

Match each animation sub-property on the left with its valid values on the right. Each property has exactly ONE correct set of values.

| # | Property | Values |
|---|----------|--------|
| 1 | animation-name | A. paused / running |
| 2 | animation-duration | B. number / infinite |
| 3 | animation-timing-function | C. @keyframes name |
| 4 | animation-delay | D. forwards / backwards / both |
| 5 | animation-iteration-count | E. [0-N]s |
| 6 | animation-direction | F. normal / reverse / alternate |
| 7 | animation-fill-mode | G. linear / ease / step-end / cubic-bezier |
| 8 | animation-play-state | H. [0-N]s |

---

## Question 6 -- Written (Transitions vs. Animations)

According to the slides, what is the key difference between CSS **transitions** and CSS **animations**?

In your answer, address:
a) When does a transition take effect?
b) How do animations differ in this regard?
c) Give one specific use case for transitions mentioned in the slides.

---

## Question 7 -- Select All That Apply (Media Queries)

According to the slides, media queries are a way to target a specific device (e.g. phone, tablet, and more). Which of the following are **media types** shown in the slides?

- [ ] A. `screen`
- [ ] B. `print`
- [ ] C. `speech`
- [ ] D. `all`
- [ ] E. `mobile`
- [ ] F. `desktop`
- [ ] G. `tablet`

---

## Question 8 -- Fill in the Blank (Media Query Syntax)

According to the slides, the general syntax for a media query is:

```css
@media [______] and [______] and [______] {
    ...styles
}
```

The three parts of the media query correspond to:
- First blank: media type (e.g. ____________, ____________, ____________, ____________)
- Second blank: expression / media feature (e.g. ____________: 400px or ____________: 400px)
- Third blank: ____________ (e.g. landscape, portrait)

---

## Question 9 -- Code Analysis (Media Query Examples)

Examine the following media query code from the slides:

```css
@media screen and (max-width: 400px) {
    .column { width: 100%; }
}
@media screen and (max-width: 768px) and (min-width: 400px) {
    .column { width: 50%; }
}
@media screen and (min-width: 768px) {
    .column { width: 33.3%; }
}
```

a) On a device with a screen width of 350px, what will the width of `.column` be?

b) On a device with a screen width of 500px, what will the width of `.column` be?

c) On a device with a screen width of 1024px, what will the width of `.column` be?

d) How many columns would fit side-by-side on a 1024px screen (approximately)?

---

## Question 10 -- Multiple Choice (Applying Media Queries)

According to the slides, there are two common ways to apply media queries. Which two methods are described?

A. Using JavaScript `window.matchMedia()`  
B. External stylesheets using the `<link>` element with a `media` attribute  
C. Using `@media` rules within the stylesheet  
D. Using the `<style media="...">` attribute in HTML  

---

## Question 11 -- Code Analysis (External Stylesheet Media Query)

The slides show the following example of an external stylesheet with a media query:

```html
<link rel='stylesheet' media='screen and (min-width: 768px) and (max-width: 1024px)' href='css/medium.css' />
```

a) What file will be loaded when this media query matches?

b) What is the minimum screen width for this stylesheet to apply?

c) What is the maximum screen width for this stylesheet to apply?

d) Will this stylesheet apply when the page is printed? Why or why not?

---

## Question 12 -- Code Analysis (Media Query Use Cases)

Look at the following five media query blocks from the slides. For each one, describe what it does and when it applies.

**Block 1:**
```css
@media print {
    a[href^=http]:after {
        content: '( ' attr(href) ' )';
    }
    * { color: black !important; }
}
```

**Block 2:**
```css
@media screen and (max-width: 400px) {
    .navigation-burger-menu {
        display: block;
    }
}
```

**Block 3:**
```css
@media not print {
    .print-icon {
        display: inline-block;
    }
}
```

**Block 4:**
```css
@media screen and (max-width: 400px) and (orientation: portrait) {
    .col { width: 100%; }
}
```

**Block 5:**
```css
@media all {
    * { font-size: 24px !important; }
}
```

---

## Question 13 -- Written (Media Features)

a) According to the slides, the **expressions** in media queries are called ____________.

b) They test for specific characteristics of the ____________, ____________ or ____________.

c) Are media features required in a media query? Can you have more than one?

d) Name four media features from the table shown in the slides.

---

## Question 14 -- Code Writing (Create a Complete Animation)

Write the complete CSS code to create an animation with the following requirements:
- Name the keyframe `pulse`
- At 0%: `transform: scale(1);`
- At 50%: `transform: scale(1.2);`
- At 100%: `transform: scale(1);`
- Apply the animation to a `.button` class
- Duration: 2 seconds
- Timing function: ease-in
- Repeat infinitely
- Direction: alternate

Use the shorthand `animation` property when applying the animation.

---

## Question 15 -- Code Writing (Media Queries)

Write a complete set of media queries for a responsive layout where:

a) On screens 400px and below, the `.sidebar` has `display: none;` and `.content` has `width: 100%;`

b) On screens between 401px and 768px, `.sidebar` has `width: 30%;` and `.content` has `width: 70%;`

c) On screens 769px and above, `.sidebar` has `width: 25%;` and `.content` has `width: 75%;`

Use the `@media` syntax from the slides (not external stylesheets).

---

---

# ANSWER KEY

---

## Answer 1

CSS Animations can be declared by using the `@keyframes` keyword in CSS. The keyframes are a **recipe** for the animation. The `animation` property is then applied within a specific CSS **selector**.

---

## Answer 2

a) The two syntaxes are:
   - **from/to** syntax (Block A)
   - **percentage** syntax using 0%, 50%, 100% etc. (Block B)

b) **Block B** -- the percentage syntax allows intermediate steps like 50%.

c) `from` corresponds to **0%** and `to` corresponds to **100%**.

---

## Answer 3

a) `text-color-changer`

b) **5 seconds** (5s)

c) **ease-in**

d) **Infinitely** -- it will repeat forever (infinite)

e) **Red** -- at 50% the color is red

---

## Answer 4

The animation shorthand order is:

```
animation: [name] [duration] [timing-function] [delay] [iteration-count] [direction] [fill-mode] [play-state];
```

From the example `animation: myAnimation 5s ease-in 2s 10 reverse backwards running;`:

1. **myAnimation** = Name of keyframe (animation-name)
2. **5s** = Duration (animation-duration)
3. **ease-in** = Timing function (animation-timing-function)
4. **2s** = Delay (animation-delay)
5. **10** = Iterations (animation-iteration-count)
6. **reverse** = Direction (animation-direction)
7. **backwards** = Fill mode (animation-fill-mode)
8. **running** = Play state (animation-play-state)

---

## Answer 5

1 --> C (@keyframes name)
2 --> E ([0-N]s)
3 --> G (linear / ease / step-end / cubic-bezier)
4 --> H ([0-N]s)
5 --> B (number / infinite)
6 --> F (normal / reverse / alternate)
7 --> D (forwards / backwards / both)
8 --> A (paused / running)

---

## Answer 6

a) **Transitions** can only take effect when the property they are applied to **changes**. They require a trigger -- for example, when a user hovers a button, or when an element moves, appears, or disappears.

b) **Animations** can be executed independently -- they change the state of the property/properties on their own, without requiring an external trigger or property change.

c) Use cases for transitions mentioned in the slides:
   - When a user hovers a button
   - When an element moves
   - When an element disappears
   - When an element appears

Additional context from slides: When CSS properties are applied to an element it usually happens really fast (too fast for the eye to see). Transitions are useful to slow down the effects taking place on the element, moving elements from one state to the next in a smooth manner.

---

## Answer 7

Correct answers: **A, B, C, D**

- [x] A. `screen`
- [x] B. `print`
- [x] C. `speech`
- [x] D. `all`
- [ ] E. `mobile` -- not a valid media type
- [ ] F. `desktop` -- not a valid media type
- [ ] G. `tablet` -- not a valid media type

The four media types shown in the slides are: **screen, print, speech, all**.

---

## Answer 8

```css
@media [media] and [expression] and [orientation] {
    ...styles
}
```

- First blank: media type -- **screen**, **print**, **speech**, **all**
- Second blank: expression / media feature -- **min-width**: 400px or **max-width**: 400px
- Third blank: **orientation** -- e.g. landscape, portrait

---

## Answer 9

a) On a 350px screen: `.column` width = **100%** (matches `max-width: 400px`)

b) On a 500px screen: `.column` width = **50%** (matches `max-width: 768px` AND `min-width: 400px`)

c) On a 1024px screen: `.column` width = **33.3%** (matches `min-width: 768px`)

d) Approximately **3 columns** would fit side-by-side (100% / 33.3% = ~3)

---

## Answer 10

Correct answers: **B and C**

- B. External stylesheets using the `<link>` element with a `media` attribute
- C. Using `@media` rules within the stylesheet

---

## Answer 11

a) The file `css/medium.css` will be loaded.

b) Minimum screen width: **768px**

c) Maximum screen width: **1024px**

d) **No**, it will not apply when printing because the media type is set to `screen`, not `print` or `all`.

---

## Answer 12

**Block 1:** Applies only when the page is being **printed** (`@media print`). It adds the URL after every link that starts with "http" using the `:after` pseudo-element and `attr(href)`. It also forces all text to be black with `!important`.

**Block 2:** Applies on **screens 400px wide or less**. It shows the hamburger/burger navigation menu by setting `display: block;` -- this is a common responsive pattern for mobile navigation.

**Block 3:** Applies to **all media types EXCEPT print** (`@media not print`). It shows a print icon as `inline-block` -- the icon is visible on screen but hidden when printing.

**Block 4:** Applies on **screens 400px wide or less AND in portrait orientation**. It sets columns to full width (100%) -- useful for narrow phone screens held vertically.

**Block 5:** Applies to **all media types** (`@media all`). It forces all elements to have a font-size of 24px using `!important`.

---

## Answer 13

a) The expressions in media queries are called **Media features**.

b) They test for specific characteristics of the **user agent**, **output device** or **environment**.

c) Media features are **optional** and you can have **as many as you like**.

d) Any four from the table: **width**, **height**, **aspect-ratio**, **orientation**, **resolution**, **scan**, **grid**, **update**, **overflow-block**, **overflow-inline**, **color**, **color-gamut**, **color-index**, **display-mode**, **monochrome**.

---

## Answer 14

```css
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

.button {
    animation: pulse 2s ease-in infinite alternate;
}
```

Breakdown of the shorthand:
- `pulse` = animation-name
- `2s` = animation-duration
- `ease-in` = animation-timing-function
- `infinite` = animation-iteration-count
- `alternate` = animation-direction

---

## Answer 15

```css
@media screen and (max-width: 400px) {
    .sidebar { display: none; }
    .content { width: 100%; }
}

@media screen and (min-width: 401px) and (max-width: 768px) {
    .sidebar { width: 30%; }
    .content { width: 70%; }
}

@media screen and (min-width: 769px) {
    .sidebar { width: 25%; }
    .content { width: 75%; }
}
```

Key points:
- Each query uses `@media screen and (...)` syntax
- The `and` keyword combines multiple media features
- `min-width` and `max-width` are used to define breakpoint ranges
- The ranges should not overlap to avoid conflicts
