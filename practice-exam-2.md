# Practice Exam 2: React, State Management, Next.js & Forms

---

## SECTION A: REACT CORE

### Question 1 — Fill in the blanks
Complete the following sentences about React:

A React component is a reusable piece of 1. \_\_\_\_\_\_\_\_ that can accept inputs called 2. \_\_\_\_\_\_\_\_ and manage internal data called 3. \_\_\_\_\_\_\_\_. When state changes, React schedules a 4. \_\_\_\_\_\_\_\_ of the component. The virtual 5. \_\_\_\_\_\_\_\_ is React's in-memory representation of the actual browser DOM, used for efficient diffing.

---

### Question 2 — Multiple Choice
Which of the following correctly describes when a `useEffect` with a dependency array of `[userId]` will run?

- A) Only once, when the component first mounts
- B) After every render, regardless of what changed
- C) On mount, and then again whenever `userId` changes
- D) Only when `userId` is explicitly set to a new value by the user

---

### Question 3 — Select All That Apply
Which of the following are correct use cases for `useRef` in React?

- [ ] Storing a reference to a DOM element to measure its dimensions
- [ ] Triggering a re-render when its value changes
- [ ] Keeping track of a previous state value between renders
- [ ] Replacing useState for form input values to improve performance
- [ ] Storing a WebSocket connection instance that should persist across renders
- [ ] Storing a timer ID from setInterval so it can be cleared on unmount

---

### Question 4 — Multiple Choice
What problem does the Context API solve?

- A) It replaces Redux entirely for all state management needs
- B) It eliminates the problem of prop drilling by allowing components to access shared data without passing props through every level
- C) It provides automatic state persistence to localStorage
- D) It optimizes high-frequency state updates like animations

---

### Question 5 — Fill in the blanks
Complete the following sentences about React hooks:

The 1. \_\_\_\_\_\_\_\_ hook memoizes a function reference so it is not recreated on every render. The 2. \_\_\_\_\_\_\_\_ hook memoizes a computed value to avoid expensive recalculations. The 3. \_\_\_\_\_\_\_\_ hook is an alternative to useState for complex state logic, following the pattern `(state, action) => newState`. To read a value from Context, you use the 4. \_\_\_\_\_\_\_\_ hook.

---

### Question 6 — Written Answer (4 pts)
A junior developer writes the following component:

```jsx
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`/api/users/${userId}`)
            .then(res => res.json())
            .then(data => setUser(data));
    });

    return <div>{user?.name}</div>;
}
```

a) Identify the performance problem with this code and explain why it occurs. (2 pts)

b) How would you fix it? Show the corrected code and explain why your fix works. (2 pts)

---

### Question 7 — Code Analysis (4 pts)
What is wrong with this component? Explain the issue and provide the correct implementation.

```jsx
function Timer() {
    const [seconds, setSeconds] = useState(0);
    const intervalId = useState(null);

    useEffect(() => {
        intervalId = setInterval(() => {
            setSeconds(seconds + 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return <div>Time: {seconds}s</div>;
}
```

---

## SECTION B: STATE MANAGEMENT

### Question 8 — Multiple Choice
Which pattern does Redux follow for state updates?

- A) Two-way data binding between components and store
- B) Unidirectional data flow: Action → Dispatch → Reducer → Store → View
- C) Observer pattern where components subscribe directly to individual state properties
- D) Event sourcing with automatic state snapshots

---

### Question 9 — Select All That Apply
Which of the following statements about global state management are true?

- [ ] Zustand requires wrapping your app in a Provider component
- [ ] Redux Toolkit's `createSlice` automatically generates action creators
- [ ] Context API re-renders all consumers when the context value changes, even if they only use part of it
- [ ] Zustand stores can be accessed from outside React components
- [ ] Redux requires all components to be class-based
- [ ] Context API is well-optimized for high-frequency updates like animations

---

### Question 10 — Written Answer (6 pts)
Describe the following Redux concepts. For each, explain what it does and how it fits within the Redux/Flux pattern:

