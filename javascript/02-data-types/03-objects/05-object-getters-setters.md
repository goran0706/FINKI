# Getters and Setters

## Getter and Setter Concept

Getters and setters are specialized object methods that control how properties are read and modified. Unlike normal data
properties that hold static values directly, getters and setters allow property access and assignment to execute custom
logic behind standard property access syntax, providing a controlled interface between an object and its internal data.

## Accessor Properties

An accessor property is a property defined through getter and setter functions instead of directly storing a value in
memory. JavaScript objects categorize properties into two main types based on whether they store data directly or invoke
functions upon access.

| Property Type       | Behavior                            |
|:--------------------|:------------------------------------|
| `Data property`     | Stores a value directly             |
| `Accessor property` | Uses functions to get or set values |

## Data Properties vs Accessor Properties

Accessor properties provide fine-grained control over property access without changing the interface used to read or
modify object attributes.

| Feature         | Data Property | Accessor Property |
|:----------------|:--------------|:------------------|
| Stores value    | Yes           | No                |
| Uses getter     | No            | Yes               |
| Uses setter     | No            | Yes               |
| Controls access | Limited       | Yes               |

## Defining Getters and Setters

The most common way to define accessors is directly inside an object literal or class body, using the `get`/`set`
keywords — `Object.defineProperty()` is the lower-level mechanism underneath, used when descriptor flags (`enumerable`,
`configurable`) need explicit control.

```javascript
// Object literal syntax
const temperature = {
    _celsius: 0,
    get fahrenheit() {
        return this._celsius * 9 / 5 + 32;
    },
    set fahrenheit(value) {
        this._celsius = (value - 32) * 5 / 9;
    },
};

temperature.fahrenheit = 100;
console.log(temperature._celsius); // 37.77...

// Class syntax
class Temperature {
    #celsius = 0;

    get fahrenheit() {
        return this.#celsius * 9 / 5 + 32;
    }

    set fahrenheit(value) {
        this.#celsius = (value - 32) * 5 / 9;
    }
}
```

A property defined with **only a getter** is effectively read-only — assigning to it fails silently (non-strict mode) or
throws (strict mode), since there's no setter to handle the write. A property with **only a setter** is effectively
write-only — reading it always returns `undefined`.

One difference worth knowing between the two syntaxes: object-literal accessors are defined as **own properties** on
that specific object, while class accessors are defined once on the **class prototype** and shared across every
instance — closer in memory behavior to a method than to a per-instance field.

## Getters

A getter is a function that runs automatically when a property is read. It allows an object to expose dynamically
calculated or controlled values through standard property read syntax, behaving externally like a property while
internally executing function logic.

| Feature            | Behavior |
|:-------------------|:---------|
| Executes on read   | Yes      |
| Receives arguments | No       |
| Returns value      | Yes      |

## Getter Use Cases

Getters allow objects to expose calculated attributes cleanly without exposing internal data structures. Common use
cases include:

* **Calculated properties:** Computing values on the fly based on current object state.
* **Formatting returned data:** Formatting internal raw values, such as currency or date strings, upon reading.
* **Controlling access to internal values:** Exposing internal data cleanly while hiding private representation details.
* **Creating derived properties:** Generating composite values derived from multiple internal properties.

## Setters

A setter is a function that runs automatically when a property is assigned a new value. Setters allow objects to
intercept property modifications, giving them the ability to validate, transform, or restrict incoming values before
updating internal state.

| Feature                | Behavior |
|:-----------------------|:---------|
| Executes on assignment | Yes      |
| Receives one value     | Yes      |
| Controls updates       | Yes      |

## Setter Use Cases

Setters provide a mechanism for maintaining invalidation bounds and executing side effects upon value assignment. Common
use cases include:

* **Validating input:** Rejecting invalid or incorrectly typed values before state mutations occur.
* **Formatting stored values:** Normalizing incoming values, such as trimming string whitespace, before saving.
* **Protecting object state:** Restricting modification rights to safeguard object invariants.
* **Triggering additional updates:** Invoking side effects, such as UI re-renders or event emissions, when state
  changes.

## The Infinite Recursion Trap

A getter or setter that references its own property name — rather than a separate backing field — recurses infinitely,
since reading or writing the property re-triggers the very accessor that's running:

```javascript
const broken = {
    _value: 10,
    get value() {
        return this.value; // ❌ calls itself — RangeError: Maximum call stack size exceeded
    },
    set value(v) {
        this.value = v;    // ❌ same trap in reverse
    },
};
```

The fix is always the same: the getter/setter must read from and write to a **differently-named backing field**
(`_value`, `#value`, or a value stored in a closure) — never the accessor's own name:

```javascript
const fixed = {
    _value: 10,
    get value() {
        return this._value; // ✅ reads the backing field, not itself
    },
    set value(v) {
        this._value = v;    // ✅ writes the backing field, not itself
    },
};
```

## Getter and Setter Relationship

Getters and setters are frequently paired to establish a complete interface around hidden object properties. While a
getter controls how values are retrieved, a setter dictates how values are updated.

| Component | Responsibility   |
|:----------|:-----------------|
| `Getter`  | Controls reading |
| `Setter`  | Controls writing |

## Accessor Properties with Object.defineProperty ()

`Object.defineProperty()` is a static method used to define or modify object properties with granular configuration
control. It allows developers to attach accessor properties using explicit `get` and `set` functions alongside property
descriptors — this is the syntax to reach for specifically when `enumerable` or `configurable` needs to be set to
something other than its default.

