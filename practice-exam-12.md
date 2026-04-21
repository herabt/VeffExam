# Practice Exam 12 -- Promises, async/await, Event Loop & Fetch API

**Deep-dive exam based on Visual Promises code demonstrations and course material.**

---

## Question 1 -- Promise States (2 pts)

A Promise can be in one of three states. Name all three states and explain the transition rules between them.

- a) List the three states.
- b) Once a Promise has transitioned from `pending` to either of the other two states, can it transition again? Explain.
- c) What do we call a Promise that has left the `pending` state (regardless of whether it fulfilled or rejected)?

---

## Question 2 -- Promise Chaining (2 pts)

Consider this code:

```js
function fetchUser() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve({ name: "Arnar", age: 30 }), 1000);
  });
}

fetchUser()
  .then(user => {
    console.log(user.name);
    return user.age;
  })
  .then(age => {
    console.log(age * 2);
  })
  .catch(err => {
    console.log("Error:", err);
  })
  .finally(() => {
    console.log("Done");
  });
```

- a) What is printed to the console, and in what order?
- b) If the Promise inside `fetchUser` called `reject("Not found")` instead of `resolve(...)`, what would be printed instead?
- c) Does `.finally()` receive the resolved value or the rejection reason as a parameter?

---

## Question 3 -- Promise.all Behavior (2 pts)

The course Visual Promises demonstration uses these four promises:

```js
const getPromises = () => [
  new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, "1 second");
  }),
  new Promise((resolve, reject) => {
    setTimeout(resolve, 2000, "2 seconds");
  }),
  new Promise((resolve, reject) => {
    setTimeout(reject, 5000, "5 seconds");
  }),
  new Promise((resolve, reject) => {
    setTimeout(resolve, 10000, "10 seconds");
  }),
];
```

- a) When `Promise.all(getPromises())` is called, does it resolve or reject? After approximately how many seconds?
- b) If it rejects, what is the rejection reason?
- c) If the third promise used `resolve` instead of `reject`, what would `Promise.all` return and after how many seconds?

---

## Question 4 -- Promise.allSettled vs Promise.all (2 pts)

Using the same `getPromises()` from Question 3:

- a) When `Promise.allSettled(getPromises())` is called, does it ever reject? After approximately how many seconds does the `.then` handler run?
- b) What is the structure of each object in the array passed to `.then`? Describe the properties for both fulfilled and rejected promises.
- c) In the course code, the following check is used. Explain what each branch does:

```js
promises.forEach((promise, idx) => {
  if (promise.status === "fulfilled") {
    showMessageAndAnimate(bunnyCard, promise.value, elapsedTimeInSeconds);
  }
  if (promise.status === "rejected") {
    // show error with promise.reason
  }
});
```

---

## Question 5 -- Promise.race vs Promise.any (2 pts)

Using the same `getPromises()` from Question 3 (third promise rejects at 5s, others resolve):

- a) What does `Promise.race(getPromises())` return? What value, and after how many seconds?
- b) What does `Promise.any(getPromises())` return? What value, and after how many seconds?
- c) If ALL four promises rejected (at 1s, 2s, 5s, 10s respectively), what would `Promise.race` return vs. what would `Promise.any` return? Include the type of error `Promise.any` would throw.

---

## Question 6 -- Event Loop: Code Output (3 pts)

**What does this code print, and in what order? Explain each step using the Event Loop model (Call Stack, Web APIs, Microtask Queue, Macrotask Queue).**

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

---

## Question 7 -- Event Loop: Advanced Code Output (3 pts)

**What does this code print, and in what order?**

```js
console.log("A");

setTimeout(() => {
  console.log("B");
  Promise.resolve().then(() => console.log("C"));
}, 0);

Promise.resolve().then(() => {
  console.log("D");
  setTimeout(() => console.log("E"), 0);
});

console.log("F");
```

For full marks, explain which queue each callback enters and the order in which the Event Loop processes them.

---

## Question 8 -- Promise Chaining Order (2 pts)

**What does this code print?**

```js
Promise.resolve(1)
  .then(val => { console.log(val); return val + 1; })
  .then(val => { console.log(val); return val + 1; })
  .then(val => { console.log(val); });

console.log("start");
```

---

## Question 9 -- Error Handling with async/await (2 pts)

Consider this code:

```js
async function getData() {
  try {
    const response = await fetch("https://api.example.com/data");
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Caught:", error.message);
  }
}
```

