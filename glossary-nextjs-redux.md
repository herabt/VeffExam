# Glossary: Vefforritun 2 -- Next.js, React & State Management

Comprehensive glossary based on lecture slides (pages 480--830). Each term includes the teacher's definition and code examples from the slides.

---

## 1. Next.js Routing

### App Router (File-Based Routing)

**Definition:** Next.js uses a **file-system based router** where **folders** are used to define routes. Each folder represents a **route segment** that maps to a **URL segment**. A nested route is created by nesting folders inside each other.

### Routing Files

| File | Purpose (from slides) |
|------|----------------------|
| `layout.tsx` | Shared UI for a segment and its children. Wraps child routes. Does NOT re-render on navigation. Must accept a `children` prop. The root layout must contain `<html>` and `<body>` tags. |
| `page.tsx` | Unique UI of a route and makes the route **publicly accessible**. By default, pages are Server Components. |
| `loading.tsx` | Loading UI for a segment -- creates a loading state built on **React Suspense**. Shown instantly while content loads. Wraps `page.tsx` in a `<Suspense>` boundary automatically. |
| `not-found.tsx` | Not found UI for a segment. Rendered when the `notFound()` function is thrown. |
| `error.tsx` | Error UI for a segment. Catches **uncaught exceptions** in child components. Must be a **Client Component** (`"use client"`). Receives `error` and `reset` props. |
| `global-error.tsx` | Global error UI. Catches errors in the **root layout**. Must include its own `<html>` and `<body>` tags. Must be a Client Component. |
| `route.ts` | Server-side API endpoint. Supports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`. Cannot coexist with `page.tsx` in the same folder. |
| `template.tsx` | Similar to layout but **re-renders** on navigation. Creates a new instance for each child on navigation. |
| `default.tsx` | Fallback UI for **Parallel Routes** when Next.js cannot recover a slot's active state after a full-page load. |

### Component Hierarchy

The slides show that files in a route segment are rendered in a specific hierarchy:

```
layout.tsx
  template.tsx
    error.tsx (React error boundary)
      loading.tsx (React suspense boundary)
        not-found.tsx (React error boundary)
          page.tsx
```

### Route Groups

**Definition:** Folders wrapped in parentheses `(folderName)` are **route groups**. They organize routes **without affecting the URL path**.

- `(marketing)/about/page.tsx` -> URL: `/about`
- `(shop)/products/page.tsx` -> URL: `/products`
- Useful for organizing routes into groups (e.g., by team, feature, section)
- Can create different layouts for different groups
- Can create **multiple root layouts** by removing the top-level layout and adding layouts inside each route group

### Dynamic Routes

**Definition:** When you don't know the exact segment names ahead of time and want to create routes from dynamic data, you can use **Dynamic Segments** that are filled in at request time or prerendered at build time.

| Convention | URL Example | `params` |
|-----------|-------------|----------|
| `[slug]` | `/blog/post-1` | `{ slug: 'post-1' }` |
| `[...slug]` | `/blog/a/b/c` | `{ slug: ['a', 'b', 'c'] }` (catch-all) |
| `[[...slug]]` | `/blog` or `/blog/a/b` | `{ slug: undefined }` or `{ slug: ['a', 'b'] }` (optional catch-all) |

```tsx
// app/blog/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <div>My Post: {slug}</div>;
}
```

---

## 2. Navigation

### Server Rendering Strategies

**Static Rendering (Default):**
- Routes are rendered at **build time** or in the background after data revalidation
- Result is cached and can be pushed to a CDN
- Useful when data is not personalized and can be known at build time (e.g., static blog post, product page)

**Dynamic Rendering:**
- Routes are rendered for each user at **request time**
- Useful when data is personalized or has information that can only be known at request time (e.g., cookies, URL search params)
- Next.js automatically switches to dynamic rendering when a **dynamic function** is detected (e.g., `cookies()`, `headers()`, `searchParams`)

### Prefetching

**Definition:** Prefetching is a way to **preload a route in the background** before the user visits it.

- `<Link>` components automatically **prefetch** routes when they become visible in the viewport
- Static routes: the entire route is prefetched and cached by default
- Dynamic routes: only the shared layout down until the first `loading.tsx` is prefetched and cached for 30 seconds

### Streaming

**Definition:** Streaming allows you to **progressively render UI** from the server. Work is split into chunks and streamed to the client as it becomes ready. This allows the user to see parts of the page immediately, before the entire content has finished rendering.

- Built into Next.js App Router by default
- `loading.tsx` automatically enables streaming for route segments
- Can also use `<Suspense>` manually for more granular streaming

### loading.tsx

**Definition:** The special file `loading.tsx` helps you create meaningful Loading UI with **React Suspense**. It shows a loading state **instantly** from the server while the content of a route segment loads. The new content is **automatically swapped in** once rendering is complete.

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <LoadingSkeleton />;
}
```

### `<Link>` vs `<a>`

**`<Link>` component:**
- Extends the HTML `<a>` tag to provide **prefetching** and **client-side navigation** between routes
- Primary way to navigate between routes in Next.js
- Imported from `next/link`
- Enables **soft navigation** -- only the changed segments re-render (partial rendering). Client-side state is preserved.

```tsx
import Link from 'next/link';

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>;
}
```

**`<a>` tag:**
- Standard HTML anchor tag
- Causes a **full page reload** (hard navigation)
- Does not prefetch
- Loses client-side state

### Client-Side Transitions

- When using `<Link>`, Next.js performs a **client-side navigation** (no full page reload)
- The **router cache** stores the React Server Component payload for previously visited routes AND prefetched routes
- On navigation, the cache is reused instead of making a new request to the server
- Shared layouts are **not re-rendered** on navigation -- only the segments that change are re-rendered (**partial rendering**)

