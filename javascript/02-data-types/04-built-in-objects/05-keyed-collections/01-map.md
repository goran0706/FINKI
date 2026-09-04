# Map

## Concept and ECMAScript Specification

The `Map` constructor creates collection objects that hold key-value pairs and remember the original insertion order of
the keys. According to the ECMA-262 specification, any ECMAScript value (both objects and primitive values) can be used
as either a key or a value. `Map` objects are exotic collections that manage internal entries via an internal
`[[MapData]]` list.

`Map` key equality is evaluated using the `SameValueZero` specification algorithm. Under `SameValueZero`, `NaN` is
considered equal to `NaN` (despite `NaN !== NaN` in strict equality), and `-0` is considered equal to `+0`.

| Characteristic         | ECMAScript Specification Behavior                                                       |
|:-----------------------|:----------------------------------------------------------------------------------------|
| Function Invocation    | Calling `Map()` without `new` throws a `TypeError`                                      |
| Key Types              | Accepts any valid ECMAScript primitive or object instance as a key                      |
| Key Equality           | Uses `SameValueZero` algorithm (`NaN` equals `NaN`, `-0` equals `+0`)                   |
| Iteration Order        | Guarantees element traversal strictly in entry insertion order                          |
| Complexity Requirement | Spec requires operations to execute in sublinear average time relative to element count |

## Static Methods

The `Map` constructor includes static utility methods to transform iterables into structured maps based on grouping
parameters.

| Static Method                    | Specification Operational Behavior                                                    |
|:---------------------------------|:--------------------------------------------------------------------------------------|
| `Map.groupBy(items, callbackFn)` | Groups elements from an iterable into a new `Map` using keys returned by `callbackFn` |

## Instance Properties and Prototype Methods

`Map.prototype` provides instance methods to mutate entries, retrieve stored values, inspect existence, and generate
dynamic iterators over keys, values, or entry tuples.

| Property / Method            | Category                 | Specification Behavior                                                               |
|:-----------------------------|:-------------------------|:-------------------------------------------------------------------------------------|
| `size`                       | Instance Property Getter | Returns the total count of key-value pairs currently stored in `[[MapData]]`         |
| `set(key, value)`            | Mutator Method           | Adds or updates a key-value entry; returns the `Map` instance to allow chaining      |
| `get(key)`                   | Accessor Method          | Returns the value associated with `key`, or `undefined` if the key is not present    |
| `has(key)`                   | Accessor Method          | Returns `true` if an entry associated with `key` exists; otherwise `false`           |
| `delete(key)`                | Mutator Method           | Removes the entry bound to `key`; returns `true` if an entry existed and was removed |
| `clear()`                    | Mutator Method           | Removes all key-value entries from the map instance                                  |
| `keys()`                     | Iterator Generator       | Returns a new iterator object yielding keys in insertion order                       |
| `values()`                   | Iterator Generator       | Returns a new iterator object yielding values in insertion order                     |
| `entries()`                  | Iterator Generator       | Returns a new iterator yielding `[key, value]` pairs in insertion order              |
| `forEach(callback, thisArg)` | Iteration Method         | Executes `callback` once per key-value pair in insertion order                       |

## Use Cases

`Map` instances fulfill key-value storage tasks across dynamic data management scenarios:

* **Object-keyed metadata storage:** Associating metadata or state directly with object references without mutating the
  target objects.
* **Dynamic lookup dictionary caching:** Maintaining fast key-value lookups where keys are unknown or added dynamically
  at runtime.
* **Data grouping operations:** Classifying collection elements into categorized map buckets using `Map.groupBy()`.

## Best Practices

* **Always instantiate Map using new:** Call `new Map()` explicitly to prevent runtime `TypeError` exceptions.
* **Prefer Map to plain Object for dynamic collections:** Use `Map` when keys are dynamically generated, non-string
  types, or sourced from external inputs to prevent prototype pollution and accidental key collisions.
* **Leverage method chaining with set:** Chain `.set(k1, v1).set(k2, v2)` calls together when populating instances
  during initialization.
* **Remember that object keys compare by reference:** Ensure consistent object references are used when setting and
  getting entries with object keys, as distinct instances with identical properties are not equal.
* **Be aware of SameValueZero key semantics:** Keep in mind that `NaN` keys collide with one another and `-0` keys
  normalize to `+0` when retrieving or storing entries.
* **Use `Map.groupBy()` for clean collection partitioning:** Leverage `Map.groupBy()` instead of manual loops or reduce
  accumulators when grouping items into categories dynamically.
* **Prefer `Map` over objects for frequent additions and deletions:** Rely on `Map` when your data structure undergoes
  high-frequency insertions and removals, as engines optimize maps specifically for dynamic key-value workloads.
* **Check key existence with `has()` before complex retrieval:** Use `.has(key)` when distinguishing between an
  explicitly stored `undefined` value and a missing key in performance-critical lookups.
* **Convert maps to arrays easily using spread syntax:** Transform map keys, values, or entries into standard arrays via
  `[...map.entries()]` or `Array.from(map)` when array prototype methods are required.
* **Pass iterable entries directly into the constructor:** Populate maps efficiently at instantiation by passing an
  array of key-value tuples (e.g., `new Map([[k1, v1], [k2, v2]])`) rather than calling individual setters separately.
* **Iterate over maps using standard for...of loops:** Use destructuring within `for (const [key, value] of map)` loops
  for clear and expressive traversal over stored elements in insertion order.
* **Avoid storing excessive references to prevent memory leaks:** Clean up map entries or delete unneeded keys
  explicitly when working with long-lived map instances holding large object references to avoid retaining memory.
* **Understand that Map size is a getter property:** Access `.size` instead of iterating or relying on manual length
  tracking to determine the exact number of entries currently stored in the collection.
* **Use `.clear()` for bulk entry removal:** Prefer the built-in `.clear()` method over manual iteration loops or
  re-instantiating new maps when emptying an existing collection instance.
* **Keep key types consistent for maintainability:** Maintain predictable key structures within shared map instances to
  prevent debugging complexity and type confusion during retrieval operations.