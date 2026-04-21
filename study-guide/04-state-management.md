# State Management — Complete Study Guide
**Web Programming II Final Exam | Target: 100%**

---

## Table of Contents

1. [Context API](#1-context-api)
2. [Redux — Core Principles](#2-redux--core-principles)
3. [Redux Toolkit (RTK)](#3-redux-toolkit-rtk)
4. [Zustand](#4-zustand)
5. [Comparison Table: Context vs Redux vs Zustand](#5-comparison-table)
6. [When to Use Which — Decision Guide](#6-when-to-use-which--decision-guide)
7. [Likely Exam Questions with Answers](#7-likely-exam-questions-with-answers)
8. [Quick-Reference Cheat Sheet](#8-quick-reference-cheat-sheet)

---

## 1. Context API

### What it is

React's built-in solution for passing data through the component tree without prop drilling. No extra library needed.

### The Three Core APIs

| API | Purpose |
|-----|---------|
| `createContext(defaultValue)` | Creates a Context object. The `defaultValue` is only used when a component does NOT have a matching Provider above it. |
| `Context.Provider` | Wraps a subtree. All descendants can read the context value. When the `value` prop changes, all consumers re-render. |
| `useContext(Context)` | Hook that reads the current context value. Subscribes the component to context changes. |

### Full Code Example — Theme Context

```tsx
// 1. Create the context
import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// createContext needs a default value (used when no Provider is present)
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

// 2. Create a Provider component (best practice: wrap in its own component)
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Consume the context anywhere in the subtree
export function ThemeButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}

// 4. Wrap your app (e.g. in layout.tsx or _app.tsx)
export default function App() {
  return (
    <ThemeProvider>
      <ThemeButton />
    </ThemeProvider>
  );
}
```

### Auth Context Example (common exam pattern)

```tsx
interface User { id: string; name: string; email: string; }

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: (u) => setUser(u),
        logout: () => setUser(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook (best practice — avoids checking for null everywhere)
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
```

### When to Use Context API

- **Theming** (light/dark mode)
- **Authenticated user** (current logged-in user)
- **Locale/language** preferences
- **Small to medium apps** where the re-render issue is negligible
- **When there are bundle size restrictions** (0KB — built into React)
- Data that is **truly global and changes infrequently**

### Performance Pitfalls (CRITICAL — often tested)

**The core problem:** When a Context value changes, **ALL components** consuming that context re-render, even if they only use a part of the value that didn't change. There are no built-in selectors.

```tsx
// BAD: One context for everything → every consumer re-renders on any change
const AppContext = createContext({ user, theme, cart, language });

// BETTER: Split into separate contexts by update frequency
// AuthContext: changes rarely (login/logout)
// ThemeContext: changes on user toggle
// CartContext: changes frequently
```

**"Context Hell" (Provider Hell):** Splitting contexts to fix re-renders leads to deeply nested providers:

```tsx
// This is "Context Hell" — what the slides explicitly warn against
function App() {
  return (
    <AuthContext.Provider>
      <ThemeContext.Provider>
        <CartContext.Provider>
          <LanguageContext.Provider>
            <MyApp />
          </LanguageContext.Provider>
        </CartContext.Provider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
```

**Four Debugging Limitations of Context API (from slides):**
1. State changes have no structure — no enforced pattern for how updates happen
2. No action logs — nothing tells you what triggered a state change
3. No time-travel debugging — can't step backwards through state history
4. Limited to basic React DevTools

### Pros and Cons Summary

| Pros | Cons |
|------|------|
| Built into React — 0KB | Re-renders entire subtree on any change |
| Simple API (3 functions) | No built-in selectors |
| Low learning curve | No devtools beyond React DevTools |
| Good for low-frequency data | "Context Hell" when splitting |

---

## 2. Redux — Core Principles

### The Three Principles of Redux

These are the foundational rules. Know them cold.

**1. Single Source of Truth**
The entire application state is stored in a single object tree inside one store. There is only ONE store in a Redux application.

**2. State is Read-Only**
The only way to change state is to dispatch an action — a plain object describing what happened. You cannot directly mutate the state. Direct assignment (`state.value = 123`) is **illegal**.

**3. Changes are Made with Pure Functions (Reducers)**
Reducers are pure functions: `(state, action) => newState`. Same inputs always produce the same output. No side effects, no API calls, no random values.

### Unidirectional Data Flow (Flux Pattern)

```
View → Action → Dispatch → Reducer → Store → View
```

This cycle goes in ONE direction only — never backwards. This is what makes Redux state predictable and debuggable.

### Core Concepts Defined

**Store**
The single source of truth. Holds the entire application state tree. Provides:
- `getState()` — read current state
- `dispatch(action)` — trigger a state change
- `subscribe(listener)` — listen for changes

**Action**
A plain JavaScript object describing WHAT happened. Must have a `type` property (string). May have a `payload`.

```typescript
// Action object format
{ type: 'cart/addItem', payload: { id: 1, name: 'Book', price: 29.99 } }
{ type: 'counter/increment' }
{ type: 'users/fetchById/fulfilled', payload: { id: 'u1', name: 'Jon' } }
```

Actions are the ONLY way to signal a state change.

**Reducer**
A pure function: `(state, action) => newState`.

```typescript
// Pure reducer — must NOT mutate state
function counterReducer(state = { value: 0 }, action) {
  switch (action.type) {
    case 'counter/increment':
      return { ...state, value: state.value + 1 }; // new object!
    case 'counter/decrement':
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
}
```

**Dispatch**
The method that sends an action to the store. Routes the action through reducers to produce new state.

```typescript
store.dispatch({ type: 'counter/increment' });
store.dispatch(increment()); // with RTK action creator
```

**Middleware**
Functions that intercept dispatched actions before they reach the reducer. Used for:
- Async logic (thunks)
- Logging
- Analytics

**Connected Component**
A component linked to the Redux store via `useSelector` / `useDispatch` (or legacy `connect()`). It reads state and dispatches actions without prop drilling.

### The Immutability Problem (Why RTK exists)

In plain Redux, you must manually maintain immutability. This gets painful fast:

```javascript
// ILLEGAL — direct mutation
state.value = 123;

// REQUIRED — return new object
return { ...state, value: 123 };

// Deeply nested = nightmare
return {
  ...state,
  first: {
    ...state.first,
    second: {
      ...state.first.second,
      [action.someId]: {
        ...state.first.second[action.someId],
        fourth: action.someValue,
      },
    },
  },
};
```

The slides call this "the most common mistake Redux users do — accidentally mutating the Redux state." RTK solves this with Immer.

---

## 3. Redux Toolkit (RTK)

RTK is **the official, recommended way to use Redux**. The slides call it "the best practice to incorporate Redux into your React application."

**Why RTK was created:**
- Eliminates boilerplate
- Immer eliminates immutability bugs
- Good TypeScript support
- Single file for the whole slice

### 3.1 configureStore

Sets up the Redux store with a single function call. Automatically:
1. Combines reducers (no manual `combineReducers`)
2. Adds Redux Thunk middleware by default
3. Enables Redux DevTools Extension

```typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import usersReducer from './features/users/usersSlice';
import { pokemonApi } from '../services/pokemonApi';

export const store = configureStore({
  reducer: {
    counter: counterReducer,       // standard slice reducer
    users: usersReducer,           // standard slice reducer
    [pokemonApi.reducerPath]: pokemonApi.reducer, // RTK Query reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware), // RTK Query middleware
});

// Export types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**What configureStore replaces (Redux Core boilerplate):**

| Redux Core (Before) | RTK (After) |
|---------------------|-------------|
| Manual `combineReducers` call | Automatic from `reducer` object |
| `applyMiddleware(thunk)` | Thunk included by default |
| Manual Redux DevTools setup | DevTools enabled by default |
| `createStore(rootReducer, middleware)` | Single `configureStore({ reducer: {...} })` |
| Action constants + action creators | `createSlice` generates them automatically |
| Manual `return { ...state }` spreading | Immer allows "mutating" syntax |
| Multiple files | Single slice file |

### 3.2 createSlice

Creates a slice of state — reducer logic + action creators + action types in one place. Uses Immer internally.

```typescript
// features/counter/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  history: number[];
}

const initialState: CounterState = {
  value: 0,
  history: [],
};

const counterSlice = createSlice({
  name: 'counter',                // Used as prefix for action types: 'counter/increment'
  initialState,
  reducers: {
    increment: (state) => {
      state.history.push(state.value); // Looks like mutation — Immer makes it safe!
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
      state.history = [];
    },
  },
});

// Auto-generated action creators
export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

// The reducer function (add to store)
export default counterSlice.reducer;
```

**Key fact about createSlice from the slides:**
> "createSlice allows you to create reducers that use the Immer library, which allows you to write immutable code using 'mutating' syntax. It also generates action creators for all reducer functions."

### 3.3 Immer Integration

Immer is a library that lets you write "mutating" code while producing immutable state behind the scenes. RTK uses it automatically inside `createSlice` — you do NOT need to import it separately.

**How Immer works:** It provides a `produce` function that accepts your original state and a callback. Inside the callback, Immer gives you a "draft proxy" of the state. Any mutations you make to the draft are tracked and used to produce a new immutable state. The original state is never touched.

```typescript
// Inside createSlice reducers — all safe thanks to Immer:
reducers: {
  addTodo: (state, action: PayloadAction<string>) => {
    state.todos.push({ id: Date.now(), text: action.payload, done: false }); // .push() is fine!
  },
  toggleTodo: (state, action: PayloadAction<number>) => {
    const todo = state.todos.find(t => t.id === action.payload);
    if (todo) todo.done = !todo.done; // direct property mutation — fine!
  },
  // IMPORTANT: Either mutate OR return — NOT both
  clearAll: (state) => {
    return []; // returning a new value is also valid
  },
}
```

**Critical rule:** In Immer reducers, you must either **mutate** the draft state OR **return** a new value — doing both at the same time will throw an error.

Deeply nested update — Immer vs manual:

```typescript
// WITHOUT Immer (vanilla Redux) — 15 lines of spreading
function handwrittenReducer(state, action) {
  return {
    ...state,
    first: {
      ...state.first,
      second: {
        ...state.first.second,
        [action.someId]: {
          ...state.first.second[action.someId],
          fourth: action.someValue,
        },
      },
    },
  };
}

// WITH Immer (RTK createSlice) — 1 line
updateFourth(state, action) {
  state.first.second[action.payload.someId].fourth = action.payload.someValue;
}
```

### 3.4 createAsyncThunk

Used for async logic (API calls). Automatically generates `pending`, `fulfilled`, and `rejected` action types.

**The three-step pattern for data fetching:**
1. A "start" action is dispatched to indicate the request is in progress (show loading spinner)
2. The async request is made
3. Depending on the result, either a "success" or "failure" action is dispatched

```typescript
// features/users/usersSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// createAsyncThunk accepts:
// 1. A string for the action type prefix ('users/fetchAll')
// 2. A payload creator function (async callback)
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',               // prefix → generates: pending, fulfilled, rejected
  async (_, thunkAPI) => {
    const response = await fetch('/api/users');
    if (!response.ok) {
      return thunkAPI.rejectWithValue('Failed to fetch users');
    }
    return response.json();         // returned value becomes action.payload on fulfilled
  }
);

// For an action that takes a parameter:
export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  }
);
```

**extraReducers — handling thunk lifecycle states:**

`extraReducers` allows a slice to respond to action types generated outside the slice itself (like those from `createAsyncThunk`). Regular `reducers` only handle actions defined within the slice.

```typescript
interface UsersState {
  entities: User[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const usersSlice = createSlice({
  name: 'users',
  initialState: { entities: [], loading: 'idle', error: null } as UsersState,
  reducers: {
    // Synchronous actions defined here
    userRemoved: (state, action: PayloadAction<string>) => {
      state.entities = state.entities.filter(u => u.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.entities = action.payload; // Immer makes .push() safe too
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});
```

**Manual thunk (before createAsyncThunk) vs createAsyncThunk:**

```typescript
// MANUAL — lots of boilerplate
const fetchStarted = () => ({ type: 'users/fetchStarted' });
const fetchSuccess = (data) => ({ type: 'users/fetchSuccess', payload: data });
const fetchFailed = (error) => ({ type: 'users/fetchFailed', error });

const fetchUsersManual = () => async (dispatch) => {
  dispatch(fetchStarted());
  try {
    const data = await fetch('/api/users').then(r => r.json());
    dispatch(fetchSuccess(data));
  } catch (err) {
    dispatch(fetchFailed(err.toString()));
  }
};

// RTK — same result, less code
const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  return fetch('/api/users').then(r => r.json());
});
```

**Thunks must be declared OUTSIDE of the slice** (from slides). They are not part of the regular slice function.

### 3.5 RTK Query

A powerful data fetching and caching tool built into Redux Toolkit. It is NOT mandatory — an optional addition.

RTK Query takes inspiration from **React Query** and **SWR**.

Key benefits:
- Eliminates the need to write `createAsyncThunk` + `extraReducers` for data fetching
- Automatic caching, refetching, polling, and invalidation
- Auto-generated React hooks (`useGetPostsQuery`, etc.)
- Handles loading/error/data states automatically

**Setup — createApi:**

```typescript
// services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',                            // key in the Redux store
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  tagTypes: ['Pokemon'],                                // for cache invalidation
  endpoints: (builder) => ({
    // QUERY — for fetching data (GET)
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,               // appended to baseUrl
      providesTags: ['Pokemon'],
    }),
    getPokemons: builder.query<PokemonListItem[], void>({
      query: () => 'pokemon',
      transformResponse: (response: any) => response.results, // transform before caching
    }),
    // MUTATION — for creating/updating/deleting (POST, PUT, DELETE)
    addPokemon: builder.mutation<Pokemon, Partial<Pokemon>>({
      query: (newPokemon) => ({
        url: 'pokemon',
        method: 'POST',
        body: newPokemon,
      }),
      invalidatesTags: ['Pokemon'],                     // clears cache, triggers refetch
    }),
  }),
});

// Auto-generated hooks — named use[EndpointName]Query / use[EndpointName]Mutation
export const {
  useGetPokemonByNameQuery,
  useGetPokemonsQuery,
  useAddPokemonMutation,
} = pokemonApi;
```

**Add to store:**

```typescript
// The computed property [pokemonApi.reducerPath] ensures the reducer is stored under the correct key
export const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,  // 'pokemonApi' key
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware), // REQUIRED: enables caching, invalidation
});
```

The middleware **must** be added to enable caching, invalidation, polling, and other RTK Query features. Without it, RTK Query does not work properly.

**Using generated hooks in components:**

```typescript
'use client';

