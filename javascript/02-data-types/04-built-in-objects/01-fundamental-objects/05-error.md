# Error

## Concept and ECMAScript Specification

The `Error` constructor creates error instances that are thrown when runtime errors occur. According to the ECMA-262
specification, `Error` can be invoked as a standard function or as a constructor using `new`; both invocations
instantiate and initialize a new `Error` object possessing the same structure and internal prototype. `Error` serves as
the base prototype object for custom exceptions and built-in native error subtypes.

| Characteristic         | ECMAScript Specification Behavior                                                            |
|:-----------------------|:---------------------------------------------------------------------------------------------|
| Invocation Equivalence | `Error(message)` and `new Error(message)` perform identical object allocation operations     |
| Prototype Inheritance  | `Error.prototype` inherits directly from `Object.prototype`                                  |
| Cause Option           | Accepts an optional options object parameter `{ cause }` to record contextual error chaining |
| Serialization          | Native serializable object supported by `structuredClone()` and worker messaging APIs        |

## Native Error Subtypes

ECMAScript defines specific native error constructors inheriting from `Error.prototype`. Each subtype represents a
distinct class of runtime operational failure or language specification violation.

| Error Subtype    | Specification Operational Cause                                                                                                       |
|:-----------------|:--------------------------------------------------------------------------------------------------------------------------------------|
| `EvalError`      | Represents failures occurring in the global `eval()` function execution context (rarely thrown by modern engines — mostly historical) |
| `RangeError`     | Thrown when a numeric value or parameter falls outside its allowed spec range                                                         |
| `ReferenceError` | Thrown when attempting to dereference an unresolvable or invalid variable reference                                                   |
| `SyntaxError`    | Raised during code parsing when source text violates ECMAScript grammar rules                                                         |
| `TypeError`      | Thrown when an operation is performed on an incompatible or invalid primitive/object type                                             |
| `URIError`       | Raised when structural URI encoding/decoding functions receive malformed sequences                                                    |
| `AggregateError` | Wraps multiple individual error instances into a single object (e.g., via `Promise.any()`)                                            |

**When each is thrown in practice, at a glance:**

```javascript
[].length = -1;                 // RangeError: Invalid array length
console.log(undeclaredVar);     // ReferenceError: undeclaredVar is not defined
null.foo;                       // TypeError: Cannot read properties of null
JSON.parse('{bad json');        // SyntaxError: Unexpected token b in JSON
decodeURIComponent('%');        // URIError: URI malformed
```

## Standard Instance Properties and Methods

Every `Error` instance contains data properties that describe the context of the runtime failure. Prototype methods
format these properties into standardized output strings.

| Property / Method            | Type / Attributes                                                  | Specification Behavior                                                            |
|:-----------------------------|:-------------------------------------------------------------------|:----------------------------------------------------------------------------------|
| `message`                    | Instance Data Property                                             | Human-readable error description string provided during construction              |
| `name`                       | Prototype Data Property                                            | Name string identifying the error type (defaults to `"Error"`)                    |
| `cause`                      | Instance Data Property                                             | Optional explicit cause payload specified via options object `{ cause }`          |
| `stack`                      | Instance Data Property (non-standard, but universally implemented) | Engine-specific string trace of the call stack at the point the error was created |
| `Error.prototype.toString()` | Prototype Method                                                   | Concatenates `name` and `message` properties into a formatted description string  |

`stack` is not part of the ECMAScript specification itself — it's a de facto standard every major engine implements, but
its exact string format is engine-specific, which is why Best Practices below warns against parsing it directly.

## Use Cases

**Throw `TypeError` when:** a value is the wrong *type* for an operation — calling a method on `null`/`undefined`,
invoking something that isn't a function, or passing a value that doesn't implement an expected interface.

**Throw `RangeError` when:** a value has the correct type but falls outside an acceptable numeric or structural range —
an array length set to a negative number, a recursion depth exceeding a defined limit, an invalid `toFixed()` precision
argument.

**Throw `ReferenceError` when:** code attempts to use an identifier that doesn't exist in any accessible scope — largely
a parser/engine concern rather than something application code manually throws.

**Throw `SyntaxError` when:** parsing malformed code or data — most commonly seen from `JSON.parse()` on invalid JSON,
rarely thrown manually.

**Use `AggregateError` when:** a single operation can fail in multiple independent ways simultaneously — the standard
case is `Promise.any()` rejecting because *every* promise in the batch failed, or manually wrapping the results of
`Promise.allSettled()` when multiple parallel operations failed and all failures need to be reported together, not just
the first one.

