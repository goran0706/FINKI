# The `new` Operator

`new` is what actually turns a class (or constructor function) into a concrete object instance. Understanding exactly
what `new` does mechanically explains several behaviors — required `new` on classes, `this` inside constructors, and why
forgetting `new` breaks in specific ways — that otherwise look like arbitrary rules.

## What `new` Actually Does, Step by Step

Calling `new ClassName(args)` performs four steps in order:

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const p = new Point(3, 4);
```

1. **A new, empty object is created.**
2. **The new object's internal prototype is linked to `ClassName.prototype`** — this is what makes `p instanceof Point`
   true and gives `p` access to methods defined on `Point.prototype`.
3. **The constructor function runs with `this` bound to the new object** — inside
   `constructor(x, y) { this.x = x; ... }`, `this` refers to the object created in step 1.
4. **The new object is returned automatically** — unless the constructor explicitly returns a different object (see
   below), in which case that object is used instead.

## Classes Require `new` — Calling Without It Throws

Unlike plain constructor functions (legacy pre-class pattern), a `class` constructor **cannot** be called without
`new` — this is a deliberate spec-level restriction, not just a convention.

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

Point(1, 2); // TypeError: Class constructor Point cannot be invoked without 'new'
```

This fixes a real historical footgun from pre-class constructor functions, where forgetting `new` silently bound `this`
to the global object (or `undefined` in strict mode) instead of throwing:

```javascript
function OldPoint(x, y) {
    this.x = x; // in non-strict mode without `new`, `this` is the global object
    this.y = y;
}

OldPoint(1, 2);       // no error — silently pollutes the global object with x and y
const p = new OldPoint(1, 2); // correct usage
```

Classes close this gap entirely: there is no silent-failure mode, only an immediate, clear error.

## `new.target`

`new.target` is a meta-property available inside any function or constructor that tells you whether it was invoked with
`new`, and if so, which constructor `new` was originally called on. Inside a class constructor called normally, it's
always truthy — but the pattern is genuinely useful in constructor functions and for detecting subclass construction.

```javascript
function Shape() {
    if (!new.target) {
        throw new Error("Shape must be called with new");
    }
}

new Shape();   // fine — new.target is Shape
Shape();       // throws — new.target is undefined
```

Inside a base class, `new.target` reflects the *actual* class `new` was called on — even when invoked via a subclass's
`super()` call — which makes it useful for detecting and blocking direct instantiation of an intended-abstract base
class:

```javascript
class AbstractShape {
    constructor() {
        if (new.target === AbstractShape) {
            throw new Error("AbstractShape cannot be instantiated directly");
        }
    }
}

class Circle extends AbstractShape {
}

new Circle();        // fine — new.target is Circle
new AbstractShape();  // throws — new.target is AbstractShape itself
```

## Constructors Returning a Different Object

If a constructor explicitly `return`s an object, `new` uses *that* object instead of the one it implicitly created — but
this override only applies to object return values; returning a primitive is silently ignored.

```javascript
class Wrapper {
    constructor(value) {
        this.value = value;
        return {overridden: true}; // this object is returned instead of `this`
    }
}

const w = new Wrapper(5);
console.log(w); // { overridden: true } — NOT a Wrapper instance
console.log(w instanceof Wrapper); // false
```

```javascript
class Point {
    constructor(x) {
        this.x = x;
        return 42; // primitive return value — silently ignored
    }
}

console.log(new Point(1)); // Point { x: 1 } — the primitive return had no effect
```

This override mechanism is rarely used deliberately in modern code (it's more relevant to certain legacy
constructor-function patterns, like implementing a singleton without a static factory method), but explains a category
of bug where a constructor's return value unexpectedly changes what `new` produces.

## `new` with Subclasses and `super()`

In a derived class, `this` does not exist until `super()` is called — the base class constructor is what actually
performs the object-creation step described above, and a derived constructor is just customizing an object the base
class already built.

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);      // must run first — this is what actually creates/initializes `this`
        this.breed = breed; // only valid after super() has run
    }
}

class BrokenDog extends Animal {
    constructor(name, breed) {
        this.breed = breed; // ReferenceError — `this` isn't available yet
        super(name);
    }
}
```

This is why `super()` must be called before any use of `this` in a derived constructor — mechanically, `this` simply
doesn't exist until the chain of `super()` calls reaches the base class and constructs the object.

## `instanceof` and the Prototype Link `new` Establishes

`instanceof` works by walking the prototype chain that `new` set up in step 2 above — it checks whether
`ClassName.prototype` appears anywhere in the object's prototype chain, not by checking some hidden "type tag."

```javascript
class Animal {
}