function PokemonList() {
  // The hook automatically fetches on mount and manages loading/error state
  const { data: pokemons, isLoading, isError, error } = useGetPokemonsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {String(error)}</p>;

  return (
    <ul>
      {pokemons?.map((p) => (
        <li key={p.name}>{p.name}</li>
      ))}
    </ul>
  );
}

function PokemonDetail({ name }: { name: string }) {
  const { data: pokemon } = useGetPokemonByNameQuery(name);
  return <div>{pokemon?.name}</div>;
}
```

### 3.6 useSelector and useDispatch

```typescript
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { increment, decrement, incrementByAmount } from '@/store/counterSlice';

export function Counter() {
  // useSelector: reads data from the store. Re-renders when selected value changes.
  const count = useSelector((state: RootState) => state.counter.value);

  // useDispatch: returns the dispatch function
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

**Setting up the Redux Provider** (required — wraps the app):

```tsx
// app/layout.tsx or _app.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
```

### 3.7 Debugging — Redux DevTools

Redux provides the best-in-class debugging experience:
1. Full action log with type and payload for every dispatched action
2. State diff on every change (before/after comparison)
3. Time-travel — step forwards and backwards through state history
4. Inspect the complete state tree at any point

---

## 4. Zustand

Zustand is a **small, fast, and scalable** state management library. The `create` function is the entire API — no reducers, no action types, no Provider wrapping required.

### 4.1 Basic Store with create

```typescript
import { create } from 'zustand';

interface BearState {
  bears: number;
  fish: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  addFish: (count: number) => void;
}

// The store is a hook — use it directly in any component
const useBearStore = create<BearState>((set, get) => ({
  bears: 0,
  fish: 10,

  // Actions use set() to update state
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  addFish: (count) => set((state) => ({ fish: state.fish + count })),

  // get() reads current state inside actions (useful for computed values)
  totalAnimals: () => get().bears + get().fish,
}));
```

### 4.2 Selectors — Preventing Unnecessary Re-renders

Use selectors to subscribe to only the slice of state you need. A component only re-renders when its selected value changes.

```typescript
// Select individual values — most performant
const bears = useBearStore((state) => state.bears);
const increasePopulation = useBearStore((state) => state.increasePopulation);

// Selecting multiple primitive values separately is fine
function BearCounter() {
  const bears = useBearStore((s) => s.bears);  // only re-renders when bears changes
  return <h1>{bears} bears</h1>;
}

function FishCounter() {
  const fish = useBearStore((s) => s.fish);    // only re-renders when fish changes
  return <h1>{fish} fish</h1>;
}
```

### 4.3 useShallow — Multi-value Selectors

When selecting **multiple values** as an object, you need `useShallow` to prevent unnecessary re-renders. Without it, a new object is created each time (different reference), causing re-renders even when values haven't changed.

**Zustand uses `Object.is()` by default** to compare the previous and new selector result. A new object is NEVER equal under `Object.is()`.

```typescript
import { useShallow } from 'zustand/react/shallow';

// WITHOUT useShallow — re-renders on ANY state change (new object reference each time)
const { bears, fish } = useBearStore((state) => ({
  bears: state.bears,
  fish: state.fish,
})); // BAD: { bears: 0, fish: 10 } !== { bears: 0, fish: 10 } (different references)

// WITH useShallow — only re-renders when bears OR fish actually change
const { bears, fish } = useBearStore(
  useShallow((state) => ({ bears: state.bears, fish: state.fish }))
);

// Also applies to computed arrays (from slides)
// WITHOUT useShallow — re-renders every time (new array reference from .map())
const names = useCartStore((state) => state.cart.map((item) => item.name));

// WITH useShallow — only re-renders if names actually change
const names = useCartStore(
  useShallow((state) => state.cart.map((item) => item.name))
);
```

**The teacher's analogy: "If it walks like a duck, it is a duck"** — Zustand with `useShallow` cares about the values, not the reference.

### 4.4 Persist Middleware

Automatically saves store state to a storage backend (localStorage by default) and rehydrates on page load.

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem { id: string; name: string; price: number; quantity: number; }

interface CartStore {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addItem: (item) => set((state) => {
        const existing = state.cart.find((i) => i.id === item.id);
        if (existing) {
          return {
            cart: state.cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
      }),

      removeItem: (id) => set((state) => ({
        cart: state.cart.filter((i) => i.id !== id),
      })),

      updateQuantity: (id, qty) => set((state) => ({
        cart: state.cart.map((i) => i.id === id ? { ...i, quantity: qty } : i),
      })),

      clearCart: () => set({ cart: [] }),

      // get() accesses current state — used for computed values
      total: () => get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'cart-storage',                             // key in localStorage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // optional: sessionStorage, IndexedDB, etc.
      // Default storage is localStorage if omitted
    }
  )
);
```

**Storage options (from slides):** `localStorage`, `sessionStorage`, `IndexedDB`

### 4.5 Devtools Middleware

Connects the Zustand store to Redux DevTools. Action names appear in the DevTools log when provided as the third argument to `set`.

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useBearStore = create(
  devtools(
    (set) => ({
      bears: 0,
      increasePopulation: () => set(
        (state) => ({ bears: state.bears + 1 }),
        false,                    // false = merge with existing state (true = replace entirely)
        'increasePopulation'      // action name shown in DevTools
      ),
    }),
    { name: 'BearStore' }         // store name in DevTools
  )
);
```

**Combining persist + devtools:**

```typescript
const useStore = create<MyStore>()(
  devtools(
    persist(
      (set) => ({ /* state and actions */ }),
      { name: 'my-storage' }
    ),
    { name: 'MyStore' }
  )
);
```

### 4.6 Using Zustand Outside React

Zustand stores work outside React components because the store is a plain JavaScript object. This is a key differentiator from Context API.

```typescript
// Reading state outside React
const currentBears = useBearStore.getState().bears;

// Updating state outside React
useBearStore.setState({ bears: 10 });
useBearStore.setState((state) => ({ bears: state.bears + 1 }));

// Subscribing to changes outside React
const unsubscribe = useBearStore.subscribe(
  (state) => console.log('Bears changed:', state.bears)
);
unsubscribe(); // clean up when done
```

### 4.7 Slices Pattern (Large Stores)

Split a large store into independent "slices" and combine them:

```typescript
import { create, StateCreator } from 'zustand';

// Slice 1
interface CartSlice {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
}
const createCartSlice: StateCreator<CartSlice & CheckoutSlice, [], [], CartSlice> = (set) => ({
  cart: [],
  addItem: (item) => set((state) => ({ cart: [...state.cart, item] })),
});

// Slice 2
interface CheckoutSlice {
  step: number;
  nextStep: () => void;
}
const createCheckoutSlice: StateCreator<CartSlice & CheckoutSlice, [], [], CheckoutSlice> = (set) => ({
  step: 1,
  nextStep: () => set((state) => ({ step: state.step + 1 })),
});

// Combined store
const useStore = create<CartSlice & CheckoutSlice>()((...a) => ({
  ...createCartSlice(...a),
  ...createCheckoutSlice(...a),
}));
```

### 4.8 Map/Set Gotcha (from slides)

When using `Map` or `Set` as state, you MUST create a new instance — Zustand cannot detect mutations to the same reference:

```typescript
// WRONG — mutates existing Map, same reference, NO re-render triggered
addItem: (item) => set((state) => {
  state.cart.set(item.id, item);  // mutates in place!
  return { cart: state.cart };    // same object reference — Zustand sees no change
}),

// CORRECT — creates new Map, different reference, triggers re-render
addItem: (item) => set((state) => ({
  cart: new Map(state.cart).set(item.id, item), // new reference
})),
```

### 4.9 Zustand Debugging

Compared to Redux:
1. Integrates with Redux DevTools (via devtools middleware)
2. Action log is **less descriptive** than Redux — no enforced action types
3. **No time-travel debugging**
4. React DevTools shows only component-level state

This is why the slides call Zustand's debugging "less powerful than Redux."

### Pros and Cons Summary

| Pros | Cons |
|------|------|
| Minimal boilerplate — just `create()` | Less structured, no enforced conventions |
| Very small bundle size (~1-3KB) | Action logs less descriptive than Redux |
| No Provider required | No time-travel debugging |
| Works outside React components | Can get messy in very large apps without discipline |
| Built-in persist, devtools, immer middleware | No built-in derived/computed state |
| Selector-based re-renders (performant) | |

---

## 5. Comparison Table

| Feature | Context API | Redux Toolkit | Zustand |
|---------|-------------|---------------|---------|
| **Bundle size** | 0KB (built into React) | ~14KB | ~1-3KB |
| **Boilerplate** | Low | Medium-High | Very Low |
| **Learning curve** | Low | Medium-High | Very Low |
| **Setup** | `createContext` + `Provider` + `useContext` | Store, slices, Provider | Single `create()` call |
| **Provider required** | Yes (`Context.Provider`) | Yes (`<Provider store={store}>`) | NO |
| **Re-render optimization** | Poor — all consumers re-render | Good — `useSelector` with shallow compare | Good — selectors, `useShallow` |
| **Performance for frequent updates** | Poor | Good | Excellent |
| **DevTools** | React DevTools only | Redux DevTools (full: time-travel, action log, state diff) | Redux DevTools via middleware (no time-travel) |
| **Middleware** | None built-in | Yes (thunk, custom) | Yes (persist, devtools, immer) |
| **Async logic** | Manual (`useEffect`) | `createAsyncThunk` / RTK Query | Manual or middleware |
| **Outside React** | No | Yes (`store.getState()`, `store.dispatch()`) | Yes (`useStore.getState()`, `useStore.setState()`) |
| **Persistence** | Manual | Manual or middleware | Built-in `persist` middleware |
| **Scalability** | Limited (for large apps) | Excellent | Good |
| **Best for** | Auth, theme, locale (low-frequency global state) | Large teams, enterprise apps, complex state | Most apps — pragmatic default |

---

## 6. When to Use Which — Decision Guide

This is the **exact decision flowchart from the slides**. Memorize this.

```
1. Is your app small with minimal shared state?
   YES → Context API

2. Does your state change frequently? (cart, real-time data, UI state, animations)
   YES → Context API is OUT (re-render problems). Continue.
   NO  → Context API

3. Is your team large (5+ devs) OR is strict structure/conventions important?
   YES → Redux Toolkit (enforced patterns, powerful DevTools, scales across large teams)

4. Do you need advanced debugging? (action logs, time-travel, state diffs)
   YES → Redux Toolkit

5. Do you have complex async flows or business logic?
   YES → Redux Toolkit with createAsyncThunk and middlewares
   NO  → Zustand (pragmatic default for most apps)
```

### Quick decision summary by use case

| Situation | Choose |
|-----------|--------|
| Theme (light/dark mode) | Context API |
| Authenticated user (login/logout) | Context API |
| Locale/language | Context API |
| Shopping cart (any size app) | Zustand |
| Music player with progress bar | Zustand |
| Real-time chat messages | Zustand or Redux |
| Large enterprise app (5+ devs) | Redux Toolkit |
| Complex async flows (multi-step data) | Redux Toolkit |
| Need time-travel debugging | Redux Toolkit |
| Simple shared state in medium app | Zustand |

### Context API Issues (from slides)
- Re-renders all consumers on every context value change, even if they only use part of the value
- "Context Hell" / "Provider Hell" when splitting into many contexts
- No action logs, no time-travel debugging, no selectors

### Redux Issues (from slides)
- High boilerplate even with RTK
- Overkill for small to medium apps
- Steeper learning curve
- Requires Provider wrapping

### Zustand Issues (from slides)
- Less structured, no enforced conventions
- No built-in support for derived/computed state
- DevTools less powerful than Redux
- Can get messy without discipline

---

## 7. Likely Exam Questions with Answers

### Q1 — Multiple Choice
**Which pattern does Redux follow for state updates?**

A) Two-way data binding between components and store
B) Unidirectional data flow: Action → Dispatch → Reducer → Store → View
C) Observer pattern where components subscribe directly to individual state properties
D) Event sourcing with automatic state snapshots

