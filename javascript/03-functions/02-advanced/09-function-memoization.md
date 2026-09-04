# Memoization

## Memoization Concept

**Memoization:** An optimization technique that stores previously calculated results in a cache and reuses them when the
same inputs occur again, improving performance by avoiding repeated execution of expensive calculations.

## Memoization Structure

A memoized function contains a cache, an identifying key, and stored results to skip repeated computation on future
calls.

| Component     | Purpose                              |
|:--------------|:-------------------------------------|
| Cache         | Stores previously calculated results |
| Key           | Identifies input values              |
| Stored result | Reused output                        |

## Memoization Process

A memoized function receives input values, checks the cache, returns existing results if available, or calculates,
stores, and returns new results if missing.

## Memoization and Pure Functions

Memoization works best with pure functions because deterministic outputs guarantee that cached results remain valid
without interference from external state changes.

## Cache Storage

Memoization utilizes various storage mechanisms depending on the input data type.

| Storage Type           | Usage                    |
|:-----------------------|:-------------------------|
| Object                 | Simple key-value caching |
| Map                    | Flexible key handling    |
| WeakMap                | Object reference caching |
| Custom cache structure | Advanced strategies      |

## Memoization and Closures

Memoization uses closures to keep cache data private, persistent between executions, and secure from direct external
modification.

## Benefits of Memoization

| Benefit              | Description                    |
|:---------------------|:-------------------------------|
| Faster execution     | Avoids repeated calculations   |
| Reduced computation  | Reuses existing results        |
| Improved performance | Helps expensive operations     |
| Better efficiency    | Reduces unnecessary processing |

## Suitable Memoization Scenarios

Memoization provides value when functions are expensive, inputs repeat often, results are deterministic, and calls occur
frequently.

| Situation                 | Reason                                |
|:--------------------------|:--------------------------------------|
| Function is expensive     | Calculation requires significant work |
| Inputs repeat often       | Cached results can be reused          |
| Function is deterministic | Previous results remain valid         |
| Calls occur frequently    | Cache provides noticeable improvement |

## Examples of Memoization Use

| Operation               | Purpose                         |
|:------------------------|:--------------------------------|
| Recursive calculations  | Reduce repeated branches        |
| Data processing         | Avoid duplicate transformations |
| Mathematical algorithms | Store previous results          |
| Expensive computations  | Reduce execution time           |

## Memoization Limitations

| Limitation        | Description                           |
|:------------------|:--------------------------------------|
| Memory usage      | Cache requires storage                |
| Cache management  | Old values may need removal           |
| Input complexity  | Complex keys require careful handling |
| Incorrect caching | Invalid for changing external data    |

## Memoization and Memory Management

Uncontrolled caches can grow indefinitely, requiring mitigation strategies such as cache limits, expiration rules,
manual clearing, or weak references.

## Memoization vs Caching

| Feature                       | Memoization            | General Caching           |
|:------------------------------|:-----------------------|:--------------------------|
| Purpose                       | Store function results | Store any reusable data   |
| Scope                         | Usually function-level | Application-wide possible |
| Input-based                   | Yes                    | Not always                |
| Requires deterministic output | Usually                | Not always                |

## Memoization vs Recalculation

| Feature            | Memoized Function          | Normal Function           |
|:-------------------|:---------------------------|:--------------------------|
| First execution    | Calculates result          | Calculates result         |
| Repeated execution | Uses cache                 | Recalculates              |
| Memory usage       | Higher                     | Lower                     |
| Performance        | Faster for repeated inputs | Consistent execution cost |

## Use Cases

* **Expensive calculations:** Avoid repeating costly operations.
* **Recursive algorithms:** Reduce duplicate recursive calls.
* **Data transformations:** Reuse previously processed results.
* **Performance optimization:** Improve frequently executed functions.

## Best Practices

* **Memoize pure functions:** Ensure cached results remain valid by avoiding external dependencies.
* **Avoid memoizing functions with changing external dependencies:** Prevent stale or incorrect cached data.
* **Measure before optimizing:** Apply memoization only when proven performance benefits exist.
* **Control cache size:** Prevent unbounded memory growth using limits or expiration.
* **Consider input complexity:** Ensure cache keys accurately represent all function arguments.
* **Implement Least Recently Used (LRU) eviction policies:** Purge stale cache entries automatically when storage limits
  are reached to maintain optimal memory consumption.
* **Serialize complex arguments for reliable cache keys:** Convert arrays and objects into JSON strings or custom
  identifiers when using standard plain objects as lookup caches.
* **Use `Map` for high-frequency dynamic key lookups:** Prefer `Map` instances over native object literals to prevent
  prototype pollution and handle non-string parameter types securely.
* **Leverage `WeakMap` for automatic garbage collection:** Store caches tied to object references using `WeakMap` so
  entries are removed automatically when target objects are destroyed.
* **Avoid memoizing trivial low-cost functions:** Refrain from adding memoization overhead to lightweight calculations
  where cache lookup times exceed the actual execution cost.
* **Isolate cache structures inside closure scopes:** Keep memoization caches private to the function wrapper to prevent
  accidental external corruption or direct mutation.
* **Test memoized behavior explicitly via execution counts:** Write unit tests asserting that repeated calls with
  identical inputs retrieve cached values without re-triggering core calculation logic.
* **Handle multi-argument functions carefully:** Ensure custom hashing functions combine all parameter values accurately
  to prevent collision bugs across different input combinations.
* **Reset or clear caches during state changes:** Provide a mechanism to invalidate or flush cached values when
  underlying application states or data schemas are modified.
* **Monitor heap allocation in production environments:** Track memory usage closely when memoizing large datasets or
  unbounded recursive outputs to prevent memory leak exceptions.
* **Pass custom cache strategies as configuration options:** Build reusable memoization high-order functions that accept
  pluggable cache limits or custom key generators.
* **Avoid memoizing functions with side effects:** Prevent caching bugs by ensuring that actions performing I/O or
  mutating state never pass through memoization wrappers.
* **Cache intermediate recursive states selectively:** Apply memoization to overlapping subproblems in recursive
  divide-and-conquer algorithms to convert exponential runtimes into linear or polynomial speeds.
* **Document caching assumptions and limitations clearly:** Note cache invalidation rules and memory footprints in
  function documentation for other team members.
* **Adopt memoization as a targeted optimization tool:** Apply caching layers strictly to verified performance
  bottlenecks rather than prematurely wrapping every function in an application.