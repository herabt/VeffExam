# Mock Exam 2026 — Questions + Teacher's Official Answers

---

## Part I: CSS & Layout (Q1-Q4)

### Q1 — CSS Layout — FILL IN THE BLANKS

**Question:** Complete the following sentences about CSS layout systems:

In CSS Grid, the property 1. ________ is used to define named layout regions, making it easy to place elements visually. In Flexbox, the 2. ________ property controls how items are aligned along the **cross-axis**. To make a grid responsive without media queries, you can use 3. ________ in the grid-template-columns property. The CSS property that controls how flex items grow to fill available space is 4. ________.

**Answer:**
1. `grid-template-areas`
2. `align-items`
3. `repeat(auto-fit, minmax(...))` in `grid-template-columns`
4. `flex-grow`

---

### Q2 — BEM Naming Convention — MULTIPLE CHOICE

**Question:** Which of the following class names correctly follows BEM naming conventions?
- .cardTitleActive
- .card__title--active
- .card-title-active
- .Card__Title

**Answer:** `.card__title--active`

---

### Q3 — CSS Custom Properties — SELECT ALL THAT APPLY

**Question:** Which of the following are **valid benefits of using CSS custom properties (variables)**? Select all that apply.
- They can be updated dynamically with JavaScript at runtime
- They are scoped and can be overridden within specific selectors
- They replace the need for a CSS preprocessor like SASS entirely
- They improve maintainability by centralising repeated values
- They are natively supported in all CSS-in-JS libraries without any configuration

**Answer:**
- YES: They can be updated dynamically with JavaScript at runtime
- YES: They are scoped and can be overridden within specific selectors
- YES: They improve maintainability by centralising repeated values
- NO: They replace the need for a CSS preprocessor like SASS entirely
- NO: They are natively supported in all CSS-in-JS libraries

---

### Q4 — CSS Grid + Flexbox — ESSAY (4 pts)

**Question:** You are building a large e-commerce website. The design requires a **complex page-level layout** (header, sidebar, main content, footer) and **flexible card components** inside the main content area. Explain how you would use **CSS Grid and Flexbox together** to implement this layout, and why each tool is appropriate for its role.

**Answer:**
Use **CSS Grid** for the page-level layout — it handles two dimensions (rows + columns):
```css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
```
Use **Flexbox** inside card components — it handles one dimension, distributing content:
```css
.card { display: flex; flex-direction: column; justify-content: space-between; }
```
**TL;DR** Grid = **macro** layout (2D control). Flexbox = **micro** layout (1D flow). They are complementary.

---

## Part II: JavaScript & TypeScript (Q5-Q8)

### Q5 — Async & the Event Loop — MULTIPLE CHOICE

**Question:** Which of the following correctly describes how JavaScript handles asynchronous operations like fetch()?
- JavaScript runs on multiple threads, so async operations run in parallel with the main thread
- The browser handles async operations via Web APIs, and resolved callbacks are queued and processed by the Event Loop
- async/await creates a new thread for each awaited operation
- Promises are processed in the same queue as setTimeout callbacks

**Answer:** The browser handles async operations via Web APIs, and resolved callbacks are queued and processed by the Event Loop.

---

### Q6 — TypeScript — FILL IN THE BLANKS

**Question:** Complete the following sentences about TypeScript:

In TypeScript, the keyword 1. ________ is used to define a contract that a class or object must follow. When a function can return either a string or a number, the return type is written as string 2. ________ number. The TypeScript utility type 3. ________ makes all properties of a type optional. To assert to TypeScript that a value is a specific type, you use a type 4. ________. When a variable can be a value or null, this is called a 5. ________ type.

**Answer:**
1. `interface`
2. `|` (pipe — union type: `string | number`)
3. `Partial<T>`
4. `assertion` (syntax: `value as Type`)
5. `nullable`

---

### Q7 — Async JavaScript — SELECT ALL THAT APPLY

