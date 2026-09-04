# Error Object Structure & Properties

## Core Error Object Components

**Error Object:** A structured object representing an error condition, providing rich diagnostic data compared to
primitive strings.

| Property / Component | Purpose / Description                                              | Example                            |
|:---------------------|:-------------------------------------------------------------------|:-----------------------------------|
| `message`            | Human-readable description of what failed and why                  | `"Invalid value"`                  |
| `name`               | Identifies the category or class of the error                      | `"TypeError"`, `"RangeError"`      |
| Stack Trace          | Execution path showing function calls and line numbers at creation | `at functionA()`, `at functionB()` |

## Custom Error Properties

Applications often attach custom metadata to error objects to enhance debugging and error management.

| Custom Property | Purpose / Description             | Common Use Case                      |
|:----------------|:----------------------------------|:-------------------------------------|
| `code`          | Machine-readable error identifier | `"PAYMENT_FAILED"`, `"AUTH_EXPIRED"` |
| `status`        | HTTP or application state code    | `404`, `500`                         |
| `timestamp`     | Time of occurrence                | Logging execution telemetry          |
| `details`       | Extra debugging payload           | Form validation error arrays         |

## Error Objects vs. Primitive Strings

| Feature                   | Error Object | String (`throw "error"`) |
|:--------------------------|:-------------|:-------------------------|
| Diagnostic Message        | Yes          | Yes                      |
| Error Name / Type         | Yes          | No                       |
| Automatic Stack Trace     | Yes          | No                       |
| Custom Properties Support | Yes          | No                       |

## Best Practices

* **Always throw Error objects:** Never throw primitive strings; error objects supply vital stack traces and structured
  metadata.
* **Write descriptive messages:** Clearly explain what failed and provide context to speed up troubleshooting.
* **Attach custom properties for context:** Add machine-readable codes or status properties to handle errors
  programmatically.
* **Protect sensitive data:** Ensure error messages do not leak private user information, credentials, or internal paths
  to end users.
* **Standardize custom error property schemas:** Maintain consistent naming conventions (like `code`, `status`, or
  `details`) across all domain errors for predictable client consumption.
* **Do not mutate native error properties directly:** Treat `.name` and `.message` immutably after construction or pass
  them cleanly through subclass constructors.
* **Ensure stack traces are captured correctly:** Rely on standard instantiation mechanics so the V8 engine correctly
  populates the call stack trace line numbers.
* **Sanitize stack traces in production logs:** Filter out internal file paths or server environments before
  transmitting stack data to client-facing UIs.
* **Use machine-readable error codes for control flow:** Inspect `.code` properties rather than fragile `.message` text
  strings when routing error recovery logic.
* **Attach request IDs to error objects:** Include correlation or tracing IDs within error payloads to simplify
  cross-service debugging in distributed architectures.
* **Keep error payloads lightweight:** Avoid attaching massive objects or circular data structures to custom error
  properties to prevent serialization crashes.
* **Test custom error property serialization:** Verify that custom error attributes survive JSON conversion or logging
  mechanisms without being stripped away.
* **Document error properties in API contracts:** Provide clear type definitions and schemas for any custom metadata
  attached to thrown application errors.
* **Capture timestamps during error instantiation:** Attach accurate occurrence timestamps automatically within custom
  error constructors to aid telemetry analysis.
* **Validate error property types defensively:** Check that attached metadata fields conform to expected formats before
  processing them downstream.
* **Avoid storing state modifications in error objects:** Keep error instances purely informational rather than using
  them to trigger side effects during handling.
* **Provide actionable remediation details:** Include clear guidance within error metadata describing how clients can
  correct the invalid operation.
* **Review error object memory retention:** Ensure caught errors holding large diagnostic payloads are not permanently
  retained in global scopes.
* **Test error object creation performance:** Confirm that heavy custom error construction does not introduce overhead
  in high-frequency execution loops.
* **Maintain uniform error structures across teams:** Enforce organizational standards for error object composition so
  logging and monitoring systems remain reliable.