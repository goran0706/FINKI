# Async Function Behavior

The behavioral mechanics of asynchronous functions in JavaScript are governed by strict runtime specifications that
dictate how return values, exceptions, and awaited expressions are processed. When an async function is invoked, it does
not immediately execute its entire body synchronously; instead, it establishes an execution context and returns a
pending promise to the caller while queuing the initial instructions. Once the function reaches a return statement or
finishes executing all statements within its body, the returned promise transitions to a settled state. This automated
behavior eliminates the boilerplate required to manually construct and resolve promises in standard functions.

Automatic promise wrapping is a foundational feature of async functions that ensures consistent return signatures
regardless of whether the internal code produces synchronous values, explicit promises, or thrown exceptions. If an
async function returns a normal primitive or object, the JavaScript engine automatically wraps that value in a resolved
promise. If the function returns an already pending or settled promise, the async function adopts that promise's state
directly without double-wrapping. Furthermore, if an unhandled error or exception is thrown anywhere within the async
function body, the runtime intercepts the exception and automatically rejects the function's returned promise with that
error.

| Behavioral Aspect | Runtime Mechanism                                           | Settlement Outcome                                                      |
|:------------------|:------------------------------------------------------------|:------------------------------------------------------------------------|
| Return Values     | Automatically wrapped in promises by the JavaScript engine. | Fulfills with the returned primitive, object, or inner promise outcome. |
| Thrown Exceptions | Intercepted automatically during function execution.        | Rejects the returned promise with the thrown `Error` object.            |
| Awaiting Values   | Pauses execution until the target promise settles.          | Unwraps fulfillment values or throws rejection reasons into the scope.  |

Awaiting values inside async functions enables developers to consume asynchronous results sequentially as if they were
synchronous variables. When the `await` keyword precedes a non-promise value, such as a number, string, or plain object,
the runtime automatically coerces that value into a resolved promise using `Promise.resolve()` before suspending the
function context for a single microtask turn. This normalization ensures that any expression passed to `await` is
treated uniformly, allowing seamless integration between synchronous computations and asynchronous data sources within
the same control flow block.

The mechanics of awaiting a promise involve suspending the execution of the surrounding async function and scheduling
its resumption once the target promise settles. While suspended, control is returned to the event loop, allowing other
queued tasks and microtasks to execute without blocking the main thread. Once the target promise fulfills, the awaited
expression evaluates to the fulfillment value, and the engine pushes the remainder of the async function back onto the
microtask queue to continue execution from the exact point of suspension.

### Best Practices

* **Return Simplicity:** Avoid wrapping return values in explicit `Promise.resolve()` statements inside async functions
  since the runtime performs automatic wrapping.
* **Error Interception:** Rely on the automatic rejection behavior of async functions to propagate unexpected runtime
  exceptions cleanly down promise chains.
* **Await Normalization:** Understand that awaiting non-promise values incurs a minor microtask scheduling overhead due
  to automatic promise conversion.
* **Execution Awareness:** Remember that using `await` suspends the enclosing async function, making subsequent
  statements in that function wait for settlement before running.