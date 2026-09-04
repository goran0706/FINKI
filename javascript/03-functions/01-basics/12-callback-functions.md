# Callback Functions

## Callback Function Concept

**Callback Function:** A function passed as an argument to another function so it can be executed later or at a specific
point during execution, allowing one piece of code to provide behavior to another without controlling the exact
execution timing.

## Callback Relationship

Callbacks involve a collaboration between a higher-order function that receives or controls the callback and the
callback function that provides the behavior to execute.

| Component             | Description                       |
|:----------------------|:----------------------------------|
| Higher-order function | Receives or controls the callback |
| Callback function     | Provides the behavior to execute  |

## Callback Execution

**Callback Execution:** The process where a function provided as an argument is invoked by another function based on
execution timing systems.

| Pattern              | Execution Timing                          |
|:---------------------|:------------------------------------------|
| Immediate callback   | Executed during the current function call |
| Deferred callback    | Executed later                            |
| Conditional callback | Executed only when a condition occurs     |

## Synchronous Callbacks

**Synchronous Callback:** A callback executed immediately during the execution of the calling function, which waits for
completion before proceeding, commonly used in array processing, sorting, and custom iteration.

| Usage              | Purpose                     |
|:-------------------|:----------------------------|
| Array processing   | Transform or inspect values |
| Sorting operations | Compare elements            |
| Custom iteration   | Execute logic for each item |

## Asynchronous Callbacks

**Asynchronous Callback:** A callback executed later after an external operation completes via runtime scheduling
mechanisms without blocking the calling function.

| Source             | Example Purpose         |
|:-------------------|:------------------------|
| Timers             | Execute after a delay   |
| Events             | Respond to user actions |
| Network operations | Process returned data   |

## Callback Patterns

### Single Callback Pattern

A function receives one callback that represents the main behavior to execute for simple customization.

### Multiple Callback Pattern

A function receives multiple callbacks representing different execution outcomes.

| Callback Type       | Purpose                      |
|:--------------------|:-----------------------------|
| Success callback    | Handle successful completion |
| Error callback      | Handle failures              |
| Completion callback | Execute cleanup logic        |

### Configuration Callback Pattern

A function receives callbacks through configuration objects when many optional behaviors are available.

## Callback Arguments

Callbacks can receive values from the invoking function, which determines argument count, order, and meaning according
to the callback contract.

| Behavior            | Description                  |
|:--------------------|:-----------------------------|
| Number of arguments | How many values are provided |
| Argument order      | Position of provided values  |
| Argument meaning    | Purpose of each value        |

## Callback Context

Callbacks may experience context loss when passed to another function due to control shifting to the receiving system,
which can be mitigated using arrow functions, `bind()`, or wrapper functions.

| Technique         | Purpose                         |
|:------------------|:--------------------------------|
| Arrow functions   | Preserve lexical `this`         |
| `bind()`          | Explicitly set function context |
| Wrapper functions | Control invocation behavior     |

## Callback Hell

**Callback Hell:** A code structure where many nested callbacks create deep nesting, mixed responsibilities, and
difficult maintenance, leading modern JavaScript to utilize Promises and async/await.

| Cause                  | Effect                |
|:-----------------------|:----------------------|
| Deep nesting           | Harder code structure |
| Mixed responsibilities | Difficult maintenance |
| Complex error handling | Increased complexity  |

## Error Handling with Callbacks

Traditional callback patterns use explicit error handling approaches to make failure management predictable.

| Pattern                 | Description                         |
|:------------------------|:------------------------------------|
| Error-first callbacks   | Error passed as first argument      |
| Separate error callback | Failure handled independently       |
| Try/catch wrapper       | Handles synchronous callback errors |

## Callbacks and Higher-Order Functions

Callbacks demonstrate first-class function behavior as a practical application of higher-order functions.

| Concept               | Role                                  |
|:----------------------|:--------------------------------------|
| Higher-order function | Receives or returns functions         |
| Callback              | Function provided for later execution |

## Best Practices

* **Keep callbacks small:** Ensure a callback focuses strictly on the single behavior it provides.
* **Document callback expectations:** Clearly define expected arguments and execution timing.
* **Separate callback logic from control flow:** Let callers manage execution structure while callbacks supply specific
  behavior.
* **Avoid excessive nesting:** Opt for cleaner structures when callback chains become overly complex.
* **Preserve context intentionally:** Use `bind()` or arrow functions to prevent unexpected context loss.
* **Adopt error-first callback conventions for Node.js workflows:** Pass errors as the first parameter (e.g.,
  `callback(err, data)`) to standardize asynchronous error handling across utility functions.
* **Avoid mixing synchronous and asynchronous callbacks:** Ensure callback functions execute consistently either always
  synchronously or always asynchronously to prevent race conditions and unpredictable control flow.
* **Clean up event listeners and timers:** Remove registered event callbacks or clear active timeout/interval references
  when components unmount or operations complete to prevent memory leaks.
* **Use arrow functions to preserve lexical `this`:** Leverage arrow functions when passing inline callbacks to maintain
  access to the outer class or component context without manual binding.
* **Refactor callback hell into Promises or async/await:** Migrate deeply nested asynchronous callback chains to modern
  `async/await` syntax to improve code readability and maintainability.
* **Validate callback existence before invocation:** Guard dynamic callback calls with optional chaining (e.g.,
  `callback?.(result)`) to prevent runtime crashes when optional parameters are omitted.
* **Handle synchronous errors inside asynchronous boundaries:** Wrap asynchronous callback invocations in `try...catch`
  blocks or ensure error parameters are propagated correctly to avoid unhandled exceptions.
* **Name anonymous callback functions:** Assign descriptive names to callback functions rather than relying strictly on
  anonymous arrow functions to enhance stack trace debugging performance.
* **Limit the number of callback arguments:** Keep callback function signatures clean by passing parameter objects
  instead of long positional argument lists when multiple values are required.
* **Never swallow errors in silent catch blocks:** Ensure that error-handling callbacks always log, report, or rethrow
  caught exceptions rather than failing silently during execution.