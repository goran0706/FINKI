# JavaScript Object Properties, Access, and Existence

## Object Properties

### Property Concept

A property is a named value stored inside an object that defines the data and characteristics of that object. Each
property consists of a key that identifies the property and a value that stores the associated data. Property keys are
used to retrieve stored values, which can contain any valid JavaScript data type.

| Component | Description                |
|:----------|:---------------------------|
| Key       | Identifies the property    |
| Value     | Stores the associated data |

JavaScript supports a wide variety of value types within properties, ranging from primitive values to complex nested
structures and functional methods. When a function is stored as a property, it functions as an object method to define
instance behavior.

| Value Type       | Supported |
|:-----------------|:----------|
| Primitive values | Yes       |
| Objects          | Yes       |
| Arrays           | Yes       |
| Functions        | Yes       |

### Creating Properties

Objects can have properties added when they are created or attached later in the execution flow. A property is created
by assigning a value to a chosen key. Because JavaScript objects are dynamic structures, properties can be continuously
attached after creation without needing to redefine the original object structure.

### Adding New Properties

JavaScript objects allow new properties to be added at any time during execution. Adding a property creates a new
key-value relationship and expands the object structure without requiring the object to be redefined, allowing objects
to adapt dynamically to runtime data.

### Property Descriptors

Every property carries a set of internal attributes — its **descriptor** — that governs how it can be interacted with,
beyond just its value. There are two descriptor forms: **data descriptors** (`value`, `writable`) for ordinary
properties, and **accessor descriptors** (`get`, `set`) for getter/setter properties. Both forms share two additional
attributes:

| Attribute      | Controls                                                      | Default when set via `obj.x = 1` |
|:---------------|:--------------------------------------------------------------|:---------------------------------|
| `writable`     | Whether the property's value can be reassigned                | `true`                           |
| `enumerable`   | Whether the property appears in `for...in` / `Object.keys()`  | `true`                           |
| `configurable` | Whether the property can be deleted or its descriptor changed | `true`                           |

Properties created through normal assignment (`obj.x = 1`) or object literals get all three set to `true` by default.
`Object.defineProperty(obj, key, descriptor)` is the explicit way to set non-default values:

```javascript
const config = {};
Object.defineProperty(config, 'version', {
    value: '1.0.0',
    writable: false,
    enumerable: true,
    configurable: false,
});

config.version = '2.0.0';       // silently ignored (non-strict) or throws (strict mode)
console.log(config.version);    // "1.0.0"
delete config.version;          // returns false, property remains
```

Current descriptors can be inspected with `Object.getOwnPropertyDescriptor(obj, key)`.

### Reading Properties

Properties can be accessed to retrieve their stored values. Reading an existing property returns the value associated
with its key. If a requested property does not exist on the target object or its prototype chain, JavaScript returns
`undefined`.

### Updating Properties

Existing properties can be modified by assigning a new value to an established key. Updating a property keeps the same
key, replaces the previous value, and alters the object's current state. Because objects are mutable reference types,
property updates modify the existing object instance in place.

This assumes the property is **writable**. A property explicitly marked `writable: false` (see *Property Descriptors*
above) — or any property on a **frozen** object (see *Immutability Controls* below) — will not accept a new value: the
assignment fails silently in non-strict (sloppy) mode, or throws a `TypeError` in strict mode. Since ES modules run in
strict mode by default, this is the behavior most modern code should expect.

### Deleting Properties

Properties can be removed from objects using the `delete` operator. Deleting a property severs the key-value
relationship, makes the key unavailable, and changes the object's structure. After deletion, subsequent attempts to
access the removed property return `undefined`.

`delete` only succeeds when the property is **configurable**. A non-configurable property — or any property on a
**sealed** or **frozen** object — cannot be deleted: `delete` returns `false` in non-strict mode, or throws a
`TypeError` in strict mode, and the property remains in place.

### Property Keys

Object property keys are always stored internally as strings or symbols. Values of other types passed as keys are
converted according to JavaScript rules, meaning numbers used as property keys are automatically stored as string
representations.

| Key Type | Supported           |
|:---------|:--------------------|
| String   | Yes                 |
| Symbol   | Yes                 |
| Number   | Converted to string |