**Extend `Error` with a custom subclass when:** your application has a recurring category of failure that calling code
needs to distinguish programmatically — a `ValidationError`, `NotFoundError`, or `InsufficientFundsError` that callers
can catch specifically via `instanceof` rather than string-matching a generic `Error`'s message.

**Use `{ cause }` when:** re-throwing a higher-level, more meaningful error while catching a lower-level one — e.g.,
catching a raw database connection error and re-throwing `"Failed to save user"` with the original error attached as
`cause`, so both the meaningful message and the root technical cause survive in one object.

## Best Practices

* **Always throw Error instances or subclasses:** Avoid throwing raw strings or primitive values; throw standard `Error`
  objects to ensure access to call stacks and debugging metadata.
* **Preserve error context using the cause property:** Utilize `throw new Error("Context message", { cause: err })` when
  catching and re-throwing errors to preserve original failure chains.
* **Extend Error properly when creating custom errors:** Subclass `Error` using ES6 `class CustomError extends Error`
  syntax so custom types retain stack traces and standard prototype behaviors.
* **Match specific error subtypes to operational failures:** Throw built-in subtypes like `TypeError` or `RangeError`
  when input criteria fail to communicate failure intent clearly — use the Use Cases table above as the deciding rule
  for which subtype fits a given failure.
* **Fix custom error prototype chains explicitly:** Ensure custom error classes invoke
  `Object.setPrototypeOf(this, new.target.prototype)` or correct the prototype chain manually if targeting environments
  older than ES6 (transpilation targets, notably, can silently break `instanceof` on custom Error subclasses without
  this fix).
* **Set custom error names explicitly:** Assign a `this.name` property matching your custom class name inside the
  constructor to ensure formatted string outputs and logs display correctly — without it, `toString()` and most logging
  output still shows the generic `"Error"` name even for a properly subclassed error.
* **Avoid relying on non-standard stack properties:** Use standard `stack` properties cautiously in production code or
  rely on standardized error parsing libraries, as stack trace string formats vary across JavaScript engines and aren't
  part of the ECMAScript spec itself.
* **Sanitize error messages before exposing to clients:** Strip sensitive system paths, database connection strings, or
  internal variables from error messages before returning them across public API responses.
* **Use `AggregateError` for multi-fault operations:** Wrap multiple concurrent failure records into a single
  `AggregateError` when handling parallel async tasks like `Promise.allSettled()` results.
* **Catch specific error types rather than catching blindly:** Guard against masking unrelated bugs by checking error
  instances via `instanceof` inside `catch` blocks before handling expected failures.
* **Clean up allocated resources in `finally` blocks:** Ensure file streams, database connections, or network locks are
  properly released in `finally` clauses regardless of whether an error is thrown.
* **Avoid swallowing errors silently:** Log or re-throw caught exceptions unless explicit recovery logic is implemented
  to prevent hidden debugging failures.
* **Include structured metadata properties on custom errors:** Attach relevant diagnostic context codes or error IDs as
  explicit properties on custom error instances for easier log parsing and metric tracking.
* **Use `Error.captureStackTrace` when available:** Optimize custom error construction in V8 environments by calling
  `Error.captureStackTrace(this, this.constructor)` to omit constructor frames from stack outputs — this is V8-specific
  (Node.js, Chrome) and simply doesn't exist on other engines, so guard the call with `if (Error.captureStackTrace)`
  when writing cross-engine code.
* **Handle asynchronous rejection errors explicitly:** Ensure all asynchronous functions and promises include `.catch()`
  handlers, or wrap `await` expressions in `try...catch` blocks, to avoid unhandled rejection warnings.
* **Never use `instanceof Error` alone across realm boundaries (iframes, worker threads, VM contexts) — it silently
  fails.** An error thrown in one realm and caught in another has a different `Error.prototype` reference, so
  `instanceof` returns `false` even though it's a genuine error object; check `Object.prototype.toString.call(err)` or
  duck-type on `.message`/`.stack` presence instead when errors might cross a realm boundary (common in Node's `vm`
  module or postMessage-based worker communication).
* **Don't put `{ cause }` chains more than a few layers deep without flattening them for logging.** Each re-thrown error
  nesting the previous one via `cause` builds a chain that most default `console.error`/logger output doesn't unwind
  automatically — write a small utility to walk `.cause` recursively when producing user-facing or log output, or the
  original root cause becomes effectively invisible in production logs.
* **Validate that a caught value is actually an `Error` before accessing `.message` or `.stack` in a `catch` block.**
  JavaScript allows `throw` with *any* value (a string, a plain object, `undefined`) — code that isn't yours (a
  dependency, browser API) may not follow the "always throw Error" convention, so a defensive
  `catch (err) { const msg = err instanceof Error ? err.message : String(err); }` avoids a `TypeError` inside your own
  error-handling code.