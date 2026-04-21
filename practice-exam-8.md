# Practice Exam 8 -- Server & Client Components, Data Fetching, Server Functions, Error Handling, Static Assets, Route Handlers, Redux Toolkit

**22 questions. Closed-book format.**

---

## Questions

### 1. Server to Client boundary (2 pts)

A Server Component can render Client Components and other Server Components, but Client Components cannot render Server Components. According to the slides, there is one way to render Server Components inside Client Components. What is it, and what determines whether a component is a Server Component or not?

---

### 2. Code analysis -- component composition (3 pts)

Study the following code from the slides:

```tsx
// app/restaurants/page.tsx - Server Component
async function RestaurantsPage() {
  const response = await fetch('https://api.example.com/restaurants');
  const restaurants = await response.json();

  return (
    <InteractiveList>
      {restaurants.map(restaurant => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </InteractiveList>
  );
}

// app/components/InteractiveList.tsx - Client Component
'use client';
import { useState } from 'react';

export default function InteractiveList({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Collapse' : 'Expand'} List
      </button>
      {isExpanded && <div>{children}</div>}
    </div>
  );
}

// app/components/RestaurantCard.tsx - Server Component
async function RestaurantCard({ restaurant }) {
  const details = await fetch(`https://api.example.com/restaurants/${restaurant.id}`);
  const data = await details.json();
  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>{restaurant.cuisine}</p>
      <p>Rating: {data.rating}</p>
    </div>
  );
}
```

a) `InteractiveList` is a Client Component, yet `RestaurantCard` (a Server Component) renders inside it. Why does this work without errors?

b) Why does `InteractiveList` need the `'use client'` directive but `RestaurantCard` does not?

---

### 3. Third-party components (2 pts)

When using third-party components from libraries such as MaterialUI or Bootstrap in a Next.js application, the slides say they are not built for Next.js. According to the slides:

a) When do problems occur with these components?

b) What is the solution? Write the exact code pattern shown in the slides for wrapping a third-party `Carousel` component.

---

### 4. Fetching data -- Server vs. Client (2 pts)

List the three ways you can fetch data in **Server Components** and the three ways you can fetch data in **Client Components**, as described in the slides.

---

### 5. Server-side data fetching with `fetch()` (2 pts)

According to the slides, to fetch data with the fetch API in a Server Component, you must do two things to your component. What are they? Also, are fetch responses automatically cached?

---

### 6. Server-side data fetching with ORM (2 pts)

Complete the missing code to fetch a restaurant using an ORM in a Server Component, following the exact pattern from the slides:

```tsx
import { db } from '@/lib/db';

export default async function Page() {
  const restaurant = await _____________________;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.cuisine}</p>
      <p>{restaurant.location}</p>
    </div>
  );
}
```

---

### 7. Client-side data fetching with `use` API (3 pts)

The slides describe a pattern for streaming data from server to client using React's `use` API. Explain the four steps of this pattern. Then, given the code below, fill in the blanks:

```tsx
// Server Component
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message ... </p>}>
      <Message _________={messagePromise} />
    </Suspense>
  );
}

// Client Component
'use client';
import { ___ } from 'react';

