# Visual Study Guide — Key Topics with Slide Images + Teacher Code

Each topic shows: definition, slide image reference, and real code from the teacher's repo.

---

## 1. Zustand Shopping Cart (Mock Q14 — 8 pts!)

**Slide pages:** ~685-700

**Teacher's ACTUAL code** (workshops/w5/store/cart-store.ts):
```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/data/products";

type State = {
  cart: Product[];
};

type Action = {
  addItem: (item: Product) => void;
  removeItem: (id: number) => void;
};

export const useCartStore = create<State & Action>()(
  persist(
    (set) => ({
      cart: [],
      addItem: (item) => set((state) => ({ cart: [...state.cart, item] })),
      removeItem: (id) =>
        set((state) => ({ cart: state.cart.filter((p) => p.id !== id) })),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

**Why this matters:** This is the EXACT pattern the teacher expects for Q14. Note: `persist` middleware auto-saves to localStorage, `set` function produces new state immutably.

---

## 2. Redux Toolkit createSlice (Mock Q14 alternative + Redux concepts)

**Slide pages:** ~645-655

**Teacher's ACTUAL code** (workshops/w5/store/cart-slice.ts):
```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/data/products";

type CartState = {
  cart: Product[];
};

const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      state.cart.push(action.payload); // Immer makes this safe!
    },
    removeItem(state, action: PayloadAction<number>) {
      state.cart = state.cart.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
```

**Why this matters:** `state.cart.push(action.payload)` looks like mutation but Immer handles it. `createSlice` auto-generates action creators. `PayloadAction<Product>` gives TypeScript safety.

---

## 3. Context API (Mock Q11 + comparison)

**Slide pages:** ~641-643

**Teacher's ACTUAL code** (workshops/w5/context/cart-context.tsx):
```typescript
"use client";

import { createContext, useContext, useState } from "react";
import { Product } from "@/data/products";

type CartContextType = {
  cart: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: number) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);

  function addItem(item: Product) {
    setCart((prev) => [...prev, item]);
  }

  function removeItem(id: number) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
```

**Why this matters:** Same cart, three approaches. The teacher's w5 workshop compares all three side by side — exactly what Q14 asks you to do.

---

## 4. Server Action (Mock Q18 + Q22)

**Slide pages:** ~601-609

**Teacher's ACTUAL code** (code-demonstrations/concert-arena/actions/booking.ts):
```typescript
"use server";

import type { BookingValues } from "@/types/booking";

export async function submitBooking(
  data: BookingValues
): Promise<{ success: true; bookingRef: string } | { success: false; error: string }> {
  try {
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));
    const bookingRef = crypto.randomUUID();
    return { success: true, bookingRef };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
```

**Why this matters:** `"use server"` at the top makes it a Server Action. Returns a union type (success | error). Can be called directly from a Client Component form.

---

## 5. react-hook-form with useFormContext (Mock Q15-17 + Q22)

**Slide pages:** ~731-745

**Teacher's ACTUAL code** (code-demonstrations/concert-arena/app/booking/personal/page.tsx):
```tsx
const {
  register,
  trigger,
  formState: { errors },
} = useFormContext<BookingValues>();

// Input with register + validation:
<input {...register("fullName")} />
{errors.fullName && <p>{errors.fullName.message}</p>}
```

**Key methods from the teacher's code:**
- `useFormContext()` — access form in child components (multi-step)
- `register("fieldName")` — connect input to form
- `trigger(["field1", "field2"])` — validate specific fields per step
- `formState.errors` — access validation errors

---

## 6. Web Components (customElements.define)

**Slide pages:** ~283-286

**Teacher's ACTUAL code** (Code sessions/Web Components & Fetch/food-card/food-card.js):
```javascript
class FoodCard extends HTMLElement {
  get imageUrl() {
    return this.getAttribute("image-url");
  }

  constructor() {
    super();
    let template = document.getElementById("food-card-template");
    let templateContent = template.content;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent.cloneNode(true));

    const foodImage = shadowRoot.querySelector(".food-image");
    foodImage.style.backgroundImage = `url(${this.imageUrl})`;
  }
}

customElements.define("food-card", FoodCard);
```

**Why this matters:** Shows all key concepts: extends HTMLElement, Shadow DOM (`attachShadow`), template cloning, custom element registration with hyphenated name.

---

## 7. Socket.io Server (emit patterns)

**Slide pages:** ~781-785

**Teacher's ACTUAL code** (Socket.io/signup-sheet/server/index.js):
```javascript
io.on('connection', socket => {
  console.log(`New client connected: ${socket.id}`);
  
  socket.on('newevent', event => {
    io.emit('newevent', event);        // ALL clients
  });
  
  socket.on('usersignup', async (eventId, user) => {
    if (await addUserToEvent(eventId, user)) {
      io.emit('usersignup', eventId, user);  // ALL clients
    }
  });
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
```

---

## 8. TypeScript Interfaces + Types

**Slide pages:** ~409-421

**Teacher's ACTUAL code** (workshops/w2/src/main.ts):
```typescript
type RaceState = "idle" | "racing" | "finished";  // Union type
type Item = Coin | Mushroom;                        // Type alias

interface IRacer {                                   // Interface
  name: string;
  position: number;
  move(): void;
}
```

---

## 9. CSS Grid Layout with template-areas

**Slide pages:** ~64-77

**Teacher's ACTUAL code** (Layouts/she-ra/css/main.css):
```css
.container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
```

---

## 10. BEM Naming in Real CSS

**Slide pages:** ~253-258

**Teacher's ACTUAL code** (code-demonstrations/summer-vacation-css3/styles/base.css):
```css
/* Block */
.nav { ... }

/* Elements (double underscore) */
.nav__list { display: flex; }
.nav__item { list-style: none; }
.nav__link-text { color: var(--main-white-color); }

/* Block with elements */
.features__item { ... }
.features__image { ... }
.features__title { ... }

/* Modifiers (double dash) */
.promo--purple { background: purple; }
.promo--reverse { flex-direction: row-reverse; }
```

---

## 11. CSS Variables in Real CSS

**Slide pages:** ~243-249

**Teacher's ACTUAL code** (code-demonstrations/summer-vacation-css3/styles/base.css):
```css
:root {
  --navigation-bar-height: 100px;
  --main-blue-color: #63B4D1;
  --main-white-color: #ffffff;
}

.nav {
  height: var(--navigation-bar-height);
  background-color: var(--main-blue-color);
}
```

---

## 12. Promises — Visual Promises

**Slide pages:** ~793-807

**Teacher's ACTUAL code** (Code sessions/Visual Promises/scripts/promise.js):
```javascript
// Promise.all — waits for ALL, fails if ANY rejects
Promise.all([promise1, promise2, promise3])
  .then(results => { /* all resolved */ })
  .catch(error => { /* first rejection */ });

// Promise.race — first to SETTLE (resolve OR reject)
Promise.race([promise1, promise2, promise3])
  .then(result => { /* first settled */ });

// Promise.any — first to RESOLVE
Promise.any([promise1, promise2, promise3])
  .then(result => { /* first success */ });

// Promise.allSettled — waits for ALL, never rejects
Promise.allSettled([promise1, promise2, promise3])
  .then(results => { /* [{status, value/reason}, ...] */ });
```
