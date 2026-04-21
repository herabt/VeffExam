# Practice Exam 5 -- useCallback, useMemo, Forms & Refs

**Topics**: useCallback, useMemo, Forms, Events, Refs, forwardRef, useImperativeHandle

---

## Section A: useCallback (Slides 430-455)

### Question 1
What is the definition of `useCallback` according to the slides?

### Question 2
What are the two arguments that `useCallback` takes? Describe each one.

### Question 3
What does `useCallback` return on the initial render vs. on subsequent re-renders?

### Question 4
Look at the following code from the slides (Page/Checkout/Shipping example). Why does wrapping `handleShippingChange` in `useCallback` help performance?

```tsx
function Page() {
  const [count, setCount] = useState(0);

  const handleShippingChange = useCallback((option: string) => {
    console.log('Shipping changed to:', option);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Checkout />
      <Shipping onShippingChange={handleShippingChange} />
    </div>
  );
}
```

### Question 5
The slides describe a "betri leid" (better way) for updating state from a memoized callback. What is the functional updater pattern, and why is it the better approach?

Explain the difference between these two approaches:

```tsx
// Approach A
const handleAddTodo = useCallback((text: string) => {
  setTodos([...todos, { id: nextId++, text }]);
}, [todos]);

// Approach B - "betri leid"
const handleAddTodo = useCallback((text: string) => {
  setTodos(prev => [...prev, { id: nextId++, text }]);
}, []);
```

### Question 6
The slides show an example of preventing `useEffect` from firing too often using `useCallback`. Explain how wrapping `buildQueryParams` in `useCallback` solves the problem.

```tsx
function SearchPage({ query, filters }: Props) {
  const buildQueryParams = useCallback(() => {
    return new URLSearchParams({
      q: query,
      ...filters,
    }).toString();
  }, [query, filters]);

  useEffect(() => {
    const params = buildQueryParams();
    fetch(`/api/search?${params}`);
  }, [buildQueryParams]);
}
```

### Question 7
According to the slides, when should you wrap functions in `useCallback` when building custom hooks? Why?

---

## Section B: useMemo (Slides 455-480)

### Question 8
What is the definition of `useMemo` according to the slides? What is this type of caching called?

### Question 9
According to the slides, what does React do with the body of your component by default every time it re-renders?

### Question 10
Look at the following ProductDashboard example from the slides. Why is `useMemo` used here, and what problem does it solve?

```tsx
function ProductDashboard({ products, category }: Props) {
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.category === category);
  }, [products, category]);

  const stats = useMemo(() => {
    return {
      total: filteredProducts.length,
      avgPrice: filteredProducts.reduce((sum, p) => sum + p.price, 0)
        / filteredProducts.length,
    };
  }, [filteredProducts]);

  return (
    <div>
      <h2>Stats: {stats.total} products, avg ${stats.avgPrice.toFixed(2)}</h2>
      {filteredProducts.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
```

### Question 11
What is the difference between `useMemo` and `useCallback`? When would you use one over the other?

### Question 12
Can `useMemo` be used to skip re-rendering of components? If so, how does it compare to wrapping a component in `React.memo`?

---

## Section C: Forms, Events & Refs (Slides 620-640)

### Question 13
According to the slides, why are forms described as "one of the most crucial parts of our applications"?

### Question 14
What is a SyntheticEvent in React? List at least four event handlers mentioned in the slides.

### Question 15
What is the definition of `useRef` from the slides? How does it differ from `useState` when it comes to re-renders?

### Question 16
Compare the two approaches to reading text input values from the slides:

