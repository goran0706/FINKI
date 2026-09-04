# Class Design Patterns

Design patterns are reusable solutions to recurring structural problems — not JavaScript-specific, but this document
shows how each is idiomatically implemented using the class mechanics.

## Singleton

Ensures a class has exactly one instance, accessible through a single, well-known access point — implemented using a
private static field to hold the instance and a static method (or getter) to retrieve it.

```javascript
class Database {
    static #instance;
    #connection;

    constructor() {
        if (Database.#instance) {
            throw new Error("Use Database.getInstance() instead of new Database()");
        }
        this.#connection = "connected";
    }

    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
        }
        return Database.#instance;
    }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true — same instance every time
```

The constructor throw prevents `new Database()` from being used directly, forcing all access through `getInstance()` —
without it, nothing stops a caller from bypassing the singleton guarantee entirely.

## Factory

Encapsulates object creation logic, especially when the concrete type returned needs to vary based on input —
implemented as a static method (or standalone function) that returns different subclass instances behind one interface.

```javascript
class TextNotification {
    send(msg) {
        return `Text: ${msg}`;
    }
}

class EmailNotification {
    send(msg) {
        return `Email: ${msg}`;
    }
}

class NotificationFactory {
    static create(type) {
        switch (type) {
            case "text":
                return new TextNotification();
            case "email":
                return new EmailNotification();
            default:
                throw new Error(`Unknown notification type: ${type}`);
        }
    }
}

const notifier = NotificationFactory.create("email");
console.log(notifier.send("Hello")); // "Email: Hello"
```

Calling code never needs to know which concrete class it received — only that it implements `.send()`.

## Builder

Separates complex object construction into a sequence of clear, chainable steps, useful when a constructor would
otherwise need many optional parameters — implemented by returning `this` from each setter-style method to allow
chaining.

```javascript
class RequestBuilder {
    #url;
    #method = "GET";
    #headers = {};
    #body;

    setUrl(url) {
        this.#url = url;
        return this;
    }

    setMethod(method) {
        this.#method = method;
        return this;
    }

    addHeader(key, value) {
        this.#headers[key] = value;
        return this;
    }

    setBody(body) {
        this.#body = body;
        return this;
    }

    build() {
        if (!this.#url) throw new Error("URL is required");
        return {url: this.#url, method: this.#method, headers: this.#headers, body: this.#body};
    }
}

const request = new RequestBuilder()
    .setUrl("/api/users")
    .setMethod("POST")
    .addHeader("Content-Type", "application/json")
    .setBody({name: "Alex"})
    .build();
```

The `.build()` step is what actually produces the final object, letting the builder validate required fields before
construction completes — something a constructor with many optional parameters can't easily do as cleanly.

## Observer

Lets objects (**observers**) subscribe to notifications from another object (the **subject**) without the subject
needing to know anything concrete about its observers — the basis of most event-emitter and pub/sub systems.

```javascript
class EventEmitter {
    #listeners = new Map();

    on(event, callback) {
        if (!this.#listeners.has(event)) this.#listeners.set(event, []);
        this.#listeners.get(event).push(callback);
        return this;
    }

    emit(event, ...args) {
        (this.#listeners.get(event) ?? []).forEach((callback) => callback(...args));
    }
}

const emitter = new EventEmitter();
emitter.on("userCreated", (user) => console.log(`Welcome, ${user.name}!`));
emitter.emit("userCreated", {name: "Alex"}); // "Welcome, Alex!"
```

The private `#listeners` field ensures subscribers can only interact through `.on()`/`.emit()`, never by directly
manipulating the internal listener storage.

## Strategy

Lets an algorithm be selected and swapped at runtime by injecting a behavior object rather than hardcoding it inside the
class using it — implemented via composition, not inheritance, which keeps each strategy independently interchangeable.

```javascript
class FlatRateShipping {
    calculate(weight) {
        return 5.0;
    }
}

class WeightBasedShipping {
    calculate(weight) {
        return weight * 0.5;
    }
}

class Order {
    #shippingStrategy;

    constructor(shippingStrategy) {
        this.#shippingStrategy = shippingStrategy;
    }

    getShippingCost(weight) {
        return this.#shippingStrategy.calculate(weight);
    }
}

const order = new Order(new WeightBasedShipping());
console.log(order.getShippingCost(10)); // 5
```

