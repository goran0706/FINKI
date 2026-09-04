# Garbage Collection

## Core Concepts & Automatic Management

**Garbage Collection (GC):** The automatic memory management process performed by JavaScript engines to reclaim memory
occupied by objects that are no longer needed by the application.

| GC Concept / Mechanism          | Description / Behavior                                                                                                           |
|:--------------------------------|:---------------------------------------------------------------------------------------------------------------------------------|
| **Automatic Memory Management** | Developers do not manually allocate or free memory; the engine handles reclamation behind the scenes                             |
| **Reachability**                | The core principle determining whether an object remains in memory based on whether it is accessible via the root reference tree |
| **Garbage Collector**           | The engine subsystem responsible for identifying unreachable objects and sweeping their memory                                   |

## Mark-and-Sweep Algorithm

The primary algorithm used by modern JavaScript engines (such as V8) to identify and clear dead memory.

| Phase              | Action / Mechanism                                                                                                                                                         |
|:-------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **1. Mark Phase**  | The collector starts from global roots (e.g., `window`, global variables, active stack frames) and traverses all references, marking every reachable object it encounters. |
| **2. Sweep Phase** | The engine scans the heap, clearing out memory blocks occupied by unmarked (unreachable) objects and returning them to the free memory pool.                               |

## Reference Counting Concepts

An older, simpler memory management approach (largely superseded by mark-and-sweep due to circular reference
limitations).

| Aspect         | Behavior / Limitation                                                                                                                                                        |
|:---------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Mechanism**  | Tracks the number of references pointing to an object. When the count drops to zero, the object is immediately collected.                                                    |
| **Limitation** | **Circular References:** If two objects reference each other but have no connection to root roots, their reference counts remain above zero, causing permanent memory leaks. |

## Best Practices

* **Understand root reachability:** Keep in mind that global variables, active DOM elements, and active closures act as
  permanent root anchors that prevent objects from being garbage collected.
* **Avoid accidental globals:** Unintentional global variables persist for the lifetime of the application, blocking
  memory reclamation.
* **Clear references to allow collection:** Nullify object variables, array elements, and property pointers when data is
  no longer needed so it becomes unreachable from roots.
* **Avoid circular references in isolated scopes:** Break interdependent object linkages when disposing of complex data
  structures, especially if dealing with older reference-counting environments.
* **Be mindful of closure retention:** Ensure inner functions and callbacks do not capture unnecessary outer scope
  variables that keep large data structures reachable.
* **Remove event listeners promptly:** Unbind event listeners from global targets and long-lived elements during unmount
  phases so handler functions and their scopes can be collected.
* **Clear timers and intervals:** Explicitly invoke `clearInterval` and `clearTimeout` to prevent background callbacks
  from holding reference roots active indefinitely.
* **Use `WeakMap` and `WeakSet` for metadata:** Leverage weak collections to attach side data to objects without
  preventing those keys from being garbage collected when dropped elsewhere.
* **Unsubscribe from reactive streams:** Terminate subscriptions to event emitters, observables, and pub/sub channels to
  sever roots linking to destroyed components.
* **Dispose of detached DOM trees:** Ensure references to removed DOM elements are cleared so the entire detached node
  tree becomes unreachable.
* **Minimize long-lived global singletons:** Restrict application state stores from accumulating obsolete objects
  without an eviction strategy or size cap.
* **Avoid dynamic property mutations on hot objects:** Keep object shapes stable to help JavaScript engines optimize
  memory allocation and garbage collection paths.
* **Profile garbage collection pauses:** Use browser DevTools performance monitors to detect frequent or long-running GC
  pauses that degrade UI responsiveness.
* **Test reachability assumptions explicitly:** Write memory profiling checks to confirm that components and data models
  leave zero lingering root references after disposal.
* **Avoid retaining large payloads in error logs:** Ensure exception-handling blocks release massive request or response
  objects once logging completes.
* **Clean up Web Workers and Message Channels:** Terminate worker threads and close communication ports when their
  active lifecycle concludes.
* **Release graphics and canvas resources:** Explicitly clear textures, rendering contexts, and WebGL buffers when
  tearing down heavy UI views.
* **Keep variable scopes strictly bounded:** Restrict variable declarations to local blocks so references naturally fall
  out of scope and lose root connection.
* **Audit dependencies for memory leaks:** Inspect third-party packages to verify they properly clean up internal
  listeners, caches, and global references.
* **Educate engineering teams on GC behavior:** Ensure developers understand reachability, roots, and Mark-and-Sweep
  mechanics to write memory-efficient code.