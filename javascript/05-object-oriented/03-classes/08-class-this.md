# `this` in Classes

`this` inside a class is not fixed at write-time — it is determined by **how a method is called**, not where it's
defined. This single rule explains nearly every `this`-related bug in class-based code, and is the reason this topic
gets its own document.

```javascript
class Counter {
    #count = 0;

    increment() {
        this.#count++;
    }

    get value() {
        return this.#count;
    }
}

const counter = new Counter();
counter.increment();          // called AS a method on `counter` → `this` is `counter`
console.log(counter.value);   // 1
```

## `this` in the Constructor

Inside a constructor, `this` refers to the newly created instance — it exists before the constructor body finishes
running, and every property assigned to `this` becomes an own property of that instance.

```javascript
class User {
    constructor(name) {
        this.name = name;       // sets an own property on the new instance
        console.log(this);      // User { name: "Alex" } — the instance under construction
    }
}

const user = new User("Alex");
```

## `this` in Instance Methods — Determined by Call Site

The core rule: `this` inside a regular (non-arrow) method is whatever object the method was called **on** — not the
object it was defined in.

```javascript
class Dog {
    constructor(name) {
        this.name = name;
    }

    bark() {
        console.log(`${this.name} says woof`);
    }
}

const rex = new Dog("Rex");
rex.bark(); // "Rex says woof" — called on `rex`, so `this` is `rex`

const bark = rex.bark;
bark(); // TypeError (strict mode) or "undefined says woof" — called with no object, `this` is lost
```

Extracting a method as a value and calling it separately from its object — passing it as a callback, storing it in a
variable, assigning it to an event handler — **detaches it from `this`**. This is the single most common source of
`this`-related bugs in class-based code.

## The Classic Trap: Passing a Method as a Callback

```javascript
class Button {
    constructor(label) {
        this.label = label;
    }

    handleClick() {
        console.log(`${this.label} was clicked`);
    }
}

const button = new Button("Submit");

// Looks fine, but the method is called as a bare function by the browser:
element.addEventListener("click", button.handleClick);
// TypeError or "undefined was clicked" — `this` inside handleClick is not `button`
```

The method reference itself carries no memory of which object it came from — only *how it's called* determines `this`,
and `addEventListener` calls the function directly, not as `button.handleClick()`.

## Fix 1: `.bind()`

`.bind()` returns a new function permanently locked to a given `this`, regardless of how that new function is later
called.

```javascript
element.addEventListener("click", button.handleClick.bind(button));
```

Bind once and store the reference if the same bound function will be needed again later (e.g., to `removeEventListener`
it) — binding inline on every call creates a new function object each time and breaks reference equality.

```javascript
class Button {
    constructor(label) {
        this.label = label;
        this.boundHandleClick = this.handleClick.bind(this); // bound once, reused
    }

    handleClick() {
        console.log(`${this.label} was clicked`);
    }
}
```

## Fix 2: Arrow Function Class Fields

An arrow function assigned as a class field captures `this` **lexically**, from the surrounding class instance context
at the point the field is initialized — not from the call site. Since arrow functions never have their own `this`, they
simply can't be detached from it the way regular methods can.

```javascript
class Button {
    constructor(label) {
        this.label = label;
    }

    handleClick = () => {
        console.log(`${this.label} was clicked`);
    };
}

const button = new Button("Submit");
element.addEventListener("click", button.handleClick); // works correctly, no .bind() needed
```

This is the most common modern fix — it reads like a normal method but behaves like a pre-bound one.

**The trade-off:** an arrow function class field is created fresh **per instance** (it's an instance field, not a
prototype method), whereas a regular method is defined once on the prototype and shared by every instance. For a class
with many instances, this means more memory per instance — usually negligible, but worth knowing it's not "free"
compared to a prototype method.

## Fix 3: Bind in the Constructor

Equivalent in effect to Fix 1, written explicitly in the constructor body — common in codebases written before class
field syntax was widely available.

```javascript
class Button {
    constructor(label) {
        this.label = label;
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log(`${this.label} was clicked`);
    }
}
```

## Arrow Functions vs Regular Methods — Choosing Deliberately

| Situation                                                                    | Choice                                                   |
|:-----------------------------------------------------------------------------|:---------------------------------------------------------|
| Method will be called as `obj.method()`, always attached to its object       | Regular method (prototype)                               |
| Method will be passed around as a bare reference (event handlers, callbacks) | Arrow function class field                               |
| Method needs its own `arguments` object                                      | Regular method (arrows have none)                        |
| Method will be used with `.call()`/`.apply()` to explicitly change `this`    | Regular method — arrows ignore `this` overrides entirely |
| Class has many instances and memory efficiency matters                       | Regular method (shared on prototype)                     |

## Arrow Functions Ignore `call()`, `apply()`, and `bind()`

Because an arrow function's `this` is permanently fixed at creation, none of the explicit `this`-setting mechanisms have
any effect on it — they silently do nothing to change `this`, though any arguments passed still work normally.

