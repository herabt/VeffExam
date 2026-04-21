# Practice Exam 3: `this` Binding, Redux, Socket.io & Web APIs

---

## SECTION A: JAVASCRIPT `this` BINDING (DEEP DIVE)

### Question 1 — Code Analysis (8 pts)
Study the following code carefully:

```javascript
function Hero(name) {
    this.name = name;
    console.log(this);   // logged in constructor
}

Hero.prototype.attack = function() {
    console.log('Attack!');
    console.log(this);
};

function SuperHero(name, power) {
    Hero.call(this, name);
    this.power = power;
    console.log(this);
}

SuperHero.prototype = Object.create(Hero.prototype);
SuperHero.prototype.constructor = SuperHero;

SuperHero.prototype.fly = function() {
    console.log(this.name + ' flies!');
    console.log(this);
};

var nobody = {};

// Execute the following lines:
var h1 = Hero('Thor');                    // 1. What is this?
var h2 = new Hero('Iron Man');            // 2. What is this?
var h3 = new SuperHero('Spider-Man', 'web'); // 3. What is this? (TWO logs)
h2.attack();                              // 4. What is this?
h2.attack.call(nobody);                   // 5. What is this?
var attackFn = h2.attack;
attackFn();                               // 6. What is this?
setTimeout(h3.fly, 500);                  // 7. What is this?
h3.fly.bind(h2)();                        // 8. What is this?
```

For each numbered line, state what `this` will be. Possible answers: `window`, `nobody`, `h1`, `h2`, `h3`, or describe the object.

---

### Question 2 — Multiple Choice
What happens when you call a constructor function WITHOUT the `new` keyword?

- A) JavaScript automatically adds `new` and creates the object correctly
- B) `this` refers to the global `window` object, and properties are set on `window`
- C) An error is thrown because constructor functions require `new`
- D) `this` is `undefined` and the function returns `null`

---

### Question 3 — Select All That Apply
Which of the following statements about `this` binding are correct?

- [ ] Arrow functions inherit `this` from their enclosing lexical scope
- [ ] `.bind()` returns a new function; `.call()` invokes the function immediately
- [ ] `new` overrides `.bind()` — a bound function called with `new` will use the new instance as `this`
- [ ] In strict mode, `this` in a regular function call is `undefined` instead of `window`
- [ ] `.call()` can override a function that was already bound with `.bind()`
- [ ] `setTimeout` preserves the `this` context of the function passed to it

---

### Question 4 — Written Answer (4 pts)
Explain the difference between these four patterns of calling a function with respect to `this`:

```javascript
greet();                    // Pattern 1
obj.greet();                // Pattern 2
greet.call(otherObj);       // Pattern 3
new greet();                // Pattern 4
```

For each pattern, state what `this` will be and why.

---

## SECTION B: REDUX IN DEPTH

### Question 5 — Fill in the blanks
Complete the following sentences about Redux:

In Redux, the entire application state is held in a single 1. \_\_\_\_\_\_\_\_. Changes to state are triggered by dispatching 2. \_\_\_\_\_\_\_\_, which are plain objects with a `type` property. The 3. \_\_\_\_\_\_\_\_ is a pure function that takes the current state and an action, and returns a new state. In Redux Toolkit, a 4. \_\_\_\_\_\_\_\_ bundles the reducer logic and action creators for a single feature. To read state in a functional component, you use the 5. \_\_\_\_\_\_\_\_ hook. To dispatch actions, you use the 6. \_\_\_\_\_\_\_\_ hook.

---

### Question 6 — Code Analysis (4 pts)
Study this Redux Toolkit slice:

```typescript
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
    name: 'counter',
    initialState,
    reducers: {
        increment(state) {
            state.history.push(state.value);
            state.value += 1;
        },
        decrement(state) {
            state.history.push(state.value);
            state.value -= 1;
        },
        incrementByAmount(state, action: PayloadAction<number>) {
            state.history.push(state.value);
            state.value += action.payload;
        },
        reset(state) {
            state.value = 0;
            state.history = [];
        },
    },
});
```

