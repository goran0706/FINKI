# WeakSet

## Concept and ECMAScript Specification

The `WeakSet` constructor creates collection objects that allow storing weakly held objects or non-registered symbols in
a set. According to the ECMA-262 specification, `WeakSet` maintains an internal `[[WeakSetData]]` list. Unlike standard
`Set` collections, `WeakSet` is strictly a collection of *objects and non-registered symbols*; primitive values cannot
be stored.

`WeakSet` holds *weak references* to its elements. If an object stored inside a `WeakSet` has no other remaining strong
references pointing to it elsewhere in execution memory, that object becomes eligible for automatic garbage collection.
Consequently, `WeakSet` instances are non-iterable and do not expose a `size` property or iteration methods.

| Characteristic        | ECMAScript Specification Behavior                                                             |
|:----------------------|:----------------------------------------------------------------------------------------------|
| Function Invocation   | Calling `WeakSet()` without `new` throws a `TypeError`                                        |
| Value Constraints     | Elements must be Objects or non-registered `Symbol` primitives (`TypeError` thrown otherwise) |
| Garbage Collection    | Storing an object inside a `WeakSet` does not prevent garbage collection of that object       |
| Enumerable Capability | Non-iterable; lacks `size`, `keys()`, `values()`, `entries()`, and `forEach()` methods        |
| Reference Equality    | Value uniqueness is determined via object reference identity                                  |

## Instance Properties and Prototype Methods

`WeakSet.prototype` exposes a minimalist API focused strictly on adding, checking, and removing object references.

| Property / Method | Category        | Specification Behavior                                                                                |
|:------------------|:----------------|:------------------------------------------------------------------------------------------------------|
| `add(value)`      | Mutator Method  | Appends `value` to the `WeakSet`; returns the instance (`TypeError` if value is not an Object/Symbol) |
| `has(value)`      | Accessor Method | Returns `true` if `value` exists inside the `WeakSet`; otherwise `false`                              |
| `delete(value)`   | Mutator Method  | Removes `value` from the `WeakSet`; returns `true` if the element was present and removed             |

## Use Cases

`WeakSet` collections serve as memory-safe membership tracking stores for object references:

* **Tagging object instances:** Marking specific object instances or DOM elements as "processed" or "visited" without
  modifying the target objects directly.
* **Tracking active references:** Maintaining a set of active class instances (such as connections or listeners) while
  allowing unreferenced instances to be reclaimed automatically.
* **Branded checks:** Validating that a given `this` argument or object instance belongs to a specific set of
  initialized instances.

## Best Practices

* **Always instantiate WeakSet using new:** Call `new WeakSet()` explicitly to avoid runtime `TypeError` exceptions.
* **Do not pass primitive values to WeakSet:** Ensure only valid object references or non-registered symbols are passed
  to `.add()`, `.has()`, or `.delete()`.
* **Do not use WeakSet if element iteration is required:** Use standard `Set` if your application requires counting
  elements via `.size` or iterating over contents using loops or iterators.
* **Use WeakSet for boolean state flags on objects:** Prefer `WeakSet` over setting temporary boolean flags (e.g.,
  `obj._isProcessed = true`) directly on third-party or frozen objects.