# Class Inheritance

Inheritance lets one class (a **subclass** or **derived class**) build on another (a **superclass** or **base class**),
reusing its behavior and extending or overriding parts of it. In JavaScript, `extends` and `super` are syntax sugar over
the underlying prototype chain — but understanding both the syntax and what it compiles down to explains behavior that
otherwise looks inconsistent.

## `extends` — Establishing the Relationship

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
    speak() {
        return `${this.name} barks.`;
    }
}

const rex = new Dog("Rex");
console.log(rex.speak());        // "Rex barks." — Dog's override wins
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true — the chain includes the base class
```

`extends` does two things: it links `Dog.prototype`'s internal prototype to `Animal.prototype` (so instance method
lookup falls through to the base class), and it links `Dog` itself to `Animal` (so static members are inherited too).

## `super()` — Calling the Parent Constructor

A derived class with its own `constructor` **must** call `super()` before touching `this` — this isn't a style rule,
it's a hard `ReferenceError` otherwise, because `this` doesn't exist until the base class constructor creates it.

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);       // must run first
        this.breed = breed; // only valid after super()
    }
}

const rex = new Dog("Rex", "Labrador");
console.log(rex.name, rex.breed); // "Rex" "Labrador"
```

If a derived class defines **no constructor at all**, JavaScript implicitly provides one that simply forwards all
arguments to `super()` — this is why a subclass with no need for extra initialization logic can omit the constructor
entirely:

```javascript
class Cat extends Animal {
    // no constructor written — behaves as if:
    // constructor(...args) { super(...args); }
}

const cat = new Cat("Whiskers");
console.log(cat.name); // "Whiskers" — the implicit constructor forwarded it
```

## `super.method()` — Calling an Overridden Parent Method

Inside an overriding method, `super.method()` calls the parent's version of that method — used to **extend** inherited
behavior rather than fully replace it.

```javascript
class Animal {
    speak() {
        return `${this.name} makes a sound.`;
    }
}

class Dog extends Animal {
    speak() {
        return `${super.speak()} Specifically, it barks.`;
    }
}

console.log(new Dog().speak());
```

`super` in a method is resolved based on where the method is **defined**, not on the actual object it's called on — this
distinction matters in multi-level hierarchies, where `super` inside `Dog.prototype.speak` always means "look up from
`Dog.prototype`," even if the method is ultimately invoked on a further subclass instance.

## Overriding vs Extending Methods

| Approach                                                   | Effect                                      |
|:-----------------------------------------------------------|:--------------------------------------------|
| Define a method with the same name, no `super` call        | Fully replaces the parent's behavior        |
| Define a method with the same name, calls `super.method()` | Extends the parent's behavior, adding to it |
| Don't define the method at all                             | Parent's method is inherited and used as-is |

## Multi-Level Inheritance Chains

Classes can extend classes that themselves extend other classes — method and property lookup walks up the entire chain
until a match is found.

```javascript
class LivingThing {
    describe() {
        return "A living thing.";
    }
}

class Animal extends LivingThing {
    describe() {
        return `${super.describe()} Specifically, an animal.`;
    }
}

class Dog extends Animal {
    describe() {
        return `${super.describe()} Specifically, a dog.`;
    }
}

console.log(new Dog().describe());
// "A living thing. Specifically, an animal. Specifically, a dog."
```

Each `super.describe()` call resolves exactly one level up from where it's *written*, not from the bottom of the chain —
this is what allows each layer to build on the one directly above it without needing to know about the full chain's
depth.

## Overriding Static Members

Static methods and fields are inherited the same way instance members are, and can be overridden identically, including
with `super` inside a static method:

```javascript
class Shape {
    static describe() {
        return "A shape.";
    }
}

class Circle extends Shape {
    static describe() {
        return `${super.describe()} Specifically, a circle.`;
    }
}

console.log(Circle.describe());
```

## `instanceof` Across the Chain

`instanceof` returns `true` for **every** class in the chain above the instance's actual class — not just the most
specific one.

```javascript
class LivingThing {
}

class Animal extends LivingThing {
}

class Dog extends Animal {
}

const rex = new Dog();
console.log(rex instanceof Dog);         // true
console.log(rex instanceof Animal);      // true
console.log(rex instanceof LivingThing); // true
console.log(rex instanceof Object);      // true — every chain ends here
```

## Field Initialization Order in Subclasses

Instance field initializers run **after** `super()` completes but **before** the rest of the subclass constructor body —
this ordering matters when a subclass field's initializer depends on something the base constructor sets up.

```javascript
class Base {
    constructor() {
        this.baseValue = 10;
    }
}

class Derived extends Base {
    derivedValue = this.baseValue * 2; // runs right after super(), before constructor body below
    constructor() {
        super();
        console.log(this.derivedValue); // 20 — baseValue was already set when derivedValue initialized
    }
}
```

## Private Fields and Inheritance

Private fields declared with `#` are **not inherited** — a subclass cannot access a parent's private field, even through
`super`, and declaring a same-named private field in the subclass creates a completely separate, unrelated private name.
Only the parent's public/protected-by-convention methods provide access across the boundary.

```javascript
class Animal {
    #sound = "...";

    makeSound() {
        return this.#sound;
    } // public method exposes controlled access
}

class Dog extends Animal {
    describe() {
        return this.makeSound(); // OK — goes through the public method
        // return this.#sound;   // SyntaxError — Dog has no access to Animal's #sound
    }
}
```

