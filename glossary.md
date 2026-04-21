# Web Programming II - Comprehensive Glossary

---

## A. CSS & LAYOUT

### Flexbox
| Term | Definition (from slides) |
|------|-----------|
| **Flexbox** | Makes the once-difficult task of laying out your page, widget, application, or gallery almost simple. Provides functionality for equal height columns which is easy to implement |
| **display: flex** | In order to create a flex container you must apply the display CSS property with the value flex. When the flex display is applied, this container is a flex container. **Important:** it will only flex its **immediate children**, and not further descendants ("hefur bara ahrif a bornin einu lageri fyrir nedan"). These descendants can be made as flex containers as well though providing a more complex layout |
| **flex container** | When an element is a flex container it will only flex its immediate children, and not further descendants. These descendants can be made as flex containers as well though providing a more complex layout |
| **flex items** | The children (flex items) which reside within the container. float and clear properties don't have an effect on flex items. vertical-align does not have an effect on flex items. absolute positioning of flex items takes the elements out of the flow |
| **Axis grid system** | Flexbox works on an axis grid system. You add CSS property values to the flex container which indicate how the children (flex items) should be laid out. Flex items can be rearranged, laid from left to right (vice versa), top to bottom (vice versa), wrapped etc. |
| **main-axis** | Flex items are laid along the main-axis |
| **cross-axis** | Flex lines are added in the direction of the cross-axis. When using wrap the lines are laid in the same direction as the cross-axis meaning that when have a row direction the cross-axis points down |
| **flex-direction** | Values: `row` (default), `row-reverse`, `column`, `column-reverse` |
| **flex-wrap** | If flex-items do not fit within the flex container we sometimes need to control that behaviour. flex-wrap offers a way to do that. It is applied as an CSS property on the flex container itself. By default flex containers don't wrap. Values: `nowrap` (default), `wrap`, `wrap-reverse`. When using flex-wrap the height of the line is determined by the tallest and widest element within that line |
| **flex-flow** | flex-flow combines both flex-direction and flex-wrap in a shorthand syntax. Example: `flex-flow: row wrap` |
| **justify-content** | It gives us control on how flex items in a flex line are distributed along the main-axis. Values: `flex-start` (default), `center`, `space-around`, `space-between`, `flex-end` |
| **align-items** | The align-items CSS property defines how flex items are aligned along it's flex line's cross-axis. Values: `flex-start`, `center`, `baseline`, `stretch` (default), `flex-end` |
| **align-content** | align-content aligns a flex container's lines within a flex container that has extra space in the cross-axis direction. Wirkar bara pegar vid erum ad nota wrap (only works when wrapping). Values: `flex-start`, `center`, `space-around`, `space-between`, `stretch` (default), `flex-end` |
| **flex-grow** | The flex-grow property defines whether a flex item is allowed to grow when there is available space. It also determines how much it will grow proportionally relative to growth of other flex item siblings. It accepts a number (not negative). Default: `0` |
| **Growth factor** | With three flex items (100px width): the first two have flex-grow: 1 and the last flex-grow: 3. We have a total of 5 growth factors. If the remaining space is 450px: 450px / 5 = 90px. First two items are 100px + 90px * 1 = 190px. Last item is 100px + 90px * 3 = 370px |
| **flex-shrink** | The shrink factor determines how much a flex item will shrink relative to the rest of the flex item siblings. This applies when there isn't enough space for all of them to fit. So it defines how the negative space is distributed. Default: `1` |
| **Shrink factor** | When all flex items (300px) are within a container (750px) there are 150px which overflow. Two items have flex-shrink: 1, last has flex-shrink: 3. Therefore 150px / 5 = 30px. Two items are 300px - 1 * 30px = 270px. Last is 300px - 3 * 30px = 210px |
| **flex-basis** | flex-basis determines how the flex growth and shrink factors are implemented. It determines how much it can grow to fill available space or how much it should shrink to fit all flex items when there isn't enough space. flex-basis defines the initial or default size of flex items, before extra or negative space is distributed. flex-basis accepts the same values as width. When both flex-basis and width are set, the basis trumps the width. Default: `auto`. Values: `auto`, `content`, `100%`, `100px`, `0` |
| **flex** | flex CSS property is a shorthand syntax for flex-grow, flex-shrink and flex-basis. Example: `flex: 1 0 100%` (grow shrink basis) |
| **align-self** | It is used to override the align-items property value on a per-flex-item basis. This can be useful if you want to change for example only the last element in the row but maintain the same structure for the other ones. Default: `auto`. Values: `auto`, `flex-start`, `flex-end`, `center`, `baseline`, `stretch` |
| **order** | Flex items are, by default, displayed and laid out in the same order as they appear in the source code. They can be reversed using row-reverse or column-reverse but order can be used to change the order of individual flex items. The order property accepts an integer as value. For non flex items the order property is ignored. All flex items default to order with a value of 0 |

