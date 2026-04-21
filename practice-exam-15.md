# Practice Exam 15 -- TypeScript (Advanced), DOM Selectors, Next.js Rendering

---

### 1. According to the slides, what happens when a type is omitted in TypeScript and cannot be inferred?

- A) TypeScript throws a compilation error immediately
- B) TypeScript assigns the `any` type
- C) TypeScript assigns the `unknown` type
- D) TypeScript assigns the `void` type

---

### 2. According to the slides, what does the `any` type mean and why should it be avoided?

> "When working with the **any** type it is identical to working with JavaScript, meaning that variables can be of any possible types and is determined by how it is used"

- A) The `any` type is the most strict type in TypeScript and should be used everywhere
- B) The `any` type makes TypeScript behave identically to JavaScript, meaning variables can be of any possible types -- this is called giving a type an implicit any and should in most cases be avoided
- C) The `any` type only applies to numbers and strings
- D) The `any` type is automatically removed during compilation

---

### 3. Given the following code from the slides, what happens when `noImplicitAny` is disabled vs. enabled?

```ts
// When noImplicitAny is disabled:
function sum(a, b, c) {
  return a + b + c;
}
// This is perfectly legal when noImplicitAny is disabled
sum("A", 1, [1, 2, 3]);
```

```ts
// When noImplicitAny is enabled:
function sum(a: any, b: any, c: any) {
  return a + b + c;
}
// This is perfectly legal when noImplicitAny is enabled
// but you must explicitly state the any type
sum("A", 1, [1, 2, 3]);
```

- A) Both versions produce a compilation error
- B) When `noImplicitAny` is disabled, parameters without types are implicitly `any` and no error is produced. When `noImplicitAny` is enabled, you must explicitly state the `any` type on each parameter or TypeScript will produce an error
- C) `noImplicitAny` has no effect on function parameters
- D) When `noImplicitAny` is enabled, the `any` type is completely forbidden

---

### 4. According to the slides, what are the two equivalent syntaxes for typing arrays in TypeScript?

```ts
const numberArray: number[] = [1, 2, 3];
const numberArray: Array<number> = [1, 2, 3];
```

- A) Only `number[]` is valid syntax; `Array<number>` is deprecated
- B) `number[]` and `Array<number>` are both valid and equivalent syntaxes for typing arrays
- C) `Array<number>` is for read-only arrays, while `number[]` is for mutable arrays
- D) `number[]` creates a tuple, while `Array<number>` creates an array

---

### 5. According to the slides, what are the two categories of type declarations for functions?

> "Functions are a little bit more complex than variables because they can accept multiple parameters, which all have a specific type and also a return value with a certain type"

- A) Input types and Output types
- B) Parameter Type Annotations and Return Type Annotations
- C) Argument types and Result types
- D) Generic types and Specific types

---

### 6. Given the following code from the slides, why does `greet(42)` produce an error?

```ts
function greet(name: string) {
  return `Hello ${name}! What a wonderful day today.`;
}

// Will not work because a number is not compatible with string
greet(42);
```

- A) The function `greet` does not exist
- B) The number `42` is not compatible with the parameter type `string` -- the Parameter Type Annotation enforces the user of the function to pass in the correct types
- C) The template literal syntax is incorrect
- D) The function must have a return type annotation to work

---

### 7. Given the following code from the slides, why does the function produce an error even though it is called correctly with `greet("John")`?

```ts
function greet(name: string): string {
  // Will not work because a number is not compatible with
  // the return type string
  return 444 + 555;
}

greet("John");
```

- A) `"John"` is not a valid string
- B) The function call `greet("John")` is incorrect
- C) The Return Type Annotation declares that the function must return a `string`, but `444 + 555` evaluates to a `number` which is not compatible with the return type `string`
- D) Addition of numbers is not allowed in TypeScript

---

### 8. According to the slides about optional properties, what is the default behavior when declaring an object type, and how do you make a property optional?

```ts
function printName(obj: { first: string; last?: string }) {
  // You will be notified by the IDE that last might be null
  const fullName = `${obj.first} ${obj.last.toUpperCase()}`;
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

- A) All properties are optional by default; you use `!` to make them required
- B) When declaring an object type then by default all properties are set as required. We can change that behaviour by explicitly setting the property as optional, which is done by using the `?` syntax
- C) Optional properties are declared using the `undefined` keyword
- D) There is no way to make properties optional in TypeScript

---

### 9. According to the slides about object types, what is the simplest way to define an object type in TypeScript?

```ts
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

- A) You must always create an interface or type alias first
- B) Object types are among the most common form of types, and the most simple way is just to list out their properties and types inline in the function signature
- C) You can only use classes to define object types
- D) Object types require a separate type definition file

---

### 10. According to the slides about anonymous functions, what is "contextual typing"?

```ts
const numbers = [1, 2, 3];
// Here both the 'acc' and 'elem' are inferred as numbers
// because the array has the type number[]
const sumOfNumbers = numbers.reduce((acc, elem) => acc + elem, 0);

const names = ["Alice", "Bob", "Lucy"];
// Here the name within the anonymous function is inferred as a string
// and therefore the IDE can determine what functions are available
// for the string and provides help
const paddedNames = names.map(name => name.padStart(3, "X"));
```

- A) You must always explicitly type parameters in anonymous functions
- B) TypeScript infers the types of parameters in anonymous functions by looking at the parent type (e.g., the array's type), so if the array is typed then the types in the anonymous functions are correctly inferred types. This is called contextual typing, meaning that the type is inferred based on the context
- C) Contextual typing only works with the `forEach` method
- D) Contextual typing means that types are determined at runtime

