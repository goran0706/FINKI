# Object Methods

## Object Methods Concept

Object methods are built-in static utilities provided by JavaScript through the global `Object` constructor for
inspecting, copying, comparing, and transforming objects. Rather than being invoked directly from an object instance
prototype, these static functions accept target objects as parameters to perform reflective data operations and
structural manipulation.

| Method                    | Purpose                              |
|:--------------------------|:-------------------------------------|
| `Object.keys()`           | Retrieve property names              |
| `Object.values()`         | Retrieve property values             |
| `Object.entries()`        | Retrieve key-value pairs             |
| `Object.fromEntries()`    | Build an object from key-value pairs |
| `Object.assign()`         | Copy properties                      |
| `Object.is()`             | Compare values                       |
| `Object.getPrototypeOf()` | Read an object's prototype           |
| `Object.setPrototypeOf()` | Change an object's prototype         |

## Object.keys ()

The `Object.keys()` method returns an array containing the names of an object's own enumerable string-keyed properties.
It excludes inherited properties along the prototype chain as well as non-enumerable or symbol-keyed properties, making
it the primary tool for programmatic property inspection and object key processing.

| Feature                            | Behavior |
|:-----------------------------------|:---------|
| Returns array                      | Yes      |
| Includes own properties            | Yes      |
| Includes inherited properties      | No       |
| Includes non-enumerable properties | No       |

## Object.keys () Behavior

The array returned by `Object.keys()` follows JavaScript's deterministic property ordering rules. Integer-like keys are
ordered numerically first, standard string keys follow in exact insertion sequence, and symbol keys are omitted entirely
from the generated array.

| Property Type     | Order           |
|:------------------|:----------------|
| Integer-like keys | Numeric order   |
| String keys       | Insertion order |
| Symbol keys       | Not included    |

## Object.values ()

The `Object.values()` method returns an array containing the values of an object's own enumerable properties. By
retrieving values directly in the same sequence as `Object.keys()`, it eliminates the step of manually looking up each
value by key during iteration when only the raw underlying data is required.

| Feature                            | Behavior |
|:-----------------------------------|:---------|
| Returns array                      | Yes      |
| Returns property values            | Yes      |
| Includes inherited properties      | No       |
| Includes non-enumerable properties | No       |

## Object.entries ()

The `Object.entries()` method returns an array of key-value pairs representing an object's own enumerable string-keyed
properties, structured as `[key, value]` tuple arrays. This transformation bridges object data with array processing
pipelines, enabling full access to array higher-order methods for filtering, mapping, or iterating across object
structures.

| Position     | Content        |
|:-------------|:---------------|
| First value  | Property key   |
| Second value | Property value |

## Object.entries () Relationship

`Object.entries()` exposes object data to array operations, allowing key-value structures to be manipulated using
functions like `Array.prototype.map()` or `Array.prototype.filter()`. This relationship facilitates data
transformations, object restructuring, and conversions into other collection types like `Map`.

```javascript
const prices = {apple: 1.5, banana: 0.5, cherry: 4};

const discounted = Object.entries(prices)
    .filter(([, price]) => price > 1)
    .map(([name, price]) => [name, price * 0.9]);
// [['apple', 1.35], ['cherry', 3.6]]
```

## Object.fromEntries ()

The `Object.fromEntries()` method performs the inverse of `Object.entries()`: it takes an iterable of `[key, value]`
pairs (an array of tuples, a `Map`, or any iterable yielding two-element entries) and constructs a new plain object from
them.

| Feature                          | Behavior |
|:---------------------------------|:---------|
| Accepts arrays of `[key, value]` | Yes      |
| Accepts a `Map`                  | Yes      |
| Returns a new plain object       | Yes      |
| Mutates the source               | No       |

This pairing is what makes the `entries()` → transform → `fromEntries()` pipeline work end to end — `entries()` exposes
object data to array methods, and `fromEntries()` converts the transformed array back into an object:

