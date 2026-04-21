# Practice Exam 10 -- TypeScript

---

### 1. According to the slides, why is JavaScript described as problematic when it comes to catching errors?

- A) JavaScript does not support functions
- B) JavaScript is a compiled, statically typed language that catches all errors at build time
- C) JavaScript is an interpreted, dynamic programming language, meaning you can write code that contains "build" errors and run the code which results in an exception during execution
- D) JavaScript cannot run in the browser

---

### 2. Given the following code from the slides, which questions do we need to ask ourselves when writing VanillaJS?

```js
message.toLowerCase();
message();
```

- A) Is `message` a string? Does it have a `length` property?
- B) Is `message` callable? Does `message` have a property called `toLowerCase`? If so, is `toLowerCase` callable? If both are callable, what do they return?
- C) Is `message` defined in the global scope? Is `toLowerCase` a built-in method?
- D) Does `message` return a number? Is `toLowerCase` deprecated?

---

### 3. According to the slides, what is one key benefit of TypeScript's explicit declaration of types, arguments, and return values?

- A) It makes the code run faster in the browser
- B) It reduces the file size of the application
- C) Our code editor can provide us with auto-complete features and suggestions to make our developer environment more productive
- D) It eliminates the need for testing

---

### 4. How is TypeScript designed to be adopted in an existing JavaScript project?

- A) The entire codebase must be rewritten to TypeScript at once
- B) TypeScript is built to integrate gradually to an existing JavaScript application, by replacing chunks at a time from VanillaJS to TypeScript
- C) TypeScript can only be used for new projects, not existing ones
- D) TypeScript requires a separate runtime environment from JavaScript

---

### 5. Which two commands from the slides are used to set up TypeScript via NPM?

- A) `npm install -g typescript` (global) and `npm install typescript --save-dev` (per project)
- B) `npm install ts` and `npm install ts --global`
- C) `yarn add typescript` and `npm run typescript`
- D) `npx create-typescript-app` and `npm install tsc`

---

### 6. What happens when you run `tsc hello.ts` according to the slides?

- A) It runs the TypeScript file directly in Node.js
- B) First TypeScript evaluates `hello.ts` and makes sure all the code is correct according to TypeScript. Second a file is created called `hello.js`, which is a valid VanillaJS containing the functionality setup in `hello.ts`
- C) It deletes the original `.ts` file and replaces it with a `.js` file
- D) It only checks for errors but does not produce any output

---

### 7. Which of the following are the four capabilities provided by the `tsc` / `npx tsc` command, as listed in the slides?

- A) Types by inference, Type definitions, Type composition (Unions, Generics), Structural type system
- B) Type checking, Type casting, Type coercion, Type narrowing
- C) Interfaces, Enums, Decorators, Modules
- D) Static analysis, Runtime checking, Code generation, Bundling

---

### 8. What does "types by inference" mean according to the slides?

```ts
let helloWorld = 'Hello world'; // string
let x = 3; // number
```

- A) You must always declare the type explicitly for every variable
- B) TypeScript requires a special configuration file to infer types
- C) By default TypeScript provides functionality without setting anything up. This works because TypeScript understands JavaScript and can therefore interpret certain things without explicit definitions
- D) Type inference only works for string variables

---

### 9. According to the slides, when do we need to provide a "type definition" using an interface?

- A) For every variable in the program
- B) Only for numbers and strings
- C) When we have a complex type, TypeScript cannot guess how it should be structured, therefore we need to provide an interface for the complex type
- D) Only when using generics

---

### 10. Given the following slide example about structural type system, which call will FAIL and why?

```ts
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) { console.log(`${p.x}, ${p.y}`); }

const point3d = { x: 1, y: 2, z: 3 };
logPoint(point3d); // logs "1, 2"

const rect = { x: 1, y: 2, width: 30, height: 40 };
logPoint(rect); // logs "1, 2"

const animal = { type: 'cow', name: 'Fred' };
logPoint(animal); // fails
```

- A) `logPoint(point3d)` fails because it has an extra `z` property
- B) `logPoint(rect)` fails because it has `width` and `height` properties
- C) `logPoint(animal)` fails because `animal` does not have `x` and `y` properties -- the shape-matching only requires a subset of the object's fields to match, but the object must declare the required properties
- D) All three calls succeed

---

### 11. What error does TypeScript produce in the following slide example, and what happens to the output `.js` file?

```ts
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}`);
}

greet('Zorban');
```

- A) No error is produced and no `.js` file is generated
- B) "Expected 2 arguments, but got 1." -- but a `hello.js` file is still generated with VanillaJS, because TypeScript is built with migration in mind
- C) "Expected 2 arguments, but got 1." -- and no `.js` file is generated because of the error
- D) "Unexpected token" -- the entire compilation fails

---

### 12. What is the purpose of explicit types in the following slide example, and why does the second call produce an error?

```ts
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

