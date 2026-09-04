# Class Initialization Order

Classes have a precise, spec-defined order in which fields, static members, and constructor logic run — and this order
is not always intuitive, especially once inheritance, static blocks, and private fields are combined. Getting this wrong
produces bugs that look like "the value isn't set yet" or "this ran too early."

## Order for a Single (Non-Derived) Class

For a class with no `extends`, construction happens in this order:

1. A new object is created.
2. **Instance field initializers run, top to bottom, in declaration order.**
3. **The constructor body runs.**

```javascript
class Example {
    a = console.log("field a") || 1;

    constructor() {
        console.log("constructor body");
    }

    b = console.log("field b") || 2; // still runs BEFORE the constructor body, despite being written after it
}

new Example();
// "field a"
// "field b"
// "constructor body"
```

**Field declaration order matters, but position relative to the constructor does not** — all fields run before the
constructor body regardless of where they're written in the class.

## Static Member Initialization Order

Static fields and static blocks run **once**, when the class itself is evaluated (i.e., when the `class`
declaration/expression executes) — not when any instance is created, and not lazily on first access.

```javascript
class Example {
    static a = console.log("static field a") || 1;
    static {
        console.log("static block");
    }
    static b = console.log("static field b") || 2;
}

// "static field a"
// "static block"
// "static field b"
// — all of this printed immediately, before any `new Example()` ever runs
```

Static fields and static blocks interleave in **source order**, exactly like a single sequence — this matters when a
static block depends on a static field declared above it, or a later static field depends on setup a block above it
performed.

```javascript
class Config {
    static #raw = "development";
    static {
        // this block can safely use #raw, since it was declared above
        Config.#raw = Config.#raw.toUpperCase();
    }
    static label = `ENV: ${Config.#raw}`; // "ENV: DEVELOPMENT" — runs after the block above
}
```

## Order for a Derived Class

Inheritance inserts the parent's construction into the middle of the sequence — this is the most commonly misunderstood
ordering in the entire class system:

1. `super(...)` is called — this runs the **entire** parent construction sequence (parent's own field initializers, then
   parent's constructor body) before returning control to the subclass.
2. **The subclass's own instance field initializers run**, immediately after `super()` returns.
3. **The rest of the subclass constructor body runs** (everything after the `super()` call).

```javascript
class Base {
    baseField = console.log("Base field") || "base";

    constructor() {
        console.log("Base constructor body");
    }
}

class Derived extends Base {
    derivedField = console.log("Derived field") || "derived";

    constructor() {
        console.log("before super()"); // this line runs BEFORE super(), which is legal — just no `this` yet
        super();
        console.log("after super()");
    }
}

new Derived();
// "before super()"
// "Base field"
// "Base constructor body"
// "Derived field"
// "after super()"
```

Code before `super()` in a derived constructor can run — logging, computing values to pass into `super(...)` — as long
as it never touches `this`, since `this` doesn't exist until the base class finishes constructing the object.

## Multi-Level Inheritance — the Chain Fully Unwinds Before Any Subclass Field Runs

With three or more levels, every `super()` call in the chain must resolve all the way to the base class before
initialization starts working its way back down — this produces a specific, sometimes surprising interleaving.

```javascript
class A {
    aField = console.log("A field") || 1;

    constructor() {
        console.log("A constructor");
    }
}

class B extends A {
    bField = console.log("B field") || 2;

    constructor() {
        super();
        console.log("B constructor");
    }
}

class C extends B {
    cField = console.log("C field") || 3;

    constructor() {
        super();
        console.log("C constructor");
    }
}

new C();
// "A field"
// "A constructor"
// "B field"
// "B constructor"
// "C field"
// "C constructor"
```

Each level's fields run immediately after that level's `super()` call returns, and before that level's own constructor
body continues — the full chain resolves bottom-up (starting from the deepest base class) even though the call
originated at the top (`new C()`).

## Field Initializers Can Reference Earlier Fields and Inherited State — But Only What's Already Run

A field initializer can use `this` to read anything already set up by this point in the sequence — inherited fields
(once `super()` has returned) and any of this class's own fields declared **above** it — but not fields declared below
it, since they haven't run yet.

```javascript
class Rectangle {
    width = 10;
    height = 20;
    area = this.width * this.height; // fine — width and height already initialized above
}

class Derived extends Rectangle {
    label = `Area: ${this.area}`; // fine — area was set during super()'s field initialization
}

console.log(new Derived().label); // "Area: 200"
```

```javascript
class Broken {
    a = this.b * 2; // `this.b` is `undefined` here — `b` hasn't been initialized yet
    b = 5;
}

