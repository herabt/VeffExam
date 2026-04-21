# Practice Exam 9 -- CSS3 In Depth

---

## Question 1 -- Linear Gradients Basics

`linear-gradient()` is applied to which CSS property? What is the default direction if no angle is given?

---

## Question 2 -- Linear Gradient Angles

Given the following four declarations, describe the direction each gradient flows (e.g. "bottom to top", "left to right"):

```css
/* A */ background-image: linear-gradient(0deg, white, black);
/* B */ background-image: linear-gradient(90deg, white, black);
/* C */ background-image: linear-gradient(180deg, white, black);
/* D */ background-image: linear-gradient(-90deg, white, black);
```

---

## Question 3 -- Linear Gradient with Direction Point

What does the following code produce? What does the first argument `to right bottom` represent?

```css
.my-div {
    width: 100px;
    height: 100px;
    background-image: linear-gradient(to right bottom, #ff00ff, rgba(200, 100, 150, .5), blue);
}
```

---

## Question 4 -- Stacking Gradients

Explain why `rgba` colors are essential when stacking multiple `linear-gradient()` values on a single `background-image`. What would happen if you used fully opaque colors instead?

```css
.my-div {
    width: 100px;
    height: 100px;
    background-image: linear-gradient(180deg, rgba(65, 244, 86, .8), rgba(244, 66, 223, .8)),
                       linear-gradient(0deg, rgba(65, 244, 86, .6), rgba(244, 66, 223, .6)),
                       linear-gradient(180deg, rgba(65, 244, 86, .4), rgba(244, 66, 223, .4)),
                       linear-gradient(0deg, rgba(65, 244, 86, .2), rgba(244, 66, 223, .2));
}
```

---

## Question 5 -- Radial Gradients

a) How do radial gradients differ from linear gradients?

b) What is the default direction of a radial gradient (where does it start)?

c) What are the two possible shape values for a radial gradient?

d) How do you position a radial gradient at a specific point? Write the syntax for a circle positioned at 75% 75%.

---

## Question 6 -- Repeating Gradients

What is the difference between `linear-gradient` and `repeating-linear-gradient`? Explain what the following code produces:

```css
.my-div {
    width: 100px;
    height: 100px;
    background-image: repeating-linear-gradient(-45deg, black 5px, black 10px, yellow 15px, yellow 20px);
}
```

---

## Question 7 -- Box Shadow

a) List all the values in the `box-shadow` shorthand in order:

```css
box-shadow: 10px 10px 10px 10px blue;
```

b) What does the `inset` keyword do when added to `box-shadow`?

c) The slides state that `box-shadow` can be used to "replicate elements." Given the following code, how many visible boxes appear on screen and why?

```css
.my-div {
    border: solid 1px rgba(155, 155, 155, .5);
    width: 10px;
    height: 10px;
    box-shadow: 20px 0, 40px 0, 60px 0, 80px 0;
}
```

---

## Question 8 -- Transitions vs Animations

According to the slides:

a) Transitions can only take effect when __________.

b) Animations can be __________ and therefore changing the state of the property/ies.

c) Why do we need transitions? What problem do they solve regarding how CSS properties are applied?

---

## Question 9 -- Transition Shorthand

Identify each part of the transition shorthand:

```css
transition: background-color 1s ease-in 0s;
```

Write a CSS rule that transitions `background-color` in 1 second, `width` in 2 seconds, and `height` in 3 seconds, all triggered by a `:hover` state change.

---

## Question 10 -- Transforms Overview

a) Transforms are either __________ or __________ transforms.

b) What is the default `transform-origin`? What does it correspond to in the coordinate system?

c) Why does `transform-origin` matter?

---

## Question 11 -- Rotation Transforms

What is the visual difference between each of the following? What does `rotateZ(45deg)` equal?

```css
transform: rotate(45deg);
transform: rotateX(45deg);
transform: rotateY(45deg);
transform: rotateZ(45deg);
transform: rotate3d(1, 1, 1, 45deg);
```

---

## Question 12 -- Multiple Transforms and Order

The slides emphasize that the order of transform values matters. Given the following two rules, explain why the element moves in different directions:

