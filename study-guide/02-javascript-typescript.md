# Web Programming II — JavaScript & TypeScript Study Guide
### Target: 100% on the final exam

---

## TABLE OF CONTENTS

1. [The `this` Keyword — All 4 Binding Rules](#1-the-this-keyword)
2. [Arrow Functions & `this`](#2-arrow-functions--this)
3. [Prototypes & Inheritance](#3-prototypes--inheritance)
4. [Promises — All States, Methods, Combinators](#4-promises)
5. [async/await](#5-asyncawait)
6. [Event Loop — Execution Order, Queues, Tricky Examples](#6-event-loop)
7. [fetch API — Syntax, Response Handling, Error Handling](#7-fetch-api)
8. [TypeScript — Complete Coverage](#8-typescript)
9. [Tricky "What Does This Print?" Examples](#9-tricky-code-output-examples)
10. [Quick-Reference Cheat Sheet](#10-quick-reference-cheat-sheet)
11. [Likely Exam Questions & Model Answers](#11-likely-exam-questions--model-answers)

---

## 1. The `this` Keyword

### The One Rule That Rules Them All

> **`this` is determined by HOW a function is CALLED, not where it is defined.**

### The 4 Binding Rules (+ 2 special cases)

| Rule | How it's called | `this` equals | Example |
|------|----------------|---------------|---------|
| **Global / Default** | Regular call, no object | `window` (non-strict) / `undefined` (strict) | `foo()` |
| **Implicit** | Method call via dot notation | The object before the dot | `obj.foo()` → `this = obj` |
| **Explicit** | `.call()` / `.apply()` / `.bind()` | The first argument | `foo.call(obj)` → `this = obj` |
| **`new`** | Constructor call | The newly created object | `new Foo()` → `this = new Foo instance` |
| **Arrow** | Arrow function | Inherited from enclosing scope | No own `this` |
| **setTimeout** | Callback passed to setTimeout | `window` (context LOST) | `setTimeout(obj.fn, 0)` → `this = window` |

---

### Rule 1: Global Binding (Default)

```javascript
function greet() {
    console.log(this); // window (in non-strict mode)
}
greet(); // regular call — no object, no new

// Strict mode:
"use strict";
function strictGreet() {
    console.log(this); // undefined
}
strictGreet();
```

**Gotcha:** Calling a function without an object = `this` defaults to global.

---

### Rule 2: Implicit Binding (Method Call)

```javascript
const person = {
    name: 'Arnar',
    greet() {
        return 'Hello, I am ' + this.name;
    }
};

person.greet();       // this = person → "Hello, I am Arnar"

// Context is LOST when you extract the function:
const greetFn = person.greet;
greetFn();            // this = window → "Hello, I am undefined"
```

**Gotcha:** Only the object immediately to the left of the dot matters.

```javascript
const a = {
    name: 'A',
    b: {
        name: 'B',
        greet() { return this.name; }
    }
};
a.b.greet(); // this = a.b (the object immediately left of the dot) → "B"
```

---

### Rule 3: Explicit Binding — call, apply, bind

#### .call() — args individually

```javascript
function introduce(greeting, punctuation) {
    return greeting + ', I am ' + this.name + punctuation;
}
const person = { name: 'Arnar' };

introduce.call(person, 'Hello', '!');  // "Hello, I am Arnar!"
// .call(thisArg, arg1, arg2, ...)
```

#### .apply() — args as array

```javascript
introduce.apply(person, ['Hello', '!']); // "Hello, I am Arnar!"
// .apply(thisArg, [arg1, arg2, ...])
```

**Memory trick:** **C**all = **C**ommas | **A**pply = **A**rray

#### .bind() — returns NEW function, permanently bound

```javascript
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name; };

const cat = new Animal('Cat');
const dog = { name: 'Dog' };

const catSpeak = cat.speak.bind(dog);  // new function, this = dog PERMANENTLY
catSpeak();                             // "Dog"

// bind CANNOT be overridden by call or apply:
cat.speak.bind(dog).call(cat);         // "Dog" — bind WINS!
cat.speak.bind(dog).apply(cat);        // "Dog" — bind WINS!
```

**Critical:** `.bind()` is **permanent**. Not even `.call()` or `.apply()` can override it.

---

### Rule 4: `new` Binding (Constructor)

When `new` is used, JavaScript:
1. Creates a new empty object `{}`
2. Sets `this` to that new object
3. Sets the object's `__proto__` to the constructor's `.prototype`
4. Runs the constructor body
5. Returns the new object (implicitly)

```javascript
function Car(model) {
    this.model = model;   // this = the new Car object
}

const tesla = new Car('Tesla');
console.log(tesla.model); // "Tesla"

// WITHOUT new — disaster!
const mistake = Car('Oops');  // this = window! Sets window.model = 'Oops'
console.log(mistake);          // undefined (no return)
console.log(window.model);     // "Oops" — polluted global!
```

---

### setTimeout Loses Context

```javascript
const cat = new Animal('Cat');

setTimeout(cat.speak, 1000);         // this = window — context LOST!
// Fix 1: Arrow function wrapper
setTimeout(() => cat.speak(), 1000); // this = cat — arrow preserves
// Fix 2: .bind()
setTimeout(cat.speak.bind(cat), 1000); // this = cat — bound
```

---

### Tricky `this` Code: Practice Exam Classic (MEMORIZE THIS)

```javascript
function Animal(name) {
    this.name = name;
    console.log(this); // Line A
}
Animal.prototype.speak = function() {
    console.log(this); // Line B
};

function Dog(name, breed) {
    Animal.call(this, name); // Line C: calls Animal with Dog's this
    this.breed = breed;
    console.log(this); // Line D
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

var stray = {};

var a = Animal('Cat');            // 1. No new! this = window
var b = new Animal('Parrot');     // 2. new! this = Animal{name:'Parrot'}
var c = new Dog('Rex', 'Lab');    // 3. Two logs: Dog{name:'Rex'}, Dog{name:'Rex',breed:'Lab'}
b.speak();                        // 4. this = b = Animal{name:'Parrot'}
b.speak.bind(stray).call();       // 5. this = stray (bind wins!)
setTimeout(b.speak, 1000);        // 6. this = window (context lost)
```

**Answers:**
1. `window` — no `new`, regular function call
2. `Animal { name: 'Parrot' }` — `new` creates new object
3. First log (from Animal.call): `Dog { name: 'Rex' }`, Second log: `Dog { name: 'Rex', breed: 'Lab' }`
4. `Animal { name: 'Parrot' }` — method on `b`, this = `b`
5. `{}` (stray) — `.bind(stray)` permanently wins over `.call()`
6. `window` — setTimeout loses context

---

## 2. Arrow Functions & `this`

Arrow functions **do not have their own `this`**. They inherit `this` from the enclosing **lexical scope** — the scope where the arrow function is defined, not where it is called.

```javascript
const obj = {
    name: 'Arnar',
    // Regular method — has own this
    regularGreet: function() {
        return 'Hello, ' + this.name; // this = obj
    },
    // Arrow method — inherits this from surrounding scope (module/window)
    arrowGreet: () => {
        return 'Hello, ' + this.name; // this = window/undefined
    },
    // Arrow inside a regular method — inherits this from the regular method
    delayedGreet: function() {
        setTimeout(() => {
            console.log(this.name); // this = obj (captured from delayedGreet)
        }, 1000);
    }
};

obj.regularGreet(); // "Hello, Arnar"
obj.arrowGreet();   // "Hello, undefined" — gotcha!
obj.delayedGreet(); // "Arnar" — arrow saves the day!
```

### When Arrow Functions Help vs Hurt

| Situation | Use | Reason |
|-----------|-----|--------|
| Callback inside a method (setTimeout, etc.) | Arrow function | Inherits `this` from the method |
| Object method that needs `this` | Regular function | Arrow would use wrong `this` |
| Class methods | Regular function | Needs `this` = instance |
| Array callbacks (.map, .filter) | Arrow or regular | Rarely matters for `this` |

### Arrow Function `this` Gotcha

```javascript
const counter = {
    count: 0,
    // BAD: Arrow function as method — this = window, not counter
    increment: () => {
        this.count++; // window.count, not counter.count!
    },
    // GOOD: Regular function as method
    decrement: function() {
        this.count--; // counter.count
    }
};
```

### .bind() / .call() / .apply() on Arrow Functions — They Don't Work

```javascript
const arrowFn = () => console.log(this); // this always = enclosing scope
arrowFn.call({ x: 1 }); // Still logs enclosing scope's this, not { x: 1 }
```

---

## 3. Prototypes & Inheritance

### Every Object Has a Prototype

```
cat instance → Cat.prototype → Object.prototype → null
```

When you access `cat.speak()`:
1. Look on `cat` itself — not found
2. Look on `cat.__proto__` (= `Cat.prototype`) — found! Call it.
3. If not found, look on `Cat.prototype.__proto__` (= `Object.prototype`)
4. If not found, return `undefined`

### Basic Constructor (Problem: Every instance gets its own copy of methods)

```javascript
function Car(model, year) {
    this.model = model;
    this.year = year;
    // BAD: this function is copied to EVERY Car instance
    this.toString = function() {
        return this.model + ' (' + this.year + ')';
    };
}

var tesla = new Car('Tesla', 2024);
var ford = new Car('Ford', 2020);
// tesla.toString !== ford.toString — DIFFERENT function objects!
```

### Constructors With Prototypes (Best Practice: Shared methods)

```javascript
function Car(model, year) {
    this.model = model;
    this.year = year;
}

// Method on prototype — SHARED by all instances (memory efficient)
Car.prototype.toString = function() {
    return this.model + ' (' + this.year + ')';
};

var tesla = new Car('Tesla', 2024);
var ford = new Car('Ford', 2020);
// tesla.toString === ford.toString — SAME function object!

console.log(tesla.toString()); // "Tesla (2024)"
console.log(ford.toString());  // "Ford (2020)"
```

### Prototype Inheritance (Classical Pattern)

```javascript
function Animal(name) {
    this.name = name;
}
Animal.prototype.speak = function() {
    return this.name + ' makes a sound';
};

function Dog(name, breed) {
    Animal.call(this, name);  // Call parent constructor with THIS Dog's context
    this.breed = breed;
}

// Set up prototype chain: Dog → Animal → Object
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // Fix constructor reference

// Dog-specific method
Dog.prototype.bark = function() {
    return this.name + ' barks!';
};

var rex = new Dog('Rex', 'Lab');
console.log(rex.speak());  // "Rex makes a sound" (inherited from Animal.prototype)
console.log(rex.bark());   // "Rex barks!" (own to Dog.prototype)
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true
```

### Why `Object.create(Animal.prototype)` Not `new Animal()`

```javascript
// WRONG — calls Animal constructor, runs Animal's logic, sets name = undefined
Dog.prototype = new Animal();

// CORRECT — creates an object whose __proto__ = Animal.prototype without calling constructor
Dog.prototype = Object.create(Animal.prototype);
```

### The Prototype Chain (Visual)

```
rex (instance)
  .__proto__ = Dog.prototype
    .bark = function() { ... }
    .__proto__ = Animal.prototype
      .speak = function() { ... }
      .__proto__ = Object.prototype
        .toString = function() { ... }
        .__proto__ = null
```

### Key Terms

| Term | What it is |
|------|-----------|
| `obj.__proto__` | The actual prototype link on an instance — points to the constructor's `.prototype` |
| `Constructor.prototype` | The object shared by all instances created with `new Constructor()` |
| `Object.create(proto)` | Creates a new object with `proto` as its prototype |
| `new` keyword | Creates object, sets `this`, links `__proto__` to constructor's `.prototype`, runs constructor |
| Prototype chain | Linked list of prototypes JavaScript walks to find a property |

---

## 4. Promises

### Promise States

A Promise is always in exactly ONE of these states:

| State | Description | Can transition? |
|-------|-------------|----------------|
| **pending** | Initial state, not yet settled | → fulfilled or → rejected |
| **fulfilled** | Completed successfully | No — state is locked permanently |
| **rejected** | Failed | No — state is locked permanently |

A Promise that has left `pending` is called **settled**. A settled Promise's value/reason is **immutable**.

### Creating a Promise

```javascript
const myPromise = new Promise((resolve, reject) => {
    // This executor function runs SYNCHRONOUSLY and IMMEDIATELY
    console.log('X'); // This runs right now!
    
    if (/* success */) {
        resolve('success value');  // fulfills the promise
    } else {
        reject('error reason');    // rejects the promise
    }
    
    console.log('Z'); // This ALSO runs — resolve/reject do NOT stop execution
});
```

**Gotcha:** The executor runs synchronously. `resolve()` does NOT pause execution.

```javascript
const p = new Promise((resolve, reject) => {
    console.log('X');  // 1st
    resolve('Y');
    console.log('Z');  // 2nd — still runs after resolve!
});
p.then(val => console.log(val)); // 4th (microtask)
console.log('W');                // 3rd (sync)
// Output: X, Z, W, Y
```

### .then() / .catch() / .finally()

```javascript
fetchUser()
    .then(user => {
        console.log(user.name);  // runs if resolved
        return user.age;          // return value passed to next .then
    })
    .then(age => {
        console.log(age * 2);    // receives value returned by previous .then
    })
    .catch(err => {
        console.log('Error:', err); // catches ANY rejection in the chain
        return 'recovered';          // return resets chain to fulfilled!
    })
    .then(val => {
        console.log(val); // "recovered" — catch returned a value, chain continues
    })
    .finally(() => {
        console.log('Done'); // always runs, receives NO arguments
    });
```

**Critical facts:**
- `.finally()` receives **no arguments** (no value, no reason)
- A `.catch()` that **returns a value** resets the chain to fulfilled
- A `.then()` that **throws** puts the chain in rejected state — skips to next `.catch()`
- Each `.then()/.catch()` returns a **new Promise**

### Error Propagation in Chains

```javascript
Promise.resolve('start')
    .then(val => {
        console.log(val);       // "start"
        throw new Error('oops');
    })
    .then(val => {
        console.log('skipped'); // SKIPPED — chain is rejected
    })
    .catch(err => {
        console.log('Caught:', err.message); // "Caught: oops"
        return 'recovered';
    })
    .then(val => {
        console.log(val); // "recovered" — catch returned a value
    });
// Output: "start", "Caught: oops", "recovered"
```

### Promise Combinators — The Big 4

| Method | Resolves when | Rejects when | Use case |
|--------|--------------|--------------|----------|
| `Promise.all(arr)` | ALL promises fulfill | ANY one rejects (immediately) | Need all results |
| `Promise.race(arr)` | First to SETTLE (fulfill or reject) | First to SETTLE (fulfill or reject) | Race/timeout |
| `Promise.any(arr)` | First to FULFILL | ALL reject (AggregateError) | First success |
| `Promise.allSettled(arr)` | ALL settle (never rejects) | Never | Need all outcomes |

**Memory tricks:**
- `all` = strict teacher — one fail = everyone fails
- `race` = sprint — first across the line wins, even if they trip
- `any` = optimist — first success is good enough
- `allSettled` = patient waiter — collects every result, no matter what

### Promise.all — Code Example

```javascript
const p1 = new Promise(resolve => setTimeout(resolve, 1000, '1 second'));
const p2 = new Promise(resolve => setTimeout(resolve, 2000, '2 seconds'));
const p3 = new Promise((_, reject) => setTimeout(reject, 5000, '5 seconds'));
const p4 = new Promise(resolve => setTimeout(resolve, 10000, '10 seconds'));

// Rejects after 5 seconds with reason "5 seconds"
Promise.all([p1, p2, p3, p4])
    .then(values => console.log(values))      // skipped
    .catch(reason => console.log(reason));    // "5 seconds" (at 5s)

// If all resolved: ["1 second", "2 seconds", "5 seconds", "10 seconds"] after 10s
```

### Promise.allSettled — Code Example

```javascript
Promise.allSettled([p1, p2, p3, p4])
    .then(results => {
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                console.log('Value:', result.value);
            }
            if (result.status === 'rejected') {
                console.log('Reason:', result.reason);
            }
        });
    });
// Each result: { status: "fulfilled", value: "..." }
//           or { status: "rejected", reason: "..." }
// Runs after 10 seconds (waits for ALL)
```

### Promise.race vs Promise.any

```javascript
// race: first to SETTLE wins (even if rejected)
Promise.race([p1, p2, p3, p4])
    .then(val => console.log('race resolved:', val))    // "1 second" at 1s
    .catch(err => console.log('race rejected:', err));

// any: first to FULFILL wins
Promise.any([p1, p2, p3, p4])
    .then(val => console.log('any resolved:', val))     // "1 second" at 1s
    .catch(err => console.log('all failed:', err));     // AggregateError if ALL reject

// If the FASTEST promise REJECTED (e.g., p1 rejects at 1s):
// race → rejects with p1's reason after 1s
// any → continues waiting for p2, p3, p4 — picks first fulfillment
```

---

## 5. async/await

`async/await` is syntactic sugar over Promises. Every `async` function returns a Promise.

### Basic Syntax

```javascript
async function fetchUser(id) {
    try {
        const response = await fetch(`/api/users/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const user = await response.json(); // Must await! Returns a Promise.
        return user;                         // Implicitly wrapped in Promise.resolve()
    } catch (error) {
        console.error('Failed:', error);
        return null;
    }
}

// Calling an async function:
fetchUser(1).then(user => console.log(user));
// Or with await:
const user = await fetchUser(1); // Only inside another async function
```

### Execution Order — The Key Insight

```javascript
async function foo() {
    console.log('A');                       // 1. Sync — runs immediately
    const result = await Promise.resolve('B');
    // await PAUSES foo and yields control back to caller
    // Everything after await is a microtask (continuation)
    console.log(result);                    // 4. Microtask — after sync code
    console.log('C');                       // 5. Continues in microtask
}

console.log('D');  // 2. Sync — before foo is called
foo();             // starts execution...
console.log('E'); // 3. Sync — control returned from foo when it hit await
// Output: D, A, E, B, C
```

### async/await vs .then() — Same Thing Different Syntax

```javascript
// With .then():
function fetchData() {
    return fetch('/api/data')
        .then(response => {
            if (!response.ok) throw new Error('Failed');
            return response.json();
        })
        .then(data => data.filter(item => item.active))
        .catch(err => { console.error(err); return []; });
}

// With async/await (cleaner, same behavior):
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        return data.filter(item => item.active);
    } catch (err) {
        console.error(err);
        return [];
    }
}
```

### Common Bug: Missing await on .json()

```javascript
// BUG — returns a Promise object, not the data!
async function bad() {
    const response = await fetch('/api/data');
    const data = response.json();           // MISSING AWAIT!
    return data.filter(p => p.price > 0);   // ERROR: data is a Promise, not an array
}

// FIXED:
async function good() {
    const response = await fetch('/api/data');
    const data = await response.json();     // Correct!
    return data.filter(p => p.price > 0);
}
```

---

## 6. Event Loop

### The Architecture

```
┌─────────────────────────────────────────────┐
│         CALL STACK (LIFO)                   │
│  [currently executing synchronous code]      │
└─────────────────────────────────────────────┘
          ↕ (JS engine)
┌─────────────────────────────────────────────┐
│         WEB APIs (Browser)                  │
│  setTimeout, fetch, DOM events, setInterval │
│  [async operations run here, off main thread]│
└─────────────────────────────────────────────┘
          ↓ (when done)
┌─────────────────┐   ┌──────────────────────┐
│ MICROTASK QUEUE │   │  MACROTASK QUEUE      │
│ (HIGH PRIORITY) │   │  (LOWER PRIORITY)     │
│                 │   │                       │
│ Promise .then   │   │ setTimeout callbacks  │
│ Promise .catch  │   │ setInterval callbacks │
│ Promise .finally│   │ DOM event handlers    │
│ queueMicrotask()│   │ I/O callbacks         │
└─────────────────┘   └──────────────────────┘
```

### The Event Loop Algorithm (Exact Execution Order)

```
1. Run all synchronous code (Call Stack empties)
2. Run ALL microtasks (drain entire Microtask Queue)
3. Run ONE macrotask
4. Run ALL microtasks again (drain entire queue)
5. Run ONE macrotask
6. Repeat...
```

**The golden rule:** **Microtasks (Promises) ALWAYS run before macrotasks (setTimeout)**

### Basic Example — The Classic

```javascript
console.log('1');           // Sync — runs 1st

setTimeout(() => {
    console.log('2');       // Macrotask — runs 4th (LAST)
}, 0);

Promise.resolve().then(() => {
    console.log('3');       // Microtask — runs 3rd (before macrotask!)
});

console.log('4');           // Sync — runs 2nd

// Output: 1, 4, 3, 2
```

### Advanced Example — Microtask Spawning Macrotask

```javascript
console.log('A');           // 1. Sync

setTimeout(() => {
    console.log('B');       // 5. Macrotask (in queue first)
    Promise.resolve().then(() => console.log('C')); // 6. Microtask (after B's macrotask)
}, 0);

Promise.resolve().then(() => {
    console.log('D');       // 3. Microtask (first to run after sync)
    setTimeout(() => console.log('E'), 0); // 7. Macrotask (added to queue)
});

console.log('F');           // 2. Sync

// Output: A, F, D, B, C, E
```

Explanation:
1. `A` — sync
2. `F` — sync
3. `D` — microtask runs (queue was: [D])
4. `D` runs, queues setTimeout E
5. `B` — macrotask (first in macrotask queue was B's timer)
6. After B runs, check microtasks: `C` runs
7. `E` — last macrotask

### Microtask Spawning More Microtasks

```javascript
Promise.resolve()
    .then(() => {
        console.log('A');
        return Promise.resolve('B'); // new microtask for .then
    })
    .then(val => console.log(val));

Promise.resolve().then(() => console.log('C'));

// Microtask queue after sync:
// [then-A, then-C]
// A runs → queues then-B
// C runs
// then-B runs
// Output: A, C, B
```

### The Promise Constructor Gotcha

```javascript
const p = new Promise((resolve, reject) => {
    console.log('X');   // 1st — executor is SYNCHRONOUS
    resolve('Y');
    console.log('Z');   // 2nd — still runs! resolve() doesn't stop execution
});
p.then(val => console.log(val)); // 4th — microtask
console.log('W');                // 3rd — sync
// Output: X, Z, W, Y
```

### queueMicrotask() — Explicit Microtask

```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
queueMicrotask(() => console.log('E')); // Also goes to microtask queue!
console.log('F');
// Output: A, F, C, E, B
// C and E are both microtasks — run in FIFO order before B
```

---

## 7. fetch API

### Basic Syntax

```javascript
fetch('/api/data')
    .then(response => {
        // response is a Response object — NOT the data yet
        console.log(response.ok);     // true if status 200-299
        console.log(response.status); // HTTP status code (200, 404, 500...)
        return response.json();       // returns a Promise! Must be chained
    })
    .then(data => {
        console.log(data); // actual parsed data
    })
    .catch(err => {
        // Only runs on NETWORK errors, NOT HTTP errors (404, 500)
        console.error('Network error:', err);
    });
```

### With async/await (Preferred)

```javascript
async function fetchProducts(category) {
    try {
        const response = await fetch(`/api/products/${category}`);
        
        // MUST check response.ok — fetch does NOT reject on 404/500!
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // MUST await response.json() — it returns a Promise!
        const data = await response.json();
        return data;
    } catch (error) {
        // Catches both network errors AND our thrown HTTP errors
        console.error('Failed to fetch:', error);
        return [];
    }
}
```

### The Two Types of Errors — Critical Distinction

| Error Type | What it is | Does fetch reject? | How to detect |
|------------|-----------|-------------------|---------------|
| **Network error** | No internet, DNS failure, CORS block | YES — Promise rejects | `catch` block |
| **HTTP error** | Server responded with 4xx/5xx | NO — Promise resolves | Check `response.ok` |

```javascript
// fetch ONLY rejects on network errors:
fetch('https://nonexistent-domain.xyz/api') // → rejects (no DNS)
fetch('/api/data') // → resolves even if server returns 404!
```

### Response Object Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `response.json()` | `Promise<any>` | Parses body as JSON |
| `response.text()` | `Promise<string>` | Body as plain text |
| `response.blob()` | `Promise<Blob>` | Binary data |
| `response.ok` | `boolean` | `true` if status 200-299 |
| `response.status` | `number` | HTTP status code |

### POST Request with fetch

```javascript
async function createUser(userData) {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
            throw new Error(`Failed: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error; // re-throw if caller needs to handle it
    }
}
```

### Common fetch Bugs (Exam Favorites)

```typescript
// BUG 1: Missing await on response.json()
async function bad1() {
    const response = await fetch('/api/data');
    const data = response.json(); // Promise object, not data!
    data.filter(p => p.active);   // ERROR: filter is not a method on Promise
}

// BUG 2: No error handling for HTTP errors
async function bad2() {
    const response = await fetch('/api/data');
    return await response.json(); // Silently fails on 404/500
}

// BUG 3: Trying to call .filter() on returned data without await
async function bad3() {
    const response = await fetch('/api/data');
    const data = response.json(); // no await
    return data.filter(p => p.price > 0); // ERROR
}
```

---

## 8. TypeScript

### Why TypeScript?

- JavaScript is **dynamic and interpreted** — errors only appear at runtime
- TypeScript adds **static type checking** — errors caught at compile time
- Compiles to plain JavaScript (no new runtime needed)
- **Gradual adoption**: can replace JS files one at a time (`.ts` alongside `.js`)

### The 4 TypeScript Capabilities (from slides)

1. **Types by inference** — TS understands JS and infers types automatically
2. **Type definitions** — Explicit annotations for complex types
3. **Type composition** — Unions, Generics
4. **Structural type system** — Shape-based compatibility ("duck typing")

### Compilation

```bash
tsc hello.ts  # → outputs hello.js
# Two things happen:
# 1. Type annotations are stripped out (not valid JS)
# 2. Downleveling: modern syntax → ES3 (default target)
```

**Key fact:** TypeScript STILL generates `.js` even when there are type errors ("built with migration in mind").

---

### Basic Types

```typescript
let name: string = 'Arnar';
let age: number = 30;
let active: boolean = true;
let nothing: null = null;
let notSet: undefined = undefined;
let anything: any = 'can be anything'; // Avoid! Disables type checking
let safe: unknown = 'safer than any'; // must narrow before use
let impossible: never; // function that never returns, exhaustive checks

// Type inference — no annotation needed:
let inferred = 'hello'; // TypeScript infers: string
inferred = 42;          // Error: Type 'number' is not assignable to 'string'
```

### any vs unknown vs never

| Type | Can assign to it | Can use it without narrowing | Use case |
|------|-----------------|------------------------------|----------|
| `any` | Anything | Yes (disables type checking) | Migration from JS, last resort |
| `unknown` | Anything | No — must narrow first | Safer alternative to `any` |
| `never` | Nothing | N/A | Functions that throw/infinite loop |

```typescript
// unknown requires narrowing before use:
function processInput(input: unknown) {
    // input.toUpperCase(); // ERROR: can't call methods on unknown
    if (typeof input === 'string') {
        input.toUpperCase(); // OK — narrowed to string
    }
}

// never for exhaustive checks:
function assertNever(x: never): never {
    throw new Error('Unexpected value: ' + x);
}
```

### Arrays and Tuples

```typescript
// Two equivalent array syntaxes:
const nums: number[] = [1, 2, 3];
const nums2: Array<number> = [1, 2, 3]; // Generic syntax

// Tuple — fixed-length, fixed-type array:
const point: [number, number] = [10, 20]; // must be exactly [number, number]
const entry: [string, number] = ['age', 30];

// Tuple gotcha:
const bad: [string, number] = [30, 'age']; // ERROR: wrong order
```

### Interfaces

```typescript
interface User {
    id: number;
    name: string;
    email?: string; // Optional — can be string or undefined
    readonly createdAt: Date; // Cannot be reassigned after creation
}

function greet(user: User): string {
    return `Hello, ${user.name}`;
}

// Structural typing — extra properties OK when assigned to variable first:
const extraUser = { id: 1, name: 'Arnar', role: 'admin' };
greet(extraUser); // OK! Has all required properties (id, name)

// Excess property check — direct object literal:
greet({ id: 1, name: 'Arnar', role: 'admin' }); // ERROR! Extra property in literal
```

### Interface Extension

```typescript
interface Animal {
    name: string;
    speak(): string;
}

interface Dog extends Animal {
    breed: string;
    bark(): string;
}

// Declaration merging — interfaces can be declared multiple times:
interface User { id: number; }
interface User { name: string; }
// Result: interface User { id: number; name: string; }
```

### type Alias

```typescript
type ID = string | number;
type Point = { x: number; y: number };
type StringOrNumber = string | number;
type Callback = (err: Error | null, data: string) => void;
```

### interface vs type — Key Differences

| Feature | `interface` | `type` |
|---------|-------------|--------|
| Object shapes | Yes | Yes |
| Union types | No | Yes (`type A = B \| C`) |
| Primitive aliases | No | Yes (`type Name = string`) |
| Declaration merging | Yes (can reopen) | No (cannot reopen) |
| `extends` | Yes | Via intersection (`&`) |
| Classes `implements` | Yes | Yes |
| When to use | Defining object/class shapes | Unions, complex types, primitives |

```typescript
// type can do unions, interface cannot:
type Result = 'success' | 'error' | 'loading'; // union

// interface for extending:
interface Base { id: number; }
interface Extended extends Base { name: string; } // id + name

// type for intersection (same as extends):
type Base = { id: number };
type Extended = Base & { name: string }; // id + name
```

### Generics

Generics make components reusable with any type while maintaining type safety.

```typescript
// Generic function:
function identity<T>(value: T): T {
    return value;
}

identity<string>('hello');  // returns string
identity<number>(42);       // returns number
identity('hello');           // TypeScript infers T = string

// Generic interface:
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

const userResponse: ApiResponse<User> = {
    data: { id: 1, name: 'Arnar' },
    status: 200,
    message: 'OK'
};

// Generic constraints:
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { id: 1, name: 'Arnar' };
getProperty(user, 'name');  // 'Arnar' — type is string
getProperty(user, 'id');    // 1 — type is number
getProperty(user, 'age');   // ERROR: 'age' is not in user
```

### Utility Types (Exam Favorites)

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

// Partial<T> — all properties become optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number }

const updateUser: PartialUser = { name: 'New Name' }; // OK — only name

// Required<T> — all properties become required
type RequiredUser = Required<PartialUser>;
// { id: number; name: string; email: string; age: number }

// Pick<T, K> — keep only specified keys
type UserSummary = Pick<User, 'id' | 'name'>;
// { id: number; name: string }

// Omit<T, K> — remove specified keys
type UserWithoutEmail = Omit<User, 'email'>;
// { id: number; name: string; age: number }

// Readonly<T> — all properties become readonly
type ReadonlyUser = Readonly<User>;
// All properties cannot be reassigned after creation

// Record<K, V> — object with keys of type K, values of type V
type UserMap = Record<string, User>;
// { [key: string]: User }
```

### Union Types & Type Narrowing

```typescript
function formatId(id: string | number): string {
    // Type narrowing with typeof:
    if (typeof id === 'string') {
        return id.toUpperCase(); // id is string here
    } else {
        return id.toFixed(0);    // id is number here
    }
}

// Nullable types (string | null):
function greet(name: string | null): string {
    if (name === null) {
        return 'Hello, stranger!';
    }
    return `Hello, ${name}!`;
}
```

### Enums

```typescript
// Numeric enum (default: starts at 0)
enum Direction {
    Up,    // 0
    Down,  // 1
    Left,  // 2
    Right  // 3
}

const move = Direction.Up; // 0
console.log(Direction[0]); // "Up" — reverse mapping!

// String enum (no reverse mapping):
enum Status {
    Pending = 'PENDING',
    Active = 'ACTIVE',
    Inactive = 'INACTIVE'
}

const status: Status = Status.Active; // "ACTIVE"

// Const enum (inlined at compile time, no JS object generated):
const enum Color {
    Red = 'red',
    Blue = 'blue'
}
```

### Type Assertion

```typescript
// Tells TypeScript "trust me, I know the type"
const input = document.getElementById('name') as HTMLInputElement;
input.value; // OK — TypeScript knows it's an HTMLInputElement

// Alternative syntax (not allowed in JSX):
const input2 = <HTMLInputElement>document.getElementById('name');

// Type assertion is NOT a cast — no runtime conversion:
const num = '42' as unknown as number; // risky!
```

### Structural Type System (Duck Typing)

```typescript
interface Point {
    x: number;
    y: number;
}

function logPoint(p: Point) {
    console.log(`${p.x}, ${p.y}`);
}

const point3d = { x: 1, y: 2, z: 3 }; // has x and y — compatible!
logPoint(point3d); // OK — structural typing

const animal = { type: 'cow', name: 'Fred' }; // no x or y
logPoint(animal); // ERROR — missing required properties

// "If it has the required shape, it is the type"
```

### tsconfig.json Key Options

```json
{
    "compilerOptions": {
        "target": "ES2017",        // Output JS version (default: ES3)
        "module": "commonjs",       // Module system
        "strict": true,             // Enable ALL strict checks
        "noImplicitAny": true,      // Error when type is implicitly any
        "strictNullChecks": true,   // null/undefined not assignable to other types
        "outDir": "./dist",         // Output directory
        "rootDir": "./src"          // Source directory
    }
}
```

**strict mode:** Enables `noImplicitAny`, `noImplicitThis`, `strictFunctionTypes`, `strictNullChecks`, and more.

**noImplicitAny:** Without it, `function sum(a, b)` is legal (a and b are implicitly `any`). With it, you must write `function sum(a: number, b: number)`.

### Abstract Classes

```typescript
abstract class Shape {
    abstract getArea(): number; // Must be implemented by subclasses
    
    // Concrete method — shared by all subclasses
    describe(): string {
        return `Area: ${this.getArea()}`;
    }
}

class Circle extends Shape {
    constructor(private radius: number) {
        super();
    }
    
    getArea(): number {
        return Math.PI * this.radius ** 2;
    }
}

// new Shape(); // ERROR: Cannot instantiate abstract class
const circle = new Circle(5);
circle.describe(); // "Area: 78.53..."
```

---

## 9. Tricky Code Output Examples

### Trick 1 — The Classic Event Loop

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```
**Output: `1`, `4`, `3`, `2`**

- 1, 4: sync code
- 3: microtask (Promise)
- 2: macrotask (setTimeout) — runs LAST even with 0ms delay

---

### Trick 2 — Nested Microtasks and Macrotasks

```javascript
console.log('A');
setTimeout(() => {
    console.log('B');
    Promise.resolve().then(() => console.log('C'));
}, 0);
Promise.resolve().then(() => {
    console.log('D');
    setTimeout(() => console.log('E'), 0);
});
console.log('F');
```
**Output: `A`, `F`, `D`, `B`, `C`, `E`**

Step by step:
1. `A` — sync
2. `F` — sync
3. `D` — microtask (first in microtask queue), queues macrotask E
4. `B` — first macrotask, queues microtask C
5. After B, drain microtasks: `C`
6. `E` — final macrotask

---

### Trick 3 — Promise Constructor is Synchronous

```javascript
const p = new Promise((resolve, reject) => {
    console.log('X');
    resolve('Y');
    console.log('Z');
});
p.then(val => console.log(val));
console.log('W');
```
**Output: `X`, `Z`, `W`, `Y`**

- X, Z: sync (executor runs immediately)
- W: sync (after creating the promise)
- Y: microtask (the .then callback)

---

### Trick 4 — async/await Execution Order

```javascript
async function foo() {
    console.log('A');
    const result = await Promise.resolve('B');
    console.log(result);
    console.log('C');
}

console.log('D');
foo();
console.log('E');
```
**Output: `D`, `A`, `E`, `B`, `C`**

- D: sync before foo
- A: sync inside foo (before await)
- `await` suspends foo, returns control to caller
- E: sync after calling foo
- B, C: microtask (foo resumes when Promise resolves)

---

### Trick 5 — queueMicrotask

```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C')).then(() => console.log('D'));
queueMicrotask(() => console.log('E'));
console.log('F');
```
**Output: `A`, `F`, `C`, `E`, `D`, `B`**

- A, F: sync
- C: first microtask (Promise.then)
- E: second microtask (queueMicrotask — FIFO with other microtasks)
- D: chained microtask (queued by C's resolution)
- B: macrotask

---

### Trick 6 — this with setTimeout

```javascript
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name; };

var cat = new Animal('Cat');
var dog = { name: 'Dog' };

// What does each log?
console.log(cat.speak());             // (a) "Cat"
console.log(cat.speak.call(dog));     // (b) "Dog"
console.log(cat.speak.bind(dog)());   // (c) "Dog"
cat.speak.bind(dog).call(cat);        // (d) "Dog" — bind wins!
setTimeout(cat.speak, 0);            // (e) undefined — this = window
setTimeout(() => cat.speak(), 0);    // (f) "Cat" — arrow preserves this
```

---

### Trick 7 — this Extraction Loses Context

```javascript
const obj = {
    value: 42,
    getValue() { return this.value; }
};

const fn = obj.getValue;
console.log(fn()); // undefined — this = window, window.value = undefined

const bound = obj.getValue.bind(obj);
console.log(bound()); // 42 — bound to obj
```

---

### Trick 8 — Promise Chaining Values

```javascript
Promise.resolve(1)
    .then(val => { console.log(val); return val + 1; })   // logs 1, passes 2
    .then(val => { console.log(val); return val + 1; })   // logs 2, passes 3
    .then(val => { console.log(val); });                   // logs 3

console.log('start');
```
**Output: `start`, `1`, `2`, `3`**
- `start` is sync, runs before any .then callbacks

---

### Trick 9 — .catch() Returns, Chain Continues

```javascript
Promise.resolve('start')
    .then(val => { console.log(val); throw new Error('oops'); })
    .then(val => { console.log('skipped'); })
    .catch(err => { console.log('Caught:', err.message); return 'recovered'; })
    .then(val => { console.log(val); });
```
**Output: `start`, `Caught: oops`, `recovered`**
- The second `.then` is skipped (chain in rejected state)
- `.catch` catches and returns a value → chain becomes fulfilled again

---

### Trick 10 — Arrow function in Object

```javascript
const obj = {
    name: 'obj',
    regular: function() { return this.name; },
    arrow: () => this.name,         // this = window/undefined (lexical)
    method() {
        const inner = () => this.name; // this = obj (inherited from method)
        return inner();
    }
};

console.log(obj.regular()); // "obj"
console.log(obj.arrow());   // undefined (window.name)
console.log(obj.method());  // "obj" (inner arrow inherits from method)
```

---

## 10. Quick-Reference Cheat Sheet

### `this` at a Glance

```
foo()                    → this = window (or undefined in strict)
obj.foo()                → this = obj
foo.call(x)              → this = x
foo.apply(x, [args])     → this = x
foo.bind(x)()            → this = x (PERMANENT, cannot be overridden)
new Foo()                → this = new Foo instance
setTimeout(foo, ms)      → this = window (LOST!)
() => {}                 → this = enclosing scope (NO own this)
```

### Event Loop Order

```
1. Sync code (Call Stack)
2. ALL microtasks (Promise .then/.catch/.finally, queueMicrotask)
3. ONE macrotask (setTimeout, setInterval, DOM events)
4. ALL microtasks again
5. Repeat...
```

### Promise Combinators

```
Promise.all([p1,p2,p3])         → all fulfill → resolve array
                                  any reject  → reject immediately
Promise.race([p1,p2,p3])        → first to settle (any state) wins
Promise.any([p1,p2,p3])         → first to FULFILL wins
                                  all reject  → AggregateError
Promise.allSettled([p1,p2,p3])  → waits all, NEVER rejects
                                  gives [{status, value/reason}, ...]
```

### Promise States

```
pending → fulfilled (resolve called)
pending → rejected  (reject called)
settled = fulfilled OR rejected (immutable, permanent)
```

### fetch Gotchas

```
fetch rejects ONLY on: network errors (no connection, DNS failure, CORS)
fetch RESOLVES on: 404, 500, any HTTP response

Must check: response.ok (true = 200-299)
Must await: response.json() — it returns a Promise!
```

### TypeScript Utility Types

```
Partial<T>          → all properties optional
Required<T>         → all properties required
Pick<T, 'a'|'b'>    → keep only a and b
Omit<T, 'a'|'b'>    → remove a and b
Readonly<T>         → all properties readonly
Record<K, V>        → object with keys K, values V
```

### TypeScript: interface vs type

```
interface:  objects/classes, extendable, declaration merging
type:       unions, intersections, primitives, aliases
Both:       object shapes, implementing in classes
```

### TypeScript: any vs unknown vs never

```
any     → opts OUT of type checking (avoid!)
unknown → can be anything, but must narrow before use
never   → type of values that never exist (throwing functions, impossible branches)
```

---

## 11. Likely Exam Questions & Model Answers

### Q: What are the 4 rules for determining `this`?

**A:**
1. **Global/Default binding** — regular function call `foo()` → `this = window` (or `undefined` in strict mode)
2. **Implicit binding** — method call `obj.foo()` → `this = obj` (object before the dot)
3. **Explicit binding** — `.call(x)`, `.apply(x, [args])`, `.bind(x)` → `this = x` (bind is permanent)
4. **`new` binding** — constructor call `new Foo()` → `this = new Foo instance`
5. **Arrow function** — inherits `this` from enclosing lexical scope (no own `this`)

---

### Q: What is the difference between .call() and .apply()?

**A:** Both invoke the function immediately with `this` set to the first argument. The difference is how additional arguments are passed:
- `.call(obj, arg1, arg2)` — arguments listed individually (Call = Commas)
- `.apply(obj, [arg1, arg2])` — arguments passed as an array (Apply = Array)
- `.bind(obj)` is different — returns a NEW function without calling it

---

### Q: Explain the Event Loop and its queues.

**A:** JavaScript is single-threaded. The Event Loop allows async operations by coordinating:
- **Call Stack** — where synchronous code executes (LIFO). Functions are pushed/popped.
- **Web APIs** — browser-handled async (setTimeout, fetch, DOM events) run off the main thread
- **Microtask Queue** — holds Promise callbacks (.then, .catch, .finally) and queueMicrotask(). **Processed completely before any macrotask.**
- **Macrotask Queue** — holds setTimeout/setInterval callbacks, DOM events. **One at a time.**

Order: sync code → ALL microtasks → ONE macrotask → ALL microtasks → ONE macrotask → repeat.

---

### Q: What is the difference between Promise.all, Promise.race, Promise.any, Promise.allSettled?

| Method | Resolves | Rejects |
|--------|----------|---------|
| `Promise.all` | All fulfill | Any one rejects |
| `Promise.race` | First to settle | First to settle |
| `Promise.any` | First to fulfill | All reject → AggregateError |
| `Promise.allSettled` | All settle (never rejects) | Never |

---

### Q: What are two bugs in this code?

```typescript
async function fetchProducts(category: string) {
    const response = await fetch(`/api/products/${category}`);
    const data = response.json();
    return data.filter(p => p.price > 0);
}
```

**A:**
1. **Missing `await` before `response.json()`** — `.json()` returns a Promise, not the data. Without `await`, `data` is a Promise object, and `.filter()` doesn't exist on Promise.
2. **No error handling** — if fetch fails (network error) or server returns 404/500, the function crashes. Should check `response.ok` and use try/catch.

**Fixed:**
```typescript
interface Product { name: string; price: number; }

async function fetchProducts(category: string): Promise<Product[]> {
    try {
        const response = await fetch(`/api/products/${category}`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data: Product[] = await response.json();
        return data.filter(p => p.price > 0);
    } catch (error) {
        console.error('Failed:', error);
        return [];
    }
}
```

---

### Q: What is the difference between interface and type in TypeScript?

**A:**
- **`interface`** defines object/class shapes, supports declaration merging (can be reopened), uses `extends` for inheritance. Best for defining object and class contracts.
- **`type`** can do everything `interface` can for objects, but also creates union types (`A | B`), intersection types (`A & B`), and aliases for primitives. Cannot be reopened (no declaration merging).

Key difference: `interface User { id: number }` declared twice merges into one interface. `type User = { id: number }` declared twice = error.

---

### Q: Explain Partial<T>, Pick<T,K>, and Omit<T,K> with examples.

```typescript
interface User { id: number; name: string; email: string; age: number; }

// Partial<T> — all properties optional (useful for update functions)
type UpdateUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number }
function updateUser(id: number, updates: Partial<User>) { /* ... */ }
updateUser(1, { name: 'New Name' }); // OK — no need to pass all fields

// Pick<T, K> — keep only specified keys
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string }

// Omit<T, K> — remove specified keys
type PublicUser = Omit<User, 'email' | 'age'>;
// { id: number; name: string }
```

---

### Q: What is the difference between `any` and `unknown`?

**A:**
- `any` completely disables type checking for that variable. You can call any method, access any property — TypeScript won't complain. Use only as last resort during migration.
- `unknown` is the type-safe alternative. You can assign anything to it, but you **cannot use it** without first narrowing the type (with `typeof`, `instanceof`, etc.).

```typescript
function processAny(input: any) {
    input.toUpperCase(); // TypeScript allows this — NO safety
}

function processUnknown(input: unknown) {
    input.toUpperCase(); // ERROR — cannot use unknown without narrowing
    if (typeof input === 'string') {
        input.toUpperCase(); // OK — narrowed to string
    }
}
```

---

### Q: What does `noImplicitAny` do in tsconfig.json?

**A:** Without `noImplicitAny`, TypeScript allows parameters with no type annotation (they become implicitly `any`). With `noImplicitAny: true`, you must explicitly type all parameters or TypeScript reports an error.

```typescript
// noImplicitAny: false (or unset) — OK:
function sum(a, b) { return a + b; } // a and b are implicitly any

// noImplicitAny: true — ERROR:
function sum(a, b) { return a + b; } // Error: 'a' has implicit 'any' type
// Must write:
function sum(a: number, b: number) { return a + b; }
```

---

### Q: What is the structural type system / duck typing in TypeScript?

**A:** TypeScript uses a **structural** type system (not nominal). Two types are compatible if they have the same structure — the same required properties with the same types. It doesn't matter what the type is "called" or where it was declared.

"If it walks like a duck and quacks like a duck, it is a duck."

```typescript
interface Point { x: number; y: number; }

function logPoint(p: Point) { console.log(p.x, p.y); }

const obj = { x: 1, y: 2, z: 3, extra: 'hello' };
logPoint(obj); // OK! Has x and y — structurally compatible with Point
```

---

### Q: What is a generic and why use them?

**A:** Generics are parameterized types — they let you write components that work with any type while maintaining full type safety. The type is specified when the generic is used, not when it's defined.

```typescript
// Without generics — loses type info:
function first(arr: any[]): any { return arr[0]; }

// With generics — type is preserved:
function first<T>(arr: T[]): T { return arr[0]; }

const firstNum = first([1, 2, 3]);   // TypeScript knows: number
const firstName = first(['a', 'b']); // TypeScript knows: string
```

---

### Q: What is the order of execution for this code?
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```

**A:** `1`, `4`, `3`, `2`

1. `1` — synchronous, runs immediately
2. setTimeout callback sent to Web APIs, then Macrotask Queue
3. Promise.then callback sent to Microtask Queue
4. `4` — synchronous
5. Call Stack empty → process Microtask Queue → `3`
6. Microtask Queue empty → process Macrotask Queue → `2`

---

### Q: Explain fetch error handling — why is response.ok needed?

**A:** `fetch()` only rejects its Promise on **network errors** (no internet connection, DNS failure, CORS blocking). When the server responds with any status code — including 404 Not Found or 500 Internal Server Error — `fetch` **resolves** the Promise with a Response object.

`response.ok` is `true` when the HTTP status is 200-299, `false` otherwise. Without this check, your code silently treats a 404 response as success.

```javascript
// Without the check — silently fails:
const response = await fetch('/api/data');
const data = await response.json(); // Might parse an error JSON body

// With the check — explicit error handling:
const response = await fetch('/api/data');
if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
}
const data = await response.json();
```