**Answer: B**

---

### Q2 — Select All That Apply
**Which of the following statements about global state management are true?**

- [ ] Zustand requires wrapping your app in a Provider component
- [ ] Redux Toolkit's `createSlice` automatically generates action creators
- [ ] Context API re-renders all consumers when the context value changes, even if they only use part of it
- [ ] Zustand stores can be accessed from outside React components
- [ ] Redux requires all components to be class-based
- [ ] Context API is well-optimized for high-frequency updates like animations

**Answers:**
- FALSE — Zustand does NOT need a Provider
- TRUE — `createSlice` auto-generates action creators
- TRUE — Context API re-renders all consumers
- TRUE — Zustand stores work outside React via `getState()`/`setState()`
- FALSE — Redux works with hooks: `useSelector`/`useDispatch`
- FALSE — Context API causes unnecessary re-renders on high-frequency updates

---

### Q3 — Written Answer (6 pts)
**Describe the following Redux concepts: Connected Components, Actions, Reducers, Dispatch.**

| Concept | Description |
|---------|-------------|
| **Connected Components** | Components linked to the Redux store via `useSelector` / `useDispatch` (or legacy `connect()`). They read state and dispatch actions without prop drilling. |
| **Actions** | Plain objects describing what happened: `{ type: 'cart/add', payload: item }`. The ONLY way to signal a state change. Must have a `type` property. |
| **Reducers** | Pure functions `(state, action) => newState` that define how state changes for each action type. No side effects allowed. Same input always produces same output. |
| **Dispatch** | The method that sends an action to the store: `dispatch(action)`. Routes the action through reducers to produce new state. The bridge between the View and the store. |

