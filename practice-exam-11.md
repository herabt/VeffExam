# Practice Exam 11 -- JavaScript Design Patterns

---

## Question 1 -- Constructor with Prototype

What is the key difference between defining `toString` directly inside a `Car` constructor function versus defining it on `Car.prototype`?

```js
// Version A: Basic Constructor
function Car(model, year, miles) {
  this.model = model;
  this.year = year;
  this.miles = miles;
  this.toString = function () {
    return this.model + " has done " + this.miles + " miles";
  };
}

// Version B: Constructor with Prototype
function Car(model, year, miles) {
  this.model = model;
  this.year = year;
  this.miles = miles;
}

Car.prototype.toString = function () {
  return this.model + " has done " + this.miles + " miles";
};
```

---

## Question 2 -- Factory Pattern Definition

The Factory Pattern "suggests defining an interface for creating an object where you allow the subclasses to decide which class to instantiate." In the code below, explain how `VehicleFactory` and `TruckFactory` demonstrate this principle.

```js
function VehicleFactory() {}

VehicleFactory.prototype.vehicleClass = Car;

VehicleFactory.prototype.getVehicle = function (options) {
  return new this.vehicleClass(options);
};

function TruckFactory() {}
TruckFactory.prototype = new VehicleFactory();
TruckFactory.prototype.vehicleClass = Truck;
```

---

## Question 3 -- Factory Pattern Use Cases

List four situations where the Factory Pattern is useful according to the slides.

---

## Question 4 -- Singleton Pattern Definition

The Singleton Pattern "restricts instantiation of a class to a single object." The slides also state that "many objects use this same object, they always get the same instantiation and therefore the state of the object will remain the same." Given this code, explain how it works:

```js
var basicSingleton = {
  x: 1,
  y: 2,
  sum: function () {
    return this.x + this.y;
  }
};
```

Why is a plain object literal already considered a basic singleton in JavaScript?

---

## Question 5 -- Singleton with Closures

Consider a Singleton that uses closures to hold private variables. Why would you use a closure-based Singleton instead of the basic object literal approach shown in Question 4?

---

## Question 6 -- Singleton with getInstance

Explain the concept of lazy initialization in a Singleton pattern that uses a `getInstance()` method. What does "lazy" mean in this context?

---

## Question 7 -- Decorator Pattern Definition

The Decorator Pattern "allows behaviour to be added to an existing object dynamically." The slides also state that "decoration itself isn't essential to base functionality." Explain what this means using a real-world analogy.

---

## Question 8 -- Simple Decorator

Given this simple decorator approach, explain how `addCannon` adds behavior dynamically to a `Vehicle` object:

```js
function Vehicle(type) {
  this.type = type || 'car';
  this.model = 'default';
  this.license = '00-000';
}

var car = new Vehicle();
console.log(car); // { type: 'car', model: 'default', license: '00-000' }

var armoredTank = new Vehicle('tank');
armoredTank.addCannon = function(cannonName) {
  if (!this.hasOwnProperty('cannons')) { this.cannons = []; }
  this.cannons.push({ id: this.cannons.length + 1, name: cannonName });
  return this;
};

armoredTank.addCannon('T101').addCannon('T102');
console.log(armoredTank);

var newCar = new Vehicle();
console.log(newCar); // { type: 'car', model: 'default', license: '00-000' }
```

Note: `addCannon` is added to the **specific instance** `armoredTank`, NOT to `Vehicle.prototype`. This is the key point of the Decorator pattern — the behavior is added to one object without affecting others. `newCar` does NOT have `addCannon`.

a) Why is `addCannon` added to the instance and not the prototype? (from slides)
b) What is the purpose of `return this`?

---

## Question 9 -- Multiple Decorators (MacBook)

Study the following decorator pattern. What is the final cost of a decorated MacBook?

```js
function MacBook() {
  this.cost = function () { return 997; };
}

function Memory(macbook) {
  var v = macbook.cost();
  macbook.cost = function () {
    return v + 75;
  };
}

function Insurance(macbook) {
  var v = macbook.cost();
  macbook.cost = function () {
    return v + 250;
  };
}

var mb = new MacBook();
Memory(mb);
Insurance(mb);
console.log(mb.cost());   // ?
```