### CSS Grid
| Term | Definition (from slides) |
|------|-----------|
| **CSS Grid Layout** | Enable us to create more complex layouts and gives us full control. On the basic level grid layout is quite similar to flexbox |
| **display: grid** | For regular grids we use the keyword grid which is a value for the display CSS property. There are two types of grids: regular and inline. For inline grids we use the keyword inline-grid |
| **grid container** | Items within a grid container become grid items similar to flex items in flex containers. It only works on the descending children and not the ones nested within them |
| **Things to consider** | All column properties are ignored when applied to grid containers. ::first-line and ::first-letter are ignored when applied to grid containers. float and clear are ignored when applied to grid items. vertical-align has no effect on grid items, even though vertical-align can be applied to content within the grid items |
| **Grid track** | Continuous run between two adjacent grid lines - in other words, a grid column or a grid row. The size of the grid track is dependent on the placement of the grid lines that define it |
| **Grid cell** | A grid cell is any space bounded by four grid lines, with no grid lines running through it, analogous to a table cell. This is the smallest unit within a grid layout |
| **Grid area** | A grid area is any rectangular area bounded by four grid lines, and made up of one or more grid cells. Grid areas are directly addressable by CSS grid properties. Grid areas can be associated with a unique identifier which allows us to reference it later on |
| **Grid line** | The dividing lines that make up the structure of the grid (horizontal and vertical) |
| **grid-template-columns** | In order to define how we want to arrange our grid items along the horizontal grid track we can use a CSS property called grid-template-columns. Can accept a lot of values and keywords. Values: `auto`, px, %, fr. Lines can be named: `[start col-a] 200px [col-b] 50% [col-c] 100px [stop end last]` |
| **grid-template-rows** | Similar to grid-template-columns there is a CSS property which applies to grid containers called grid-template-rows. grid-template-rows accepts the same values as the one that applies to the horizontal track |
| **fr unit** | The fr unit can be used and it stands for fraction. All fr are added up and then divided by the total. E.g. 3 columns with 1fr, 2fr, 1fr: total = 4 fractions, each fraction = 0.25, so 1fr = 25% and 2fr = 50% of the total container |
| **minmax()** | Sets a minimum and maximum size for a track. Example: `minmax(2em, 100%)` |
| **min-content / max-content** | Sometimes we don't know the size of our grid items and therefore fixed sizes can be troublesome. max-content takes up the maximum amount of space needed for this content. min-content takes up the minimum amount of space needed for this content |
| **repeat()** | When you want to repeat a pattern independent on how many grid items are within the container you can use repeat(). repeat() accepts as first argument how many items should be repeated and as the second argument the size of these elements. repeat() can be applied to both rows and columns. Can be used within a track declaration: `grid-template-columns: 40px repeat(1, 1fr) 40px`. Can repeat patterns: `repeat(1, 0.5fr 1fr 1fr)` (from slides) |
| **grid-template-areas** | Defines named layout regions. Use 1 or more dots (`.` or `...`) for empty cells — this is called the null cell token (from slides: "Unlabeled cells can use 1 or more dots"). **All areas MUST be rectangular** — non-rectangular shapes will break the layout. Example: `"header header" "sidebar main" "footer footer"` |
| **grid-area** | Place an item by name: `grid-area: header`. Or shorthand with 4 values: `grid-area: row-start / col-start / row-end / col-end` |
| **grid-column / grid-row** | Place items: `grid-column: 1 / 3` (spans columns 1-2). `grid-row: 1 / span 2` (spans 2 rows). Use `span` keyword for spanning |
| **grid-auto-flow** | Controls direction for auto-placed items. Values: `row` (default), `column`, `dense` (can be combined: `row dense`, `column dense`). Dense fills in holes in the grid (from slides: "row-first and column-first which both can be enhanced with a dense flow") |
| **grid-gap** | Sets spacing between grid items. The slides use `grid-gap` (shorthand), `grid-row-gap`, and `grid-column-gap`. Note: modern CSS uses `gap` but the slides use the prefixed `grid-` versions |