```javascript
const prices = {apple: 1.5, banana: 0.5, cherry: 4};

const doubled = Object.fromEntries(
    Object.entries(prices).map(([name, price]) => [name, price * 2])
);
// { apple: 3, banana: 1, cherry: 8 }

// Also converts a Map directly into a plain object:
const map = new Map([['a', 1], ['b', 2]]);
console.log(Object.fromEntries(map)); // { a: 1, b: 2 }
```

## Object.assign ()

The `Object.assign(target, ...sources)` method copies all enumerable own properties from one or more source objects into
a designated target object and returns the mutated target. Because this operation executes a shallow copy, each
property's *value* is copied as-is — a primitive value is copied outright (primitives are always copied by value in JS,
with nothing special to `assign()` about it), while a value that is itself an object is copied as a reference to that
same object, not a duplicate of it.

| Feature                      | Behavior |
|:-----------------------------|:---------|
| Copies enumerable properties | Yes      |
| Mutates target object        | Yes      |
| Performs shallow copy        | Yes      |
| Copies nested objects        | No       |
| Accepts multiple sources     | Yes      |

## Object.assign () Copy Behavior

During `Object.assign()` execution, each property is copied by assigning its value onto the target — for primitive
values this naturally produces an independent copy, while for object/array values the target ends up holding the same
reference as the source, so mutating the nested object through either the source or the target affects both. True deep
copies require `structuredClone()`, recursion, or a dedicated cloning utility.

## Object.assign () with Multiple Sources

When more than one source object is passed, sources are applied left to right, and later sources overwrite matching keys
from earlier ones:

```javascript
const defaults = {theme: 'light', fontSize: 14};
const userConfig = {fontSize: 18};

const merged = Object.assign({}, defaults, userConfig);
// { theme: 'light', fontSize: 18 } — userConfig's fontSize wins
```

Passing a fresh empty object (`{}`) as the target — rather than one of the real objects — is the standard pattern for
merging without mutating either source.

## Object.is ()

The `Object.is()` static method evaluates whether two values are identical using SameValue comparison logic. It
evaluates value equivalence across all JavaScript data types according to exact bit-level equality, providing strict
comparison behavior without performing automatic type coercion.

## Object.is () Differences

`Object.is()` behaves like strict equality (`===`) for nearly every value, but diverges on two specific edge cases:

| Comparison                | `===`   | `Object.is()` |
|:--------------------------|:--------|:--------------|
| `NaN` compared with `NaN` | `false` | `true`        |
| `0 === -0`                | `true`  | `false`       |

`===` cannot detect `NaN` (since `NaN` is famously not equal to itself under normal equality) and treats `+0`/`-0` as
identical. `Object.is()` corrects both, which is why `Number.isNaN()` or `Object.is(x, NaN)` — never `x === NaN` — are
the correct ways to test for `NaN`.

## Object.getPrototypeOf () and Object.setPrototypeOf ()

`Object.getPrototypeOf(obj)` returns an object's prototype — the object it inherits properties from through the
prototype chain. `Object.setPrototypeOf(obj, prototype)` reassigns that link, changing which object `obj` inherits from.

| Feature                                | Behavior |
|:---------------------------------------|:---------|
| `getPrototypeOf` reads the prototype   | Yes      |
| `setPrototypeOf` mutates the prototype | Yes      |
| Affects inherited property lookups     | Yes      |

`setPrototypeOf()` is rarely used in application code — changing an object's prototype after creation is a slow
operation that defeats engine shape optimizations for that object and everything downstream of it.
`Object.create(existingProto)` (establishing the prototype at creation time) is preferred whenever the prototype
relationship is known upfront.

## Object Methods vs Instance Methods

Static object utility methods (`Object.keys()`, `Object.assign()`, etc.) are invoked directly on the `Object`
constructor and take target instances as arguments. Instance methods, by contrast, live on `Object.prototype` and are
called directly on individual objects through inheritance (e.g., `obj.hasOwnProperty()`, `obj.toString()`).

## Use Cases

Object utility methods support several common data manipulation workflows in JavaScript applications:

* **Inspecting objects:** Extracting arrays of keys, values, or entries to examine object structures programmatically.
* **Transforming data:** Converting key-value records into iterable array streams for filtering and mapping operations,
  then rebuilding an object with `Object.fromEntries()`.