a) A student says: "These reducers are impure because they mutate `state.value` directly!" Is the student correct? Explain why or why not. (2 pts)

b) If the current state is `{ value: 5, history: [0, 1, 3] }` and we dispatch `incrementByAmount(10)`, what will the new state be? (2 pts)

---

### Question 7 — Written Answer (4 pts)
Explain the complete Redux data flow using a concrete example of a user adding a product to a shopping cart. Describe each step from user action to UI update, mentioning: the component, the action, dispatch, the reducer, the store, and how the component gets the updated data.

---

### Question 8 — Multiple Choice
Which of the following best describes why Redux Toolkit (RTK) was created?

- A) To replace React Context API entirely
- B) To reduce the boilerplate code required by traditional Redux (manual action types, action creators, immutable update logic)
- C) To enable server-side rendering with Redux
- D) To make Redux work with TypeScript

---

## SECTION C: SOCKET.IO

### Question 9 — Fill in the blanks
Complete the following sentences about Socket.io:

Socket.io enables 1. \_\_\_\_\_\_\_\_, bidirectional communication between client and server. To send an event from the server to ALL connected clients, you use 2. \_\_\_\_\_\_\_\_. To send an event to all clients EXCEPT the sender, you use 3. \_\_\_\_\_\_\_\_. To listen for events, both client and server use the 4. \_\_\_\_\_\_\_\_ method. Socket.io 5. \_\_\_\_\_\_\_\_ are functions that run before a connection is established, often used for authentication.

---

### Question 10 — Select All That Apply
Which of the following are true about Socket.io?

- [ ] Socket.io uses WebSockets as its primary transport but can fall back to HTTP long-polling
- [ ] Socket.io and raw WebSockets are the same thing
- [ ] Socket.io supports automatic reconnection when the connection drops
- [ ] Socket.io rooms allow you to group sockets and send events to specific groups
- [ ] `socket.emit()` sends an event to ALL connected clients
- [ ] Socket.io middleware can be used to authenticate connections before they complete

---

### Question 11 — Written Answer (4 pts)
You are building a real-time chat application with Socket.io. Explain the difference between these three server-side emit methods and when you would use each:

```javascript
io.emit('message', data);
socket.emit('message', data);
socket.broadcast.emit('message', data);
```

Give a concrete chat-app example for each.

---

### Question 12 — Code Analysis (4 pts)
Study this Socket.io server code:

```javascript
const io = require('socket.io')(server);

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (isValidToken(token)) {
        socket.userId = getUserId(token);
        next();
    } else {
        next(new Error('Authentication failed'));
    }
});

io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);

    socket.join(`user:${socket.userId}`);

    socket.on('sendMessage', (data) => {
        io.to(data.roomId).emit('newMessage', {
            from: socket.userId,
            text: data.text,
            timestamp: Date.now()
        });
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected`);
    });
});
```

a) What does the `io.use()` middleware do in this code? What happens if authentication fails? (2 pts)

b) Explain what `socket.join()` and `io.to()` do. Why is this useful in a chat application? (2 pts)

---

## SECTION D: WEB COMPONENTS & HTML5 APIs

### Question 13 — Fill in the blanks
Complete the following sentences about Web Components:

To define a custom HTML element, you use the method 1. \_\_\_\_\_\_\_\_. The 2. \_\_\_\_\_\_\_\_ provides encapsulated DOM and CSS that doesn't leak into the rest of the page. The lifecycle callback 3. \_\_\_\_\_\_\_\_ is called when the element is added to the DOM. Custom element tag names must contain a 4. \_\_\_\_\_\_\_\_ (character) to distinguish them from standard HTML elements.

---

### Question 14 — Multiple Choice
Which of the following correctly describes Web Workers?

- A) They run JavaScript on the main thread but in a separate execution context
- B) They run JavaScript in a background thread and can directly access and modify the DOM
- C) They run JavaScript in a background thread and communicate with the main thread via `postMessage()`
- D) They are a replacement for async/await for handling concurrent operations

---

### Question 15 — Select All That Apply
Which of the following are true about Web Storage (localStorage and sessionStorage)?

- [ ] localStorage data persists even after the browser is closed
- [ ] sessionStorage data persists even after the browser is closed
- [ ] Both use the same API: `setItem()`, `getItem()`, `removeItem()`
- [ ] localStorage can store JavaScript objects directly without serialization
- [ ] Web Storage is limited to the same origin (protocol + domain + port)
- [ ] localStorage has a storage limit of approximately 5MB

---

### Question 16 — Written Answer (4 pts)
Explain the Drag and Drop API in HTML5. What attributes and events are involved? Describe the minimum setup needed to make an element draggable and a target element that accepts drops.

---

### Question 17 — Select All That Apply
Which of the following are correct about Web Workers?

- [ ] They can access the DOM directly
- [ ] They communicate with the main thread using `postMessage()`
- [ ] They run on a separate thread from the main JavaScript thread
- [ ] They share memory with the main thread by default
- [ ] They are useful for CPU-intensive calculations that would block the UI
- [ ] They can use `fetch()` to make network requests

---

## SECTION E: MIXED REVIEW

### Question 18 — Written Answer (6 pts)
For each of the following scenarios, recommend the most appropriate technology/approach and explain why:

a) You need to display real-time stock prices that update every second to all connected users. (2 pts)

b) You need to build a multi-step registration form with complex validation rules and conditional fields. (2 pts)

c) You need to render a dashboard page that fetches data from a database, but the page has an interactive filter dropdown. (2 pts)

---

### Question 19 — Code Analysis (4 pts)
What is the output of the following code? Explain the order.

```javascript
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve()
    .then(() => console.log('C'))
    .then(() => console.log('D'));