### Grid vs Flexbox (from slides)
| Grid | Flexbox |
|------|---------|
| CSS Grid Layout enable us to create **more complex layouts** and gives us full control | Flexbox makes the once-difficult task of laying out your page, widget, application, or gallery almost simple |
| On the basic level grid layout is quite similar to flexbox | Before flexbox developers depended heavily on floats and width/height in % |
| Items within a **grid container** become **grid items** similar to **flex items** in **flex containers** | When an element is a **flex container** it will only flex its **immediate children** |
| It only works on the descending children and not the ones nested within them | Flexbox provides functionality for **equal height columns** which is easy to implement (default behaviour) |

### BEM (Block Element Modifier)
| Term | Definition |
|------|-----------|
| **Block** | The standalone component. Example: `.card` |
| **Element** | A part of the block. Separated by double underscore `__`. Example: `.card__title` |
| **Modifier** | A variation of a block or element. Separated by double dash `--`. Example: `.card__title--active` |
| **Correct format** | `.block__element--modifier` (e.g., `.card__title--active`) |

### CSS Custom Properties (Variables)
| Term | Definition |
|------|-----------|
| **Declaration** | `--variable-name: value;` (defined on a selector, often `:root`) |
| **Usage** | `var(--variable-name)` |
| **Scoping** | Can be overridden within specific selectors (cascade down) |
| **Dynamic** | Can be updated with JavaScript at runtime using `element.style.setProperty()` |
| **Benefits** | Centralize repeated values, improve maintainability. Do NOT fully replace preprocessors (no mixins, nesting, etc.) |

### Background Properties
| Term | Definition |
|------|-----------|
| **background-size** | `cover` (fills container, may crop), `contain` (fits inside, may leave space), or specific values like `200px 200px` |
| **background-position** | Where the background is placed. Values like `center center`, `200px bottom`, etc. |
| **background-repeat** | `repeat` (default), `no-repeat`, `repeat-x`, `repeat-y` |
| **Multiple backgrounds** | Comma-separated values. First image is on top, last is on bottom |

### CSS3: Gradients
| Term | Definition |
|------|-----------|
| **linear-gradient()** | Applied to `background-image`. Creates gradient along a line. Default direction: **top to bottom** |
| **Direction** | First arg: point or angle which determines the direction of the gradient (from slides). `to right`, `to right bottom` or angle. 0deg=bottom-to-top, 90deg=left-to-right, 180deg=top-to-bottom, **-90deg=right-to-left** (shown in slides) |
| **Stacking gradients** | Comma-separated on same `background-image`. First is on top. Use rgba with alpha for transparency |
| **radial-gradient()** | Radiates from center outward. Default: inner to outer. Shape: `circle` or `ellipse` |
| **Radial position** | `radial-gradient(circle at 75% 75%, ...)` sets the center |
| **repeating-linear-gradient** | Repeats gradient pattern using px color stops |
| **repeating-radial-gradient** | Same for radial gradients |

### CSS3: Shadows (box-shadow)
| Term | Definition |
|------|-----------|
| **box-shadow** | `box-shadow: offset-x offset-y blur-radius spread-radius color` |
| **offset-x / offset-y** | Horizontal/vertical shadow position |
| **blur-radius** | How blurry the shadow is. 0 = sharp |
| **spread-radius** | How much the shadow expands beyond the element |
| **inset** | Keyword to place shadow INSIDE the element |
| **Multiple shadows** | Comma-separated. Can replicate elements: `box-shadow: 20px 0, 40px 0` |

### CSS3: Transitions vs Animations
| Term | Definition (from slides) |
|------|-----------|
| **Key difference** | Transitions only take effect when the property they are applied to changes value. Animations can be executed independently - they change the state of properties themselves |
| **transition shorthand** | `transition: property duration timing-function delay`. Example from slides: `transition: background-color 1s ease-in 0s` |
| **transition-property** | Which CSS property to animate (e.g., `background-color`, `width`, `all`) |
| **transition-duration** | How long the transition takes (e.g., `1s`, `200ms`) |
| **transition-timing-function** | Speed curve: `ease`, `ease-in`, `ease-out`, `ease-in-out`, `linear` |
| **transition-delay** | Wait time before transition starts |
| **Multiple transitions** | Comma-separated: `transition: background-color 1s, width 2s, height 3s` |
| **@keyframes** | Define animation steps: `@keyframes name { from { } to { } }` or using percentages: `0% { } 50% { } 100% { }` |
| **animation shorthand** | `animation: name duration timing-function delay iteration-count direction` |
| **animation-iteration-count** | `infinite` or a number. How many times the animation plays |

