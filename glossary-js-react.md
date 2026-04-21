# JavaScript, DOM, TypeScript & React Hooks Glossary

Comprehensive study glossary for Vefforritun 2 final exam -- definitions drawn from the course slides and lecture materials.

---

## 1. DOM SELECTORS

| Method | Definition | Returns | Notes |
|--------|-----------|---------|-------|
| **`getElementById(id)`** | Selects a single element by its `id` attribute. The `id` must be unique on the page. | A single `Element` or `null` | Fastest selector. Does NOT use `#` prefix -- just the bare id string. |
| **`getElementsByName(name)`** | Selects elements that have the given `name` attribute value. | A live `NodeList` | Commonly used with form elements (`<input name="email">`). |
| **`getElementsByTagName(tag)`** | Selects all elements with the given tag name (e.g., `'p'`, `'div'`). | A live `HTMLCollection` | Returns ALL matching elements in the document. Use `'*'` for all tags. |
| **`getElementsByClassName(class)`** | Selects all elements that have the given CSS class name. | A live `HTMLCollection` | Does NOT use `.` prefix. Can pass multiple classes separated by spaces. |
| **`querySelector(selector)`** | Selects the **first** element that matches any CSS selector. | A single `Element` or `null` | Uses full CSS selector syntax: `'#id'`, `'.class'`, `'div > p'`, etc. |
| **`querySelectorAll(selector)`** | Selects **all** elements matching the CSS selector. | A **static** `NodeList` | The NodeList is a snapshot -- it does NOT update when the DOM changes (unlike live collections). |

### Live vs Static Collections

```javascript
// LIVE collection -- updates automatically when DOM changes
const divs = document.getElementsByTagName('div');

// STATIC collection -- snapshot, does NOT update
const divs2 = document.querySelectorAll('div');
```

### Code examples from slides

```javascript
// getElementById
const element = document.getElementById('main-content');

// querySelector -- uses CSS selector syntax
const first = document.querySelector('.card');        // first .card
const nested = document.querySelector('div > p.intro'); // CSS combinator

// querySelectorAll
const allCards = document.querySelectorAll('.card');
allCards.forEach(card => {
  // ... do something
});
```

---

## 2. DOM TRAVERSAL

| Property | Definition | What it includes |
|----------|-----------|-----------------|
| **`parentNode`** | Returns the parent node of the specified node in the DOM tree. | Can be an `Element`, `Document`, or `DocumentFragment`. |
| **`childNodes`** | Returns a live `NodeList` of ALL child nodes, **including text nodes, comment nodes, and whitespace**. | Element nodes, text nodes (whitespace), comment nodes. |
| **`children`** | Returns an `HTMLCollection` of only the **element** children. | Element nodes ONLY -- no text nodes, no whitespace, no comments. |
| **`nextSibling`** | Returns the next node at the same level in the DOM tree. | Can be a text node (whitespace) or comment -- NOT necessarily an element. |
| **`nextElementSibling`** | Returns the next **element** sibling, skipping text/comment nodes. | Always an `Element` or `null`. |
| **`previousSibling`** | Returns the previous node at the same level. | Like `nextSibling`, may return text/whitespace nodes. |
| **`previousElementSibling`** | Returns the previous **element** sibling, skipping text/comment nodes. | Always an `Element` or `null`. |
| **`firstChild`** | The first child node (may be a text node). | Any node type. |
| **`firstElementChild`** | The first child that is an element. | Element only. |
| **`lastChild`** | The last child node (may be a text node). | Any node type. |
| **`lastElementChild`** | The last child that is an element. | Element only. |

### children vs childNodes -- critical difference

```html
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

```javascript
const list = document.getElementById('list');

// childNodes includes whitespace text nodes!
console.log(list.childNodes.length);   // 5 (text, li, text, li, text)

// children includes only element nodes
console.log(list.children.length);     // 2 (li, li)
```

### nextSibling vs nextElementSibling

```javascript
const first = document.querySelector('li');

// nextSibling -- might be a whitespace text node
console.log(first.nextSibling);         // #text (whitespace)

