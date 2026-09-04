# Static Members

A static member belongs to the **class itself**, not to any instance created from it. Static fields, methods, getters,
and setters are declared with the `static` keyword and are accessed through the class name directly — never through
`this` on an instance.

```javascript
class Counter {
    static instances = 0;

    constructor() {
        Counter.instances++;
    }
}

new Counter();
new Counter();

console.log(Counter.instances); // 2
console.log(new Counter().instances); // undefined — not available on an instance
```

| Member Kind                 | Syntax                        |
|:----------------------------|:------------------------------|
| Static field                | `static name = value`         |
| Static method               | `static method() {}`          |
| Static getter               | `static get name() {}`        |
| Static setter               | `static set name(value) {}`   |
| Static initialization block | `static { /* setup code */ }` |

## Static Fields

A static field is shared by the class as a whole — there is exactly one copy, regardless of how many instances exist.

```javascript
class AppConfig {
    static environment = "production";
    static version = "1.0.0";
}

console.log(AppConfig.environment); // "production"
AppConfig.environment = "staging";
console.log(AppConfig.environment); // "staging" — one shared value
```

Compare this to an instance field, where every object gets its own independent copy:

```javascript
class Widget {
    id = Math.random(); // instance field — different per instance
    static count = 0;   // static field — shared by the class
}
```

## Static Methods

A static method is called directly on the class and cannot be called on an instance. Static methods commonly implement
factory functions, utility/helper logic, or operations that act on the class as a whole rather than on a single
instance's state.

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static origin() {
        return new Point(0, 0);
    }

    static distance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }
}

const p = Point.origin();
console.log(Point.distance(p, new Point(3, 4))); // 5

p.distance; // undefined — static methods are not available on instances
```

## Static Getters and Setters

Static accessors work exactly like instance accessors, except they operate on the class rather than an instance.

```javascript
class Configuration {
    static #environment = "development";

    static get environment() {
        return Configuration.#environment;
    }

    static set environment(value) {
        if (!["development", "production"].includes(value)) {
            throw new Error("Invalid environment");
        }
        Configuration.#environment = value;
    }
}

Configuration.environment = "production";
console.log(Configuration.environment); // "production"
```

## Static Initialization Blocks

A `static {}` block runs once, when the class is first evaluated, and is used for setup logic too complex for a single
field initializer expression — including multi-statement logic or logic that needs a `try/catch`.

```javascript
class Database {
    static #connection;

    static {
        try {
            Database.#connection = connectToDatabase(process.env.DB_URL);
        } catch {
            Database.#connection = null;
        }
    }

    static isConnected() {
        return Database.#connection !== null;
    }
}
```

Multiple static blocks are allowed and run in the order they're written, interleaved with static field initializers in
source order — this matters when one static block depends on a field declared above it.

## `this` Inside Static Members

Inside a static method, getter, or setter, `this` refers to the class itself, not an instance — this is what allows
static members to reference other static members without hardcoding the class name, which matters for correct behavior
under inheritance (see below).

```javascript
class Shape {
    static describe() {
        return `I am ${this.name}`; // `this` is the class, `this.name` is the class's own name
    }
}

console.log(Shape.describe()); // "I am Shape"
```

## Static Members and Inheritance

Static members **are** inherited by subclasses, unlike private instance members — a subclass can call an inherited
static method directly on itself.

```javascript
class Animal {
    static kingdom = "Animalia";

    static describe() {
        return `${this.name} belongs to ${this.kingdom}`;
    }
}

class Dog extends Animal {
}

console.log(Dog.kingdom);     // "Animalia" — inherited
console.log(Dog.describe());  // "Dog belongs to Animalia" — `this` inside describe() is Dog, not Animal
```

Because `this` inside a static method resolves to whichever class it's actually called on, a subclass calling an
inherited static method sees `this.name` as its own name — this dynamic binding is what allows a single static factory
method defined on a base class to correctly construct the right subclass.

## `super` in Static Context

`super` refers to the parent class itself inside a static method, letting a subclass extend rather than fully replace
inherited static behavior.

```javascript
class Base {
    static describe() {
        return "Base description";
    }
}

class Derived extends Base {
    static describe() {
        return `${super.describe()} + Derived extras`;
    }
}

