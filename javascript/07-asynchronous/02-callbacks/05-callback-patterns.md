# Callback Patterns

**Callback Patterns:** Advanced structural design patterns governing how functions are passed, composed, and managed in
JavaScript applications. According to software engineering design principles, these patterns optimize code reusability,
control flow management, and asynchronous coordination across complex application architectures.

* **Thunks:** Functions that delay evaluation by wrapping an expression or asynchronous operation inside a zero-argument
  function wrapper.
* **Partial application & currying:** Pre-filling specific arguments of a callback-accepting function to generate
  specialized, reusable utility callbacks.
* **Middleware patterns:** Stacking and executing a series of callback functions sequentially to process requests,
  responses, or data pipelines.

## Core Concepts & Specifications

| Concept / Feature                  | MDN & ECMAScript Standard Specification Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|:-----------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Thunks**                         | • **Lazy Evaluation:** Defers the execution of a computation or network request until the resulting thunk function is explicitly invoked.<br>• **Async Thunks:** In legacy async programming (e.g., Redux Thunk), thunks wrap asynchronous logic to delay dispatching actions until data fetches resolve.<br>• **Zero-Argument Signature:** Typically structured as `function thunk() { return actualWork(); }` to strip required parameters for later execution.<br>• **Closure Capture:** Captures necessary configuration and runtime context at definition time, keeping the execution site clean.<br>• **Continuation Style:** Often used in functional programming to pass deferred execution logic down a pipeline without immediate firing.<br>• **Memory Overhead:** Minimal allocation overhead, but requires careful scoping to ensure captured variables remain valid when invoked.<br>• **Modern Replacement:** Largely superseded by native Promises and async functions, though still heavily used in state management middleware. |
| **Partial application & currying** | • **Partial Application:** Fixes a subset of a function's arguments and returns a new function waiting for the remaining arguments.<br>• **Currying Transformation:** Converts a function of $n$ arguments into a sequence of $n$ nested unary functions taking one argument at a time.<br>• **Callback Specialization:** Generates highly customized callback instances from generic higher-order utility functions.<br>• **Lexical Binding:** Combines tightly with `.bind()` or arrow functions to pre-configure event handlers with specific context data.<br>• **Function Composition:** Enables seamless integration with functional programming utility libraries (e.g., Lodash, Ramda).<br>• **Immutability Promotion:** Encourages pure function design by separating configuration parameters from runtime operational inputs.<br>• **Readability Trade-off:** Can obscure debugging stack traces and increase cognitive load if over-curried in standard application code.                                                             |
| **Middleware patterns**            | • **Pipeline Execution:** Sequences multiple callback handlers (`(req, res, next) => {}`) where each step decides whether to continue the chain.<br>• **Control Delegation:** Calling `next()` hands execution over to the subsequent middleware function in the registered stack.<br>• **Cross-Cutting Concerns:** Centralizes logging, authentication checks, error handling, and request body parsing prior to reaching route controllers.<br>• **Express / Koa Architecture:** The foundational design pattern powering modern Node.js web frameworks and backend routing pipelines.<br>• **Error Routing:** Specialized error-first middleware signatures (`(err, req, res, next)`) automatically intercept thrown exceptions in the stack.<br>• **Asynchronous Stacking:** Supports async/await middleware designs where handlers await downstream completion before finalizing responses.<br>• **Order Dependency:** Strict sequential execution means registration order in the application pipeline directly dictates runtime behavior.  |

## Practical Implementation Patterns

```javascript
// Middleware pattern implementation example
function loggerMiddleware(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method}${req.url}`);
    // Handing control to the next middleware in the stack
    next();
}

function authMiddleware(req, res, next) {
    if (!req.headers.authorization) {
        console.error("Unauthorized request blocked");
        return; // Halt chain execution
    }
    next();
}

// Simulating middleware execution pipeline
function executePipeline(req, res, middlewares) {
    let index = 0;

    function next() {
        if (index < middlewares.length) {
            const currentMiddleware = middlewares[index++];
            currentMiddleware(req, res, next);
        } else {
            console.log("Pipeline completed: Reached route handler");
        }
    }

    next();
}

executePipeline({
    method: "GET",
    url: "/api/data",
    headers: {authorization: "Bearer token"}
}, {}, [loggerMiddleware, authMiddleware]);
```

## Best Practices

* **Always call `next()` in middleware:** Prevent hanging requests by ensuring every successful middleware path invokes
  the downstream continuation callback.
* **Guard against double-calling `next()`:** Implement explicit return statements (`return next()`) to prevent executing
  subsequent middleware multiple times.
* **Position error middleware last:** Register specialized error-handling middleware at the very end of your pipeline
  stack to catch unhandled exceptions.
* **Keep thunks pure:** Ensure thunk wrappers do not introduce unexpected side effects when passed between asynchronous
  components.
* **Avoid over-currying:** Use currying and partial application selectively where it improves reuse, rather than
  complicating simple callbacks.
* **Validate callback existence:** Always verify that a passed callback parameter is a valid function before invoking it
  to avoid runtime type errors.
* **Preserve execution context:** Use arrow functions or explicit binding to ensure the correct `this` context is
  maintained within asynchronous callbacks.
* **Handle race conditions:** Implement guards or cancellation tokens for asynchronous callbacks whose results may
  arrive out of order.
* **Avoid synchronous execution in async wrappers:** Ensure custom asynchronous functions always defer callback
  execution via the event loop rather than running them synchronously.
* **Standardize parameter order:** Keep the error parameter consistently as the first argument across all custom
  asynchronous utility functions.
* **Document timing semantics:** Explicitly note in JSDoc whether a custom higher-order function invokes its callbacks
  synchronously or asynchronously.
* **Manage closure scope memory:** Limit the number of large external variables captured within long-lived asynchronous
  callback closures to optimize garbage collection.
* **Throttle high-frequency triggers:** Wrap rapid event or browser observer callbacks with debounce or throttle
  utilities to prevent performance bottlenecks.
* **Implement timeout safeguards:** Attach timeout wrappers to network or I/O callback routines that lack native
  expiration mechanisms to handle hanging requests.
* **Isolate side effects:** Keep state modifications inside asynchronous callbacks predictable and centralized to
  simplify asynchronous debugging and testing.
* **Use named functions for debugging:** Prefer named function references over anonymous inline functions to maintain
  clean and readable stack traces.
* **Avoid deep nesting levels:** Refactor multi-layered callback structures into flat, manageable functions to improve
  code readability and maintenance.
* **Test async failure modes:** Write unit tests that deliberately trigger error-first paths to verify robust error
  propagation through the callback chain.
* **Clear pending timers:** Always invoke `clearTimeout` or `clearInterval` when destroying components that schedule
  deferred callback execution.
* **Monitor event loop lag:** Ensure heavy data processing inside asynchronous callbacks is chunked or offloaded to web
  workers to keep the main thread responsive.
* **Enforce single execution guards:** Use execution flags in completion callbacks to guarantee code blocks execute
  exactly once under all conditions.
* **Avoid mutating callback parameters:** Treat arguments passed to callbacks as immutable data structures to avoid
  side-effect leakage across parent execution blocks.