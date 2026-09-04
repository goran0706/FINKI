# Weak References

## Core Concepts & Mechanisms

**Weak References:** References to objects that do not prevent the garbage collector from reclaiming those objects if
they are no longer strongly reachable elsewhere in the application.

| Weak Reference Type        | Purpose & Mechanism                                                                                                                                                                  | Use Case                                                                                                      |
|:---------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------|
| **`WeakMap`**              | A collection of key-value pairs where keys must be objects and are held *weakly*. If a key object loses all strong references, it and its value are automatically garbage collected. | Associating metadata with DOM nodes or objects without causing memory leaks when those objects are destroyed. |
| **`WeakSet`**              | A collection of unique objects held *weakly*. Objects can be added and checked for existence, but will not be prevented from being garbage collected.                                | Tracking object states or visited objects in algorithms without retaining strong references.                  |
| **`WeakRef`**              | An object that holds a weak reference to another target object without preventing its collection, accessed via the `.deref()` method.                                                | Caching large objects where memory reclamation takes precedence over retaining cached items indefinitely.     |
| **`FinalizationRegistry`** | An API that allows you to request a callback when an object registered with it has been garbage collected.                                                                           | Cleanup tasks or tracking object destruction (note: non-deterministic execution timing).                      |

## Architectural Behavior & Engine Details

* **Non-Enumerability:** Weak collections (`WeakMap`, `WeakSet`) are not iterable and do not have `.size` properties, as
  their contents can change unpredictably at any moment depending on garbage collection cycles.
* **Deterministic Avoidance:** Because garbage collection timing is non-deterministic (engine-dependent), relying on the
  exact moment a weak reference is cleared for critical business logic is discouraged.

## Best Practices

* **Use `WeakMap` for caching/metadata:** Attach extra data to third-party objects or DOM elements safely without
  needing manual cleanup maps.
* **Check `.deref()` validity:** When using `WeakRef`, always handle the case where `.deref()` returns `undefined`
  because the target object has already been garbage collected.
* **Avoid relying on `FinalizationRegistry` for core logic:** Treat finalizer callbacks strictly as optional telemetry
  or cleanup hints rather than synchronous application guarantees.
* **Never use primitive values as keys in `WeakMap` or `WeakSet`:** Ensure keys are strictly objects or registered
  symbols, as primitives cannot be held weakly and will throw a `TypeError`.
* **Understand non-iterable limitations:** Design architecture knowing that `WeakMap` and `WeakSet` do not support
  iteration methods like `.forEach()` or `.keys()`.
* **Use `WeakMap` for private class state alternatives:** Implement weak maps to secure internal instance properties
  when traditional closures or modern private fields are not suitable.
* **Avoid premature optimization with `WeakRef`:** Rely on standard references and cache invalidation strategies unless
  specific memory-constrained object caching is strictly required.
* **Keep finalization registry callbacks lightweight:** Ensure functions registered for post-collection cleanup perform
  minimal synchronous operations to prevent blocking engine tasks.
* **Account for non-deterministic garbage collection timing:** Never write unit tests or core logic that depends on weak
  references being cleared at a predictable moment.
* **Do not store strong references inside weak values:** Ensure the values stored in a `WeakMap` do not reference the
  key object back strongly, which would defeat the weak collection's purpose.
* **Use `WeakSet` for tracking visited graph nodes:** Maintain visited states during recursive graph or tree traversals
  without preventing nodes from being collected if paths change.
* **Clear weak references explicitly when appropriate:** Manually delete keys from weak collections if objects need to
  be purged before the next garbage collection cycle.
* **Audit memory usage with weak structures:** Confirm that implementing weak references successfully reduces heap
  retention without introducing hidden lookup overhead.
* **Protect against unexpected `undefined` dereferences:** Always validate the result of `weakRef.deref()` before
  attempting to access properties or methods on the target object.
* **Avoid abusing `FinalizationRegistry` for critical resource freeing:** Always use explicit lifecycle methods (like
  `.destroy()` or `.close()`) for releasing heavy system resources like network sockets or file handles.
* **Understand V8 and engine GC variances:** Recognize that garbage collection behavior and the exact timing of weak
  reference clearing can differ across browser and server runtimes.
* **Document weak collection usage clearly:** Add explanatory comments detailing why a weak reference or collection was
  chosen over standard maps or arrays.
* **Review object key lifecycles carefully:** Ensure keys held in weak collections are genuinely meant to be ephemeral
  and tied to external object lifecycles.
* **Test weak reference fallback flows:** Verify that application code degrades gracefully and handles missing or
  collected weak targets without crashing.
* **Keep team standards aligned on weak APIs:** Ensure developers understand when to apply `WeakMap`, `WeakSet`, and
  `WeakRef` correctly within modern JavaScript architectures.