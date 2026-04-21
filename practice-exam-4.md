# Practice Exam 4 -- Vefforritun 2

**Topics:** BEM, CSS Variables, Tailwind CSS, JavaScript Objects, Prototypes & Constructors

---

## Section A: BEM (Blocks, Elements, Modifiers)

### Question 1 -- Fill in the blank (Slide 253)

According to the slides, BEM stands for ________, ________, and ________.

In the BEM core concepts:

- **Blocks** are defined as: "________________ entities that have meaning on their own"
- **Elements** are defined as: "items which are ________________ and therefore semantically tied to the block"
- **Modifiers** are defined as: "________ on a block or element. They are used to change ________ or ________"

---

### Question 2 -- Multiple choice (Slide 257)

According to the slides, which characters are allowed in BEM **block** names?

- A) Lowercase Latin letters, digits, dashes, and underscores
- B) Lowercase Latin letters, digits, and dashes
- C) Any alphanumeric characters and dashes
- D) Lowercase Latin letters only

---

### Question 3 -- Select all that apply (Slide 257)

Which of the following are TRUE about BEM naming conventions according to the slides?

- [ ] A) Block names may consist of lowercase Latin letters, digits, and dashes
- [ ] B) Element names may consist of lowercase Latin letters, digits, dashes and underscores
- [ ] C) Modifier names may consist of lowercase Latin letters, digits, dashes and underscores
- [ ] D) Any DOM node can be a block if it accepts a class name
- [ ] E) Blocks should use tag name or id selectors
- [ ] F) Modifier is an extra class name which you add to a block/element DOM node
- [ ] G) Blocks should use class name selector only, with no dependency on other blocks/elements on a page

---

### Question 4 -- Code analysis (Slide 258)

Look at the following BEM HTML and CSS from the slides:

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

From this example, identify:

a) What is the Block? ________

b) What are the Elements? ________ and ________

c) What are the Modifiers? ________, ________, and ________

d) What separator is used between a block and an element? ________

e) What separator is used between a block/element and a modifier? ________

---

### Question 5 -- Written explanation (Slide 254-255)

Looking at the GitHub visual example from the slides, the teacher annotated the following BEM identifications on the GitHub homepage:

- The navigation bar at the top is identified as a **menu** (________), with items inside it labeled as **menu elements** (________).
- The "Sign in" area is labeled as a **button** (________).
- The form fields are labeled as **input** with modifier **size big** (________).
- The green "Sign up for GitHub" button is labeled as **button** with modifier **theme green** (________).

For each label above, indicate whether it is a Block, Element, or Modifier.

---

## Section B: CSS Variables / Custom Properties

### Question 6 -- Fill in the blank (Slide 243)

According to the slides, CSS variables (cascading variables) are "________ defined by CSS authors that represent specific values to be ________ throughout a document."

CSS variables are defined using the custom property syntax prefixed by a ________ (dash, dash).

---

### Question 7 -- Code analysis (Slide 243, 249-250)

Given the following code from the slides:

```css
// Definition
:root {
  --primary-color: yellow;
}

// Usage
body {
  background-color: var(--primary-color);
}
```

a) What CSS function is used to reference a custom property? ________

b) How do you provide a fallback value when using CSS variables? Write the syntax from the slides:

```css
color: var(________________);
```

c) According to the slides, are custom property names case sensitive? ________

Therefore `--Main-color` and `--main-color` are treated as ________.

---

### Question 8 -- Multiple choice (Slide 246)

According to the slides, what does the `@property` at-rule allow you to do?

- A) Only define CSS variable names
- B) Be more expressive with the definition of a custom property with the ability to associate a type, set default values, and control inheritance
- C) Only set default values for CSS variables
- D) Replace the var() function

---

### Question 9 -- Code analysis (Slide 248-250)

Given this `@property` definition and usage from the slides:

```css
@property --main-red-color {
  syntax: "<color>";
  inherits: false;
  initial-value: rgb(255, 0, 0);
}

.parent {
  --main-red-color: red;
}

.child {
  /* What will --main-red-color be here? */
}
```

a) With `inherits: false`, what will `--main-red-color` be in `.child`? ________

b) With `inherits: true`, what will `--main-red-color` be in `.child`? ________

c) According to the slides, a custom property defined using two dashes `--` (instead of `@property`) always ________ the value of its parent.

---

### Question 10 -- Fill in the blank (Slide 251)

According to the slides, CSS Variables can be manipulated through JS. Complete the code:

```javascript
// Read a CSS variable value
const jsVar = ________(element).________(\"--my-var\");

// Set a CSS variable on inline style
element.style.________(\"--my-var\", jsVar + 4);
```

---

## Section C: Tailwind CSS

