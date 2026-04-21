# Practice Exam 7 -- DOM Manipulation, Selectors, Traversal & Events

---

## Question 1 -- Fill in the Blank

The DOM can be thought of as a tree. The highest node is the root, which is called the __________.

---

## Question 2 -- Fill in the Blank

From each node in the DOM you can access its __________, __________, __________, and __________.

---

## Question 3 -- Code Analysis

Given the following HTML and JavaScript, what does each `console.log` output?

```html
<div class="first">
    <div class="second">
        <div class="third"></div>
        <div class="third-one"></div>
        <div class="third-two"></div>
    </div>
</div>
```

```js
var thirdOne = document.getElementsByClassName("third-one")[0];
console.log(thirdOne.previousSibling);  // A: ?
console.log(thirdOne.nextSibling);      // B: ?
console.log(thirdOne.childNodes);       // C: ?
console.log(thirdOne.parentNode.parentNode); // D: ?
```

---

## Question 4 -- Multiple Choice

How can you access and change an element's attributes in the DOM? (Choose the best answer)

- A) Only through dot notation (e.g. `elem.id = "newId"`)
- B) Only through `setAttribute()` (e.g. `elem.setAttribute("class", "newClass")`)
- C) Either through dot notation (e.g. `elem.id = "newId"`, `elem.className = "newClass"`) OR through `setAttribute("class", "newClass")`
- D) Attributes cannot be changed after the page loads

---

## Question 5 -- Fill in the Blank

HTML5 provided a way for storing values within the HTML using the **data-** prefix. In JavaScript these can be accessed and manipulated by using the __________ keyword.

Write the JavaScript to set a new value `"newValue"` on a `data-x` attribute of an element stored in variable `elem`:

```js
___________________________
```

---

## Question 6 -- Written / Short Answer

Explain the difference between `innerHTML` and `textContent`/`innerText`. What happens if you assign the string `'<div>text</div>'` using each one?

---

## Question 7 -- Code Analysis

What does the following code do? Describe each step.

```js
var body = document.getElementsByTagName('body')[0];

var newParagraph = document.createElement('p');
newParagraph.textContent = 'My new paragraph';
body.appendChild(newParagraph);
```

---

## Question 8 -- Multiple Choice

The method `appendChild(newElement)` is used to:

- A) Insert the element as the first child
- B) Insert the element before a specific sibling
- C) Append the element last (as the last child)
- D) Replace an existing child element

---

## Question 9 -- Fill in the Blank

The method `insertBefore` takes two arguments: `insertBefore(__________, __________)`. It is used to place the node before the __________.

---

## Question 10 -- Code Analysis

Given the following HTML, write JavaScript to remove the child div from the DOM.

```html
<div class="parent">
    <div class="child"></div>
</div>
```

Note: According to the slides, the `removeChild(Node)` method is invoked on the __________ of the child being removed.

---

## Question 11 -- Code Analysis

What does the following code do?

```html
<div class="parent">
    <div class="child"></div>
</div>
```

```js
var child = document.getElementsByClassName('child')[0];
child.parentNode.replaceChild(document.createElement('h1'), child);
```

---

## Question 12 -- Select All That Apply

Which of the following are valid DOM selector methods? (Select ALL that apply)

- A) `document.getElementById()`
- B) `document.getElementsByName()`
- C) `document.getElementsByTagName()`
- D) `document.getElementsByClassName()`
- E) `document.querySelectorAll()`
- F) `document.getElementByClass()`
- G) `document.querySelect()`

---

## Question 13 -- Multiple Choice

According to the slides, `querySelectorAll()` is described as:

- A) A method that only selects elements by id
- B) A method that only works with tag names
- C) Probably the most powerful selector the document has to offer; it accepts any valid CSS selector and matches that to elements in the DOM
- D) A method that returns only a single element

---

## Question 14 -- Written / Short Answer

Explain the difference between the `children` property and the `childNodes` property according to the slides.

Also explain: why can `parentNode` never be a non-element node?

---

## Question 15 -- Fill in the Blank (Traversal Changes)

Complete the element-only traversal equivalents:

| Node-based property  | Element-only equivalent |
|----------------------|------------------------|
| `nextSibling`        | __________             |
| `previousSibling`    | __________             |
| `firstChild`         | __________             |
| `lastChild`          | __________             |

---