* **Copying properties:** Merging defaults with custom configuration objects or creating shallow object clones.
* **Comparing values:** Executing precise equality evaluations for state change detection and mathematical boundary
  checks.
* **Inspecting or adjusting inheritance:** Reading or, rarely, reassigning an object's prototype for reflective or
  interop scenarios.

## Performance Considerations

Static object methods construct new array instances or perform memory references during execution, which introduces
memory overhead when processing large data structures.

| Method                    | Consideration                                       |
|:--------------------------|:----------------------------------------------------|
| `Object.keys()`           | Creates a new array                                 |
| `Object.values()`         | Creates a new array                                 |
| `Object.entries()`        | Creates nested arrays                               |
| `Object.fromEntries()`    | Creates a new object                                |
| `Object.assign()`         | Performs shallow copying                            |
| `Object.is()`             | Direct value comparison                             |
| `Object.setPrototypeOf()` | Deoptimizes the object's shape — avoid in hot paths |

## Best Practices

* **Use `Object.keys()` when property names are needed:** It provides a clean array of property names for structural
  validation and key iteration.
* **Use `Object.values()` when only data values matter:** It avoids manually dereferencing properties when keys are
  irrelevant to the operation.
* **Use `Object.entries()` when both keys and values are required:** It simplifies destructuring key-value pairs inside
  loop constructs and array methods.
* **Remember that `Object.assign()` performs shallow copying:** Use `structuredClone()` or specialized libraries when
  copying objects containing nested reference types.
* **Use `Object.is()` when exact comparison behavior is required:** It correctly handles specialized values like `NaN`
  and distinct zero signs where standard strict equality fails.
* **Pass an empty target object to `Object.assign()` for immutable copies:** Prevent mutation of original data
  structures by passing `{}` as the first argument when combining configurations.
* **Beware of prototype limitations in static methods:** Remember that `Object.keys()`, `Object.values()`, and
  `Object.entries()` inspect only own enumerable properties, ignoring inherited attributes.
* **Combine `Object.entries()` with `Object.fromEntries()` for data transformation:** Use the pairing of entries and
  fromEntries to seamlessly map, filter, and reconstruct objects using array pipelines.
* **Avoid unnecessary array allocations in tight loops:** Cache the results of static object methods when processing
  large datasets repeatedly to prevent excessive memory garbage collection.
* **Check for nullish targets before method invocation:** Ensure that objects passed to static methods are defined and
  non-null to prevent abrupt runtime type errors.
* **Leverage `Object.fromEntries()` for Map-to-Object conversions:** Convert iterable Map collections back into standard
  plain objects cleanly when API consumption requires standard object shapes.
* **Be mindful of symbol and non-enumerable key exclusion:** Recognize that standard object inspection methods omit
  symbol-keyed properties and non-enumerable attributes, requiring reflective methods like `Reflect.ownKeys()` if full
  introspection is necessary.
* **Use `Object.assign()` carefully with getters:** Remember that source property getters are evaluated during
  `Object.assign()` execution, copying the resulting primitive or reference value rather than the accessor itself.
* **Prefer strict equality (`===`) over `Object.is()` for standard checks:** Reserve `Object.is()` exclusively for edge
  cases involving `NaN` or signed zeros to maintain code readability during ordinary value comparisons.
* **Validate type integrity of method inputs:** Ensure runtime parameters are explicitly checked for object types before
  calling static constructors to avoid unexpected type coercion behavior.
* **Avoid `Object.setPrototypeOf()` in performance-sensitive code — set the prototype at creation time instead.**
  Changing an object's prototype after it's created forces the engine to deoptimize that object's hidden class, and this
  penalty can propagate to every other object that shares the same shape.
* **`Object.assign()`'s later-source-wins order is easy to get backwards when merging config layers — write sources in
  explicit "least to most specific" order** (`Object.assign({}, defaults, envConfig, userOverrides)`) so the intended
  precedence is visible directly from the argument order, not something the reader has to infer.