---

## Question 10 -- Decorators Through Interfaces

The slides show an approach using `Interface.ensureImplements` with a `MacBookPro` that supports decorators like `addEngraving`, `addParallels`, and `add4GBRam`. What is the role of `Interface.ensureImplements` in this pattern?

---

## Question 11 -- Abstract Decorators

In the abstract decorator approach, a `MacbookDecorator` delegates calls to `this.macBook`. Why is delegation important here, and how does it differ from directly modifying the original object?

---

## Question 12 -- Facade Pattern

The Facade Pattern "provides a convenient higher-level interface to a larger body of code, hiding its true underlying complexity." Provide an example of where a Facade is used in everyday front-end development and explain why it is useful.

---

## Question 13 -- Flyweight Pattern

The Flyweight Pattern is described as a "useful classical solution for code that's repetitive, slow and inefficient." The key idea is to separate data into intrinsic and extrinsic states. In the following example:

- `BookFlyweight` stores book data (intrinsic)
- `BookRecordManager` stores checkout data (extrinsic)

The slides state: "if we have 30 copies of the same book, we are now only storing it once."

Explain what intrinsic vs. extrinsic state means and why this separation saves memory.

---

## Question 14 -- Iterator Pattern

The Iterator Pattern "access elements of an aggregate object sequentially without needing to expose its underlying form." jQuery's `$.each()` is given as an example. Write a simple iterator function that takes an array and a callback, calling the callback for each element.

---

## Question 15 -- Observer / Publish-Subscribe Definition

The Observer Pattern "allows an object (subscriber) to watch another object (publisher)." The slides also state that "Redux pattern in React is heavily dependent on the Observer pattern."

Describe the three core operations of the Observer pattern as shown in the slides.

---

## Question 16 -- Observer Pattern: Pros and Cons

According to the slides, the Observer pattern has these characteristics:

**Pros:**
- Loosely coupled modules
- Encourages thinking about relationships between parts

**Cons:**
- Difficult to see how things function
- Publishers don't know if subscribers fail

Explain each pro and con in your own words and give a concrete scenario for one of the cons.

---

## Question 17 -- Mediator Pattern

The Mediator Pattern acts as a "neutral party who assists in negotiations and conflict resolution." The slides describe it as a "shared subject in the observer pattern" that "promotes loose coupling" through a central point of communication.

How does the Mediator differ from the Observer pattern? Why might you choose a Mediator over direct Observer connections between many objects?

---

## Question 18 -- DOM Layer / Centralized Event Handling

The slides mention using bubbling events and `this.matches('a.toggle')` as a centralized event handling technique. Explain how event bubbling works and why centralized event handling is more efficient than attaching individual listeners to every element.

---

---

# Answer Key

---

### Answer 1 -- Constructor with Prototype

In **Version A**, every time `new Car()` is called, a brand-new copy of the `toString` function is created and attached to that specific instance. If you create 1000 cars, you get 1000 separate function objects in memory.

In **Version B**, `toString` is defined once on `Car.prototype`. All instances share the same single function through the prototype chain. This is more memory-efficient and is the idiomatic JavaScript approach. If the method is updated on the prototype, every instance immediately sees the change.

---

### Answer 2 -- Factory Pattern Definition

`VehicleFactory` defines a generic interface for creating vehicles. Its `getVehicle` method calls `new this.vehicleClass(options)`, which creates an instance of whatever class `this.vehicleClass` points to. By default it is `Car`.

`TruckFactory` inherits from `VehicleFactory` (via `TruckFactory.prototype = new VehicleFactory()`) and overrides `vehicleClass` to `Truck`. This means `TruckFactory.getVehicle()` will instantiate a `Truck` instead of a `Car`, without changing the `getVehicle` method itself. The subclass decides which class to instantiate -- exactly what the pattern describes.

---

### Answer 3 -- Factory Pattern Use Cases

According to the slides, the Factory Pattern is useful when:

1. **High complexity setup** -- the object creation process is complex
2. **Different instances per environment** -- you need to generate different objects depending on the environment
3. **Many small objects sharing properties** -- working with many small objects that share the same properties
4. **Duck typing for decoupling** -- using duck typing to decouple components (objects only need to satisfy an interface, not inherit from a specific class)