a) **Store** (1.5 pts)
b) **Actions** (1.5 pts)
c) **Reducers** (1.5 pts)
d) **Dispatch** (1.5 pts)

---

### Question 11 — Written Answer (8 pts)
You are building a **music player** for a Next.js application. The player state must:

- Be accessible from any page (playlist, album page, now-playing bar)
- Track currently playing song, queue, volume, and play/pause status
- Update frequently (progress bar updates every second)
- Persist the queue when navigating between pages

a) Compare **Context API**, **Zustand**, and **Redux Toolkit** as options for managing the player state. For each, describe one advantage and one disadvantage for this specific use case. (4 pts)

b) Choose the most appropriate approach for this use case and justify your choice. Sketch out the state shape and how a component would read the current song and toggle play/pause. (4 pts)

---

## SECTION C: NEXT.JS APP ROUTER

### Question 12 — Multiple Choice
Which of the following correctly describes Server Components in Next.js App Router?

- A) They can use useState and useEffect for interactivity
- B) They run on the server and can directly access databases and environment variables without sending JavaScript to the client
- C) They must be placed in a special `/server` directory
- D) They are identical to Client Components but rendered on a different thread

---

### Question 13 — Select All That Apply
Which of the following are true about Server Components?

- [ ] They can directly `await fetch()` without useEffect
- [ ] They can use `onClick` event handlers
- [ ] They reduce the amount of JavaScript sent to the browser
- [ ] They can import and render Client Components as children
- [ ] They can use useState to manage local state
- [ ] They can read environment variables and access the file system

---

### Question 14 — Fill in the blanks
Complete the following sentences about Next.js App Router:

To mark a component as a Client Component, you add the directive 1. \_\_\_\_\_\_\_\_ at the top of the file. A Server Action is an async function marked with 2. \_\_\_\_\_\_\_\_. The file 3. \_\_\_\_\_\_\_\_ defines shared UI that wraps child pages and persists across navigation. Dynamic routes use folder names with 4. \_\_\_\_\_\_\_\_ brackets, like `[id]`.

---

### Question 15 — Multiple Choice
When should you use an API Route instead of a Server Action in Next.js?

- A) When submitting a form from a Client Component
- B) When mutating data after a button click in a Server Component
- C) When handling a webhook from an external service like Stripe
- D) When revalidating cached data after a form submission

---

### Question 16 — Select All That Apply
Which of the following are situations where you should use an API Route instead of a Server Action?

- [ ] A Stripe webhook needs to notify your app about a payment
- [ ] A mobile app needs to fetch user data from your backend
- [ ] A Client Component submits a form to create a new blog post
- [ ] You're building a public REST API for third-party developers
- [ ] A user clicks a "like" button that needs to update the database
- [ ] An external monitoring service needs to check your app's health

---

### Question 17 — Written Answer (8 pts)
You are building a **contact form** in a Next.js App Router application. The form has fields for name, email, subject, and message. Requirements:

- Validate inputs on the client side using react-hook-form
- Email must be a valid email format
- Message must be at least 20 characters
- Submit data securely to the server
- Display validation errors inline below each field

a) Describe how you would implement the form using react-hook-form. What hooks and methods would you use, and how would you display validation errors? (3 pts)

b) Would you use a Server Action or an API Route to handle the submission? Justify your choice and describe the data flow from submit to save. (3 pts)

c) Why is server-side validation still necessary even though you validate on the client? Give a concrete example of what could go wrong. (2 pts)

---

## SECTION D: FORMS (react-hook-form)

### Question 18 — Fill in the blanks
Complete the following sentences about react-hook-form:

The core hook to initialize a form is 1. \_\_\_\_\_\_\_\_. To connect an input to the form, you spread the result of calling 2. \_\_\_\_\_\_\_\_ onto the input element. To validate as the user types, you set the mode to 3. \_\_\_\_\_\_\_\_. Validation errors for a field named `password` are accessed via 4. \_\_\_\_\_\_\_\_. To integrate Zod validation, you pass it via the 5. \_\_\_\_\_\_\_\_ option.

---

### Question 19 — Select All That Apply
Which of the following are valid built-in validation rules for `register()` in react-hook-form?

