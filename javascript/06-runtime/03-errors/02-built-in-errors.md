# Built-in Error Types

## Error Inheritance & Type Hierarchy

**Error Type System:** JavaScript's collection of native error classes inheriting from the base `Error` class, enabling
general or specific failure handling via the prototype chain (`TypeError → Error → Object.prototype`).

| Error Class      | Primary Cause / Trigger                      | Example Scenario                     |
|:-----------------|:---------------------------------------------|:-------------------------------------|
| `Error`          | Base class for all runtime and custom errors | `throw new Error("Failed")`          |
| `TypeError`      | Value used in an invalid way or wrong type   | `null.someProperty`                  |
| `ReferenceError` | Accessing an undeclared identifier           | Using an uninitialized variable name |
| `SyntaxError`    | Code parsing or grammar failure              | Missing brackets or invalid tokens   |
| `RangeError`     | Numeric value outside allowed limits         | `new Array(-1)`                      |
| `URIError`       | Invalid input to URI functions               | `decodeURIComponent("%")`            |

## Checking Error Types with `instanceof`

Using the `instanceof` operator allows precise filtering and multi-level error handling depending on the failure
category.

| Evaluation Check           | Result | Purpose                                   |
|:---------------------------|:-------|:------------------------------------------|
| `err instanceof TypeError` | `true` | Handle invalid operations specifically    |
| `err instanceof Error`     | `true` | Catch-all for standard application errors |

## Best Practices

* **Use the most specific error type:** Match the error class precisely to the failure cause (`TypeError`, `RangeError`,
  etc.) for clearer debugging.
* **Leverage `instanceof` for control flow:** Distinguish between error types to route recovery logic properly.
* **Avoid obsolete errors:** Do not rely on `EvalError`, which remains primarily for legacy compatibility.
* **Avoid generic `Error` for expected runtime faults:** Use specialized built-in constructors to communicate specific
  failure semantics to consumers.
* **Verify constructor types before handling:** Inspect caught exceptions using `instanceof` to ensure safe branch
  execution when catching mixed thrown types.
* **Do not catch `SyntaxError` at runtime:** Handle parsing faults during development or build steps rather than
  attempting runtime recovery inside catch blocks.
* **Validate numeric bounds to prevent `RangeError`:** Check array lengths, recursion depths, and numeric parameters
  proactively before passing them into restricted routines.
* **Prevent `ReferenceError` through proper scoping:** Ensure variables and imports are declared correctly before access
  to eliminate accidental scoping bugs.
* **Guard optional properties to avoid `TypeError`:** Use optional chaining (`?.`) or defensive type guards before
  reading properties from nullable or unknown values.
* **Distinguish URI malformations precisely:** Catch `URIError` explicitly when processing unvalidated external string
  parameters passed to global encoding functions.
* **Keep custom checks aligned with native types:** Ensure custom domain error classes extend the appropriate built-in
  subclasses or base `Error` correctly.
* **Do not modify native built-in error prototypes:** Avoid monkey-patching `TypeError.prototype` or core constructors
  to maintain predictable engine execution.
* **Log detailed built-in error properties:** Capture both the `.name` and `.message` properties when recording native
  exceptions for telemetry.
* **Test type-specific error handlers:** Write unit test assertions verifying that distinct native errors trigger
  correct recovery pathways.
* **Document expected built-in exceptions in APIs:** State clearly which built-in errors a function might throw under
  invalid argument conditions.
* **Avoid relying on string parsing for error classification:** Use `instanceof` checks rather than inspecting
  `err.message` strings to identify error categories.
* **Sanitize external inputs before parsing:** Prevent malformed inputs from triggering unexpected native runtime errors
  deep within core execution blocks.
* **Handle out-of-range memory allocations gracefully:** Catch `RangeError` when dealing with dynamic buffer sizing or
  extreme collection creations.
* **Review error handling parity across modules:** Ensure consistent use of built-in error types throughout all layers
  of the application architecture.
* **Educate teams on standard error semantics:** Ensure developers understand when to throw a `TypeError` versus a
  `RangeError` in shared utilities.