### CSS3: Transforms
| Term | Definition (from slides) |
|------|-----------|
| **transform** | CSS property to apply 2D or 3D transformations to elements |
| **rotate()** | `rotate(45deg)` — same as `rotateZ(45deg)`. Also: `rotateX()` (tilts forward/back, needs perspective), `rotateY()` (tilts left/right, needs perspective), `rotate3d(x, y, z, angle)` — rotate around a custom axis vector |
| **scale()** | `scale(2)` doubles size. Also: `scaleX()`, `scaleY()`, `scaleZ()`, `scale3d(1.5, 2, 2)` |
| **skew()** | `skew(30deg, 30deg)` — slants element. Also: `skewX()`, `skewY()` |
| **translate()** | `translate(10px)` = `translateX(10px)`. `translate(10px, 10px)` = both X and Y. translate does NOT affect surrounding elements (unlike position changes). `translateZ()` moves toward/away from viewer (needs perspective). `translate3d(x, y, z)` |
| **transform-origin** | Sets the point around which transforms occur. Default: `50% 50%` (center). Example: `transform-origin: 50px 70px` |
| **Multiple transforms** | **Space-separated** (NOT comma!): `transform: rotate(180deg) translateY(20px)`. **Order matters!** — rotate(180deg) then translateY(20px) moves UP because Y-axis is flipped after rotation |

### CSS3: Perspective
| Term | Definition (from slides) |
|------|-----------|
| **perspective (CSS property)** | CSS property applied on the **parent/container**. Creates a shared 3D space for all children. All children share one vanishing point — creates realistic effect (e.g. cards fanning out). Example: `.wrapper { perspective: 1000px; }` |
| **perspective (transform value)** | Used inside `transform` on the **element itself**: `transform: perspective(500px) rotateX(50deg)`. Each element gets its own vanishing point — all elements look identical |
| **Key difference** | Property on parent = shared vanishing point for ALL children (realistic). Transform value on element = EACH element has its own vanishing point (uniform) |
| **perspective-origin** | Sets the viewpoint position. Default: `50% 50%` (center). Takes x-position (left/right/center/%) and y-position (top/bottom/center/%) |
| **Depth value** | Lower value = more dramatic 3D effect. Higher value = subtler. Defaults to 0 |

### CSS3: Rounded Corners
| Term | Definition |
|------|-----------|
| **border-radius** | Creates rounded corners. Accepts px, em, % |
| **4 values** | `border-radius: TL TR BR BL` (top-left, top-right, bottom-right, bottom-left) |
| **Circle** | `border-radius: 50%` on a square = circle |
| **Elliptical** | `border-radius: 20px / 100%` — before `/` = horizontal radius, after = vertical radius |

### CSS3: Box Sizing
| Term | Definition |
|------|-----------|
| **box-sizing** | How browser calculates total width/height |
| **content-box** (default) | Width/height = content only. Padding + border ADDED on top on **both sides**. 100px width + 10px padding * 2 sides + 10px border * 2 sides = **140px total** (from slides DevTools screenshot) |
| **border-box** | Padding + border INCLUDED in width/height. Element is always exactly stated size. **100px total** |

### CSS3: Attribute Selectors (from slides)
| Selector | Meaning (from slides) |
|----------|---------|
| **`a[href]`** | Selects elements that HAVE the attribute (any value) |
| **`a[href="mailto:arnarl@ru.is"]`** | Attribute exactly equals the value |
| **`a[title~="title"]`** | Attribute contains word as space-separated value ("innihaldi space separated") |
| **`a[href^="http"]`** | Attribute begins with value ("begins with") |
| **`a[href$="pdf"]`** | Attribute ends with value ("ends with") |
| **`a[href*="facebook"]`** | Wildcard selector — attribute contains substring anywhere ("kemur einhver stadar fyrir") |

