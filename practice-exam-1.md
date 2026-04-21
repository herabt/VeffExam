# Practice Exam 1: CSS, JavaScript & Async Patterns

---

## SECTION A: CSS FLEXBOX & GRID

### Question 1 — Fill in the blanks
Complete the following sentences about Flexbox:

The `flex-direction` property defaults to 1. \_\_\_\_\_\_\_\_, which lays items out horizontally. The property `align-items` defaults to 2. \_\_\_\_\_\_\_\_, which is why flex items stretch to fill the container's cross-axis. The shorthand property 3. \_\_\_\_\_\_\_\_ combines both `flex-direction` and `flex-wrap` into one declaration. On a flex item, the 4. \_\_\_\_\_\_\_\_ property overrides the container's `align-items` for that specific item only.

---

### Question 2 — Multiple Choice
What does `justify-content` control in a flex container?

- A) How flex items are aligned along the cross-axis
- B) How flex items are distributed along the main-axis
- C) How flex lines are distributed when there is extra space
- D) The order in which flex items appear

---

### Question 3 — Select All That Apply
Which of the following statements about Flexbox are correct?

- [ ] Flex containers only affect their immediate children, not deeper descendants
- [ ] The `float` property has an effect on flex items
- [ ] `align-content` only has an effect when `flex-wrap` is set to `wrap`
- [ ] By default, flex items will wrap to the next line when they overflow
- [ ] `flex-grow: 0` means the item will not grow to fill available space
- [ ] `vertical-align` affects flex items

---

### Question 4 — Fill in the blanks
Complete the following sentences about CSS Grid:

The property 1. \_\_\_\_\_\_\_\_ is used to define named layout regions in a grid container. To make a grid responsive without media queries, you combine `repeat()` with 2. \_\_\_\_\_\_\_\_ and `minmax()` in `grid-template-columns`. The 3. \_\_\_\_\_\_\_\_ unit represents a fraction of the available space in a grid container. The property 4. \_\_\_\_\_\_\_\_ sets the spacing between grid items.

---

### Question 5 — Multiple Choice
You have a 750px wide flex container with three flex items, each 100px wide. The first two items have `flex-grow: 1` and the third has `flex-grow: 3`. What will be the final width of the third item?

- A) 250px
- B) 370px
- C) 550px
- D) 450px

---

### Question 6 — Written Answer (4 pts)
Explain the difference between `align-items` and `align-content` in Flexbox. When would each be useful? Give a concrete example for each.

---

### Question 7 — Select All That Apply
Which of the following CSS class names correctly follow BEM naming conventions?

- [ ] `.nav__item--active`
- [ ] `.nav-item-active`
- [ ] `.Nav__Item--Active`
- [ ] `.navigation__link--disabled`
- [ ] `.navItemActive`

---

### Question 8 — Written Answer (4 pts)
A colleague says: "CSS Grid and Flexbox do the same thing, just pick one and use it everywhere." Explain why this is incorrect. Describe what each layout system is best suited for and how they complement each other in a real project.

---

## SECTION B: JAVASCRIPT FUNDAMENTALS

### Question 9 — Fill in the blanks
Complete the following sentences about JavaScript:

When a function is called with the `new` keyword, `this` refers to the 1. \_\_\_\_\_\_\_\_. The method `.bind()` returns a 2. \_\_\_\_\_\_\_\_ with `this` permanently set to the provided object. When a function is passed to `setTimeout`, the value of `this` inside that function will be 3. \_\_\_\_\_\_\_\_ (in non-strict mode). To call a parent constructor from within a child constructor function, you use 4. \_\_\_\_\_\_\_\_.call(this, args).

---

### Question 10 — Code Analysis (6 pts)
Study the following code:

```javascript
function Animal(name) {
    this.name = name;
    console.log(this);  // Line A
}

Animal.prototype.speak = function() {
    console.log('Speak!');
    console.log(this);  // Line B
};

function Dog(name, breed) {
    Animal.call(this, name);
    this.breed = breed;
    console.log(this);  // Line C
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

var stray = {};

var a = Animal('Cat');           // 1
var b = new Animal('Parrot');    // 2
var c = new Dog('Rex', 'Lab');   // 3 (two console.logs)
b.speak();                       // 4
b.speak.bind(stray).call();      // 5
setTimeout(b.speak, 1000);       // 6
```

For lines 1-6, state what `this` refers to at each console.log. Possible answers: `window`, object `a`, object `b`, object `c`, `stray`, or describe the object.

---

### Question 11 — Multiple Choice
What is the difference between `.call()` and `.apply()`?

