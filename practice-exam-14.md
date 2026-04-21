# Practice Exam 14 -- Advanced Redux, Async Patterns, and State Management Comparison

---

## Part 1: createAsyncThunk (3 questions)

### Question 1 (3 points)

The slides describe a recommended data fetching pattern when using thunks. Describe the three steps of this pattern in order, and explain what each step does.

---

### Question 2 (4 points)

Look at the following code using `createAsyncThunk` and `extraReducers` with the builder pattern:

```typescript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userAPI } from './userAPI'

const fetchUserById = createAsyncThunk(
  'users/fetchByIdStatus',
  async (userId, thunkAPI) => {
    const response = await userAPI.fetchById(userId)
    return response.data
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: { entities: [], loading: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.entities.push(action.payload)
    })
  },
})

dispatch(fetchUserById(123))
```

a) What two parameters does `createAsyncThunk` accept?

b) Why is `extraReducers` used instead of `reducers` here?

c) What does `fetchUserById.fulfilled` refer to? Name the other two lifecycle states that `createAsyncThunk` automatically generates.

d) Why is it safe to write `state.entities.push(action.payload)` even though `push` mutates the array?

---

### Question 3 (3 points)

The slides state: "Because writing data fetching logic can be tedious, RTK offers a function called `createAsyncThunk` which handles most of the heavy lifting."

Compare the following two approaches by listing one advantage of each:

**Approach A -- Manual thunk with separate action creators:**
```typescript
const getRepoDetailsStarted = () => ({
  type: 'repoDetails/fetchStarted',
})
const getRepoDetailsSuccess = (repoDetails) => ({
  type: 'repoDetails/fetchSucceeded',
  payload: repoDetails,
})
const getRepoDetailsFailed = (error) => ({
  type: 'repoDetails/fetchFailed',
  error,
})

const fetchIssuesCount = (org, repo) => async (dispatch) => {
  dispatch(getRepoDetailsStarted())
  try {
    const repoDetails = await getRepoDetails(org, repo)
    dispatch(getRepoDetailsSuccess(repoDetails))
  } catch (err) {
    dispatch(getRepoDetailsFailed(err.toString()))
  }
}
```

**Approach B -- createAsyncThunk:**
```typescript
const fetchUserById = createAsyncThunk(
  'users/fetchByIdStatus',
  async (userId, thunkAPI) => {
    const response = await userAPI.fetchById(userId)
    return response.data
  }
)
```

---

## Part 2: RTK Query (3 questions)

### Question 4 (3 points)

The slides quote the official documentation:

> "RTK Query is a powerful data fetching and caching tool. It is designed to simplify common cases for loading data in a web application, eliminating the need to hand-write data fetching & caching logic yourself."

a) Is RTK Query mandatory when using Redux Toolkit?

b) RTK Query takes inspiration from which two other libraries mentioned in the slides?

c) What does it mean that RTK Query is "UI-agnostic"?

---

### Question 5 (4 points)

Study the following RTK Query setup from the slides:

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Pokemon } from './types'

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,
    }),
  }),
})

