# 06 — FORMS (react-hook-form)
> Web Programming II — Final Exam Study Guide
> Target: 100%

---

## Table of Contents
1. [Controlled vs Uncontrolled Inputs](#1-controlled-vs-uncontrolled-inputs)
2. [Why react-hook-form Exists](#2-why-react-hook-form-exists)
3. [Core API: useForm](#3-core-api-useform)
4. [register()](#4-register)
5. [handleSubmit()](#5-handlesubmit)
6. [formState: errors, isSubmitting, isDirty, isValid](#6-formstate)
7. [Validation Rules](#7-validation-rules)
8. [Controller — for Controlled Components](#8-controller)
9. [watch, setValue, reset](#9-watch-setvalue-reset)
10. [Default Values](#10-default-values)
11. [Schema Validation: Zod + Yup via Resolvers](#11-schema-validation-zod--yup)
12. [Error Display Patterns](#12-error-display-patterns)
13. [Form Submission & Async Validation](#13-form-submission--async-validation)
14. [Full Code Example: Signup Form](#14-full-code-example-signup-form)
15. [Client vs Server Validation](#15-client-vs-server-validation)
16. [Exam Questions (Exact Match)](#16-exam-questions-exact-match)
17. [Cheat Sheet](#17-cheat-sheet)

---

## 1. Controlled vs Uncontrolled Inputs

### The fundamental choice

| Aspect | Controlled | Uncontrolled |
|--------|-----------|--------------|
| **Where value lives** | React state (`useState`) | The DOM itself |
| **How to read value** | From state variable | Via `ref.current.value` |
| **Re-renders on each keystroke** | YES — every character typed triggers `setState` and a re-render | NO — DOM manages it; React is not involved |
| **Real-time features** | Easy — value is always in state | Harder — must read from ref |
| **Validation timing** | Instant (value always known) | On demand (read ref when needed) |
| **react-hook-form uses** | Optionally via `Controller` | By default (uncontrolled) |

### Controlled input (useState approach):
```tsx
function ControlledForm() {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Email:', email); // value always in state
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}                          // React controls the value
        onChange={(e) => setEmail(e.target.value)} // re-renders on every keystroke
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Uncontrolled input (useRef approach):
```tsx
function UncontrolledForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value; // read from DOM only on submit
    console.log('Email:', value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} type="email" /> {/* DOM manages the value */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Key exam point:
> **react-hook-form uses uncontrolled inputs by default.** The `register()` function attaches a `ref` to the input — React does NOT manage the value via state. This means there are **no re-renders on each keystroke**, only on validation events. This is the primary performance advantage.

---

## 2. Why react-hook-form Exists

### The problem with useState for forms

With a 5-field form using `useState`, every single keystroke in any field re-renders the **entire form component**. On large forms, this is expensive.

```tsx
// BAD: 5 useStates = re-render on every keystroke in every field
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [bio, setBio] = useState('');
```

### react-hook-form's solution
- Inputs are **uncontrolled** — values live in the DOM, not React state
- The library reads values from the DOM only when needed (on submit or validation)
- Re-renders happen only when: **validation triggers**, **error state changes**, or **formState fields change**

### Primary advantage (exam exact answer — Mock Q15):
> **"It reduces unnecessary re-renders by using uncontrolled inputs and only re-renders on validation events."**

---

## 3. Core API: useForm

```tsx
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  password: string;
  age: number;
};

const {
  register,
  handleSubmit,
  formState,
  watch,
  setValue,
  reset,
  control,
} = useForm<FormData>({
  mode: 'onSubmit',        // when to validate (default)
  defaultValues: {
    name: '',
    email: '',
    password: '',
    age: 18,
  },
});
```

### useForm options

| Option | Values | Description |
|--------|--------|-------------|
| `mode` | `"onSubmit"` (default), `"onChange"`, `"onBlur"`, `"onTouched"`, `"all"` | When validation triggers |
| `defaultValues` | Object matching form shape | Initial values for all fields |
| `resolver` | `zodResolver(schema)`, `yupResolver(schema)` | External schema validation |

### Default mode is `"onSubmit"`:
> **Exam note:** The default mode for react-hook-form is `"onSubmit"`. This means validation only runs when the user tries to submit. To validate as the user types, use `mode: "onChange"`.

### mode options explained:
- `"onSubmit"` — validates only when form is submitted (default, best UX for initial state)
- `"onChange"` — validates on every keystroke (instant feedback, more re-renders)
- `"onBlur"` — validates when user leaves the field (good middle ground)
- `"onTouched"` — validates on blur after first touch, then onChange
- `"all"` — validates on both blur and change

---

## 4. register()

`register()` is how you connect an HTML input to react-hook-form. You spread its return value onto the input element.

### Basic usage:
```tsx
<input {...register("email")} type="email" />
```

### What register() returns:
```tsx
// register("email") returns an object like:
{
  name: "email",
  ref: ...,      // internal ref so RHF can read the DOM value
  onChange: ..., // for validation triggering
  onBlur: ...,   // for onBlur mode
}
```

### register() with validation rules:
```tsx
<input
  {...register("email", {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email address",
    },
    minLength: {
      value: 5,
      message: "Email must be at least 5 characters",
    },
  })}
  type="email"
/>
```

### IMPORTANT: Do NOT use `type` as a validation rule
```tsx
// WRONG — "type" is NOT a valid validation rule for register()
register("email", { type: "email" })  // does nothing

// CORRECT — use "pattern" for format validation
register("email", { pattern: { value: /regex/, message: "msg" } })
```

---

## 5. handleSubmit()

`handleSubmit` wraps your submit handler. It:
1. Runs all validation
2. If validation passes → calls your `onValid` function with the form data
3. If validation fails → populates `formState.errors`, does NOT call `onValid`

```tsx
const onSubmit = (data: FormData) => {
  // data is fully typed and validated
  console.log(data); // { name: "Alice", email: "alice@example.com", ... }
};

const onError = (errors: FieldErrors<FormData>) => {
  // called only when validation fails
  console.log(errors);
};

<form onSubmit={handleSubmit(onSubmit, onError)}>
```

### Async submit handler:
```tsx
const onSubmit = async (data: FormData) => {
  try {
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
  }
};
```

### Exam fill-in-blank answer (Mock Q16 blank 6):
> The validated data is passed to the function provided to **`handleSubmit`**.

---

## 6. formState

`formState` is an object containing the current state of the form. Destructure only what you need.

```tsx
const {
  formState: { errors, isSubmitting, isDirty, isValid, touchedFields, dirtyFields }
} = useForm<FormData>();
```

### formState properties:

| Property | Type | Description |
|----------|------|-------------|
| `errors` | `FieldErrors<T>` | Validation errors per field. **Access as `formState.errors`** (NOT bare `errors` in some contexts) |
| `isSubmitting` | `boolean` | `true` while the async submit handler is running |
| `isDirty` | `boolean` | `true` if any field has been changed from its default value |
| `isValid` | `boolean` | `true` if the form has no errors (only reliable when `mode` is NOT `"onSubmit"`) |
| `touchedFields` | `object` | Which fields have been focused and blurred |
| `dirtyFields` | `object` | Which fields have been changed |
| `isSubmitSuccessful` | `boolean` | `true` after a successful submit |

### Accessing errors:
```tsx
// formState.errors is an object keyed by field name
const { formState: { errors } } = useForm<FormData>();

// Access field error:
errors.email         // the error object for the "email" field
errors.email?.message  // the error message string

// Exact exam answer (Mock Q16 blank 3):
// "Validation errors for a field named email are accessed via formState.errors"
// (NOT just "errors" — the full path is formState.errors)
```

### Using isSubmitting for loading state:
```tsx
<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>
```

### Using isDirty to prevent unnecessary submissions:
```tsx
<button type="submit" disabled={!isDirty || isSubmitting}>
  Save Changes
</button>
```

---

## 7. Validation Rules

These are the **built-in** validation rules you can pass to `register()`. Know all of them — the exam tests which ones are real.

| Rule | Type | Example |
|------|------|---------|
| `required` | `string \| boolean \| { value: boolean, message: string }` | `required: "This field is required"` |
| `minLength` | `{ value: number, message: string }` | `minLength: { value: 3, message: "Min 3 chars" }` |
| `maxLength` | `{ value: number, message: string }` | `maxLength: { value: 50, message: "Max 50 chars" }` |
| `min` | `{ value: number, message: string }` | `min: { value: 18, message: "Must be 18+" }` — for number inputs |
| `max` | `{ value: number, message: string }` | `max: { value: 100, message: "Max 100" }` — for number inputs |
| `pattern` | `{ value: RegExp, message: string }` | `pattern: { value: /^\d+$/, message: "Numbers only" }` |
| `validate` | `function \| object of functions` | Custom async or sync validation |

### NOT valid rules (exam trap):
- `type` — NOT a validation rule
- `sanitize` — NOT a validation rule
- `format` — NOT a validation rule

### Exact exam answer (Mock Q17 / Practice Exam 2 Q19):
- YES: `required`, `minLength`, `maxLength`, `pattern`, `validate`
- NO: `type`, `sanitize`, `format`

### validate — custom validation:
```tsx
register("username", {
  validate: async (value) => {
    const res = await fetch(`/api/check-username?username=${value}`);
    const { available } = await res.json();
    return available || "Username is already taken";
  }
})

// Multiple validate functions:
register("password", {
  validate: {
    hasUppercase: (v) => /[A-Z]/.test(v) || "Must contain uppercase",
    hasNumber: (v) => /\d/.test(v) || "Must contain a number",
    minLength: (v) => v.length >= 8 || "Min 8 characters",
  }
})
```

### Full register example with multiple rules:
```tsx
<input
  {...register("password", {
    required: "Password is required",
    minLength: { value: 8, message: "At least 8 characters" },
    maxLength: { value: 128, message: "Max 128 characters" },
    pattern: {
      value: /^(?=.*[A-Z])(?=.*\d)/,
      message: "Must contain uppercase and number",
    },
  })}
  type="password"
/>
```

---

## 8. Controller — for Controlled Components

`Controller` is used when you need to integrate a **controlled** third-party component (like a custom Select, DatePicker, or UI library component) that doesn't expose a native `ref`.

### Why Controller exists:
`register()` works by attaching a ref to a native HTML input. Some components (Radix UI, MUI, React Select, etc.) do not forward refs properly or need their own `value`/`onChange` props. `Controller` bridges this gap.

```tsx
import { Controller } from 'react-hook-form';

// Usage with a custom component:
<Controller
  name="country"
  control={control}  // from useForm()
  rules={{ required: "Please select a country" }}
  render={({ field, fieldState }) => (
    <Select
      {...field}                    // spreads value, onChange, onBlur, ref
      options={countryOptions}
      error={fieldState.error?.message}
    />
  )}
/>

// Usage with a native select (you could also just use register, but this is an example):
<Controller
  name="role"
  control={control}
  defaultValue="user"
  render={({ field }) => (
    <select {...field}>
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  )}
/>
```

### Controller vs register:

| | `register()` | `Controller` |
|--|--|--|
| Use for | Native HTML inputs (`input`, `textarea`, `select`) | Third-party controlled components |
| Renders as | Uncontrolled (ref-based) | Controlled (value+onChange) |
| `control` prop needed | No | Yes |

---

## 9. watch, setValue, reset

### watch() — observe field values:
```tsx
const { watch } = useForm<FormData>();

// Watch a single field:
const password = watch("password");

// Watch multiple fields:
const [firstName, lastName] = watch(["firstName", "lastName"]);

// Watch all fields:
const allValues = watch();

// Use case: conditional fields
const accountType = watch("accountType");
{accountType === "business" && (
  <input {...register("companyName", { required: "Company name required" })} />
)}

// Use case: confirm password validation
register("confirmPassword", {
  validate: (value) =>
    value === watch("password") || "Passwords do not match",
});
```

### setValue() — programmatically set a field value:
```tsx
const { setValue } = useForm<FormData>();

// Set a value (does NOT trigger validation by default):
setValue("email", "user@example.com");

// Set with validation:
setValue("email", "user@example.com", { shouldValidate: true });

// Set and mark dirty:
setValue("email", "user@example.com", { shouldDirty: true });

// Use case: after fetching user data
useEffect(() => {
  fetch('/api/user').then(r => r.json()).then(user => {
    setValue("name", user.name);
    setValue("email", user.email);
  });
}, []);
```

### reset() — reset form to default values:
```tsx
const { reset } = useForm<FormData>();

// Reset to original defaultValues:
reset();

// Reset to new values:
reset({
  name: "Alice",
  email: "alice@example.com",
});

// Use case: after successful submission
const onSubmit = async (data: FormData) => {
  await saveData(data);
  reset(); // clear the form
};

// Use case: edit form — populate with existing data
useEffect(() => {
  if (existingUser) {
    reset(existingUser); // fills form with server data
  }
}, [existingUser]);
```

---

## 10. Default Values

Default values pre-populate the form and define the "clean" state for `isDirty`.

```tsx
// Option 1: inline in useForm
const { register } = useForm<FormData>({
  defaultValues: {
    name: "",
    email: "",
    age: 18,
    newsletter: false,
  },
});

// Option 2: async default values (from API)
const { register } = useForm<FormData>({
  defaultValues: async () => {
    const res = await fetch('/api/user/profile');
    return res.json(); // must match FormData shape
  },
});
```

> **Exam note:** Always set `defaultValues` for every field. If a field has no default value, it starts as `undefined`, which can cause issues with `isDirty` comparison and TypeScript types.

---

## 11. Schema Validation: Zod + Yup

Instead of defining validation rules on each `register()` call, you can define a single schema and pass it via the `resolver` option.

### Why use a resolver:
- Centralized validation logic
- Same schema can be shared between client and server
- More expressive validation (cross-field dependencies, transforms)
- Works with TypeScript to infer types

### Zod (most common in modern React):

```bash
npm install @hookform/resolvers zod
```

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define the schema
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/\d/, "Must contain at least one number"),
  age: z.number().min(18, "Must be 18 or older").max(120),
});

// 2. Infer the TypeScript type from the schema
type FormData = z.infer<typeof schema>;

// 3. Pass schema to useForm via resolver
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    name: "",
    email: "",
    password: "",
    age: 18,
  },
});
```

### Yup (older, still common):

```bash
npm install @hookform/resolvers yup
```

```tsx
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().min(2).required("Name is required"),
  email: yup.string().email("Enter a valid email").required(),
  password: yup.string().min(8).required(),
});

type FormData = yup.InferType<typeof schema>;

const { register } = useForm<FormData>({
  resolver: yupResolver(schema),
});
```

### Exam exact answer (Mock Q16 blank 5):
> To integrate a schema validation library like Zod, you pass it via the **`resolver`** option. Usage: `resolver: zodResolver(schema)`.

### Cross-field validation with Zod:
```tsx
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // attach error to this field
});
```

---

## 12. Error Display Patterns

### Pattern 1: Inline below the field (most common):
```tsx
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    {...register("email", { required: "Email is required" })}
    aria-invalid={!!errors.email}
  />
  {errors.email && (
    <span role="alert" style={{ color: "red" }}>
      {errors.email.message}
    </span>
  )}
</div>
```

### Pattern 2: Helper component:
```tsx
function FieldError({ error }: { error?: FieldError }) {
  if (!error) return null;
  return <p className="field-error">{error.message}</p>;
}

// Usage:
<FieldError error={errors.email} />
```

### Pattern 3: With Zod resolver — errors come from schema:
```tsx
// The error message comes from Zod, not from register()
const schema = z.object({
  email: z.string().email("Invalid email format"),
});

// errors.email.message will be "Invalid email format"
{errors.email && <span>{errors.email.message}</span>}
```

### Pattern 4: Summary of all errors:
```tsx
{Object.keys(errors).length > 0 && (
  <div className="error-summary">
    <ul>
      {Object.entries(errors).map(([field, error]) => (
        <li key={field}>{error?.message}</li>
      ))}
    </ul>
  </div>
)}
```

---

## 13. Form Submission & Async Validation

### Standard async submission:
```tsx
const onSubmit = async (data: FormData) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    reset();
    router.push('/dashboard');
  } catch (error) {
    // Set a server-side error on a specific field using setError
    setError("email", { message: "This email is already registered" });
  }
};
```

### setError — set server errors after submission:
```tsx
const { setError } = useForm<FormData>();

// In your submit handler, after API call:
const res = await fetch('/api/register', { ... });
const json = await res.json();

if (json.error === 'EMAIL_TAKEN') {
  setError("email", {
    type: "server",
    message: "This email is already registered",
  });
}
```

### Async validate rule (field-level async check):
```tsx
register("username", {
  validate: async (value) => {
    if (value.length < 3) return true; // let minLength handle it
    const res = await fetch(`/api/check-username?q=${encodeURIComponent(value)}`);
    const { available } = await res.json();
    return available || "Username already taken";
  },
});
```

### isSubmitting — disable button during submission:
```tsx
// React Hook Form automatically sets isSubmitting to true
// while your async handleSubmit callback is running
const { formState: { isSubmitting } } = useForm();

<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save'}
</button>
```

---

## 14. Full Code Example: Signup Form

This is the type of full form example likely to appear in an essay question.

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Schema definition
const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/\d/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// 2. Infer type
type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 3. Submit handler
  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const json = await response.json();
        if (json.code === "EMAIL_TAKEN") {
          setError("email", { message: "This email is already registered" });
          return;
        }
        throw new Error("Registration failed");
      }

      reset();
      // redirect to login or dashboard
    } catch (err) {
      console.error(err);
    }
  };

  // 4. JSX
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Name field */}
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && <span role="alert">{errors.name.message}</span>}
      </div>

      {/* Email field */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span role="alert">{errors.email.message}</span>}
      </div>

      {/* Password field */}
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <span role="alert">{errors.password.message}</span>
        )}
      </div>

      {/* Confirm password field */}
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <span role="alert">{errors.confirmPassword.message}</span>
        )}
      </div>

      {/* Submit button */}
      <button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
```

### What this example demonstrates:
- `zodResolver` for schema-based validation
- `z.infer<typeof schema>` for TypeScript types
- `.refine()` for cross-field validation (password matching)
- `defaultValues` for all fields
- Spreading `{...register("fieldName")}` onto each input
- `errors.fieldName?.message` for error display
- `isSubmitting` to disable button during async operation
- `isDirty` to prevent submitting an untouched form
- `setError` for server-side validation feedback
- `reset()` after successful submission

---

## 15. Client vs Server Validation

### Why you need BOTH

| | Client-side (react-hook-form) | Server-side |
|--|--|--|
| **Purpose** | UX — instant feedback, no network round-trip | Security — the actual enforcement |
| **Can be bypassed** | YES — user can disable JS, use Postman, curl, DevTools | NO — server always runs the check |
| **Should trust it?** | Never trust client data alone | Always the source of truth |

### The key exam argument (Mock Q22c):
> **Client-side validation can be bypassed entirely.** Without server-side validation, an attacker could use `curl` or Postman to POST `{ email: "x", password: "" }` directly to the Server Action endpoint, storing an empty password hash in the database. The server must always re-validate.

### Data flow with both:
```
User fills form
    ↓
react-hook-form validates (client)
    ↓ fails → show errors to user (stops here)
    ↓ passes
Server Action called ("use server")
    ↓
Server re-validates with same Zod schema
    ↓ fails → return error to client
    ↓ passes
Save to database
```

### Sharing the schema between client and server:
```tsx
// lib/schemas/auth.ts
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignupInput = z.infer<typeof signupSchema>;

// Client component — uses zodResolver
import { signupSchema } from '@/lib/schemas/auth';
const { register } = useForm({ resolver: zodResolver(signupSchema) });

// Server Action — re-validates the same schema
import { signupSchema } from '@/lib/schemas/auth';
async function registerUser(data: unknown) {
  "use server";
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };
  // ... save to DB
}
```

---

## 16. Exam Questions (Exact Match)

### Fill-in-the-blank (Mock Q16 — memorize these exactly)

**Question:** Complete the following sentences about react-hook-form:

1. The core hook used to initialise a form is __________.
2. To connect an input field to the form, you spread the result of calling __________ with the field name onto the input element.
3. Validation errors for a field named email are accessed via __________.
4. To validate as the user types rather than on submit, you set the mode option to __________.
5. To integrate a schema validation library like Zod, you pass it via the __________ option.
6. When a form is submitted successfully, the validated data is passed to the function provided to __________.

**Answers:**
1. `useForm`
2. `register`
3. `formState.errors`
4. `onChange`
5. `resolver`
6. `handleSubmit`

---

### Multiple choice (Mock Q15)

**Q: What is the primary advantage of react-hook-form over managing form state with useState?**

**A: It reduces unnecessary re-renders by using uncontrolled inputs and only re-renders on validation events.**

(NOT: sends data automatically, replaces server validation, only works with TypeScript)

---

### Select all that apply (Mock Q17 / Practice Q19)

**Q: Which are valid built-in validation rules for register()?**

| Rule | Valid? |
|------|--------|
| `required` | YES |
| `minLength` | YES |
| `maxLength` | YES |
| `pattern` | YES |
| `validate` | YES |
| `min` | YES |
| `max` | YES |
| `type` | NO |
| `sanitize` | NO |
| `format` | NO |

---

### Essay question (Mock Q22 / Practice Exam 2 Q17)

**Q: Building a registration/contact form in Next.js with react-hook-form. Answer:**

**Part a) react-hook-form implementation:**
```tsx
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
// Display error:
{errors.email && <span>{errors.email.message}</span>}
```
Key methods: `useForm`, `register`, `handleSubmit`, `formState.errors`.

**Part b) Server Action vs API Route:**
Use a **Server Action** — the form is internal to the Next.js app; no external client needs a public URL.
1. User submits → client-side Zod validation runs via resolver
2. If valid → Server Action called (`"use server"`)
3. Server re-validates with same schema, checks DB, hashes password, saves user
4. Returns success → redirect, or returns error → `setError()` to display to user

**Part c) Why server-side validation is still required:**
Client-side validation can be bypassed entirely. A user could use `curl` or DevTools to POST `{ email: "x", password: "" }` directly to the Server Action, storing an empty password hash. The server must always re-validate independently.

---

### Fill-in-the-blank (Practice Exam 2 Q18)

**Answers:**
1. `useForm`
2. `register`
3. `onChange`
4. `formState.errors` (for field "password": `formState.errors.password`)
5. `resolver`

---

## 17. Cheat Sheet

```
INSTALL:   npm install react-hook-form @hookform/resolvers zod

SETUP:
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty, isValid },
          watch, setValue, reset, control, setError } = useForm<T>({
    resolver: zodResolver(schema),   // optional
    mode: "onSubmit",                // default; use "onChange" or "onBlur" for live validation
    defaultValues: { ... },
  });

CONNECT INPUT:
  <input {...register("fieldName", { required: "msg", minLength: { value: 3, message: "msg" } })} />

HANDLE SUBMIT:
  <form onSubmit={handleSubmit(onSubmit)}>

SHOW ERRORS:
  {errors.fieldName && <span>{errors.fieldName.message}</span>}

VALID RULES:        required, minLength, maxLength, min, max, pattern, validate
INVALID RULES:      type, sanitize, format   ← NOT real rules

MODE:
  "onSubmit"  = validate on submit only (DEFAULT)
  "onChange"  = validate as user types
  "onBlur"    = validate when user leaves field

RESOLVER (Zod):
  resolver: zodResolver(z.object({ email: z.string().email() }))

CONTROLLER (for non-native inputs):
  <Controller name="x" control={control} render={({ field }) => <CustomInput {...field} />} />

WATCH:    const val = watch("fieldName")
SETVALUE: setValue("fieldName", "value", { shouldValidate: true })
RESET:    reset()  or  reset({ name: "new value" })

PRIMARY ADVANTAGE: Uncontrolled inputs = no re-render on every keystroke

DEFAULT MODE: "onSubmit"

FORMSTATE KEY PATHS:
  formState.errors          = all errors object
  formState.errors.email    = error for email field
  formState.errors.email.message = error message string
  formState.isSubmitting    = true while async handler runs
  formState.isDirty         = true if any field changed
  formState.isValid         = true if no errors

SERVER VALIDATION: Always required — client can be bypassed with curl/DevTools
```

---

### Common exam traps summary

| Trap | Correct answer |
|------|---------------|
| "errors" vs "formState.errors" | Always `formState.errors` — the exact path matters |
| Default mode | `"onSubmit"` (NOT onChange) |
| Is `type` a valid rule? | NO |
| Is `sanitize` a valid rule? | NO |
| Does RHF use controlled or uncontrolled by default? | Uncontrolled |
| Why is RHF faster than useState? | No re-render on every keystroke |
| Can client validation replace server validation? | NEVER — can be bypassed |
| What does `resolver` do? | Integrates Zod/Yup schema validation |
| What does `Controller` do? | Wraps third-party controlled components |
| What prop does `Controller` need? | `control` (from useForm) |