---

## 3. Server Components

**Definition:** Server Components are the **default** in the App Router. They allow you to render components on the server and **reduce the amount of JavaScript sent to the client**.

### Characteristics
- Rendered on the server
- Can directly access backend resources (databases, file system, etc.)
- Can use `async/await` for data fetching
- Cannot use hooks (`useState`, `useEffect`, etc.)
- Cannot use browser APIs
- Cannot use event handlers (`onClick`, `onChange`, etc.)

### Benefits (from slides)
- **Data Fetching:** Move data fetching to the server, closer to your data source, reducing time to fetch and number of requests the client needs to make
- **Security:** Keep sensitive data and logic on the server (tokens, API keys, etc.)
- **Caching:** Results can be cached and reused on subsequent requests and across users
- **Performance:** Reduce client-side JavaScript bundle size. No additional client-side JavaScript needed for these components.
- **Initial Page Load & First Contentful Paint (FCP):** Generate HTML on server for immediate display
- **SEO:** Rendered HTML can be used by search engine bots to index pages
- **Streaming:** Split rendering work into chunks and stream them to the client

### When to Use
- Fetch data
- Access backend resources directly
- Keep sensitive information on the server
- Keep large dependencies on the server / Reduce client-side JavaScript

### Code Example (from slides)

```tsx
// This is a Server Component (default, no directive needed)
async function ProductPage() {
  const products = await db.product.findMany();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

---

## 4. Client Components

**Definition:** Client Components allow you to write **interactive UI** that is prerendered on the server and can use client JavaScript to run in the browser. Declared with the `"use client"` directive at the top of the file.

### Characteristics
- Declared with `"use client"` at the **top of the file**, before any imports
- Can use hooks (`useState`, `useEffect`, `useReducer`, etc.)
- Can use event handlers (`onClick`, `onChange`, etc.)
- Can use browser APIs (`window`, `document`, `localStorage`, etc.)
- Are still pre-rendered (SSR) on the server first, then hydrated on the client

### Benefits (from slides)
- **Interactivity:** Can use state, effects, and event listeners
- **Browser APIs:** Access to `window`, `document`, `localStorage`, geolocation, etc.

### When to Use
- Add interactivity and event listeners (`onClick`, `onChange`, etc.)
- Use state and lifecycle effects (`useState`, `useReducer`, `useEffect`)
- Use browser-only APIs
- Use custom hooks that depend on state, effects, or browser-only APIs
- Use React Class components

### "use client" Directive

**Definition:** The `"use client"` directive declares a **boundary** between Server and Client Component modules. Once you define a `"use client"` in a file, **all other modules imported into it**, including child components, are considered part of the client bundle.

```tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Server vs Client Component Decision (from slides)

| What do you need to do? | Server Component | Client Component |
|------------------------|-----------------|-----------------|
| Fetch data | Yes | No |
| Access backend resources directly | Yes | No |
| Keep sensitive information on server | Yes | No |
| Keep large dependencies on server | Yes | No |
| Add interactivity and event listeners | No | Yes |
| Use State and Lifecycle Effects | No | Yes |
| Use browser-only APIs | No | Yes |
| Use custom hooks that depend on state/effects/browser APIs | No | Yes |

---

## 5. Data Fetching

### Server-Side Data Fetching

**Definition:** Data fetching on the server is recommended. You can fetch data directly in Server Components using `async/await` with `fetch`, an ORM, or a database client.

**Using fetch:**

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data');

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <main>{/* use data */}</main>;
}
```

**Using ORM / database directly:**

```tsx
import { db } from '@/lib/db';

export default async function Page() {
  const products = await db.product.findMany();
  return <ProductList products={products} />;
}
```

**Benefits of server-side data fetching (from slides):**
- Direct access to backend data sources (databases, file systems)
- More secure -- no tokens or API keys exposed to the client
- Fetch and render in the same environment, reducing back-and-forth between client and server
- Multiple data fetches in a single round-trip instead of multiple individual requests on the client
- Reduce client-server waterfalls

### Client-Side Data Fetching

**Definition:** Client-side data fetching is needed when you need to fetch data in response to user interaction, or when data needs to be updated frequently without full page reloads.

**Options:**
- **Route Handlers (API routes):** Call from Client Components using `fetch()` or libraries. The route handler runs on the server, so you don't expose tokens to the client.
- **SWR / React Query:** Third-party libraries for client-side data fetching with caching, revalidation, and optimistic updates
- **`useEffect`:** For simple client-side data fetching

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);

  return <div>{/* use data */}</div>;
}
```

---

## 6. Server Actions

**Definition:** Server Actions are **asynchronous functions** that are executed on the **server**. They can be called in Server and Client Components to handle **form submissions and data mutations** in Next.js applications.

### "use server" Directive

**Definition:** A Server Action is defined with the `"use server"` directive. You can place the directive at the top of an **async function** to mark it as a Server Action, or at the top of a **separate file** to mark all exports of that file as Server Actions.

```tsx
// Inline Server Action in a Server Component
export default function Page() {
  async function createItem(formData: FormData) {
    'use server';
    const name = formData.get('name');
    await db.item.create({ data: { name } });
  }

  return (
    <form action={createItem}>
      <input name="name" />
      <button type="submit">Add Item</button>
    </form>
  );
}
```

```tsx
// Separate file for Server Actions
'use server';

export async function createItem(formData: FormData) {
  const name = formData.get('name');
  await db.item.create({ data: { name } });
}
```

### useActionState

**Definition:** `useActionState` is a React hook that allows you to update state based on the result of a **form action**. It takes an existing action function as well as an initial state, and returns a new action and form state to use in your form. The form state is also passed to the action function when invoked.