queueMicrotask(() => console.log('E'));

console.log('F');
```

---

### Question 20 — Written Answer (4 pts)
Explain what components are in React. Answer these three sub-questions:

1. What is a component? (1 pt)
2. What principles should a component follow? (1.5 pts)
3. What are the benefits of using components? (1.5 pts)

---

---

# ANSWER KEY

## Section A

**Q1:**
1. `window` — `Hero('Thor')` called without `new`, so `this` = window in non-strict mode
2. `Hero { name: 'Iron Man' }` — called with `new`, `this` = new instance (h2)
3. First log (from Hero.call): `SuperHero { name: 'Spider-Man' }` — Hero.call(this, name) uses the SuperHero instance as `this`. Second log: `SuperHero { name: 'Spider-Man', power: 'web' }` — same instance now with `power` added (h3)
4. `Hero { name: 'Iron Man' }` — method called on h2, so `this` = h2
5. `{}` (nobody) — `.call(nobody)` explicitly sets `this` to `nobody`
6. `window` — function reference extracted, called without context, `this` = window
7. `window` — setTimeout loses context, and in the callback `this.name` is `undefined`, so it logs "undefined flies!" and `this` = window
8. `Hero { name: 'Iron Man' }` — `.bind(h2)` permanently sets `this` to h2, so it logs "Iron Man flies!" and `this` = h2

**Q2:** B — `this` refers to `window`, properties are set on the global object

**Q3:** Correct:
- [x] Arrow functions inherit `this` from lexical scope
- [x] `.bind()` returns new function, `.call()` invokes immediately
- [x] `new` overrides `.bind()`
- [x] In strict mode, `this` is `undefined` instead of `window`
- [ ] `.call()` can override `.bind()` — **FALSE** (bind is permanent, call cannot override it)
- [ ] `setTimeout` preserves context — **FALSE** (it loses `this` context)

**Q4:**
- **Pattern 1 `greet()`**: Regular function call. `this` = `window` (global object) in non-strict mode, `undefined` in strict mode. There's no object context.
- **Pattern 2 `obj.greet()`**: Method call. `this` = `obj`. The object before the dot becomes `this`.
- **Pattern 3 `greet.call(otherObj)`**: Explicit binding. `this` = `otherObj`. `.call()` explicitly sets `this` to the first argument.
- **Pattern 4 `new greet()`**: Constructor call. `this` = a brand new empty object that inherits from `greet.prototype`. The `new` keyword creates the object and sets `this` to it.

## Section B

**Q5:** 1. `store` 2. `actions` 3. `reducer` 4. `slice` 5. `useSelector` 6. `useDispatch`

**Q6:**
a) The student is **incorrect**. While the code looks like it's mutating state directly (`state.value += 1`), Redux Toolkit uses **Immer** under the hood. Immer creates a draft proxy of the state — you write "mutating" code, but Immer produces an immutable update behind the scenes. This is one of RTK's biggest benefits: simpler reducer syntax while maintaining immutability guarantees.

b) New state: `{ value: 15, history: [0, 1, 3, 5] }`
- `state.history.push(state.value)` → pushes current value (5) to history: `[0, 1, 3, 5]`
- `state.value += action.payload` → 5 + 10 = 15

**Q7:** Complete flow example — user clicks "Add to Cart" on a product:

1. **Component (View)**: User clicks "Add to Cart" button on `<ProductCard>` component
2. **Action Creator**: The click handler calls `dispatch(addToCart({ id: 42, name: "Book", price: 29.99 }))`. This creates an action object: `{ type: 'cart/addToCart', payload: { id: 42, name: 'Book', price: 29.99 } }`
3. **Dispatch**: The `dispatch()` function sends this action to the Redux store
4. **Reducer**: The store passes the current state and the action to the cart reducer. The reducer matches the action type `'cart/addToCart'` and returns a new state with the product added to the cart array
5. **Store**: The store updates its state tree with the new state returned by the reducer
6. **Component Update**: Components that use `useSelector` to read cart state are notified. The `<CartIcon>` component re-renders showing the updated count. The `<CartPage>` shows the new item.

This is the **Flux pattern**: View → Action → Dispatch → Reducer → Store → View (unidirectional)

**Q8:** B — Reduce boilerplate from traditional Redux

## Section C

**Q9:** 1. `real-time` 2. `io.emit()` 3. `socket.broadcast.emit()` 4. `.on()` (or `socket.on()`) 5. `middleware`

**Q10:** Correct:
- [x] Uses WebSockets with HTTP long-polling fallback
- [ ] Same as raw WebSockets — **FALSE** (Socket.io adds rooms, auto-reconnect, fallbacks, etc.)
- [x] Supports automatic reconnection
- [x] Rooms allow grouping sockets
- [ ] `socket.emit()` sends to ALL clients — **FALSE** (sends to that specific socket only)
- [x] Middleware can authenticate before connection completes

**Q11:**
- **`io.emit('message', data)`** — sends to ALL connected clients (including sender). Use case: system-wide announcement. *Example: "Server maintenance in 5 minutes" broadcast to every user.*
- **`socket.emit('message', data)`** — sends only to the specific client that this socket represents. Use case: private acknowledgment. *Example: Sending a "message delivered" confirmation back to only the sender.*
- **`socket.broadcast.emit('message', data)`** — sends to ALL clients EXCEPT the sender. Use case: notifying others about a new message. *Example: When user A sends a chat message, everyone else sees it appear, but user A already has it locally — no need to echo back.*

**Q12:**
a) The `io.use()` middleware intercepts every new connection BEFORE it completes. It extracts the auth token from `socket.handshake.auth.token`, validates it, and if valid, attaches the `userId` to the socket and calls `next()` to allow the connection. If authentication fails, it calls `next(new Error('...'))` which rejects the connection — the client receives a `connect_error` event.

b) `socket.join('user:${socket.userId}')` adds the socket to a named room. Rooms are virtual groups of sockets. `io.to(data.roomId).emit(...)` sends an event to ALL sockets in that specific room. This is useful in chat because you can have rooms for different chat channels/conversations — when someone sends a message to "room:general", only users who joined that room receive it, not everyone on the server.

## Section D

**Q13:** 1. `customElements.define()` 2. `Shadow DOM` 3. `connectedCallback` 4. `hyphen` (dash, `-`)

**Q14:** C — Background thread, communicates via `postMessage()`

**Q15:** Correct:
- [x] localStorage persists after browser close
- [ ] sessionStorage persists after browser close — **FALSE** (cleared when tab/session ends)
- [x] Both use same API: `setItem()`, `getItem()`, `removeItem()`
- [ ] Can store objects directly — **FALSE** (must use `JSON.stringify()` / `JSON.parse()`)
- [x] Same-origin policy applies
- [x] ~5MB storage limit

**Q16:** Drag and Drop setup:

1. **Make element draggable**: Add `draggable="true"` attribute to the HTML element
2. **Handle `dragstart`**: On the draggable element, listen for `dragstart` event. Use `event.dataTransfer.setData('text/plain', id)` to set the data being dragged
3. **Handle `dragover`**: On the drop target, listen for `dragover` and call `event.preventDefault()` — this is REQUIRED or the drop won't work (default behavior is to NOT allow drops)
4. **Handle `drop`**: On the drop target, listen for `drop` event. Call `event.preventDefault()`, then use `event.dataTransfer.getData('text/plain')` to retrieve the dragged data and handle the logic

```html
<div draggable="true" ondragstart="drag(event)" id="item">Drag me</div>
<div ondragover="allowDrop(event)" ondrop="drop(event)">Drop here</div>
```
```javascript
function drag(e) { e.dataTransfer.setData('text', e.target.id); }
function allowDrop(e) { e.preventDefault(); }  // MUST prevent default
function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    e.target.appendChild(document.getElementById(id));
}
```

**Q17:** Correct:
- [ ] Can access DOM — **FALSE** (no DOM access in workers)
- [x] Communicate via `postMessage()`
- [x] Run on separate thread
- [ ] Share memory by default — **FALSE** (separate memory; can use SharedArrayBuffer explicitly)
- [x] Useful for CPU-intensive calculations
- [x] Can use `fetch()` (workers can make network requests)

## Section E

**Q18:**
a) **Socket.io** — real-time stock prices need bidirectional, push-based communication. The server needs to push updates to all clients every second. HTTP polling would be wasteful; WebSocket/Socket.io provides persistent connections for efficient real-time data streaming.

b) **react-hook-form** with Zod resolver — complex multi-step forms benefit from react-hook-form's uncontrolled input approach (performance), built-in validation rules, and the `resolver` option with Zod for schema-based validation. Use `useForm` with different validation schemas per step, and `watch()` for conditional fields.

c) **Next.js Server Component + Client Component composition** — the dashboard page itself should be a Server Component that fetches data directly from the database (no API needed, no client JS for the data). The interactive filter dropdown should be a Client Component (uses `"use client"`, `useState`, `onChange`). Pass the filter value up or use a Server Action to re-fetch filtered data.

**Q19:** Output order: `A`, `F`, `C`, `E`, `D`, `B`

Explanation:
1. `A` — synchronous, runs first
2. `F` — synchronous, runs next (call stack clears)
3. `C` — microtask (Promise.then), runs before macrotasks
4. `E` — microtask (queueMicrotask), runs in same microtask batch
5. `D` — microtask (chained .then from C), runs after C resolves
6. `B` — macrotask (setTimeout), runs last after all microtasks

Wait — actually `C` and `E` are both microtasks queued during synchronous execution. They run in FIFO order: `C` first (queued first), then `E` (queued second). Then `D` is queued by the resolution of the first `.then()`.

So: `A`, `F`, `C`, `E`, `D`, `B`

**Q20:**
1. **What is a component?** A component is a reusable, self-contained building block of a React application. It is a function (or class) that accepts inputs (props) and returns React elements (JSX) describing what should appear on screen. Components can be composed together to build complex UIs from simple pieces.

2. **Principles a component should follow:**
   - **Single Responsibility**: Each component should do one thing well
   - **Reusable**: Designed to be used in multiple places with different data
   - **Composable**: Can be combined with other components to build larger features
   - **Declarative**: Describes WHAT the UI should look like, not HOW to update the DOM

3. **Benefits of using components:**
   - **Code reuse**: Write once, use many times across the application
   - **Easier testing**: Small, isolated units are simpler to test individually
   - **Separation of concerns**: Each component handles its own logic and presentation
   - **Maintainability**: Changes to one component don't affect others
   - **Team collaboration**: Different developers can work on different components simultaneously