```javascript
class Widget {
    logThis = () => console.log(this);
}

const widget = new Widget();
widget.logThis.call({fake: "object"}); // still logs the Widget instance — call() is ignored for `this`
```

## `this` Inside Nested Regular Functions

A plain `function` declared or expressed inside a method does **not** inherit the enclosing `this` — it gets its own,
determined by how *it* is called (usually `undefined` in strict mode, or the global object otherwise).

```javascript
class Timer {
    constructor() {
        this.seconds = 0;
    }

    start() {
        setInterval(function () {
            this.seconds++; // ❌ `this` here is NOT the Timer instance
        }, 1000);
    }
}
```

**Fix — use an arrow function for the nested callback**, since arrows inherit `this` from their enclosing scope rather
than having their own:

```javascript
class Timer {
    constructor() {
        this.seconds = 0;
    }

    start() {
        setInterval(() => {
            this.seconds++; // ✅ arrow inherits `this` from `start()`, which is the Timer instance
        }, 1000);
    }
}
```

## `this` in Static Methods

Inside a static method, `this` refers to the class itself, not an instance — a completely separate rule from instance
methods.

```javascript
class Shape {
    static create() {
        return new this(); // `this` is the class — works correctly even in a subclass
    }
}
```

## `this` in Getters and Setters

Getters and setters follow the same call-site rule as regular methods — `this` is the object the property was accessed
through.

```javascript
class Temperature {
    #celsius = 0;

    get fahrenheit() {
        return this.#celsius * 9 / 5 + 32; // `this` is whatever object .fahrenheit was read from
    }
}
```

## Losing `this` Through Destructuring

Destructuring a method off an instance has the exact same detaching effect as assigning it to a variable — it's easy to
miss because destructuring doesn't look like "extracting a method."

```javascript
class Api {
    #token = "abc123";

    fetchData() {
        return this.#token;
    }
}

const api = new Api();
const {fetchData} = api; // detached, just like `const fn = api.fetchData`
fetchData(); // TypeError — `this` is not `api`
```

## Use Cases

* **Regular (prototype) methods for anything always called as `obj.method()`:** The default choice for most class
  methods — internal logic, public API methods called directly, anything that isn't going to be passed around as a bare
  function reference.
* **Arrow function class fields for event handlers and callbacks:** Use when a method will be handed to
  `addEventListener`, passed as a `setTimeout`/`setInterval` callback, given to a `.then()`, or otherwise detached from
  its object and invoked later by something else.
* **`.bind()` in the constructor for pre-ES2022 codebases or when avoiding per-instance field overhead matters:**
  Achieves the same detachment-safety as arrow class fields while keeping the method itself on the prototype — useful in
  performance-sensitive code with many instances where the arrow-field memory trade-off is worth avoiding.
* **Regular functions (not arrows) nested inside methods, specifically when you need the nested function's own
  independent `this`** — for example, a utility callback intentionally meant to run with a different `this` context via
  explicit `.call()`.
* **`new this()` inside static factory methods:** Use when a base class's static factory should correctly construct
  whichever subclass it's actually called on, relying on `this` resolving to the calling class rather than a hardcoded
  base class name.

## Best Practices

* **Default to regular prototype methods; reach for arrow class fields specifically when the method will be detached
  from its instance.** Arrow fields solve a real problem, but making every method an arrow field by default means paying
  the per-instance memory cost everywhere, even for methods that are always called as `obj.method()` and never needed
  the fix in the first place.
* **Never nest a plain `function` inside a method if it needs access to the outer `this` — use an arrow function
  instead.** This is the single most common `this`-related bug in real code: a `setTimeout`, array callback, or nested
  helper silently loses `this` because it's a `function`, not an arrow, inside a method.
* **Bind once and store the reference when a bound function will be used more than once — never call `.bind()` fresh
  inline every time the function is needed.** Repeated inline binding (in a render loop, or every time an event listener
  is attached) creates a new function object each call, which is wasted allocation and breaks reference equality needed
  by `removeEventListener`.
* **Never rely on `call()`/`apply()`/`bind()` to change an arrow function's `this` — they have no effect, and code that
  assumes otherwise has a bug.** If a method genuinely needs its `this` to be reassignable at call time, it must be a
  regular function, not an arrow.
* **Watch for destructuring silently detaching a method from its instance — treat `const { method } = instance` exactly
  like extracting the method into a bare variable.** It's easy to destructure a method alongside data properties without
  noticing the method needs `this` and will break once called standalone.
* **Use `this` (not the literal class name) inside static factory methods when subclassing is expected**, so
  `new this()` and similar patterns correctly construct the calling subclass rather than always the base class.
* **When debugging an unexpected `this`, check the call site first, not the method definition.** Because `this` is
  determined entirely by how a function is invoked, the fix is almost never inside the method body — it's in *how* the
  method ends up being called (bare reference vs. `obj.method()`).