### Property Values

Object properties can store any valid JavaScript value, providing the flexibility needed to represent complex domain
models and dynamic structures.

| Value     | Example Purpose         |
|:----------|:------------------------|
| Primitive | Store basic information |
| Object    | Store related data      |
| Array     | Store collections       |
| Function  | Define behavior         |

### Property Order

JavaScript objects maintain a defined property ordering behavior during traversal. Integer-like keys are traversed first
in ascending numeric order, standard string keys follow in their exact insertion sequence, and symbol keys are processed
last in insertion sequence. Although this ordering is predictable, standard objects should not generally be relied upon
when strict index-based ordering is a core functional requirement — a `Map` guarantees true insertion order
unconditionally, including for numeric-looking keys.

| Property Type     | Order           |
|:------------------|:----------------|
| Integer-like keys | Numeric order   |
| String keys       | Insertion order |
| Symbol keys       | Insertion order |

### Enumerable Properties

Properties possess internal attributes that dictate their visibility during iteration operations. Enumerable properties
are keys designated to appear during standard object traversal operations like `for...in` loops, with the `enumerable`
descriptor attribute (see *Property Descriptors*) governing whether enumerability is granted.

### Own Properties

An own property is a key-value pair stored directly on the target object instance itself rather than inherited from a
prototype. Objects can also access inherited properties through their prototype chain, making the distinction between
own and inherited keys important when traversing, serializing, or cloning object data.

Several methods retrieve an object's own keys, differing in which key types and enumerability they include:

| Method                              | Returns                                                         |
|:------------------------------------|:----------------------------------------------------------------|
| `Object.keys(obj)`                  | Own **enumerable** string keys                                  |
| `Object.getOwnPropertyNames(obj)`   | Own string keys, enumerable or not                              |
| `Object.getOwnPropertySymbols(obj)` | Own symbol keys                                                 |
| `Reflect.ownKeys(obj)`              | All own keys — strings and symbols, regardless of enumerability |

### Immutability Controls

JavaScript provides three levels of restricting an object's mutability, from least to most restrictive:

| Method                          | Add properties | Delete properties | Modify existing values | Change descriptors |
|:--------------------------------|:---------------|:------------------|:-----------------------|:-------------------|
| `Object.preventExtensions(obj)` | No             | Yes               | Yes                    | Yes                |
| `Object.seal(obj)`              | No             | No                | Yes (if writable)      | No                 |
| `Object.freeze(obj)`            | No             | No                | No                     | No                 |

`Object.freeze()` makes every existing property non-writable and non-configurable, and blocks new properties entirely —
it's a shallow freeze: nested objects referenced by a frozen object's properties are **not** themselves frozen and
remain fully mutable. Corresponding checks exist: `Object.isExtensible()`, `Object.isSealed()`, `Object.isFrozen()`.

```javascript
const settings = Object.freeze({theme: 'dark', nested: {level: 1}});
settings.theme = 'light';        // fails silently / throws in strict mode
settings.nested.level = 99;      // succeeds — freeze is shallow
```

### Property Mutation and Object State

Modifying a writable property mutates the existing object instance directly in memory. Because objects are handled as
reference types across the execution context, any other variables pointing to the same memory reference immediately
reflect the updated value. The collective sum of an object's current property values represents its **state** — object
methods routinely interact with state by reading or updating these values during execution.

### Use Cases

Properties serve several primary functions in application design, including holding raw data attributes, modeling
real-world entities through named fields, tracking state variations over time, and encapsulating object behaviors
through functional methods.

### Performance Considerations

Object property access is heavily optimized for predictable object structures inside JavaScript engines. Maintaining
consistent property shapes across similar instances allows engine optimizations to operate at peak efficiency.

| Factor                      | Description                           |
|:----------------------------|:--------------------------------------|
| Consistent properties       | Helps JavaScript engine optimization  |
| Frequent structural changes | Can reduce optimization opportunities |
| Property lookup             | Designed for efficient named access   |

## Property Access

### Property Access Concept

Property access is the process of retrieving or modifying values stored inside an object's properties. JavaScript
provides two primary syntaxes for accessing properties depending on whether the key name is known ahead of time or
computed dynamically at runtime.