### CSS3: Structural Pseudo-classes (from slides)
| Selector | Meaning (from slides) |
|----------|---------|
| **`:nth-child(2n+1)`** | Selects odd children. Same as `:nth-child(odd)`. Counts ALL children regardless of type ("oll born i oddatolu") |
| **`:nth-child(even)`** | Selects even children |
| **`:nth-child(3)`** | Selects the 3rd child specifically |
| **`:nth-of-type(2n+1)`** | Like nth-child but only counts elements of the same type ("skodar utfra sertinni a akvedi typu") |
| **`:nth-of-type(even)`** | Even elements of that specific type |
| **`:first-child`** | First child of its parent. `p:first-child` will NOT match if first child is a `<div>` — "droppar bvi first-child er her div" |
| **`:last-child`** | Last child of its parent |
| **`:first-of-type`** | First element of its type among siblings. WILL find the first `<p>` even if a `<div>` comes before it |
| **`:last-of-type`** | Last element of its type among siblings |
| **`:empty`** | Elements with no children |
| **`:not(selector)`** | Negation — it is a functional notation taking a simple selector as an argument. It represents an element that is not represented by its argument. Can be useful to exclude styles on specific DOM elements. Example: `p:not(:first-child)` |
| **Practical use** | `table > tbody > tr:nth-child(even)` — zebra-striped table rows |

### CSS3: Pseudo-elements (from slides)
| Selector | Meaning (from slides) |
|----------|---------|
| **Pseudo-elements** | Pseudo-elements provide authors a way to refer to content that does not exist in the source document |
| **`::first-line`** | Styles the first line of a block element. Example: `p::first-line { font-variant: small-caps; }` |
| **`::first-letter`** | Styles the first letter of a block element (drop caps effect). Example: `p::first-letter { font-size: 6em; font-weight: bold; }` |
| **`::before`** | Inserts generated content BEFORE the element's content. The `content` property is mandatory ("baeta vid contenti sem er ekki til"). Example: `div::before { content: 'Before '; }` |
| **`::after`** | Inserts generated content AFTER the element's content. The `content` property is mandatory. Example: `div::after { content: ' After'; }` |
| **`attr()` function** | Used in content property to insert attribute values as text: `content: " (" attr(href) ") "` — adds the href URL after links that start with "http" |
| **A single div** | Using `::after` and `::before` to the max you can create complex visuals with only a single `<div>` element (e.g. smiley face with box-shadow) |

---

## B. JAVASCRIPT & TYPESCRIPT

### The `this` Keyword
| Context | What `this` refers to |
|---------|----------------------|
| **Regular function call** (no `new`) | `window` (global object) in non-strict mode |
| **`new` keyword** (constructor) | The newly created object instance |
| **Method call** (`obj.method()`) | The object before the dot |
| **`.bind(obj)`** | Permanently sets `this` to `obj`, returns new function |
| **`.call(obj, args...)`** | Calls function with `this` set to `obj`, passing args individually |
| **`.apply(obj, [args])`** | Same as `.call()` but args passed as array |
| **`setTimeout(fn, ms)`** | `window` (the callback loses its context) |
| **Arrow function** | Inherits `this` from the enclosing lexical scope (no own `this`) |

### Prototypes & Inheritance
| Term | Definition |
|------|-----------|
| **prototype** | An object that other objects inherit properties from. Every function has a `.prototype` property |
| **Object.create(proto)** | Creates a new object with `proto` as its prototype |
| **Constructor function** | A regular function used with `new` to create objects. Sets `this` to the new instance |
| **Prototype chain** | When accessing a property, JS looks up the prototype chain until it finds it or reaches `null` |
| **Game.call(this, name)** | Calls the parent constructor with the child's `this` context (inheritance pattern) |

### Promises & Async
| Term | Definition |
|------|-----------|
| **Promise** | An object representing the eventual completion or failure of an async operation |
| **Promise.all()** | Resolves when **ALL** promises resolve. Rejects if **ANY** one rejects |
| **Promise.race()** | Resolves/rejects as soon as the **FIRST** promise settles (resolves or rejects) |
| **Promise.any()** | Resolves when the **FIRST** promise **resolves**. Only rejects if ALL reject |
| **Promise.allSettled()** | Waits for ALL promises to settle (resolve or reject). Never short-circuits |
| **async/await** | Syntactic sugar built on top of Promises. Makes async code look synchronous |
| **await** | Pauses execution until the Promise resolves. Can only be used inside `async` functions |
| **.then()/.catch()** | Chain handlers for resolved/rejected promises |
| **Unhandled rejection** | When a Promise rejects with no `.catch()` handler - causes runtime warning/error |