- A) `.call()` is for constructors; `.apply()` is for regular functions
- B) `.call()` takes arguments individually; `.apply()` takes them as an array
- C) `.call()` creates a new function; `.apply()` invokes it immediately
- D) There is no difference; they are aliases

---

## SECTION C: ASYNC JAVASCRIPT & TYPESCRIPT

### Question 12 — Multiple Choice
Which of the following correctly describes the order of execution in the Event Loop?

- A) Macrotasks first, then microtasks, then rendering
- B) Call stack, then macrotasks and microtasks in FIFO order
- C) Call stack empties, then ALL microtasks run, then ONE macrotask runs
- D) Microtasks and macrotasks alternate one-by-one

---

### Question 13 — Select All That Apply
Which of the following statements about Promises are correct?

- [ ] `Promise.all()` rejects immediately if any one promise rejects
- [ ] `Promise.race()` resolves when ALL promises have resolved
- [ ] `Promise.allSettled()` waits for all promises to settle, whether they resolve or reject
- [ ] `Promise.any()` resolves when the first promise resolves
- [ ] Microtask queue (Promises) is processed before the macrotask queue (setTimeout)
- [ ] `await` can be used at the top level of any JavaScript file without issues

---

### Question 14 — Code Analysis (4 pts)
Study the following TypeScript code:

```typescript
async function fetchProducts(category: string) {
    const response = await fetch(`/api/products/${category}`);
    const data = response.json();
    return data.filter(p => p.price > 0);
}
```

a) Identify **two bugs** in this code and explain why each is a problem. (2 pts)

b) Rewrite the function correctly with a proper **interface** for the product data shape and appropriate **error handling**. (2 pts)

---

### Question 15 — Fill in the blanks
Complete the following sentences about TypeScript:

The keyword 1. \_\_\_\_\_\_\_\_ defines a contract that a class or object must follow. The utility type 2. \_\_\_\_\_\_\_\_ makes all properties of a type optional. When you want to tell TypeScript that a value is definitely a certain type, you use a type 3. \_\_\_\_\_\_\_\_. When a type can be `string` or `null`, this is called a 4. \_\_\_\_\_\_\_\_ type.

---

### Question 16 — Written Answer (4 pts)
Explain what the Event Loop is and how it processes asynchronous operations. In your answer, describe the roles of:
- The Call Stack
- Web APIs
- The Microtask Queue
- The Macrotask (Callback) Queue

Give an example showing the order in which `console.log`, a resolved Promise `.then()`, and a `setTimeout(..., 0)` would execute.

---

### Question 17 — Code Output (4 pts)
What will be the output of the following code, and in what order? Explain why.

```javascript
console.log('1');

setTimeout(() => {
    console.log('2');
}, 0);

Promise.resolve().then(() => {
    console.log('3');
});

console.log('4');
```

---

### Question 18 — Select All That Apply
Which of the following are correct about the `fetch()` API?

- [ ] `fetch()` returns a Promise
- [ ] `response.json()` returns the parsed data directly (not a Promise)
- [ ] A 404 response will cause `fetch()` to reject the Promise
- [ ] You should check `response.ok` to verify the request succeeded
- [ ] The browser handles `fetch()` via Web APIs, not the main thread

---

---

# ANSWER KEY

## Section A

**Q1:** 1. `row` 2. `stretch` 3. `flex-flow` 4. `align-self`

**Q2:** B — justify-content distributes items along the main-axis

**Q3:** Correct answers:
- [x] Flex containers only affect their immediate children, not deeper descendants
- [ ] The `float` property has an effect on flex items — **FALSE** (float has no effect on flex items)
- [x] `align-content` only has an effect when `flex-wrap` is set to `wrap`
- [ ] By default, flex items will wrap — **FALSE** (default is `nowrap`)
- [x] `flex-grow: 0` means the item will not grow to fill available space
- [ ] `vertical-align` affects flex items — **FALSE** (no effect on flex items)

**Q4:** 1. `grid-template-areas` 2. `repeat` (from slides: "When you want to repeat a pattern... you can use repeat()". Note: auto-fit/auto-fill are NOT in these slides) 3. `fr` 4. `grid-gap` (slides use prefixed version)

**Q5:** B — 370px
- Remaining space: 750 - (3 × 100) = 450px
- Total grow factors: 1 + 1 + 3 = 5
- Per unit: 450 / 5 = 90px
- Third item: 100 + (90 × 3) = 370px

**Q6:** Model answer:
- **align-items** aligns individual flex **items** along the cross-axis within their flex line. Use it when you want to vertically center items in a row, for example a nav bar where the logo and links should be vertically centered: `align-items: center`.
- **align-content** aligns the **flex lines themselves** (not individual items) when there is extra space in the cross-axis direction. It only works when `flex-wrap: wrap` is set and there are multiple lines. Use it when you have a wrapping grid of cards and want to control the spacing between rows: `align-content: space-between`.
- Key difference: align-items = items within a line. align-content = the lines themselves.