| Method           | Purpose                                  |
|:-----------------|:-----------------------------------------|
| Dot notation     | Access known property names              |
| Bracket notation | Access dynamic or special property names |

### Dot Notation

Dot notation is a static syntax used to access object properties using an explicit identifier name directly attached to
the target object reference.

| Feature                      | Behavior |
|:-----------------------------|:---------|
| Requires known property name | Yes      |
| Uses identifier syntax       | Yes      |
| Supports dynamic names       | No       |

### Dot Notation Limitations

Dot notation cannot be applied when a property name is stored inside a variable, contains spaces or hyphens that violate
identifier naming rules, or begins with a numeric digit. In these situations, bracket notation is required to evaluate
the property name.

### Bracket Notation

Bracket notation is a dynamic syntax used to access object properties by evaluating an expression enclosed in square
brackets.

| Feature                     | Behavior |
|:----------------------------|:---------|
| Supports dynamic properties | Yes      |
| Accepts expressions         | Yes      |
| Requires brackets           | Yes      |

### Dynamic Property Access

Dynamic property access retrieves or updates an object property when the key name is determined at runtime. This pattern
is essential when property names originate from variables, external API responses, or programmatically generated key
strings.

### Dot Notation vs Bracket Notation

Both access mechanisms reach the same underlying object properties but serve distinct syntactic and operational purposes
during application execution.

| Feature            | Dot Notation | Bracket Notation |
|:-------------------|:-------------|:-----------------|
| Known properties   | Yes          | Yes              |
| Dynamic properties | No           | Yes              |
| Readability        | Higher       | Lower            |
| Uses expressions   | No           | Yes              |

### Computed Property Names

Computed property names allow object keys to be evaluated directly from expressions during object literal construction.
Enclosing an expression in square brackets within the literal definition dynamically computes the property key upon
object initialization.

### Property Access with Variables

Variables can hold string representations of property names. Passing a variable into bracket notation causes JavaScript
to evaluate the variable's string value to decide which property to read or modify, enabling programmatic object access.

### Accessing Missing Properties

Accessing a property key that does not exist on an object evaluates directly to `undefined` without throwing a runtime
error. While this grants access flexibility, referencing properties on missing intermediate nodes in deeply nested
structures will trigger a `TypeError`.

This graceful "missing key returns `undefined`" behavior applies to plain property access — it does **not** extend to
the existence-check methods covered below. Calling `Object.hasOwn(target, key)`, `Reflect.ownKeys(target)`, or similar
with a `null` or `undefined` target throws a `TypeError` immediately, since these methods require an actual object
argument.

### Nested Property Access

Objects can hold other objects as property values, forming multi-layered data trees. Reading nested data requires
chaining access operators across each structural layer sequentially, which can be safely managed using optional chaining
syntax.

### Property Access and References

When a property contains an object or array, accessing that property returns a direct reference to the nested value
rather than creating a copy. Any subsequent modifications made through that reference directly alter the original nested
data.

### Property Access and Methods

Methods are retrieved using the exact same property access mechanics as primitive values because functions are
first-class values stored under key names. Invoking an accessed function executes it within the execution context of its
parent object binding.

### Optional Property Access

Modern JavaScript provides optional chaining (`?.`) to navigate properties safely when target objects may be missing.
Optional chaining halts evaluation gracefully and returns `undefined` if an intermediate link in the access chain
resolves to `null` or `undefined`. Optional chaining short-circuits the entire remaining expression from that point on —
including any function calls further down the chain — so a nullish result partway through skips every subsequent step
rather than just the immediate access.

### Use Cases

Property access patterns support reading stored object values, updating state attributes, accessing dynamic keys at
runtime, and extracting structural data from API response payloads.

### Performance Considerations

JavaScript engines use aggressive optimization pathways like inline caches for predictable property access. Keeping
object structures uniform ensures high access speeds across both dot and bracket syntaxes.

| Factor                      | Description                    |
|:----------------------------|:-------------------------------|
| Consistent object structure | Improves optimization          |
| Deep nesting                | Can increase access complexity |
| Dynamic property creation   | Can affect optimization        |

## Property Existence

### Property Existence Concept