### Event Loop
| Term | Definition |
|------|-----------|
| **Call Stack** | Where synchronous code executes (LIFO) |
| **Web APIs** | Browser-provided APIs that handle async operations (setTimeout, fetch, DOM events) |
| **Callback Queue (Macrotask)** | Queue for callbacks from setTimeout, setInterval, I/O. Processed one at a time |
| **Microtask Queue** | Queue for Promise callbacks (.then, .catch, .finally). **Processed BEFORE macrotasks** |
| **Event Loop** | Continuously checks: if call stack is empty, process all microtasks, then one macrotask |
| **Key rule** | Microtasks (Promises) always run before macrotasks (setTimeout) |

### fetch API
| Term | Definition |
|------|-----------|
| **fetch()** | Browser API for making HTTP requests. Returns a Promise |
| **response.json()** | Parses response body as JSON. Returns a **Promise** (must be awaited!) |
| **response.ok** | Boolean - true if status is 200-299 |
| **Common bug** | Forgetting to `await response.json()` - returns a Promise object instead of data |

### TypeScript
| Term | Definition |
|------|-----------|
| **interface** | Defines a contract/shape that objects must follow. Keyword: `interface` |
| **type** | Similar to interface but can also define unions, intersections, primitives |
| **Union type** | A type that can be one of several types. Written with pipe: `string \| number` |
| **Partial\<T\>** | Utility type that makes ALL properties of T optional |
| **Required\<T\>** | Utility type that makes ALL properties of T required |
| **Pick\<T, K\>** | Utility type that creates a type with only specified keys from T |
| **Omit\<T, K\>** | Utility type that creates a type excluding specified keys |
| **Type assertion** | Tells TypeScript to treat a value as a specific type. Syntax: `value as Type` |
| **Nullable type** | A type that can be a value or `null`. Example: `string \| null` |
| **Generic** | Parameterized types. Example: `function identity<T>(arg: T): T` |
| **abstract class** | A class that cannot be instantiated directly, only extended |
| **instanceof** | Type narrowing operator. Checks if an object is an instance of a class |
| **enum** | A set of named constants |

---

## C. REACT

### Core Concepts
| Term | Definition |
|------|-----------|
| **Component** | A reusable, self-contained piece of UI. Can be a function that returns JSX |
| **Component principles** | Single Responsibility, Reusable, Composable, Declarative |
| **Component benefits** | Code reuse, easier testing, separation of concerns, easier maintenance |
| **JSX** | Syntax extension that looks like HTML but compiles to JavaScript function calls |
| **Props** | Read-only data passed from parent to child. Flows one-way (top-down) |
| **State** | Mutable data managed within a component. When changed, triggers re-render |
| **Virtual DOM** | React's in-memory representation of the real DOM. Used for efficient diffing |
| **Re-render** | When state or props change, React re-executes the component function |
| **Key prop** | Unique identifier for list items. Helps React track which items changed |

### React Hooks
| Hook | Purpose |
|------|---------|
| **useState** | Declares state variables. Returns `[value, setter]`. Setter schedules a **re-render** |
| **useEffect** | Runs side effects after render. Takes a callback and dependency array |
| **useEffect deps: `[]`** | Empty array = runs only once on mount |
| **useEffect deps: `[x]`** | Runs on mount AND whenever `x` changes |
| **useEffect deps: none** | No array = runs after every render |
| **useRef** | Creates a mutable reference that persists across renders. **Does NOT cause re-renders** when changed |
| **useRef use cases** | DOM element references, storing timer IDs, tracking previous values - NOT for triggering renders |
| **useCallback** | Memoizes a **function reference** so it's not recreated on every render |
| **useMemo** | Memoizes a **computed value** to avoid expensive recalculations |
| **useReducer** | Alternative to useState for complex state logic. Uses reducer pattern (state, action) => newState |
| **useContext** | Reads a value from a React Context. Subscribes to context changes |

### Patterns
| Pattern | Definition |
|---------|-----------|
| **Prop drilling** | Passing props through many intermediate components that don't need them. An anti-pattern |
| **Lifting state up** | Moving shared state to the closest common parent of the components that need it |
| **Context API** | React's built-in solution for sharing state across many components without prop drilling |
| **createContext** | Creates a Context object |
| **Provider** | Component that wraps a subtree and provides context values to descendants |
| **Controlled component** | Form element whose value is controlled by React state |
| **Uncontrolled component** | Form element that manages its own state via the DOM (uses refs) |

---

## D. STATE MANAGEMENT