// nextElementSibling -- skips to next actual element
console.log(first.nextElementSibling);  // <li>Item 2</li>
```

---

## 3. DOM MANIPULATION

| Method / Property | Definition | Returns |
|-------------------|-----------|---------|
| **`createElement(tag)`** | Creates a new HTML element with the given tag name. The element exists only in memory until appended to the DOM. | A new `Element` node. |
| **`appendChild(node)`** | Appends a child node to the end of a parent element's child list. If the node already exists in the DOM, it is **moved** (not copied). | The appended child node. |
| **`insertBefore(newNode, referenceNode)`** | Inserts `newNode` before `referenceNode` as a child of the parent. If `referenceNode` is `null`, it acts like `appendChild`. | The inserted node. |
| **`removeChild(node)`** | Removes a child node from the DOM. Must be called on the **parent** of the node you want to remove. | The removed node (still exists in memory). |
| **`replaceChild(newChild, oldChild)`** | Replaces `oldChild` with `newChild` in the parent's child list. | The replaced (old) child node. |
| **`textContent`** | Gets or sets the text content of an element and all its descendants. Does NOT parse HTML -- treats everything as plain text. Safe to use with user input. | Plain text string. |
| **`setAttribute(name, value)`** | Sets the value of an attribute on an element. If the attribute does not exist, it is created. | `undefined`. |
| **`getAttribute(name)`** | Returns the value of a specified attribute. | String or `null`. |
| **`removeAttribute(name)`** | Removes an attribute from an element. | `undefined`. |
| **`data-` attributes** | Custom attributes prefixed with `data-`. Accessed in JavaScript via the `dataset` property. Valid HTML5 way to store extra data on elements. | Via `element.dataset.someName`. |

### innerHTML vs textContent

From slides: `innerHTML` renders HTML markup. `textContent`/`innerText` renders as plain text — "renderast ekki sem HTML heldur strengur" (not rendered as HTML but as a string).

### createElement + appendChild pattern

```javascript
// Create a new element
const newItem = document.createElement('li');
newItem.textContent = 'New item';
newItem.setAttribute('class', 'list-item');

// Add it to the DOM
const list = document.getElementById('my-list');
list.appendChild(newItem);
```

### insertBefore

```javascript
const list = document.getElementById('my-list');
const newItem = document.createElement('li');
newItem.textContent = 'Inserted item';

// Insert before the first child
const firstItem = list.children[0];
list.insertBefore(newItem, firstItem);
```

### removeChild

```javascript
const list = document.getElementById('my-list');
const itemToRemove = list.children[2];
list.removeChild(itemToRemove);  // must call on parent
```

### data- attributes

```html
<div id="user" data-user-id="42" data-role="admin">John</div>
```

```javascript
const user = document.getElementById('user');

// Access via dataset (camelCase conversion)
console.log(user.dataset.userId);  // "42"
console.log(user.dataset.role);    // "admin"

// Set a new data attribute
user.dataset.active = 'true';
// Results in: data-active="true" on the element
```

---

## 4. EVENTS

### addEventListener

| Concept | Definition |
|---------|-----------|
| **`addEventListener(event, handler, useCapture)`** | Registers an event handler on an element. Multiple handlers can be added to the same event. The third parameter `useCapture` (default: `false`) determines whether the handler fires during the capture phase (`true`) or the bubbling phase (`false`). |
| **Event handler** | A function (callback) that runs when a specific event occurs. Can be an anonymous function, named function, or arrow function. |
| **Event object** | Automatically passed as the first argument to the event handler. Contains information about the event that occurred (type, target, coordinates, key pressed, etc.). |
| **`event.target`** | The element that **triggered** the event (the element that was actually clicked/interacted with). May differ from `this`/`currentTarget` due to bubbling. |
| **`event.currentTarget`** | The element that the event handler is **attached to**. Always equals `this` inside the handler (unless using arrow functions). |
| **Event bubbling** | When an event fires on a child element, it "bubbles up" through each ancestor element in the DOM tree, firing the same event type on each. Default behavior in the DOM. Events go from the target element up to the document root. |
| **`event.stopPropagation()`** | Prevents the event from bubbling up (or capturing down) to parent/ancestor elements. The current handler still runs, but no further propagation occurs. |
| **`event.preventDefault()`** | Prevents the browser's default action for the event (e.g., following a link on click, submitting a form, etc.). Does NOT stop propagation. |
| **`DOMContentLoaded`** | Fires when the initial HTML document has been completely loaded and parsed, **without waiting for stylesheets, images, or subframes** to finish loading. Contrast with `window.onload` which waits for everything. |

### addEventListener example

```javascript
const button = document.querySelector('#my-button');