### Question 11 -- Fill in the blank (Slide 260)

According to the slides, Tailwind CSS is described as: "A ________ CSS framework packed with classes like `flex`, `pt-4`, `text-center` and `rotate-90` that can be composed to build any design, directly in your ________."

Tailwind CSS works by "scanning all of your ________ files, JavaScript components, and any other templates for ________, generating the corresponding styles and then writing them to a ________ CSS file."

---

### Question 12 -- Select all that apply (Slide 261)

According to the slides, why should you use Tailwind CSS? Select all reasons given:

- [ ] A) Prevents context switching because you don't need to move from writing code to editing CSS in different files
- [ ] B) It is faster than all other CSS frameworks
- [ ] C) Prevents naming fatigue because all the class names are already defined and you don't need to come up with the names
- [ ] D) When you remove a component, you remove its styles as well
- [ ] E) It automatically generates responsive designs

---

### Question 13 -- Multiple choice (Slide 262)

According to the slides on Tailwind CSS structure, how do you apply conditional styles (e.g., hover states, responsive breakpoints, dark mode)?

- A) Using media queries in a separate CSS file
- B) Using a prefix and a colon (`:`), e.g. `hover:bg-red-500`, `md:flex`, `dark:text-white`
- C) Using JavaScript event listeners
- D) Using BEM modifiers

---

## Section D: JavaScript Objects

### Question 14 -- Fill in the blank (Slide 341-343)

According to the slides:

a) Objects are considered as the ________ datatype of JS.

b) An object is an unordered collection of ________, each of which has a ________ and a ________.

c) Every object inherits the properties of another object known as its ________.

d) Objects are ________, meaning that properties can be added and/or deleted in runtime.

e) Objects are ________ and are manipulated by ________ rather than by value.

---

### Question 15 -- Multiple choice (Slide 344)

According to the slides, each property has three associated values called **property attributes**. What are they and what are their default values?

- A) readable (true), writeable (true), deletable (true)
- B) writeable (true), enumerable (true), configurable (true)
- C) visible (true), editable (true), removable (true)
- D) public (true), static (false), final (false)

---

### Question 16 -- Code analysis (Slide 377-378)

Given the following code from the slides:

```javascript
var o = { x : 1 };
console.log(Object.getOwnPropertyDescriptor(o, 'x'));
// {value: 1, writable: true, enumerable: true, configurable: true}

Object.defineProperty(o, 'x', {
    value: 1,
    writeable: false,
    enumerable: true,
    configurable: true
});

console.log(Object.getOwnPropertyDescriptor(o, 'x'));
```

a) What will the second `getOwnPropertyDescriptor` call output for the `writable` attribute? ________

b) According to the slides, `defineProperty()` and `defineProperties()` are both methods used to edit the attributes of either ________ or ________.

c) According to the slides, when don't you want others to be able to override your implementations, you can define these properties by using ________ or ________.

---

### Question 17 -- Select all that apply (Slide 361, 345)

According to the slides, there are three ways to create objects. Which are they?

- [ ] A) Object literals
- [ ] B) The `new` keyword
- [ ] C) Object.create()
- [ ] D) Object.assign()
- [ ] E) Object.build()

Also, according to the slides, every object has three associated **object attributes**. Which are they?

- [ ] F) prototype
- [ ] G) class
- [ ] H) extensible
- [ ] I) type
- [ ] J) scope

---

## Section E: Prototypes & Constructors

### Question 18 -- Code analysis (Slide 364-365)

Given this constructor function from the slides:

```javascript
function Cat() {
    this.name = 'Fluffy';
    this.age = 2;
};

var fluffy = new Cat();
```

a) According to the slides, functions which are used with the `new` keyword are called ________ functions.

b) When using `new`, the `this` keyword is bound to ________.

c) In the example above, `this` is referring to the ________ object.

---

### Question 19 -- Code analysis (Slide 380-381)

Study the following prototype examples from the slides:

```javascript
// A constructor function for Cat
function Cat(name, age) {
    this.name = name;
    this.age = age;
}

var fluffy = new Cat('Fluffy', 2);
var scratchy = new Cat('Scratchy', 10);

// false
console.log('purr' in scratchy);

Cat.prototype.purr = function() {
    console.log('Purr!');
};

scratchy.purr();
fluffy.purr();
```

a) Before `Cat.prototype.purr` is defined, `console.log('purr' in scratchy)` returns ________. Why?

b) After `Cat.prototype.purr` is defined, can both `scratchy` and `fluffy` call `.purr()`? ________

c) According to the slides, you can access every object's instance prototype through the ________ keyword.

d) According to the slides, prototypes are extremely useful to extend prototypes of already defined JS objects such as ________, ________, ________, etc.

