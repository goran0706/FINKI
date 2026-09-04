# Promises in JavaScript / ECMAScript

## Core Architectural Concept

A Promise is a stateful proxy object representing the eventual completion or failure of an asynchronous operation and
its resulting value. It serves as a structured abstraction over asynchronous control flows, eliminating deeply nested
callback patterns and standardizing asynchronous error propagation.

## ECMAScript Specification Architecture

### The Three States of a Promise

According to the ECMA-262 specification, a Promise must exist in one of three mutually exclusive states at any given
moment:

* **Pending:** Initial operational state; operational computation is still in progress.
* **Fulfilled:** Operation completed successfully; bound permanently to a fulfillment value.
* **Rejected:** Operation failed; bound permanently to a rejection reason.

A Promise is Settled if it is fulfilled or rejected. Once settled, state transitions are irreversible and immutable.

## Microtask Queue Mechanics and Job Scheduling

Promise reaction callbacks do not execute synchronously when a promise resolves. Instead, they are enqueued onto the
Microtask Job Queue.

* The executor function passed to a new promise executes synchronously immediately upon creation.
* Callbacks registered via `.then()` are queued as microtasks when the promise settles.
* Microtasks execute after the current execution context completes, prior to picking the next task from the Event Loop's
  Macrotask Queue.

## Comprehensive API Surface

### Instance Methods

| Method      | Signature                       | Specification Behavior                                                                                       |
|:------------|:--------------------------------|:-------------------------------------------------------------------------------------------------------------|
| `then()`    | `then(onFulfilled, onRejected)` | Registers resolution/rejection handlers and returns a new Promise chained to handler return values.          |
| `catch()`   | `catch(onRejected)`             | Syntax sugar for `.then(null, onRejected)` to catch errors in the chain.                                     |
| `finally()` | `finally(onFinally)`            | Executes a side-effect handler when settled without altering original fulfillment value or rejection reason. |

### Static Combinator Methods

| Combinator Method              | Operational Behavior                                               | Short-Circuit Condition                              | Primary Use Case                                             |
|:-------------------------------|:-------------------------------------------------------------------|:-----------------------------------------------------|:-------------------------------------------------------------|
| `Promise.all(iterable)`        | Fulfills with array of values when all promises fulfill.           | Rejects immediately when any promise rejects.        | All-or-nothing parallel operations.                          |
| `Promise.allSettled(iterable)` | Fulfills with array of descriptor objects after all settle.        | Never short-circuits.                                | Tracking outcomes of batch operations regardless of failure. |
| `Promise.race(iterable)`       | Settles with the state and outcome of the first promise to settle. | Settles on first fulfillment or rejection.           | Task timeouts and cancellation racing.                       |
| `Promise.any(iterable)`        | Fulfills as soon as any promise fulfills.                          | Rejects with an error only when all promises reject. | Requesting redundant mirrors or fallbacks.                   |

## Best Practices

* **Avoid Floating Promises:** Always chain, return, or await promises. Unhandled promises can cause silent failures or
  terminate node processes.
* **Use Promise.allSettled for Independent Batch Jobs:** Avoid losing valid task results in batch execution when one
  non-critical request fails.
* **Always Throw Error Instances:** Avoid rejecting promises with string literals or plain primitives. Reject with
  instantiated Error objects to preserve full stack traces.
* **Handle promise rejections explicitly:** Always append `.catch()` blocks or wrap `await` expressions in `try...catch`
  blocks to catch asynchronous errors gracefully.
* **Avoid mixing callbacks and promises:** Convert traditional error-first callback APIs using `util.promisify()` or
  manual wrapping instead of intertwining styles.
* **Return promises inside `.then()` chains:** Always return inner promises from `.then()` callbacks to ensure correct
  sequential execution and prevent detached microtasks.
* **Use `Promise.withResolvers()` for decoupled control:** Leverage `Promise.withResolvers()` when you need to expose
  promise resolve and reject handles outside the executor scope.
* **Beware of unhandled rejection warnings:** Listen for `unhandledrejection` events globally in browser environments or
  Node.js to catch forgotten error handlers during development.
* **Prefer `async/await` syntax for complex sequences:** Write linear asynchronous workflows using `async/await` to
  improve readability over deeply nested `.then()` chains.
* **Avoid sequential awaiting independent tasks:** Execute independent asynchronous operations concurrently using
  `Promise.all()` instead of awaiting them one by one unnecessarily.
* **Guard against race conditions with state flags:** Manage asynchronous state updates carefully when multiple
  overlapping promises can mutate shared component variables.
* **Understand microtask queue starvation:** Be cautious when spawning recursive microtasks inside promise handlers, as
  they can block rendering and task queue processing.
* **Use `AbortController` for cancellable asynchronous flows:** Pass signals from an `AbortController` into fetch
  requests or promise wrappers to cancel stale asynchronous tasks properly.
* **Keep async functions returning promises:** Remember that any `async` function implicitly wraps its return value in a
  resolved promise, even when returning raw primitives.
* **Test asynchronous code with explicit assertions:** Ensure test runners await asynchronous assertions properly or
  return promises to catch test failures accurately.