button.addEventListener('click', function(event) {
  console.log('Clicked!');
  console.log(event.target);        // the element that was clicked
  console.log(event.currentTarget); // the element the handler is on
  console.log(this);                // same as currentTarget (regular function)
});
```

### Event bubbling

```html
<div id="outer">
  <div id="inner">
    <button id="btn">Click me</button>
  </div>
</div>
```

```javascript
document.getElementById('outer').addEventListener('click', () => {
  console.log('Outer div clicked');  // fires 3rd (bubbles up)
});

document.getElementById('inner').addEventListener('click', () => {
  console.log('Inner div clicked');  // fires 2nd (bubbles up)
});

document.getElementById('btn').addEventListener('click', () => {
  console.log('Button clicked');     // fires 1st (target)
});
// Click button => "Button clicked", "Inner div clicked", "Outer div clicked"
```

### stopPropagation

```javascript
document.getElementById('btn').addEventListener('click', (event) => {
  console.log('Button clicked');
  event.stopPropagation();  // stops bubbling -- outer/inner handlers won't fire
});
```

### DOMContentLoaded

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // DOM is fully parsed and ready
  // Safe to query and manipulate DOM elements here
  const heading = document.querySelector('h1');
  heading.textContent = 'Page loaded!';
});
```

### Centralized event handling

*Note: The "Flyweight DOM pattern" label was previously used here but that term is not from the teacher's slides. The concept of event delegation (attaching one handler to a parent) is standard DOM knowledge.*

---

## 5. JAVASCRIPT OBJECTS

| Concept | Definition (from slides) |
|---------|------------------------|
| **Object** | An object is a fundamental datatype in JavaScript. Objects are collections of properties, where each property is a name-value pair. Almost everything in JS is an object (or behaves like one). |
| **Properties** | A property is a name (string or Symbol) associated with a value. Properties can be data properties or accessor properties (getters/setters). |
| **Property attributes** | Every property has attributes that control its behavior: **writable**, **enumerable**, and **configurable**. |
| **writable** | Determines whether the value of the property can be changed. Default: `true`. If `false`, assignment to the property silently fails (or throws in strict mode). |
| **enumerable** | Determines whether the property shows up in `for...in` loops and `Object.keys()`. Default: `true`. Non-enumerable properties are "hidden" from iteration. |
| **configurable** | Determines whether the property can be deleted or its attributes can be modified. Default: `true`. Once set to `false`, it cannot be changed back. |
| **`Object.defineProperty()`** | Defines a new property directly on an object or modifies an existing one, with explicit control over property attributes. |
| **`Object.create(proto)`** | Creates a new object with the specified prototype object. Used to set up prototype chains explicitly. |

### Object.defineProperty

```javascript
const obj = {};

Object.defineProperty(obj, 'name', {
  value: 'Arnar',
  writable: false,       // cannot change the value
  enumerable: true,      // shows up in for...in
  configurable: false    // cannot delete or reconfigure
});

obj.name = 'New name';   // silently fails (or throws in strict mode)
console.log(obj.name);   // "Arnar"
```

### Property attribute defaults

When creating a property with `Object.defineProperty()`, attributes default to **`false`** (opposite of regular assignment):

```javascript
// Regular assignment -- all attributes default to true
obj.name = 'Arnar';
// writable: true, enumerable: true, configurable: true

// defineProperty -- unspecified attributes default to false
Object.defineProperty(obj, 'name', { value: 'Arnar' });
// writable: false, enumerable: false, configurable: false
```

### Object.create

```javascript
const animal = {
  speak() {
    return this.name + ' makes a sound';
  }
};

const dog = Object.create(animal);
dog.name = 'Rex';
console.log(dog.speak()); // "Rex makes a sound"
// dog's prototype is animal -- speak() is found via prototype chain
```

---

## 6. PROTOTYPES & CONSTRUCTORS