---

### Question 20 -- Written explanation (Slide 379, 380)

According to the slides on Prototype:

a) "Every object has a prototype except one the ________ which every object inherits from."

b) When creating an object with object literals, the prototype is automatically set as ________.

c) When creating an object with the `new` keyword, the prototype is automatically set as the value of the ________.

d) When creating an object with `Object.create()`, you can assign various prototypes through ________.

e) The slides state that `Object.create()` provides "the ability to create a new object with an ________ prototype."

---

---

# ANSWER KEY

---

### Question 1
- BEM stands for **Blocks**, **Elements**, and **Modifiers** (Slide 253)
- Blocks: "**standalone** entities that have meaning on their own"
- Elements: "items which are **relevant in the context of a block** and therefore semantically tied to the block"
- Modifiers: "**flags** on a block or element. They are used to change **appearance** or **behaviour**"

### Question 2
**B) Lowercase Latin letters, digits, and dashes** (Slide 257)

Note: Block names do NOT include underscores -- only element and modifier names do.

### Question 3
**A, B, C, D, F, G** are all TRUE. (Slide 257)

- E is FALSE -- the slides explicitly state: "Use class name selector only. No tag name or ids."

### Question 4 (Slide 258)
- a) Block: **form**
- b) Elements: **input** and **submit**
- c) Modifiers: **theme-xmas**, **simple**, and **disabled**
- d) Double underscore: `__`
- e) Double dash: `--`

### Question 5 (Slide 254-255)
- **menu** = Block
- **menu elements** = Elements (of the menu block)
- **button** (Sign in) = Block
- **input** = Block, **size big** = Modifier
- **button** = Block, **theme green** = Modifier

### Question 6 (Slide 243)
- "**entities** defined by CSS authors that represent specific values to be **reused** throughout a document."
- Prefixed by a **--** (dash, dash)

### Question 7 (Slide 243, 245-246, 249-250)
- a) **var()**
- b) `color: var(--main-text-color, white);` -- the second parameter is the fallback
- c) **Yes**, custom property names are case sensitive
- Therefore they are treated as **separate properties**

### Question 8
**B)** Be more expressive with the definition of a custom property with the ability to associate a type, set default values, and control inheritance (Slide 246)

### Question 9 (Slide 248)
- a) With `inherits: false`: `--main-red-color` will be **rgb(255, 0, 0) (initial value), NOT red** -- it does not inherit from the parent (from slides: initial-value uses `rgb` not `rgba`)
- b) With `inherits: true`: `--main-red-color` would be **red** (inherited from parent)
- c) A custom property defined using two dashes always **inherits** the value of its parent

### Question 10 (Slide 251)
```javascript
const jsVar = getComputedStyle(element).getPropertyValue("--my-var");
element.style.setProperty("--my-var", jsVar + 4);
```

### Question 11 (Slide 260)
- "A **utility-first** CSS framework ... directly in your **markup**."
- "scanning all of your **HTML** files ... for **class names**, generating the corresponding styles and then writing them to a **static** CSS file."

### Question 12
**A, C, D** (Slide 261)

- B is not stated in the slides
- E is not stated in the slides

### Question 13
**B)** Using a prefix and a colon (`:`), e.g. `hover:bg-red-500`, `md:flex`, `dark:text-white` (Slide 262)

### Question 14 (Slide 341-343)
- a) **fundamental**
- b) **properties**, **name**, **value**
- c) **prototype**
- d) **dynamic**
- e) **mutable**, **reference**

### Question 15
**B)** writeable (true), enumerable (true), configurable (true) (Slide 344)

### Question 16 (Slide 377-378)
- a) The `writable` attribute will be **false**
- b) A **single property** or **multiple properties**
- c) **defineProperty()** or **defineProperties()**

### Question 17 (Slide 361, 345)
Ways to create objects: **A, B, C** (Slide 361)

Object attributes: **F, G, H** (prototype, class, extensible) (Slide 345/360)

### Question 18 (Slide 364-365)
- a) **constructor** functions
- b) **this object instance**
- c) The **fluffy** object

### Question 19 (Slide 380-381)
- a) Returns **false** -- because `purr` has not yet been defined on Cat's prototype
- b) **Yes** -- prototype methods are shared by all instances
- c) The **\_\_proto\_\_** keyword (Slide 380)
- d) **Array**, **Number**, **Math** (Slide 380)

### Question 20 (Slide 379, 365-366, 380)
- a) "Every object has a prototype except one the **Object** which every object inherits from."
- b) **Object.prototype**
- c) The **constructor function's prototype**
- d) **the method as the first parameter**
- e) "the ability to create a new object with an **arbitrary** prototype."
