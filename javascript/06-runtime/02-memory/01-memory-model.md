# Memory Model

## Core Concepts & Architecture

**JavaScript Memory Model:** The underlying architecture JavaScript engines (such as V8) use to automatically allocate,
manage, and free memory during program execution.

| Memory Region    | Storage Type                     | Data Stored                                                                                                              | Characteristics                                                                                                 |
|:-----------------|:---------------------------------|:-------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------|
| **Stack Memory** | Primitive & Reference Pointers   | Primitive values (`String`, `Number`, `BigInt`, `Boolean`, `null`, `undefined`, `Symbol`, ) and pointers to heap objects | Fixed size, managed via Last-In-First-Out (LIFO) execution contexts, extremely fast allocation and deallocation |
| **Heap Memory**  | Complex & Dynamic Reference Data | Objects, Arrays, Functions, and dynamic structures                                                                       | Unstructured, dynamically sized region managed by the garbage collector                                         |

## Primitive vs. Reference Storage

| Storage Category      | Allocation Location          | Assignment & Copy Behavior                                                                           | Mutation Behavior                                                                             |
|:----------------------|:-----------------------------|:-----------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------|
| **Primitive Storage** | Stack (or inlined by JIT)    | **Copied by value:** Assigning a primitive copies the actual value.                                  | Immutable values; operations return new values.                                               |
| **Reference Storage** | Heap (with pointer on Stack) | **Copied by reference:** Assigning an object copies the memory address pointer, not the data itself. | Mutable structures; modifying properties affects all variables pointing to that heap address. |

## Architectural Behavior & Engine Details

* **Dynamic Typing & Memory:** JavaScript engines dynamically determine memory requirements at runtime based on value
  types.
* **JIT Optimization:** Engines like V8 utilize hidden classes (hidden maps) and inline caching to optimize property
  lookups on heap-allocated objects.
* **Stack Frames:** Every function call creates a new stack frame holding its local variables and execution state, which
  is instantly popped off when the function returns.

## Best Practices

* **Understand stack vs. heap allocation:** Keep in mind that lightweight primitives reside on the stack while complex
  objects and functions are stored dynamically on the heap.
* **Be mindful of reference copying:** Recognize that assigning or passing objects copies references rather than deep
  values, leading to shared state mutation risks.
* **Leverage primitive immutability:** Design functions around immutable primitives to avoid unintended side effects
  during variable reassignment.
* **Keep object mutations controlled:** Avoid widespread sharing of mutable heap objects to prevent difficult-to-track
  bugs across dependent components.
* **Avoid unnecessary heap allocations in tight loops:** Reuse objects or primitives to minimize garbage collection
  pressure during high-frequency execution.
* **Watch out for accidental reference sharing:** Clone objects or use shallow/deep copies when distinct instances are
  required to prevent data corruption.
* **Keep stack frames lightweight:** Avoid excessively deep recursion or massive local variable declarations that can
  cause stack overflow errors.
* **Understand JIT optimization impacts:** Maintain consistent object shapes (hidden classes) to help JavaScript engines
  optimize property access speeds.
* **Monitor memory consumption patterns:** Use browser development tools to analyze stack usage and heap growth during
  intensive application workflows.
* **Clean up heavy references explicitly:** Nullify large object pointers when they are no longer needed to free heap
  memory for future allocations.
* **Use primitive values for simple states:** Prefer primitives over boxed wrapper objects to optimize memory footprint
  and execution performance.
* **Test reference equality behaviors carefully:** Use appropriate comparison checks (`===` vs. deep equality utilities)
  when evaluating object and primitive states.
* **Isolate mutable state within modules:** Restrict direct access to shared heap structures by encapsulating them
  inside controlled factory or module boundaries.
* **Avoid retaining old stack frames via closures:** Ensure inner functions do not unintentionally trap large outer
  scope variables in heap memory indefinitely.
* **Profile memory leaks regularly:** Audit heap snapshots to identify unreleased reference pointers that prevent proper
  garbage collection cycles.
* **Optimize data structures for engine efficiency:** Choose appropriate built-in collections (like arrays, maps, or
  sets) based on access patterns and memory overhead.
* **Review object initialization patterns:** Initialize object properties consistently to ensure the JIT compiler
  generates efficient hidden classes.
* **Document shared reference contracts:** Clearly specify when functions mutate passed objects versus returning new
  immutable instances.
* **Keep variable scopes strictly defined:** Restrict variable declarations to local blocks so stack memory and local
  references are reclaimed immediately upon exit.
* **Educate engineering teams on memory models:** Ensure developers understand stack allocation, heap referencing, and
  GC mechanics to write robust, performant code.