| Concept | Definition (from slides) |
|---------|------------------------|
| **Prototype** | Every JavaScript object has an internal link to another object called its prototype. When a property is not found on the object itself, JavaScript looks up the prototype chain. |
| **Prototype chain** | The chain of prototypes that JavaScript traverses when looking up a property. Ends at `Object.prototype`, whose prototype is `null`. |
| **Constructor function** | A function designed to be called with `new`. By convention, constructor names start with a capital letter. Constructors are used to create specific types of objects -- they both prepare the object for use and can accept parameters which the constructor uses to set the values of member variables when the object is first created. |
| **`new` keyword** | When a function is called with `new`: (1) a new empty object is created, (2) `this` is bound to the new object, (3) the object's `__proto__` is set to the constructor's `.prototype`, (4) the constructor function runs, (5) the new object is implicitly returned. |
| **`__proto__`** | The actual prototype link on an instance object, pointing to the constructor's `.prototype` object. This is how the prototype chain is traversed. (Not to be confused with `.prototype` which exists on functions.) |
| **`.prototype`** | A property that exists on **functions** (not on regular objects). When a function is used as a constructor with `new`, the created object's `__proto__` points to this `.prototype` object. |
| **Extending prototypes** | Adding methods to a constructor's `.prototype` so that all instances share the same method (memory efficient). Unlike defining methods inside the constructor (where each instance gets its own copy), prototype methods exist once and are shared. |
| **Constructor pattern** | Constructors are used to create specific types of objects. It is called a pattern because it is NOT native to JavaScript. Divided into two subpatterns: Basic Constructors and Constructors With Prototypes (from slides). |

### Basic Constructor (from slides)

```javascript
// Basic Constructors
function Car(model, year, miles) {
    this.model = model;
    this.year = year;
    this.miles = miles;

    this.toString = function() {
        return this.model + ' has done ' + this.miles + ' miles';
    };
}

var rollsRoyce = new Car('Rolls Royce', 2005, 10000);
var mondeo = new Car('Ford Mondeo', 2008, 15000);

console.log(rollsRoyce.toString());
console.log(mondeo.toString());
```

> **Problem:** Each instance gets its own copy of `toString` -- wastes memory.

### Constructors With Prototypes (from slides)

```javascript
// Constructors With Prototypes
function Car(model, year, miles) {
    this.model = model;
    this.year = year;
    this.miles = miles;
}

Car.prototype.toString = function() {
    return this.model + ' has done ' + this.miles + ' miles';
};

var rollsRoyce = new Car('Rolls Royce', 2005, 10000);
var mondeo = new Car('Ford Mondeo', 2008, 15000);

// They now share the same implementation of toString through the prototype
console.log(rollsRoyce.toString());
console.log(mondeo.toString());
```

### Prototype chain lookup

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return this.name + ' speaks';
};

const cat = new Animal('Cat');
// cat.speak() -- found on Animal.prototype
// cat.toString() -- found on Object.prototype
// cat.nonExistent -- traverses whole chain, returns undefined
```

---

## 7. `this` BINDING

The value of `this` is determined by **how a function is called**, not where it is defined.

| How it's called | `this` = | Example |
|----------------|----------|---------|
| **Regular call** (no `new`, no dot) | `window` (global object) | `foo()` -- `this` = `window` |
| **`new` keyword** | The new object being created | `new Car('Tesla')` -- `this` = new Car instance |
| **Method call** (dot notation) | The object before the dot | `obj.method()` -- `this` = `obj` |
| **`.call(thisArg, ...args)`** | The first argument | `fn.call(myObj, arg1)` -- `this` = `myObj` |
| **`.apply(thisArg, [args])`** | The first argument | `fn.apply(myObj, [arg1])` -- `this` = `myObj` |
| **`.bind(thisArg)`** | Permanently set to first argument | `fn.bind(myObj)` -- `this` = `myObj` always. **Cannot be overridden** -- not even by `.call()` or `.apply()`. |
| **`setTimeout(fn)`** | `window` (context is LOST) | `setTimeout(obj.method, 1000)` -- `this` = `window` |
| **Arrow function** | Inherits `this` from enclosing lexical scope | Arrow functions do NOT have their own `this`. |

### Regular call vs `new`

```javascript
function Animal(name) {
  this.name = name;
}

var a = Animal('Cat');      // NO new! this = window. 'Cat' is set on window.name
var b = new Animal('Cat');  // YES new! this = new Animal object
console.log(a);             // undefined (no return statement)
console.log(b);             // Animal { name: 'Cat' }
```

### Method call

```javascript
const person = {
  name: 'Arnar',
  greet() {
    return 'Hello, I am ' + this.name;
  }
};

person.greet();         // this = person -> "Hello, I am Arnar"