**Question:** Which of the following statements about **asynchronous JavaScript** are correct? Select all that apply.
- async/await is syntactic sugar built on top of Promises
- Promise.all() resolves when the first promise in the array resolves
- If a Promise is rejected and there is no .catch() handler, it results in an unhandled rejection
- The Event Loop processes microtasks (like resolved Promises) before macrotasks (like setTimeout)
- await can be used outside of an async function without any issues

**Answer:**
- YES: `async/await` is syntactic sugar built on top of Promises
- YES: If a Promise is rejected and there is no `.catch()`, it results in an unhandled rejection
- YES: The Event Loop processes microtasks (Promises) before macrotasks (`setTimeout`)
- NO: Promise.all() resolves when the first promise resolves — that's Promise.race/any, not all
- NO: await can be used outside an async function — needs async context

---

### Q8 — TypeScript Bug Fix — ESSAY (4 pts)

**Question:** Study the following TypeScript code:
```typescript
async function loadUserData(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  const data = response.json();
  return data.name.toUpperCase();
}
```
a) Identify **two bugs or potential issues** in this code and explain why each is a problem. (2 pts)
b) Rewrite the function correctly in TypeScript, adding a proper **interface** for the expected user data shape and appropriate **error handling**. (2 pts)

**Answer:**
a) Two bugs:
1. `response.json()` **is not awaited** — it returns a `Promise`, so `data.name` is `undefined` and `.toUpperCase()` throws
2. **No error handling** — network errors or non-OK HTTP responses (404/500) are unhandled and crash silently

b) Fixed function:
```typescript
interface User {
  id: string;
  name: string;
}

async function loadUserData(userId: string): Promise<string> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data: User = await response.json(); // awaited
    return data.name.toUpperCase();
  } catch (error) {
    console.error("Failed to load user:", error);
    throw error;
  }
}
```

---

## Part III: React Hooks & State (Q9-Q14)

### Q9 — useEffect Dependency Array — MULTIPLE CHOICE

**Question:** A component fetches data on mount and re-fetches whenever a selectedId value changes. What should the useEffect dependency array look like?
- [] — runs only once on mount
- No dependency array — runs after every render
- [selectedId] — runs on mount and whenever selectedId changes
- [fetch] — runs whenever the fetch function reference changes

**Answer:** `[selectedId]` — runs on mount and whenever `selectedId` changes

---

### Q10 — useRef Use Cases — SELECT ALL THAT APPLY

**Question:** Which of the following are **correct use cases for useRef** in React? Select all that apply.
- Storing a reference to a DOM element to programmatically focus it
- Triggering a component re-render when its value changes
- Keeping track of a previous state value without causing re-renders
- Sharing state between sibling components
- Storing a timer ID from setInterval so it can be cleared later
- Replacing useState for all state management to improve performance

**Answer:**
- YES: Storing a reference to a DOM element to programmatically focus it
- YES: Keeping track of a previous state value without causing re-renders
- YES: Storing a timer ID from `setInterval` so it can be cleared later
- NO: Triggering a re-render (useRef does NOT trigger re-renders)
- NO: Sharing state between siblings (use Context or state management)
- NO: Replacing useState (useRef is not for render-dependent state)

---

### Q11 — Sharing State Across Nesting Levels — MULTIPLE CHOICE

**Question:** You are building a feature where the same piece of state needs to be accessible by many components at different nesting levels. Which of the following is the **most appropriate built-in React solution**?
- Lift state up to the root component and pass it down via props through every level
- Use useRef to store the value and share it across components
- Use the Context API with createContext and useContext
- Use useReducer inside each component independently

**Answer:** Use the Context API with `createContext` and `useContext`

---

### Q12 — React State — FILL IN THE BLANKS

**Question:** Complete the following sentences about React state management:

When you call a state setter from useState, React schedules a 1. ________ of the component. The problem of passing props through many intermediate components that don't need them is called 2. ________. The 3. ________ hook memoizes a **function reference** so it is not recreated on every render. When two sibling components need to share state, the recommended pattern is to 4. ________ the state to their closest common parent.

**Answer:**
1. `re-render`
2. `prop drilling`
3. `useCallback`
4. `lift`

---

### Q13 — Global State Management — SELECT ALL THAT APPLY

