# Practice Exam 6 -- Next.js Routing, Redux Toolkit, and Zustand

**Source:** Slides (Glaerur (3).pdf) pages 500-560 (Next.js Routing), pages 640-700+ (Redux Toolkit & Zustand)
**Code examples:** WebProgrammingIIRU/Redux/rtk-demonstration/

---

## Section A: Next.js Routing (6 questions)

### Question 1 -- Routing Files (slides ~p.525-530)

According to the slides, Next.js App Router uses special file conventions for routing. List all 9 routing files covered in the slides and explain what each one does.

**Answer:**

1. **layout** -- "UI that is shared between multiple pages. On navigation, layouts preserve state, remain interactive, and do not rerender." The component should accept a `children` prop which can be a page or another layout.
2. **page** -- "Unique UI for a route, makes the route publicly accessible" (from slides). To create a page, add a page file inside the app directory and default export a React component.
3. **loading** -- "Loading UI shown while page/layout is fetching data" (from slides). Behind the scenes, Next.js wraps page.tsx in a `<Suspense>` boundary. Benefits: immediate navigation and visual feedback, shared layouts remain interactive, improved Core Web Vitals.
4. **not-found** -- "UI shown when notFound() is called or route doesn't exist" (from slides).
5. **error** -- "Error boundary UI for handling runtime errors in route segment" (from slides).
6. **global-error** -- "Error boundary for root layout errors (wraps entire app)" (from slides).
7. **route** -- Server-side API endpoint (Route Handler). Defined in a `route.ts` file. Note: `route.js` and `page.js` cannot coexist in the same route segment.
8. **template** -- Similar to layout but creates a new instance on navigation (does not preserve state).
9. **default** -- "Fallback UI for parallel routes when slot isn't matched" (from slides).

**Component hierarchy nesting order (from slides):**
`<Layout>` > `<Template>` > `<ErrorBoundary>` > `<Suspense>` > `<ErrorBoundary (not-found)>` > `<Page>`

---

### Question 2 -- Route Groups and Multiple Root Layouts (slides ~p.540)

The slides show a folder structure using parentheses in the `app` directory:

```
app/
  (marketing)/
    layout.js
    ...
  (shop)/
    layout.js
    ...
```

a) What is this feature called?
b) What is the purpose shown in the slide caption?
c) Do the parenthesized folder names appear in the URL path?

**Answer:**

a) **Route Groups** -- folders wrapped in parentheses `(folderName)`.

b) The slide caption says: **"Creating multiple root layouts."** Each route group can have its own `layout.js`, allowing completely different layouts for different sections of the application (e.g., a marketing site vs. a shop).

c) No. The parenthesized folder names are excluded from the URL. For example, `(marketing)/about/page.tsx` maps to `/about`, not `/(marketing)/about`.

---

### Question 3 -- Dynamic Routes (slides ~p.541-542)

The slides describe three types of dynamic segments. Complete the table below with the correct syntax and what URL patterns they match.

| Syntax | Type | Example route | Matches |
|--------|------|---------------|---------|

**Answer:**

| Syntax | Type | Example route | Matches |
|--------|------|---------------|---------|
| `[segment]` | Single param | `app/blog/[slug]/page.tsx` | `/blog/my-first-post` |
| `[...segment]` | Catch-all | `app/shop/[...slug]/page.tsx` | `/shop/clothing`, `/shop/clothing/shirts` |
| `[[...segment]]` | Optional catch-all | `app/docs/[[...slug]]/page.tsx` | `/docs`, `/docs/layouts-and-pages`, `/docs/api-reference/use-router` |

Access values via the `params` prop (from slides).

---

### Question 4 -- Creating a Layout (slides ~p.543-546)

According to the slides, what are the key characteristics of a layout in Next.js? Write the code for a root layout as shown in the slides.

**Answer:**

From the slides:
- "A layout is UI that is shared between multiple pages. On navigation, layouts preserve state, remain interactive, and do not rerender"
- "You can define a layout by default exporting a React component from a layout file. The component should accept a children prop which can be a page or another layout"
- "Layouts are especially useful to wrap shared logic between similar pages, e.g. settings. Shared logic could be UI logic or shared data, e.g. context"
- "By default, layouts in the folder hierarchy are also nested, which means they wrap child layouts via their children prop"