export const { useGetPokemonByNameQuery } = pokemonApi
```

a) What is the role of `createApi` in RTK Query?

b) What does `fetchBaseQuery` do, and what is `baseUrl` used for?

c) How is the hook `useGetPokemonByNameQuery` generated? Did the developer write that hook manually?

d) Show how this hook would be used in a component, including what values it returns.

---

### Question 6 (3 points)

When integrating RTK Query into the Redux store, the slides show the following pattern:

```typescript
export const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(pokemonApi.middleware)
})
```

a) Why is `pokemonApi.reducer` added to the store using a computed property name `[pokemonApi.reducerPath]`?

b) Why must `pokemonApi.middleware` be added to the store's middleware? What features does it enable?

---

## Part 3: Immutability in Redux (3 questions)

### Question 7 (3 points)

The slides define immutability as follows: "If objects are immutable they can never be changed - so instead of changing an object, a new object should be created instead."

a) Are objects in JavaScript immutable or mutable by default?

b) Give two techniques for achieving immutability in JavaScript, as mentioned in the slides.

c) Why does the following code violate immutability principles in a Redux reducer?

```javascript
// Inside a reducer
state.value = 123
```

---

### Question 8 (3 points)

The slides state that Immer is "a library, available using NPM, that simplifies the process of writing immutable update logic."

a) What function does Immer provide, and what two parameters does it accept?

b) The slides say: "It gives you the imitation that you are mutating, but in reality immutable operations are being performed instead." Explain what this means in practice.

c) How does Redux Toolkit use Immer? Does the developer need to import Immer separately when using `createSlice`?

---

### Question 9 (3 points)

Look at the following reducer code that handles deeply nested immutable updates without Immer:

```javascript
function handwrittenReducer(state, action) {
  return {
    ...state,
    first: {
      ...state.first,
      second: {
        ...state.first.second,
        [action.someId]: {
          ...state.first.second[action.someId],
          fourth: action.someValue,
        },
      },
    },
  }
}
```

a) According to the slides, what is the "most common mistake Redux users do" related to immutability?

b) Now write the equivalent update using `createSlice` (which uses Immer automatically). How many lines does it take?

---

## Part 4: Redux Thunk and Middleware (3 questions)

### Question 10 (3 points)

The slides define a thunk in this context: "A thunk in this context is a function that can be dispatched to perform async activity and can dispatch actions and read state."

a) By default, does Redux know about asynchronous logic? What can it do by default?

b) Name three middleware options for handling async logic in Redux that are mentioned in the slides.

c) Which one does the course focus on, and why?

---

### Question 11 (3 points)

Study the following thunk example from the slides:

```javascript
function makeASandwichWithSecretSauce(forPerson) {
  // We can invert control here by returning a function - the "thunk".
  // When this function is passed to `dispatch`, the thunk middleware will intercept it,
  // and call it with `dispatch` and `getState` as arguments.
  return function (dispatch) {
    return fetchSecretSauce().then(
      sauce => dispatch(makeASandwich(forPerson, sauce)),
      error => dispatch(apologize('The Sandwich Shop', forPerson, error))
    )
  }
}
```

a) What does the thunk middleware do when a function (instead of a plain action object) is passed to `dispatch`?

b) What two arguments does the middleware pass to the thunk function?

c) According to the slides, where must thunks be declared relative to slices, and why?

---

### Question 12 (4 points)

The slides show the following `configureStore` setup:

```typescript
import { configureStore } from '@reduxjs/toolkit'
import todosReducer from '../reducers/todosReducer'

// Automatically adds the thunk middleware and the Redux DevTools extension
const store = configureStore({
  // Automatically calls `combineReducers`
  reducer: {
    todos: todosReducer
  },
})
```

a) According to the slide comments, what two things does `configureStore` automatically add?

b) What does `configureStore` automatically call when you pass an object to the `reducer` field?

c) If you are using Redux without Redux Toolkit, how would you add the thunk middleware manually? (Name the function mentioned in the slides.)

---

## Part 5: Context API Issues (3 questions)

### Question 13 (3 points)

The slides describe the biggest issue with Context API:

"The biggest issue with Context API is that every consumer re-renders when the context changes - **even if they don't use the data**."

a) What happens when you try to fix this re-render problem by splitting contexts?

b) What term do the slides use to describe the result of many nested Providers?

c) Show the code example from the slides that illustrates this problem.

---

### Question 14 (3 points)

The slides list four debugging limitations of the Context API. List all four.

---

### Question 15 (3 points)

The slides describe when Context API is a good choice. List the three categories of good use-cases, including the specific examples given for the first category.

---

## Part 6: Context API vs Redux vs Zustand Comparison (3 questions)

### Question 16 (4 points)

Fill in the following comparison table from the slides with the exact values:

|               | Context API | Redux (RTK) | Zustand    |
|---------------|-------------|-------------|------------|
| Bundle size   | ?           | ?           | ?          |
| Learning curve| ?           | ?           | ?          |
| Performance   | ?           | ?           | ?          |
| Best for      | ?           | ?           | ?          |

---

### Question 17 (4 points)

The slides present a decision flowchart for choosing a state management solution. Complete the following decision tree with the correct answers:

1. Is your app small with minimal shared state?
   - Yes --> ?
   - No --> Continue

2. Does your state change frequently? (e.g. cart, real-time data, UI state)
   - Yes --> ?
   - No --> ?

3. Is your team large (5+ devs) or is strict structure/conventions important?
   - Yes --> ?
   - No --> Continue

4. Do you need advanced debugging? (action logs, time-travel)
   - Yes --> ?
   - No --> Continue

5. Do you have complex async flows or business logic?
   - Yes --> ?
   - No --> ?

---

### Question 18 (3 points)

Compare the debugging capabilities of Redux versus Zustand based on the slides.

For **Redux**, list the four debugging capabilities mentioned.

For **Zustand**, list the four debugging characteristics mentioned and explain why the slides consider Zustand's debugging "less powerful than Redux."

---

# Answer Key

---

## Question 1

The three steps of the recommended data fetching pattern:

1. **A "start" action is dispatched** before the request to indicate that the request is in progress. This may be used to track loading state, to allow skipping duplicate requests, or show loading indicators in the UI.
2. **The async request is made** (the actual fetch/API call).
3. **Depending on the result**, the async logic dispatches either a "success" action containing the result data, or a "failure" action containing error details. The reducer logic clears the loading state in both cases, and either processes the result data from the success case, or stores the error value for potential display.

---

## Question 2

a) `createAsyncThunk` accepts two parameters: a **single string for the action type** (e.g. `'users/fetchByIdStatus'`) and a **payload creator function** (an async callback that performs the actual logic and returns the data).

b) `extraReducers` is used because `createAsyncThunk` generates its own action types (pending, fulfilled, rejected) that are **external to the slice**. Regular `reducers` only handle actions defined within the slice itself. `extraReducers` allows the slice to respond to actions defined outside of it.

c) `fetchUserById.fulfilled` refers to the action type dispatched when the async thunk **resolves successfully**. The other two lifecycle states are:
- `fetchUserById.pending` (dispatched when the thunk starts)
- `fetchUserById.rejected` (dispatched when the thunk throws an error)

d) It is safe because the function passed to `createSlice` (and `createReducer`) **uses Immer automatically**. Immer tracks the "mutations" and performs safe, immutable operations under the hood. The `state.push()` is actually creating a new array immutably behind the scenes.

---

## Question 3

**Approach A (manual thunk) advantage:** You have full, explicit control over every action that is dispatched. Each action creator is clearly defined with its own type, making the flow very transparent.

**Approach B (createAsyncThunk) advantage:** It dramatically reduces boilerplate. Instead of having to dispatch multiple actions manually and define separate action creators for started/success/failed, you only need to provide a single string for the action type and a payload creator function. `createAsyncThunk` handles most of the heavy lifting -- automatically generating pending/fulfilled/rejected action types.

---

## Question 4

a) No. The slides explicitly state: "RTK Query is an addition to the Redux Toolkit, and not mandatory to use when using RTK."

b) RTK Query takes inspiration from **React Query** and **SWR**.

c) RTK Query is UI-agnostic meaning that it will work for **all JS solutions which have compatibility to use RTK**, e.g. React for web and React Native for apps. It is not tied to a specific UI framework.

---

## Question 5

a) `createApi` is used to **define a service using a base URL and expected endpoints**. It is the core function of RTK Query that sets up the API configuration including the base query, reducer path, and all the endpoint definitions.

b) `fetchBaseQuery` is a lightweight fetch wrapper that handles making HTTP requests. The `baseUrl` parameter sets the root URL that all endpoint queries will be relative to (in this case `'https://pokeapi.co/api/v2/'`).

c) The hook `useGetPokemonByNameQuery` is **auto-generated based on the defined endpoints**. The developer did NOT write it manually. RTK Query automatically creates hooks following the pattern `use[EndpointName]Query` for each endpoint defined in `createApi`. The developer simply exports it from the API object:
```typescript
export const { useGetPokemonByNameQuery } = pokemonApi
```

d) Usage in a component (from the slides):
```typescript
import { useGetPokemonByNameQuery } from './services/pokemon'