```css
/* Rule A */
transform: rotate(180deg) translateY(20px);

/* Rule B */
transform: translateY(20px) rotate(180deg);
```

Which direction does the element move in Rule A and why?

---

## Question 13 -- Perspective

a) What does the `perspective` CSS property do? What does its value represent?

b) The `perspective` CSS property only applies to __________ and not on the element itself.

c) What is the difference between using `perspective` as a CSS property on a parent vs. using `perspective()` as a transform value?

d) What is `perspective-origin` and what is its default value?

---

## Question 14 -- Border Radius

a) Identify the four corners in order for `border-radius`:

```css
border-radius: 5px 5px 5px 5px;
```

b) What value of `border-radius` creates a perfect circle (on a square element)?

c) What does the `/` do in `border-radius: 20px / 100%`?

d) What shape does `border-radius: 50% 0 50% 0` create?

---

## Question 15 -- Box Sizing

a) What does the `box-sizing` CSS property define?

b) What are its two possible values and which is the default?

c) Given the following CSS, what is the total rendered width and height of each element? Show your calculation.

```css
.content-box {
    box-sizing: content-box;
    padding: 10px;
    margin: 10px;
    border: solid 10px black;
    width: 100px;
    height: 100px;
}

.border-box {
    box-sizing: border-box;
    padding: 10px;
    margin: 10px;
    border: solid 10px black;
    width: 100px;
    height: 100px;
}
```

---

## Question 16 -- Background Sizing

a) What is the difference between `background-size: cover` and `background-size: contain`?

b) When using multiple background images, which image appears on top?

c) Given the following CSS, explain what each property does and how they work together:

```css
background-image: url(he-man.png), url(clouds.jpg);
background-size: 100px, cover;
background-position: 50% 50%, 0 0;
background-repeat: no-repeat;
```

---

## Question 17 -- Attribute Selectors

Given the following HTML, write the CSS selector that would match in each case:

```html
<a href="mailto:arnarl@ru.is">Mail me</a>
<a href="http://facebook.com/profile.jpg" title="My title">My profile</a>
<a href="http://example.com/cv.pdf">My CV</a>
<a href>Link with nothing</a>
<a>Broken link</a>
<a href="" data-some-data="data">Data link</a>
<a href="#" target="_blank">Blank link</a>
```

a) Select all `<a>` elements that have an `href` attribute (regardless of value).

b) Select the `<a>` element whose `href` is exactly `"mailto:arnarl@ru.is"`.

c) Select `<a>` elements whose `title` attribute contains the word `"title"` in a space-separated list of words.

d) Select `<a>` elements whose `href` begins with `"http"`.

e) Select `<a>` elements whose `href` ends with `"pdf"`.

f) Select `<a>` elements whose `href` contains the substring `"facebook"` anywhere.

---

## Question 18 -- Structural Pseudo-Classes

Given the following HTML:

```html
<div>Lorem ipsum dolor sit amet</div>
<p>Lorem ipsum dolor sit amet</p>
<p>Lorem ipsum dolor sit amet</p>
<div>Lorem ipsum dolor sit amet</div>
<p>Lorem ipsum dolor sit amet</p>
<p>Lorem ipsum dolor sit amet</p>
```

a) What is the difference between `p:first-child` and `p:first-of-type`? Which one would match in this HTML and which would not? Explain why.

b) Write CSS to color every odd `<p>` element red using `nth-child`.

c) What is the difference between `p:nth-child(2n+1)` and `p:nth-of-type(2n+1)` when the parent contains mixed element types (`<div>` and `<p>`)?

---

## Question 19 -- Negation Pseudo-Class and Pseudo-Elements

a) What does `p:not(:first-child)` select?

b) Pseudo-elements provide a way to refer to __________ that does not exist in the source document.

c) `::before` and `::after` require a mandatory property called __________. What happens if this property is omitted?

d) What does the `attr()` function do in the context of pseudo-elements? Write the CSS from the slides that appends the URL after links beginning with `"http"`.

---

## Question 20 -- Comprehensive CSS3 Scenario

A developer writes the following CSS. Identify and explain every CSS3 feature used:

