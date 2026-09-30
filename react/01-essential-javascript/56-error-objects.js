/**
 * Error Objects
 * =============
 *
 * JavaScript provides Error objects for representing failures and exceptional
 * conditions. Error objects carry information about what went wrong and can
 * be thrown, caught, inspected, and passed through application code.
 */

// ---------------------------------------------------------------------
// 1. Creating an Error
// ---------------------------------------------------------------------

// Error is a built-in constructor for creating error objects.
const error = new Error("Something went wrong");
// error instanceof Error -> true
// error.message -> "Something went wrong"
// Note: Creating an Error object does not throw it automatically; it only represents a failure.

// ---------------------------------------------------------------------
// 2. Error message
// ---------------------------------------------------------------------

// The message property describes the specific failure operation or invalid condition.
const userError = new Error("User could not be loaded");
const emptyMessage = new Error(); // message defaults to ""

// ---------------------------------------------------------------------
// 3. Error name
// ---------------------------------------------------------------------

// The name property identifies the kind of error (e.g., "Error", "TypeError").
const genericError = new Error("Request failed");
const typeError = new TypeError("Expected a string");

// ---------------------------------------------------------------------
// 4. Stack trace
// ---------------------------------------------------------------------

// Environments provide a `stack` property containing diagnostic details.
// Application logic should not rely on its exact string format.
const stackError = new Error("Operation failed");
// stackError.stack

// ---------------------------------------------------------------------
// 5. Error objects are objects
// ---------------------------------------------------------------------

// Error objects have type `"object"`, inherit from `Error.prototype`, and satisfy `instanceof Error`.

// ---------------------------------------------------------------------
// 6. Error objects can contain additional properties
// ---------------------------------------------------------------------

// Structured metadata (like status or codes) can be attached directly to an Error object.
const requestError = new Error("Request failed");
requestError.status = 503;
requestError.code = "SERVICE_UNAVAILABLE";

// ---------------------------------------------------------------------
// 7. TypeError
// ---------------------------------------------------------------------

// TypeError indicates that a value has an inappropriate type or cannot be used as required.
const invalidValueError = new TypeError("Expected a function");
// Automatically produced for operations like `null.toUpperCase()`.

// ---------------------------------------------------------------------
// 8. ReferenceError
// ---------------------------------------------------------------------

// ReferenceError occurs when an unresolvable identifier is accessed or evaluated.
const referenceError = new ReferenceError("Variable is not defined");

// ---------------------------------------------------------------------
// 9. SyntaxError
// ---------------------------------------------------------------------

// SyntaxError represents invalid JavaScript source code syntax.
const syntaxError = new SyntaxError("Invalid syntax");

// ---------------------------------------------------------------------
// 10. RangeError
// ---------------------------------------------------------------------

// RangeError represents a numerical value falling outside an allowed range.
const rangeError = new RangeError("Value must be between 0 and 100");

// ---------------------------------------------------------------------
// 11. URIError
// ---------------------------------------------------------------------

// URIError represents invalid URI-related operations (e.g., malformed `decodeURIComponent`).
const uriError = new URIError("Invalid URI component");

// ---------------------------------------------------------------------
// 12. EvalError
// ---------------------------------------------------------------------

// EvalError is a legacy built-in Error type rarely produced in modern JavaScript `eval()` usage.
const evalError = new EvalError("Evaluation failed");

// ---------------------------------------------------------------------
// 13. AggregateError
// ---------------------------------------------------------------------

// AggregateError bundles multiple failure instances together under a single error object.
const errors = [new Error("First failed"), new Error("Second failed")];
const aggregateError = new AggregateError(errors, "Multiple operations failed");
// aggregateError.errors contains the array of individual errors.

// ---------------------------------------------------------------------
// 14. Error inheritance
// ---------------------------------------------------------------------

// Specialized error types inherit from `Error`, allowing generic handling or specific checks.
const networkError = new TypeError("Invalid network response");
// networkError instanceof TypeError -> true
// networkError instanceof Error -> true

// ---------------------------------------------------------------------
// 15. Checking an error type
// ---------------------------------------------------------------------

function isTypeError(value) {
  return value instanceof TypeError;
}

// ---------------------------------------------------------------------
// 16. Error causes
// ---------------------------------------------------------------------

// An Error can preserve a lower-level root failure as its cause via options.
const databaseError = new Error("Database connection failed");
const serviceError = new Error("Could not load user data", {
  cause: databaseError,
});
// serviceError.cause === databaseError -> true

// ---------------------------------------------------------------------
// 17. Wrapping an error with cause
// ---------------------------------------------------------------------

function loadUser() {
  try {
    return readUserFromDatabase();
  } catch (error) {
    throw new Error("Failed to load user", { cause: error });
  }
}

// ---------------------------------------------------------------------
// 18. Custom Error classes
// ---------------------------------------------------------------------

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// ---------------------------------------------------------------------
// 19. Custom Error properties
// ---------------------------------------------------------------------

class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

// ---------------------------------------------------------------------
// 20. Custom Error with cause
// ---------------------------------------------------------------------

class DataAccessError extends Error {
  constructor(message, options = {}) {
    super(message, options);
    this.name = "DataAccessError";
  }
}

// ---------------------------------------------------------------------
// 21. Error values can be inspected
// ---------------------------------------------------------------------

function describeError(error) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
}

// ---------------------------------------------------------------------
// 22. Error objects versus error messages
// ---------------------------------------------------------------------

// Error objects carry rich diagnostic data (name, message, stack, custom properties)
// far beyond a simple message string.

// ---------------------------------------------------------------------
// 23. Error objects versus arbitrary thrown values
// ---------------------------------------------------------------------

// While JavaScript allows throwing arbitrary values, throwing Error instances
// is strongly preferred for standard diagnostic structures.

// ---------------------------------------------------------------------
// 24. Error identity
// ---------------------------------------------------------------------

// Each call to `new Error()` creates a distinct object instance (`firstError === secondError` is false).

// ---------------------------------------------------------------------
// 25. Error messages should provide context
// ---------------------------------------------------------------------

function validateAge(age) {
  if (typeof age !== "number") {
    throw new TypeError("Age must be a number");
  }
  if (age < 0) {
    throw new RangeError("Age cannot be negative");
  }
  return age;
}

// ---------------------------------------------------------------------
// 26. Error type and message serve different purposes
// ---------------------------------------------------------------------

// The error type communicates the failure category, while the message provides specific context.

// ---------------------------------------------------------------------
// 27. Error properties should carry structured data
// ---------------------------------------------------------------------

// Use structured properties (like codes and status flags) rather than parsing human-readable messages.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Error is the base built-in object used to represent application failures.
// - Specialized error types (`TypeError`, `ReferenceError`, `RangeError`, etc.) inherit from `Error`.
// - The `cause` option preserves underlying root errors when wrapping failures.
// - Custom error classes allow applications to define domain-specific failure categories.
// - Structured properties and Error instances provide consistent error handling and diagnostics.