**Q7:** Correct: `.nav__item--active` and `.navigation__link--disabled`

**Q8:** Model answer:
- **CSS Grid** is a two-dimensional layout system — it handles both rows AND columns simultaneously. Best for page-level layouts like defining header, sidebar, main content, and footer regions using `grid-template-areas`.
- **Flexbox** is a one-dimensional layout system — it works along a single axis (row OR column). Best for component-level layouts like arranging cards in a row, centering content, or building navigation bars.
- They complement each other: use Grid for the overall page structure, then Flexbox inside individual components. For example, Grid defines the page areas, while Flexbox arranges product cards within the main content area.

## Section B

**Q9:** 1. newly created object (instance) 2. new function 3. `window` (global object) 4. Parent (e.g., `Animal`)

**Q10:**
1. `window` — `Animal('Cat')` called without `new`, so `this` = window
2. `Animal { name: 'Parrot' }` — called with `new`, `this` = new instance (object `b`)
3. First log (from Animal.call): `Dog { name: 'Rex' }` — `this` is the Dog instance being created. Second log: `Dog { name: 'Rex', breed: 'Lab' }` — same instance, now with breed added (object `c`)
4. `Animal { name: 'Parrot' }` — method called on `b`, so `this` = `b` (object `b`)
5. `{}` (the `stray` object) — `.bind(stray)` permanently sets `this` to `stray`. Even `.call()` after it can't override `bind`
6. `window` — setTimeout loses the `this` context, so it defaults to `window`

**Q11:** B — `.call()` takes arguments individually, `.apply()` takes them as an array

## Section C

**Q12:** C — Call stack empties, then ALL microtasks, then ONE macrotask

**Q13:** Correct:
- [x] `Promise.all()` rejects immediately if any one promise rejects
- [ ] `Promise.race()` resolves when ALL promises have resolved — **FALSE** (first to settle)
- [x] `Promise.allSettled()` waits for all promises to settle
- [x] `Promise.any()` resolves when the first promise resolves
- [x] Microtask queue is processed before macrotask queue
- [ ] `await` can be used at top level without issues — **FALSE** (needs async context, or top-level await with ES modules)

**Q14:**
a) Two bugs:
1. Missing `await` before `response.json()` — `.json()` returns a Promise, not the data directly. Without `await`, `data` is a Promise object, and `.filter()` will fail.
2. No error handling — if the fetch fails (network error) or returns a non-OK response (404, 500), the function will crash. Should check `response.ok` and use try/catch.

b) Corrected code:
```typescript
interface Product {
    name: string;
    price: number;
    category: string;
}

async function fetchProducts(category: string): Promise<Product[]> {
    try {
        const response = await fetch(`/api/products/${category}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        return data.filter(p => p.price > 0);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}
```

**Q15:** 1. `interface` 2. `Partial` 3. `assertion` (as in `value as Type`) 4. `nullable` (or `union`)

**Q16:** Model answer:
The Event Loop is the mechanism that allows JavaScript (single-threaded) to handle async operations:
- **Call Stack**: Where synchronous code executes. Functions are pushed on and popped off (LIFO).
- **Web APIs**: Browser-provided services (setTimeout, fetch, DOM events). When an async operation is called, the browser handles it outside the main thread.
- **Microtask Queue**: Holds resolved Promise callbacks (.then/.catch). Processed COMPLETELY before any macrotask.
- **Macrotask Queue**: Holds setTimeout/setInterval callbacks. ONE macrotask is processed per cycle.

Example order:
```
console.log('sync');          // 1st — synchronous, runs immediately
Promise.resolve().then(...)   // 3rd — microtask, runs after sync code
setTimeout(..., 0)            // 4th — macrotask, runs after microtasks
console.log('sync2');         // 2nd — synchronous, runs immediately
```

**Q17:** Output order: `1`, `4`, `3`, `2`
- `1` — synchronous, runs first
- `4` — synchronous, runs next
- `3` — Promise.then is a microtask, runs before setTimeout
- `2` — setTimeout is a macrotask, runs last (even with 0ms delay)

**Q18:** Correct:
- [x] `fetch()` returns a Promise
- [ ] `response.json()` returns parsed data directly — **FALSE** (returns a Promise)
- [ ] A 404 response will cause fetch to reject — **FALSE** (fetch only rejects on network errors, not HTTP errors)
- [x] You should check `response.ok` to verify success
- [x] The browser handles fetch via Web APIs