---

### Q4 — Fill in the Blanks
**Complete the sentences about Redux Toolkit:**

1. `configureStore` automatically calls ________ when you pass an object to the `reducer` field.
2. `createSlice` generates ________ for all reducer functions automatically.
3. RTK uses ________ internally to allow "mutating" syntax in reducers.
4. `createAsyncThunk` automatically generates ________, ________, and ________ action types.
5. `extraReducers` is needed (instead of `reducers`) because `createAsyncThunk` generates actions ________ the slice.

**Answers:**
1. `combineReducers`
2. action creators (and action types)
3. Immer
4. `pending`, `fulfilled`, `rejected`
5. external to / outside of

---

### Q5 — Essay (8 pts): Shopping Cart
**You are building a shopping cart for a Next.js e-commerce application. The cart must be accessible from multiple pages, support adding/removing items, and persist when navigating.**

**a) Compare Context API, Zustand, and Redux Toolkit. One advantage and one disadvantage each.**

| | Context API | Zustand | Redux Toolkit |
|---|---|---|---|
| **Advantage** | Zero dependencies, built into React | Minimal boilerplate, works outside React, easy persistence with `persist` middleware | Best DevTools, middleware support, predictable enforced patterns |
| **Disadvantage** | Re-renders ALL consumers on every cart update — terrible for a cart that changes often | Less opinionated, no built-in DevTools (less powerful than Redux) | Most boilerplate, steeper learning curve — overkill for a cart |

