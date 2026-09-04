# Promise Creation

Creating promises in JavaScript is accomplished by instantiating the built-in `Promise` constructor, which serves as the
foundational mechanism for wrapping legacy asynchronous APIs, custom timers, and network operations into modern
promise-based structures. The `Promise` constructor accepts a single execution function, commonly referred to as the
executor function, which is executed synchronously immediately upon the promise's instantiation before the constructor
returns the newly created promise instance to the caller. This executor function receives two arguments provided by the
JavaScript runtime environment: a `resolve` function and a `reject` function. These parameters act as control handles
that allow the developer to manually transition the promise from its initial pending state to a settled state based on
the outcome of the underlying asynchronous computation.

The executor function plays a critical role in asynchronous orchestration by encapsulating side effects and error
handling within a controlled closure. Because the executor runs immediately and synchronously during construction, any
synchronous exceptions thrown directly inside the executor body are automatically caught by the runtime and result in
the automatic rejection of the promise with the thrown error as its reason. Consequently, developers do not necessarily
need to wrap every synchronous statement within an explicit try-catch block inside the executor, provided the error is
intended to fail the promise. However, asynchronous errors thrown inside nested callbacks or downstream microtasks
inside the executor cannot be intercepted automatically, requiring explicit invocation of the `reject` function.

| Parameter / Method | Description                                                                     | Execution Context                                     |
|:-------------------|:--------------------------------------------------------------------------------|:------------------------------------------------------|
| Executor Function  | The callback passed to the `Promise` constructor containing asynchronous logic. | Executed synchronously during instantiation.          |
| `resolve()`        | The control handle used to fulfill the promise with a specific result value.    | Invoked asynchronously or synchronously upon success. |
| `reject()`         | The control handle used to reject the promise with a specific error reason.     | Invoked upon encountering a failure or exception.     |

The `resolve` function is the primary mechanism for signaling the successful completion of an asynchronous task managed
by the promise executor. When invoked with an argument, `resolve` transitions the promise state from pending to
fulfilled, binding the passed value to the promise instance. If the argument passed to `resolve` is itself another
promise or a thenable object—an object possessing a `.then()` method—the created promise adopts the state and outcome of
that inner promise, effectively chaining their resolution paths. Passing primitive values, objects, or arrays to
`resolve` makes those values immediately available to subsequent fulfillment handlers attached via consumption methods.

The `reject` function provides the explicit counterpart to resolution, signaling that the asynchronous operation has
encountered an unrecoverable error condition. Invoking `reject` with a reason argument—standardly an instance of the
`Error` object—transitions the promise state from pending to rejected permanently. Once a promise is rejected, any
subsequent calls to `resolve` or `reject` within the executor are silently ignored due to the immutable
single-settlement guarantee enforced by the ECMAScript engine. Proper error routing relies on this deterministic
transition to bypass intermediate processing steps and direct execution flow straight to registered rejection handlers
or catch blocks.

## Best Practices

* **Executor Synchronicity Awareness:** Keep heavy computations outside the promise executor body to prevent blocking
  the main thread during synchronous initialization.
* **Explicit Settlement Guarding:** Ensure that every promise executor guarantees eventual invocation of either
  `resolve` or `reject` to prevent dangling pending promises that cause memory leaks.
* **Error Wrapping in Constructors:** Pass proper `Error` instances into the `reject` function rather than raw strings
  or numbers to maintain clean stack traces across asynchronous boundaries.
* **Thenable Resolution Handling:** Understand that resolving a promise with another promise flattens their resolution
  cycles, avoiding unnecessary nested promise wrappers.
* **Avoid async executors:** Never define the executor function as `async` (e.g.,
  `new Promise(async (resolve, reject) => {...})`) because synchronous errors thrown inside it will not be caught by the
  Promise constructor.
* **Promisify utilities:** Prefer using built-in utilities like `util.promisify` in Node.js instead of manually wrapping
  standard error-first callback APIs with new Promise constructors.
* **Guard multiple resolutions:** Remember that calling `resolve()` or `reject()` multiple times has no effect, but it
  is best to use `return resolve(...)` to halt further execution in the executor.
* **Immediate resolution:** Use `Promise.resolve()` or `Promise.reject()` for immediately available values instead of
  manually instantiating a new Promise to reduce memory overhead and improve performance.
* **Avoid the deferred anti-pattern:** Do not create a promise and extract its `resolve` and `reject` functions to outer
  scopes unless using modern, standardized methods like `Promise.withResolvers()`.
* **Clean up timeouts:** If wrapping a `setTimeout` inside a promise executor, ensure you manage the timer ID if there
  is a possibility the surrounding context will unmount before execution.
* **Reject on timeout:** Implement race conditions using `Promise.race()` rather than putting complex, manual timeout
  logic directly inside a single monolithic executor function.
* **Resolve to undefined safely:** If a promise represents completion without a specific data payload, explicitly call
  `resolve()` without arguments to clearly signal a void return type.
* **Handle DOM events carefully:** When wrapping single-fire DOM events in promises, ensure the event listener is
  removed immediately inside the resolution handler to prevent memory leaks in the browser.
* **Validate inputs early:** Perform synchronous input validation before instantiating the promise, throwing synchronous
  errors immediately rather than deferring validation logic to the promise rejection.
* **Avoid nested promises:** Do not instantiate a new Promise inside a `.then()` block if returning an inner promise
  directly will achieve the exact same flattened asynchronous result.
* **Catch asynchronous errors manually:** Be cautious of errors thrown asynchronously inside the executor (such as
  inside an internal callback); they will not reject the promise automatically and require explicit invocation of
  `reject(err)`.
* **Isolate state:** Ensure that variables modified inside the executor do not create unintended side effects in the
  outer lexical scope, maintaining predictable and functional state management.
* **Use withResolvers for streams:** When adapting stream events or highly decoupled logic to promises, utilize
  `Promise.withResolvers()` for cleaner syntax and safer reference management.
* **Prevent double callbacks:** When bridging legacy callback APIs, ensure that the callback passed to the legacy
  function cleanly branches between success and error without accidentally invoking both settlement handles.
* **Document resolution types:** Explicitly document the expected type of the resolved value and the structure of the
  rejection error using JSDoc or TypeScript to aid downstream consumers.
* **Test pending states:** Write unit tests that explicitly verify the promise remains pending when the underlying
  mocked asynchronous operation has not yet fired its associated callbacks.
* **Halt execution on rejection:** Always pair `reject()` calls with a `return` statement (e.g., `return reject(err)`)
  if the executor contains further synchronous logic that should be skipped upon failure.