## Question 16 -- Multiple Choice

The `nodeType` property is a read-only property. What are the nodeType values for the following?

- Element node: __________
- Attribute node: __________
- Text node: __________
- Comment node: __________

---

## Question 17 -- Written / Short Answer

According to the slides, an event can be broken down into four parts. Define each:

1. **Event type** --
2. **Event target** --
3. **Event object** --
4. **Event handler** --

---

## Question 18 -- Code Analysis

Look at the following code from the slides. Identify which part is the **type**, which is the **target**, which is the **handler**, and which is the **event object**.

```html
<form action="" class="form-horizontal">
    <div class="form-group"><input type="text" id="username" class="form-control"></div>
    <div class="form-group"><input type="password" id="password" class="form-control"></div>
</form>
```

```js
var password = document.getElementById('password');
password.addEventListener('input', function (evt) {
    if (evt.target.value.length < 3) {
        alert('Password too short!');
    }
}, false);
```

- Target: __________
- Type: __________
- Handler: __________
- Event object: __________

---

## Question 19 -- Select All That Apply

Which of the following are properties of the Event object according to the slides? (Select ALL that apply)

- A) `target` -- the element that triggered the event
- B) `type` -- the type of the event, e.g. mousedown
- C) `bubbles` -- a boolean which says whether the event is a bubbling event
- D) `innerHTML` -- the HTML content of the element
- E) `className` -- the CSS class of the target

---

## Question 20 -- Written / Code

The slides describe four methods for registering event handlers. Given this HTML and JavaScript setup:

```html
<div class="form-group">
    <input type="submit" onclick="alert('method #4');" id="submitBtn" class="form-control">
</div>
```

```js
var submitBtn = document.getElementById('submitBtn');

// Method #1
submitBtn.onclick = function (event) {
    alert('inside #1');
}

// Method #2
submitBtn.addEventListener('click', function (event) {
    alert('inside #2');
}, false);

// Method #3
submitBtn.attachEvent('onclick', function (event) {
    alert('inside #3');
});
```

Answer the following:

A) What is the CON of Method #1 (onclick property)?

B) What are the PROs of Method #2 (addEventListener)?

C) What is the CON of Method #4 (inline HTML attribute)?

D) How do you stop an event from bubbling? Name the three ways shown in the slides.

---

## Question 21 -- Fill in the Blank

The __________ event is fired when the document has been loaded and parsed. Complete the code:

```js
document.addEventListener('__________', function (event) {
    // Loaded and handlers can be registered
});
```

---

---

# ANSWER KEY

---

### Question 1
**document**

The DOM can be thought of as a tree. The highest node is the root, which is called the **document**.

---

### Question 2
**parentNode, childNodes, nextSibling, previousSibling**

From each node you can access its parentNode, childNodes, nextSibling, and previousSibling (along with other properties).

---

### Question 3
- **A:** A **text node** (whitespace/newline) — NOT the `<div class="third">` element! `previousSibling` returns ANY node including text nodes created by whitespace between HTML tags. To get the element, use `previousElementSibling` instead.
- **B:** A **text node** (whitespace/newline) — same reason. `nextSibling` returns text nodes. Use `nextElementSibling` to get `<div class="third-two">`.
- **C:** `[]` (empty list -- third-one has no child nodes)
- **D:** `<div class="first"></div>` (parentNode of third-one is "second", parentNode of "second" is "first")

**KEY DISTINCTION (from slides):** `nextSibling`/`previousSibling` include text and comment nodes. `nextElementSibling`/`previousElementSibling` only return element nodes. This is why `children` (elements only) differs from `childNodes` (all nodes including text).

---

### Question 4
**C)** Either through dot notation (e.g. `elem.id = "newId"`, `elem.className = "newClass"`) OR through `setAttribute("class", "newClass")`.

The slides state: "These attributes can be accessed through either dot notation e.g. elem.id = 'newId', elem.className = 'newClass' OR through the use of elem.setAttribute('class', 'newClass')."

---

### Question 5
The keyword is **dataset**.

```js
elem.dataset.x = "newValue";
```

The slides state: "In JavaScript these can be accessed and manipulated by using the **dataset** keyword, e.g. elem.dataset.x = 'newValue';"

---