export default function Pokemon() {
  // Using a query hook automatically fetches data and returns query values
  const { data, error, isLoading } = useGetPokemonByNameQuery('bulbasaur')

  // rendering logic
}
```
The hook returns `data`, `error`, and `isLoading`.

---

## Question 6

a) The computed property name `[pokemonApi.reducerPath]` is used so the reducer is added at the key matching the `reducerPath` string defined in `createApi` (in this case `'pokemonApi'`). This ensures the reducer is **added as a specific top-level slice** in the store with the correct name.

b) Adding `pokemonApi.middleware` to the store **enables caching, invalidation, polling, and other useful features of RTK Query**. Without the middleware, RTK Query would not be able to manage its cache lifecycle or automatically handle data refetching.

---

## Question 7

a) Objects in JavaScript are **mutable by default**, meaning that fields can be changed in an object and entries can be changed in an array.

b) Two techniques mentioned in the slides:
1. Usage of **spread operators** (`...state`)
2. **Returning a new instance** of an object/array

c) `state.value = 123` directly mutates the existing state object. The slide explicitly marks this as "Illegal - by default, this will mutate the state!" The safe approach is to return a new object:
```javascript
return {
  ...state,
  value: 123,
}
```

---

## Question 8

a) Immer provides a function called **`produce`**, which accepts two parameters: **your original state** and **a callback function**.

b) Within the callback function you can write code that looks like it mutates the state (e.g. `state.push(...)`, `state.value = ...`), but Immer **tracks the changes and performs the operations using safe, immutable operations instead**. The developer writes mutation-style syntax, but behind the scenes new immutable copies are being created.

c) The function passed to `createReducer` or when working with a slice (via `createSlice`) **uses Immer automatically**. The developer does NOT need to import Immer separately. Within the reducer function, state can be "mutated" directly and Immer handles the immutability. For example:
```typescript
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    todoAdded(state, action) {
      state.push(action.payload)  // Safe! Immer handles this
    },
  },
})
```

---

## Question 9

a) According to the slides: "The most common mistake Redux users do is accidentally mutating the Redux state - simply because it quickly becomes too complex." As nested objects and other more complex structures come into play, manually maintaining immutability becomes unmaintainable.

b) Using `createSlice` with Immer, the equivalent is just:
```typescript
const mySlice = createSlice({
  name: 'mySlice',
  initialState: { first: { second: {} } },
  reducers: {
    updateFourth(state, action) {
      state.first.second[action.payload.someId].fourth = action.payload.someValue
    },
  },
})
```
It takes essentially **one line** of update logic (`state.first.second[action.payload.someId].fourth = action.payload.someValue`) compared to the 15-line deeply nested spread pattern.

---

## Question 10

a) No. "By default Redux knows nothing about asynchronous logic - it only knows how to synchronously dispatch actions, and update the state by calling the root reducer function."

b) Three middleware options mentioned:
1. **redux-thunk**
2. **redux-saga**
3. **redux-observable**

c) The course focuses on **redux-thunk** because "that is the most common option."

---

## Question 11

a) When a function (instead of a plain action object) is passed to `dispatch`, the thunk middleware **intercepts it** and calls it with `dispatch` and `getState` as arguments. This gives the thunk function the ability to run some logic and still interact with the store.

b) The middleware passes **`dispatch`** and **`getState`** as arguments to the thunk function.

c) According to the slides: "Thunks are not a part of the regular slice function and therefore must be declared **outside of the slice**." Therefore it is not possible to "slice the thunk" -- thunks live separately from the slice definition.

---

## Question 12

a) `configureStore` automatically adds:
1. **The thunk middleware** (Redux Thunk)
2. **The Redux DevTools extension**

b) `configureStore` automatically calls **`combineReducers`** when you pass an object to the `reducer` field.

c) If using Redux without Redux Toolkit, you would add the thunk middleware manually using the **`applyMiddleware`** function.

---

## Question 13

a) Splitting contexts to fix re-renders **leads to deeply nested providers**.

b) The slides use the term **"Context Hell"**.

c) The code example from the slides:
```jsx
<AuthContext.Provider>
  <ThemeContext.Provider>
    <CartContext.Provider>
      <App />
