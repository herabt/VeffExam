# Next.js App Router — Complete Exam Study Guide

**Target: 100% on the final exam.**

---

## Table of Contents

1. [App Router vs Pages Router](#1-app-router-vs-pages-router)
2. [File-System Routing & Special Files](#2-file-system-routing--special-files)
3. [Server Components vs Client Components](#3-server-components-vs-client-components)
4. [Dynamic Routes](#4-dynamic-routes)
5. [Route Groups](#5-route-groups)
6. [Parallel & Intercepting Routes](#6-parallel--intercepting-routes)
7. [Data Fetching & Caching](#7-data-fetching--caching)
8. [Server Actions](#8-server-actions)
9. [Rendering Strategies: SSR, SSG, ISR, CSR](#9-rendering-strategies-ssr-ssg-isr-csr)
10. [Streaming & Suspense](#10-streaming--suspense)
11. [Metadata API & generateMetadata](#11-metadata-api--generatemetadata)
12. [generateStaticParams](#12-generatestaticparams)
13. [Middleware](#13-middleware)
14. [Route Handlers (route.ts)](#14-route-handlers-routets)
15. [Error Handling](#15-error-handling)
16. [Navigation](#16-navigation)
17. [Image & Font Optimization](#17-image--font-optimization)
18. [Likely Exam Questions & Answers](#18-likely-exam-questions--answers)
19. [Cheat Sheet](#19-cheat-sheet)

---

## 1. App Router vs Pages Router

| Feature | App Router (`/app`) | Pages Router (`/pages`) |
|---------|---------------------|-------------------------|
| Default since | Next.js 13 | Next.js pre-13 |
| Components | Server Components by default | Client Components by default |
| Data fetching | `async/await` directly in component | `getServerSideProps`, `getStaticProps` |
| Layouts | Nested `layout.tsx` files | `_app.tsx`, custom per-page |
| Loading states | `loading.tsx` (automatic Suspense) | Manual |
| Error handling | `error.tsx` (automatic boundary) | Custom `_error.tsx` |
| Streaming | Built-in | Not supported |
| Parallel routes | `@folder` convention | Not supported |
| Intercepting routes | `(.)folder` convention | Not supported |

**Rule of thumb:** Use the App Router for all new projects. The exam focuses entirely on App Router.

---

## 2. File-System Routing & Special Files

### How Routing Works

Folder structure = URL structure. Every `page.tsx` inside `app/` makes a route publicly accessible.

```
app/
  page.tsx              → /
  about/
    page.tsx            → /about
  blog/
    page.tsx            → /blog
    [slug]/
      page.tsx          → /blog/:slug
  dashboard/
    layout.tsx          → shared wrapper for all /dashboard/* routes
    page.tsx            → /dashboard
    settings/
      page.tsx          → /dashboard/settings
```

### Component Hierarchy (MEMORIZE THIS ORDER)

When Next.js renders a route, files are nested in this EXACT order:

```
layout.tsx
  template.tsx
    error.tsx           (React Error Boundary)
      loading.tsx       (React Suspense Boundary)
        not-found.tsx   (React Error Boundary)
          page.tsx
```

### All 9 Special Files

| File | Purpose | Key Details |
|------|---------|-------------|
| `layout.tsx` | Shared UI wrapping child routes | Does NOT re-render on navigation. Must accept `children` prop. Root layout must have `<html>` and `<body>`. |
| `page.tsx` | Unique UI for a route. Makes route publicly accessible | Server Component by default. |
| `loading.tsx` | Loading skeleton shown while page loads | Automatically wraps `page.tsx` in `<Suspense>`. Shown instantly from server. |
| `error.tsx` | Error boundary for uncaught exceptions | MUST be `"use client"`. Receives `error` and `reset` props. Does NOT catch root layout errors. |
| `global-error.tsx` | Error boundary for root layout errors | MUST be `"use client"`. Must include `<html>` and `<body>` tags itself. |
| `not-found.tsx` | UI shown when `notFound()` is called | Rendered by calling `notFound()` from `next/navigation`. |
| `route.ts` | Server-side API endpoint (Route Handler) | Cannot coexist with `page.tsx` in the same folder. |
| `template.tsx` | Like layout but creates NEW instance on every navigation | Re-renders on navigation. Use when you need per-navigation state reset. |
| `default.tsx` | Fallback for Parallel Routes when slot state cannot be recovered | Used with `@folder` parallel routes. |

### layout.tsx — Root Layout (Code)

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>Navigation here</nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### loading.tsx (Code)

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div>
      <div className="skeleton-header" />
      <div className="skeleton-content" />
    </div>
  );
}
```

Behind the scenes, Next.js automatically wraps `page.tsx` with `<Suspense fallback={<Loading />}>`.

### error.tsx (Code)

```tsx
// app/dashboard/error.tsx
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

**Key facts about error.tsx:**
- MUST have `'use client'` directive
- `reset()` attempts to re-render the segment
- Does NOT catch errors from event handlers (only from rendering)
- Does NOT catch errors in the root layout — use `global-error.tsx` for that

### not-found.tsx (Code)

```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>404 — Page Not Found</h2>
      <p>Could not find requested resource.</p>
    </div>
  );
}
```

```tsx
// Triggered in any page/component:
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  if (!product) {
    notFound(); // Renders the nearest not-found.tsx
  }

  return <div>{product.name}</div>;
}
```

### template.tsx vs layout.tsx

| | layout.tsx | template.tsx |
|-|------------|--------------|
| Re-renders on navigation | NO (preserves state) | YES (creates new instance) |
| Use when | Persistent sidebar, auth context | Per-page animations, reset state on navigate |

---

## 3. Server Components vs Client Components

### The Decision Table (from slides — know this cold)

| What do you need? | Server Component | Client Component |
|-------------------|:---:|:---:|
| Fetch data | YES | No |
| Access backend resources (DB, filesystem) | YES | No |
| Keep sensitive info (API keys, tokens) on server | YES | No |
| Reduce client-side JS bundle | YES | No |
| Add interactivity and event listeners (`onClick`) | No | YES |
| Use state (`useState`, `useReducer`) | No | YES |
| Use lifecycle effects (`useEffect`) | No | YES |
| Use browser-only APIs (`window`, `localStorage`) | No | YES |
| Use custom hooks that depend on state/effects | No | YES |

### Server Components

**Default in App Router — no directive needed.**

```tsx
// app/products/page.tsx — Server Component (no 'use client' needed)
async function ProductsPage() {
  // Fetch data DIRECTLY — no useEffect, no useState
  const products = await db.product.findMany();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

export default ProductsPage;
```

**Can do:**
- `async/await` at component level
- Direct database/ORM queries
- Access environment variables (`process.env.SECRET_KEY`)
- Import large server-only libraries without bloating the client bundle
- Access filesystem (`fs`)

**Cannot do:**
- `useState`, `useEffect`, `useReducer`, `useCallback`, `useMemo` — any hook
- Event handlers: `onClick`, `onChange`, `onSubmit`
- Browser APIs: `window`, `document`, `localStorage`, `navigator`

**Benefits:**
- Zero JavaScript sent to client for server-only components
- Better SEO (content is in HTML from the start)
- Faster First Contentful Paint (FCP)
- Data is fetched server-side — no client-server roundtrips

### Client Components

**Marked with `"use client"` at the top of the file, before any imports.**

```tsx
// app/components/counter.tsx
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

**The `"use client"` directive creates a boundary.** Once declared in a file, ALL modules imported into that file become part of the client bundle.

**Still rendered on the server first (SSR), then hydrated on the client.** They are NOT browser-only — they run server-side for initial HTML, then become interactive in the browser.

### Composing: Passing Server Components into Client Components

You CANNOT import a Server Component inside a Client Component. But you CAN pass a Server Component as `children` props:

```tsx
// app/page.tsx — Server Component
import InteractiveWrapper from './InteractiveWrapper';
import ServerData from './ServerData'; // Server Component

export default function Page() {
  // ServerData is passed as children — this is valid!
  return (
    <InteractiveWrapper>
      <ServerData />
    </InteractiveWrapper>
  );
}
```

```tsx
// app/InteractiveWrapper.tsx — Client Component
'use client';
import { useState } from 'react';

export default function InteractiveWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)}>Toggle</button>
      {open && children}
    </div>
  );
}
```

This works because the Server Component is passed as a **prop**, not imported inside the Client Component.

### Third-Party Library Components

Third-party libraries (MUI, Bootstrap, etc.) are not built for Next.js. Problems occur when rendering them inside Server Components. Solution: wrap them in a Client Component:

```tsx
// app/components/carousel-wrapper.tsx
'use client';

import { Carousel } from 'acme-carousel';

export default Carousel;
```

Then import `CarouselWrapper` instead of `Carousel` directly.

---

## 4. Dynamic Routes

### Three Types

| Syntax | URL Example | `params` value | Description |
|--------|-------------|----------------|-------------|
| `[slug]` | `/blog/my-post` | `{ slug: 'my-post' }` | Single dynamic segment |
| `[...slug]` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` | Catch-all — requires at least one segment |
| `[[...slug]]` | `/docs` or `/docs/a/b` | `undefined` or `['a', 'b']` | Optional catch-all — works with zero segments too |

### Code Example

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // params is now a Promise in Next.js 15+
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

```tsx
// app/docs/[[...slug]]/page.tsx — Optional catch-all
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  // slug is undefined when visiting /docs
  // slug is ['api', 'reference'] when visiting /docs/api/reference
  const path = slug?.join('/') ?? 'index';

  return <div>Viewing: {path}</div>;
}
```

---

## 5. Route Groups

Wrap a folder name in parentheses `(folderName)` to create a route group. The group name does NOT appear in the URL.

**Use cases:**
- Organize routes by feature/team without affecting URLs
- Apply different layouts to different sections
- Create multiple root layouts

```
app/
  (marketing)/
    layout.tsx       ← Marketing layout (no sidebar)
    about/
      page.tsx       → /about
    landing/
      page.tsx       → /landing
  (dashboard)/
    layout.tsx       ← Dashboard layout (with sidebar)
    settings/
      page.tsx       → /settings
    profile/
      page.tsx       → /profile
```

```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

Note: `(marketing)/about/page.tsx` maps to `/about`, NOT `/(marketing)/about`.

---

## 6. Parallel & Intercepting Routes

### Parallel Routes

Use `@folderName` to define named slots that can be rendered simultaneously in the same layout.

```
app/
  layout.tsx
  @analytics/
    page.tsx
  @team/
    page.tsx
  page.tsx
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="side-panels">
        {analytics}
        {team}
      </div>
    </div>
  );
}
```

**`default.tsx`:** Fallback rendered when Next.js cannot recover a slot's active state after a full-page load.

### Intercepting Routes

Show a route within another route's context (e.g., open a photo in a modal without leaving the feed).

| Convention | Intercepts |
|------------|-----------|
| `(.)slug` | Same level |
| `(..)slug` | One level up |
| `(..)(..)slug` | Two levels up |
| `(...)slug` | From root |

---

## 7. Data Fetching & Caching

### Server-Side Data Fetching (Preferred)

```tsx
// Method 1: fetch() with caching options
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache',      // SSG: cache indefinitely (default)
    // cache: 'no-store',       // SSR: never cache, always fresh
    // next: { revalidate: 60 } // ISR: revalidate every 60 seconds
  });

  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <main>{/* use data */}</main>;
}
```

```tsx
// Method 2: ORM / Database directly
import { db } from '@/lib/db';

export default async function Page() {
  const restaurants = await db.restaurant.findMany();
  return <RestaurantList restaurants={restaurants} />;
}
```

```tsx
// Method 3: Filesystem
import fs from 'fs';

export default async function Page() {
  const content = fs.readFileSync('data.json', 'utf-8');
  return <div>{content}</div>;
}
```

### Caching Behaviors

| Option | Behavior | Rendering Strategy |
|--------|----------|--------------------|
| `cache: 'force-cache'` (default) | Cached indefinitely, served from cache | SSG |
| `cache: 'no-store'` | Never cached, always fresh data | SSR (Dynamic) |
| `next: { revalidate: N }` | Cached, revalidated every N seconds | ISR |
| `next: { tags: ['tag'] }` | Cached, revalidated when tag is purged | ISR with tag-based revalidation |

### revalidatePath vs revalidateTag

```tsx
// revalidatePath: purge cache for a specific URL path
import { revalidatePath } from 'next/cache';

revalidatePath('/posts');       // Revalidates /posts page
revalidatePath('/blog/[slug]', 'page'); // Revalidates all blog post pages

// revalidateTag: purge all fetches tagged with a specific tag
import { revalidateTag } from 'next/cache';

// When fetching:
const res = await fetch('/api/posts', { next: { tags: ['posts'] } });

// When data changes:
revalidateTag('posts'); // Purges ALL fetches with tag 'posts'
```

### Client-Side Data Fetching

**Three options from slides:**
1. React's `use` API (promise from Server Component passed as prop)
2. SWR or React Query
3. `useEffect` with `fetch`

```tsx
// Option 1: React use() API — streaming from server to client
// Server Component passes a Promise, Client Component reads it
// app/page.tsx (Server Component)
import { fetchMessage } from './lib';
import { Message } from './message';

export default function App() {
  const messagePromise = fetchMessage(); // Start fetch, don't await
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}

// app/message.tsx (Client Component)
'use client';
import { use } from 'react';

export function Message({ messagePromise }: { messagePromise: Promise<string> }) {
  const message = use(messagePromise); // Suspends until resolved
  return <p>{message}</p>;
}
```

```tsx
// Option 2: SWR
'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function RestaurantPage() {
  const { data: restaurant, error, isLoading } = useSWR('/api/restaurant', fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return <div>{restaurant.name}</div>;
}
```

```tsx
// Option 3: useEffect
'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{data?.name}</div>;
}
```

**Best practice (from slides):** "Combine both worlds — try to load as much as possible server-side but opt for client-side when needed."

**Server-side reasons:** Initial page load data, SEO-critical content, private/sensitive data, direct database access.
**Client-side reasons:** User interactions (search, filters), real-time updates, dynamic data after initial load.

---

## 8. Server Actions

### Definition

A Server Action is an **async function marked with `"use server"`** that runs on the server and can be called directly from Client Components or forms. Also called "Server Functions."

Key facts:
- They use **HTTP POST** by default — the only way to invoke them
- They remind us of **RPC / Remote Procedure Calls** — looks like a function call, is actually a network request
- Can be invoked from both Server and Client Components

### Declaration — Two Locations

**Location 1: In a dedicated file (all exports become Server Actions)**

```tsx
// app/actions/restaurants.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createRestaurant(formData: FormData) {
  const name = formData.get('name') as string;
  const cuisine = formData.get('cuisine') as string;

  if (!name || !cuisine) {
    return { error: 'All fields are required' };
  }

  await db.restaurant.create({ data: { name, cuisine } });
  revalidatePath('/restaurants');
  redirect('/restaurants');
}
```

**Location 2: Inline inside a Server Component**

```tsx
// app/page.tsx — Server Component
export default function Page() {
  async function createItem(formData: FormData) {
    'use server'; // Directive on the FUNCTION, not the file
    const name = formData.get('name') as string;
    await db.item.create({ data: { name } });
    revalidatePath('/');
  }

  return (
    <form action={createItem}>
      <input name="name" placeholder="Item name" />
      <button type="submit">Add</button>
    </form>
  );
}
```

**Cannot declare Server Actions inside Client Components** — only invoke them via import or props.

### Using Server Actions from Client Components

```tsx
// app/components/add-restaurant-form.tsx
'use client';

import { createRestaurant } from '@/app/actions/restaurants';
import { useState } from 'react';

export default function AddRestaurantForm() {
  const [error, setError] = useState<string>();

  async function handleSubmit(formData: FormData) {
    const result = await createRestaurant(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Restaurant Name" required />
      <input name="cuisine" placeholder="Cuisine Type" required />
      <button type="submit">Add Restaurant</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

### useActionState (formerly useFormState)

`useActionState` is a React hook that manages state from a Server Action. It returns `[state, formAction, isPending]`.

```tsx
'use client';

import { useActionState } from 'react';
import { createRestaurant } from '@/app/actions/restaurants';

const initialState = { message: '' };

export default function CreateForm() {
  const [state, formAction, isPending] = useActionState(
    createRestaurant,
    initialState
  );

  return (
    <form action={formAction}>
      <input name="name" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Restaurant'}
      </button>
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
```

For button-triggered (non-form) pending state, use `startTransition`:

```tsx
'use client';
import { useActionState, startTransition } from 'react';
import { createRestaurant } from '@/app/actions/restaurants';

export function CreateRestaurantButton() {
  const [state, action, pending] = useActionState(createRestaurant, null);

  return (
    <div>
      <button onClick={() => startTransition(action)}>
        {pending ? 'Loading...' : 'Create Restaurant'}
      </button>
      {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
    </div>
  );
}
```

### Server Action Side Effects (4 options from slides)

| Side Effect | Function | Import |
|-------------|----------|--------|
| Show pending state | `useActionState` + `startTransition` | `react` |
| Refresh the page | `router.refresh()` | `next/navigation` |
| Revalidate cache by path | `revalidatePath('/path')` | `next/cache` |
| Redirect to another page | `redirect('/path')` | `next/navigation` |

### Server Actions with Zod Validation

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
      message: 'Validation failed.',
    };
  }

  const { name, email } = validatedFields.data;
  await db.user.create({ data: { name, email } });
  revalidatePath('/users');
  return { message: 'User created successfully' };
}
```

### Server Actions vs API Routes

| | Server Action | API Route (`route.ts`) |
|-|---------------|------------------------|
| Called from | React components, forms | External services, mobile apps |
| Uses | `"use server"` | HTTP verbs (GET, POST, etc.) |
| Form support | Native (`<form action={fn}>`) | Must fetch manually |
| When to use | Form submissions, mutations from app | Webhooks (Stripe), public REST API, mobile apps |

**Exam tip:** If a form is inside your Next.js app → Server Action. If Stripe/external service needs to send data to you → API Route.

---

## 9. Rendering Strategies: SSR, SSG, ISR, CSR

### Quick Reference

| Strategy | When rendered | Cached? | Data freshness | fetch option |
|----------|---------------|---------|----------------|--------------|
| **SSG** (Static Site Generation) | Build time | Yes (CDN) | Stale until rebuild | `cache: 'force-cache'` (default) |
| **SSR** (Server-Side Rendering) | Every request | No | Always fresh | `cache: 'no-store'` |
| **ISR** (Incremental Static Regeneration) | Build time + background | Yes, with TTL | Fresh every N seconds | `next: { revalidate: N }` |
| **CSR** (Client-Side Rendering) | In browser | No | On demand | Client fetch (SWR/useEffect) |

### SSG — Static Site Generation

```tsx
// app/blog/[slug]/page.tsx
// Rendered at build time — fastest, cheapest, great for SEO
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetch(`https://api.example.com/posts/${slug}`, {
    cache: 'force-cache', // default — cache result indefinitely
  }).then(r => r.json());

  return <article><h1>{post.title}</h1></article>;
}

// generateStaticParams makes ALL paths static at build time
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}
```

### SSR — Server-Side Rendering (Dynamic Rendering)

```tsx
// app/dashboard/page.tsx
// Rendered fresh on every request
// Triggered automatically when you use: cookies(), headers(), searchParams
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const cookieStore = await cookies(); // ← this makes the route dynamic
  const userId = cookieStore.get('userId')?.value;

  const data = await fetch(`https://api.example.com/user/${userId}`, {
    cache: 'no-store', // Never cache — always fresh
  }).then(r => r.json());

  return <div>Hello, {data.name}</div>;
}
```

**Dynamic functions that automatically trigger SSR:**
- `cookies()`
- `headers()`
- `searchParams` (reading from page props)

### ISR — Incremental Static Regeneration

```tsx
// app/products/page.tsx
// Cached at build time, revalidated every 60 seconds in the background
export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  }).then(r => r.json());

  return <ProductList products={products} />;
}
```

### ISR with Tag-Based Revalidation (On-Demand)

```tsx
// Fetch with a tag
const products = await fetch('/api/products', {
  next: { tags: ['products'] },
}).then(r => r.json());