export function Message({ messagePromise }) {
  const messageContent = ___(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```

---

### 8. Client-side data fetching with SWR (2 pts)

In the SWR code example from the slides, what three values are destructured from the `useSWR` hook, and what does the `fetcher` function do?

---

### 9. Choosing client side vs. server side (2 pts)

According to the slides, what is the "best practice" when choosing between server-side and client-side data fetching? Give two reasons to opt for server-side and two reasons to opt for client-side.

---

### 10. Server Functions -- definition (2 pts)

According to the slides, what is a Server Function? List four key facts about Server Functions as stated in the slides.

---

### 11. Server Functions -- declaration (2 pts)

The slides describe two places where Server Functions can be declared. What are they, and what directive must be used in each case? Also, is it possible to declare Server Functions inside a Client Component?

---

### 12. Server Functions -- `createRestaurant` (3 pts)

Study the following Server Function from the slides:

```tsx
// app/actions/restaurants.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createRestaurant(formData: FormData) {
  const name = formData.get('name') as string;
  const cuisine = formData.get('cuisine') as string;
  const location = formData.get('location') as string;

  if (!name || !cuisine || !location) {
    return { error: 'All fields are required' };
  }

  const restaurant = await db.restaurant.create({
    data: { name, cuisine, location },
  });

  revalidatePath('/restaurants');
  return { success: true, restaurant };
}
```

a) Why is `'use server'` placed at the top of the file rather than inside the function?

b) What does `revalidatePath('/restaurants')` do?

c) How does the Client Component call this Server Function? Show the pattern from the slides using `<form action={handleSubmit}>`.

---

### 13. Server Functions -- side effects (2 pts)

The slides list four side effects that are useful when dealing with Server Functions. Name all four, and for each one, identify the function or import used (e.g., `revalidatePath`, `redirect`, `refresh`).

---

### 14. Showing a pending state with `useActionState` (3 pts)

Fill in the blanks in this code from the slides:

```tsx
'use client';

import { useActionState, startTransition } from 'react';
import { createRestaurant } from '@/app/actions/restaurants';
import { LoadingSpinner } from '@/app/ui/loading-spinner';

export function CreateRestaurantButton() {
  const [state, action, ________] = useActionState(createRestaurant, null);

  return (
    <div>
      <button onClick={() => _________(action)}>
        {________ ? <LoadingSpinner /> : 'Create Restaurant'}
      </button>
      {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state?.success && <p style={{ color: 'green' }}>Restaurant created!</p>}
    </div>
  );
}
```

---

### 15. Errors in Next.js -- two categories (2 pts)

The slides divide errors into two categories. Name them, describe each one, and explain how each should be handled according to the slides.

---

### 16. Handling expected exceptions (2 pts)

Expected exceptions can occur in three places according to the slides. Name the three places, and for each one, describe the recommended way to handle them.

---

### 17. Error boundaries (3 pts)

a) What file do you create to make an error boundary in Next.js?

b) What two props does the error boundary component receive?

c) What is the `global-error.js` file, and what special HTML elements must its component render that a regular error boundary does not?

d) Do error boundaries catch errors from event handlers? Why or why not?

---

### 18. Error boundary code (2 pts)

Write the complete `error.tsx` file for the route `app/restaurants/[id]/error.tsx` as shown in the slides, including the directive, the props type, and the JSX that displays an error message and a "Try again" button.

---

### 19. Image optimizations (2 pts)

According to the slides, the Next.js `<Image>` component extends the HTML `<img>` element. List the four key feature categories of `<Image>` optimization mentioned in the slides. Also, what is the difference between local and remote images regarding width/height configuration?

---

### 20. Font optimizations (1 pt)

According to the slides, what does the `next/font` module do, and what two sources can you import fonts from? Show the code pattern for applying a Google font to the root layout.

---

### 21. Route Handlers (3 pts)

a) What file do you create to define a Route Handler, and where does it live?

b) List all the HTTP methods Route Handlers support according to the slides.

c) According to the slides, there is one important restriction about where `route.js` can exist relative to `page.js`. What is it?

d) Name two use cases for Route Handlers from the slides.

---

### 22. Redux Toolkit -- `configureStore` and `createSlice` (3 pts)

a) According to the slides, what two main functions does Redux Toolkit (RTK) expose?

b) What library does `createSlice` use internally that allows you to write immutable code using "mutating" syntax?

c) Given the `todosSlice` code from the slides, how are action creators exported? Write the exact export line.

d) Write the `configureStore` setup from the slides that combines `todosReducer` and `filtersReducer`.

---

## Answer Key

### 1. Server to Client boundary

By **passing a Server Component as props** (e.g., `children`) to the Client Component, which then renders the Server Component. Rendering a Server Component is considered a "one way street" -- once the transition to client has been made, you cannot go back.

What determines if it is a Server Component or not is **where the component was imported**.

---

### 2. Code analysis -- component composition

a) It works because `RestaurantCard` is **passed as props** (`children`) to `InteractiveList`. The Server Component (`RestaurantsPage`) renders both components -- it passes `RestaurantCard` elements as children to the Client Component. The Client Component does not import or render the Server Component directly; it just renders `{children}`.

b) `InteractiveList` needs `'use client'` because it uses `useState` (a React hook) and `onClick` (an event handler), which only work in Client Components. `RestaurantCard` does not need it because it is a Server Component that uses `async/await` and `fetch` to get data on the server -- it never sends JavaScript to the browser.

---

### 3. Third-party components

a) Problems occur **when you render these components within server components**. It won't cause any problems if you render them within other client components.

b) Wrap the component using the `'use client'` directive:

```tsx
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

---

### 4. Fetching data -- Server vs. Client

**Server Components:**
1. The `fetch` API
2. An ORM / Database
3. Reading from the filesystem using `fs`

**Client Components:**
1. React's `use` API
2. A community library such as SWR or React Query
3. `useEffect` with `fetch`

---

### 5. Server-side data fetching with `fetch()`

1. Turn your component into an **asynchronous function** (`async`)
2. **Await** the fetch call

Fetch responses are **not automatically cached**, but the route is pre-rendered and output cached.

---

### 6. Server-side data fetching with ORM

```tsx
const restaurant = await db.restaurant.findFirst({
  where: {
    name: "McDonald's"
  }
});
```

---

### 7. Client-side data fetching with `use` API

Four steps:
1. Start by fetching data in your Server component, and pass the **promise** to your Client Component as prop
2. The Client Component takes the Promise it received as a prop
3. The Client Component passes the promise to the `use` API
4. This allows the Client Component to read the value from the Promise that was initially created by the Server Component

Filled-in code:

```tsx
<Message messagePromise={messagePromise} />
```

```tsx
import { use } from 'react';

const messageContent = use(messagePromise);
```

---

### 8. Client-side data fetching with SWR

The three destructured values are: `data: restaurant`, `error`, and `isLoading`.

The `fetcher` function is:
```tsx
const fetcher = (url: string) => fetch(url).then(res => res.json());
```
It takes a URL, calls `fetch`, and returns the parsed JSON response.

---

### 9. Choosing client side vs. server side

**Best practice:** "Combine both worlds, try to load as much as possible server side but opt for client side when needed."

**Server-side reasons (any two):**
- Initial page load data
- SEO-critical content
- Private/sensitive data
- Direct database access

**Client-side reasons (any two):**
- User interactions (search, filters)
- Real-time updates
- Dynamic data after initial load

---

### 10. Server Functions -- definition

A Server Function is **an asynchronous function that runs on the server**. They can be called from the client through a network request, which is why they must be asynchronous.

Four key facts:
1. They are also called **Server Actions** when used in the context of handling form submissions and mutations
2. They use **HTTP POST by default**, and that is the only way to invoke them
3. They remind us of **RPC / Remote Procedure Calls** which look like you are calling a function, but in reality you are making a network request to a server
4. They can be **invoked inside Client Components and Server Components** by importing them from their relative path

---

### 11. Server Functions -- declaration

1. In their **own file** -- mark the top of the file with `'use server'`
2. **Inside a Server Component** -- mark the function declaration with `'use server'`

It is **not possible** to declare Server Functions inside a Client Component. However, Server Functions can be invoked inside Client Components by importing them, or they can be passed as props to Client Components from another component.

---

### 12. Server Functions -- `createRestaurant`

a) Because it is declared in its **own file** (a dedicated actions file). When `'use server'` is at the top of the file, all exported functions in that file are Server Functions.