Property existence validation checks whether an object contains a specific key. JavaScript objects can hold properties
defined directly on the instance as well as properties inherited through the prototype chain, and different checking
mechanisms account for these inheritance layers differently.

| Method             | Checks                       |
|:-------------------|:-----------------------------|
| `in` operator      | Own and inherited properties |
| `hasOwnProperty()` | Own properties only          |
| `Object.hasOwn()`  | Own properties only          |

### `in` Operator

The `in` operator checks whether a property key exists anywhere on the target object or within its prototype chain,
returning a boolean result.

| Result  | Meaning                 |
|:--------|:------------------------|
| `true`  | Property exists         |
| `false` | Property does not exist |

### `in` Operator Behavior

Because the `in` operator traverses the full prototype chain, it returns `true` for inherited properties derived from
base prototypes like `Object.prototype`. This makes it ideal for checking overall property accessibility regardless of
origin — but on objects with a deep prototype chain, this traversal is real work on every call, unlike the
own-property-only methods below.

### `hasOwnProperty()`

The `hasOwnProperty()` instance method evaluates whether a specified key exists directly as an own property on an
object, bypassing inherited prototype members entirely.

| Result  | Meaning                        |
|:--------|:-------------------------------|
| `true`  | Object owns the property       |
| `false` | Property is not directly owned |

Because it's an inherited method looked up via the prototype chain, `hasOwnProperty` can be unreliable in two specific
cases: it's `undefined` (and throws when called) on an object created with `Object.create(null)`, since such an object
has no prototype to inherit it from; and it can be silently shadowed if the target object happens to define its own
property literally named `hasOwnProperty`.

### `Object.hasOwn()`

`Object.hasOwn()` is a modern static method for checking whether an object contains an own property. It serves the same
purpose as `hasOwnProperty()` but offers safer execution across objects with overridden methods or `null` prototypes,
since it never relies on the target object having the method itself.

| Feature                   | Benefit                           |
|:--------------------------|:----------------------------------|
| Works with all objects    | Does not depend on object methods |
| Avoids overridden methods | More predictable behavior         |
| Modern API                | Recommended approach              |

### Own Properties vs Inherited Properties

JavaScript objects distinguish between properties defined directly on the instance and those available through prototype
linkage. Property existence checks allow developers to determine precisely where a property resides within the object
structure.

| Property Type      | Location                    |
|:-------------------|:----------------------------|
| Own property       | Stored directly on object   |
| Inherited property | Available through prototype |

### Comparing Property Checks

Selecting a property existence technique depends on whether inherited prototype properties should be checked and whether
protection against instance method overrides is required.

| Feature                     | `in` | `hasOwnProperty()` | `Object.hasOwn()` |
|:----------------------------|:-----|:-------------------|:------------------|
| Checks own properties       | Yes  | Yes                | Yes               |
| Checks inherited properties | Yes  | No                 | No                |
| Modern recommendation       | No   | Older              | Yes               |
| Uses object method          | No   | Yes                | No                |

### Prototype Chain and Property Checks

Objects inherit properties through prototype linkage. Choosing between the `in` operator and static ownership methods
dictates whether prototype chain traversal takes place during the validation process.

### Missing Properties

When a property key does not exist on an object, direct property access evaluates to `undefined` while formal existence
checks evaluate to `false`. Performing explicit existence checks prevents confusing missing keys with keys that
explicitly hold an `undefined` value — a key set explicitly to `undefined` still returns `true` from `Object.hasOwn()`,
even though reading it also yields `undefined`.

### Use Cases

Existence checks are used to validate payload schemas before reading values, verify optional configuration flags,
isolate instance properties during object inspection, and process dynamic external data safely.

### Performance Considerations

Direct ownership checks avoid prototype chain traversal and execute rapidly. For standard applications, choosing between
existence techniques should be guided by structural correctness and inheritance requirements rather than minor
performance variations.

| Factor              | Description                       |
|:--------------------|:----------------------------------|
| Prototype lookup    | `in` searches the prototype chain |
| Own property checks | Avoid prototype traversal         |
| Frequent checks     | Consider data structure choice    |

## Best Practices