// In a Server Action — revalidate all fetches with tag 'products'
import { revalidateTag } from 'next/cache';

export async function updateProduct(formData: FormData) {
  'use server';
  await db.product.update({ ... });
  revalidateTag('products'); // Purges all cached fetches tagged 'products'
}
```

### How Next.js Determines Static vs Dynamic

- **Static route:** HTML is pre-generated at build time, same content for all users (e.g., `/about`)
- **Dynamic route:** Page rendered at request time, generates fresh data per request (e.g., `/products`)
- Next.js **automatically** switches to dynamic rendering when a dynamic function is detected

---

## 10. Streaming & Suspense

### What is Streaming?

Streaming allows the server to send parts of a dynamic route to the client **as soon as they're ready**, rather than waiting for the entire route to render. Users see content sooner.

**Built into Next.js App Router by default.**

### loading.tsx — Automatic Streaming

Creating `loading.tsx` in a folder automatically wraps `page.tsx` in a `<Suspense>` boundary:

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div className="skeleton">Loading dashboard...</div>;
}

// Next.js internally generates this:
// <Suspense fallback={<Loading />}>
//   <Page />
// </Suspense>
```

### Manual Suspense — Granular Streaming

For more control, use `<Suspense>` directly in your component:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { UserStats } from './UserStats';
import { RecentActivity } from './RecentActivity';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Each section streams independently */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <UserStats />
      </Suspense>
      <Suspense fallback={<div>Loading activity...</div>}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}