Root layout code from slides:

```tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
      </body>
    </html>
  );
}
```

---

### Question 5 -- Navigation: Link and Prefetching (slides ~p.548-555)

a) What does the `<Link>` component do according to the slides?
b) What is prefetching and when does it happen?
c) What is the difference between prefetching a static vs. dynamic route?
d) According to the slides, what is the difference between using `<Link>` and a regular `<a>` tag?

**Answer:**

a) From slides: "You can use the `<Link>` component to navigate between routes. `<Link>` is a built-in Next.js component that extends the HTML `<a>` tag to provide prefetching and client-side navigation." Also: "Another way of routing is programmatically routing through the use of `useRouter` hook."

b) From slides: "Prefetching is the process of loading a route in the background before the user navigates to it. This makes navigation between routes in your application feel instant, because by the time a user clicks on a link, the data to render the next route is already available client side." Next.js automatically prefetches routes linked with the `<Link>` component when they enter the user's viewport.

c) From slides:
- "If the route is declared static it will be prefetched completely"
- "If the route is declared dynamic it will be skipped unless `loading.tsx` is declared and in those cases it will be partially prefetched"

d) From the slides' code example: `<Link href="/blog">Blog</Link>` is "Prefetched when the link is hovered or enters the viewport", while `<a href="/contact">Contact</a>` has "No prefetching". The `<Link>` component enables client-side transitions (keeping shared layouts and UI), while `<a>` triggers a full page load.

---

### Question 6 -- Streaming and loading.tsx (slides ~p.554-557)

According to the slides, what is streaming and what role does `loading.tsx` play?

**Answer:**

From slides:
- "Streaming allows the server to send parts of a dynamic route to the client as soon as they're ready, rather than waiting for the entire route to be rendered"
- "This means users see something sooner, even if parts of the page are still loading"
- "For dynamic routes, it means they can be partially prefetched. That is, shared layouts and loading skeletons can be requested ahead of time"
- "To use streaming, you must create a `loading.tsx` in your route folder"
- "Behind the scenes, Next.js will automatically wrap the page.tsx contents in a `<Suspense>` boundary"
- "The prefetched fallback UI will be shown while the route is loading, and swapped for the actual content once ready"

Benefits of `loading.tsx`:
- Immediate navigation and visual feedback for the user
- Shared layouts remain interactive and navigation is interruptible
- Improved Core Web Vitals

Code from slides:
```tsx
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return <LoadingSkeleton />;
}
```

---

## Section B: Redux Toolkit -- Concepts (5 questions)

### Question 7 -- What is RTK and Why? (slides ~p.640-650)

According to the slides, what is Redux Toolkit (RTK) and why was it created? Use the teacher's exact wording.

**Answer:**

From the slides:
- RTK **"has been established as the best practice to incorporate Redux into your React application"**
- Prior to RTK there was significant **boilerplate for store creation, middleware, reducers, actions**
- Why RTK:
  - **"Eliminates boilerplate"**
  - **"Immer eliminates immutability bugs"**
  - **"Good TypeScript support"**
  - **"Single file for the whole slice"**

---

### Question 8 -- configureStore (slides ~p.645-650)

a) What does `configureStore` do according to the slides?
b) What three things does it set up automatically?
c) Write the `configureStore` call from the RTK demonstration code.

**Answer:**

a) From slides: `configureStore` **"sets up a well-configured Redux store with a single function call"**

b) From slides, `configureStore` automatically:
1. **Combines reducers** -- uses `combineReducers` automatically
2. **Adds Redux Thunk middleware** -- included by default
3. **Enables Redux DevTools** -- by default

c) From the rtk-demonstration `store.ts`:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counter-slice";
import userReducer from "./features/user/user-slice";
import { pokemonApi } from "../services/pokemon-service";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### Question 9 -- createSlice (slides ~p.645-650)

a) What does `createSlice` do according to the slides? Use the teacher's exact definition.
b) Write the counter slice from the RTK demonstration code and explain how Immer is used.

**Answer:**

a) From slides: `createSlice` **"allows you to create reducers that use the Immer library, which allows you to write immutable code using 'mutating' syntax. It also generates action creators for all reducer functions"**

b) From the rtk-demonstration `counter-slice.ts`:

```typescript
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;  // Looks like mutation, but Immer makes it immutable!
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment } = counterSlice.actions;

export default counterSlice.reducer;
```

**Immer usage:** The line `state.value += 1` looks like a direct mutation, but thanks to Immer (built into `createSlice`), this is actually producing a new immutable state object behind the scenes. Without Immer, you would need to write `return { ...state, value: state.value + 1 }`.

---

### Question 10 -- RTK Query (slides ~p.655-660)

a) What is RTK Query according to the slides?
b) Write the Pokemon service from the RTK demonstration code and explain what `createApi` does.

**Answer:**

a) From slides: RTK Query is a **"powerful data fetching and caching tool"** built into Redux Toolkit.

b) From the rtk-demonstration `pokemon-service.ts`:

```typescript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PokemonListItem } from "../types/pokemon-list-item";
import { Pokemon } from "../types/pokemon";

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name: string) => `pokemon/${name}`,
      transformResponse: (response: any) => ({
        ...response,
        image: response.sprites["front_default"],
      }),
    }),
    getPokemons: builder.query<PokemonListItem[], void>({
      query: () => "pokemon",
      transformResponse: (response: any) => response.results,
    }),
  }),
});

export const { useGetPokemonByNameQuery, useGetPokemonsQuery } = pokemonApi;
```

Key points:
- `createApi` defines the API service with a `baseQuery` and `endpoints`
- It auto-generates React hooks: `useGetPokemonByNameQuery` and `useGetPokemonsQuery`
- The hooks provide `data`, `isLoading`, `isError`, and `error` properties
- The service's reducer and middleware must be added to the store

---

### Question 11 -- Using RTK in Components (rtk-demonstration code)

Given the counter slice and store from the RTK demonstration, write a component that reads the counter value and dispatches the increment action. Show how `useSelector` and `useDispatch` are used.

**Answer:**

From the rtk-demonstration `counter.tsx`:

```typescript
import { Box, Button, Heading } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { increment } from "../../redux/features/counter/counter-slice";

export function Counter() {
  const counter = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Box>
      <Heading>Current counter: {counter}</Heading>
      <Button onClick={() => dispatch(increment())}>Increase</Button>
    </Box>
  );
}
```

- `useSelector` takes a selector function that receives the entire `RootState` and returns the specific piece of state needed
- `useDispatch` returns the typed dispatch function
- `dispatch(increment())` dispatches the auto-generated action creator from the slice

---

## Section C: Redux Core vs RTK (2 questions)

### Question 12 -- Redux Core Boilerplate (slides ~p.640-645)

According to the slides, what steps were required with Redux Core (before RTK) to set up a Redux store? List all the things that were needed.

**Answer:**

From the slides, prior to RTK you needed:
1. **Individual reducers** -- each enforcing immutability manually (spreading state: `return { ...state, ... }`)
2. **`combineReducers`** -- to merge all individual reducers into one root reducer
3. **`createStore`** -- to create the store with the combined reducer
4. **Action constants** -- defining string constants for each action type
5. **Action creators** -- functions that return action objects with `type` and payload
6. **`applyMiddleware`** -- to add middleware like Redux Thunk for async operations

All of this is boilerplate that RTK eliminates.

---

### Question 13 -- RTK vs Redux Core Comparison (slides ~p.645-650)

Explain how RTK's `configureStore` replaces all the Redux Core boilerplate from Question 12. What does each feature of `configureStore` replace?

**Answer:**

From the slides, `configureStore` replaces all the boilerplate:

| Redux Core (Before) | RTK (After) |
|---------------------|-------------|
| Manual `combineReducers` call | `configureStore` combines reducers **automatically** from the `reducer` object |
| `applyMiddleware(thunk)` | **Redux Thunk middleware** is included by default |
| Manual Redux DevTools setup | **DevTools** enabled by default |
| `createStore(rootReducer, middleware)` | Single `configureStore({ reducer: {...} })` call |
| Action constants + action creators | `createSlice` **generates action creators** for all reducer functions |
| Manual immutable updates (`...state`) | **Immer** allows "mutating" syntax that produces immutable updates |
| Multiple files for actions, constants, reducers | **"Single file for the whole slice"** |

---

## Section D: Zustand (5 questions)