**Approach A -- Using a ref:**
```tsx
function Form() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value;
    console.log('Submitted:', value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} type="text" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Approach B -- Controlled input:**
```tsx
function Form() {
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Submitted:', value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

When should you use each approach?

### Question 17
According to the slides, what does `forwardRef` do? Why is it described as something that "encapsulates the code"?

### Question 18
What does `useImperativeHandle` do according to the slides? Give an example of when you would use it.

### Question 19
According to the slides, when should you use refs? Complete the quote: "if your component needs to store some value, but it doesn't impact the ____________"

### Question 20
Look at this TodoList code. Identify where `useRef`, controlled inputs, and event handling are used. What would happen if you replaced the `useRef` with `useState` for the input?

```tsx
function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd() {
    const text = inputRef.current?.value.trim();
    if (text) {
      setTodos(prev => [...prev, text]);
      inputRef.current!.value = '';
      inputRef.current!.focus();
    }
  }

  return (
    <div>
      <input ref={inputRef} placeholder="New todo" />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {todos.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
```

---

# ANSWER KEY

---

## Section A: useCallback

### Answer 1
**(Slide ~430)**
`useCallback` is "a React Hook that lets you cache a function definition between re-renders."

### Answer 2
**(Slide ~432)**
`useCallback` takes two arguments:
1. **fn** -- the function you want to cache. React will return (not call) this function back to you.
2. **dependencies** -- the list of all reactive values referenced inside of the `fn` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body.

### Answer 3
**(Slide ~433)**
- On the **initial render**, `useCallback` returns the `fn` function you passed.
- On **subsequent renders**, it will either return an already stored `fn` function from the last render (if the dependencies haven't changed), or return the `fn` function you have passed during this render (if dependencies have changed).

### Answer 4
**(Slide ~435-438)**
Without `useCallback`, every time `Page` re-renders (e.g., when `count` changes), a new `handleShippingChange` function object is created. Even though the function logic is identical, React sees it as a different reference. If `Shipping` is wrapped in `React.memo`, it would still re-render because its `onShippingChange` prop changed reference.

By wrapping it in `useCallback` with `[]` dependencies, the function reference stays the same across re-renders, so `Shipping` (when wrapped in `React.memo`) can skip re-rendering because its props haven't changed. This is called "skipping re-renders of child components."

### Answer 5
**(Slide ~440-442)**
The functional updater pattern (Approach B / "betri leid") is better because:

- **Approach A** depends on the current `todos` state, so `todos` must be in the dependency array. Every time `todos` changes, a new function is created, defeating the purpose of `useCallback`.
- **Approach B** uses the functional updater `prev => [...]` which receives the previous state as an argument. This means the callback does not need to reference `todos` at all, so the dependency array can be empty `[]`. The function reference stays the same across all re-renders.

The "betri leid" removes the need for state variables in the dependency array by reading state through the updater function argument instead.

### Answer 6
**(Slide ~445-448)**
Without `useCallback`, `buildQueryParams` is recreated on every render. Since it is in the `useEffect` dependency array, the effect runs on every render -- even when `query` and `filters` haven't changed.

By wrapping `buildQueryParams` in `useCallback` with `[query, filters]` as dependencies, the function reference only changes when `query` or `filters` actually change. This means the `useEffect` only fires when the search parameters truly change, preventing unnecessary API calls.

### Answer 7
**(Slide ~450-452)**
When building custom hooks, you should wrap any returned functions in `useCallback`. This is because you don't know how the consumer of your hook will use the function -- they might pass it as a prop to a memoized component or include it in a `useEffect` dependency array. Wrapping it in `useCallback` ensures that consumers don't get unnecessary re-renders or effect re-runs. This is part of "optimizing custom hooks."

---

## Section B: useMemo

### Answer 8
**(Slide ~455-458)**
`useMemo` is "a React Hook that lets you cache the result of a calculation between re-renders." This type of caching is called "memoisation."

### Answer 9
**(Slide ~460)**
"By default React will re-run the entire body of your component every time it re-renders." This means all calculations, filtering, mapping, and other operations inside the component body run again on every render, even if their inputs haven't changed.

### Answer 10
**(Slide ~462-466)**
`useMemo` is used here to skip expensive recalculations:

1. `filteredProducts` uses `useMemo` with `[products, category]` -- the filtering only re-runs when the products array or category changes. If the parent re-renders for other reasons (e.g., unrelated state change), the expensive `.filter()` operation is skipped and the cached result is returned.

2. `stats` uses `useMemo` with `[filteredProducts]` -- the statistics calculation (total count, average price with `.reduce()`) only re-runs when `filteredProducts` changes.

Without `useMemo`, both the filtering and the statistics calculation would run on every single re-render, which is wasteful when `products` and `category` haven't changed.

### Answer 11
**(Slides ~455, ~430)**
- `useMemo` caches **the result of a calculation** (a value).
- `useCallback` caches **a function definition** (a function reference).

`useCallback(fn, deps)` is essentially equivalent to `useMemo(() => fn, deps)`.

Use `useMemo` when you have an expensive computation whose result you want to cache. Use `useCallback` when you want to cache a function reference to prevent unnecessary re-renders of child components or unnecessary effect re-runs.

### Answer 12
**(Slide ~468-470)**
Yes, `useMemo` can be used to skip re-rendering of components. You can wrap JSX in `useMemo` to memoize the rendered output. However, the more common approach is to wrap the child component in `React.memo` and use `useCallback` for function props and `useMemo` for object/array props. Both achieve the same goal of preventing unnecessary re-renders when props haven't changed.

---

## Section C: Forms, Events & Refs

### Answer 13
**(Slide ~620)**
Forms are described as "one of the most crucial parts of our applications" because they are the primary way users interact with and send data to the application -- login forms, registration, search, creating/editing content, etc. Nearly every web application relies on forms for data input.

### Answer 14
**(Slide ~622-624)**
A SyntheticEvent is React's abstraction of the native DOM event object. It wraps the browser's native event to provide a consistent API across all browsers.

Event handlers from the slides include:
- `onClick` -- fires when an element is clicked
- `onContextMenu` -- fires on right-click
- `onMouseMove` -- fires when the mouse moves over an element
- `onSubmit` -- fires when a form is submitted
- `onChange` -- fires when the value of an input changes

### Answer 15
**(Slide ~628-630)**
`useRef` according to the slides: "Changes made to the reference will not trigger a re-render and the reference can be mutated."

Key difference from `useState`:
- `useState` -- changing the value triggers a re-render, the value is immutable (you replace it via the setter function).
- `useRef` -- changing `.current` does **not** trigger a re-render, and the reference can be directly mutated.

### Answer 16
**(Slide ~630-634)**
**Approach A (ref / uncontrolled input)**:
- The DOM owns the input value. React reads it only when needed (e.g., on submit).
- No re-render happens as the user types.
- Best for: simple forms where you only need the value on submit, or when integrating with non-React code.

**Approach B (controlled input)**:
- React state owns the input value via `value` and `onChange`.
- Every keystroke triggers a re-render because `setValue` is called.
- Best for: when you need to validate, transform, or react to input changes in real time (e.g., showing character count, live search, conditional rendering based on input).

The slides show that refs are the simpler approach when you just need to "grab" a value, while controlled inputs give you full control over the input at the cost of more re-renders.

### Answer 17
**(Slide ~635-636)**
`forwardRef` "encapsulates the code" for passing refs from a parent component to a child component's DOM element. By default, React components do not expose their internal DOM nodes. `forwardRef` wraps a component so that the parent can pass a `ref` that gets attached to a specific DOM element inside the child.

Example:
```tsx
const FancyInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} className="fancy" {...props} />;
});

// Parent can now do:
const inputRef = useRef<HTMLInputElement>(null);
<FancyInput ref={inputRef} />
```

This encapsulation means the parent doesn't need to know the internal structure of the child -- it just gets access to the ref.

### Answer 18
**(Slide ~637-638)**
`useImperativeHandle` lets you "customize the handle exposed as a ref." Instead of exposing the full DOM node, you can expose a custom object with only specific methods.

Example use case: You have a custom input component and want the parent to only be able to call `.focus()` and `.scrollIntoView()`, but not access any other DOM properties:

```tsx
const CustomInput = forwardRef<{ focus: () => void }, Props>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
  }));

  return <input ref={inputRef} {...props} />;
});
```

This gives you control over what the parent component can do with the ref.

### Answer 19
**(Slide ~629)**
Complete quote: "if your component needs to store some value, but it doesn't impact the **rendering logic**"

Examples include: storing timer IDs, DOM element references, or other values that are needed for side effects but should not cause a re-render when they change.

### Answer 20
**(Slide ~632-634)**
In this TodoList code:

- **`useRef`**: `inputRef` is used to create an uncontrolled input. The DOM manages the input value. We read `inputRef.current?.value` on button click and clear it with `inputRef.current!.value = ''`. We also call `inputRef.current!.focus()` to refocus after adding.
- **`useState`** (controlled state): `todos` is managed as React state because it directly affects rendering (the list of `<li>` elements).
- **Event handling**: `handleAdd` is an event handler attached via `onClick` on the button.

If you replaced `useRef` with `useState` for the input:
- Every keystroke would trigger a re-render (because `setValue` calls cause re-renders).
- The input would become a "controlled" input requiring `value={inputValue}` and `onChange={(e) => setInputValue(e.target.value)}`.
- The component would re-render more frequently, but you would gain real-time access to the input value for features like validation or live filtering.
- The current approach with `useRef` is simpler and avoids unnecessary re-renders since the input value doesn't affect the rendered output until the user clicks "Add."