```css
div {
    position: relative;
    height: 200px;
    width: 200px;
    border-radius: 50%;
    background-color: yellow;
    border: solid 5px #916124;
}

div::after {
    position: absolute;
    content: '';
    width: 20px;
    height: 20px;
    left: 40px;
    top: 60px;
    background: black;
    border-radius: 50%;
    box-shadow: 90px 0 0 black, 46px 30px 0 40px yellow, 46px 50px 0 30px red;
}
```

What does this code visually create? How are the box-shadows used here?

---

---

# Answer Key

---

### Answer 1

`linear-gradient()` is applied to the **`background-image`** CSS property. Instead of providing `url('/profile-img.jpg')`, you can make it a `linear-gradient()`.

If no angle is given, it **defaults to top to bottom**.

---

### Answer 2

- **A (0deg):** Bottom to top (upward)
- **B (90deg):** Left to right
- **C (180deg):** Top to bottom (downward)
- **D (-90deg):** Right to left

---

### Answer 3

The `linear-gradient()` accepts multiple parameters. The first argument is a **point or angle which determines the direction** of the gradient. `to right bottom` means the gradient flows from the top-left corner toward the bottom-right corner.

The second through nth arguments are **colors which can be rgb, rgba, hex**. In this case: `#ff00ff` (magenta), `rgba(200, 100, 150, .5)` (semi-transparent pink), and `blue`.

---

### Answer 4

When stacking gradients, `rgba` colors with transparency (alpha < 1) are essential because gradients are layered on top of each other. If you used fully opaque colors, only the topmost gradient would be visible -- it would completely cover the ones below. By using semi-transparent rgba colors, the lower gradients can show through, creating a blended, layered visual effect.

---

### Answer 5

a) **Radial gradients** work just like **linear gradients** except they radiate out from a central point.

b) If no angle is defined, it starts from **inner to outer** (center outward). This is the default.

c) Radial gradients can be either a **circle** or **ellipse**.

d) Position is specified with the `at` keyword followed by percentage values:
```css
background-image: radial-gradient(circle at 75% 75%, rgba(155, 155, 155, .6), rgba(255, 255, 255, .6));
```

---

### Answer 6

`repeating-linear-gradient` repeats the gradient pattern across the entire element, while a regular `linear-gradient` renders the gradient only once.

The code produces a **diagonal striped pattern** at -45 degrees. The gradient goes: black from 5px to 10px, then yellow from 15px to 20px, and this 20px pattern repeats across the entire 100x100px element, creating a black and yellow hazard-stripe pattern.

---

### Answer 7

a) The five values in order are:
1. **offset-x** (10px) -- horizontal shadow offset
2. **offset-y** (10px) -- vertical shadow offset
3. **blur-radius** (10px) -- the blur effect
4. **spread-radius** (10px) -- the size of the spread
5. **color** (blue) -- the shadow color

b) The `inset` keyword makes the shadow appear **inside** the element rather than outside. Example from slides:
```css
box-shadow: inset 5px 5px 10px 10px rgba(155, 155, 155, .5);
```

c) **5 visible boxes** appear on screen. The original element (10x10px) plus 4 shadows. Because the shadows have no blur-radius or spread-radius (just `20px 0`, `40px 0`, etc.), each shadow is an exact copy of the element positioned at different x-offsets. This demonstrates how box-shadow can be used to **replicate elements**.

---

### Answer 8

a) Transitions can only take effect when **the property they are applied to change** (e.g., on hover, when an element moves, appears, or disappears).

b) Animations can be **executed** and therefore changing the state of the property/ies (they run independently without needing a property change trigger).

c) When CSS properties are applied to an element it usually happens really fast (too fast for the eye to see). Therefore **transitions** can be useful to slow down the effects taking place on the element. We need transitions to move elements from one state to the next in a **smooth manner**.

---

### Answer 9

The four parts of the transition shorthand:
1. **CSS property:** `background-color`
2. **Duration:** `1s`
3. **Timing function:** `ease-in`
4. **Delay:** `0s`

Multiple transitions with hover trigger:
```css
.my-div {
    width: 200px;
    height: 200px;
    transition: background-color 1s, width 2s, height 3s;
}

.my-div:hover {
    width: 250px;
    height: 250px;
    background-color: green;
}
```