**b) Implementation — Zustand (best choice for this case):**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem { id: string; name: string; price: number; quantity: number; }
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((s) => {
        const exists = s.items.find((i) => i.id === item.id);
        return exists
          ? { items: s.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) }
          : { items: [...s.items, { ...item, quantity: 1 }] };
      }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, qty) => set((s) => ({
        items: s.items.map((i) => i.id === id ? { ...i, quantity: qty } : i),
      })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);

// Usage in a component — each selector = separate subscription
function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.total);

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.name} x{item.quantity} — ${item.price * item.quantity}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${total()}</p>
    </div>
  );
}
```

---

### Q6 — createAsyncThunk
**a) What two parameters does `createAsyncThunk` accept?**

1. A single string for the action type prefix (e.g. `'users/fetchByIdStatus'`)
2. A payload creator function — an async callback that performs the actual logic and returns the data

**b) Why is `extraReducers` used instead of `reducers` for handling thunk lifecycle states?**

`createAsyncThunk` generates its own action types (`pending`, `fulfilled`, `rejected`) that are external to the slice. Regular `reducers` only handle actions defined within the slice itself. `extraReducers` allows the slice to respond to actions defined outside of it.

**c) What does `fetchUserById.fulfilled` refer to? Name the other two lifecycle states.**

`fetchUserById.fulfilled` refers to the action type dispatched when the async thunk resolves successfully. The other two:
- `fetchUserById.pending` (dispatched when thunk starts)
- `fetchUserById.rejected` (dispatched when thunk throws an error)

**d) Is it safe to write `state.entities.push(action.payload)` in `extraReducers`?**

Yes. `createSlice` (and therefore `extraReducers`) uses Immer automatically. Immer tracks the "mutation" and performs safe, immutable operations under the hood.

---

### Q7 — Context API
**What is the biggest issue with Context API and how does splitting contexts "fix" it?**

The biggest issue is that every consumer re-renders when the context changes, **even if they don't use the data that changed**. There are no built-in selectors.

Splitting into separate contexts (e.g., `AuthContext`, `ThemeContext`, `CartContext`) reduces the scope of re-renders — components only subscribe to the context they use. However, this "fix" leads to deeply nested providers — what the slides call **"Context Hell"**.

---

### Q8 — RTK Query
**a) Is RTK Query mandatory when using Redux Toolkit?**

No. The slides explicitly state: "RTK Query is an addition to Redux Toolkit, and not mandatory to use when using RTK."

**b) What libraries inspired RTK Query?**

React Query and SWR.

**c) What does it mean that RTK Query is "UI-agnostic"?**

It works for all JavaScript solutions that have compatibility to use RTK — e.g. React for web and React Native for mobile apps. It is not tied to a specific UI framework.

**d) Why must `pokemonApi.middleware` be added to the store?**

The middleware enables caching, invalidation, polling, and other RTK Query features. Without it, RTK Query cannot manage its cache lifecycle or handle automatic refetching.

---

### Q9 — Fill in the Blanks (State Management Decisions)
**Complete the decision tree for choosing state management:**

1. Small app with minimal shared state → **Context API**
2. State changes frequently (cart, real-time) → Context API is **out** due to re-render issues
3. Large team (5+ devs) or strict structure needed → **Redux Toolkit**
4. Need advanced debugging (time-travel, action logs) → **Redux Toolkit**
5. Complex async flows → **Redux with createAsyncThunk**
6. Otherwise → **Zustand**

---

### Q10 — Explain Immer
**A student says: "This code mutates state, which is illegal in Redux." The code is inside a `createSlice` reducer: `state.value += 1`. Is the student correct?**

**Answer:** The student is **incorrect**. While the code looks like a direct mutation, Redux Toolkit uses **Immer** under the hood inside `createSlice`. Immer creates a draft proxy of the state. Any "mutations" you write to the draft are tracked and used to produce a new immutable state object. The original state is never modified. This is one of RTK's biggest benefits — simpler reducer syntax while maintaining immutability guarantees.

---

## 8. Quick-Reference Cheat Sheet

### Context API

```typescript
const MyCtx = createContext(defaultValue);           // 1. Create
<MyCtx.Provider value={...}>{children}</MyCtx.Provider> // 2. Provide
const value = useContext(MyCtx);                     // 3. Consume
```

**Remember:** All consumers re-render when value changes. Use for: theme, auth, locale.

---

### Redux Toolkit — Full Setup

```typescript
// 1. Create slice
const slice = createSlice({
  name: 'feature',
  initialState: { value: 0 },
  reducers: {
    set: (state, action: PayloadAction<number>) => { state.value = action.payload; }
  }
});
export const { set } = slice.actions;
export default slice.reducer;

