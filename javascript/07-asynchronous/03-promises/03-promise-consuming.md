# Promise Consuming

Consuming promises in JavaScript is achieved through built-in prototype methods designed to attach fulfillment and
rejection handlers to a promise instance. The primary method for consuming a promise is `.then()`, which schedules
callback functions to execute once the promise transitions to a settled state. Additionally, specialized methods like
`.catch()` and `.finally()` provide dedicated syntax for handling error conditions and executing cleanup logic
regardless of the ultimate settlement outcome. These consumption methods do not modify the original promise; instead,
they operate on immutable promise instances and return a brand new promise, thereby enabling seamless asynchronous
composition and continuous method chaining across execution sequences.

The `.then()` method accepts up to two arguments: an optional fulfillment handler callback invoked when the promise
resolves successfully, and an optional rejection handler callback invoked if the promise rejects. Because `.then()`
itself returns a new promise, the resolution value returned inside the fulfillment or rejection handler determines the
state and value of the subsequent promise in the chain. If a handler returns a synchronous value, the returned promise
fulfills with that value; if a handler returns another promise, the outer promise adopts the state of the inner promise.
This powerful composition model ensures that asynchronous pipelines behave predictably while avoiding the tightly
coupled callbacks characteristic of legacy asynchronous patterns.

| Consumption Method               | Primary Purpose                                                     | Return Value Behavior                                                      |
|:---------------------------------|:--------------------------------------------------------------------|:---------------------------------------------------------------------------|
| `.then(onFulfilled, onRejected)` | Attaches handlers for fulfillment and rejection outcomes.           | Returns a new promise resolved with the handler's return value.            |
| `.catch(onRejected)`             | Attaches a dedicated handler specifically for promise rejections.   | Returns a new promise resolved with the recovery value or re-thrown error. |
| `.finally(onFinally)`            | Attaches a callback executed upon settlement regardless of outcome. | Returns a new promise that mirrors the original settled promise.           |

The `.catch()` method serves as syntactic sugar for calling `.then(null, onRejected)`, providing a clean and readable
interface dedicated strictly to handling promise rejections and runtime exceptions. Placing a `.catch()` block at the
end of a promise chain intercepts any unhandled rejections or thrown errors that occurred during preceding asynchronous
steps, preventing them from turning into uncaught exception warnings. Furthermore, if a `.catch()` handler executes
successfully without throwing its own error, the promise it returns transitions to a fulfilled state, allowing the
execution flow to recover gracefully and continue through subsequent `.then()` blocks.

The `.finally()` method introduced in modern ECMAScript specifications provides a mechanism to register cleanup logic
that must run once a promise settles, irrespective of whether it fulfilled successfully or encountered a rejection.
Unlike `.then()` or `.catch()`, the callback passed to `.finally()` receives no arguments, reflecting the fact that it
is agnostic to the specific fulfillment value or rejection reason. Any value returned from a `.finally()` callback is
ignored by the runtime unless an error is explicitly thrown inside the callback itself, in which case the returned
promise rejects with that newly thrown exception, preserving transparent pass-through semantics for the underlying
promise outcome.

## Best Practices

* **Terminal Catch Placement:** Always terminate promise chains with an explicit `.catch()` handler to catch unexpected
  failures and prevent unhandled promise rejections.
* **Cleanup Isolation:** Use `.finally()` exclusively for resource cleanup operations such as closing database
  connections or hiding loading spinners regardless of success or failure.
* **Handler Return Consistency:** Ensure that fulfillment and rejection handlers in `.then()` blocks consistently return
  values or promises to maintain valid downstream chaining.
* **Error Recovery Awareness:** Understand that a `.catch()` block recovers the promise chain to a fulfilled state
  unless an error is explicitly re-thrown inside its callback.
* **Avoid callback style chaining:** Do not nest `.then()` calls inside other `.then()` handlers; flatten the promise
  chain by returning the inner promise directly.
* **Always return promises in then blocks:** Ensure you use `return` statements inside `.then()` callbacks when passing
  subsequent asynchronous steps down the execution pipeline.
* **Separate fulfillment and rejection handlers:** Prefer appending `.catch()` as a separate method rather than passing
  a second rejection argument into `.then()` to ensure errors in the fulfillment handler are also caught.
* **Do not ignore finally return errors:** Be aware that throwing an error inside a `.finally()` callback will override
  the original promise settlement value with the new rejection.
* **Handle optional finally arguments:** Remember that `.finally()` callbacks accept no parameters, so do not attempt to
  inspect resolution values or error reasons directly inside the cleanup block.
* **Avoid unhandled rejections in chains:** Ensure every branch of a complex, branching promise chain has its own
  error-handling strategy to prevent silent failures.
* **Catch synchronous errors in then:** Understand that synchronous errors thrown inside `.then()` or `.catch()`
  callback functions automatically cause the returned promise to reject.
* **Use async/await for cleaner consumption:** Prefer modern `try/catch` blocks with `async/await` syntax over long
  chains of `.then()` and `.catch()` methods for improved readability.
* **Validate consumption data types:** Inspect data payloads received in fulfillment handlers before passing them to
  application business logic to prevent runtime exceptions.
* **Avoid dead promise chains:** Ensure that promise consumption methods are actively attached or returned to the main
  execution flow, preventing dangling asynchronous operations.
* **Log errors appropriately in catch blocks:** Always include meaningful logging or monitoring hooks inside terminal
  `.catch()` blocks to facilitate production debugging.
* **Test both settlement paths:** Write comprehensive unit tests that explicitly verify both the fulfillment and
  rejection consumption branches of your promise utilities.
* **Avoid promise anti-patterns:** Do not use `.then()` simply to execute side effects without returning a value or a
  new promise, unless side-effect isolation is explicitly intended.
* **Chain catch blocks strategically:** Place specialized recovery `.catch()` blocks mid-chain to handle recoverable
  errors locally before continuing the primary pipeline.
* **Prevent memory leaks in long chains:** Avoid retaining long-lived references to intermediary promise results in
  closure scopes across extended `.then()` sequences.
* **Use async error boundaries:** Wrap top-level promise consumers in robust application error boundaries to gracefully
  handle unrecoverable system failures.
* **Standardize error forwarding:** Ensure custom rejection handlers re-throw errors when they cannot fully recover the
  application state, preserving critical stack traces.
* **Monitor microtask timing:** Keep in mind that all `.then()`, `.catch()`, and `.finally()` handlers execute
  asynchronously via the microtask queue after the current execution stack clears.