---

### Answer 10

a) Transforms are either **2D** or **3D** transforms.

b) The default `transform-origin` is **50% 50%**, which is the **center of the element**. This center point serves as the origin for all transform calculations. From that origin, adding to the X-axis goes further right and adding to the Y-axis goes further down (from slides). Example: `transform-origin: 50px 70px` moves the origin to a specific point.

c) `transform-origin` matters because it defines the point around which transforms (like rotation, scaling) are applied. Changing it changes the anchor point of the transformation. Example: `transform-origin: 50px 70px;`

---

### Answer 11

- **rotate(45deg):** Rotates the element 45 degrees clockwise around the Z-axis (flat rotation).
- **rotateX(45deg):** Rotates around the X-axis (tips forward/backward like a door hinge at the top).
- **rotateY(45deg):** Rotates around the Y-axis (swings left/right like a door hinge on the side).
- **rotateZ(45deg):** Rotates around the Z-axis -- this is **equal to `rotate(45deg)`**.
- **rotate3d(1, 1, 1, 45deg):** Rotates 45 degrees around a custom axis defined by the vector (1, 1, 1), producing a combined 3D rotation.

---

### Answer 12

The order of transform values matter because the first is applied and then the second and etc.

**Rule A** (`rotate(180deg) translateY(20px)`): First the element is rotated 180 degrees (flipped upside down). Then `translateY(20px)` is applied. Because the coordinate system has been rotated, "down" (positive Y) is now "up" in the original space. So the element **moves up** instead of down.

**Rule B** (`translateY(20px) rotate(180deg)`): First the element is translated 20px down, then it is rotated 180 degrees in place. The element ends up **moved down** and flipped.

This demonstrates that **ORDER MATTERS** with multiple transforms.

---

### Answer 13

a) **perspective** creates an artificial viewpoint from where you view the 3D object, and therefore providing the illusion of depth. Its value defines how far the object is away from the user. The depth defaults to 0.

b) The `perspective` CSS property only applies to **its children** and not on the element itself.

c) The difference:
- **`perspective` property** (on parent): Is applied to **all child elements**, creating a shared 3D space/vanishing point for all children.
- **`perspective()` transform value** (on element): Is applied to **the element itself**, giving each element its own individual perspective.

When using `perspective` as a property on a parent, multiple children share the same vanishing point. When using `transform: perspective()` on each element individually, each element has its own vanishing point.

d) **`perspective-origin`** sets the origin point of the element from where the perspective will be viewed, therefore changing the angle. It takes two values: x-position and y-position. The **default is 50% 50%**.

---

### Answer 14

a) The four corners in order:
1. **top-left**
2. **top-right**
3. **bottom-right**
4. **bottom-left**

b) `border-radius: **50%**` creates a perfect circle (on a square element).

c) The `/` separates horizontal radius from vertical radius, creating **elliptical** corners. The first set of values defines the **horizontal radius**. The optional second set, preceded by `/`, defines the **vertical radius**. If only one set is provided, it is used for both vertical and horizontal radius. So `20px / 100%` means: 20px horizontal radius, 100% vertical radius.

d) `border-radius: 50% 0 50% 0` creates a **leaf/eye shape** -- rounded on top-left and bottom-right corners, square on top-right and bottom-left.

---

### Answer 15

a) The `box-sizing` CSS property defines **how the browser should calculate the total width and height of an element**.

b) Two values: **`content-box`** (the default) and **`border-box`**.

c) Calculations:

**`.content-box`** (content-box -- default):
- Width = 100px (content) + 10px (padding-left) + 10px (padding-right) + 10px (border-left) + 10px (border-right) = **140px**
- Height = 100px + 10px + 10px + 10px + 10px = **140px**
- Padding and border are added to BOTH SIDES on top of the declared width/height.
- (Margin is not included in the element's rendered size but takes up additional space: 10px on each side.)

**`.border-box`** (border-box):
- Width = **100px** (border and padding are included within the declared width)
- Height = **100px**
- The content area shrinks to fit: 100px - 10px - 10px (padding) - 10px - 10px (border) = 60px content
- The element will always be exactly the width and height stated.

---

### Answer 16

a) **`cover`**: Scales the image to cover the entire element. The image may be cropped (overflow is hidden) but there will be no empty space. **`contain`**: Scales the image to fit entirely within the element. The entire image is visible, but there may be empty space (the image may repeat to fill gaps).