- a) The `fetch` API returns a Promise. Under what condition does `fetch` itself reject (throw an error caught by `catch`)? Give an example.
- b) If the server responds with HTTP 404, does `fetch` reject? What happens instead, and why is the `response.ok` check necessary?
- c) Why does `response.json()` also need `await`?

---

## Question 10 -- async/await Execution Order (2 pts)

**What does this code print, and in what order?**

```js
async function foo() {
  console.log("A");
  const result = await Promise.resolve("B");
  console.log(result);
  console.log("C");
}

console.log("D");
foo();
console.log("E");
```

Explain why the code after `await` does not execute immediately.

---

## Question 11 -- for await...of Pattern (2 pts)

The course demonstration uses `for await...of` with the same set of promises:

```js
document.getElementById("for-await").addEventListener("click", async function () {
  let number = 1;
  const startDate = new Date();

  try {
    for await (const promise of getPromises()) {
      const elapsedTimeInSeconds = (endDate - startDate) / 1000;
      const bunnyCard = getBunnyCard("for-await", number++);
      showMessageAndAnimate(bunnyCard, promise, elapsedTimeInSeconds);
    }
  } catch (err) {
    // handle rejection
  }
});
```

Using `getPromises()` from Question 3 (resolves at 1s, 2s; rejects at 5s; resolves at 10s):

- a) How does `for await...of` differ from `Promise.all` in how it processes the promises?
- b) At what elapsed times does each bunny card appear before the error occurs?
- c) What happens to the fourth promise (10s resolve) -- does it ever get processed?

---

## Question 12 -- Fetch API Fundamentals (2 pts)

- a) What does `fetch(url)` return?
- b) The response object from `fetch` has a property called `ok`. What does it represent?
- c) Name two methods on the response object used to parse the body, and state what each returns.
- d) Explain the difference between a **network error** and an **HTTP error** in the context of `fetch`.

---

## Question 13 -- Promise Constructor (2 pts)

What is the output of the following code? Explain.

```js
const p = new Promise((resolve, reject) => {
  console.log("X");
  resolve("Y");
  console.log("Z");
});

p.then(val => console.log(val));
console.log("W");
```

---

## Question 14 -- Microtasks vs Macrotasks (2 pts)

- a) Name two examples of microtasks and two examples of macrotasks in the browser.
- b) In the Event Loop, which queue has priority -- the microtask queue or the macrotask queue? Explain what happens after each macrotask completes.
- c) Why does `Promise.resolve().then(...)` execute before `setTimeout(..., 0)` even though both are asynchronous?

---

## Question 15 -- Promise.all vs for await...of Timing (2 pts)

Consider these promises:

```js
const promises = [
  new Promise(resolve => setTimeout(resolve, 3000, "A")),
  new Promise(resolve => setTimeout(resolve, 1000, "B")),
  new Promise(resolve => setTimeout(resolve, 2000, "C")),
];
```

- a) If you use `Promise.all(promises)`, after how many seconds does the `.then` handler run? What is the value passed to it?
- b) If you use `for await (const val of promises)`, at what elapsed times does each value become available, and in what order?
- c) Explain why the timing differs between `Promise.all` and `for await...of` for these specific promises.

---

## Question 16 -- Error Propagation in Chains (2 pts)

What does this code print?

```js
Promise.resolve("start")
  .then(val => {
    console.log(val);
    throw new Error("oops");
  })
  .then(val => {
    console.log("This runs?", val);
  })
  .catch(err => {
    console.log("Caught:", err.message);
    return "recovered";
  })
  .then(val => {
    console.log(val);
  });
```

---

## Question 17 -- Course Code Analysis (2 pts)

In the course Visual Promises code, the `Promise.race` handler is written as:

```js
Promise.race(getPromises()).then(
  (value) => {
    // on resolved
    showMessageAndAnimate(bunnyCard, value, elapsedTimeInSeconds);
    // mark other bunnies as "out-of-race"
  },
  (reason) => {
    // on rejected
    bunny.classList.add("hurt");
  }
);
```

- a) The `.then` method receives two arguments here (two functions). What is the difference between this pattern and using `.then().catch()`?
- b) If the first promise to settle is fulfilled, which handler runs?
- c) If the first promise to settle is rejected, which handler runs?
- d) In `getPromises()` the fastest promise resolves at 1 second. Does `Promise.race` wait for the other promises to finish, or does it ignore them?