---

### Answer 4 -- Singleton Pattern Definition

A plain JavaScript object literal is already a singleton because there is only ever one instance of it. You cannot call `new basicSingleton()` to create another. Every variable that references `basicSingleton` points to the exact same object. If one part of the code modifies `basicSingleton.x`, every other reference sees the change -- "they always get the same instantiation and therefore the state of the object will remain the same."

---

### Answer 5 -- Singleton with Closures

The closure-based Singleton allows you to have **private variables** that cannot be accessed or modified from outside. The basic object literal exposes all its properties publicly (`basicSingleton.x` can be read and changed by anyone). With closures, internal state is hidden and only accessible through the methods the Singleton exposes, providing encapsulation and data protection.

---

### Answer 6 -- Singleton with getInstance

Lazy initialization means the Singleton instance is not created until `getInstance()` is called for the first time. "Lazy" means it defers creation until the moment it is actually needed, rather than creating it eagerly at program startup. On the first call, `getInstance()` creates and stores the instance; on all subsequent calls it returns the already-created instance. This saves resources if the Singleton is never used, and guarantees only one instance exists.

---

### Answer 7 -- Decorator Pattern Definition

"Allows behaviour to be added to an existing object dynamically" means you can extend an object's capabilities at runtime without modifying its class definition. "Decoration itself isn't essential to base functionality" means the added behavior is optional -- the object works fine without it.

**Real-world analogy:** A plain coffee (base object) is perfectly drinkable. Adding milk, sugar, or whipped cream (decorators) enhances it, but none of those additions are essential for it to be coffee.

---

### Answer 8 -- Simple Decorator

`addCannon` dynamically adds a new property `hasCannon = true` to the `Vehicle` instance at runtime. The vehicle works perfectly without a cannon -- the cannon is not essential to base functionality.

`return this` enables **method chaining**, meaning you can write:
```js
var v = new Vehicle("tank").addCannon().addArmor();
```
Each method returns the object itself, so the next method can be called immediately on the result.

---

### Answer 9 -- Multiple Decorators (MacBook)

Step by step:
1. `new MacBook()` -- `cost()` returns **997**
2. `Memory(mb)` -- captures `v = 997`, replaces `cost` with a function returning `997 + 75 = 1072`
3. `Insurance(mb)` -- captures `v = 1072`, replaces `cost` with a function returning `1072 + 250 = 1322`

**Final answer: `mb.cost()` returns `1322`.**

Each decorator wraps the previous cost by capturing its value in a closure, then replacing the `cost` method with one that adds its own amount.

---

### Answer 10 -- Decorators Through Interfaces

`Interface.ensureImplements` verifies at runtime that an object actually implements a required interface (i.e., has all the expected methods). This provides a safety check: if a decorator is applied to an object that does not have the required methods, an error is thrown immediately rather than failing silently later. It enforces a contract between the base object and its decorators, ensuring decorators like `addEngraving`, `addParallels`, and `add4GBRam` can safely delegate to the underlying object.

---

### Answer 11 -- Abstract Decorators

In the abstract decorator approach, `MacbookDecorator` holds a reference to `this.macBook` and forwards method calls to it (delegation). This means:

- The **original object is not modified** -- its methods remain intact
- The decorator **wraps** the original, intercepting calls and optionally adding behavior before or after delegating
- Multiple decorators can be **stacked** without each one permanently altering the base object
- You can **remove** a decorator layer without side effects

This differs from directly modifying the original object (as in Question 9), where each decorator permanently overwrites the `cost` method on the instance itself.

---

### Answer 12 -- Facade Pattern

A common front-end example is jQuery itself. Instead of writing:
```js
document.getElementById("myDiv").style.display = "none";
document.getElementById("myDiv").style.opacity = "0";
```
you write:
```js
$("#myDiv").hide();
```

The Facade (`$.hide()`) provides a convenient higher-level interface that hides the true underlying complexity of cross-browser DOM manipulation, CSS transitions, and event cleanup. It makes the code simpler to write, read, and maintain.

---

### Answer 13 -- Flyweight Pattern

**Intrinsic state** is data that is shared and does not change between instances -- for books this is: title, author, genre, pageCount, publisherId, isbn (stored in `BookFlyweight` constructor from slides).