b) `revalidatePath('/restaurants')` **revalidates the cache** for the `/restaurants` path so that the page will show the new data after a restaurant is created.

c) The Client Component pattern from the slides:

```tsx
// app/components/add-restaurant-form.tsx
'use client';

import { createRestaurant } from '@/app/actions/restaurants';
import { useState } from 'react';

export default function AddRestaurantForm() {
  const [error, setError] = useState<string>();

  async function handleSubmit(formData: FormData) {
    const result = await createRestaurant(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setError(undefined);
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Restaurant Name" required />
      <input name="cuisine" placeholder="Cuisine Type" required />
      <input name="location" placeholder="Location" required />
      <button type="submit">Add Restaurant</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

---

### 13. Server Functions -- side effects

1. **Showing a pending state** -- `useActionState` hook with `pending` + `startTransition`
2. **Refreshing the page** -- `refresh()` from `next/cache` (refreshes the client router; does not revalidate tagged data)
3. **Revalidating the cache** -- `revalidatePath()` from `next/cache`
4. **Redirecting to another page** -- `redirect()` from `next/navigation`

---

### 14. Showing a pending state with `useActionState`

```tsx
const [state, action, pending] = useActionState(createRestaurant, null);

<button onClick={() => startTransition(action)}>
  {pending ? <LoadingSpinner /> : 'Create Restaurant'}