---

## Question 18 -- Combining Concepts (3 pts)

**What does this code print, and in what order?**

```js
async function process() {
  console.log("1");
  
  const result = await new Promise((resolve) => {
    console.log("2");
    setTimeout(() => {
      console.log("3");
      resolve("4");
    }, 0);
  });
  
  console.log(result);
  console.log("5");
}

console.log("6");
process();
console.log("7");
```

---

---

# ANSWER KEY

---

## Answer 1 -- Promise States

**a)** The three states are:
1. **pending** -- initial state, neither fulfilled nor rejected
2. **fulfilled** -- the operation completed successfully
3. **rejected** -- the operation failed

**b)** No. Once a Promise transitions from `pending` to `fulfilled` or `rejected`, it is **settled** and its state can never change again. The value or reason is locked in permanently.

**c)** A Promise that has left the `pending` state is called **settled** (it is either fulfilled or rejected).

---

## Answer 2 -- Promise Chaining

**a)** Output in order:
```
Arnar
60
Done
```
The first `.then` logs `user.name` ("Arnar") and returns `user.age` (30). The second `.then` receives 30 and logs `30 * 2 = 60`. The `.catch` is skipped because no error occurred. `.finally` always runs and logs "Done".

**b)** If reject is called:
```
Error: Not found
Done
```
The `.then` handlers are skipped, `.catch` catches the rejection reason, and `.finally` runs.

**c)** No. `.finally()` does not receive any argument -- it is called regardless of the outcome but gets no value or reason.

---

## Answer 3 -- Promise.all Behavior

**a)** It **rejects** after approximately **5 seconds** (when the third promise rejects).

**b)** The rejection reason is the string `"5 seconds"`.

**c)** If all promises resolved, `Promise.all` would resolve after approximately **10 seconds** (waiting for the slowest) with the array `["1 second", "2 seconds", "5 seconds", "10 seconds"]`.

---

## Answer 4 -- Promise.allSettled vs Promise.all

**a)** `Promise.allSettled` **never rejects**. It always waits for ALL promises to settle. The `.then` handler runs after approximately **10 seconds** (when the last promise settles).

**b)** Each object in the array has:
- For fulfilled promises: `{ status: "fulfilled", value: <resolved value> }`
- For rejected promises: `{ status: "rejected", reason: <rejection reason> }`

**c)** The code checks `promise.status`:
- If `"fulfilled"`: shows the bunny card with the resolved value and animation
- If `"rejected"`: marks the bunny as "hurt" and displays the rejection reason

This is the key difference from `Promise.all` -- you get the result of every promise, not just the first failure.

---

## Answer 5 -- Promise.race vs Promise.any

**a)** `Promise.race` settles with the **first promise to settle**, regardless of whether it fulfilled or rejected. Since the first promise resolves at 1 second, `Promise.race` resolves with `"1 second"` after approximately **1 second**.

**b)** `Promise.any` settles with the **first promise to fulfill**. Since the first promise resolves at 1 second, `Promise.any` also resolves with `"1 second"` after approximately **1 second**.

**c)** If all four rejected:
- `Promise.race` would **reject** with the reason from the first rejection (at 1 second) -- it takes whatever settles first.
- `Promise.any` would **reject** with an `AggregateError` (after 10 seconds, waiting for all to fail), because it needs to confirm no promise will fulfill. The `AggregateError` contains all the individual rejection reasons.

---

## Answer 6 -- Event Loop: Code Output

**Output order: `1`, `4`, `3`, `2`**

Step-by-step:
1. `console.log("1")` -- executes synchronously on the **Call Stack**. Prints `1`.
2. `setTimeout(callback, 0)` -- the callback is sent to the **Web APIs** timer. After 0ms, it moves to the **Macrotask Queue**.
3. `Promise.resolve().then(callback)` -- the callback is placed in the **Microtask Queue**.
4. `console.log("4")` -- executes synchronously on the **Call Stack**. Prints `4`.
5. The Call Stack is now empty. The Event Loop checks the **Microtask Queue** first -- runs the Promise callback. Prints `3`.
6. Microtask Queue is empty. Event Loop takes from the **Macrotask Queue** -- runs the setTimeout callback. Prints `2`.

---

## Answer 7 -- Event Loop: Advanced Code Output