```

### Benefits of Streaming

- Users see something immediately (instant navigation)
- Shared layouts remain interactive while content loads
- Slow data fetches don't block fast ones
- Improved Core Web Vitals

### Prefetching

- `<Link>` components automatically **prefetch** routes when they enter the viewport
- **Static routes:** The entire route is prefetched and cached
- **Dynamic routes:** Only prefetched if `loading.tsx` exists — in that case, the layout and loading skeleton are prefetched for 30 seconds

---

## 11. Metadata API & generateMetadata

### Static Metadata

```tsx
// app/page.tsx or any layout/page
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  description: 'The best app on the internet',
  openGraph: {
    title: 'My App',
    description: 'The best app on the internet',
    images: ['/og-image.png'],
  },
};

export default function Page() {
  return <div>Hello</div>;
}
```

### Dynamic Metadata — generateMetadata

For pages where metadata depends on dynamic data (e.g., a blog post title):

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

// generateMetadata runs on the server — can fetch data
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(r => r.json());

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  // Component code...
}
```

### Metadata Merging

Metadata in child segments **merges with and overrides** parent metadata:

```tsx
// app/layout.tsx (root)
export const metadata: Metadata = { title: 'My App' };

// app/blog/page.tsx
export const metadata: Metadata = { title: 'Blog — My App' }; // overrides title
```

