# Asynchronous Error Handling

## Core Concepts & Mechanics

**Asynchronous Error Handling:** The process of detecting, managing, and recovering from failures in non-blocking
operations (e.g., file systems, network communication, APIs).

| Asynchronous Pattern      | Mechanism / Syntax                                                    | Error Handling Approach                                              |
|:--------------------------|:----------------------------------------------------------------------|:---------------------------------------------------------------------|
| **Error-First Callbacks** | `callback(error, result)`                                             | Checking the first argument for failure before processing the result |
| **Promises**              | `.catch(error => ...)` or states (`Pending`, `Fulfilled`, `Rejected`) | Handling rejections through chain propagation                        |
| **Async / Await**         | `async function` paired with `try / catch`                            | Managing rejected promises with familiar synchronous control flow    |

## Multi-Operation Coordination & Failures

| Coordination Method    | Error Behavior                                                     | Use Case                                                |
|:-----------------------|:-------------------------------------------------------------------|:--------------------------------------------------------|
| `Promise.all()`        | Rejects immediately if any single promise rejects                  | Operations that must all succeed together               |
| `Promise.allSettled()` | Waits for all promises to settle regardless of success or failure  | Batch tasks where individual failure reports are needed |
| `Promise.any()`        | Rejects only if all promises reject; resolves on the first success | Trying multiple fallback sources until one works        |

## Resiliency Patterns

| Resiliency Pattern              | Purpose / Description                                                                            | Guardrail / Best Practice                                                   |
|:--------------------------------|:-------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------|
| **Network vs. HTTP Separation** | Distinguishing low-level transport breaks from valid responses returning HTTP error status codes | Check both transport stability and status ranges (e.g., `response.ok`)      |
| **Retry Pattern**               | Re-attempting failed temporary operations (e.g., transient network glitches)                     | Enforce max attempt limits and backoff strategies to prevent infinite loops |
| **Timeout Handling**            | Imposing strict execution limits on long-running asynchronous tasks                              | Prevent operations and connections from hanging indefinitely                |

## Best Practices

* **Handle all rejections explicitly:** Prevent unhandled promise rejections that lead to unpredictable application
  states.
* **Pair `async/await` with `try/catch`:** Keep asynchronous error recovery readable and structured.
* **Control retry loops:** Always cap retry attempts with limits or backoffs to avoid overwhelming downstream services.
* **Preserve error context:** Retain original stack traces and error data when wrapping or propagating asynchronous
  failures.
* **Never mix async/await with raw `.catch()` haphazardly:** Choose a single consistent error-handling style within
  functions to maintain readability.
* **Always return or await promises in try blocks:** Ensure asynchronous calls inside `try` blocks are properly awaited
  so their rejections can be caught locally.
* **Check HTTP status codes manually for fetch errors:** Remember that network fetch requests do not throw on HTTP
  status errors (like `404` or `500`) unless response validation fails.
* **Implement timeout abort controllers:** Use `AbortController` combined with `setTimeout` to cancel long-running
  asynchronous network requests cleanly.
* **Handle unhandled rejection events globally:** Set up window or process listeners (`unhandledrejection`) as a final
  safety net for uncaught async errors.
* **Avoid unawaited asynchronous loops:** Ensure async operations running inside loops are correctly coordinated using
  `Promise.all()` or sequential execution where appropriate.
* **Use `Promise.allSettled()` for independent tasks:** Prefer settled batch handlers when you need to process mixed
  outcomes without failing the entire batch on a single rejection.
* **Log asynchronous stack traces carefully:** Ensure asynchronous tooling and source maps are configured properly so
  async stack traces remain clear during debugging.
* **Test async error paths with async assertions:** Write test cases using async/await syntax to verify that rejected
  promises trigger correct catch handlers.
* **Clean up asynchronous subscriptions on unmount:** Ensure active listeners, intervals, or streams are disconnected
  when asynchronous components are destroyed.
* **Implement exponential backoff for network retries:** Add jitter and increasing delays between retry attempts to
  prevent cascading server traffic jams.
* **Guard against race conditions in async states:** Ensure rapid asynchronous calls do not resolve out-of-order and
  corrupt component state or UI data.
* **Catch initialization errors in async modules:** Handle dynamic import or module initialization failures safely to
  prevent application-wide startup crashes.
* **Sanitize error messages returned from async APIs:** Filter out internal backend failure diagnostics before passing
  error messages down to client interfaces.
* **Review asynchronous concurrency limits:** Restrict the number of parallel async operations running simultaneously to
  protect memory and connection limits.
* **Maintain uniform async error response shapes:** Standardize error formats across all asynchronous API endpoints and
  microservice handlers.