class Dog extends Animal {
}

const rex = new Dog();
console.log(rex instanceof Dog);    // true — Dog.prototype is directly linked
console.log(rex instanceof Animal); // true — Animal.prototype is further up the chain
console.log(rex instanceof Object); // true — every prototype chain ends at Object.prototype
```

Because this check is purely structural (walking a chain of prototype links), manually reassigning an object's prototype
after creation (`Object.setPrototypeOf()`) can make `instanceof` produce surprising results — another reason `new` is
the standard, optimized path for establishing this link, rather than constructing an object and wiring up its prototype
manually afterward.

## `Reflect.construct()` — Programmatic `new`

`Reflect.construct(target, argumentsList, newTarget)` performs the same operation as `new`, but as a function call —
useful for metaprogramming scenarios (dynamic instantiation from a variable class reference, custom factory frameworks)
where `new ClassName(...)` syntax isn't flexible enough.

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const p = Reflect.construct(Point, [3, 4]);
console.log(p); // Point { x: 3, y: 4 } — equivalent to `new Point(3, 4)`
```

The optional third argument lets you construct as if a *different* class had been targeted by `new` — this is how some
library internals implement patterns like "construct a `Point`, but make `new.target` appear to be `ColorPoint`" without
actually calling the `ColorPoint` constructor.

## Use Cases

* **Enforcing correct instantiation with `new.target`:** Use a `new.target` check inside a constructor function (not
  needed for `class`, which already enforces this) to guarantee `this` is never accidentally bound to the global object.
* **Preventing direct instantiation of an abstract base class:** Use `new.target === BaseClassName` inside a base
  constructor to throw when someone tries to instantiate the base class directly, while still permitting subclasses to
  construct normally.
* **Implementing a singleton without a separate static factory method:** Have the constructor check for and return an
  already-created instance directly, relying on the "constructor returning an object overrides the implicit instance"
  behavior — though a static factory method is usually the clearer, more discoverable choice for new code.
* **Dynamic instantiation from a runtime-determined class reference:** Use `Reflect.construct()` when the class to
  instantiate isn't known until runtime (e.g., a plugin system selecting a handler class by string key) and
  `new SomeVariable()` syntax doesn't fit the code's control flow.
* **Understanding and debugging `instanceof` failures:** Trace back to whether `new` was actually used to construct the
  object, and whether anything (a `Reflect.construct()` call with a mismatched `newTarget`, or manual
  `Object.setPrototypeOf()`) altered the expected prototype chain.

## Best Practices

* **Rely on `class` syntax's built-in `new`-only enforcement instead of manually writing `new.target` guards — reserve
  manual guards for legacy constructor functions you can't yet convert to a class.** Since ES6 classes already throw
  automatically when called without `new`, adding a redundant `new.target` check inside a class constructor adds no
  protection that isn't already there.
* **Never rely on a constructor's implicit return value if the constructor might someday explicitly `return` an object —
  check for this pattern specifically when debugging an "instance" that unexpectedly fails `instanceof` checks.** This
  override is a common, easy-to-miss cause of `new SomeClass() instanceof SomeClass` being unexpectedly `false`.
* **Always call `super()` before accessing `this` in a derived class constructor — this isn't a style preference, it's a
  hard requirement enforced by a `ReferenceError`.** If a derived constructor needs to do work before knowing what to
  pass to `super()`, do that computation in local variables first, then call `super()`, then use `this`.
* **Prefer a static factory method over relying on `new`'s "return a different object" override for singleton or caching
  patterns.** A method like `Database.getInstance()` communicates intent directly at the call site, whereas
  `new Database()` silently returning a cached instance behind the scenes is a surprising, easy-to-miss behavior for
  anyone reading calling code.
* **Use `Reflect.construct()` only when `new` syntax genuinely can't express what's needed (dynamic class selection,
  custom `newTarget`) — default to plain `new ClassName()` for all normal construction.** `Reflect.construct()` is a
  metaprogramming tool, not a stylistic alternative to `new`.
* **When a class hierarchy has a base class that should never be instantiated directly, enforce this with an explicit
  `new.target` check in the base constructor rather than relying on documentation or naming conventions (
  `AbstractShape`) alone.** Naming and comments communicate intent to readers but don't prevent a mistaken
  `new AbstractShape()` call at runtime the way an explicit check does.
* **Don't manually reassign an object's prototype after construction as a substitute for using the right class with
  `new` in the first place.** `Object.setPrototypeOf()` after the fact works, but it deoptimizes the object's hidden
  class in most engines and produces a prototype chain that's easy to get subtly wrong compared to letting `new`
  establish it correctly at creation time.