---

## 12. generateStaticParams

Used with dynamic routes to pre-generate static pages at build time (SSG).

```tsx
// app/blog/[slug]/page.tsx

// This tells Next.js which slugs to pre-generate at build time
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(r => r.json());
  return <article><h1>{post.title}</h1></article>;
}
```

**How it works:**
1. At build time, Next.js calls `generateStaticParams()`
2. For each returned object, Next.js pre-renders the page
3. The pre-rendered HTML is cached and served from CDN instantly
4. Any slug NOT in the pre-generated list: rendered on-demand (or 404, depending on `dynamicParams` setting)

**Nested dynamic routes:**

```tsx
// app/blog/[category]/[slug]/page.tsx
export async function generateStaticParams() {
  return [
    { category: 'tech', slug: 'intro-to-nextjs' },
    { category: 'food', slug: 'best-pizza-spots' },
  ];
}
```

---

## 13. Middleware

Middleware runs **before** a request is processed. It can rewrite, redirect, add headers, or handle auth.

**File location:** `middleware.ts` at the project root (same level as `app/`).

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  // Redirect to login if not authenticated
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add a custom header
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'my-value');
  return response;
}

// Control which routes middleware runs on
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

**Middleware can:**
- Redirect requests
- Rewrite URLs (A/B testing, internationalization)
- Add/modify request/response headers
- Read cookies