b) When using multiple background images, the **first** image listed appears **on top**.

c) Property breakdown:
- `background-image`: Two images are layered; `he-man.png` is on top, `clouds.jpg` is below.
- `background-size: 100px, cover`: The top image (He-Man) is sized to 100px; the bottom image (clouds) uses `cover` to fill the entire element.
- `background-position: 50% 50%, 0 0`: He-Man is centered (50% 50%); clouds start from top-left (0 0).
- `background-repeat: no-repeat`: Neither image repeats.

---

### Answer 17

a) **Has** attribute: `a[href]` -- selects all `<a>` elements that have an href attribute.

b) **Exactly** matches value: `a[href="mailto:arnarl@ru.is"]`

c) **Within** (space-separated list contains word): `a[title~="title"]`

d) **Begins with**: `a[href^="http"]`

e) **Ends with**: `a[href$="pdf"]`

f) **Substring** (contains anywhere): `a[href*="facebook"]` -- this is the wildcard/substring selector; it matches if "facebook" appears anywhere in the href value.

---

### Answer 18

a) **`p:first-child`** selects a `<p>` that is the first child of its parent. In this HTML, the first child is a `<div>`, not a `<p>`, so `p:first-child` **does NOT match** any element. It "drops" because the first-child is a `<div>`.

**`p:first-of-type`** selects the first `<p>` element among its siblings, regardless of what other element types come before it. In this HTML, the second element (first `<p>`) **does match** `p:first-of-type` and gets styled.

b) Every odd `<p>` element using nth-child:
```css
p:nth-child(2n+1) { /* equivalent to nth-child(odd) */
    color: red;
}
```

c) `p:nth-child(2n+1)` counts ALL children (regardless of type) and then checks if the matched child is a `<p>`. It counts `<div>` and `<p>` elements together in the numbering.

`p:nth-of-type(2n+1)` only counts `<p>` elements when determining position. It filters by type first, then applies the nth formula. So nth-of-type "skips" the `<div>` elements entirely in its counting.

---

### Answer 19

a) `p:not(:first-child)` selects all `<p>` elements that are **not** the first child of their parent. It is a functional notation taking a simple selector as an argument. It represents an element that is not represented by its argument. It can be useful to exclude styles on specific DOM elements.

b) Pseudo-elements provide a way to refer to **content that does not exist in the source document**.

c) `::before` and `::after` require the mandatory **`content`** property. If `content` is omitted, the pseudo-element will not be rendered/displayed at all. Even an empty string (`content: '';`) is sufficient.

d) The `attr()` function retrieves the value of an attribute from the selected element and inserts it as content. From the slides:
```css
a[href^="http"]::after {
    content: " (" attr(href) ") ";
}
```
This appends the full URL in parentheses after every link whose href begins with "http". For example, "My profile" becomes "My profile (http://facebook.com/profile.jpg)".

---

### Answer 20

CSS3 features used:

1. **`border-radius: 50%`** -- Creates a perfect circle from the 200x200px div (rounded corners).
2. **`::after` pseudo-element** -- Creates content that does not exist in the source document. Uses the mandatory `content: '';` property (empty string).
3. **`border-radius: 50%`** on ::after -- Makes the 20x20px pseudo-element into a circle (an eye).
4. **`box-shadow`** with multiple values (comma-separated):
   - `90px 0 0 black` -- Creates a second black circle 90px to the right (the other eye), replicating the element.
   - `46px 30px 0 40px yellow` -- Creates a larger yellow circle (spread-radius 40px) positioned below, forming the mouth/smile background.
   - `46px 50px 0 30px red` -- Creates a red circle (spread-radius 30px) forming the smile/mouth.

This code creates a **smiley face emoji**: a yellow circle with a brown border, two black dot eyes (one is the ::after element, the other is its box-shadow replica), and a smile made from layered colored box-shadows. This demonstrates how box-shadow can be used to replicate elements and create complex illustrations.
