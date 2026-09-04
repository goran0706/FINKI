# Loop Performance Considerations

## Loop Performance

**Loop Performance:** The efficiency characteristics of repeated code execution, determined by the amount of work
performed during each iteration and the total number of iterations required.

The loop syntax itself is usually less important than the operations performed inside the loop, which depend on key
execution factors:

| Factor               | Description                                |
|:---------------------|:-------------------------------------------|
| Iteration count      | Number of times the loop body executes     |
| Work per iteration   | Operations performed during each execution |
| Data size            | Amount of data being processed             |
| Algorithm complexity | Growth rate as input size increases        |

## Time Complexity

**Time Complexity:** A measurement of how the amount of computation grows as the input size increases. A loop that
executes efficiently on a small dataset may become expensive when processing large amounts of data.

Common loop complexity patterns:

| Pattern                   | Complexity | Description                                  |
|:--------------------------|:-----------|:---------------------------------------------|
| Single loop               | `O(n)`     | Processes each item once                     |
| Nested loops              | `O(n²)`    | Processes each item against every other item |
| Multiple sequential loops | `O(n)`     | Separate passes through the same data        |

## Avoid Repeated Work Inside Loops

**Repeated Work:** Operations that produce the same result during every iteration but are executed repeatedly. The goal
is to avoid performing identical work multiple times.

Examples of expensive repeated operations and their alternatives:

| Operation                     | Better Approach                                  |
|:------------------------------|:-------------------------------------------------|
| Recalculating constant values | Compute before the loop                          |
| Repeated property access      | Store frequently used values when appropriate    |
| Repeated function calls       | Move outside the loop if the result is unchanged |

## Array Processing Performance

Different iteration methods can have different overhead, but algorithm design usually has a larger performance impact
than the choice between similar loop constructs.

Array iteration performance depends on:

| Factor                    | Effect                                      |
|:--------------------------|:--------------------------------------------|
| Array size                | More elements require more iterations       |
| Mutation during iteration | Can change iteration behavior               |
| Callback overhead         | Method calls add execution cost             |
| Allocation                | Creating new objects increases memory usage |

## Nested Loop Performance

**Nested Loop Cost:** A loop inside another loop multiplies the number of operations performed. For example, processing
every element against every other element creates quadratic growth. Reducing unnecessary iterations is usually more
effective than optimizing individual loop operations.

Common alternatives to nested loops:

| Problem             | Alternative                          |
|:--------------------|:-------------------------------------|
| Repeated searching  | Use indexed lookup structures        |
| Pair comparison     | Reduce unnecessary comparisons       |
| Duplicate detection | Use `Set` or `Map` where appropriate |

## Memory Considerations

Loop performance is affected by memory usage as well as execution time. Reusing existing structures can reduce
unnecessary allocations when appropriate.

Creating new objects during every iteration impacts memory by increasing:

| Impact             | Result                        |
|:-------------------|:------------------------------|
| Memory allocation  | More work for the runtime     |
| Garbage collection | Additional cleanup operations |
| Temporary values   | Increased memory pressure     |

## JavaScript Engine Optimization

Modern JavaScript engines perform runtime optimization based on observed code behavior. Code should prioritize
correctness and clear design before attempting engine-specific optimizations.

Optimization can be affected by:

| Behavior                    | Potential Impact                       |
|:----------------------------|:---------------------------------------|
| Changing data types         | Reduces optimization opportunities     |
| Unpredictable object shapes | Makes property access less predictable |
| Excessive allocations       | Increases memory management work       |

## Choosing the Correct Iteration Method

The most appropriate loop depends on the required behavior, as performance should not be the only selection
criteria—readability and correctness determine maintainability:

| Requirement                    | Suitable Choice                             |
|:-------------------------------|:--------------------------------------------|
| Need index control             | `for` loop                                  |
| Need iterable values           | `for...of`                                  |
| Need object keys               | `for...in` or object methods                |
| Need functional transformation | Array methods such as `map()` or `filter()` |
| Need early termination         | Loop statements with `break`                |

## Best Practices

* **Optimize the algorithm before optimizing the loop syntax:** Reducing unnecessary operations usually provides larger
  performance improvements than changing between equivalent iteration styles.