```tsx
'use client';

import { useActionState } from 'react';
import { createItem } from '@/app/actions';

const initialState = { message: '' };

export default function Form() {
  const [state, formAction, isPending] = useActionState(
    createItem,
    initialState
  );

  return (
    <form action={formAction}>
      <input name="name" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Adding...' : 'Add Item'}
      </button>
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
```

### FormData

**Definition:** Server Actions receive the `FormData` object automatically when invoked from a form. You use `formData.get('fieldName')` to extract values.

```tsx
async function createUser(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  // ...
}
```

### Side Effects: revalidatePath / redirect / refresh

**`revalidatePath(path)`:**
- Purges the cached data for a specific path
- Used after a mutation to ensure the page shows updated data

**`redirect(path)`:**
- Redirects the user to a different URL
- Can be used after a form submission to navigate to a result page

```tsx
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  await db.post.create({ data: { title } });

  revalidatePath('/posts');   // Revalidate the posts page
  redirect('/posts');          // Redirect to the posts page
}
```

---

## 7. Forms

### Traditional Multi-Step Approach (from slides)
1. User fills out form
2. User submits form
3. Validate input (client-side and/or server-side)
4. If invalid, show errors
5. If valid, process data (save to database, send email, etc.)
6. Redirect or show success message

### Server Actions with Validation

```tsx
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

export async function createUser(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields.',
    };
  }

  // Process the data...
  revalidatePath('/users');
  return { message: 'User created successfully' };
}
```

### react-hook-form

**Definition:** `react-hook-form` is a performant, flexible, and extensible library for handling forms in React. It minimizes re-renders and provides built-in validation.

**Key APIs:**

- **`useForm()`:** The main hook. Returns `register`, `handleSubmit`, `formState`, `control`, etc.
- **`register`:** Registers an input field and its validation rules.
- **`handleSubmit`:** Handles form submission. Takes a callback that receives the validated data.
- **`formState: { errors }`:** Contains validation errors for display.

