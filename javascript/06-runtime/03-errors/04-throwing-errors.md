# Throwing Errors (`throw`)

## Core Concepts & Mechanisms

**`throw`:** A statement used to manually signal an error, immediately halting normal execution and passing the thrown
value up the call stack to the nearest error handler or promise rejection path.

| Action / Syntax              | Behavior / Outcome                                                                                |
|:-----------------------------|:--------------------------------------------------------------------------------------------------|
| `throw new Error("msg")`     | Standard mechanism for generating a structured error object with a message, name, and stack trace |
| `throw new TypeError("msg")` | Specialized throwing of built-in error types to match specific failure causes                     |
| Async Throwing               | In `async` functions or promises, thrown errors automatically result in a rejected promise        |

## Throwing vs. Returning Failure Values

| Approach                               | Flow Control                   | Caller Responsibility                                       |
|:---------------------------------------|:-------------------------------|:------------------------------------------------------------|
| Returning Values (e.g., `return null`) | Continues normal execution     | Caller must manually inspect return values                  |
| Throwing Errors (`throw new Error()`)  | Bypasses normal execution flow | Transfers control directly to `try/catch` or error handlers |

## Common Trigger Conditions

Errors should be thrown when an operation or component cannot fulfill its contract:

| Trigger Scenario       | Example Context                                       |
|:-----------------------|:------------------------------------------------------|
| Invalid Input          | Data cannot be processed by a parser or function      |
| Constructor Validation | Guarding against invalid state during object creation |
| Failed Dependency      | Critical operations failing mid-execution             |

## Best Practices

* **Always throw Error objects:** Never throw primitive strings or objects; `Error` instances provide vital diagnostic
  stack traces.
* **Use specific error classes:** Leverage built-in or custom error types (`TypeError`, `RangeError`) to precisely
  communicate failure reasons.
* **Fail fast:** Throw errors immediately when an operation cannot continue rather than returning corrupted or invalid
  results.
* **Avoid silent catches:** Never catch errors just to suppress them; handle them fully or allow them to propagate
  intentionally.
* **Throw meaningful error messages:** Provide clear, context-rich descriptions explaining exactly what failed during
  execution.
* **Validate arguments at function boundaries:** Check incoming parameters early and throw errors immediately if
  preconditions fail.
* **Avoid throwing errors for normal control flow:** Use standard conditional checks or return values for expected
  business outcomes rather than abusing exceptions.
* **Attach error codes for machine readability:** Include structured codes alongside thrown messages to simplify
  programmatic handling upstream.
* **Do not throw errors inside asynchronous callbacks without rejection paths:** Ensure exceptions thrown in raw event
  listeners or callbacks are handled so they do not crash the process.
* **Rethrow unexpected errors safely:** Catch broad errors, check their type, and rethrow them if they cannot be handled
  locally.
* **Document thrown exceptions in API signatures:** Use JSDoc comments or type definitions to declare which errors a
  function might throw under invalid conditions.
* **Avoid deep uncontrolled throws:** Ensure thrown errors bubble up to predictable architectural boundaries rather than
  crashing random modules.
* **Sanitize thrown payloads in public APIs:** Prevent internal database details or sensitive system states from leaking
  through thrown messages.
* **Test exception throwing explicitly:** Write unit tests using assertions (`expect().toThrow()`) to verify that
  invalid inputs correctly trigger throws.
* **Maintain consistent throwing patterns across teams:** Enforce organizational guidelines on when and how errors
  should be raised within modules.
* **Use custom error classes for domain logic:** Throw specialized application errors rather than generic built-ins when
  representing domain-specific violations.
* **Preserve original error context when rethrowing:** Attach original underlying exceptions as nested causes when
  wrapping and throwing new errors.
* **Review throw sites during code maintenance:** Audit exception-raising code to ensure error messages remain
  up-to-date with refactored business logic.
* **Avoid throwing errors inside `finally` blocks:** Ensure cleanup routines do not throw new exceptions that overwrite
  active errors propagating up the stack.
* **Monitor frequency of thrown errors in production:** Track application exception rates to detect underlying bugs or
  unstable external dependencies instantly.