// 2. Create store
const store = configureStore({ reducer: { feature: slice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 3. Wrap app
<Provider store={store}><App /></Provider>

// 4. Use in components
const value = useSelector((s: RootState) => s.feature.value);
const dispatch = useDispatch<AppDispatch>();
dispatch(set(42));
```

---

### createAsyncThunk Pattern

```typescript
// 1. Define thunk (OUTSIDE the slice)
const fetchData = createAsyncThunk('feature/fetch', async (id: string) => {
  return fetch(`/api/data/${id}`).then(r => r.json());
});

// 2. Handle in extraReducers
extraReducers: (builder) => {
  builder
    .addCase(fetchData.pending,   (state) => { state.loading = 'pending'; })
    .addCase(fetchData.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.data = action.payload;
    })
    .addCase(fetchData.rejected,  (state, action) => {
      state.loading = 'failed';
      state.error = action.error.message ?? null;
    });
}

// 3. Dispatch from component
dispatch(fetchData('user-123'));
```

---

### RTK Query Setup

```typescript
// 1. Define API
const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({ query: () => '/items' }),
    addItem: builder.mutation<Item, Partial<Item>>({
      query: (body) => ({ url: '/items', method: 'POST', body }),
    }),
  }),
});
export const { useGetItemsQuery, useAddItemMutation } = api;

