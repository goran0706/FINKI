# WeakMap

## Concept and ECMAScript Specification

The `WeakMap` constructor creates collection objects that hold key-value pairs where keys **must** be objects or
non-registered symbols, and values can be any arbitrary ECMAScript value. According to the ECMA-262 specification,
`WeakMap` holds *weak references* to its keys. If a key object stored inside a `WeakMap` has no other remaining strong
references pointing to it anywhere else in memory, that key (and its associated value) becomes eligible for garbage
collection automatically.

Because key references are held weakly, `WeakMap` instances are **non-iterable** and do not expose a `size` property or
iteration methods (`keys()`, `values()`, `entries()`). This prevents exposing non-deterministic garbage collection
timing behaviors.

| Characteristic        | ECMAScript Specification Behavior                                                         |
|:----------------------|:------------------------------------------------------------------------------------------|
| Function Invocation   | Calling `WeakMap()` without `new` throws a `TypeError`                                    |
| Key Constraints       | Keys must be Objects or non-registered `Symbol` primitives (`TypeError` thrown otherwise) |
| Garbage Collection    | Holding a key in a `WeakMap` does not prevent the engine from garbage collecting the key  |
| Enumerable Capability | Non-iterable; lacks `size`, `keys()`, `values()`, `entries()`, and `forEach()` methods    |
| Key Equality          | Evaluated using `SameValueZero` identity matching on object references                    |

## Instance Properties and Prototype Methods

`WeakMap.prototype` provides a minimalist set of API methods strictly limited to getting, setting, testing, and deleting
values by key reference.

| Property / Method | Category        | Specification Behavior                                                                                     |
|:------------------|:----------------|:-----------------------------------------------------------------------------------------------------------|
| `set(key, value)` | Mutator Method  | Associates `value` with `key`; returns the `WeakMap` instance (`TypeError` if key is not an Object/Symbol) |
| `get(key)`        | Accessor Method | Returns the value bound to `key`, or `undefined` if `key` is not present or non-object                     |
| `has(key)`        | Accessor Method | Returns `true` if an entry bound to `key` exists; otherwise `false`                                        |
| `delete(key)`     | Mutator Method  | Removes the entry bound to `key`; returns `true` if an entry existed and was removed                       |

## Use Cases

`WeakMap` instances enable automatic memory management for object-bound metadata:

* **Private data encapsulation:** Storing private instance variables keyed against `this` references without exposing
  properties on the object itself.
* **Extending third-party objects:** Associating custom metadata or cache items with DOM nodes or framework objects
  without causing memory leaks when those nodes are removed.
* **Memoization and caching:** Caching calculated results for specific object inputs, ensuring cache entries clear
  automatically when target objects are garbage collected.

## Best Practices

* **Always instantiate WeakMap using new:** Call `new WeakMap()` explicitly to avoid runtime `TypeError` exceptions.
* **Only use objects or non-registered symbols as keys:** Ensure keys are valid object or symbol references; passing
  primitives like numbers, strings, or booleans will throw a `TypeError`.
* **Do not use WeakMap if you need to iterate keys:** Use standard `Map` if your application requires iterating over
  keys, retrieving entry counts via `.size`, or inspecting collection contents.
* **Prefer WeakMap for DOM element metadata:** Use `WeakMap` over standard `Map` when caching data tied to DOM elements
  so detached elements are freed from memory automatically.