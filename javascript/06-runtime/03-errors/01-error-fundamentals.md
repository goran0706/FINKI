# JavaScript Error System

## Error Types & Categories

**Error System:** Mechanisms for detecting, classifying, and managing failures during code interpretation or execution.

| Error Type / Category | Phase / Cause   | Description / Examples                                                                 |
|:----------------------|:----------------|:---------------------------------------------------------------------------------------|
| Syntax Error          | Parsing phase   | Code grammar is invalid, preventing compilation (`Missing brackets`)                   |
| Runtime Error         | Execution phase | Valid syntax that fails during execution (`TypeError`, `ReferenceError`, `RangeError`) |
| Logical Error         | Testing phase   | Program executes successfully but produces incorrect results due to flawed reasoning   |
| Expected Error        | Operational     | Predictable runtime issues (e.g., invalid user input, network unavailability)          |
| Unexpected Error      | Architectural   | Programming defects or unknown internal states requiring code correction               |

## Error Propagation & Handling Philosophy

When an unhandled error occurs, it propagates upward through the call stack until a handler is found or execution
crashes. Proper error handling decouples normal execution from recovery workflows.

| Response Strategy         | Scenario                       | Action / Outcome                                 |
|:--------------------------|:-------------------------------|:-------------------------------------------------|
| Recoverable Failure       | Expected operational errors    | Handle gracefully and continue execution         |
| User Input Issues         | Invalid form data or arguments | Provide clear diagnostic feedback                |
| Critical / Defect Failure | Unhandled logic errors         | Report safely and prevent hidden silent failures |

## Best Practices

## Best Practices

* **Handle errors at the appropriate level:** Let the layer with the most relevant context manage the error response.
* **Never fail silently:** Avoid empty catch blocks or suppressed errors that conceal bugs and hinder debugging.
* **Provide meaningful error context:** Include descriptive messages detailing what failed and why to speed up
  troubleshooting.
* **Distinguish error types:** Separate predictable user/network faults from core programming defects.
* **Catch exceptions early and rethrow meaningfully:** Wrap low-level technical failures into domain-specific error
  types before bubbling them up to presentation tiers.
* **Avoid relying on error messages for logic checks:** Use custom error classes, error codes, or `instanceof` checks
  rather than parsing exception text strings during control flow.
* **Log unhandled exceptions centrally:** Ensure application crashes or fatal unhandled rejections are recorded via
  centralized logging systems for telemetry and monitoring.
* **Sanitize error outputs in production:** Prevent sensitive technical details, internal stack traces, or database
  credentials from leaking to end-user interfaces.
* **Validate boundaries proactively:** Check inputs and parameters early to fail fast before deep execution routines
  trigger unrecoverable runtime errors.
* **Preserve original stack traces when wrapping errors:** Attach underlying causes using standard error wrapping
  patterns so debugging history is never lost during propagation.
* **Avoid throwing non-Error objects:** Always throw true `Error` instances or subclasses rather than raw strings,
  numbers, or plain literals to maintain consistent stack tracing.
* **Clean up resources in `finally` blocks:** Ensure network sockets, database connections, and file handles are
  properly released regardless of whether execution succeeds or throws.
* **Distinguish operational faults from programmer bugs:** Handle predictable operational failures gracefully while
  allowing unexpected software defects to trigger fail-safe paths.
* **Test error boundaries thoroughly:** Write unit and integration test assertions verifying that expected error paths
  trigger correct recovery and fallback workflows.
* **Implement robust fallback UIs:** Display friendly recovery states or retry mechanisms to users when component or
  rendering errors occur in the application view tree.
* **Monitor error rates in production dashboards:** Track exception frequencies and error type distributions closely to
  detect emergent regressions or service degradation instantly.
* **Keep custom error messages concise and actionable:** Provide clear guidance within error text explaining how the
  user or developer can resolve the issue.
* **Review error handling strategies regularly:** Audit catch blocks and try-catch usage during code reviews to ensure
  error suppression is strictly prohibited.
* **Handle asynchronous rejections explicitly:** Ensure every promise chain includes `.catch()` handlers or that
  async/await functions are properly wrapped in try-catch blocks.
* **Maintain consistent error handling patterns:** Standardize exception classification, logging, and response formats
  across all modules within the codebase.