```tsx
'use client';

import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
};

export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: 'Name is required' })} />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email', { required: 'Email is required' })} />
      {errors.email && <span>{errors.email.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Zod Resolver

**Definition:** The `zodResolver` connects Zod validation schemas to `react-hook-form`, so you can define your validation logic with Zod and have it automatically enforced.

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

### MUI Controller

**Definition:** When using Material UI (MUI) components with `react-hook-form`, you need the `Controller` component because MUI components don't expose a `ref` the way native inputs do. `Controller` wraps the MUI component and connects it to `react-hook-form`.

```tsx
import { Controller, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';

export default function MuiForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{ required: 'Name is required' }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Name"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### CRITICAL: Multi-step Form with FormProvider / useFormContext (from slides)

```tsx
"use client";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const billingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
});
const shippingSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});
const checkoutSchema = billingSchema.merge(shippingSchema);
type CheckoutValues = z.infer<typeof checkoutSchema>;
```

```tsx
// Child step components use useFormContext() to access form methods
function BillingStep({ onNext }) {
  const { register, trigger, formState: { errors } } = useFormContext();
  const handleNext = async () => {
    const valid = await trigger(["fullName", "email", "cardNumber"]); // validate only these fields
    if (valid) onNext();
  };
  return (
    <div>
      <input {...register("fullName")} />
      {errors.fullName && <p>{errors.fullName.message}</p>}
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

function ReviewStep() {
  const { getValues } = useFormContext();  // read values without submit
  const values = getValues();
  return <p>Name: {values.fullName}, Email: {values.email}</p>;
}
```

```tsx
// Parent wraps with FormProvider
export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const methods = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fullName: "", email: "", cardNumber: "", address: "", city: "", postalCode: "" },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {step === 1 && <BillingStep onNext={() => setStep(2)} />}
        {step === 2 && <ShippingStep onNext={() => setStep(3)} />}
        {step === 3 && <ReviewStep />}
      </form>
    </FormProvider>
  );
}
```

**Key methods for multi-step:**
- **FormProvider**: wraps the form, spreads `{...methods}` to share form state with children
- **useFormContext()**: child components use this to access `register`, `trigger`, `formState`, `getValues`
- **trigger(["field1", "field2"])**: manually validate specific fields (for per-step validation)
- **getValues()**: read current form values without submitting
- **defaultValues**: set initial values in `useForm()`

---

## 8. Error Handling

### Expected Errors vs Uncaught Exceptions (from slides)

**Expected Errors:**
- Errors that can occur during normal operation (e.g., form validation failures, failed API requests)
- Should be handled explicitly with return values -- not with `try/catch` or throwing
- Model as **return values** from Server Actions and handle in the UI
- Use `useActionState` to manage state and display errors

**Uncaught Exceptions:**
- Unexpected bugs that should not happen during normal flow
- Caught by **error boundaries** (`error.tsx` files)
- The root `error.tsx` does NOT catch errors in the root `layout.tsx` -- use `global-error.tsx` for that

### error.tsx

**Definition:** The `error.tsx` file convention handles **unexpected runtime errors**. It must be a **Client Component**. It wraps the route segment and its children in a **React Error Boundary**. It receives two props: `error` (the error object) and `reset` (a function to attempt re-rendering the segment).

```tsx
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
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### global-error.tsx

**Definition:** Catches errors in the **root layout**. Since it replaces the root layout when active, it must define its own `<html>` and `<body>` tags.

```tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

### notFound()

**Definition:** The `notFound()` function throws an error that renders the `not-found.tsx` component within the route segment. It is used to indicate that a requested resource does not exist.

```tsx
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id: params.id } });

  if (!product) {
    notFound(); // Renders the closest not-found.tsx
  }

  return <div>{product.name}</div>;
}
```

```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}
```

---

## 9. Redux Toolkit (RTK)

### Redux Core Concepts (Mock Exam Appendix A1 — 6 pts)

These are the EXACT terms the teacher tests. Know these definitions:

**Connected Components:** Components linked to the Redux store via `useSelector` / `useDispatch` (or legacy `connect()`). They read state and dispatch actions without prop drilling.

**Actions:** Plain objects describing *what happened*: `{ type: 'cart/add', payload: item }`. The ONLY way to signal a state change.

**Reducers:** Pure functions `(state, action) => newState` that define how state changes for each action type. No side effects allowed.

**Dispatch:** The method that sends an action to the store: `dispatch(action)`. Routes the action through reducers to produce new state.

**Flux / Unidirectional Data Flow:**
View/UI → Action → dispatch() → Reducer → Store → View/UI (one direction only, never backwards)

**Middleware:** Functions that intercept dispatched actions before they reach the reducer. Used for async logic (thunks), logging, etc. `configureStore` automatically adds `redux-thunk` middleware.

**Thunk:** A function that returns another function instead of an action object. Used for async operations (API calls). The inner function receives `dispatch` and `getState` as arguments:
```typescript
const fetchUser = createAsyncThunk('user/fetch', async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});
```

### configureStore

**Definition:** `configureStore` wraps `createStore` to provide simplified configuration options and good defaults. It automatically combines slice reducers, adds Redux middleware (including `redux-thunk`), and enables the Redux DevTools Extension.

```tsx
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import todosReducer from './features/todos/todosSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### createSlice

**Definition:** `createSlice` accepts an object of reducer functions, a slice name, and an initial state value, and automatically generates a **slice reducer** with corresponding **action creators** and **action types**. It uses **Immer** internally, so you can write "mutating" logic in reducers.

```tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1; // "Mutating" is OK thanks to Immer
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

### Immer

**Definition:** Immer is a library that allows you to write code that "mutates" state directly, but behind the scenes produces a **new immutable state**. RTK uses Immer in `createSlice` automatically. You can write `state.value += 1` instead of `return { ...state, value: state.value + 1 }`.

- You can write "mutating" logic in reducers -- Immer converts it to immutable updates
- Makes reducer logic simpler and more readable
- You must either **mutate** the existing state OR **return** a new value, but not both

### RTK Query

**Definition:** RTK Query is a powerful **data fetching and caching tool** built into Redux Toolkit. It is designed to simplify common cases for loading data in a web application, eliminating the need to hand-write data fetching and caching logic yourself.

- Built on top of Redux Toolkit
- Eliminates the need to write `createAsyncThunk` + `extraReducers` for data fetching
- Automatic caching, refetching, polling, and invalidation
- Auto-generated React hooks

```tsx
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: ['Posts'],
    }),
    addPost: builder.mutation({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Posts'],
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = apiSlice;
```

### createAsyncThunk

**Definition:** `createAsyncThunk` generates a **thunk action creator** that dispatches `pending`, `fulfilled`, and `rejected` action types automatically based on the promise lifecycle. Used for handling async logic like API calls.

```tsx
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetch('/api/users');
    return response.json();
  }
);
```

### extraReducers

**Definition:** `extraReducers` allows a slice to respond to **action types that were not generated by the slice's own reducers** -- such as actions from `createAsyncThunk`. Uses a builder callback pattern.

```tsx
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    entities: [],
    loading: 'idle',    // 'idle' | 'pending' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      });
  },
});
```

### useSelector / useDispatch

**`useSelector`:**
- Hook to **read data** from the Redux store
- Takes a selector function that receives the entire state and returns the part you need
- Re-renders the component when the selected value changes

**`useDispatch`:**
- Hook to get the **dispatch function** to dispatch actions to the store

```tsx
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { increment, decrement } from '@/store/counterSlice';

export default function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}
```

---

## 10. Zustand

### create

**Definition:** Zustand is a **small, fast, and scalable** state management library. The `create` function creates a store with state and actions. Unlike Redux, Zustand does not require providers, reducers, or action types. The store is a hook.

```tsx
import { create } from 'zustand';

interface BearState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));
```

### Selectors

**Definition:** Zustand recommends using **selectors** to pick specific state slices. This optimizes re-renders because the component only re-renders when the selected value changes.

```tsx
// Select a single value
const bears = useBearStore((state) => state.bears);

// Select an action
const increasePopulation = useBearStore((state) => state.increasePopulation);
```

### useShallow

**Definition:** `useShallow` is used when selecting **multiple values** from the store. Without it, selecting an object would cause re-renders on every state change because a new object reference is created each time. `useShallow` does a **shallow comparison**.

```tsx
import { useShallow } from 'zustand/react/shallow';

// Without useShallow - re-renders on ANY state change
const { bears, fish } = useBearStore((state) => ({
  bears: state.bears,
  fish: state.fish,
})); // BAD: creates new object each time

// With useShallow - only re-renders when bears or fish change
const { bears, fish } = useBearStore(
  useShallow((state) => ({
    bears: state.bears,
    fish: state.fish,
  }))
);
```

### Persist Middleware

**Definition:** The `persist` middleware saves the Zustand store to a storage backend (e.g., `localStorage`) and automatically rehydrates it on page load.

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useBearStore = create(
  persist(
    (set) => ({
      bears: 0,
      increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    }),
    {
      name: 'bear-storage', // key in localStorage
    }
  )
);
```

### Devtools Middleware

**Definition:** The `devtools` middleware connects the Zustand store to the **Redux DevTools** browser extension for debugging and time-travel.

```tsx
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useBearStore = create(
  devtools(
    (set) => ({
      bears: 0,
      increasePopulation: () => set(
        (state) => ({ bears: state.bears + 1 }),
        false,
        'increasePopulation' // action name in DevTools
      ),
    }),
    { name: 'BearStore' }
  )
);
```

### Using Zustand Outside React

**Definition:** Zustand stores can be used **outside of React components** because the store is just a plain JavaScript object with methods. You can call `getState()` and `setState()` directly.

```tsx
// Outside React
const bears = useBearStore.getState().bears;
useBearStore.setState({ bears: 10 });

// Subscribe to changes
const unsub = useBearStore.subscribe(
  (state) => console.log('Bears:', state.bears)
);
```

### CRITICAL: Zustand Shopping Cart (mock Q14 = 8 points!)

```typescript
// Store definition with persist
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem { id: number; name: string; price: number; quantity: number; }

interface CartStore {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  total: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addItem: (item) => set((state) => {
        const existing = state.cart.find(i => i.id === item.id);
        if (existing) {
          return { cart: state.cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
      }),
      removeItem: (id) => set((state) => ({ cart: state.cart.filter(i => i.id !== id) })),
      clearCart: () => set({ cart: [] }),
      total: () => get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'cart-storage' }  // persists to localStorage
  )
);
```

```tsx
// Component using selectors (each selector = separate subscription = no unnecessary re-renders)
function CartPage() {
  const cart = useCartStore((s) => s.cart);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.total);

  return (
    <div>
      {cart.map(item => (
        <div key={item.id}>
          {item.name} x{item.quantity} - ${item.price * item.quantity}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${total()}</p>
    </div>
  );
}
```

### Zustand Slices Pattern (from slides)

Split large stores into "slices" and combine them:

```typescript
const createCartSlice = (set, get) => ({
  cart: [],
  addItem: (item) => set((state) => ({ cart: [...state.cart, item] })),
});

const createCheckoutSlice = (set, get) => ({
  step: 1,
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  // Cross-slice action using get():
  addItemAndCheckout: (item) => {
    get().addItem(item);  // call cart slice action
    get().nextStep();
  },
});

const useStore = create((...a) => ({
  ...createCartSlice(...a),
  ...createCheckoutSlice(...a),
}));
```

### Zustand: Map/Set Update Gotcha (from slides)

When using `Map` or `Set` as state, you MUST create a new instance:

```typescript
// WRONG - mutates existing Map, same reference, NO re-render
addItem: (item) => set((state) => {
  state.cart.set(item.id, item);  // mutation!
  return { cart: state.cart };     // same reference!
}),

// CORRECT - creates new Map, triggers re-render
addItem: (item) => set((state) => ({
  cart: new Map(state.cart).set(item.id, item),  // new reference
})),
```

### Zustand: Module-level Actions (from slides)

Actions can be defined outside the store:

```typescript
// Instead of inside create():
export const addItem = (item) => useCartStore.setState((state) => ({
  cart: [...state.cart, item],
}));
```

---

## 11. Context API

### Definition (from slides)

React Context provides a way to **pass data through the component tree without having to pass props down manually at every level** (prop drilling).

### Pros
- Built into React -- no third-party library needed
- Simple API: `createContext`, `Provider`, `useContext`
- Good for **low-frequency** state changes (theme, locale, auth)
- Straightforward for small applications

### Cons / Problems

**Re-render Issues:**
- When Context value changes, **ALL components** consuming that context re-render, even if they only use a part of the value that didn't change
- No built-in mechanism for selecting specific parts of the context value (no selectors)
- Leads to unnecessary re-renders and performance problems

**"Context Hell":**
- Multiple nested providers create deeply nested component trees
- Also known as "Provider Hell" or "Wrapper Hell"

```tsx
// "Context Hell" example from slides
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <RouterProvider>
            <NotificationProvider>
              <AnalyticsProvider>
                <MyApp />
              </AnalyticsProvider>
            </NotificationProvider>
          </RouterProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

### When to Use
- Theming (light/dark mode)
- Current authenticated user
- Locale/language preferences
- Data that is truly global and changes infrequently
- When the app is small enough that re-render issues are negligible

---

## 12. State Management Comparison

### Context vs Redux vs Zustand (from slides)

| Feature | Context API | Redux Toolkit | Zustand |
|---------|------------|---------------|---------|
| **Setup** | Minimal (built-in) | Moderate (store, slices, Provider) | Minimal (single `create` call) |
| **Boilerplate** | Low | Medium-High | Very Low |
| **Bundle Size** | 0 (built into React) | ~11kB (RTK + React-Redux) | ~1kB |
| **Re-render Optimization** | Poor (all consumers re-render) | Good (useSelector with shallow compare) | Good (selectors, useShallow) |
| **DevTools** | React DevTools only | Redux DevTools (time-travel, action log) | Redux DevTools via middleware |
| **Middleware** | None built-in | Yes (thunk, etc.) | Yes (persist, devtools, immer, etc.) |
| **Async Logic** | Manual (useEffect) | createAsyncThunk / RTK Query | Manual or middleware |
| **Learning Curve** | Easy | Steeper | Easy |
| **Scalability** | Limited (for large apps) | Excellent | Good |
| **Provider Needed** | Yes (Context.Provider) | Yes (Redux Provider) | No (just import and use) |
| **Use Outside React** | No | Yes (store.getState/dispatch) | Yes (getState/setState) |
| **Best For** | Small apps, low-frequency global state | Large apps, complex state logic | Small-to-medium apps, simplicity |

### CRITICAL: State Management Decision Tree (from slides)

Use this flowchart to choose the right approach:

1. **Small app with minimal shared state?** → **Context API**
2. **State changes frequently (cart, real-time, UI state)?** → Context is OUT (re-render problems)
3. **Large team (5+ devs) or strict structure needed?** → **Redux Toolkit**
4. **Need advanced debugging (action logs, time-travel)?** → **Redux Toolkit**
5. **Complex async flows or business logic?** → **Redux with createAsyncThunk**
6. **Otherwise (most React apps)?** → **Zustand**

### Redux Issues (from slides)
- High boilerplate even with RTK
- Overkill for small to medium apps
- Requires Provider wrapping: `<Provider store={store}><App /></Provider>`
- Steeper learning curve

### Zustand Issues (from slides)
- Less structured, no enforced conventions
- No built-in support for derived/computed state
- DevTools less powerful than Redux
- Can get messy without discipline

### Immutability in Redux (from slides — WHY RTK exists)

```javascript
// ILLEGAL in Redux reducers — direct mutation
state.value = 123;  // NEVER do this

// SAFE — return new object
return { ...state, value: 123 };

// DEEPLY NESTED becomes nightmare:
return {
  ...state,
  first: {
    ...state.first,
    second: {
      ...state.first.second,
      value: 123  // 4 levels of spreading!
    }
  }
};

// RTK with Immer solves this — write "mutating" code, Immer handles immutability:
state.first.second.value = 123;  // looks like mutation, but Immer produces new state
```

---

## 13. Promises

### Definition (from slides)

A **Promise** is an object representing the **eventual completion or failure** of an asynchronous operation. It is a returned object to which you attach callbacks, instead of passing callbacks into a function.

### Three States

| State | Description |
|-------|-------------|
| **pending** | Initial state -- neither fulfilled nor rejected. The operation has not completed yet. |
| **fulfilled** | The operation completed **successfully**. The promise has a resulting value. |
| **rejected** | The operation **failed**. The promise has a reason for failure (error). |

A promise is **settled** when it is either fulfilled or rejected (not pending).

### Creating a Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // Async operation
  const success = true;

  if (success) {
    resolve('Operation succeeded!');
  } else {
    reject('Operation failed!');
  }
});
```

### Chaining (.then / .catch / .finally)

**Definition:** Promises can be **chained** using `.then()`, `.catch()`, and `.finally()`. Each `.then()` returns a new promise, allowing sequential async operations.

```js
fetch('/api/user')
  .then((response) => response.json())   // returns a new Promise
  .then((data) => {
    console.log(data);
    return fetch(`/api/posts/${data.id}`);
  })
  .then((response) => response.json())
  .then((posts) => console.log(posts))
  .catch((error) => console.error('Error:', error))
  .finally(() => console.log('Done'));
```

- `.then(onFulfilled, onRejected)` -- called when the promise is fulfilled (or rejected)
- `.catch(onRejected)` -- called when the promise is rejected (syntactic sugar for `.then(undefined, onRejected)`)
- `.finally(onFinally)` -- called when the promise is settled (fulfilled or rejected), regardless of outcome

### Promise Static Methods

**`Promise.all(iterable)`:**
- Takes an iterable of promises and returns a single promise
- Resolves when **ALL** promises resolve; rejects if **ANY** promise rejects
- Returns an array of results in the same order
- "Fail-fast" behavior

```js
const [users, posts, comments] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/comments').then(r => r.json()),
]);
```

**`Promise.race(iterable)`:**
- Settles as soon as the **first** promise settles (fulfilled or rejected)
- Returns the value/reason of the first settled promise

```js
const result = await Promise.race([
  fetch('/api/fast'),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  ),
]);
```

**`Promise.any(iterable)`:**
- Resolves as soon as the **first** promise **fulfills**
- Only rejects if **ALL** promises reject (AggregateError)

```js
const fastest = await Promise.any([
  fetch('https://server1.com/data'),
  fetch('https://server2.com/data'),
  fetch('https://server3.com/data'),
]);
```

**`Promise.allSettled(iterable)`:**
- Waits for **ALL** promises to settle (fulfilled or rejected)
- Never rejects -- always resolves with an array of results
- Each result is `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`

```js
const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/will-fail'),
  fetch('/api/posts'),
]);

