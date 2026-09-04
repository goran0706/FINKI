# `super`

`super` has two distinct forms — `super(...)` as a constructor call, and `super.property`/`super.method()` as a
reference — and they follow different rules.

## Two Forms, Two Different Purposes

| Form             | Valid Where                                                  | Purpose                                                                                             |
|:-----------------|:-------------------------------------------------------------|:----------------------------------------------------------------------------------------------------|
| `super(...args)` | Only inside a derived class's `constructor`                  | Calls the parent class's constructor                                                                |
| `super.property` | Inside any instance method, static method, getter, or setter | Reads a property/method from the parent's prototype (or the parent class itself, in static context) |

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        return `${this.name} makes a sound.`;
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name);           // form 1 — constructor call
    }

    speak() {
        return super.speak();  // form 2 — property/method reference
    }
}
```

Using the wrong form in the wrong place is a `SyntaxError`, not a runtime error — the engine rejects `super(...)`
outside a constructor, and `super.x` outside any method, at parse time.

```javascript
class Dog extends Animal {
    speak() {
        return super("Rex"); // SyntaxError — super() call only valid in a constructor
    }
}

function standalone() {
    return super.toString(); // SyntaxError — super not valid outside a class method at all
}
```

## `super` Is Not a Value

`super` cannot be logged, assigned, passed as an argument, or used standalone — it only has meaning as the left-hand
side of a property access (`super.x`) or as a call (`super(...)`) in a constructor.

```javascript
class Dog extends Animal {
    speak() {
        console.log(super);        // SyntaxError
        const ref = super;         // SyntaxError
        return super.speak;        // fine — returns the function reference itself, not a call
    }
}
```

`super.speak` (no parentheses) is legal and returns the parent method as a value — but calling that extracted reference
later loses the special `super` binding, behaving like any other detached method reference for the general detachment
problem.

## `super()` Must Run Before `this` — and Only Once

A derived constructor must call `super()` before touching `this`, and calling it more than once throws.

```javascript
class Dog extends Animal {
    constructor(name) {
        super(name);
        super(name); // ReferenceError — super() already called
    }
}
```

`super()` can be called **conditionally**, as long as exactly one call happens before any `this` use — this is legal, if
unusual:

```javascript
class Dog extends Animal {
    constructor(name, useDefault) {
        if (useDefault) {
            super("Unnamed");
        } else {
            super(name);
        }
        // fine — exactly one super() call happened on every path, before this is used
    }
}
```

## `super.method()` Resolves From Where It's *Written*, Not From the Instance

This is the single most important mechanical fact about `super`: a method's `super` reference is bound to the prototype
**one level above where that method is defined** — a fixed relationship called the method's "home object" — regardless
of what object the method is eventually called on.

```javascript
class A {
    speak() {
        return "A";
    }
}

class B extends A {
    speak() {
        return `${super.speak()}-B`;
    } // super here ALWAYS means A.prototype
}

class C extends B {
    speak() {
        return `${super.speak()}-C`;
    } // super here ALWAYS means B.prototype
}

console.log(new C().speak()); // "A-B-C"
```

Even though `new C().speak()` is the outermost call, `B`'s `speak()` doesn't "know" it's ultimately being called as part
of a `C` instance — its `super` is permanently anchored to `A.prototype`, because that's where `B` was defined relative
to. This is what makes multi-level `super` chains compose predictably.

## `super` in Static Methods

Inside a static method, `super` refers to the **parent class itself** (not the parent's prototype) — following the same
"where it's called from is irrelevant, where it's defined matters" rule as instance methods, just one level up in the
static hierarchy.

```javascript
class Shape {
    static describe() {
        return "A shape.";
    }
}

class Circle extends Shape {
    static describe() {
        return `${super.describe()} A circle, specifically.`;
    }
}

console.log(Circle.describe());
```

## `super` in Getters and Setters

`super` works identically inside accessors — it looks up the corresponding getter/setter on the parent's prototype.

```javascript
class Base {
    #value = 10;
    get value() {
        return this.#value;
    }
}

class Derived extends Base {
    get value() {
        return super.value * 2; // calls Base's getter, then doubles it
    }
}

console.log(new Derived().value); // 20
```

A common mistake: calling `super.value()` (with parentheses) when `value` is a getter, not a method — this throws,
because `super.value` already *is* the resolved value, not a callable function.

## `super` Cannot Access the Parent's Private Fields

Private fields (`#field`) are not accessible via `super`, even though `super` can reach public methods and accessors.

```javascript
class Animal {
    #sound = "...";

    makeSound() {
        return this.#sound;
    }
}

class Dog extends Animal {
    describe() {
        return super.makeSound(); // OK — public method
        // return super.#sound;   // SyntaxError — private fields never reachable via super
    }
}
```