const greetFn = person.greet;
greetFn();              // this = window -> "Hello, I am " (context lost!)
```

### .call and .apply

```javascript
function introduce(greeting) {
  return greeting + ', I am ' + this.name;
}

const person = { name: 'Arnar' };

introduce.call(person, 'Hello');     // "Hello, I am Arnar"
introduce.apply(person, ['Hello']);   // "Hello, I am Arnar"
// .call takes args individually, .apply takes an array
```

### .bind is permanent

```javascript
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name; };

var b = new Animal('Cat');
var stray = { name: 'Stray' };

b.speak.bind(stray).call();   // "Stray" -- bind wins! Cannot be overridden by call
```

### setTimeout loses context

```javascript
var b = new Animal('Cat');

setTimeout(b.speak, 1000);          // this = window (context LOST!)

// Fix 1: Arrow function
setTimeout(() => b.speak(), 1000);  // arrow preserves this

// Fix 2: bind
setTimeout(b.speak.bind(b), 1000);  // bind locks this to b
```

### Arrow functions

```javascript
const obj = {
  name: 'Arnar',
  delayedGreet() {
    // Arrow function inherits this from delayedGreet's scope
    setTimeout(() => {
      console.log(this.name);  // "Arnar" (this = obj)
    }, 1000);
  }
};
obj.delayedGreet();
```

---

## 8. TYPESCRIPT

| Concept | Definition (from slides) |
|---------|------------------------|
| **Why TypeScript** | TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing, which catches errors at compile time rather than runtime. JavaScript is dynamically typed -- variables can hold any type at any time, which can lead to bugs. |
| **Type inference** | TypeScript can automatically infer types based on the assigned value. You do not always need to write explicit type annotations. |
| **Type definitions** | Explicit type annotations using the colon syntax: `let name: string = 'Arnar'`. Basic types include: `string`, `number`, `boolean`, `null`, `undefined`, `void`, `any`, `never`, `unknown`. |
| **Interfaces** | Define the shape/structure that an object must conform to. Interfaces can be extended and are open (can be declared multiple times and merged). |
| **Union types** | Allow a value to be one of several types, using the pipe `\|` operator: `string \| number`. |
| **Generics** | Allow creating reusable components that work with any type while maintaining type safety. Use angle brackets: `<T>`. |
| **Structural type system** | From slides: "type checking focuses on the shape the values have." Two types are compatible if their structure is compatible. If an object has all the required properties of a type, it satisfies that type. Extra properties are OK. |
| **Compilation** | From slides: "Type annotations are not a part of JS and therefore browsers aren't equipped to handle TypeScript code. Therefore non-JS features are stripped out during compilation." |
| **Downleveling** | From slides: "By default TypeScript targets ES3 (an old version of JS)" which during compilation transpiles to ES3 standards. Template literals changed to concat() in compiled output. |
| **Strictness** | TypeScript has multiple strictness flags that can be enabled. The `strict` flag in `tsconfig.json` enables all strict checks at once. Key strict checks: `noImplicitAny` (error when type is implicitly `any`), `strictNullChecks` (null/undefined are not assignable to other types). |
| **tsconfig.json** | The configuration file for a TypeScript project. Specifies compiler options (target, module, strict, etc.), include/exclude patterns, and project settings. Created via `tsc --init`. |

### Type inference

```typescript
// TypeScript infers the type from the value
let name = 'Arnar';      // inferred as string
let age = 30;             // inferred as number
let active = true;        // inferred as boolean

name = 42;                // ERROR: Type 'number' is not assignable to type 'string'
```

### Type annotations

```typescript
let name: string = 'Arnar';
let age: number = 30;
let scores: number[] = [90, 85, 92];
let person: { name: string; age: number } = { name: 'Arnar', age: 30 };
```

### Interfaces

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // optional property
}

function greet(user: User): string {
  return `Hello ${user.name}`;
}

// Works -- object has the required shape
greet({ name: 'Arnar', age: 30 });

// Also works -- extra properties are OK when passed through a variable
const person = { name: 'Arnar', age: 30, role: 'teacher' };
greet(person);  // structural typing -- has name & age, so it's compatible
```

### Union types

```typescript
function printId(id: string | number) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase());   // narrowed to string
  } else {
    console.log(id.toFixed(2));      // narrowed to number
  }
}

printId('abc');   // "ABC"
printId(42);      // "42.00"
```

### Generics