**Extrinsic state** is data unique to each instance -- for books this is: checkoutDate, checkoutMember, dueReturnDate, availability (stored in `BookRecordManager` from slides). The `BookFactory` checks `existingBooks[isbn]` and returns a cached flyweight if it exists, or creates a new one.

If you have 30 copies of "Clean Code," the intrinsic data (title, author, ISBN) is identical for all 30. Without the Flyweight pattern you store this data 30 times. With it, you store the book data once in a single `BookFlyweight` object and only the checkout-specific data 30 times in the `BookRecordManager`. This dramatically reduces memory usage.

---

### Answer 14 -- Iterator Pattern

```js
function each(array, callback) {
  for (var i = 0; i < array.length; i++) {
    callback(i, array[i]);
  }
}

// Usage
each(["a", "b", "c"], function (index, value) {
  console.log(index + ": " + value);
});
// 0: a
// 1: b
// 2: c
```

The consumer does not need to know the internal structure of the collection (array, linked list, tree, etc.). The iterator handles traversal, exposing only the current element and index -- "without needing to expose its underlying form."

---

### Answer 15 -- Observer / Publish-Subscribe Definition

The three core operations shown in the slides are:

1. **Subscribe (register)** -- Subscribers register their interest in a particular event/topic with the publisher
2. **Publish (broadcast)** -- The publisher broadcasts a notification to all registered subscribers when an event occurs
3. **Unsubscribe** -- Subscribers can remove themselves so they no longer receive notifications

These correspond to the `publish`, `subscribe`, and `unsubscribe` methods shown in the observer object on the slides.

---

### Answer 16 -- Observer Pattern: Pros and Cons

**Pro -- Loosely coupled modules:** Publishers and subscribers do not need to know about each other's internals. A button component can publish a "clicked" event without knowing whether 0 or 50 other modules are listening. This makes modules independently testable and replaceable.

**Pro -- Encourages thinking about relationships:** The pattern forces developers to explicitly define which events exist and who cares about them, leading to better-architected systems.

**Con -- Difficult to see how things function:** Because communication is indirect (through events rather than direct method calls), it can be hard to trace the flow of data through the application. Debugging becomes harder when you cannot see a direct call stack from publisher to subscriber.

**Con -- Publishers don't know if subscribers fail:** If a subscriber throws an error or silently fails to process an event, the publisher has no way of knowing.

**Con -- Observers are quite ignorant to the existence of each other** (from slides): Subscribers don't know about other subscribers. They operate independently and cannot coordinate or depend on each other's state.

---

### Answer 17 -- Mediator Pattern

In the **Observer pattern**, objects communicate directly through publish/subscribe -- any object can observe any other object, potentially creating a complex web of connections.

The **Mediator** introduces a single central object (the mediator) that all other objects communicate through. Instead of Object A publishing directly to Objects B, C, and D, Object A sends a message to the Mediator, and the Mediator decides who to notify and how. It is a "shared subject" -- a single centralized hub.

You would choose a Mediator over direct Observer connections when you have **many objects that need to communicate with each other**, because:
- Direct connections between N objects can create up to N*(N-1) relationships
- A Mediator reduces this to N relationships (each object connects only to the mediator)
- The Mediator centralizes the communication logic, making it easier to understand and modify
- It "promotes loose coupling" because objects only know about the mediator, not about each other

---

### Answer 18 -- DOM Layer / Centralized Event Handling

**Event bubbling** means that when an event (like a click) occurs on a child element, it first triggers on that element, then propagates upward through each ancestor element in the DOM tree (child -> parent -> grandparent -> ... -> document).

**Centralized event handling** (also called event delegation) takes advantage of bubbling by attaching a single event listener to a parent element instead of attaching individual listeners to every child. When an event bubbles up, the parent listener checks `this.matches('a.toggle')` (or similar) to determine if the event originated from a relevant element.

This is more efficient because:
1. **Fewer event listeners** -- one listener instead of potentially hundreds, reducing memory usage
2. **Dynamically added elements** -- new child elements automatically work without needing to attach new listeners
3. **Simpler cleanup** -- only one listener to remove instead of many
4. **Better performance** -- especially on pages with many interactive elements