### Question 14 -- Zustand Re-render Prevention (slides ~p.685-690)

According to the slides, how does Zustand prevent unnecessary re-renders?

**Answer:**

From the slides:
- "In Zustand re-renders are prevented using a selector, e.g. `useCart`"
- "If relying on a computed state it can cause re-renders, as the default behaviour is using `Object.is()` to determine if a new object has been selected or not"
- "If the object has not really changed although the reference has changed, you can choose to use `useShallow()` instead which shallow compares the two objects."
- **"If it walks like a duck it is a duck"** (the teacher's analogy for shallow comparison)

---

### Question 15 -- useShallow() Code Example (slides ~p.685-690)

The slides show two versions of a `CartItemNames` component. Write both versions and explain why the second one using `useShallow()` prevents unnecessary re-renders.

**Answer:**

From the slides:

```typescript
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

const useCartStore = create(() => ({
  cart: [
    { id: 1, name: "Shoes", price: 79.99 },
    { id: 2, name: "Hat", price: 24.99 },
  ],
}));

// WITHOUT useShallow -- re-renders on every state change
// .map() returns a new array reference each time, even if names haven't changed
export const CartItemNames = () => {
  const names = useCartStore((state) => state.cart.map((item) => item.name));
  return <div>{names.join(", ")}</div>;
};

// With useShallow -- only re-renders if item names actually change
export const CartItemNames = () => {
  const names = useCartStore(useShallow((state) => state.cart.map((item) => item.name)));
  return <div>{names.join(", ")}</div>;
};
```

**Explanation:** When `useCartStore.setState` updates the cart (e.g., changing a price from 79.99 to 109.99 but NOT changing names), the first version re-renders because `.map()` always returns a new array reference and `Object.is()` sees it as a different object. The second version with `useShallow()` does a shallow comparison of the array contents -- since the names are the same strings, it determines that nothing meaningful changed and **skips the re-render**.

---

### Question 16 -- Zustand Middlewares (slides ~p.690-695)

a) What middlewares does Zustand offer according to the slides?
b) What storage options are available for the persist middleware?

**Answer:**

a) From slides: "Zustand offers middleware support, e.g. a persistence of store data." The most used middlewares are:
- **`persist`** -- for persisting store data
- **`devtools`** -- for Redux DevTools integration
- **`immer`** -- for Immer-style immutable updates

b) From slides: "The store data could be persisted using `localStorage`, `sessionStorage`, `IndexedDB`, etc."

---

### Question 17 -- Zustand Persist Code Example (slides ~p.690-695)

Write the `useCartStore` with the persist middleware as shown in the slides. Explain all the configuration options.

**Answer:**

From the slides:

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartStore = {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: CartItem["id"]) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addItem: (item) => set({ cart: [...get().cart, item] }),
      removeItem: (id) => set({ cart: get().cart.filter((item) => item.id !== id) }),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",  // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage),  // (optional) by default, 'localStorage' is used
    },
  ),
);
```

Configuration:
- **`name: "cart-storage"`** -- the key used in storage; must be unique
- **`storage: createJSONStorage(() => sessionStorage)`** -- specifies the storage engine; defaults to `localStorage` if omitted
- The store state (`cart`) will be automatically saved to and loaded from the specified storage

---

### Question 18 -- Server vs Client Components (slides ~p.560-575)

According to the slides:
a) What are Server Components and what are their key characteristics?
b) What are Client Components and what are their key characteristics?
c) How do you mark a component as a Client Component?

**Answer:**

a) From slides: "Server Components are React components that run only on the server and never send JavaScript to the browser." Key characteristics:
- Execute during rendering on the server (build time or request time)
- Can directly access backend resources (databases, file system, APIs)
- Don't include JavaScript in the client bundle
- Cannot use browser APIs or interactive hooks (useState, useEffect, event handlers)

b) From slides: "Client Components are React components that run in the browser and can be interactive." Key characteristics:
- Execute on the client (browser)
- Can use interactive hooks (useState, useEffect, useContext)
- Can handle user events (clicks, form inputs, etc.)
- Have access to browser APIs (window, localStorage, etc.)
- JavaScript is included in the client bundle

c) Add `'use client';` directive at the top of the file. From slides: "The solution here is to wrap the component using the `'use client'` directive."

Note from slides: "By default, layouts and pages are Server Components." And: "A Server Component can render Client Components and other Server Components, but Client Components cannot render Server Components."

---

### Question 19 -- Fetching Data: Server vs Client (slides ~p.575-582)

According to the slides, how do you fetch data in Server Components versus Client Components? List all the approaches covered.

**Answer:**

From slides:

**Server Components** -- can fetch data using any asynchronous I/O:
- The `fetch` API (turn component into async function and await the fetch call)
- An ORM / Database (e.g., `await db.restaurant.findFirst(...)`)
- Reading from the filesystem using `fs`

**Client Components** -- can fetch data using:
- React's `use` API (pass a Promise from Server Component as prop, resolve it with `use()`)
- A community library such as **SWR** or **React Query**
- `useEffect` with `fetch`

From slides on choosing: "Opt for server side default... Best practice is to combine both worlds, try to load as much as possible server side but opt for client side when needed."

---

### Question 20 -- RTK Query Usage in Components (rtk-demonstration code)

From the RTK demonstration code, how is `useGetPokemonsQuery` used in the `PokemonsView` component? Write the key parts and explain the destructured values.

**Answer:**

From the rtk-demonstration `pokemons-view.tsx`:

```typescript
import { useGetPokemonsQuery } from "../../services/pokemon-service";

