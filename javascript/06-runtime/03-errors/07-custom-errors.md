# Creating Custom Errors

## Core Concepts & Implementation

**Custom Error:** A user-defined error class extending JavaScript's built-in `Error` (or specific built-ins like
`TypeError`) to represent domain-specific application failures with precision.

| Component / Pattern               | Mechanism / Purpose                                                                                 | Example Code / Syntax                                                                                                                        |
|:----------------------------------|:----------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------|
| `class CustomError extends Error` | Establishes prototype inheritance, ensuring compatibility with stack traces and `instanceof` checks | `class ValidationError extends Error { constructor(message) { super(message); this.name = "ValidationError"; } }`                            |
| Custom Constructors & Properties  | Attaches contextual data (`field`, `code`, `status`) to aid error management                        | `class ValidationError extends Error { constructor(message, field) { super(message); this.name = "ValidationError"; this.field = field; } }` |
| Extending Specific Errors         | Inheriting from native subclasses rather than base `Error`                                          | `class InvalidInputError extends TypeError {}`                                                                                               |

## Error Hierarchies & Layering

Custom errors can be structured using object inheritance models (e.g., `ApplicationError` extending `Error`, and
`ValidationError` or `AuthenticationError` extending `ApplicationError`) to facilitate broad or granular catching logic
across system boundaries.

| Boundary / Layer  | Common Custom Error Type                  | Purpose                                              |
|:------------------|:------------------------------------------|:-----------------------------------------------------|
| API / Route Layer | `AuthenticationError` / `ValidationError` | Formulate user-facing feedback and HTTP status codes |
| Database Layer    | `DatabaseError`                           | Encapsulate storage failures and connection drops    |

## Best Practices

* **Always extend `Error`:** Ensure custom classes inherit standard JavaScript error features, stack traces, and
  `instanceof` behavior.
* **Explicitly set `this.name`:** Set the error name property inside constructors so logs and stack traces accurately
  reflect the custom class name.
* **Keep hierarchies focused:** Create domain-specific error classes only when they map to distinct recovery or
  reporting workflows.
* **Attach useful metadata:** Include properties like error codes, target fields, or status codes to empower upstream
  handlers with actionable context.
* **Call `super(message)` immediately in constructors:** Ensure parent error initialization runs before accessing `this`
  to correctly capture V8 stack traces.
* **Maintain prototype chain consistency when transpiling:** Use modern ES6 class syntax or configure Babel/TypeScript
  build targets correctly to prevent `instanceof` failures on custom subclasses.
* **Avoid over-engineering complex error hierarchies:** Create custom classes only when specialized domain handling or
  telemetry tracking is required.
* **Map custom errors cleanly to HTTP status codes:** Assign appropriate status mappings within API-level custom errors
  for seamless client responses.
* **Preserve original causes during error translation:** Pass underlying lower-level errors into custom error wrappers
  using the `{ cause }` options pattern.
* **Document custom error payloads and codes:** Maintain clear specifications for custom properties like `.code` or
  `.field` so consumers can write reliable handlers.
* **Test `instanceof` checks explicitly:** Write unit test assertions verifying that custom errors trigger expected
  branch logic during catch handling.
* **Do not store mutable state inside error classes:** Keep custom error instances stateless and immutable after
  instantiation to prevent race conditions during logging.
* **Sanitize internal database details in custom errors:** Prevent sensitive query strings or connection strings from
  leaking through domain error messages.
* **Implement standard serialization for custom errors:** Ensure custom properties serialize correctly when passing
  errors through logging or JSON transport layers.
* **Include timestamps in custom error constructors:** Automatically attach creation timestamps to custom errors for
  precise telemetry tracking.
* **Keep custom error names aligned with class identifiers:** Ensure `this.name` matches the exact name of the custom
  error class for clear debugging output.
* **Review custom error usage across modules:** Audit custom class definitions periodically to remove redundant or
  unused error types.
* **Standardize custom error schemas across teams:** Enforce organizational guidelines for custom error structure to
  maintain uniformity across microservices.
* **Provide clear remediation hints in custom error texts:** Design custom error messages to be informative and
  actionable for developers or end users.
* **Test stack trace preservation on custom classes:** Verify that custom subclasses correctly retain call site line
  numbers back to the throw location.