results.forEach((result) => {
  if (result.status === 'fulfilled') {
    console.log('Success:', result.value);
  } else {
    console.log('Failed:', result.reason);
  }
});
```

### async / await

**Definition:** `async/await` is **syntactic sugar** over Promises. An `async` function always returns a Promise. The `await` keyword pauses execution of the async function until the Promise settles.

```js
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('User not found');
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
```

- `async` makes a function return a Promise
- `await` pauses the function execution until the Promise is resolved
- Error handling with `try/catch` instead of `.catch()`
- Makes asynchronous code look and behave more like synchronous code

---

## 14. Event Loop

### Definition (from slides)

JavaScript is **single-threaded** -- it can only execute one piece of code at a time. The **Event Loop** is the mechanism that allows JavaScript to perform **non-blocking** operations despite being single-threaded, by offloading operations to the browser/system kernel.

### Call Stack

**Definition:** The **call stack** is a data structure that records **where in the program we are**. When we call a function, it is pushed onto the stack. When the function returns, it is popped off the stack. JavaScript executes whatever is on top of the stack. The call stack is **LIFO** (Last In, First Out).

### Web APIs

**Definition:** **Web APIs** are provided by the browser (not by JavaScript itself). They handle async operations like `setTimeout`, `fetch`, DOM events, etc. When you call `setTimeout()`, the browser handles the timer, and when it completes, the callback is placed in the appropriate queue.

### Microtask Queue

**Definition:** The **microtask queue** (also called the "job queue") holds callbacks from:
- **Promise** callbacks (`.then`, `.catch`, `.finally`)
- `queueMicrotask()`
- `MutationObserver`

Microtasks have **higher priority** than macrotasks. After each task from the call stack completes, the event loop processes **ALL** microtasks before moving to the next macrotask.

### Macrotask Queue (Task Queue / Callback Queue)

**Definition:** The **macrotask queue** (also called "task queue" or "callback queue") holds callbacks from:
- `setTimeout`
- `setInterval`
- `setImmediate` (Node.js)
- I/O operations
- UI rendering events
- `requestAnimationFrame`

### Execution Order

The event loop follows this order:

1. Execute all code in the **Call Stack** (synchronous code)
2. When the call stack is empty, process **ALL** tasks in the **Microtask Queue**
3. Then process **ONE** task from the **Macrotask Queue**
4. Go back to step 2 (check microtask queue again)
5. Repeat

```js
console.log('1');                          // Sync - Call Stack

