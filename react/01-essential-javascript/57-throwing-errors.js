/**
 * Throwing Errors
 * ===============
 *
 * Throwing an error stops the current execution flow and transfers control
 * to the nearest matching error handler.
 */

// ---------------------------------------------------------------------
// 1. The throw statement
// ---------------------------------------------------------------------

function requireValue(value) {
  if (value === undefined) {
    throw new Error("A value is required");
  }

  return value;
}

// ---------------------------------------------------------------------
// 2. Throwing an Error object
// ---------------------------------------------------------------------

function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }

  return a / b;
}

// ---------------------------------------------------------------------
// 3. Throwing with a message
// ---------------------------------------------------------------------

function findUser(user) {
  if (!user) {
    throw new Error("User was not provided");
  }

  return user;
}

// ---------------------------------------------------------------------
// 4. Throwing conditionally
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
// 5. Throwing from a function
// ---------------------------------------------------------------------

function parsePositiveNumber(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    throw new TypeError("Value must be a number");
  }

  if (number <= 0) {
    throw new RangeError("Value must be greater than zero");
  }

  return number;
}

// ---------------------------------------------------------------------
// 6. Throwing different built-in error types
// ---------------------------------------------------------------------

function getItem(items, index) {
  if (!Array.isArray(items)) {
    throw new TypeError("Items must be an array");
  }

  if (!Number.isInteger(index)) {
    throw new TypeError("Index must be an integer");
  }

  if (index < 0 || index >= items.length) {
    throw new RangeError("Index is outside the array");
  }

  return items[index];
}

// ---------------------------------------------------------------------
// 7. Throwing a custom error
// ---------------------------------------------------------------------

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateUsername(username) {
  if (typeof username !== "string") {
    throw new ValidationError("Username must be a string");
  }

  if (username.length < 3) {
    throw new ValidationError("Username must contain at least 3 characters");
  }

  return username;
}

// ---------------------------------------------------------------------
// 8. Throwing with additional context
// ---------------------------------------------------------------------

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} with id "${id}" was not found`);
    this.name = "NotFoundError";
    this.resource = resource;
    this.id = id;
  }
}

function getProduct(products, id) {
  const product = products.find((item) => item.id === id);

  if (!product) {
    throw new NotFoundError("Product", id);
  }

  return product;
}

// ---------------------------------------------------------------------
// 9. Rethrowing an error
// ---------------------------------------------------------------------

function loadUser(load) {
  try {
    return load();
  } catch (error) {
    throw new Error("Failed to load user", {
      cause: error,
    });
  }
}

// ---------------------------------------------------------------------
// 10. Preserving the original error with cause
// ---------------------------------------------------------------------

function createApplicationError(error) {
  return new Error("Application operation failed", {
    cause: error,
  });
}

const originalError = new Error("Database connection failed");
const applicationError = createApplicationError(originalError);
// applicationError.cause === originalError -> true

// ---------------------------------------------------------------------
// 11. Throwing non-Error values
// ---------------------------------------------------------------------

// While JavaScript technically allows any value to be thrown, always prefer
// throwing `Error` objects to maintain a consistent diagnostic structure.

// ---------------------------------------------------------------------
// 12. Throwing preserves the current execution flow
// ---------------------------------------------------------------------

function processValue(value) {
  if (value === null) {
    throw new Error("Value cannot be null");
  }

  return value;
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `throw` immediately interrupts normal execution flow.
// - Error objects are the preferred values to throw for consistent diagnostics.
// - `Error`, `TypeError`, and `RangeError` represent common failure types.
// - Errors can be thrown conditionally or from any function.
// - Custom Error subclasses can store domain-specific context and metadata.
// - The `cause` option preserves underlying root errors when rethrowing/wrapping.
// - Handling thrown errors belongs to `try-catch-finally` blocks.