// 2. Add to store (BOTH reducer AND middleware required)
configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (get) => get().concat(api.middleware),
});

// 3. Use in component
const { data, isLoading, isError } = useGetItemsQuery();
const [addItem, { isLoading: isAdding }] = useAddItemMutation();
```

---

### Zustand Store

```typescript
const useStore = create<State>()(
  persist(
    (set, get) => ({
      // State
      count: 0,
      items: [],

      // Actions
      increment: () => set((s) => ({ count: s.count + 1 })),
      addItem: (item) => set((s) => ({ items: [...s.items, item] })),
      removeItem: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),

      // Computed (uses get())
      total: () => get().items.reduce((sum, i) => sum + i.price, 0),
    }),
    { name: 'my-storage' }  // persists to localStorage
  )
);

// Usage — always use selectors
const count = useStore((s) => s.count);
const addItem = useStore((s) => s.addItem);

// Multiple values — use useShallow to prevent unnecessary re-renders
const { count, items } = useStore(useShallow((s) => ({ count: s.count, items: s.items })));

// Outside React
const state = useStore.getState();
useStore.setState({ count: 0 });
```

---

### Key Facts to Memorize

| Fact | Detail |
|------|--------|
| Context re-renders | ALL consumers re-render when value changes |
| Zustand Provider | NOT required (unique advantage) |
| Redux Provider | Required — `<Provider store={store}>` |
| Immer | Used automatically inside `createSlice` — write "mutating" code |
| `extraReducers` vs `reducers` | `extraReducers` = for external action types (e.g. from `createAsyncThunk`) |
| Thunks location | Must be declared OUTSIDE the slice |
| `createAsyncThunk` lifecycle | `pending`, `fulfilled`, `rejected` |
| RTK Query mandatory | NO — optional addition |
| RTK Query inspiration | React Query + SWR |
| RTK Query `middleware` | REQUIRED — enables caching, invalidation, polling |
| `useShallow` | For selecting multiple values as object — prevents re-renders from reference changes |
| Zustand outside React | `useStore.getState()`, `useStore.setState()` |
| Context best for | Theme, auth, locale — LOW frequency changes |
| Zustand best for | Most apps — pragmatic default |
| Redux best for | Large teams, complex async, need time-travel debugging |
| Context debugging | Limited to React DevTools, no action log, no time-travel |
| Redux debugging | Best-in-class: action log, state diff, time-travel |
| Context Hell | Deeply nested Providers from splitting contexts |
| Bundle sizes | Context: 0KB | Zustand: ~1-3KB | Redux: ~14KB |
| Immer rule | Either mutate draft OR return new value — not both |
| `Object.is()` | How Zustand compares previous and new selector result by default |
| Three Redux principles | Single source of truth, State is read-only, Changes via pure reducers |

---

### Flux / Unidirectional Data Flow (draw this from memory)

```
View → Action → Dispatch() → Reducer → Store → View
         |                       |
   { type, payload }    (state, action) => newState
```

This cycle goes in ONE direction only. This is the foundation of Redux's predictability.