export function PokemonsView() {
  const navigate = useNavigate();

  const { data: pokemons, isLoading, isError, error } = useGetPokemonsQuery();

  return (
    <Box>
      {isLoading ? (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : isError ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Failed to load Pokemons</AlertTitle>
          <AlertDescription>
            {"error" in error ? error.error : ""}
          </AlertDescription>
        </Alert>
      ) : (
        <List spacing={3}>
          {pokemons?.map((p) => (
            <ListItem key={p.name} onClick={() => navigate(`/pokemons/${p.name}`)}>
              <ListIcon as={SunIcon} color="yellow.500" />
              {_.capitalize(p.name)}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
```

Destructured values from the auto-generated hook:
- **`data`** (aliased as `pokemons`) -- the fetched data after transformation
- **`isLoading`** -- `true` while the request is in flight
- **`isError`** -- `true` if the request failed
- **`error`** -- the error object if the request failed

The hook automatically handles caching, loading states, and error states -- no need to write `useEffect` + `useState` manually.

---

## Answer Key Summary

| Q# | Topic | Key Concept |
|----|-------|-------------|
| 1 | Routing files | 9 files: layout, page, loading, not-found, error, global-error, route, template, default |
| 2 | Route groups | `(parentheses)` folders for multiple root layouts, excluded from URL |
| 3 | Dynamic routes | `[segment]`, `[...segment]`, `[[...segment]]` with `params` prop |
| 4 | Layouts | Shared UI, preserve state, accept `children` prop, nested by default |
| 5 | Link & Prefetching | `<Link>` extends `<a>` with prefetching + client-side navigation |
| 6 | Streaming | `loading.tsx` + `<Suspense>` boundary, partial content delivery |
| 7 | RTK purpose | Best practice for Redux, eliminates boilerplate, Immer, TypeScript |
| 8 | configureStore | Single function call, auto combineReducers, Thunk, DevTools |
| 9 | createSlice | Immer "mutating" syntax, auto-generates action creators |
| 10 | RTK Query | createApi, auto-generated hooks, data fetching + caching |
| 11 | RTK in components | useSelector + useDispatch with typed RootState/AppDispatch |
| 12 | Redux Core boilerplate | combineReducers, createStore, action constants, applyMiddleware |
| 13 | RTK vs Core | configureStore replaces all boilerplate with single call |
| 14 | Zustand re-renders | Selectors, Object.is(), useShallow() for shallow comparison |
| 15 | useShallow() code | Prevents re-renders when computed array references change |
| 16 | Zustand middlewares | persist, devtools, immer; storage: localStorage/sessionStorage/IndexedDB |
| 17 | Persist code | create + persist middleware with name + storage config |
| 18 | Server vs Client | Server: no JS shipped, direct DB; Client: 'use client', interactive hooks |
| 19 | Fetching data | Server: fetch/ORM/fs; Client: use API, SWR, useEffect+fetch |
| 20 | RTK Query usage | Auto-generated hooks with data/isLoading/isError/error |