## Property Descriptors and Accessors

Accessor properties utilize different descriptor keys than traditional data properties. A single property descriptor
cannot combine data property attributes with accessor functions.

| Property Type       | Supported Descriptors                             |
|:--------------------|:--------------------------------------------------|
| `Data property`     | `value`, `writable`, `enumerable`, `configurable` |
| `Accessor property` | `get`, `set`, `enumerable`, `configurable`        |

Accessors defined via object-literal or class `get`/`set` syntax default to `enumerable: true` and `configurable: true`,
so they appear in `Object.keys()`, `for...in`, and `JSON.stringify()` output (the *getter's return value* is what gets
serialized) just like ordinary data properties — accessors defined through `Object.defineProperty()` default to
`enumerable: false` unless explicitly set otherwise.

## Getters and Setters vs Methods

While getters, setters, and traditional methods all execute functions internally, they serve different operational and
syntactic purposes in API design.

| Feature                      | Getter/Setter   | Method               |
|:-----------------------------|:----------------|:---------------------|
| Access syntax                | Property syntax | Function call syntax |
| Performs actions             | Yes             | Yes                  |
| Represents property behavior | Yes             | No                   |
| Accepts parameters           | Setter only     | Yes                  |

## Encapsulation

Getters and setters support encapsulation by placing a defensive layer over object attributes. They allow developers to
hide implementation details, enforce data validation, and maintain a consistent public property interface even when
internal storage structures change.

## Use Cases

Accessor properties support key software patterns across object architectures:

* **Calculated properties:** Returning values dynamically derived from stored internal attributes.
* **Validation:** Guarding against improper state mutations by validating incoming setter values.
* **Data transformation:** Formatting input and output values seamlessly during reads and assignments.
* **Encapsulation:** Shielding private storage fields from direct external exposure.

## Performance Considerations

Because getters and setters invoke implicit function calls during property access, they introduce small execution
considerations compared to direct data field access.

| Factor          | Description                                                                   |
|:----------------|:------------------------------------------------------------------------------|
| Frequent access | Repeated execution inside tight loops can add minor performance overhead      |
| Complex logic   | Heavy computations inside getters should be avoided to keep reads predictable |
| Simple access   | Modern JavaScript engines optimize simple accessor calls effectively          |

## Best Practices

* **Use getters for derived values:** Implement getters when a property value can be calculated dynamically from
  existing state attributes.
* **Avoid hiding expensive operations inside getters:** Keep getters lightweight so property reads remain predictable
  and performant.
* **Use setters for controlled updates:** Validate and transform incoming data inside setters before updating internal
  state.
* **Use accessors to protect object state:** Expose accessors instead of raw fields to maintain control over how data is
  accessed and modified.
* **Choose methods when an operation performs an action:** Reserve getters and setters for noun-like properties, using
  standard methods when an operation executes explicit actions or takes multiple parameters.
* **Enforce immutability on returned reference types:** When a getter exposes an internal array, map, or nested object,
  return a shallow copy or a frozen variant using `Object.freeze()` to prevent external mutation of internal object
  state.
* **Never perform asynchronous operations inside getters or setters:** Accessors must execute synchronously to maintain
  the illusion of direct property access; asynchronous logic breaks core expectations and causes unexpected runtime
  behavior.
* **Protect backing fields with private identifiers:** Combine getters and setters with modern ECMAScript private fields
  (`#field`) to prevent direct external circumvention of validation logic.
* **Guard against infinite recursion traps:** Ensure that setters never assign values directly to the accessor property
  itself, but instead mutate an underlying private backing field — the getter must read from that same backing field,
  not from its own name.
* **Maintain symmetrical representation:** When implementing a getter to format or transform an internal value for
  output, ensure the corresponding setter correctly reverses that transformation during assignment.
* **Validate type consistency strictly:** Inside setters, employ strict type checking or TypeScript type guards before
  performing mutations to prevent runtime coercion bugs.
* **Avoid throwing non-descriptive errors in setters:** When value validation fails inside a setter, throw descriptive
  `TypeError` or `RangeError` exceptions to simplify debugging.
* **Minimize side-effect complexity:** Ensure setters trigger only essential state updates or localized event
  dispatches, avoiding cascading state modifications that complicate execution traces.
* **Prefer TypeScript accessor modifiers for visibility:** Explicitly annotate accessors with `public`, `protected`, or
  `private` keywords when working in TypeScript environments to enforce strict architectural boundaries.
* **Benchmark memory allocation in performance-critical paths:** Avoid excessive object creation or deep cloning inside
  frequently accessed getters to prevent unnecessary garbage collection pressure.
* **Define a getter without a matching setter when a value should be read-only from the outside — don't rely on
  convention alone.** A getter-only accessor throws (strict mode) or silently no-ops (non-strict) on assignment, which
  is a stronger guarantee than a data property with `writable: false`, since accessors can't be reassigned to plain data
  properties later the way descriptors can be redefined on a configurable property.
* **Remember that class accessors live on the prototype, not the instance — this affects `Object.hasOwn()` checks and
  per-instance overriding.** `Object.hasOwn(instance, 'value')` returns `false` for a class-defined accessor even though
  `instance.value` works fine, because the getter/setter pair is defined once on `ClassName.prototype`, not copied onto
  each instance the way object-literal accessors are.