Switching shipping logic means passing a different strategy object into `Order` — no subclassing or modification of
`Order` itself is required, which is the core benefit over solving the same problem with inheritance.

## Decorator

Adds behavior to an individual object dynamically, without modifying its class or affecting other instances —
implemented by wrapping an object of the same interface and delegating to it, adding extra behavior around the delegated
calls.

```javascript
class Coffee {
    cost() {
        return 2;
    }

    describe() {
        return "Coffee";
    }
}

class MilkDecorator {
    #coffee;

    constructor(coffee) {
        this.#coffee = coffee;
    }

    cost() {
        return this.#coffee.cost() + 0.5;
    }

    describe() {
        return `${this.#coffee.describe()} + Milk`;
    }
}

class SugarDecorator {
    #coffee;

    constructor(coffee) {
        this.#coffee = coffee;
    }

    cost() {
        return this.#coffee.cost() + 0.25;
    }

    describe() {
        return `${this.#coffee.describe()} + Sugar`;
    }
}

let order = new Coffee();
order = new MilkDecorator(order);
order = new SugarDecorator(order);

console.log(order.describe(), order.cost()); // "Coffee + Milk + Sugar" 2.75
```

Each decorator only needs to implement the same interface (`cost()`, `describe()`) and delegate to the wrapped object —
decorators can be composed in any combination without a combinatorial explosion of subclasses (`CoffeeWithMilkAndSugar`,
`CoffeeWithSugarOnly`, etc.).

## Adapter

Converts one interface into another that calling code expects, typically used to make an incompatible third-party or
legacy API fit an interface your code already relies on.

```javascript
// A third-party library with an interface you don't control
class LegacyLogger {
    writeLog(text) {
        console.log(`[legacy] ${text}`);
    }
}

// The interface your application actually expects
class LoggerAdapter {
    #legacyLogger;

    constructor(legacyLogger) {
        this.#legacyLogger = legacyLogger;
    }

    log(message) {
        this.#legacyLogger.writeLog(message);
    } // translates the call
}

const logger = new LoggerAdapter(new LegacyLogger());
logger.log("Application started"); // "[legacy] Application started"
```

The adapter is the only place that knows about `LegacyLogger`'s actual method names — the rest of the application only
ever calls `.log()`, so swapping the underlying library later means changing the adapter, not every call site.

## Mixins — Composition Instead of Inheritance

JavaScript has no native multiple inheritance, but mixins simulate shared behavior across otherwise-unrelated classes
using functions that take a base class and return an extended one, expanded here as a first-class pattern.

```javascript
const Serializable = (Base) => class extends Base {
    toJSON() {
        return JSON.stringify(this);
    }
};

const Comparable = (Base) => class extends Base {
    equals(other) {
        return JSON.stringify(this) === JSON.stringify(other);
    }
};

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class SerializablePoint extends Serializable(Comparable(Point)) {
}