</button>
```

The three blanks are all `pending`, `startTransition`, and `pending`.

---

### 15. Errors in Next.js -- two categories

1. **Expected errors** -- errors that can occur during the normal operation of the application, such as those from server-side form validation or failed requests. These should be **handled explicitly and returned to the client**.

2. **Uncaught exceptions** -- unexpected errors that indicate bugs or issues that should not occur during the normal flow of the application. These should be **handled by throwing errors, which will then be caught by error boundaries**.

---

### 16. Handling expected exceptions

1. **Server Functions** -- handled through the use of the `useActionState` hook
2. **Server Components** -- use the response to conditionally render an error message or redirect
3. **Client Components** -- make use of community libraries like SWR to handle errors and react accordingly, or wrap `fetch()` calls in `try...catch` and react accordingly

---

### 17. Error boundaries

a) An `error.js` (or `error.tsx`) file inside a route segment, exporting a React component.

b) The two props are:
- `error`: `Error & { digest?: string }` -- the error object
- `reset`: `() => void` -- a function to attempt re-rendering the component

c) `global-error.js` is a **catch-all error boundary** that catches errors at the global level. Its component must render `<html>` and `<body>` tags (because it replaces the root layout when active), unlike a regular error boundary.

d) Error boundaries **do not catch errors from event handlers** because they are designed to catch errors **during rendering**.

---

### 18. Error boundary code

```tsx
// app/restaurants/[id]/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong while loading the restaurant!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
```

---

### 19. Image optimizations

Four key feature categories:
1. **Size Optimization** -- automatically serves correctly sized images for each device; uses modern formats like WebP and AVIF
2. **Visual Stability** -- prevents layout shift during image loading; reserves space automatically
3. **Faster Page Loads** -- lazy loading using native browser APIs; only loads images when they enter the viewport; optional blur-up placeholders
4. **Asset Flexibility** -- on-demand image resizing; works with remote images from any server

**Local images:** Stored in the project (e.g., `/public` folder). Next.js automatically determines width and height. No configuration needed. Optimized at build time.

**Remote images:** Hosted on external servers. Must specify width and height **explicitly**. Must configure allowed domains in `next.config.js`.

---

### 20. Font optimizations

The `next/font` module **automatically optimizes your fonts and removes external network requests** for improved privacy and performance.

Two sources: `next/font/local` and `next/font/google`.

Code pattern:

```tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

---

### 21. Route Handlers

a) A `route.js` (or `route.ts`) file inside the `app` directory.

b) `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`.

c) There **cannot be a `route.js` file at the same route segment level as `page.js`**. Route Handlers can be nested anywhere inside the app directory, similar to `page.js` and `layout.js`, but not at the same level as `page.js`.

d) Any two from the slides:
- Building REST APIs
- External integrations (webhooks)
- Third-party access to your data
- OAuth/authentication flows

---

### 22. Redux Toolkit -- `configureStore` and `createSlice`

a) `configureStore` and `createSlice`.

b) The **Immer** library, which allows you to write immutable code using "mutating" syntax.

c) The exact export line:
```tsx
export const { todoAdded, todoToggled } = todosSlice.actions
export default todosSlice.reducer
```

d) The `configureStore` setup:
```tsx
import { configureStore } from '@reduxjs/toolkit'
import todosReducer from '../features/todos/todosSlice'
import filtersReducer from '../features/filters/filtersSlice'

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    filters: filtersReducer,
  },
})
```