**Middleware CANNOT:**
- Access the database directly (no Node.js APIs)
- Use React components

---

## 14. Route Handlers (route.ts)

Route Handlers create server-side API endpoints. They replace `pages/api/` from the Pages Router.

**Supported methods:** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`

**IMPORTANT:** `route.ts` and `page.tsx` **cannot coexist** in the same folder.

```tsx
// app/api/restaurants/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const restaurants = await db.restaurant.findMany();
  return NextResponse.json(restaurants);
}

export async function POST(request: Request) {
  const body = await request.json();
  const restaurant = await db.restaurant.create({ data: body });
  return NextResponse.json(restaurant, { status: 201 });
}
```

```tsx
// app/api/restaurants/[id]/route.ts — Dynamic Route Handler
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurant = await db.restaurant.findUnique({ where: { id } });

  if (!restaurant) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(restaurant);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.restaurant.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
```

**When to use Route Handlers (not Server Actions):**
- Webhooks from external services (Stripe, GitHub)
- Public REST API consumed by mobile apps or third-party clients
- OAuth authentication flows
- Endpoints that need to be called by non-Next.js clients

---

## 15. Error Handling

### Two Categories (from slides — know these)

**1. Expected Errors** — Occur during normal operation
- Form validation failures
- API calls that return 404
- User-facing errors
- **Handle by returning error values**, NOT throwing

```tsx
// Server Action returning error (not throwing)
export async function createUser(prevState: any, formData: FormData) {
  'use server';
  const email = formData.get('email') as string;

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) {
    return { error: 'Email already in use' }; // Return, don't throw
  }

  await db.user.create({ data: { email } });
  return { success: true };
}
```

**2. Uncaught Exceptions** — Unexpected bugs
- Runtime errors that shouldn't happen in normal flow
- **Handle with error boundaries** (`error.tsx`)
- Caught by `error.tsx` automatically

### Where Expected Errors Can Occur (3 locations from slides)

| Location | Handling |
|----------|---------|
| **Server Actions** | Use `useActionState` to manage and display errors |
| **Server Components** | Conditionally render error message or use `redirect()` |
| **Client Components** | Use SWR's error state, or `try/catch` around `fetch()` |

### Error Boundaries

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
      <h2>Something went wrong loading this restaurant!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

**Key points:**
- `error.tsx` MUST be `'use client'`
- `reset()` attempts to re-render the segment
- Error boundaries do NOT catch errors from event handlers — only rendering errors
- `global-error.tsx` is needed to catch errors in the root `layout.tsx`
- `global-error.tsx` must render its own `<html>` and `<body>` tags

---

## 16. Navigation

### `<Link>` vs `<a>` Tag

| Feature | `<Link>` | `<a>` |
|---------|----------|-------|
| Prefetching | Yes (auto, when in viewport) | No |
| Client-side navigation | Yes (soft navigation) | No (full page reload) |
| Partial rendering | Only changed segments re-render | Full page reload |
| State preservation | Yes (shared layout state preserved) | No |
| Import | `import Link from 'next/link'` | HTML built-in |

```tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/blog/my-post">My Post</Link>
      {/* Dynamic link */}
      <Link href={`/products/${product.id}`}>{product.name}</Link>
    </nav>
  );
}
```

### Programmatic Navigation

```tsx
'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  );
}
```

### Router Cache

When navigating, Next.js caches React Server Component payloads for previously visited routes AND prefetched routes. On navigation, cache is reused — no new server request needed.

---

## 17. Image & Font Optimization

### `<Image>` Component

```tsx
import Image from 'next/image';

