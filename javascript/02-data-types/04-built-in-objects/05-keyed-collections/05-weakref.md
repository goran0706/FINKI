# WeakRef

## Concept and ECMAScript Specification

The `WeakRef` (Weak Reference) constructor creates object references that do not prevent their target objects 
(referents) from being reclaimed by garbage collection. According to the ECMA-262 specification, a standard variable or
property assignment maintains a *strong reference* to an object, keeping it alive in memory. In contrast, a `WeakRef`
holds a *weak link* to its target object.

If the target object of a `WeakRef` has no remaining strong references, the garbage collector may destroy the target
object and reclaim its memory at any time. When this occurs, dereferencing the `WeakRef` yields `undefined`.

| Characteristic       | ECMAScript Specification Behavior                                                                 |
|:---------------------|:--------------------------------------------------------------------------------------------------|
| Function Invocation  | Calling `WeakRef()` without `new` throws a `TypeError`                                            |
| Target Constraints   | Target must be an Object or non-registered `Symbol` primitive (`TypeError` thrown otherwise)      |
| Liveness Window      | Target is guaranteed to remain alive within the execution duration of the current synchronous job |
| Dereferencing Method | Evaluated using `.deref()`, which returns the target object or `undefined`                        |

## Instance Methods

`WeakRef.prototype` exposes a single instance method to access the underlying weak target safely.

| Property / Method | Category        | Specification Behavior                                                                                                 |
|:------------------|:----------------|:-----------------------------------------------------------------------------------------------------------------------|
| `deref()`         | Accessor Method | Returns the target object if it is still alive in memory; returns `undefined` if the target has been garbage collected |

## Use Cases

`WeakRef` instances support specialized, low-level memory management patterns:

* **Large object caches and memoization:** Caching large computed objects or images without forcing them to stay in
  memory permanently if system memory is low.
* **Managing secondary references:** Linking auxiliary state or DOM views to primary domain objects without extending
  the lifespan of those domain objects.

## Best Practices

* **Always instantiate WeakRef using new:** Call `new WeakRef(target)` explicitly to prevent runtime `TypeError`
  exceptions.
* **Store local strong references when operating on deref() results:** Assign the result of `weakRef.deref()` to a local
  variable before using it to prevent the object from being garbage collected mid-operation:
  ```javascript
  const target = weakRef.deref();
  if (target) {
    // Perform operations safely with target
  }