```
This nesting becomes expensive as the app grows and the component tree becomes larger.

---

## Question 14

The four debugging limitations of Context API:

1. **State changes have no structure** therefore no enforced pattern for how updates happen
2. **No action logs** so nothing tells you what triggered a state change
3. **No time-travel debugging** and you can't step backwards through state history
4. **You're limited to basic React DevTools**

---

## Question 15

The three categories of good use-cases for Context API:

1. **State that infrequently changes:**
   - Authentication information
   - Theme (dark/light)
   - Locale/language selection

2. **Small to medium size apps** where limitations don't have any effect

3. **When there are restrictions of external dependencies or bundle size** (Context API has 0KB bundle size since it's built into React)

---

## Question 16

|               | Context API                     | Redux (RTK)                            | Zustand                            |
|---------------|---------------------------------|----------------------------------------|------------------------------------|
| Bundle size   | 0KB                             | ~14KB                                  | ~1-3KB                             |
| Learning curve| Low                             | Medium-High                            | Very low                           |
| Performance   | Poor for frequent updates       | Good with selectors                    | Excellent                          |
| Best for      | Auth, theme, locale             | Large teams & enterprise apps          | Most apps -- pragmatic default     |

---

## Question 17

1. Is your app small with minimal shared state?
   - Yes --> **Context API**

2. Does your state change frequently?
   - Yes --> **Context API is out of race due to re-render issues. Continue to next question**
   - No --> **Context API**

3. Is your team large (5+ devs) or is strict structure/conventions important?
   - Yes --> **Redux** with enforced patterns, powerful DevTools and scales across large teams

4. Do you need advanced debugging? (action logs, time-travel)
   - Yes --> **Redux**

5. Do you have complex async flows or business logic?
   - Yes --> **Redux using createAsyncThunk and middlewares**
   - No --> **Zustand**

---

## Question 18

**Redux debugging capabilities (4 points):**
1. Best-in-class Redux DevTools
2. Full action log with type and payload
3. State diff on every change
4. Time-travel -- step forwards and backwards through state history

**Zustand debugging characteristics (4 points):**
1. Integrates with Redux DevTools
2. Action log is less descriptive than Redux (no enforced action types)
3. No time-travel debugging
4. React DevTools shows component-level state

Zustand's debugging is considered "less powerful than Redux" because it lacks enforced action types (making action logs less descriptive), has no time-travel debugging capability, and only provides component-level state visibility through React DevTools rather than the full action/state history that Redux DevTools provides.