**Question:** You are choosing a global state management solution for a large React application. Which of the following statements are **true**? Select all that apply.
- Zustand has a simpler API than Redux and requires less boilerplate code
- The Context API is optimised for high-frequency state updates such as animations
- Redux Toolkit (RTK) is the modern recommended way to use Redux, reducing boilerplate significantly
- Zustand stores can be accessed outside of React components, for example in utility functions
- Context API and Zustand cannot be used together in the same application
- Redux requires components to be class-based to connect to the store

**Answer:**
- YES: Zustand has a simpler API than Redux and requires less boilerplate
- YES: Redux Toolkit (RTK) is the modern recommended way to use Redux
- YES: Zustand stores can be accessed outside of React components
- NO: Context API is optimised for high-frequency updates (it re-renders ALL consumers)
- NO: Context API and Zustand cannot be used together (they can)
- NO: Redux requires class-based components (works with hooks: useSelector/useDispatch)

---

### Q14 — Shopping Cart State — ESSAY (8 pts)

**Question:** You are building a **shopping cart** for a Next.js e-commerce application. The cart must:
- Be accessible from multiple pages (product page, cart page, navbar)
- Support adding, removing, and updating item quantities
- Persist the cart when the user navigates between pages

a) Compare **Context API**, **Zustand**, and **Redux Toolkit** as options for managing the cart state. For each, describe one advantage and one disadvantage in this specific use case. (4 pts)
b) Choose one of the three approaches and sketch out the key parts of your implementation — the state shape, how actions are handled, and how a component would read and update the cart. (4 pts)

**Answer:**

a) Comparison:

| | Context API | Zustand | Redux Toolkit |
|---|---|---|---|
| Advantage | Zero dependencies, built-in | Minimal boilerplate, works outside React, easy persistence | DevTools, middleware, predictable flow |
| Disadvantage | Re-renders all consumers on every update | Less opinionated, no built-in DevTools | Most boilerplate, steeper learning curve |

b) Implementation — Zustand:
```typescript
interface CartItem { id: string; name: string; price: number; quantity: number; }
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((s) => {
        const exists = s.items.find((i) => i.id === item.id);
        return exists
          ? { items: s.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) }
          : { items: [...s.items, { ...item, quantity: 1 }] };
      }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, qty) => set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, quantity: qty } : i) })),
    }),
    { name: "cart-storage" }
  )
);

// Usage in any component:
const { items, addItem } = useCartStore();
```

---

## Part IV: Forms with react-hook-form (Q15-Q17)

### Q15 — react-hook-form vs useState — MULTIPLE CHOICE

**Question:** What is the **primary advantage** of using react-hook-form over managing form state manually with useState?
- It automatically sends form data to the server without any configuration
- It reduces unnecessary re-renders by using uncontrolled inputs and only re-renders on validation events
- It replaces the need for any server-side validation
- It only works with TypeScript and cannot be used with plain JavaScript

**Answer:** It reduces unnecessary re-renders by using uncontrolled inputs and only re-renders on validation events.

---

### Q16 — react-hook-form — FILL IN THE BLANKS

**Question:** Complete the following sentences about react-hook-form:

The core hook used to initialise a form is 1. ________. To connect an input field to the form, you spread the result of calling 2. ________ with the field name onto the input element. Validation errors for a field named email are accessed via 3. ________. To validate as the user types rather than on submit, you set the mode option to 4. ________. To integrate a schema validation library like Zod, you pass it via the 5. ________ option. When a form is submitted successfully, the validated data is passed to the function provided to 6. ________.

**Answer:**
1. `useForm`
2. `register`
3. `formState.errors`
4. `onChange`
5. `resolver`
6. `handleSubmit`

---

### Q17 — Valid register() Rules — SELECT ALL THAT APPLY

**Question:** Which of the following are **valid built-in validation rules** you can pass to the register() function in react-hook-form? Select all that apply.
- required
- minLength
- type
- pattern
- sanitize

**Answer:**
- YES: `required`
- YES: `minLength`
- YES: `pattern`
- NO: `type`
- NO: `sanitize`

