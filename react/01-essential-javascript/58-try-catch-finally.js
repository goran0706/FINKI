/**
 * Try Catch Finally
 * =================
 *
 * `try`, `catch`, and `finally` control how JavaScript handles errors during
 * execution. Code in `try` executes normally, `catch` handles thrown errors,
 * and `finally` runs after either successful or failed execution.
 */

// ---------------------------------------------------------------------
// 1. Basic try-catch
// ---------------------------------------------------------------------

try {
  throw new Error("Something went wrong");
} catch (error) {
  // The thrown error is available inside `catch`.
}

// ---------------------------------------------------------------------
// 2. Catching an error from a function
// ---------------------------------------------------------------------

function parseNumber(value) {
  return JSON.parse(value);
}

try {
  const result = parseNumber("invalid");
} catch (error) {
  // The error thrown by `parseNumber` is caught here.
}

// ---------------------------------------------------------------------
// 3. The caught error
// ---------------------------------------------------------------------

try {
  throw new TypeError("Expected a number");
} catch (error) {
  const { name, message, stack } = error;
  // `error` is an Error object containing diagnostic information.
}

// ---------------------------------------------------------------------
// 4. Handling different error types
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

try {
  validateAge("twenty");
} catch (error) {
  if (error instanceof TypeError) {
    // Handle invalid type.
  } else if (error instanceof RangeError) {
    // Handle invalid range.
  } else {
    // Handle an unexpected error.
  }
}

// ---------------------------------------------------------------------
// 5. Finally
// ---------------------------------------------------------------------

try {
  const value = 10 / 2;
} catch (error) {
  // Runs only when an error occurs.
} finally {
  // Runs whether the operation succeeds or fails.
}

// ---------------------------------------------------------------------
// 6. try-catch-finally
// ---------------------------------------------------------------------

try {
  const result = JSON.parse('{"valid": true}');
} catch (error) {
  // Handle parsing failure.
} finally {
  // Perform work that must happen after the operation.
}

// ---------------------------------------------------------------------
// 7. finally runs after a caught error
// ---------------------------------------------------------------------

let completed = false;

try {
  throw new Error("Operation failed");
} catch (error) {
  completed = false;
} finally {
  completed = true; // Runs after the `catch` block.
}

// ---------------------------------------------------------------------
// 8. finally runs when there is no error
// ---------------------------------------------------------------------

let finished = false;

try {
  finished = true;
} finally {
  finished = true; // Still runs when the `try` block succeeds.
}

// ---------------------------------------------------------------------
// 9. Rethrowing an error
// ---------------------------------------------------------------------

function processUser(user) {
  try {
    if (!user) {
      throw new Error("User is missing");
    }
    return user;
  } catch (error) {
    throw error; // Rethrowing the caught error.
  }
}

// ---------------------------------------------------------------------
// 10. Rethrowing with additional context
// ---------------------------------------------------------------------

function loadSettings(load) {
  try {
    return load();
  } catch (error) {
    throw new Error("Failed to load settings", {
      cause: error,
    });
  }
}

// ---------------------------------------------------------------------
// 11. Nested try-catch
// ---------------------------------------------------------------------

try {
  try {
    throw new Error("Inner failure");
  } catch (error) {
    throw error; // Rethrow to inner handler / outer handler
  }
} catch (error) {
  // The rethrown error reaches the outer handler.
}

// ---------------------------------------------------------------------
// 12. finally and return
// ---------------------------------------------------------------------

function getValue() {
  try {
    return "result";
  } finally {
    // `finally` runs before the function actually returns.
  }
}

// ---------------------------------------------------------------------
// 13. finally can override a return
// ---------------------------------------------------------------------

function getOverriddenValue() {
  try {
    return "try";
  } finally {
    return "finally"; // Overrides earlier return; should generally be avoided.
  }
}

// ---------------------------------------------------------------------
// 14. finally and thrown errors
// ---------------------------------------------------------------------

function failOperation() {
  try {
    throw new Error("Operation failed");
  } finally {
    // Runs before the error continues to the caller.
  }
}

// ---------------------------------------------------------------------
// 15. Cleanup with finally
// ---------------------------------------------------------------------

let resourceOpen = false;

function useResource() {
  resourceOpen = true;

  try {
    // Work with the resource.
  } finally {
    resourceOpen = false; // Always ensures cleanup.
  }
}

// ---------------------------------------------------------------------
// 16. Catching only expected errors
// ---------------------------------------------------------------------

function readValue(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return null;
    }

    throw error; // Unexpected errors should not be silently ignored.
  }
}

// ---------------------------------------------------------------------
// 17. Optional catch binding
// ---------------------------------------------------------------------

try {
  JSON.parse("invalid");
} catch {
  // The error value is omitted when the error itself is irrelevant.
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `try` contains code that may throw an error.
// - `catch` runs when an error is thrown from the corresponding `try` block.
// - `finally` runs after `try` and `catch`, regardless of success or failure.
// - `instanceof` can distinguish different Error types.
// - Errors can be rethrown or wrapped with a `cause` property.
// - Avoid returning from `finally` because it overrides earlier returns and suppresses thrown errors.
// - Optional catch bindings allow omitting unused error identifiers.