### Question 6
- **innerHTML** works by rendering valid HTML markup. If you assign `'<h1>I'll replace everything with a header!</h1>'` it will render the h1 tag as an actual HTML heading element.
- **textContent/innerText** is used when querying an element as plain text. If you assign `'<div>text</div>'` it will NOT be rendered as a div element -- it is rendered as a plain string (the slides note: "renderast ekki sem HTML heldur strengur").

---

### Question 7
1. Gets the first `<body>` element from the document using `getElementsByTagName`.
2. Creates a new `<p>` element using `document.createElement('p')`.
3. Sets the text content of that paragraph to `'My new paragraph'` using `textContent`.
4. Appends the new paragraph as the last child of `<body>` using `appendChild`.

---

### Question 8
**C)** Append the element last (as the last child).

The slides state: "appendChild(newElement : Node) which is used to append the element last."

---

### Question 9
`insertBefore(newElement, nextSibling)`. It is used to place the node before the **nextSibling**.

The slides state: "insertBefore(newElement : Node, nextSibling : Node) which is used to place the node before the nextSibling."

---

### Question 10
The method is invoked on the **parent** of the child being removed.

```js
var child = document.getElementsByClassName('child')[0];
var parent = document.getElementsByClassName('parent')[0];

parent.removeChild(child); // Removes the child from the DOM
```

---

### Question 11
It replaces the `<div class="child"></div>` element with a new `<h1>` element. The `replaceChild(NewNode, OldNode)` method is invoked on the parent. After execution, the HTML effectively becomes:

```html
<div class="parent">
    <h1></h1>
</div>
```

---

### Question 12
**A, B, C, D, E** are all valid.

- F) `getElementByClass()` does not exist (the correct method is `getElementsByClassName()`).
- G) `querySelect()` does not exist (the correct method is `querySelector()` or `querySelectorAll()`).

---

### Question 13
**C)** Probably the most powerful selector the document has to offer; it accepts any valid CSS selector and matches that to elements in the DOM.

This is the exact definition from the slides. First argument: a valid CSS selector. Example: `document.querySelectorAll(':nth-child(1)');`

---

### Question 14
- **children** is just like the property **childNodes** but excludes text and comment nodes and only contains element nodes.
- **parentNode** can never be a non-element node because text or comment nodes cannot have children.

---

### Question 15

| Node-based property  | Element-only equivalent       |
|----------------------|-------------------------------|
| `nextSibling`        | **nextElementSibling**        |
| `previousSibling`    | **previousElementSibling**    |
| `firstChild`         | **firstElementChild**         |
| `lastChild`          | **lastElementChild**          |

---

### Question 16
- Element node: **1**
- Attribute node: **2**
- Text node: **3**
- Comment node: **8**

---

### Question 17
1. **Event type** -- is a string that specifies what kind of event occurred.
2. **Event target** -- is the object associated with the event.
3. **Event object** -- is the object associated with the event. It holds information on the event itself and are passed in as arguments in event handlers.
4. **Event handler** -- is the function that handles the event.

---

### Question 18
- **Target:** `password` (the element the event is registered on -- the password input)
- **Type:** `'input'` (the first argument to addEventListener)
- **Handler:** `function (evt) { if (evt.target.value.length < 3) { alert('Password too short!'); } }` (the function passed as second argument)
- **Event object:** `evt` (the parameter passed into the handler function)

---

### Question 19
**A, B, C** are correct.

- A) `target` is the element that triggered the event.
- B) `type` is the type of the event, e.g. mousedown.
- C) `bubbles` is a boolean which says whether the event is a bubbling event.
- D) `innerHTML` is a DOM manipulation property, not an Event object property.
- E) `className` is a DOM element property, not an Event object property.

---

### Question 20

**A)** Method #1 (onclick property) CON: Only one event handler because it overrides previous registered event handlers.

**B)** Method #2 (addEventListener) PROs: Allows multiple event handlers, avoids duplication.

**C)** Method #4 (inline HTML attribute) CON: "Dirty" HTML and cluttered.

**D)** Three ways to stop an event from bubbling:
1. `event.stopPropagation();`
2. `event.cancelBubble = true;`
3. `event.stopImmediatePropagation();`

---

### Question 21
The **DOMContentLoaded** event is fired when the document has been loaded and parsed.

```js
document.addEventListener('DOMContentLoaded', function (event) {
    // Loaded and handlers can be registered
});
```