- [ ] required
- [ ] minLength
- [ ] type
- [ ] pattern
- [ ] sanitize
- [ ] validate
- [ ] maxLength
- [ ] format

---

### Question 20 — Multiple Choice
What is the primary advantage of react-hook-form over managing form state with useState?

- A) It automatically sends form data to a REST API
- B) It reduces unnecessary re-renders by using uncontrolled inputs
- C) It only works with Server Components for better security
- D) It eliminates the need for any validation logic

---

---

# ANSWER KEY

## Section A

**Q1:** 1. `UI` (user interface) 2. `props` 3. `state` 4. `re-render` 5. `DOM`

**Q2:** C — On mount, and whenever `userId` changes

**Q3:** Correct:
- [x] Storing a reference to a DOM element to measure its dimensions
- [ ] Triggering a re-render — **FALSE** (useRef changes do NOT trigger re-renders)
- [x] Keeping track of a previous state value between renders
- [ ] Replacing useState for form inputs — **FALSE** (not a replacement for state management)
- [x] Storing a WebSocket connection instance that should persist across renders
- [x] Storing a timer ID from setInterval so it can be cleared on unmount

**Q4:** B — Eliminates prop drilling

**Q5:** 1. `useCallback` 2. `useMemo` 3. `useReducer` 4. `useContext`

**Q6:**
a) **Performance problem**: The useEffect has NO dependency array, which means it runs after EVERY render. Each time it runs, it calls `setUser(data)`, which triggers a re-render, which runs the effect again → infinite loop of fetching.

b) Fix: Add `[userId]` as the dependency array:
```jsx
useEffect(() => {
    fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => setUser(data));
}, [userId]); // ← Only re-fetch when userId changes
```
This runs once on mount and only re-runs when `userId` actually changes.

**Q7:** Multiple issues:
1. `intervalId` uses `useState(null)` but is used as a variable — should be `useRef(null)` since we need a mutable value that persists without causing re-renders.
2. `setSeconds(seconds + 1)` uses stale closure — `seconds` is captured from initial render (always 0). Should use functional update: `setSeconds(prev => prev + 1)`.
3. Direct assignment `intervalId = ...` won't work with useState's array return.

Correct:
```jsx
function Timer() {
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSeconds(prev => prev + 1); // functional update
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, []);

    return <div>Time: {seconds}s</div>;
}
```

## Section B

**Q8:** B — Unidirectional data flow: Action → Dispatch → Reducer → Store → View

**Q9:** Correct:
- [ ] Zustand requires Provider — **FALSE** (Zustand does NOT need a Provider)
- [x] RTK's createSlice auto-generates action creators
- [x] Context API re-renders all consumers when value changes
- [x] Zustand stores can be accessed outside React
- [ ] Redux requires class-based components — **FALSE** (works with hooks: useSelector, useDispatch)
- [ ] Context API optimized for high-frequency updates — **FALSE** (causes unnecessary re-renders)

**Q10:** Model answer:
a) **Store**: The single source of truth for the entire application state. It holds the state tree and provides methods to access it (`getState`), update it (`dispatch`), and subscribe to changes. There is only ONE store in a Redux application.

b) **Actions**: Plain JavaScript objects that describe WHAT happened. They have a required `type` property (string) and an optional `payload`. Example: `{ type: 'cart/addItem', payload: { id: 1, name: 'Book' } }`. Actions are the ONLY way to trigger state changes.

c) **Reducers**: Pure functions that take the current state and an action, and return a NEW state: `(state, action) => newState`. They determine HOW the state changes in response to actions. Must be pure — no side effects, no mutations, same input = same output.

d) **Dispatch**: The method used to send actions to the store. `dispatch(action)` triggers the reducer, which computes the new state. Components call `dispatch` to initiate state updates. It's the bridge between the component (View) and the reducer.