// This will show errors because "03/03/2023" is of type string
// but the expected type is Date
greet("Michelangelo", "03/03/2023");
```

- A) Explicit types make the code run faster
- B) Explicit types provide type safety and enforce consistent usage of the function -- `"03/03/2023"` is of type `string` but the expected type is `Date`
- C) Explicit types are only for documentation and have no effect
- D) The error is caused by the function name, not the types

---

### 13. According to the slides, what two things happen during TypeScript compilation (erased types and downleveling)?

- A) Comments are removed and variables are renamed
- B) All type annotations are stripped out, and the template literals syntax is changed to using the `concat()` method instead
- C) Only type annotations are removed; everything else stays the same
- D) The code is minified and obfuscated

---

### 14. Why are type annotations stripped out and template literals converted to `concat()` during compilation, according to the slides?

- A) To make the code smaller
- B) 1) Type annotations are not a part of JS and therefore browsers are not equipped to handle TypeScript code -- therefore non-JS features are stripped out during compilation. 2) By default TypeScript targets ES3 (an old version of JS) which during compilation transpiles all JS code to ES3 standards
- C) To improve runtime performance
- D) Because `concat()` is faster than template literals

---

### 15. According to the slides, how does the `tsconfig.json` file control strictness in TypeScript?

- A) It has no effect on TypeScript behavior
- B) It only controls which files are compiled
- C) By setting a flag called "strict" in the `tsconfig.json` file, you enable all strict mode family options, e.g. `noImplicitAny`, `noImplicitThis`, `strictFunctionTypes`, etc. You can also opt-out to them explicitly by setting the configuration
- D) Strictness can only be set via command-line flags, not in `tsconfig.json`

---

---

## Answer Key

**1. C** -- The slides state: "JavaScript is an interpreted, dynamic programming language. This means that you can write code that contains 'build' errors and run the code which results in an exception during execution."

**2. B** -- The slides list these exact questions: Is `message` callable? Does `message` have a property called `toLowerCase`? If so, is `toLowerCase` callable? If both these values are callable, what do they return?

**3. C** -- The slides state: "Because of explicit declaration of types, arguments and return values, our code editor can provide us with auto-complete features and suggestions to make our developer environment more productive."

**4. B** -- The slides state: "TypeScript is built to integrate gradually to an existing JavaScript application, by replacing chunks at a time from VanillaJS to TypeScript."

**5. A** -- The slides show two setup options: `npm install -g typescript` for global setup (one TS version) and `npm install typescript --save-dev` for setup per project (multiple versions).

**6. B** -- The slides explain: "First of all TypeScript evaluates hello.ts and makes sure that all the code is correct according to TypeScript. Second a file is created called hello.js, which is a valid VanillaJS containing the functionality setup in hello.ts."

**7. A** -- The slides list exactly: Types by inference, Type definitions, Type composition (Unions, Generics), and Structural type system.

**8. C** -- The slides state: "By default TypeScript provides functionality without setting anything up. This works because TypeScript understands JavaScript and can therefore interpret certain things without explicit definitions."

**9. C** -- The slides state: "When we have a complex type, TypeScript cannot guess how it should be structured, therefore we need to provide an interface for the complex type, this is called a type definition."

**10. C** -- `logPoint(animal)` fails because `animal` has `{ type, name }` but no `x` or `y` properties. The slides explain that shape-matching only requires a subset of the object's fields to match, so `point3d` (has `x, y, z`) and `rect` (has `x, y, width, height`) both pass because they include `x` and `y`. But `animal` does not have the required `x` and `y`.

**11. B** -- The slides show the error "Expected 2 arguments, but got 1." and explain: "Although TypeScript generates errors, we still see an output in our generated .js files" because "TypeScript is built with migration in mind."

**12. B** -- The slides state that explicit types provide "type safety and enforce a consistent usage of the function." The error occurs because `"03/03/2023"` is of type `string` but the expected type is `Date`. The correct call is `greet("Michelangelo", new Date("03/03/2023"))`.

**13. B** -- The slides state two things happened: "1. All type annotations were stripped out. 2. The template literals syntax was changed to using the concat() method instead."

**14. B** -- The slides explain: "1. Type annotations are not a part of JS and therefore browsers aren't equipped to handle TypeScript code. Therefore non-JS features are stripped out during compilation. 2. By default TypeScript targets ES3 (an old version of JS) which during compilation transpiles all JS code ES3 standards."

**15. C** -- The slides state: "By setting a flag called 'strict' in the tsconfig.json file, you enable all strict mode family options, e.g. noImplicitAny, noImplicitThis, strictFunctionTypes, etc. You can also opt-out to them explicitly by setting the configuration."