---

## Part V: Next.js Server / Client (Q18-Q22)

### Q18 — Next.js Server Action — MULTIPLE CHOICE

**Question:** In Next.js App Router, what is a **Server Action**?
- A special React hook that runs only on the server during hydration
- An async function marked with "use server" that runs on the server and can be called directly from a Client Component or form
- A middleware function that intercepts all HTTP requests before they reach a page
- A built-in Next.js API that replaces fetch() for server-side data loading

**Answer:** An async function marked with `"use server"` that runs on the server and can be called directly from a Client Component or form.

---

### Q19 — When to Use API Route — SELECT ALL THAT APPLY

**Question:** Which of the following are situations where you should use an **API Route** instead of a **Server Action** in Next.js? Select all that apply.
- Handling a webhook from an external service like Stripe
- Submitting a form from a Client Component to save data to a database
- Exposing an endpoint that a mobile app or third-party service needs to call
- Mutating data after a button click in a React Server Component
- Building a public REST API consumed by multiple different clients
- Revalidating cached data after a form submission

**Answer:**
- YES: Handling a webhook from an external service like Stripe
- YES: Exposing an endpoint that a mobile app or third-party service needs to call
- YES: Building a public REST API consumed by multiple different clients
- NO: Submitting a form from Client Component (use Server Action)
- NO: Mutating data after button click (use Server Action)
- NO: Revalidating cached data (use Server Action)

---

### Q20 — Server vs Client Components — MULTIPLE CHOICE

**Question:** Which of the following correctly describes the difference between a **Server Component** and a **Client Component** in Next.js App Router?
- Server Components can use useState and useEffect; Client Components cannot
- Client Components are rendered only in the browser; Server Components are never sent to the client at all
- Server Components run on the server and do not add JavaScript to the client bundle; Client Components run in the browser and can use React hooks and handle interactivity
- Server Components and Client Components behave identically but are placed in different folders

**Answer:** Server Components run on the server and do not add JavaScript to the client bundle; Client Components run in the browser and can use React hooks and handle interactivity.

---

### Q21 — Server Components — SELECT ALL THAT APPLY

**Question:** Which of the following are **true about Server Components** in Next.js App Router? Select all that apply.
- They can fetch data directly using fetch() without needing useEffect
- They can use useState, useEffect, and event handlers
- They reduce the amount of JavaScript sent to the browser
- They cannot be imported into Client Components under any circumstances
- They can access server-side resources like databases and environment variables directly

**Answer:**
- YES: They can fetch data directly using `fetch()` without needing `useEffect`
- YES: They reduce the amount of JavaScript sent to the browser
- YES: They can access server-side resources like databases and environment variables directly
- NO: They can use useState, useEffect (Server Components CANNOT use hooks)
- NO: They cannot be imported into Client Components (they CAN be rendered as children)

---

### Q22 — Registration Form — ESSAY (8 pts)

**Question:** You are building a **user registration form** in a Next.js App Router application. The form has fields for name, email, and password. Requirements:
- Validate inputs on the client side before submission using react-hook-form
- Submit the form data securely to the server
- Display meaningful error messages to the user
- Perform server-side validation before saving to the database

a) Describe how you would implement the form using react-hook-form. What key methods and properties would you use, and how would you display validation errors? (3 pts)
b) Would you use a **Server Action** or an **API Route** to handle the form submission? Justify your choice and describe the full data flow from the user clicking submit to the data being saved. (3 pts)
c) Why is **server-side validation still necessary** even though you are already validating on the client with react-hook-form? Give a concrete example of what could go wrong without it. (2 pts)

**Answer:**

a) react-hook-form implementation:
```tsx
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
// Display error:
{errors.email && <span>{errors.email.message}</span>}
```

b) **Server Action** — the form is internal to the Next.js app; no external client needs a public URL.
1. User submits → client-side Zod validation runs
2. If valid → Server Action called (`"use server"`)
3. Server re-validates, checks DB for duplicate email, hashes password, saves user
4. Returns success → redirect, or returns error → displayed to user