console.log(new Broken().a); // NaN — not 10
```

## Where Static Blocks Fit Relative to the Whole Class Definition

Static initialization (fields and blocks) happens once, synchronously, as soon as the `class` statement is evaluated —
this can be well before any instance is ever constructed, including never, if the class is defined but no instance is
created.

```javascript
console.log("before class definition");

class Example {
    static setup = console.log("static field runs here") || true;
}

console.log("after class definition, before any instantiation");
new Example(); // instance construction — does NOT re-run static setup
```

```
before class definition
static field runs here
after class definition, before any instantiation
```

## Private Field Initialization Follows the Same Rules as Public Fields

Private instance fields (`#field`) initialize at exactly the same point in the sequence as public fields — same rules
about order, same rule about running before the constructor body, same restriction about referencing later-declared
fields.

```javascript
class Counter {
    #count = 0;               // private field — initializes in the normal field phase
    #doubled = this.#count * 2; // fine — #count already initialized above
    constructor() {
        console.log(this.#doubled); // 0
    }
}
```

## Summary Table

| Class Type              | Order                                                                                                                                                  |
|:------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------|
| No inheritance          | Instance fields (declaration order) → constructor body                                                                                                 |
| Static members          | Static fields + static blocks, interleaved in source order, once, at class evaluation time                                                             |
| Derived class           | Code before `super()` (no `this` access) → `super()` fully resolves parent's own sequence → this class's instance fields → rest of constructor body    |
| Multi-level inheritance | Fully resolves bottom-up: deepest base class's fields+constructor, then each level's fields+constructor working back up to the originally-called class |

## Use Cases

* **Deriving one field from another within the same class:** Rely on declaration-order field initialization when a
  field's value should be computed from an earlier field (`area = this.width * this.height`) — order the declarations
  accordingly rather than computing everything inside the constructor body.
* **Guaranteeing shared setup runs exactly once, regardless of instance count:** Use static fields or a `static {}`
  block for one-time setup (parsing a config, building a lookup table) that should happen exactly once when the class is
  defined, not once per instance.
* **Running validated setup logic before subclass-specific initialization begins:** Rely on `super()` fully resolving
  before a subclass's own fields run, when a subclass's fields need to read state the parent guarantees is ready (like
  the `Rectangle`/`Derived` example above).
* **Computing values to pass into `super(...)` without touching `this` first:** Use the "code before `super()`" window
  for simple, `this`-free preprocessing (validating or transforming constructor arguments) before handing them to the
  parent constructor.
* **Debugging unexpected `undefined` values during construction:** Check field declaration order first — a field reading
  another field declared *below* it will silently be `undefined`, not an error, so this is a common silent-bug pattern
  worth checking directly against the sequencing rules above.

## Best Practices

* **Order field declarations so that any field depending on another field comes after it — never rely on hoisting or "
  it'll sort itself out."** Field initializers run strictly top-to-bottom in written order; a dependency on a field
  declared later is a real, silent bug (`undefined`, not an error) rather than something the engine resolves
  automatically.
* **Keep code before `super()` minimal and strictly free of `this` — treat that window as argument-preparation only, not
  general setup logic.** The fact that it's legal to run code there doesn't mean it should carry much responsibility;
  misplaced logic there is easy to overlook since it runs before the rest of the constructor visually "starts."
* **Use a `static {}` block only when static field initializer expressions genuinely aren't sufficient (multi-statement
  logic, try/catch, populating from an external source) — plain static field initializers are simpler for anything
  single-expression.** Reaching for a block by default when a simple `static x = computeX();` would do adds unnecessary
  structure.
* **Don't assume static initialization is lazy — a static field or block runs as soon as the class is evaluated, even if
  no instance is ever created.** If static setup is expensive (a database connection, a large computed table) and should
  only happen when the class is actually used, that's a sign a lazy-static or factory-method pattern is more appropriate
  than a straightforward static field.
* **When debugging multi-level inheritance construction order, trace it as "fully resolve to the base first, then unwind
  back up" rather than "top to bottom as written."** The call originates at the most-derived class, but almost all of
  the actual work happens bottom-up through the chain — this is the opposite of how the code reads visually, which is
  exactly why it causes confusion.
* **Treat private and public field initialization order identically when reasoning about sequencing — there's no
  special-case behavior for `#fields` here.** The only special rules for private fields concern *access* (inheritance,
  `super`, brand checks, not *initialization timing*, which follows the exact same declaration-order rules as public
  fields.