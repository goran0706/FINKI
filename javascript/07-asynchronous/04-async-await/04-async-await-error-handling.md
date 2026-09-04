# Error Handling

Error handling in async/await functions integrates modern asynchronous flows with standard JavaScript `try-catch`
statement blocks, providing a clean and intuitive mechanism for managing runtime exceptions. In traditional
promise-based code, developers relied heavily on `.catch()` chains or second-argument rejection handlers to intercept
failures, which frequently led to disjointed control structures when mixing synchronous and asynchronous logic. With
async/await, because awaited promises throw their rejection reasons directly into the execution context as runtime
errors, developers can use native `try-catch` blocks to handle both synchronous validation errors and asynchronous
network failures within a single unified block.

Handling rejected promises using `try-catch` requires wrapping the awaited asynchronous expression inside the `try`
block. When an awaited promise rejects, the `await` operator intercepts the rejection reason and throws it as an
exception, instantly transferring execution control to the corresponding `catch` block. This eliminates the need for
fragmented error handling across multiple promise links, allowing developers to manage errors locally or let them bubble
up naturally. If no local catch block is present, the unhandled exception causes the async function's returned promise
to reject, routing the failure to any outer calling context awaiting that function.

| Error Handling Strategy | Syntax Pattern                                       | Execution Behavior                                                 |
|:------------------------|:-----------------------------------------------------|:-------------------------------------------------------------------|
| `try-catch` Blocks      | `try { await asyncCall(); } catch (err) { ... }`     | Intercepts both synchronous errors and awaited promise rejections. |
| Rejection Bubbling      | Omitting local catch blocks inside async functions.  | Automatically rejects the async function's returned promise.       |
| Fallback Values         | Returning default data or null inside a catch block. | Recovers the control flow, returning a fulfilled promise outcome.  |

Async error propagation ensures that exceptions flow predictably through nested function calls and execution boundaries.
If an async function encounters an error that it does not catch locally, the promise returned by that function rejects
immediately, propagating the error to any caller that `await`s its execution. If the caller also lacks a `try-catch`
wrapper, the error continues to bubble up the call stack until it encounters a global unhandled rejection handler or
terminates the execution context. This transparent propagation guarantees that failures are never silently swallowed
during complex asynchronous orchestration.

### Best Practices

* **Unified Error Catching:** Combine synchronous validation logic and asynchronous `await` calls inside a single
  `try-catch` block to streamline error management.
* **Avoid Swallowing Failures:** Ensure that catch blocks either handle errors meaningfully, return safe fallbacks, or
  re-throw exceptions for higher-level handling.
* **Contextual Error Wrapping:** Catch low-level errors and wrap them in descriptive application-specific error classes
  before re-throwing across module boundaries.
* **Caller Awareness:** Remember that unhandled errors in async functions result in rejected promises that must be
  handled by the calling environment.