**Output order: `A`, `F`, `D`, `B`, `C`, `E`**

Step-by-step:
1. `console.log("A")` -- sync, prints `A`.
2. `setTimeout(cbB, 0)` -- cbB goes to Macrotask Queue.
3. `Promise.resolve().then(cbD)` -- cbD goes to Microtask Queue.
4. `console.log("F")` -- sync, prints `F`.
5. Call Stack empty. Process Microtask Queue:
   - cbD runs: prints `D`, schedules `setTimeout(cbE, 0)` (cbE goes to Macrotask Queue).
6. Microtask Queue empty. Process Macrotask Queue:
   - cbB runs: prints `B`, then `Promise.resolve().then(cbC)` adds cbC to Microtask Queue.
7. After macrotask cbB, check Microtask Queue:
   - cbC runs: prints `C`.
8. Process next Macrotask:
   - cbE runs: prints `E`.

---

## Answer 8 -- Promise Chaining Order

**Output: `start`, `1`, `2`, `3`**

`console.log("start")` executes synchronously first. The Promise chain callbacks are microtasks, so they execute after the synchronous code completes. Each `.then` receives the return value of the previous `.then`:
- First `.then`: logs `1`, returns `2`
- Second `.then`: logs `2`, returns `3`
- Third `.then`: logs `3`

---

## Answer 9 -- Error Handling with async/await

**a)** `fetch` itself only rejects on **network errors** -- when the request cannot reach the server at all. Examples: no internet connection, DNS resolution failure, CORS error, server unreachable.

**b)** No. If the server responds with HTTP 404, `fetch` does **not** reject. It resolves successfully with a Response object where `response.ok` is `false` and `response.status` is `404`. The `response.ok` check is necessary because `fetch` considers any server response (even 4xx/5xx) as a successful network request. You must manually check `response.ok` (or `response.status`) to detect HTTP-level errors.

**c)** `response.json()` returns a **Promise** because parsing the response body is an asynchronous operation -- the body may still be streaming. You need `await` to wait for the parsing to complete and get the actual data.

---

## Answer 10 -- async/await Execution Order

**Output: `D`, `A`, `E`, `B`, `C`**

1. `console.log("D")` -- sync, prints `D`.
2. `foo()` is called. Inside foo:
   - `console.log("A")` -- sync, prints `A`.
   - `await Promise.resolve("B")` -- pauses `foo()`. The resolved value `"B"` is scheduled as a microtask. Control returns to the caller.
3. `console.log("E")` -- sync, prints `E`.
4. Call Stack empty. Microtask Queue processes the await resume:
   - `result` becomes `"B"`, prints `B`.
   - `console.log("C")` prints `C`.

The code after `await` does not execute immediately because `await` yields control back to the caller. The continuation is placed in the Microtask Queue and only runs after the current synchronous execution completes.

---

## Answer 11 -- for await...of Pattern

**a)** `for await...of` awaits each promise **one at a time, in order**. It waits for promise 1 to settle, then moves to promise 2, etc. `Promise.all` starts all promises concurrently and waits for all of them (or the first rejection).

**b)** The bunny cards appear at:
- ~1 second: first bunny (resolves with "1 second")
- ~2 seconds: second bunny (resolves with "2 seconds")
- ~5 seconds: error occurs (third promise rejects with "5 seconds")

Note: all promises start executing immediately when `getPromises()` is called, but `for await` processes their results sequentially.

**c)** The fourth promise (10s resolve) is **never processed** by the loop because the `catch` block is entered when the third promise rejects. The fourth promise still runs in the background but its result is ignored.

---

## Answer 12 -- Fetch API Fundamentals

**a)** `fetch(url)` returns a **Promise** that resolves to a **Response** object.

**b)** `response.ok` is a boolean that is `true` when the HTTP status code is in the range 200-299, and `false` otherwise.

**c)** Two methods:
- `response.json()` -- returns a **Promise** that resolves to the parsed JSON body
- `response.text()` -- returns a **Promise** that resolves to the body as a string

**d)** A **network error** means the request never reached the server (no connection, DNS failure, CORS block) -- `fetch` rejects the Promise. An **HTTP error** means the server responded but with an error status code (404, 500, etc.) -- `fetch` resolves successfully, but `response.ok` is `false`.

---

## Answer 13 -- Promise Constructor

**Output: `X`, `Z`, `W`, `Y`**