// Local image — width/height auto-detected
import profilePic from './profile.jpg';
<Image src={profilePic} alt="Profile" />

// Remote image — must specify width + height, must configure domain in next.config.js
<Image
  src="https://example.com/photo.jpg"
  alt="Photo"
  width={500}
  height={300}
/>
```

**Four optimization categories:**
1. **Size Optimization** — Automatically serves correctly sized images, uses WebP/AVIF
2. **Visual Stability** — Prevents layout shift (reserves space)
3. **Faster Page Loads** — Lazy loading by default (only loads when in viewport)
4. **Asset Flexibility** — On-demand resizing, works with remote images

### `next/font`

Automatically optimizes fonts and removes external network requests.

```tsx
// app/layout.tsx
import { Geist } from 'next/font/google';

const geist = Geist({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  );
}
```

**Two sources:** `next/font/google` and `next/font/local`

---

## 18. Likely Exam Questions & Answers

### Q: What is a Server Component? What can/cannot it do?

**Answer:** Server Components are the default in App Router. They run on the server, reduce JS sent to the client, and can use `async/await`, fetch data directly, access databases and environment variables. They CANNOT use hooks (`useState`, `useEffect`), event handlers (`onClick`), or browser APIs (`window`, `localStorage`).

---

### Q: What is the "use client" directive and what does it do?

**Answer:** `"use client"` is placed at the top of a file (before imports) to declare that file and all its imported modules as Client Components. It creates a boundary between server and client. Client Components can use hooks, event handlers, and browser APIs. They are still pre-rendered on the server (SSR) but are hydrated and made interactive in the browser.

---

### Q: What is a Server Action?

**Answer:** An async function marked with `"use server"` that runs on the server. Can be called directly from Client Components or used as a form `action`. Uses HTTP POST. Useful for form submissions and data mutations. Alternative to API Routes for internal app use.

---

### Q: When should you use an API Route instead of a Server Action?

**Answer:** Use an API Route when:
- Handling webhooks from external services (Stripe, GitHub)
- Building a public REST API for mobile apps or third-party clients
- Needing OAuth/authentication flows with external providers

Use Server Actions when:
- Form submissions from within the app
- Data mutations triggered by React components
- Revalidating cache after mutations

---

### Q: Describe the component hierarchy in Next.js App Router.

**Answer:** `layout.tsx` > `template.tsx` > `error.tsx` (error boundary) > `loading.tsx` (Suspense boundary) > `not-found.tsx` (error boundary) > `page.tsx`

---

### Q: What is the difference between layout.tsx and template.tsx?

**Answer:** `layout.tsx` does NOT re-render on navigation — it preserves state and stays mounted. `template.tsx` creates a new instance on every navigation — it re-renders each time a user navigates to a child route.

---

### Q: How does Next.js determine if a route is static or dynamic?

**Answer:** A route is static if the HTML is pre-generated at build time and serves the same content to all users. It is dynamic if Next.js detects dynamic functions like `cookies()`, `headers()`, or `searchParams`, which require rendering at request time.

---

### Q: What are the three types of dynamic route segments?

**Answer:**
- `[slug]` — Single param: `/blog/my-post` → `{ slug: 'my-post' }`
- `[...slug]` — Catch-all: `/shop/a/b/c` → `{ slug: ['a', 'b', 'c'] }`
- `[[...slug]]` — Optional catch-all: `/docs` → `{ slug: undefined }`, `/docs/a/b` → `{ slug: ['a', 'b'] }`

---

### Q: What is streaming? How do you enable it?

**Answer:** Streaming allows the server to send parts of a page as they become ready, rather than waiting for everything. Create `loading.tsx` in the route folder — Next.js automatically wraps `page.tsx` in `<Suspense>`. You can also use `<Suspense>` manually for more granular control.

---

### Q: What are the two categories of errors in Next.js, and how is each handled?

**Answer:**
1. **Expected errors** — Normal operation failures (validation, 404s). Handle by returning error values from Server Actions, not throwing. Use `useActionState` to display them.
2. **Uncaught exceptions** — Unexpected bugs. Handle with error boundaries (`error.tsx`). These catch rendering errors automatically.

---

### Q: Why is server-side validation still necessary even with client-side validation?

**Answer:** Client-side validation can be completely bypassed — users can use `curl`, Postman, or browser DevTools to send requests directly to the Server Action endpoint. Without server validation, malicious inputs like empty passwords or SQL injections could reach the database.

---

### Q: What does error.tsx REQUIRE to work?

**Answer:** It MUST be a Client Component — add `'use client'` at the top. It receives two props: `error` (the Error object, optionally with `digest`) and `reset` (a function to re-render the segment).

---

### Q: What does global-error.tsx do differently from error.tsx?

**Answer:** `global-error.tsx` catches errors in the root `layout.tsx`. Regular `error.tsx` does not catch root layout errors. Because `global-error.tsx` replaces the root layout when active, it MUST render its own `<html>` and `<body>` tags.

---

### Q: What is generateStaticParams used for?

**Answer:** It tells Next.js which dynamic route params to pre-render at build time. Without it, dynamic routes are rendered on-demand (SSR or ISR). With it, specific paths are pre-built as static HTML (SSG).

---

### Q: What are Route Groups and how are they created?

**Answer:** Route Groups are folders wrapped in parentheses `(folderName)`. The folder name does NOT appear in the URL. Used to organize routes without affecting URL structure, or to create multiple root layouts by giving each group its own `layout.tsx`.

---

### Q: Describe four fetch caching options in Next.js.

**Answer:**
1. `cache: 'force-cache'` — Cache indefinitely (SSG default)
2. `cache: 'no-store'` — Never cache, always fetch fresh (SSR)
3. `next: { revalidate: 60 }` — Cache, revalidate every 60 seconds (ISR)
4. `next: { tags: ['tag'] }` — Cache, revalidate when `revalidateTag('tag')` is called

---

### Q: Server Components can be passed as children to Client Components — true or false, and why?

**Answer:** True. You CANNOT import a Server Component inside a Client Component file, but you CAN pass a Server Component as a `children` prop from a parent Server Component. The Client Component renders `{children}` without knowing whether it's a server or client component.

---

### Q: What does useActionState return?

**Answer:** `const [state, formAction, isPending] = useActionState(actionFn, initialState)`:
- `state` — the latest result returned by the action
- `formAction` — the action function to pass to `<form action={formAction}>`
- `isPending` — boolean, true while the action is running

---

## 19. Cheat Sheet

### Core Directives

```
"use client"  → Top of file, before imports. Makes it a Client Component.
"use server"  → Top of file (all exports = Server Actions) OR inside async function body (inline Server Action).
```

### When to Use What

```
Server Component  → Default. Use for: data fetching, DB access, env vars, no interactivity
Client Component  → Add "use client". Use for: hooks, events, browser APIs, state
Server Action     → "use server" async function. Use for: forms, mutations, internal to app
API Route         → route.ts file. Use for: webhooks, public API, mobile apps
Middleware        → middleware.ts at root. Use for: auth, redirects, headers
```

### Special Files Summary

```
layout.tsx      → Shared UI, persists on navigation, no re-render
page.tsx        → Unique page content, makes route public
loading.tsx     → Suspense fallback, shown instantly
error.tsx       → Error boundary (MUST be "use client")
global-error.tsx→ Root layout error (needs <html><body>)
not-found.tsx   → Shown when notFound() is called
route.ts        → API endpoint (cannot coexist with page.tsx)
template.tsx    → Like layout but re-renders on navigation
default.tsx     → Parallel route fallback
```

### Dynamic Route Params

```
[slug]          → /blog/hello         → { slug: 'hello' }
[...slug]       → /blog/a/b/c         → { slug: ['a', 'b', 'c'] }
[[...slug]]     → /docs               → { slug: undefined }
                → /docs/a/b           → { slug: ['a', 'b'] }