* **Use `Object.hasOwn()` for checking own properties:** It is the modern and safest approach.
* **Use the `in` operator when inherited properties should count:** It checks the complete prototype chain.
* **Understand the difference between own and inherited properties:** Objects can access values that are not directly
  stored on them.
* **Avoid relying only on `undefined` checks:** A property can exist and still contain `undefined` as its explicitly set
  value.
* **Choose property checks based on intent:** The method should match whether inherited properties are relevant.
* **Combine optional chaining with nullish coalescing safely:** Pair `?.` with `??` to supply dependable fallbacks when
  navigating dynamic or missing property structures.
* **Avoid mutating objects with shared references:** Be cautious when reading or updating nested object properties to
  prevent unintended side effects across linked memory references.
* **Keep property access expressions free of side effects:** Ensure that dynamic bracket notation keys do not invoke
  functions or mutate state within the accessor expression itself.
* **Validate external payload shapes before extraction:** Check property existence or use validation libraries before
  destructuring or reading unknown API response data to prevent runtime type errors.
* **Cache deeply nested property access in performance-critical loops:** Store frequently accessed nested properties in
  local variables inside heavy execution blocks to minimize repeated lookup overhead.
* **Use strict equality when verifying explicit undefined states:** Distinguish between missing properties and
  properties explicitly assigned `undefined` by utilizing `Object.hasOwn()` rather than relying solely on value checks.
* **Prevent prototype pollution risks when assigning dynamic keys:** Sanitize dynamic keys before setting properties via
  bracket notation to safeguard objects against prototype injection vulnerabilities.
* **Maintain uniform object shapes for optimal hidden class performance:** Initialize object properties in a consistent
  order during instantiation to help JavaScript engines optimize property lookups.
* **Avoid storing state on object prototypes:** Define mutable properties directly on instances rather than prototype
  chains to prevent shared state contamination across object instances.
* **Prefer destructuring over repetitive property access:** Extract multiple properties in a single declarative
  statement using object destructuring to improve code readability and maintainability.
* **`delete` doesn't just remove a property — it forces V8 into dictionary mode for that object, permanently.** Deleting
  drops the object out of its fast, hidden-class-backed representation into a slower hash-table-style storage, and this
  doesn't revert even after the delete. If a property genuinely needs "removal," setting it to `undefined` (when the
  key's absence isn't semantically required) or building a new object without that key
  (`const { removed, ...rest } = obj`) avoids the permanent deopt.
* **`"key" in obj === true` doesn't mean `obj[key]` will return something truthy — or even that a lookup is cheap.** For
  an object with a large prototype chain, `in` walks the entire chain on every call. In a hot loop checking many keys
  against a deep hierarchy, this is measurably slower than `Object.hasOwn()`, which never traverses anything.
* **`hasOwnProperty` can be silently shadowed or missing — this is exactly why `Object.hasOwn()` exists, not just as a
  style preference.** An object created via `Object.create(null)` has no prototype at all, so `obj.hasOwnProperty`
  throws a `TypeError`. An object with its own property literally named `hasOwnProperty` shadows the inherited method
  entirely. `Object.hasOwn(obj, key)` is immune to both.
* **Numeric-like string keys reorder ahead of insertion-order keys during enumeration — this silently breaks assumptions
  when object keys come from parsed IDs or array-like indices.** `{ b: 1, "2": 'x', a: 3, "1": 'y' }` iterates as
  `1, 2, b, a`. If key order matters and some keys might look numeric, use a `Map` instead.
* **Optional chaining short-circuits the entire remaining expression, not just the immediate access — including function
  calls further down the chain.** `obj?.getData().value` will still throw if `getData()` returns `null` and `.value` is
  accessed on it, because `?.` only guards the `obj` step. `obj?.getData?.()?.value` guards every link, including
  skipping the call to `getData()` itself.
* **Property access through a getter is not cached like a plain data property — every access re-runs the getter
  function.** In a loop reading the same computed getter repeatedly without the underlying value changing, cache the
  result in a local variable rather than re-invoking the getter each iteration.
* **A `writable: false` or frozen-object assignment failure is silent in non-strict mode — always run in strict mode (or
  use ES modules, which are strict by default) so these failures throw instead of disappearing.** Debugging "why didn't
  my update apply" is far harder when the failure produces no error at all.