setTimeout(() => console.log('2'), 0);     // Macrotask Queue

Promise.resolve().then(() => console.log('3')); // Microtask Queue

console.log('4');                          // Sync - Call Stack

// Output: 1, 4, 3, 2
```

**Explanation:**
1. `console.log('1')` -- executes immediately (synchronous)
2. `setTimeout` callback -- sent to Web API, then to **Macrotask Queue**
3. `Promise.then` callback -- sent to **Microtask Queue**
4. `console.log('4')` -- executes immediately (synchronous)
5. Call stack empty -> process Microtask Queue: `console.log('3')`
6. Microtask Queue empty -> process one Macrotask: `console.log('2')`

### More Complex Example (from slides)

```js
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    return Promise.resolve();
  })
  .then(() => {
    console.log('Promise 2');
  });

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

console.log('End');

// Output: Start, End, Promise 1, Promise 2, Timeout 1, Timeout 2
```

---

## 15. Fetch API

### Definition (from slides)

The **Fetch API** provides an interface for fetching resources (including across the network). It provides a more powerful and flexible feature set than `XMLHttpRequest`.

### Returns a Promise

**Definition:** `fetch()` returns a **Promise** that resolves to a `Response` object. This Promise **only rejects on network failure** (e.g., no internet connection). It does NOT reject on HTTP error status codes (404, 500, etc.).

```js
const response = await fetch('https://api.example.com/data');
// response is a Response object, NOT the data
```

### response.json() Returns a Promise

**Definition:** `response.json()` returns **another Promise** that resolves to the result of parsing the response body text as JSON. This is why you need two `await` calls (or two `.then()` calls).

```js
const response = await fetch('/api/data');    // First Promise
const data = await response.json();           // Second Promise
```

### response.ok

**Definition:** `response.ok` is a boolean property that is `true` if the HTTP status code is in the range **200-299** (successful responses). Since `fetch` does not reject on HTTP errors, you must check `response.ok` manually.

```js
const response = await fetch('/api/data');