console.log(Derived.describe()); // "Base description + Derived extras"
```

## Static Members Are Not Accessible via Instances

Static members exist only on the class/constructor function, never on instances or `Object.prototype`-based lookup from
an instance.

```javascript
class Logger {
    static level = "info";

    log(msg) {
        console.log(msg);
    }
}

const logger = new Logger();
console.log(logger.level);      // undefined — static, not reachable from an instance
console.log(Logger.level);      // "info" — reachable only via the class
```

## Static Private Members

Static fields and methods can also be private, combining class-level scope with true encapsulation:

```javascript
class IdGenerator {
    static #nextId = 1;

    static next() {
        return IdGenerator.#nextId++;
    }
}

console.log(IdGenerator.next()); // 1
console.log(IdGenerator.next()); // 2
IdGenerator.#nextId;              // SyntaxError — private, even at the static level
```

## Use Cases

* **Instance counting and registries:** Use a static field to track how many instances exist, or maintain a static `Map`
  /array registry of all created instances, when the class itself needs to reason about its own population.
* **Factory methods:** Use static methods to provide named, expressive construction alternatives to the constructor —
  `Point.origin()`, `User.fromJSON(data)`, `Money.zero()` — especially when there are multiple valid ways to construct
  an instance and a single constructor signature can't express them all clearly.
* **Utility/helper operations scoped to the class's domain:** Use static methods for operations that logically belong
  with a class but don't need any particular instance's state — `Point.distance(a, b)`,
  `MathUtils.clamp(value, min, max)`.
* **Shared configuration or constants:** Use static fields for values that are the same across every instance and
  conceptually belong to the class as a type, not to any one object — a default configuration, a version string, a set
  of valid enum-like values.
* **One-time setup requiring multi-step logic:** Use a `static {}` initialization block when setting up static state
  requires more than a single expression — reading environment variables, wrapping setup in `try/catch`, or populating a
  static `Map` from an external source at class-definition time.
* **Singleton-style patterns:** Combine a private static field holding the single instance with a static factory method
  (`static getInstance()`) that creates it on first call and returns the same instance on every subsequent call.
* **Base-class factory methods that construct the correct subclass:** Rely on dynamic `this` binding inside a static
  method on a base class so that calling the inherited method on a subclass produces an instance of that subclass, not
  the base class.

## Best Practices

* **Use static members for anything that conceptually belongs to the class as a whole, not to individual instances — if
  a value or operation doesn't need `this` referring to a specific object's data, it likely shouldn't be an instance
  member.** A `distance()` calculation between two points doesn't belong to either point individually; a version string
  doesn't vary per instance. Putting these on instances instead just duplicates the same value or logic needlessly on
  every object.
* **Use `this` rather than the hardcoded class name inside static methods when subclassing is expected.** `this.name`
  inside a static method resolves to whichever class actually called it — hardcoding the base class's name defeats
  inheritance and produces incorrect results when a subclass calls the inherited static method.
* **Reach for a `static {}` block only when a field initializer expression genuinely isn't enough — plain field
  initializers are simpler and should be the default.** `static count = 0;` needs no block; reserve `static {}` for
  setup requiring multiple statements, error handling, or reading from multiple sources.
* **Keep static state minimal and be deliberate about mutable static fields — they're effectively global state scoped to
  the class.** A mutable static field shared across the entire application (not per-request, per-test, or per-instance)
  can cause subtle cross-contamination bugs, especially in tests that don't reset it between runs; prefer instance state
  unless the value genuinely must be shared class-wide.
* **Combine static and private (`static #field`) when class-level state should also be inaccessible from outside — don't
  assume `static` alone provides any encapsulation.** A plain `static` field is just as publicly writable as before; if
  the goal is "shared, but only mutable through validated methods," it needs both `static` and `#`.
* **Use `super.staticMethod()` to extend, not fully replace, inherited static behavior when a subclass needs to add to a
  base class's static logic.** This mirrors the same instance-method pattern (`super.method()`) and avoids duplicating
  the base class's logic inside the subclass's override.
* **Don't expect static members to appear on instances, and don't reach for `this.staticField` inside a normal (
  non-static) instance method — it won't resolve there.** Static members live only on the class/constructor; an instance
  method needing a static value must reference it via the class name (or `this.constructor.staticField`, which resolves
  dynamically for subclasses, similar to how `this` behaves inside static methods).