c) Why server-side validation is still required:
Client-side validation can be bypassed entirely — e.g. via `curl` or DevTools. Without server-side validation, an attacker could POST `{ email: "x", password: "" }` directly to the Server Action endpoint, storing an empty password hash in the database.

---

## Part VI: JavaScript Internals (Q23)

### Q23 — The `this` Keyword — TRACE (6 pts)

**Question:** The following code is given:
```javascript
function Game(name) {
    this.name = name;
    console.log(this);
}

Game.prototype.play = function() {
    console.log('Play game!');
    console.log(this);
};

function VideoGame(name, yearOfRelease) {
    Game.call(this, name);
    this.yearOfRelease = yearOfRelease;
    console.log(this);
};

VideoGame.prototype = Object.create(Game.prototype);
VideoGame.prototype.constructor = VideoGame;

var empty = {};
```

State what `this` will be for each line:
1. var gameOne = VideoGame('The Legend Of Zelda: Ocarina Of Time', 1998);
2. var gameTwo = new Game('Fallout 1', 1997);
3. var gameThree = new VideoGame('Monkey Island 2: LeChuck\'s Revenge', 1991);
4. gameTwo.play();
5. gameTwo.play.bind(empty).call();
6. setTimeout(gameThree.play, 1000);

Possibilities: window, gameOne, gameTwo, gameThree, empty

**Answer:**

| Line | `this` | Why |
|------|--------|-----|
| 1. `VideoGame('Zelda...', 1998)` | **window** | No `new` — defaults to the global object |
| 2. `new Game('Fallout 1', 1997)` | **gameTwo** | `new` creates a new object and binds `this` to it |
| 3. `new VideoGame('Monkey Island...', 1991)` | **gameThree** | `new` creates a new object and binds `this` to it |
| 4. `gameTwo.play()` | **gameTwo** | Method call — `this` is the object before the dot |
| 5. `gameTwo.play.bind(empty).call()` | **empty** | `bind` permanently sets `this`; `.call()` cannot override it |
| 6. `setTimeout(gameThree.play, 1000)` | **window** | Detached callback — `this` loses its object context |

---

## Appendix: Core Concepts

### Redux Concepts (6 pts)

**Question:** Describe the following concepts within Redux: Connected components, Actions, Reducers, Dispatch. Each concept should be explained briefly about what it does and how it fits within the Redux/Flux pattern.

**Answer:**

| Concept | Description |
|---------|-------------|
| **Connected Components** | Components linked to the Redux store via `useSelector` / `useDispatch` (or `connect()`). They read state and dispatch actions without prop drilling |
| **Actions** | Plain objects describing *what happened*: `{ type: 'cart/add', payload: item }`. The only way to signal a state change |
| **Reducers** | Pure functions `(state, action) => newState` that define how state changes for each action type. No side effects allowed |
| **Dispatch** | The method that sends an action to the store: `dispatch(action)`. Routes the action through reducers to produce new state |

### React Core Concepts (4 pts)

**Question:**
1. What is a component?
2. What principles should a component follow?
3. What is the benefit of using components?

**Answer:**

**1. What is a component?**
A self-contained, reusable function that accepts `props` and returns JSX describing UI.

**2. Principles a component should follow:**
- **Single Responsibility** — do one thing
- **Pure / Predictable** — same props → same output
- **Reusable & Composable** — generic, nestable
- **Encapsulated** — clean props interface, internal state hidden

**3. Benefits of using components:**
- **Reusability** — write once, use anywhere
- **Maintainability** — isolated changes
- **Testability** — easy to unit test in isolation

### background-size Reference

**Question:** What image is defined by the following CSS styles? (visual question with He-Man images)

**Answer:**

| Value | Result |
|-------|--------|
| `auto` | Image shown at its **natural / original size** |
| `cover` | Scaled to **fill the container**, cropping if needed, aspect ratio preserved |
| `contain` | Scaled to **fit entirely inside** the container, aspect ratio preserved, may leave gaps |
| `100% 100%` | **Stretched** to fill exactly — aspect ratio distorted |
| `50px 50px` | Displayed at the **exact pixel size** specified |