### Context API
| Aspect | Detail |
|--------|--------|
| **Pros** | Built into React, no extra dependencies, simple for low-frequency updates |
| **Cons** | Not optimized for high-frequency updates (re-renders entire subtree), no devtools |
| **Best for** | Theme, auth, locale - data that changes infrequently |

### Redux / Redux Toolkit (RTK)
| Term | Definition |
|------|-----------|
| **Store** | Single source of truth - holds the entire application state |
| **Action** | A plain object describing what happened. Has a `type` and optional `payload` |
| **Reducer** | A pure function: `(state, action) => newState`. Determines how state changes |
| **Dispatch** | The method used to send actions to the store. `dispatch(action)` |
| **Connected component** | A component that is connected to the Redux store, can read state and dispatch actions. Uses `useSelector`/`useDispatch` or legacy `connect()` |
| **Slice (RTK)** | A collection of reducer logic and actions for a single feature. Created with `createSlice()` |
| **configureStore** | RTK function that sets up the store with good defaults |
| **Flux pattern** | Unidirectional data flow: Action → Dispatch → Reducer → Store → View |
| **Pros** | Powerful devtools, middleware support, great for complex state |
| **Cons** | More boilerplate (less with RTK), steeper learning curve |

### Zustand
| Term | Definition |
|------|-----------|
| **create()** | Creates a Zustand store with state and actions in one place |
| **Pros** | Simple API, minimal boilerplate, can be accessed outside React components, built-in persist middleware |
| **Cons** | Fewer devtools than Redux, less structure for very large apps |
| **persist middleware** | Automatically saves state to localStorage |
| **Outside React** | Zustand stores can be used in utility functions, not just components |

### Comparison Summary
| Feature | Context API | Redux Toolkit | Zustand |
|---------|-------------|---------------|---------|
| Boilerplate | Low | Medium | Very low |
| Learning curve | Low | High | Low |
| High-frequency updates | Poor | Good | Good |
| Devtools | None | Excellent | Basic |
| Outside React | No | Yes (with store) | Yes |
| Persistence | Manual | Manual/middleware | Built-in |

---

## E. NEXT.JS APP ROUTER

| Term | Definition |
|------|-----------|
| **Server Component** | Default in App Router. Runs on server, no JS sent to client. Can fetch data directly, access databases, env vars. CANNOT use hooks (useState, useEffect) or event handlers |
| **Client Component** | Marked with `"use client"` directive. Runs in browser. CAN use hooks, event handlers, browser APIs |
| **Server Action** | An async function marked with `"use server"`. Runs on server, can be called directly from Client Components or forms. Used for data mutations |
| **API Route** | An HTTP endpoint (`route.ts`). Use when external services need to call your backend (webhooks, mobile apps, public APIs) |
| **When to use Server Action** | Form submissions, data mutations from React components, revalidating data |
| **When to use API Route** | Webhooks from external services (Stripe), public REST APIs, endpoints for mobile apps or third-party consumers |
| **File-based routing** | Folder structure = URL structure. `app/about/page.tsx` → `/about` |
| **Dynamic routes** | Use `[slug]` folders. Example: `app/posts/[id]/page.tsx` |
| **layout.tsx** | Shared UI that wraps child pages. Persists across navigation. Nested layouts compose |
| **page.tsx** | The actual page content for a route |
| **loading.tsx** | Automatic loading UI while page content loads |
| **error.tsx** | Error boundary for a route segment |
| **"use client"** | Directive that marks a component as a Client Component |
| **"use server"** | Directive that marks a function as a Server Action |

---

## F. FORMS (react-hook-form)

| Term | Definition |
|------|-----------|
| **useForm()** | The core hook to initialize a form. Returns methods like register, handleSubmit, formState |
| **register("fieldName")** | Connects an input to the form. Spread result onto the input element |
| **handleSubmit(onValid)** | Wraps your submit handler. Only calls `onValid` if validation passes |
| **formState.errors** | Object containing validation errors. **Mock Q16 blank 3 answer: `formState.errors`** (not just `errors`). Access per-field: `formState.errors.email.message` |
| **errors.email** | Access validation errors for the "email" field via `formState.errors.email` |
| **mode: "onChange"** | Validates as the user types. **Mock Q16 blank 4 answer: `onChange`** |
| **mode: "onBlur"** | Validates when the user leaves a field |
| **resolver** | Option to integrate external validation library (like Zod). **Mock Q16 blank 5 answer: `resolver`**. Usage: `resolver: zodResolver(schema)` |
| **handleSubmit** | **Mock Q16 blank 6 answer.** The validated data is passed to the function provided to `handleSubmit` |
| **Primary advantage** | **Mock Q15 answer:** It reduces unnecessary re-renders by using uncontrolled inputs and only re-renders on validation events |