```

### Rendering Strategy Decision

```
Same content for everyone, rarely changes?         → SSG (force-cache, generateStaticParams)
Personalized, needs cookies/headers?               → SSR (no-store, or dynamic functions)
Changes sometimes, can be slightly stale?          → ISR (revalidate: N)
User interaction after load?                       → CSR (SWR, useEffect)
```

### Caching

```
fetch(url)                              → SSG (cached forever)
fetch(url, { cache: 'no-store' })       → SSR (never cached)
fetch(url, { next: { revalidate: 60 }})→ ISR (revalidate every 60s)
fetch(url, { next: { tags: ['posts']}}) → ISR with on-demand revalidation

revalidatePath('/posts')                → Purge cache for /posts URL
revalidateTag('posts')                  → Purge all fetches with tag 'posts'
```

### Component Hierarchy Order

```
layout → template → error → loading → not-found → page
```

### Server Action Side Effects

```
revalidatePath('/path')   → import from 'next/cache'   — clears URL cache
revalidateTag('tag')      → import from 'next/cache'   — clears tag cache
redirect('/path')         → import from 'next/navigation' — redirects user
router.refresh()          → from useRouter hook          — refreshes client router
```

### useActionState Pattern

```tsx
const [state, formAction, isPending] = useActionState(serverAction, initialState);
// state = action result
// formAction = pass to <form action={formAction}>
// isPending = true while running
```

### Server Components: Can vs Cannot

```
CAN:    async/await, fetch(), db.query(), process.env.SECRET, fs.readFile()
CANNOT: useState, useEffect, onClick, window, document, localStorage
```

### Client Components: Can vs Cannot

```
CAN:    useState, useEffect, onClick, window, document, localStorage, custom hooks
CANNOT: async component, direct db access, access env vars meant for server-only
```

### Key "Gotchas" for the Exam

1. **error.tsx MUST be `"use client"`** — it's a Client Component
2. **global-error.tsx MUST render `<html>` and `<body>`**
3. **route.ts and page.tsx cannot be in the same folder**
4. **Server Actions use HTTP POST — they are not REST API endpoints**
5. **`"use client"` goes before imports** at the very top of the file
6. **layout.tsx does NOT re-render on navigation** (template.tsx does)
7. **params is now a Promise** in Next.js 15 — must `await params`
8. **Server Components cannot use hooks** — not even `useContext`
9. **Client Components are still SSR'd** — they just also hydrate in the browser
10. **Cannot import Server Component into Client Component** — pass as children prop instead
