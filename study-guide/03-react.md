# React — Complete Exam Study Guide

> Target: 100% on the final exam. Every concept from lectures, slides, and practice exams is covered here.

---

## TABLE OF CONTENTS

1. [Core Concepts](#1-core-concepts)
2. [JSX](#2-jsx)
3. [Props](#3-props)
4. [State & Re-render Triggers](#4-state--re-render-triggers)
5. [Virtual DOM, Reconciliation & Keys](#5-virtual-dom-reconciliation--keys)
6. [One-Way Data Flow](#6-one-way-data-flow)
7. [useState](#7-usestate)
8. [useEffect — All Variants + Cleanup + Stale Closures](#8-useeffect--all-variants--cleanup--stale-closures)
9. [useRef](#9-useref)
10. [useContext](#10-usecontext)
11. [useReducer](#11-usereducer)
12. [useCallback](#12-usecallback)
13. [useMemo](#13-usememo)
14. [Custom Hooks](#14-custom-hooks)
15. [Rules of Hooks](#15-rules-of-hooks)
16. [Component Lifecycle with Hooks](#16-component-lifecycle-with-hooks)
17. [Patterns: Lifting State Up](#17-patterns-lifting-state-up)
18. [Patterns: Controlled vs Uncontrolled Components](#18-patterns-controlled-vs-uncontrolled-components)
19. [Patterns: Composition vs Inheritance](#19-patterns-composition-vs-inheritance)
20. [Patterns: Conditional Rendering](#20-patterns-conditional-rendering)
21. [Patterns: List Rendering](#21-patterns-list-rendering)
22. [Patterns: Render Props & Higher-Order Components](#22-patterns-render-props--higher-order-components)
23. [forwardRef & useImperativeHandle](#23-forwardref--useimperativehandle)
24. [React.memo — Skipping Re-renders](#24-reactmemo--skipping-re-renders)
25. [Likely Exam Questions with Answers](#25-likely-exam-questions-with-answers)
26. [Quick-Reference Cheat Sheet](#26-quick-reference-cheat-sheet)

---

## 1. CORE CONCEPTS

### What is a Component?

A component is a **reusable, self-contained building block** of a React application. It is a function that accepts inputs (props) and returns React elements (JSX) describing what should appear on screen.

**Component Principles (know all four — they come up in fill-in-blank questions):**
| Principle | Meaning |
|-----------|---------|
| **Single Responsibility** | Each component should do one thing well |
| **Reusable** | Designed to be used in multiple places with different data |
| **Composable** | Can be combined with other components to build larger features |
| **Declarative** | Describes WHAT the UI should look like, not HOW to update the DOM |

**Component Benefits (know all four):**
- Code reuse — write once, use many times
- Easier testing — small, isolated units are simpler to test
- Separation of concerns — each component handles its own logic and presentation
- Easier maintenance — changes to one component don't affect others

---

## 2. JSX

**Definition:** JSX is a syntax extension that looks like HTML but compiles to JavaScript function calls.

```jsx
// JSX
const element = <h1 className="title">Hello</h1>;

// Compiles to:
const element = React.createElement('h1', { className: 'title' }, 'Hello');
```

**Key rules:**
- Use `className` instead of `class` (reserved word in JS)
- Use `htmlFor` instead of `for`
- All tags must be closed (`<br />`, not `<br>`)
- Only ONE root element per return (use `<>...</>` fragments if needed)
- JavaScript expressions go inside `{ }` curly braces
- JSX is NOT HTML — it compiles to JS function calls

---

## 3. PROPS

**Definition:** Read-only data passed from parent to child. Props flow one-way (top-down).

```tsx
// Parent passes props
<UserCard name="Tomas" age={22} isAdmin={true} />

// Child receives props
function UserCard({ name, age, isAdmin }: { name: string; age: number; isAdmin: boolean }) {
  return <div>{name} ({age}) {isAdmin && '— Admin'}</div>;
}
```

**Critical rule:** Props are **read-only**. A component must never modify its own props.

**Prop drilling:** Passing props through many intermediate components that don't need them. This is an **anti-pattern** — use Context API to solve it.

---

## 4. STATE & RE-RENDER TRIGGERS

### What triggers a re-render?

A component re-renders when:
1. Its **own state changes** (via a state setter like `setState`)
2. Its **parent re-renders** (and passes new props)
3. A **context value it subscribes to changes** (via `useContext`)

**What does NOT trigger a re-render:**
- Changing a `useRef` value (`.current = newValue`)
- Changing a regular variable
- Calling a function that doesn't update state

### State update batching

React batches multiple `setState` calls in the same event handler — they all apply in one re-render.

```tsx
function handleClick() {
  setCount(c => c + 1); // batched
  setName('Tomas');     // batched
  // Only ONE re-render happens
}
```

---

## 5. VIRTUAL DOM, RECONCILIATION & KEYS

### Virtual DOM

React keeps an **in-memory representation** of the real DOM called the Virtual DOM. When state/props change, React:
1. Creates a **new Virtual DOM tree**
2. **Diffs** it against the previous Virtual DOM (reconciliation)
3. Calculates the **minimum set of changes** needed
4. **Updates only those parts** of the real DOM

This is more efficient than updating the entire DOM on every change.

### Reconciliation

The algorithm React uses to compare the old and new Virtual DOM. Key rules:
- Elements of **different types** → tear down old tree, build new one
- Elements of the **same type** → update only changed attributes
- **Lists without keys** → React can't tell which item is which and may re-render everything

### Keys

**Definition:** The `key` prop is a unique identifier for list items. It helps React track which items changed, were added, or removed.

```tsx
// WRONG — no key
{users.map(user => <UserCard name={user.name} />)}

// WRONG — using index as key (can cause bugs when list order changes)
{users.map((user, i) => <UserCard key={i} name={user.name} />)}

// CORRECT — use stable, unique ID
{users.map(user => <UserCard key={user.id} name={user.name} />)}
```

**Why index as key is bad:** If you reorder or delete items, the index changes, and React incorrectly thinks different items are the same component. This causes state bugs (e.g., input values showing in wrong items).

**Rule:** Keys must be:
- Unique among siblings (not globally unique)
- Stable (not change between renders)
- Not the array index if the list can be reordered or filtered

---

## 6. ONE-WAY DATA FLOW

React enforces **unidirectional data flow**:
- Data flows **down** from parent to child (via props)
- Events flow **up** from child to parent (via callback props)

```tsx
// Data flows DOWN via props
function Parent() {
  const [count, setCount] = useState(0);
  return <Child count={count} onIncrement={() => setCount(c => c + 1)} />;
}

// Events flow UP via callbacks
function Child({ count, onIncrement }: { count: number; onIncrement: () => void }) {
  return <button onClick={onIncrement}>Count: {count}</button>;
}
```

---

## 7. useState

### Signature
```tsx
const [value, setValue] = useState<T>(initialValue);
```

### How it works
- `value` — the current state value
- `setValue` — schedules a re-render with the new value
- `initialValue` — only used on the FIRST render

### Functional updater form (critical — prevents stale closure bugs)
```tsx
// DANGEROUS — reads stale value
setCount(count + 1);

// SAFE — always uses latest value
setCount(prev => prev + 1);
```

**Always use the functional updater form when the new state depends on the old state**, especially inside `useEffect`, `useCallback`, or async functions.

### Pitfalls
- State updates are **asynchronous** — `value` doesn't change immediately after `setValue`
- Calling `setValue` with the same value (by `Object.is` comparison) does NOT trigger a re-render
- Objects and arrays must be **replaced**, not mutated:

```tsx
// WRONG — mutates state, no re-render
state.name = 'Tomas'; // React doesn't see this change

// CORRECT — new object triggers re-render
setState({ ...state, name: 'Tomas' });

// CORRECT for arrays
setItems(prev => [...prev, newItem]);
```

### Example
```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

---

## 8. useEffect — All Variants + Cleanup + Stale Closures

### Signature
```tsx
useEffect(() => {
  // effect code (side effect)
  return () => {
    // cleanup function (optional)
  };
}, [dependencies]); // dependency array (optional)
```

### The three dependency array variants — KNOW ALL THREE

| Variant | Behavior | When to use |
|---------|----------|-------------|
| `useEffect(fn)` — NO array | Runs after **every render** | Rarely. Almost always a mistake. |
| `useEffect(fn, [])` — empty array | Runs **once on mount** only | API calls on load, subscriptions, event listeners |
| `useEffect(fn, [a, b])` — with deps | Runs on mount + whenever `a` or `b` changes | Fetching when a prop/state changes, syncing with external systems |

```tsx
// Runs after EVERY render
useEffect(() => {
  document.title = `Count: ${count}`;
});

// Runs ONCE on mount
useEffect(() => {
  const socket = connectToServer();
  return () => socket.disconnect(); // cleanup on unmount
}, []);

// Runs on mount AND whenever userId changes
useEffect(() => {
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => setUser(data));
}, [userId]);
```

### Cleanup function

The function returned from `useEffect` runs:
1. Before the component **unmounts**
2. Before the effect **runs again** (when deps change)

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    setSeconds(prev => prev + 1);
  }, 1000);

  return () => clearInterval(timer); // cleanup prevents memory leak
}, []);
```

**Critical:** Without cleanup, intervals/subscriptions/event listeners keep running even after the component unmounts, causing memory leaks.

### Stale Closure Bug — THIS IS A COMMON EXAM TRAP

A **stale closure** happens when `useEffect` captures an old value of a variable and uses that stale value even after the variable has changed.

**Example of the bug:**
```tsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // BUG: `seconds` is captured from the closure at the time of mount
      // It will ALWAYS be 0, never increment
      setSeconds(seconds + 1); // stale closure!
    }, 1000);

    return () => clearInterval(id);
  }, []); // empty array — effect never re-runs, closure never updates

  return <div>{seconds}s</div>;
}
```

**Fix 1: Functional updater (best)**
```tsx
useEffect(() => {
  const id = setInterval(() => {
    setSeconds(prev => prev + 1); // reads latest state from React
  }, 1000);
  return () => clearInterval(id);
}, []);
```

**Fix 2: Add to dependency array**
```tsx
useEffect(() => {
  const id = setInterval(() => {
    setSeconds(seconds + 1);
  }, 1000);
  return () => clearInterval(id);
}, [seconds]); // re-runs on every `seconds` change — but now interval resets each second
```

**Stale closure with fetch (from practice exam Q6):**
```tsx
// BUG: missing dependency array — runs after every render → infinite loop!
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }); // <-- no dependency array!

  return <div>{user?.name}</div>;
}

// FIX: add [userId] as dependency
useEffect(() => {
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => setUser(data));
}, [userId]); // Only re-fetch when userId changes
```

### Common useEffect patterns

**Pattern: Subscribing to events**
```tsx
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

**Pattern: Preventing race conditions with cleanup**
```tsx
useEffect(() => {
  let cancelled = false;

  fetch(`/api/data/${id}`)
    .then(res => res.json())
    .then(data => {
      if (!cancelled) setData(data); // don't set state if effect cleaned up
    });

  return () => { cancelled = true; };
}, [id]);
```

---

## 9. useRef

### Signature
```tsx
const ref = useRef<T>(initialValue);
// Access: ref.current
```

### Key characteristics
- `ref.current` is a **mutable value** that persists across renders
- Changing `ref.current` does **NOT trigger a re-render**
- The ref object itself is stable (same reference every render)

### Use cases
| Use case | Why ref, not state |
|----------|-------------------|
| DOM element reference | Need direct DOM access, no render needed |
| Timer ID (setInterval, setTimeout) | Don't need to display it |
| Previous value tracking | Side info, shouldn't trigger re-render |
| WebSocket / subscription instances | Persist across renders, no UI change needed |

**Quote from slides:** "if your component needs to store some value, but it doesn't impact the rendering logic" → use `useRef`.

### Example: Timer with ref (correct pattern from practice exam)
```tsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1); // functional updater, no stale closure
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return <div>Time: {seconds}s</div>;
}
```

**Why not `useState` for the timer ID?**
- We don't need to display the timer ID
- Setting state causes a re-render — unnecessary
- `useRef` persists without re-rendering

### Example: DOM reference
```tsx
function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    inputRef.current?.focus(); // directly access DOM element
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>Focus</button>
    </>
  );
}
```

### Pitfalls
- Do NOT read/write `ref.current` during render — only in effects and event handlers
- Do NOT use refs as a replacement for state when the value needs to be displayed

---

## 10. useContext

### Signature
```tsx
const value = useContext(MyContext);
```

### Purpose: Solving prop drilling

**Prop drilling** = passing props through many intermediate components that don't use the data, just to get it to a deeply nested child. This is an anti-pattern.

**Context API** = React's built-in solution for sharing state across many components without prop drilling.

### How to set up Context

**Step 1: Create the context**
```tsx
import { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);
```

**Step 2: Create Provider**
```tsx
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**Step 3: Wrap app with Provider**
```tsx
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  );
}
```

**Step 4: Consume context anywhere**
```tsx
function Header() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('Must be used inside ThemeProvider');

  return (
    <header className={ctx.theme}>
      <button onClick={ctx.toggleTheme}>Toggle Theme</button>
    </header>
  );
}
```

### Context API Limitations — EXAM IMPORTANT

| Aspect | Detail |
|--------|--------|
| **Pros** | Built into React, no extra dependencies, simple setup |
| **Cons** | Re-renders ALL consumers when context value changes (even if they only use part of it) |
| **Best for** | Theme, auth, locale — data that changes **infrequently** |
| **Bad for** | High-frequency updates (animations, progress bars, real-time data) |

**Why it re-renders everything:** When the Provider's value object changes (even if the values inside are the same), all consumers re-render. This is because React uses `Object.is` to compare context values.

---

## 11. useReducer

### Signature
```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

### What is it?

An alternative to `useState` for **complex state logic**. Follows the pattern:
```
(state, action) => newState
```

The reducer is a **pure function** — same inputs always produce the same output, no side effects.

### When to use useReducer vs useState

| Situation | Use |
|-----------|-----|
| Simple value (counter, boolean, string) | `useState` |
| Multiple related values that change together | `useReducer` |
| Next state depends on current state in complex ways | `useReducer` |
| Complex state transitions (like a form wizard) | `useReducer` |

### Full example
```tsx
type State = {
  count: number;
  error: string | null;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'setError'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1, error: null };
    case 'decrement':
      if (state.count <= 0) return { ...state, error: 'Cannot go below 0' };
      return { ...state, count: state.count - 1, error: null };
    case 'reset':
      return { count: 0, error: null };
    case 'setError':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, error: null });

  return (
    <div>
      <p>Count: {state.count}</p>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### Connection to Redux

`useReducer` follows the same pattern as Redux:
- `dispatch` sends an action to the reducer
- The reducer computes new state
- Components re-render with new state

Redux is essentially a global `useReducer` with middleware and devtools.

---

## 12. useCallback

### Signature
```tsx
const memoizedFn = useCallback(fn, [dependencies]);
```

### What it does

Caches (memoizes) a **function reference** so it is not recreated on every render. Returns the same function object as long as dependencies haven't changed.

**Why it matters:** Every render creates new function objects. If you pass a function to a child wrapped in `React.memo`, the child sees a new prop (different reference) and re-renders — even if the function logic is identical.

### When to use

- Passing callbacks to child components wrapped in `React.memo`
- Function is in the dependency array of `useEffect` or another `useCallback`/`useMemo`

### Example: Preventing child re-render
```tsx
import { useCallback, useState, memo } from 'react';

const Button = memo(function Button({ onClick }: { onClick: () => void }) {
  console.log('Button rendered');
  return <button onClick={onClick}>Click me</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Without useCallback: new function on every render → Button always re-renders
  // With useCallback: function reference stable → Button skips re-render when name changes
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // no dependencies — function never changes

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <Button onClick={handleClick} />
      <p>Count: {count}</p>
    </div>
  );
}
```

### The functional updater pattern (removes dependencies)

```tsx
// BAD: depends on count → callback changes on every count change
const increment = useCallback(() => {
  setCount(count + 1);
}, [count]);

// GOOD: functional updater removes count from deps → function never changes
const increment = useCallback(() => {
  setCount(prev => prev + 1);
}, []); // empty array — always stable
```

### Preventing useEffect from firing too often
```tsx
function Search({ query, filters }) {
  const fetchData = useCallback(() => {
    fetch(`/api/search?q=${query}`);
  }, [query]); // only changes when query changes

  useEffect(() => {
    fetchData();
  }, [fetchData]); // effect only re-runs when fetchData changes (i.e., when query changes)
}
```

**Without `useCallback`:** `fetchData` is a new function every render → `useEffect` runs on every render.

### Custom hooks: always wrap returned functions
When building custom hooks, wrap all returned functions in `useCallback`. You don't know how the consumer will use them — they might put them in `useEffect` deps or pass them to a memoized child.

### Pitfalls
- Don't overuse — only memoize when there's a real performance problem
- `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`
- The dependency array must include ALL reactive values used inside the function

---

## 13. useMemo

### Signature
```tsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### What it does

Caches (memoizes) the **return value** of a computation. Only recomputes when dependencies change.

**From slides:** "By default React will re-run the entire body of your component every time it re-renders." useMemo skips expensive recalculations.

### useCallback vs useMemo

| | useCallback | useMemo |
|---|------------|---------|
| Caches | The function itself | The return value of the function |
| Use for | Event handlers, callbacks | Expensive computations, complex objects/arrays |
| Equivalence | `useCallback(fn, deps)` = `useMemo(() => fn, deps)` | |

### Example: Expensive filter
```tsx
function ProductList({ products, category, darkMode }) {
  // Without useMemo: filter runs on EVERY render, even when only darkMode changes
  // With useMemo: filter only runs when products or category changes
  const filtered = useMemo(() => {
    return products.filter(p => p.category === category);
  }, [products, category]); // darkMode changes do NOT trigger this

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      {filtered.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

### Example: Stable object reference for child component
```tsx
const Chart = memo(function Chart({ data }) {
  return <div>Chart with {data.length} points</div>;
});

function Dashboard({ rawData, theme }) {
  // Without useMemo: new array object every render → Chart always re-renders
  // With useMemo: array reference stable when rawData unchanged → Chart skips re-render
  const chartData = useMemo(() => {
    return rawData.map((val, i) => ({ x: i, y: val }));
  }, [rawData]);

  return <Chart data={chartData} />;
}
```

### When NOT to use useMemo
```tsx
// DON'T — simple computation, memoization overhead is wasteful
const doubled = useMemo(() => count * 2, [count]);

// DO — just compute directly
const doubled = count * 2;
```

---

## 14. Custom Hooks

### What is a custom hook?

A JavaScript function whose name starts with `use` that can call other hooks. Custom hooks let you **extract and reuse stateful logic** between components.

### Rules for custom hooks
- Name MUST start with `use` (e.g., `useFetch`, `useLocalStorage`, `useDebounce`)
- Can call other hooks inside them
- Logic is shared, but **state is NOT shared** — each component using the hook gets its own isolated state

### Example: useFetch
```tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useFetch<User>(`/api/users/${userId}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <div>{user?.name}</div>;
}
```

### Example: useLocalStorage
```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback((newValue: T) => {
    setValue(newValue);
    window.localStorage.setItem(key, JSON.stringify(newValue));
  }, [key]);

  return [value, setStoredValue] as const;
}
```

---

## 15. RULES OF HOOKS

**These are strict rules — violating them causes bugs.**

### Rule 1: Only call hooks at the top level

**Never** call hooks inside:
- Loops
- Conditions (`if` statements)
- Nested functions

```tsx
// WRONG
if (isLoggedIn) {
  const [user, setUser] = useState(null); // violates rule!
}

// CORRECT — call hook unconditionally, use condition inside
const [user, setUser] = useState(null);
if (!isLoggedIn) return null;
```

**Why:** React relies on the ORDER of hook calls to know which state belongs to which hook. If hooks are called conditionally, the order changes between renders and React gets confused.

### Rule 2: Only call hooks from React functions

Call hooks only from:
- React function components
- Custom hooks

**Never** call hooks from:
- Regular JavaScript functions
- Class components
- Event handlers (standalone functions outside components)

---

## 16. COMPONENT LIFECYCLE WITH HOOKS

Class components had lifecycle methods. Function components replicate them with `useEffect`:

| Class lifecycle | Hooks equivalent |
|-----------------|-----------------|
| `componentDidMount` | `useEffect(() => { ... }, [])` |
| `componentDidUpdate` | `useEffect(() => { ... }, [dep])` or `useEffect(() => { ... })` |
| `componentWillUnmount` | Return a cleanup function from `useEffect` |
| `shouldComponentUpdate` | `React.memo` + `useCallback`/`useMemo` |
| `getDerivedStateFromProps` | Compute from state/props during render (no hook needed) |

### Full lifecycle diagram with hooks

```
MOUNT:
  1. Component function runs (renders)
  2. React updates the DOM
  3. useEffect cleanup from prev render runs (none on mount)
  4. All useEffects run ([] deps run, all-deps run, no-array run)

UPDATE (state/props change):
  1. Component function runs again (re-renders)
  2. React diffs Virtual DOM and updates real DOM
  3. Cleanup from PREVIOUS render's useEffects runs
  4. useEffects with changed deps run

UNMOUNT:
  1. Cleanup from last render's useEffects runs
  2. Component is removed from DOM
```

---

## 17. PATTERNS: LIFTING STATE UP

**Definition:** When two sibling components need to share state, move (lift) that state to their **closest common parent**.

```tsx
// BEFORE: Each has own state (can't sync)
function TemperatureFahrenheit() {
  const [temp, setTemp] = useState(32);
  return <input value={temp} onChange={e => setTemp(e.target.value)} />;
}

// AFTER: State lifted to parent
function TemperatureConverter() {
  const [celsius, setCelsius] = useState(0);
  const fahrenheit = celsius * 9/5 + 32;

  return (
    <div>
      <input
        value={celsius}
        onChange={e => setCelsius(Number(e.target.value))}
        placeholder="Celsius"
      />
      <input
        value={fahrenheit}
        onChange={e => setCelsius((Number(e.target.value) - 32) * 5/9)}
        placeholder="Fahrenheit"
      />
    </div>
  );
}
```

**From slides/mock exam:** "When siblings need shared state, **lift** the state to closest common parent." (This is one of the fill-in-blank answers from the mock exam.)

---

## 18. PATTERNS: CONTROLLED VS UNCONTROLLED COMPONENTS

### Controlled Component

React state owns the input value. Every keystroke triggers a re-render.

```tsx
function ControlledForm() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}                           // React controls the value
      onChange={e => setValue(e.target.value)} // update state on every keystroke
    />
  );
}
```

**When to use:**
- Need to validate input in real time
- Need to conditionally enable/disable submit button
- Need live search or character count
- React-hook-form uses controlled OR uncontrolled depending on configuration

### Uncontrolled Component

The DOM manages its own value. React reads it only when needed (via `ref`).

```tsx
function UncontrolledForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(inputRef.current?.value); // read on demand
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="initial" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**When to use:**
- Simple forms where you only need the value on submit
- Integrating with non-React code
- Performance-critical forms (react-hook-form uses this by default)

### Comparison table

| | Controlled | Uncontrolled |
|---|------------|-------------|
| Source of truth | React state | DOM |
| Re-renders on input | Yes (every keystroke) | No |
| Access value | Via state variable | Via `ref.current.value` |
| Validation | Real-time, easy | On submit only |
| react-hook-form approach | Uncontrolled (uses refs internally) | |

---

## 19. PATTERNS: COMPOSITION VS INHERITANCE

React strongly favors **composition** over inheritance.

### Composition

Components can render other components as children via the `children` prop.

```tsx
// Generic container (composition)
function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Specialized usage — no inheritance needed
function UserCard({ user }: { user: User }) {
  return (
    <Card title={user.name}>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </Card>
  );
}
```

### Why not inheritance?

React's creators say: "We haven't found any use cases where we would recommend creating component inheritance hierarchies." Composition gives all the flexibility you need:
- Specialization: pass props to configure behavior
- Containment: use `children` to inject content
- Code reuse: extract logic into custom hooks, not base classes

---

## 20. PATTERNS: CONDITIONAL RENDERING

### Methods

**1. Ternary operator** — best for either/or
```tsx
return isLoggedIn ? <Dashboard /> : <Login />;
```

**2. && (short-circuit)** — best for show/hide
```tsx
return (
  <div>
    {error && <ErrorMessage message={error} />}
    {isLoading && <Spinner />}
    {data && <DataTable data={data} />}
  </div>
);
```

**Pitfall with &&:** If the left side is `0`, React renders `0` (falsy but not null/undefined). Use `!!` or explicit boolean:
```tsx
// BUG: renders "0" when count is 0
{count && <Badge count={count} />}

// FIX: convert to boolean
{count > 0 && <Badge count={count} />}
{!!count && <Badge count={count} />}
```

**3. if/else with early return**
```tsx
function Component({ user }) {
  if (!user) return null;
  if (user.banned) return <BannedMessage />;
  return <UserProfile user={user} />;
}
```

**4. Immediately invoked function (for complex conditions)**
```tsx
{(() => {
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <Error />;
  return <Data />;
})()}
```

---

## 21. PATTERNS: LIST RENDERING

```tsx
const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
];

function UserList() {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>  {/* key is REQUIRED and must be on outermost element */}
          {user.name} — {user.role}
        </li>
      ))}
    </ul>
  );
}
```

**Rules:**
- `key` must be on the outermost element returned from `.map()`
- Keys must be unique among siblings
- Don't use array index as key if the list can be reordered/filtered
- Keys are not passed as props — the child cannot access `props.key`

**Filtering before rendering:**
```tsx
{users
  .filter(user => user.role === 'admin')
  .map(user => <AdminCard key={user.id} user={user} />)
}
```

---

## 22. PATTERNS: RENDER PROPS & HIGHER-ORDER COMPONENTS

### Render Props

A component that accepts a **function as a prop** that returns JSX. The component calls this function to render.

```tsx
// Component using render prop
function MouseTracker({ render }: { render: (pos: { x: number; y: number }) => React.ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  );
}

// Usage
<MouseTracker render={({ x, y }) => <p>Mouse at {x}, {y}</p>} />
```

**Modern alternative:** Custom hooks have largely replaced render props.

### Higher-Order Components (HOCs)

A **function that takes a component and returns a new enhanced component**.

```tsx
// HOC that adds loading state
function withLoading<P>(WrappedComponent: React.ComponentType<P>) {
  return function WithLoadingComponent({
    isLoading,
    ...props
  }: P & { isLoading: boolean }) {
    if (isLoading) return <Spinner />;
    return <WrappedComponent {...(props as P)} />;
  };
}

// Usage
const UserListWithLoading = withLoading(UserList);
<UserListWithLoading isLoading={loading} users={users} />
```

**`React.memo` is a built-in HOC** — it wraps a component and skips re-render if props haven't changed.

**Modern alternative:** Custom hooks have largely replaced HOCs too.

---

## 23. forwardRef & useImperativeHandle

### forwardRef

Passes a `ref` from a parent to a child's DOM element. By default, React components don't expose their internal DOM nodes.

```tsx
const FancyInput = forwardRef<HTMLInputElement, { placeholder?: string }>(
  (props, ref) => {
    return <input ref={ref} className="fancy" {...props} />;
  }
);

// Parent can now focus the child's input
function Parent() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <FancyInput ref={inputRef} placeholder="Type here" />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  );
}
```

**Why forwardRef "encapsulates the code"** (from slides): The parent doesn't need to know the internal structure of the child — it just gets access to the ref.

### useImperativeHandle

Customizes what the parent can access via the ref. Instead of exposing the full DOM node, expose only specific methods.

```tsx
const CustomInput = forwardRef<{ focus: () => void; clear: () => void }, Props>(
  (props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },
      clear() {
        if (inputRef.current) inputRef.current.value = '';
      },
    }));

    return <input ref={inputRef} {...props} />;
  }
);

// Parent can only call .focus() and .clear(), nothing else
const ref = useRef<{ focus: () => void; clear: () => void }>(null);
ref.current?.focus();
ref.current?.clear();
```

---

## 24. React.memo — Skipping Re-renders

```tsx
const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  console.log('Expensive rendered');
  // ... expensive rendering
  return <div onClick={onClick}>{data.length} items</div>;
});
```

`React.memo` wraps a component and only re-renders it when its **props change** (uses shallow comparison / `Object.is`).

**For it to work, you must also:**
- Wrap function props in `useCallback`
- Wrap object/array props in `useMemo`

Otherwise the child always gets new references even if the data is the same.

---

## 25. LIKELY EXAM QUESTIONS WITH ANSWERS

### Fill-in-blank type (from mock exams and practice exams)

**Q: When you call a state setter, React schedules a ______.**
**A: re-render**

**Q: Passing props through many intermediate components is called ______.**
**A: prop drilling**

**Q: The hook that memoizes a function reference is ______.**
**A: useCallback**

**Q: When siblings need shared state, ______ the state to closest common parent.**
**A: lift**

**Q: useEffect with an empty array [] runs ______.**
**A: once on mount**

**Q: useEffect with no dependency array runs ______.**
**A: after every render**

**Q: Changing a useRef value causes a ______.**
**A: no re-render (does NOT cause a re-render)**

**Q: The hook that follows the pattern (state, action) => newState is ______.**
**A: useReducer**

**Q: To read a value from Context, you use the ______ hook.**
**A: useContext**

---

### Code analysis type

**Q: What is wrong with this component?**
```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }); // no dependency array!
  return <div>{user?.name}</div>;
}
```

**A:** The `useEffect` has NO dependency array. This means it runs after EVERY render. Each time it runs, it calls `setUser(data)`, which triggers a re-render, which runs the effect again → **infinite loop of fetching**.

**Fix:** Add `[userId]` as the dependency array.

---

**Q: What is wrong with this Timer component?**
```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalId = useState(null);
  useEffect(() => {
    intervalId = setInterval(() => {
      setSeconds(seconds + 1); // stale closure!
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  return <div>Time: {seconds}s</div>;
}
```

**A:** Three bugs:
1. `intervalId` should be `useRef(null)`, not `useState(null)` — needs to persist without re-rendering
2. `setSeconds(seconds + 1)` is a stale closure — `seconds` is always 0 because the effect only runs once. Use `setSeconds(prev => prev + 1)`
3. `intervalId = ...` doesn't work with `useState`'s array destructuring

**Correct:**
```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1); // functional updater
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);
  return <div>Time: {seconds}s</div>;
}
```

---

**Q: Explain the stale closure bug in this useCallback:**
```jsx
const handleSave = useCallback(() => {
  saveData(formValues); // formValues from closure
}, []); // empty deps — never updates!
```

**A:** `formValues` is captured from the closure at the time of the first render. When `formValues` changes (user types in form), `handleSave` still holds the OLD value because the dependency array is empty. The fix is to add `formValues` to the dependency array, or restructure to not need it in the closure.

---

**Q: What is the difference between `useCallback` and `useMemo`?**

**A:**
- `useCallback(fn, deps)` caches the **function itself** — use when you need a stable function reference to pass to child components or include in `useEffect` deps
- `useMemo(() => value, deps)` caches the **return value** of the function — use when you have an expensive computation whose result you want to cache
- They are equivalent: `useCallback(fn, deps)` === `useMemo(() => fn, deps)`

---

**Q: When should you use `useRef` instead of `useState`?**

**A:** Use `useRef` when you need to:
- Store a value that **doesn't affect the rendered output** (timer IDs, DOM refs, socket connections, previous values)
- **Directly access a DOM element** (to focus, measure dimensions, etc.)

Use `useState` when the value needs to:
- Appear in the JSX (trigger a re-render when changed)
- Affect what gets rendered

---

**Q: What are the Rules of Hooks?**

**A:**
1. **Only call hooks at the top level** — never inside loops, conditions, or nested functions
2. **Only call hooks from React functions** — from function components or custom hooks, not regular JS functions

The reason for Rule 1: React relies on the order of hook calls to map state to the right hook. If the order changes (due to a condition), the mapping breaks.

---

**Q: What is a controlled component and what is an uncontrolled component?**

**A:**
- **Controlled:** React state controls the input value. The value is set via `value={state}` and updated via `onChange`. Every keystroke re-renders the component. Good for real-time validation.
- **Uncontrolled:** The DOM controls the input value. React reads it via a `ref` only when needed (e.g., on submit). No re-renders on each keystroke. Good for simple forms.

---

**Q: What triggers a re-render in React?**

**A:** A component re-renders when:
1. Its own **state changes** (via useState setter or useReducer dispatch)
2. Its **parent re-renders** (which may pass new props)
3. A **context value it uses changes** (via useContext)

Things that do NOT trigger re-renders: changing `useRef.current`, changing regular variables.

---

**Q: Why do we use keys in lists?**

**A:** Keys help React identify which items in a list have changed, been added, or removed during reconciliation. Without keys, React can't tell which component corresponds to which list item, so it may incorrectly reuse/destroy components. Keys must be unique among siblings and stable (not change between renders).

---

### Conceptual questions

**Q: What is prop drilling and how do you solve it?**

**A:** Prop drilling is when you pass props through many intermediate components that don't need them, just to get the data to a deeply nested child. It makes code hard to maintain. Solutions:
- **Context API** — for infrequently changing data (theme, auth, locale)
- **Redux/Zustand** — for complex or frequently changing global state

---

**Q: What is the Context API best used for? What are its limitations?**

**A:** Best for: theme, authentication, locale/language — data that changes infrequently and needs to be accessible throughout the component tree without prop drilling.

Limitations: Re-renders ALL consumers when the context value changes, even if they only use part of it. This makes it unsuitable for high-frequency updates (e.g., a progress bar updating every second, real-time data).

---

**Q: Explain lifting state up with an example.**

**A:** When two sibling components need access to the same state, you move (lift) that state to their closest common parent. The parent holds the state and passes it down via props along with a callback to update it. This maintains unidirectional data flow.

---

**Q: What is the Virtual DOM and what is reconciliation?**

**A:** The Virtual DOM is React's in-memory representation of the real DOM. When state/props change, React creates a new Virtual DOM tree and compares it to the previous one (reconciliation/diffing). React calculates the minimum set of changes needed and updates only those parts of the real DOM. This is more efficient than blindly re-rendering the entire page.

---

## 26. QUICK-REFERENCE CHEAT SHEET

### Hooks at a glance

| Hook | Purpose | Returns | Re-render? |
|------|---------|---------|------------|
| `useState(init)` | Local state | `[value, setter]` | YES when setter called |
| `useEffect(fn, deps)` | Side effects | void | NO |
| `useRef(init)` | Mutable ref, DOM access | `{ current: value }` | NO |
| `useContext(Ctx)` | Read context | context value | YES when context changes |
| `useReducer(fn, init)` | Complex state | `[state, dispatch]` | YES when dispatch called |
| `useCallback(fn, deps)` | Memoize function | memoized function | NO |
| `useMemo(fn, deps)` | Memoize value | memoized value | NO |

### useEffect dependency array

| Form | Runs |
|------|------|
| `useEffect(fn)` — no array | After **every** render |
| `useEffect(fn, [])` — empty | **Once** on mount |
| `useEffect(fn, [a, b])` — with deps | On mount + when `a` or `b` changes |
| Return function | Cleanup: before next run + on unmount |

### Re-render triggers

| Trigger | Re-render? |
|---------|-----------|
| `setState(newValue)` | YES |
| `dispatch(action)` (useReducer) | YES |
| Context value changes | YES (for all consumers) |
| `ref.current = x` | NO |
| Parent re-renders | YES (child re-renders too) |
| Same state value (Object.is) | NO |

### Controlled vs Uncontrolled

| | Controlled | Uncontrolled |
|---|------------|-------------|
| Source of truth | React state | DOM |
| `value` prop | Required | Use `defaultValue` |
| Updates via | `onChange` → `setState` | DOM directly |
| Access value | State variable | `ref.current.value` |
| Re-renders on input | Yes | No |

### Key prop rules

| Rule | |
|------|-|
| Must be unique among siblings | YES |
| Must be stable (not change on re-render) | YES |
| Use index as key | ONLY if list never reorders/filters |
| Is passed to child as prop | NO — children cannot access `props.key` |

### Component principles (from slides — fill-in-blank target)

Single Responsibility · Reusable · Composable · Declarative

### State management comparison

| Feature | Context API | Redux Toolkit | Zustand |
|---------|-------------|---------------|---------|
| Boilerplate | Low | Medium | Very Low |
| High-frequency updates | Poor | Good | Good |
| Re-renders | All consumers | Selective (useSelector) | Selective (selector) |
| Provider needed | YES | YES | NO |
| Devtools | None | Excellent | Basic |
| Outside React | No | Yes (store) | Yes |

### Common mistakes cheat sheet

| Mistake | Fix |
|---------|-----|
| `setSeconds(seconds + 1)` in setInterval | `setSeconds(prev => prev + 1)` |
| `useEffect` with no deps on data fetch | Add `[id]` dependency |
| `useState(null)` for timer ID | `useRef(null)` for timer ID |
| Mutating state directly: `state.name = x` | `setState({ ...state, name: x })` |
| Using index as key in reorderable list | Use unique `id` from data |
| Calling hooks inside `if` or loop | Always at top level |
| No cleanup for interval/listener | Return cleanup function from `useEffect` |
| Passing new object/array to memoized child | Wrap in `useMemo` |
| Passing new function to memoized child | Wrap in `useCallback` |

---

*All definitions, examples, and exam question formats sourced from course slides, the glossary files, and practice exams 1–7.*