## `super` in Object Literals (Not Just Classes)

`super.method()` also works inside object literal method shorthand, when the object was created with
`Object.setPrototypeOf()` or `Object.create()` pointing to another object — this is a lesser-known corner of the
feature, since `super` isn't exclusively tied to `class` syntax.

```javascript
const base = {
    speak() {
        return "base speaking";
    },
};

const derived = {
    speak() {
        return `${super.speak()}, extended`; // works — object literal method shorthand supports super
    },
};

Object.setPrototypeOf(derived, base);
console.log(derived.speak()); // "base speaking, extended"
```

This only works with the shorthand method syntax (`speak() {}`) — a property assigned a plain function expression
(`speak: function() {}`) has no "home object" binding and cannot use `super`.

```javascript
const broken = {
    speak: function () {
        return super.speak(); // SyntaxError — no home object binding for a plain function expression
    },
};
```

## `super` and Method Overriding — Extend vs Replace

Whether an override calls `super.method()` determines whether it **extends** or **fully replaces** the inherited
behavior — this decision point is the main practical reason `super.method()` exists at all, beyond constructor chaining.

```javascript
class Logger {
    log(msg) {
        console.log(`[LOG] ${msg}`);
    }
}

class TimestampedLogger extends Logger {
    log(msg) {
        super.log(`${new Date().toISOString()} ${msg}`); // extends — reuses parent's formatting
    }
}

class SilentLogger extends Logger {
    log(msg) {
        // fully replaces — no super.log() call, parent behavior is discarded entirely
    }
}
```

## Use Cases

* **Chaining constructor initialization across a hierarchy:** Use `super(...)` whenever a derived class needs the
  parent's constructor logic (setting shared fields, running shared validation) to run before adding its own
  initialization.
* **Extending an inherited method's behavior without duplicating it:** Use `super.method()` when an override should add
  to what the parent does (extra logging, additional validation, formatting) rather than reimplement the parent's logic
  from scratch.
* **Building predictable multi-level behavior chains:** Rely on `super`'s fixed "where it's defined" binding when
  designing a hierarchy where each layer is expected to add its own contribution on top of every layer below it (as in
  the `A`/`B`/`C` chain example above).
* **Extending inherited static factory or utility logic:** Use `super.staticMethod()` inside a subclass's static method
  override when the subclass's static behavior should build on, not replace, the parent class's static logic.
* **Reusing shared behavior between non-class objects linked via prototype:** Use `super` inside object literal method
  shorthand when working with `Object.create()`-based prototypal patterns instead of `class` syntax, particularly in
  codebases that predate or intentionally avoid classes.

## Best Practices

* **Call `super()` as early as possible in a derived constructor, even when the language would technically allow
  deferring it on some conditional paths.** Deferring it, even legally, makes the constructor harder to read and
  increases the risk of accidentally introducing a `this` reference before `super()` runs during a later edit.
* **Use `super.method()` deliberately to signal "this override builds on the parent," and omit it deliberately to
  signal "this override fully replaces the parent" — don't let the choice be accidental.** A reader scanning an override
  should be able to tell from the presence or absence of a `super` call whether the parent's behavior still runs at all.
* **Remember that `super` inside a method is fixed to where that method is *defined*, not to the instance it's
  eventually called through — don't expect a `super` chain to "know about" further subclasses beneath it.** This is the
  source of confusion in multi-level hierarchies; each layer's `super` reference is static and was decided when the
  class was written, not dynamically resolved based on the actual instance.
* **Never try to store, log, or pass `super` around as if it were a value — only ever use it directly as `super.x` or
  `super(...)`.** If code needs a reusable reference to the parent's behavior, extract the result of `super.method()`
  (called immediately) into a variable, not `super` itself.
* **Provide public accessor methods on a base class instead of expecting subclasses to reach a private field via
  `super` — that path doesn't exist and never will.** This is a design decision to make upfront: any state a subclass
  might need access to must be exposed through the base class's public or protected-by-convention API, since
  `super.#field` is permanently off-limits by spec.
* **Use `super.getter` (no parentheses) and `super.setter = value`, never `super.getter()`, when the parent member is an
  accessor rather than a method.** Confusing an accessor with a method when using `super` produces a `TypeError` (
  "super.value is not a function") that can be confusing to trace back to "this is actually a getter."
* **Prefer `class`/`extends`/`super()` syntax over manual `Object.create()` + `Object.setPrototypeOf()` prototypal
  patterns for new code — reserve object-literal `super` for maintaining or gradually migrating legacy code that already
  uses this style.** Class syntax makes the prototype relationship and `super` bindings explicit and less error-prone
  than wiring prototypes together manually.