## Abstract Base Class Pattern

JavaScript has no native `abstract` keyword, but the pattern is commonly implemented using `new.target` to block direct
instantiation of a base class meant only to be extended.

```javascript
class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new Error("Shape is abstract and cannot be instantiated directly");
        }
    }

    area() {
        throw new Error("area() must be implemented by a subclass");
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    area() {
        return Math.PI * this.radius ** 2;
    }
}

new Shape();          // throws — abstract base class
new Circle(5).area(); // works — subclass provides area()
```

## Composition as an Alternative to Deep Inheritance

Deep inheritance chains (four or five levels) tend to become fragile — a change to a base class can ripple unpredictably
through every subclass. **Composition** — building behavior by combining smaller, focused objects or functions rather
than layering subclasses — is frequently the better fit when behaviors don't form a strict, natural "is-a" hierarchy.

```javascript
// Inheritance forces a hierarchy even when behaviors are really independent capabilities
class FlyingSwimmingAnimal extends Animal { /* awkward if not every animal does both */
}

// Composition combines independent behaviors without forcing a hierarchy
const canFly = (Base) => class extends Base {
    fly() {
        return "flying";
    }
};
const canSwim = (Base) => class extends Base {
    swim() {
        return "swimming";
    }
};

class Duck extends canSwim(canFly(Animal)) {
}
```

## Use Cases

* **Modeling genuine "is-a" relationships:** Use `extends` when a subclass is truly a more specific version of its
  parent and should be usable anywhere the parent is expected (a `Dog` genuinely is an `Animal`) — this is the core case
  inheritance is designed for.
* **Extending, not replacing, inherited behavior:** Use `super.method()` when an override needs to add to the parent's
  logic (logging, validation, additional side effects) rather than discard it entirely.
* **Sharing constructor logic across related classes:** Use `super(...)` to centralize common initialization (setting a
  name, validating shared required fields) in a base class, so every subclass gets it for free without duplicating the
  logic.
* **Enforcing a contract on subclasses:** Use an abstract-base-class pattern (`new.target` check plus methods that throw
  if not overridden) when a family of subclasses must each implement certain methods, and instantiating the base
  directly would be a mistake.
* **Polymorphic method dispatch:** Rely on method overriding when different subclasses need different behavior behind
  the same method name, so calling code can treat a collection of mixed subclass instances uniformly
  (`shapes.forEach(s => s.area())`) without checking each one's specific type.
* **Reaching for composition instead of inheritance when relationships aren't a strict hierarchy:** Use composition
  (mixins, injected dependencies, or plain object composition) when the behaviors involved don't cleanly fit an "is-a"
  tree — e.g., "can fly" and "can swim" as independent, combinable capabilities rather than forced subclassing.

## Best Practices

* **Only reach for `extends` when the relationship is genuinely "is-a," not merely "has some similar code."** Inheriting
  purely to reuse a few methods, when the classes aren't conceptually the same kind of thing, produces a hierarchy that
  misleads readers and tends to require awkward overrides later as the classes diverge.
* **Always call `super()` before referencing `this` in a derived constructor — and call it as early as reasonably
  possible, even when not strictly required until the first `this` use.** This keeps constructors readable and avoids
  the ReferenceError entirely, rather than relying on careful ordering of unrelated statements before the `this`
  -touching one.
* **Prefer `super.method()` over duplicating the parent's logic when extending behavior.** Copy-pasting a parent
  method's contents into an override and then modifying it creates two sources of truth that will drift apart over time;
  calling `super.method()` keeps the parent's logic as the single source of truth.
* **Keep inheritance chains shallow — two or three levels at most — and switch to composition once a hierarchy starts
  requiring awkward overrides just to opt out of inherited behavior.** A subclass that has to override a method just to
  make it a no-op is usually a sign the "is-a" relationship doesn't actually hold for every case in the hierarchy.
* **Never expose a parent's private (`#`) state directly to subclasses — provide protected-by-convention or public
  accessor methods instead.** Since private fields are genuinely inaccessible across the inheritance boundary (not just
  discouraged), design the base class's public/internal API deliberately for what subclasses actually need, rather than
  assuming they'll find a workaround.
* **Enforce abstract-base-class contracts explicitly (`new.target` checks, methods that throw by default) rather than
  relying on naming conventions or documentation alone.** A class named `AbstractShape` with a comment saying "don't
  instantiate directly" doesn't stop `new AbstractShape()` from succeeding at runtime; an explicit check does.
* **Don't let field initializer order surprises catch you off guard — remember subclass field initializers run right
  after `super()`, not before, and not at the very end of the constructor.** A subclass field that depends on state the
  base constructor sets up will work correctly because of this ordering, but relying on the opposite assumption (fields
  initialize before `super()`) will produce `undefined` values or a `ReferenceError`.
* **Reach for composition (mixins, dependency injection, or plain object composition) once inheritance stops modeling a
  clean hierarchy — don't force an awkward subclass relationship just to reuse code.** Multiple independent, combinable
  capabilities (flying, swimming, logging) are usually better expressed as mixins or injected behaviors than as a rigid
  inheritance tree that can't represent every valid combination.