The function passed to the Promise constructor (the executor) runs **synchronously and immediately**:
1. `console.log("X")` -- sync inside executor, prints `X`.
2. `resolve("Y")` -- resolves the promise, but `.then` callbacks are microtasks (scheduled, not run yet).
3. `console.log("Z")` -- sync inside executor (calling resolve does NOT stop execution), prints `Z`.
4. `console.log("W")` -- sync outside the promise, prints `W`.
5. Call Stack empty. Microtask: the `.then` callback runs, prints `Y`.

---

## Answer 14 -- Microtasks vs Macrotasks

**a)** 
- Microtasks: **Promise callbacks** (`.then`, `.catch`, `.finally`), **queueMicrotask()**
- Macrotasks: **setTimeout**, **setInterval**, **DOM events**, **I/O callbacks**

**b)** The **microtask queue has priority**. After each macrotask completes, the Event Loop drains the **entire** microtask queue before picking the next macrotask. This means all pending microtasks run before any waiting macrotask.

**c)** `Promise.resolve().then(...)` executes before `setTimeout(..., 0)` because Promise callbacks go to the **microtask queue**, while setTimeout callbacks go to the **macrotask queue**. After the synchronous code finishes (itself a macrotask), the Event Loop processes all microtasks first, then moves to the next macrotask.

---

## Answer 15 -- Promise.all vs for await...of Timing

**a)** `Promise.all` runs all promises **concurrently**. It resolves after **3 seconds** (the slowest promise). The value is `["A", "B", "C"]` -- in the same order as the input array, not in the order they resolved.

**b)** `for await...of` awaits each promise **in input order**:
- At ~3 seconds: `"A"` (first promise, 3s timer)
- At ~3 seconds: `"B"` (second promise already resolved at 1s, available immediately)
- At ~3 seconds: `"C"` (third promise already resolved at 2s, available immediately)

**c)** With `for await...of`, all promises start running at creation time. The loop just awaits them in order. The first promise takes 3 seconds, but by then promises 2 and 3 have already resolved, so they are available immediately when awaited. With `Promise.all`, all promises also run concurrently but it simply waits for all to finish. The key difference is that `for await...of` gives you each result as soon as you reach it in order, while `Promise.all` gives you all results at once when the slowest finishes.

---

## Answer 16 -- Error Propagation in Chains

**Output:**
```
start
Caught: oops
recovered
```

1. First `.then`: receives `"start"`, logs it, then throws an Error.
2. Second `.then`: **skipped** because the chain is now in a rejected state.
3. `.catch`: catches the error, logs `"Caught: oops"`, and returns `"recovered"` -- this **resets** the chain back to fulfilled state.
4. Final `.then`: receives `"recovered"` from the catch's return value, logs it.

---

## Answer 17 -- Course Code Analysis

**a)** Passing two functions to `.then(onFulfilled, onRejected)` handles both outcomes in a single `.then` call. Using `.then().catch()` is a separate chain where `.catch` also catches errors thrown inside the `.then` handler itself. With two arguments, the `onRejected` only handles the original promise rejection, not errors in `onFulfilled`.

**b)** The first function (onFulfilled) runs -- it shows the winning bunny and marks others as "out-of-race".

**c)** The second function (onRejected) runs -- it marks the bunny as "hurt" and shows the rejection reason.

**d)** `Promise.race` does **not** wait for other promises. It settles as soon as the first promise settles. The other promises continue executing in the background, but their results are ignored by `Promise.race`.

---

## Answer 18 -- Combining Concepts

**Output: `6`, `1`, `2`, `7`, `3`, `4`, `5`**

Step-by-step:
1. `console.log("6")` -- sync, prints `6`.
2. `process()` is called:
   - `console.log("1")` -- sync, prints `1`.
   - `new Promise(executor)` -- executor runs synchronously:
     - `console.log("2")` -- prints `2`.
     - `setTimeout(() => { console.log("3"); resolve("4"); }, 0)` -- callback goes to Macrotask Queue.
   - `await` pauses `process()`, returns control to caller.
3. `console.log("7")` -- sync, prints `7`.
4. Call Stack empty. No microtasks. Process Macrotask Queue:
   - setTimeout callback runs: prints `3`, calls `resolve("4")`.
   - The await resumes as a microtask.
5. Microtask: `process()` resumes:
   - `result` is `"4"`, prints `4`.
   - `console.log("5")` prints `5`.