if (!response.ok) {
  throw new Error(`HTTP error! Status: ${response.status}`);
}

const data = await response.json();
```

### Network Errors vs HTTP Errors

**Network Errors:**
- The Promise returned by `fetch()` **rejects**
- Caused by: no internet, DNS failure, CORS issues, server unreachable
- Caught by `catch()` or `try/catch`

**HTTP Errors (4xx, 5xx):**
- The Promise **resolves** normally (with a Response object)
- `response.ok` is `false`
- `response.status` contains the error code (e.g., 404, 500)
- You must check `response.ok` manually

```js
try {
  const response = await fetch('/api/data');

  // HTTP errors - fetch does NOT reject for these
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
} catch (error) {
  // Network errors (fetch rejects) OR errors we threw above
  console.error('Fetch failed:', error);
}
```

### Fetch with Options (from slides)

```js
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ title: 'New Post', content: 'Hello!' }),
});
```

---

## 16. Design Patterns

### Factory Pattern

**Definition:** The Factory pattern provides an interface for creating objects **without specifying the exact class** of object that will be created. A factory method handles object creation and returns the created object. The client does not need to know the details of how the object is created.

```js
class Car {
  constructor(make, model) {
    this.make = make;
    this.model = model;
    this.type = 'car';
  }
}

class Truck {
  constructor(make, model) {
    this.make = make;
    this.model = model;
    this.type = 'truck';
  }
}

class VehicleFactory {
  createVehicle(type, make, model) {
    switch (type) {
      case 'car':
        return new Car(make, model);
      case 'truck':
        return new Truck(make, model);
      default:
        throw new Error('Unknown vehicle type');
    }
  }
}

const factory = new VehicleFactory();
const myCar = factory.createVehicle('car', 'Toyota', 'Corolla');
const myTruck = factory.createVehicle('truck', 'Ford', 'F-150');
```

### Singleton Pattern

**Definition:** The Singleton pattern ensures a class has **only one instance** and provides a **global point of access** to it. Subsequent calls to the constructor return the same instance.

```js
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    this.data = [];
    Singleton.instance = this;
  }

  addData(item) {
    this.data.push(item);
  }

  getData() {
    return this.data;
  }
}

const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true
```

### Decorator Pattern

**Definition:** The Decorator pattern allows you to **add new behavior to objects dynamically** by wrapping them in decorator objects. It provides a flexible alternative to subclassing for extending functionality. Decorators wrap the original object and add additional behavior before or after delegating to the original.

```js
class Coffee {
  cost() { return 5; }
  description() { return 'Simple coffee'; }
}

class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  cost() { return this.coffee.cost() + 2; }
  description() { return this.coffee.description() + ', milk'; }
}

class SugarDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  cost() { return this.coffee.cost() + 1; }
  description() { return this.coffee.description() + ', sugar'; }
}