---

### 11. According to the slides, what is `querySelectorAll()` and what makes it powerful?

- A) It is a method that only selects elements by their `id` attribute
- B) `querySelectorAll()` is probably the most powerful selector the document has to offer. It accepts any valid CSS selector and matches that to elements in the DOM
- C) It is identical to `getElementsByClassName()` and only selects by class name
- D) It can only select a single element at a time

---

### 12. According to the slides, what is the difference between the `children` property and the `childNodes` property?

- A) They are identical and return the same result
- B) `children` is just like the property `childNodes` but excludes text and comment nodes and only contains element nodes
- C) `childNodes` only returns element nodes, while `children` returns all node types
- D) `children` is deprecated and should not be used

---

### 13. According to the slides, what are the two types of server rendering in Next.js, and when does each happen?

- A) Client Rendering happens in the browser; Server Rendering happens on the CDN
- B) Static Rendering (or Prerendering) happens at build time or during revalidation and the result is cached. Dynamic Rendering happens at request time in response to a client request
- C) Static Rendering uses JavaScript; Dynamic Rendering uses HTML only
- D) Both types of rendering happen at the same time

---

### 14. According to the slides, how does Next.js determine whether a route is static or dynamic?

- A) You must manually set a `static` or `dynamic` flag in every page component
- B) A route is determined as static if the HTML is pre-generated and cached and serves same content to all users (e.g. `/about`). A route is determined as dynamic if the page is rendered at request time and generates fresh data on each request (e.g. `/products`)
- C) All routes are dynamic by default in Next.js
- D) Static routes can only serve JSON data

---

### 15. According to the slides, what is streaming in Next.js, how do you enable it, and what does `loading.tsx` do?

- A) Streaming is a way to send all data at once to the client after the entire page is rendered
- B) Streaming allows the server to send parts of a dynamic route to the client as soon as they're ready, rather than waiting for the entire route to be rendered. To use streaming, you must create a `loading.tsx` in your route folder. Behind the scenes, Next.js will automatically wrap the page.tsx contents in a `<Suspense>` boundary, and the prefetched fallback UI will be shown while the route is loading and swapped for the actual content once ready
- C) Streaming only works with static routes
- D) Streaming requires a WebSocket connection to function

---

---

## Answer Key

**1. B** -- The slides state: "By omitting the type in TypeScript, and the type cannot be inferred, the type given is the **any** type."

**2. B** -- The slides state: "When working with the **any** type it is identical to working with JavaScript, meaning that variables can be of any possible types and is determined by how it is used." And: "This is called given a type an implicit any and should in most cases be avoided."

**3. B** -- The slides show two code examples: when `noImplicitAny` is disabled, `function sum(a, b, c)` is perfectly legal with no type annotations. When `noImplicitAny` is enabled, you must explicitly state `function sum(a: any, b: any, c: any)` -- you must explicitly state the any type.

**4. B** -- The slides show both syntaxes side by side: `const numberArray: number[] = [1, 2, 3];` and `const numberArray: Array<number> = [1, 2, 3];` as equivalent ways to type arrays.

**5. B** -- The slides state: "These type declarations are called: Parameter Type Annotations, Return Type Annotations."

**6. B** -- The slides show that `greet(42)` will not work "because a number is not compatible with string." The Parameter Type Annotation enforces that the user of the function passes in the correct types to the function.

**7. C** -- The slides show that even though `greet("John")` is called correctly, the function body returns `444 + 555` (a number), which is "not compatible with the return type string." The Return Type Annotation enforces the writer of the function to return the correct type stated in the function declaration.

**8. B** -- The slides state: "When declaring an object type then by default all properties are set as required. We can change that behaviour by explicitly setting the property as optional, which is done by using the ? syntax." The example shows `last?: string` making the `last` property optional.

**9. B** -- The slides state: "Object types are among the most common form of types. There are many ways to define object types in TypeScript, but the most simple one is just to list out their properties and types." The example shows inline object type annotation: `function printCoord(pt: { x: number; y: number })`.

**10. B** -- The slides state: "Anonymous functions which are passed in parameters have inferred parameter types. When using a function such as forEach, map or filter on an array the parameters in the anonymous functions are inferred by the type of the array. TypeScript infers the types by looking at the parent type, so if the array is typed then the types in the anonymous functions are correctly inferred types. This is called contextual typing, meaning that the type is inferred based on the context."

**11. B** -- The slides state: "querySelectorAll() is probably the most powerful selector the document has to offer. It accepts any valid CSS selector and matches that to elements in the DOM."

**12. B** -- The slides state: "**children** is just like the property **childNodes** but excludes text and comment nodes and only contains element nodes."

**13. B** -- The slides state: "Static Rendering (or Prerendering) happens at build time or during revalidation and the result is cached. Dynamic Rendering happens at request time in response to a client request."

**14. B** -- The slides state: "A route is determined as static if the HTML is pre-generated and cached and serves same content to all users, e.g. `/about`. A route is determined as dynamic if the page is rendered at request time and generates fresh data on each request, e.g. `/products`."

**15. B** -- The slides state: "Streaming allows the server to send parts of a dynamic route to the client as soon as they're ready, rather than waiting for the entire route to be rendered." And: "To use streaming, you must create a `loading.tsx` in your route folder." And: "Behind the scenes, Next.js will automatically wrap the page.tsx contents in a `<Suspense>` boundary. The prefetched fallback UI will be shown while the route is loading, and swapped for the actual content once ready."