**Q11:** Model answer:
a) Comparison:
- **Context API**: Advantage — built into React, no dependencies. Disadvantage — re-renders all consumers on every update, which is terrible for a progress bar updating every second.
- **Zustand**: Advantage — simple API, selector-based re-renders (only components using specific state re-render), built-in persist middleware for queue. Disadvantage — less ecosystem/devtools than Redux.
- **Redux Toolkit**: Advantage — powerful devtools for debugging complex state, middleware for side effects. Disadvantage — more boilerplate setup compared to Zustand for this use case.

b) **Zustand** is best because:
- High-frequency updates (progress bar) need selective re-renders — Zustand's selector pattern avoids re-rendering every consumer
- Simple API means less boilerplate for the player state
- Persist middleware handles queue persistence automatically

```typescript
// State shape
interface PlayerStore {
    currentSong: Song | null;
    queue: Song[];
    volume: number;
    isPlaying: boolean;
    progress: number;
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    setQueue: (songs: Song[]) => void;
}

// Store creation
const usePlayerStore = create<PlayerStore>()(
    persist(
        (set) => ({
            currentSong: null,
            queue: [],
            volume: 80,
            isPlaying: false,
            progress: 0,
            togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
            play: () => set({ isPlaying: true }),
            pause: () => set({ isPlaying: false }),
            setQueue: (songs) => set({ queue: songs }),
        }),
        { name: 'player-storage' }
    )
);

// Component usage
function NowPlayingBar() {
    const currentSong = usePlayerStore((s) => s.currentSong);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const togglePlay = usePlayerStore((s) => s.togglePlay);

    return (
        <div>
            <span>{currentSong?.title}</span>
            <button onClick={togglePlay}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>
    );
}
```

## Section C

**Q12:** B — Runs on server, can access databases and env vars, no JS sent to client

**Q13:** Correct:
- [x] Can directly `await fetch()` without useEffect
- [ ] Can use `onClick` handlers — **FALSE** (Server Components cannot handle interactivity)
- [x] Reduce JavaScript sent to browser
- [x] Can import and render Client Components as children
- [ ] Can use useState — **FALSE** (no hooks in Server Components)
- [x] Can read environment variables and access the file system

**Q14:** 1. `"use client"` 2. `"use server"` 3. `layout.tsx` (or `layout.js`) 4. `square` (i.e., `[brackets]`)

**Q15:** C — Handling a webhook from an external service like Stripe

**Q16:** Correct:
- [x] Stripe webhook notification
- [x] Mobile app fetching user data
- [ ] Client Component form submission — **better as Server Action**
- [x] Public REST API for third-party developers
- [ ] Like button database update — **better as Server Action**
- [x] External monitoring service health check

**Q17:** Model answer:
a) Implementation with react-hook-form:
- Use `useForm()` to initialize with `mode: "onBlur"` or `"onChange"` for real-time validation
- Use `register("fieldName", { rules })` to connect each input with validation rules
- Use `handleSubmit(onValid)` on the form's `onSubmit`
- Display errors: `{errors.email && <span>{errors.email.message}</span>}`
```jsx
const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });

<input {...register("email", {
    required: "Email is required",
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
})} />
{errors.email && <p>{errors.email.message}</p>}

<textarea {...register("message", {
    required: "Message required",
    minLength: { value: 20, message: "At least 20 characters" }
})} />
```

b) **Server Action** — because this is a simple form submission from a React component. No external consumers need this endpoint. Data flow: user fills form → client validation with react-hook-form → if valid, `handleSubmit` calls the Server Action → Server Action validates again on server → saves to database → returns success/error to the client.

c) Server-side validation is necessary because client validation can be bypassed. A user could disable JavaScript, use browser DevTools to remove validation attributes, or use tools like Postman/curl to send a POST request directly to the server with invalid data (e.g., empty name, fake email, SQL injection in the message field). Without server validation, this malicious data would be saved to the database.

## Section D

**Q18:** 1. `useForm` 2. `register` 3. `"onChange"` 4. `errors.password` 5. `resolver`

**Q19:** Correct: `required`, `minLength`, `pattern`, `validate`, `maxLength`
- `type` — NOT a validation rule
- `sanitize` — NOT a validation rule
- `format` — NOT a validation rule

**Q20:** B — Reduces unnecessary re-renders by using uncontrolled inputs