### Teacher's Mock Exam Q12 — React State Fill-in-Blanks (EXACT answers)
1. **re-render** — When you call a state setter, React schedules a re-render
2. **prop drilling** — Passing props through many intermediate components
3. **useCallback** — Memoizes a function reference
4. **lift** — When siblings need shared state, "lift" the state to closest common parent

### Built-in Validation Rules (for register())
| Rule | Example |
|------|---------|
| **required** | `{ required: "This field is required" }` |
| **minLength** | `{ minLength: { value: 3, message: "Min 3 chars" } }` |
| **maxLength** | `{ maxLength: { value: 50, message: "Max 50 chars" } }` |
| **pattern** | `{ pattern: { value: /regex/, message: "Invalid format" } }` |
| **min / max** | For numeric inputs |
| **validate** | Custom validation function |
| **NOT valid** | `type`, `sanitize`, and `format` are NOT built-in validation rules for register() |

### Client vs Server Validation
| Aspect | Detail |
|--------|--------|
| **Client-side** | Better UX, instant feedback, but can be bypassed (DevTools, API calls) |
| **Server-side** | Security requirement. Users can disable JS or send requests directly to the API |
| **Example of failure** | Without server validation, a user could use Postman/curl to send `password: "1"` directly to your API, bypassing all client validation |

---

## G. SOCKET.IO (Real-time Communication)

| Term | Definition |
|------|-----------|
| **Socket.io** | Library for real-time, bidirectional, event-based communication between client and server |
| **io.emit()** | Server sends event to ALL connected clients |
| **socket.emit()** | **Server side**: sends event back to the **sender** (the socket that triggered the event). **Client side**: sends event to the **server**. You do NOT pass a client ID — it only sends to the socket associated with that connection (confirmed in course code: `socket.emit('session', {...})` sends session back to connecting client) |
| **socket.broadcast.emit()** | Sends to ALL clients EXCEPT the sender |
| **socket.on()** | Listens for an event |
| **Rooms** | Channels that sockets can join/leave. Send events to specific groups |
| **Namespaces** | Separate communication channels on the same connection |
| **Middleware** | Functions that run before connection is established. Used for auth/validation |
| **Session management** | Tracking connected users and their state |
| **WebSocket** | The underlying protocol. Socket.io adds automatic reconnection, fallback to polling, rooms, etc. |

---

## H. WEB APIs & OTHER

### Web Components
| Term | Definition |
|------|-----------|
| **Custom Elements** | Define new HTML elements with `customElements.define('tag-name', Class)` |
| **Shadow DOM** | Encapsulated DOM tree attached to an element. Styles don't leak in/out |
| **HTML Templates** | `<template>` element - content not rendered until cloned via JS |
| **connectedCallback()** | Lifecycle method called when element is added to DOM |
| **disconnectedCallback()** | Lifecycle method called when element is removed from DOM |
| **attributeChangedCallback()** | Called when an observed attribute changes |

### HTML5 APIs
| Term | Definition |
|------|-----------|
| **Web Workers** | Run JavaScript in background threads. No access to DOM. Communicate via `postMessage()` |
| **Drag and Drop** | Native API: `draggable="true"`, events: `dragstart`, `dragover`, `drop`. Must `preventDefault()` on dragover |
| **localStorage** | Persistent key-value storage. Data survives browser close. ~5MB limit. Same-origin only |
| **sessionStorage** | Same as localStorage but cleared when tab closes |
| **Web Storage API** | `setItem(key, value)`, `getItem(key)`, `removeItem(key)`, `clear()` |

---

## KEY DEFAULTS TO REMEMBER

| Property | Default Value |
|----------|--------------|
| flex-direction | `row` |
| flex-wrap | `nowrap` |
| justify-content | `flex-start` |
| align-items | `stretch` |
| align-content | `stretch` |
| flex-grow | `0` |
| flex-shrink | `1` |
| order | `0` |
| useEffect with `[]` | runs once on mount |
| useEffect with no array | runs every render |
| react-hook-form mode | `"onSubmit"` |
| Next.js components | Server Components (by default) |
