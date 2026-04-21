# FOCUSED STUDY: Your Weak Areas

Study these topics first — they are where you lost points.

---

## 1. `this` BINDING (you got this fundamentally wrong)

### The ONE rule: "How was the function CALLED?"

| How it's called | `this` = | Example |
|----------------|----------|---------|
| Regular call (no new, no dot) | `window` | `Animal('Cat')` → this = window |
| With `new` | The new object being created | `new Animal('Cat')` → this = Animal { name: 'Cat' } |
| Method call (dot) | Object before the dot | `b.speak()` → this = b |
| `.call(x)` / `.apply(x)` | x | `b.speak.call(stray)` → this = stray |
| `.bind(x)` | x (PERMANENT, can't override) | `b.speak.bind(stray).call()` → this = stray (bind wins!) |
| `setTimeout(fn)` | `window` (context LOST) | `setTimeout(b.speak, 1000)` → this = window |
| Arrow function | Inherits from enclosing scope | No own `this` |

### Common trap: Without `new`
```javascript
var a = Animal('Cat');    // NO new! this = window. Cat gets set on window.name
var b = new Animal('Cat'); // YES new! this = new Animal object
```

### Common trap: `.bind()` is permanent
```javascript
b.speak.bind(stray).call()  // stray wins! bind cannot be overridden by call
```

### Common trap: setTimeout loses context
```javascript
setTimeout(b.speak, 1000)  // this = window (not b!)
// Fix: setTimeout(() => b.speak(), 1000)  // arrow preserves this
// Fix: setTimeout(b.speak.bind(b), 1000)  // bind locks this to b
```

---

## 2. EVENT LOOP (you got the order backwards)

### The correct order:
```
1. CALL STACK    — All synchronous code runs first
2. MICROTASKS    — ALL Promise .then/.catch/.finally + queueMicrotask
3. ONE MACROTASK — ONE setTimeout/setInterval callback
4. Back to step 2 (check for more microtasks)
```

### KEY RULE: Microtasks (Promises) ALWAYS before Macrotasks (setTimeout)

### Example you got wrong:
```javascript
console.log('1');           // 1st — synchronous
setTimeout(() => {
    console.log('2');       // 4th — MACROTASK (runs LAST)
}, 0);
Promise.resolve().then(() => {
    console.log('3');       // 3rd — MICROTASK (before setTimeout!)
});
console.log('4');           // 2nd — synchronous
```
Output: **1, 4, 3, 2** (NOT 1, 4, 2, 3!)

---

## 3. PROMISES (you checked none — all should have been checked except b and f)

| Method | What it does | Key word |
|--------|-------------|----------|
| `Promise.all()` | Resolves when ALL resolve. **Rejects if ANY one rejects** | ALL or nothing |
| `Promise.race()` | First to SETTLE (resolve OR reject) wins | First to finish |
| `Promise.any()` | First to RESOLVE wins. Only rejects if ALL reject | First success |
| `Promise.allSettled()` | Waits for ALL to settle. Never short-circuits | Wait for everyone |

### Memorization trick:
- **all** = strict teacher: one failure = everyone fails
- **race** = sprint: first across the line wins (even if they trip)
- **any** = optimist: first success is enough
- **allSettled** = patient: waits for every single one

---

## 4. FLEX-GROW / FLEX-SHRINK CALCULATION (you got 550px, correct is 370px)

### Growth formula:
```
1. remaining space = container - (sum of all item widths)
2. total grow factors = sum of all flex-grow values
3. 1 unit = remaining space / total grow factors
4. final width = original width + (unit × item's grow value)
```

### The exact example from the slides:
```
Container: 750px. Three items: 100px each.
flex-grow values: 1, 1, 3

Remaining: 750 - 300 = 450px
Total factors: 1 + 1 + 3 = 5
1 unit: 450 / 5 = 90px

Item 1: 100 + 90×1 = 190px
Item 2: 100 + 90×1 = 190px
Item 3: 100 + 90×3 = 370px  ← NOT 550!
```

### Shrink formula (same idea, but subtract):
```
Container: 750px. Three items: 300px each. Overflow: 150px.
flex-shrink: 1, 1, 3. Total: 5.
1 unit: 150 / 5 = 30px

Item 1: 300 - 30×1 = 270px
Item 2: 300 - 30×1 = 270px
Item 3: 300 - 30×3 = 210px
```

---

## 5. .call() vs .apply() (you said "no difference" — WRONG)

| Method | How args are passed | Memory trick |
|--------|-------------------|-------------|
| `.call(obj, a, b, c)` | Arguments listed individually | **C**all = **C**ommas |
| `.apply(obj, [a, b, c])` | Arguments as an **array** | **A**pply = **A**rray |

Both invoke the function immediately with `this` set to `obj`.
`.bind(obj)` is different — it returns a NEW function (doesn't call it).

---

## 6. CSS GRID KEYWORDS (you left most blank)

| Keyword | What it does (from slides) |
|---------|--------------------------|
| `grid-template-areas` | Defines named layout regions: `"header header" "sidebar main"` |
| `auto-fit` | Used with `repeat()` — fits as many columns as possible, expanding to fill space |
| `auto-fill` | Same but keeps empty tracks |
| `fr` | Fraction unit — all fr added up and divided by total |
| `gap` | Spacing between grid items |
| `minmax()` | Sets min and max size: `minmax(250px, 1fr)` |
| `grid-template-columns` | Arrange grid items along horizontal track |
| `grid-template-rows` | Same but vertical |
| `min-content` | Takes up minimum space needed for content |
| `max-content` | Takes up maximum space needed for content |

---

## 7. PROPERTY NAMES YOU GOT WRONG

| You wrote | Correct | Remember |
|-----------|---------|----------|
| `flex` | `flex-flow` | flex-FLOW = flex-direction + flex-wrap flowing together |
| `align-item-self` | `align-self` | Just "self" — it's the item speaking for itself |
| `optional` | `nullable` | `string | null` = nullable. `Partial<T>` = optional |