let myCoffee = new Coffee();
myCoffee = new MilkDecorator(myCoffee);
myCoffee = new SugarDecorator(myCoffee);
console.log(myCoffee.cost());        // 8
console.log(myCoffee.description()); // "Simple coffee, milk, sugar"
```

### Facade Pattern

**Definition:** The Facade pattern provides a **simplified interface** to a complex subsystem. It hides the complexity of the system and provides a single, easy-to-use interface to the client. The facade delegates client requests to appropriate subsystem objects.

```js
// Complex subsystem
class CPU {
  freeze() { console.log('CPU frozen'); }
  jump(position) { console.log(`CPU jumping to ${position}`); }
  execute() { console.log('CPU executing'); }
}

class Memory {
  load(position, data) { console.log(`Memory loading ${data} at ${position}`); }
}

class HardDrive {
  read(lba, size) { return 'boot data'; }
}

// Facade
class ComputerFacade {
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }

  start() {
    this.cpu.freeze();
    this.memory.load(0, this.hardDrive.read(0, 1024));
    this.cpu.jump(0);
    this.cpu.execute();
  }
}

// Client only needs to know about the facade
const computer = new ComputerFacade();
computer.start();
```

### Flyweight Pattern

**Definition:** The Flyweight pattern minimizes memory usage by **sharing as much data as possible** with similar objects. It uses sharing to support large numbers of fine-grained objects efficiently. The shared state is called **intrinsic** state, and the unique state is called **extrinsic** state.

```js
class TreeType {
  constructor(name, color, texture) {
    this.name = name;       // Intrinsic (shared)
    this.color = color;     // Intrinsic (shared)
    this.texture = texture; // Intrinsic (shared)
  }

  draw(x, y) {
    console.log(`Drawing ${this.name} at (${x}, ${y})`);
  }
}

class TreeFactory {
  constructor() {
    this.treeTypes = {};
  }

  getTreeType(name, color, texture) {
    const key = `${name}-${color}-${texture}`;
    if (!this.treeTypes[key]) {
      this.treeTypes[key] = new TreeType(name, color, texture);
    }
    return this.treeTypes[key]; // Return shared instance
  }
}

class Tree {
  constructor(x, y, type) {
    this.x = x;       // Extrinsic (unique)
    this.y = y;       // Extrinsic (unique)
    this.type = type;  // Reference to shared TreeType
  }
}
```

### Iterator Pattern

**Definition:** The Iterator pattern provides a way to **access the elements of a collection sequentially** without exposing its underlying representation. It defines a standard interface (`next()`, `hasNext()`) for traversing a collection.

```js
class Iterator {
  constructor(items) {
    this.items = items;
    this.index = 0;
  }

  hasNext() {
    return this.index < this.items.length;
  }

  next() {
    return this.items[this.index++];
  }
}

const iterator = new Iterator([1, 2, 3, 4, 5]);

while (iterator.hasNext()) {
  console.log(iterator.next());
}

// JavaScript built-in iterators (Symbol.iterator)
const arr = [1, 2, 3];
for (const item of arr) {
  console.log(item); // Uses the built-in iterator
}
```

### Observer / Pub-Sub Pattern

**Definition (Observer):** The Observer pattern defines a **one-to-many dependency** between objects so that when one object (the **subject**) changes state, all its dependents (the **observers**) are **notified and updated automatically**.

**Definition (Pub-Sub):** The Publish-Subscribe pattern is similar to Observer but adds a **message broker / event channel** between publishers and subscribers. Publishers and subscribers **don't need to know about each other** -- they communicate through the event channel.

**Key Difference:** In Observer, the subject directly notifies observers. In Pub-Sub, there is an intermediary (event bus/broker) that handles the communication.

```js
// Observer Pattern
class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }
}

const emitter = new EventEmitter();

emitter.on('userLoggedIn', (user) => {
  console.log(`${user.name} logged in`);
});

emitter.on('userLoggedIn', (user) => {
  console.log(`Send welcome email to ${user.email}`);
});

emitter.emit('userLoggedIn', { name: 'Jon', email: 'jon@example.com' });
```

### Mediator Pattern

**Definition:** The Mediator pattern defines an object (the **mediator**) that **encapsulates how a set of objects interact**. It promotes **loose coupling** by keeping objects from referring to each other explicitly, and lets you vary their interaction independently. Instead of objects communicating directly, they communicate through the mediator.

```js
class ChatRoom {
  constructor() {
    this.users = {};
  }

  register(user) {
    this.users[user.name] = user;
    user.chatRoom = this;
  }

  send(message, from, to) {
    if (to) {
      // Direct message
      to.receive(message, from);
    } else {
      // Broadcast to all users except sender
      Object.values(this.users).forEach((user) => {
        if (user !== from) {
          user.receive(message, from);
        }
      });
    }
  }
}

class User {
  constructor(name) {
    this.name = name;
    this.chatRoom = null;
  }

  send(message, to) {
    this.chatRoom.send(message, this, to);
  }

  receive(message, from) {
    console.log(`${from.name} to ${this.name}: ${message}`);
  }
}

const chatRoom = new ChatRoom();
const alice = new User('Alice');
const bob = new User('Bob');

chatRoom.register(alice);
chatRoom.register(bob);

alice.send('Hello Bob!', bob);   // "Alice to Bob: Hello Bob!"
alice.send('Hello everyone!');    // Broadcast to all except Alice
```

---

## Quick Reference: Pattern Summary Table

| Pattern | Type | Purpose |
|---------|------|---------|
| **Factory** | Creational | Create objects without specifying exact class |
| **Singleton** | Creational | Ensure only one instance exists |
| **Decorator** | Structural | Add behavior to objects dynamically |
| **Facade** | Structural | Simplify interface to complex subsystem |
| **Flyweight** | Structural | Share data to minimize memory usage |
| **Iterator** | Behavioral | Access collection elements sequentially |
| **Observer / Pub-Sub** | Behavioral | Notify dependents of state changes |
| **Mediator** | Behavioral | Centralize complex communication between objects |