```typescript
function identity<T>(value: T): T {
  return value;
}

identity<string>('hello');  // returns string
identity<number>(42);       // returns number
identity('hello');          // type inferred as string

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
}

const response: ApiResponse<User[]> = {
  data: [{ name: 'Arnar', age: 30 }],
  status: 200
};
```

### Structural / Duck typing

```typescript
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// This object was never declared as Point, but it has x and y
const myObj = { x: 10, y: 20, z: 30 };
logPoint(myObj);  // OK! Structural typing -- has x and y, so it's a Point
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "commonjs",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 9. React Performance & Memoization

### Why performance matters
- "By default React will re-run the entire body of your component every time it re-renders" (from slides)
- Every re-render re-creates functions and re-calculates values
- useCallback and useMemo cache these to prevent unnecessary work

### useCallback vs useMemo — when to use each
- **useCallback**: caches a **function reference** — use when passing callbacks to child components wrapped in `memo`
- **useMemo**: caches a **computed value** — use when you have expensive calculations that shouldn't re-run on every render
- *Note: the equivalence `useCallback(fn, deps) === useMemo(() => fn, deps)` is from React docs, not from the teacher's slides*
- **When NOT to use**: don't memoize everything — only when there's a measurable performance problem

### Expensive calculations (from slides)
- Example: filtering/sorting a large list inside a component
- Without useMemo: recalculates on every render even if the data hasn't changed
- With useMemo: only recalculates when dependencies change

### useCallback

| Concept | Definition |
|---------|-----------|
| **`useCallback`** | `useCallback` is a React Hook that lets you cache a function definition between re-renders. It returns a memoized version of the callback that only changes if one of the dependencies has changed. |
| **Signature** | `const memoizedFn = useCallback(fn, [dependencies])` |
| **Arguments** | (1) `fn` -- the function value you want to cache. (2) `dependencies` -- the list of all reactive values referenced inside `fn`. React will compare each dependency with its previous value using `Object.is`. |
| **Return value** | On the initial render, returns the function you passed. On subsequent renders, returns either the already stored function (if dependencies haven't changed) or the function you passed during the current render. |
| **Skip re-renders** | By default, when a component re-renders, React re-renders all of its children recursively. This is fine for components that don't require much calculation. Wrapping a function in `useCallback` ensures referential equality, so a child wrapped in `memo` can skip re-rendering when the callback prop hasn't changed. |
| **Functional updater pattern** | When updating state based on previous state inside a callback, use the functional updater (`setCount(prev => prev + 1)`) instead of reading the current state directly. This removes the state variable from the dependency array and prevents the callback from changing on every state update. |
| **Preventing useEffect firing** | If a function is passed as a dependency to `useEffect`, wrapping it in `useCallback` prevents the effect from re-running on every render, because the function reference stays stable. |

### Basic useCallback

```tsx
import { useCallback, useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // Without useCallback -- new function on every render
  // const increment = () => setCount(count + 1);

  // With useCallback -- function identity is stable
  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count]);  // recreated only when count changes

  return <button onClick={increment}>Count: {count}</button>;
}
```

### Skip re-renders with memo

```tsx
import { useCallback, memo } from 'react';

// Child wrapped in memo -- only re-renders if props actually change
const ExpensiveChild = memo(function ExpensiveChild({ onClick }: { onClick: () => void }) {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // useCallback ensures onClick has the same identity between renders
  // so ExpensiveChild can skip re-rendering when only name changes
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);  // no dependencies -- function never changes

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <ExpensiveChild onClick={handleClick} />
      <p>Count: {count}</p>
    </div>
  );
}
```

### Functional updater pattern (removing dependencies)

```tsx
// BAD -- count is in the dependency array, so callback changes on every count change
const increment = useCallback(() => {
  setCount(count + 1);
}, [count]);