* **Avoid unnecessary work inside loops:** Move calculations, lookups, and operations outside the loop when their
  results do not change.
* **Be careful with nested loops:** Verify whether the algorithm can avoid repeated comparisons or use more efficient
  data structures.
* **Avoid premature optimization:** Measure actual performance issues before introducing complexity for theoretical
  improvements.
* **Consider memory allocation costs:** Creating large numbers of temporary objects during iteration can affect runtime
  performance.
* **Use profiling for performance decisions:** JavaScript performance depends on the runtime environment, data size, and
  actual execution behavior.
* **Cache array lengths before iteration:** Store array length in a local variable when using traditional `for` loops to
  prevent repeated property lookups on every single iteration pass.
* **Prefer `for...of` loops over higher-order array methods for raw speed:** Use standard `for...of` iteration when
  processing extremely performance-sensitive datasets to bypass functional callback overhead.
* **Avoid mutating collections during active iteration:** Prevent unpredictable indexing shifts and infinite loops by
  avoiding array or object modifications while traversing them.
* **Leverage `Set` and `Map` for constant-time lookups:** Replace nested lookup loops with hash-based structures to
  reduce algorithm complexity from quadratic time down to linear time.
* **Minimize closure allocations inside loop bodies:** Avoid defining inline callback functions or arrow functions
  inside high-frequency loops to prevent excessive memory allocation churn.
* **Choose early exit mechanisms when searching:** Use `break` or `return` statements inside loops as soon as target
  elements are found to avoid unnecessary remaining iterations.
* **Keep object shapes uniform within loops:** Ensure objects modified or processed inside loops maintain consistent
  property structures to maximize JavaScript engine inline cache efficiency.
* **Avoid heavy synchronous operations in UI thread loops:** Offload massive iterative computations to Web Workers or
  chunk execution using asynchronous yields to prevent blocking the main browser thread.
* **Reuse mutable accumulator objects where feasible:** Update properties on a single pre-allocated object instead of
  instantiating new objects inside tight loops to reduce garbage collection pressure.
* **Never call `delete obj.prop` inside a loop body on objects you'll keep using — it forces V8 into "dictionary mode"
  for that object.** Deleting a property converts the object's fast hidden-class-backed storage into a slower hash-table
  representation permanently, tanking every subsequent property access, not just the deleted one. Set the property to
  `undefined` instead if the slot needs clearing, or restructure to avoid needing deletion at all.
* **Avoid using the `arguments` object inside hot loop-containing functions — it opts the whole function out of several
  V8 optimizations.** `arguments` is a legacy array-like exotic object that's expensive to materialize and historically
  blocks inlining. Use rest parameters (`function f(...args)`) instead; they're a real array and don't carry the same
  deoptimization baggage.
* **Avoid `try/catch` wrapping the entire body of a hot loop — put it around the smallest possible unit of risky work,
  ideally outside the loop or around a single call.** Older engines fully deoptimized functions containing `try/catch`;
  modern V8 handles this much better, but a `try` block still inhibits some inlining decisions around the wrapped code.
  Catching at the call site rather than around the whole iteration keeps the optimizable surface larger.
* **For large numeric datasets, use `TypedArray`s (`Float64Array`, `Int32Array`, etc.) instead of plain arrays inside
  computational loops.** Typed arrays store raw, contiguous, unboxed numeric memory — no hidden-class checks, no risk of
  `NaN`/holes/mixed types silently making the array polymorphic. This is a genuine, measurable win for numeric hot loops
  (image processing, physics, audio), not a micro-optimization.
* **Never build a string with `+=` inside a large loop when a batch operation is available — but note V8's rope-based
  string concatenation already makes this less catastrophic than older engines' O (n²) reallocation.** For genuinely
  large output, prefer collecting parts in an array and joining once (`parts.push(x); parts.join('')`), which guarantees
  linear behavior regardless of engine string internals rather than relying on an implementation detail.
* **Watch for accidental sparse arrays (holes) creeping into loop-processed data — they silently push V8 into a slower
  "dictionary" element kind.** Assigning past the current length (`arr[10] = x` on a length-3 array), or using
  `delete arr[i]`, creates holes that downgrade the array's internal representation from packed too holey to
  dictionary-mode elements, each step slower than the last for iteration.
