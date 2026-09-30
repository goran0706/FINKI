/**
 * Optional Parameters
 * ===================
 *
 * An optional parameter is a function parameter that does not have to be provided
 * when the function is called. A `?` after the parameter name marks it as optional.
 */

// -----------------------------------------------------------------------
// 1. Defining optional parameters
// -----------------------------------------------------------------------

// An optional parameter can be omitted when calling the function.
function greet(name: string, title?: string): string {
  if (title) {
    return `Hello, ${title} ${name}!`;
  }

  return `Hello, ${name}!`;
}

console.log(greet("John Doe")); // "Hello, John Doe!"
console.log(greet("John Doe", "Developer")); // "Hello, Developer John Doe!"

// The required parameter must be provided.
// greet(); // TS2554: Expected 1-2 arguments, but got 0.

// -----------------------------------------------------------------------
// 2. Optional parameter values
// -----------------------------------------------------------------------

// An omitted optional parameter has the value `undefined`.
function describeUser(name: string, age?: number): string {
  return `${name}: ${age}`;
}

console.log(describeUser("John Doe")); // "John Doe: undefined"
console.log(describeUser("John Doe", 30)); // "John Doe: 30"

// -----------------------------------------------------------------------
// 3. Checking optional parameters
// -----------------------------------------------------------------------

// An optional parameter has a type that includes `undefined`.
function formatAge(age?: number): string {
  if (age === undefined) {
    return "Age not provided";
  }

  return `Age: ${age}`;
}

console.log(formatAge()); // "Age not provided"
console.log(formatAge(30)); // "Age: 30"

// TypeScript knows that `age` is a number after the `undefined` check.

// -----------------------------------------------------------------------
// 4. Optional parameters with different types
// -----------------------------------------------------------------------

// Any parameter type can be made optional.
function formatValue(value: string, prefix?: string): string {
  if (prefix === undefined) {
    return value;
  }

  return `${prefix}${value}`;
}

console.log(formatValue("100")); // "100"
console.log(formatValue("100", "$")); // "$100"

// -----------------------------------------------------------------------
// 5. Multiple optional parameters
// -----------------------------------------------------------------------

// Multiple parameters can be optional when they follow all required parameters.
function createUser(name: string, age?: number, email?: string): string {
  const parts = [name];

  if (age !== undefined) {
    parts.push(`age: ${age}`);
  }

  if (email !== undefined) {
    parts.push(`email: ${email}`);
  }

  return parts.join(", ");
}

console.log(createUser("John Doe")); // "John Doe"
console.log(createUser("John Doe", 30)); // "John Doe, age: 30"
console.log(createUser("John Doe", 30, "[john@example.com](mailto:john@example.com)")); // "John Doe, age: 30, email: [john@example.com](mailto:john@example.com)"

// -----------------------------------------------------------------------
// 6. Required parameters after optional parameters
// -----------------------------------------------------------------------

// A required parameter cannot follow an optional parameter.
// function invalidFunction(value?: string, count: number): void {
//   console.log(value, count);
// }
// TS1016: A required parameter cannot follow an optional parameter.

// Required parameters must come before optional parameters.
function validFunction(count: number, value?: string): void {
  console.log(count, value);
}

validFunction(10); // 10 undefined
validFunction(10, "items"); // 10 "items"

// -----------------------------------------------------------------------
// 7. Optional parameters vs undefined arguments
// -----------------------------------------------------------------------

// An optional parameter can be omitted or explicitly passed as `undefined`.
function showMessage(message?: string): string {
  return message ?? "No message";
}

console.log(showMessage()); // "No message"
console.log(showMessage(undefined)); // "No message"
console.log(showMessage("Hello")); // "Hello"

// -----------------------------------------------------------------------
// 8. Optional parameters in callbacks
// -----------------------------------------------------------------------

// Optional parameters can also be used in function types.
type Logger = (message: string, prefix?: string) => void;

const log: Logger = (message, prefix) => {
  console.log(prefix ? `${prefix}: ${message}` : message);
};

log("Server started"); // "Server started"
log("Server started", "INFO"); // "INFO: Server started"

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - An optional parameter is declared by placing `?` after its name.
// - Optional parameters can be omitted when calling a function.
// - An omitted optional parameter has the value `undefined`.
// - Optional parameters should be checked before being used as their required type.
// - Required parameters must come before optional parameters.
// - Optional parameters can be explicitly passed as `undefined`.
// - Optional parameters can also be used in function types and callbacks.