const p = new SerializablePoint(1, 2);
console.log(p.toJSON());                            // '{"x":1,"y":2}'
console.log(p.equals(new SerializablePoint(1, 2))); // true
```

Each mixin function is independently reusable across any base class, and multiple mixins compose by nesting calls —
`Serializable(Comparable(Point))` — rather than requiring a language feature for multiple inheritance.

## Choosing Between Patterns

| Problem                                                                      | Pattern   |
|:-----------------------------------------------------------------------------|:----------|
| Exactly one instance must ever exist                                         | Singleton |
| The concrete type to construct depends on runtime input                      | Factory   |
| An object needs many optional configuration steps before construction        | Builder   |
| Multiple parts of a system need to react to something happening elsewhere    | Observer  |
| An algorithm needs to be swappable at runtime without subclassing            | Strategy  |
| Behavior needs to be added to specific objects, not the whole class          | Decorator |
| An existing interface doesn't match what your code expects                   | Adapter   |
| Shared behavior is needed across classes with no natural "is-a" relationship | Mixin     |

## Use Cases

* **Singleton for shared, expensive-to-create resources:** A single database connection pool, a global configuration
  object, or a shared cache — situations where multiple instances would be wasteful or would cause inconsistent state.
* **Factory for polymorphic construction driven by external data:** Parsing a config file or API response into different
  concrete class instances based on a `type` field, without scattering `if`/`switch` logic for type selection across the
  codebase.
* **Builder for objects with many optional fields or required validation before construction:** HTTP request
  construction, complex query builders, or UI component configuration where a constructor with ten optional parameters
  would be unreadable.
* **Observer for decoupled event-driven architecture:** UI event handling, application-wide notification systems, or any
  scenario where the number and identity of interested parties can change over time and shouldn't be hardcoded into the
  source of the events.
* **Strategy for runtime-swappable algorithms:** Payment processing methods, sorting/comparison logic, or validation
  rules that need to vary by configuration or user choice without touching the class that uses them.
* **Decorator for optional, combinable behavior on specific objects:** Feature flags applied to individual objects,
  request/response middleware-style wrapping, or UI component enhancement where not every instance needs every behavior.
* **Adapter for integrating third-party or legacy code:** Wrapping an external library, a legacy internal module, or a
  different version of your own API so the rest of the codebase can depend on one stable interface.
* **Mixins for cross-cutting capabilities that don't fit a single inheritance tree:** Serialization, comparison,
  event-emitting capability, or logging — behaviors that many unrelated classes might need without forcing them into an
  artificial shared base class.

## Best Practices

* **Reach for a pattern because it solves a specific structural problem you actually have — not because it's a
  recognizable name.** Applying Singleton, Factory, or Decorator preemptively, before the corresponding problem exists,
  usually adds indirection without benefit; the patterns above are tools for specific symptoms, not a checklist to apply
  to every class.
* **Treat Singleton as a last resort, not a default — it introduces hidden global state and makes testing harder.** A
  single shared instance is difficult to reset between tests and creates an implicit dependency that isn't visible in a
  class's constructor signature; dependency injection (passing the shared instance in explicitly) is often preferable
  even when there's genuinely only one instance in production.
* **Keep Factory methods focused on construction logic only — don't let them accumulate unrelated business logic over
  time.** A factory's job is choosing and constructing the right concrete type; once it starts making decisions
  unrelated to construction, that logic likely belongs elsewhere.
* **Validate required state inside a Builder's `.build()` step, not scattered across individual setter methods.**
  Centralizing validation at the final build step means partially-configured builders can be passed around safely before
  all required fields are set, with the actual correctness check happening exactly once, at the end.
* **Unsubscribe Observer listeners explicitly when they're no longer needed — an Observer pattern without cleanup is a
  common memory leak source.** Provide a corresponding `.off()`/`.removeListener()` method alongside `.on()`, and ensure
  long-lived subjects don't accumulate references to observers that should have been garbage collected.
* **Favor Strategy (composition) over creating a new subclass for every algorithm variant.** A `WeightBasedShipping` vs
  `FlatRateShipping` distinction handled via Strategy avoids the subclass explosion (`OrderWithFlatShipping`,
  `OrderWithWeightShipping`, ...) that inheritance-based variation tends to produce as more variants are added.
* **Keep each Decorator focused on a single added responsibility, and ensure every decorator implements the exact same
  interface as the object it wraps.** A decorator that adds multiple unrelated behaviors at once defeats the pattern's
  main benefit — composability — since it can no longer be mixed and matched independently with other decorators.
* **Isolate all knowledge of a wrapped library's actual interface inside its Adapter — never let calling code reach
  through the adapter to the wrapped object directly.** If callers bypass the adapter to call the legacy interface
  directly in some places, replacing that dependency later requires hunting down every bypass instead of changing the
  adapter alone.
* **Keep mixins small, focused, and side-effect-free at definition time — each mixin should add one clearly-named
  capability, not several unrelated ones.** A `Serializable` mixin that also silently changes an unrelated method's
  behavior makes composition unpredictable; the value of mixins comes from being able to combine small, independent
  capabilities freely.
* **Document which design pattern a class implements when it isn't obvious from its name or shape — a two-line
  comment ("Singleton — use getInstance ()") saves future readers from rediscovering the constraint the hard way.** Some
  patterns (especially Singleton's `new`-blocking constructor) look like arbitrary restrictions unless the reader
  recognizes the pattern being used.
