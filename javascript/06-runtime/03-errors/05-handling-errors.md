# Error Handling Mechanisms (`try`, `catch`, `finally`)

## Control Flow & Syntax Statements

**Error Handling:** Mechanisms using `try`, `catch`, and `finally` blocks to intercept execution failures, manage
recovery, and ensure proper resource management without crashing the runtime.

| Statement / Block | Purpose / Execution Behavior                                                                                                       |
|:------------------|:-----------------------------------------------------------------------------------------------------------------------------------|
| `try`             | Defines a block of code to monitor for exceptions                                                                                  |
| `catch (error)`   | Executes when an error is thrown in the `try` block, receiving the error object (or omitted via optional catch binding `catch {}`) |
| `finally`         | Always executes after `try` and `catch` finish, regardless of whether an error occurred                                            |

## Execution Flow & Lifecycle

| Scenario             | Step 1                         | Step 2                  | Step 3                  |
|:---------------------|:-------------------------------|:------------------------|:------------------------|
| Successful Execution | Execute `try` block            | Skip `catch` block      | Execute `finally` block |
| Failed Execution     | Execute `try` (stops at error) | Execute `catch` handler | Execute `finally` block |

## Advanced Patterns & Strategies

| Pattern                | Mechanism                            | Use Case                                                          |
|:-----------------------|:-------------------------------------|:------------------------------------------------------------------|
| Specific Type Handling | `if (error instanceof TypeError)`    | Inspecting error instances to route appropriate recovery logic    |
| Rethrowing Errors      | Catching and executing `throw error` | Passing failures up the call stack to a higher-level context      |
| Resource Cleanup       | Placing logic in `finally`           | Closing database connections, clearing timers, or releasing locks |

## Best Practices

* **Wrap only risky code:** Apply `try/catch` blocks strictly around operations prone to failure rather than masking
  general logic.
* **Guaranteed cleanup in `finally`:** Use `finally` blocks for actions that must execute regardless of success or
  failure (e.g., closing streams, resetting flags).
* **Be intentional with rethrowing:** Preserve original error context when catching and rethrowing errors to avoid
  losing diagnostic stack traces.
* **Handle errors at the correct level:** Let layers with sufficient application context decide whether to recover or
  propagate the failure.
* **Always throw Error instances or subclasses:** Avoid throwing raw strings or primitive values; throw standard `Error`
  objects to ensure access to call stacks and debugging metadata.
* **Preserve error context using the cause property:** Utilize `throw new Error("Context message", { cause: err })` when
  catching and re-throwing errors to preserve original failure chains.
* **Extend Error properly when creating custom errors:** Subclass `Error` using ES6 `class CustomError extends Error`
  syntax so custom types retain stack traces and standard prototype behaviors.
* **Match specific error subtypes to operational failures:** Throw built-in subtypes like `TypeError` or `RangeError`
  when input criteria fail to communicate failure intent clearly.
* **Avoid empty catch blocks:** Never catch exceptions silently without logging or handling them, as this masks bugs and
  hides runtime failures.
* **Distinguish expected errors from unexpected faults:** Handle predictable user-input or network failures locally
  while letting unknown runtime exceptions propagate upward.
* **Use optional catch bindings when error objects are unused:** Leverage modern `catch {}` syntax if the error instance
  is not required for recovery logic or logging.
* **Do not return values inside `finally` blocks:** Avoid using `return` statements within `finally` blocks, as they
  silently override and swallow active return values or thrown errors from the `try` and `catch` paths.
* **Log caught errors with full context:** Include both the error message, stack trace, and relevant telemetry
  identifiers when recording exceptions in catch handlers.
* **Test try-catch paths explicitly:** Write comprehensive unit test assertions verifying that catch and finally blocks
  execute correctly under error conditions.
* **Keep try blocks concise and focused:** Minimize the amount of code placed inside a `try` block to ensure exceptions
  are mapped precisely to their failing operations.
* **Clean up asynchronous resources correctly:** Remember that synchronous `try/catch` blocks cannot intercept
  asynchronous rejections unless paired with `await` or promise `.catch()` handlers.
* **Sanitize error data before exposing to users:** Prevent raw stack traces or internal system messages from leaking
  through catch fallback displays in user-facing UIs.
* **Avoid complex business logic inside catch handlers:** Keep error recovery paths simple, deterministic, and safe from
  triggering secondary exceptions.
* **Review try-catch usage during code refactoring:** Audit error handling blocks regularly to ensure recovery flows
  remain aligned with evolving business requirements.
* **Maintain consistent error-handling patterns across modules:** Standardize how `try/catch/finally` blocks are
  structured throughout the codebase for improved maintainability.