// GOOD -- functional updater removes count from dependencies
const increment = useCallback(() => {
  setCount(prev => prev + 1);
}, []);  // empty dependency array -- function never changes
```

### Preventing useEffect from firing

```tsx
function SearchComponent({ query }: { query: string }) {
  // Without useCallback, fetchData is a new function every render,
  // causing useEffect to fire on every render
  const fetchData = useCallback(() => {
    fetch(`/api/search?q=${query}`);
  }, [query]);  // only changes when query changes

  useEffect(() => {
    fetchData();
  }, [fetchData]);  // effect only re-runs when fetchData changes (i.e., when query changes)
}
```

---

## 10. useMemo

| Concept | Definition |
|---------|-----------|
| **`useMemo`** | `useMemo` is a React Hook that lets you cache the **result** of a calculation between re-renders. Unlike `useCallback` which caches a function, `useMemo` caches the return value. |
| **Memoisation** | An optimization technique where the result of an expensive function call is stored (cached) so that when the same inputs occur again, the cached result is returned instead of recalculating. |
| **Signature** | `const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])` |
| **Arguments** | (1) A "create" function that returns the value you want to memoize -- it takes no arguments. (2) A dependency array -- React recalculates only when a dependency changes. |
| **Expensive recalculations** | Use `useMemo` when you have a computation that is expensive (e.g., filtering/sorting a large list, complex mathematical calculations) and you want to avoid running it on every render. |
| **Skipping re-renders** | Similar to `useCallback` + `memo`, you can use `useMemo` to ensure an object or array passed as a prop maintains referential equality, preventing unnecessary child re-renders. |
| **Difference from useCallback** | `useCallback(fn, deps)` caches the **function itself**. `useMemo(() => fn, deps)` caches the **return value** of the function. `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. |

### Avoiding expensive recalculations

```tsx
import { useMemo, useState } from 'react';

function FilteredList({ items }: { items: string[] }) {
  const [filter, setFilter] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Without useMemo -- filters on EVERY render, even when only darkMode changes
  // const filtered = items.filter(item => item.includes(filter));

  // With useMemo -- only recalculates when items or filter changes
  const filtered = useMemo(() => {
    console.log('Filtering...');  // only logs when items or filter changes
    return items.filter(item => item.includes(filter));
  }, [items, filter]);  // darkMode changes do NOT trigger recalculation

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <button onClick={() => setDarkMode(!darkMode)}>Toggle theme</button>
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
```

### Skipping re-renders with memoized objects

```tsx
import { useMemo, memo } from 'react';

const Chart = memo(function Chart({ data }: { data: { x: number; y: number }[] }) {
  console.log('Chart rendered');
  // expensive rendering...
  return <div>Chart with {data.length} points</div>;
});

function Dashboard({ rawData }: { rawData: number[] }) {
  const [theme, setTheme] = useState('light');

  // useMemo ensures the data array keeps the same identity
  // so Chart (wrapped in memo) doesn't re-render when theme changes
  const chartData = useMemo(() => {
    return rawData.map((val, i) => ({ x: i, y: val }));
  }, [rawData]);  // only recalculates when rawData changes

  return (
    <div>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <Chart data={chartData} />
    </div>
  );
}
```

### useCallback vs useMemo equivalence

```tsx
// These are equivalent:
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

const memoizedCallback2 = useMemo(() => {
  return () => {
    doSomething(a, b);
  };
}, [a, b]);

// useCallback caches the FUNCTION
// useMemo caches the RETURN VALUE (which can be a function, object, or anything)
```

### When NOT to use useMemo

```tsx
// DON'T -- simple calculations don't need memoization
const doubled = useMemo(() => count * 2, [count]);  // overkill

// DO -- just compute it directly
const doubled = count * 2;

// useMemo has overhead (storing the value, comparing dependencies)
// Only use it for genuinely expensive computations or referential equality
```

---

## Quick Reference: Key Comparisons

### children vs childNodes
| | children | childNodes |
|---|----------|-----------|
| Returns | HTMLCollection (elements only) | NodeList (all nodes) |
| Includes text/whitespace | No | Yes |
| Includes comments | No | Yes |
| Live | Yes | Yes |

### querySelector vs getElementById
| | querySelector | getElementById |
|---|--------------|----------------|
| Selector syntax | Full CSS selectors | ID string only (no `#`) |
| Returns | First match or null | Element or null |
| Speed | Slightly slower | Fastest |
| Flexibility | High (any CSS selector) | Limited (ID only) |

### useCallback vs useMemo
| | useCallback | useMemo |
|---|------------|---------|
| Caches | The function itself | The return value |
| Signature | `useCallback(fn, deps)` | `useMemo(() => value, deps)` |
| Use for | Event handlers, callbacks passed to children | Expensive computations, complex objects/arrays |
| Equivalence | `useCallback(fn, deps)` = `useMemo(() => fn, deps)` | -- |
