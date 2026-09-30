/**
 * Generic Functions
 * =================
 *
 * Generic functions allow you to write reusable, type-safe logic that can
 * work over a variety of types rather than a single specific type, capturing
 * and preserving type information from input to output.
 */

// ---------------------------------------------------------------------
// 1. Basic Generic Function
// ---------------------------------------------------------------------

// The type parameter `<T>` acts as a placeholder for the type passed in:
function identity<T>(value: T): T {
  return value;
}

const stringResult = identity("hello"); // Inferred type: string
const numberResult = identity(42); // Inferred type: number
const explicitResult = identity<boolean>(true); // Explicit type argument

// ---------------------------------------------------------------------
// 2. Multiple Type Parameters
// ---------------------------------------------------------------------

// Functions can accept multiple independent type parameters:
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const mixedPair = pair("id", 101); // Inferred type: [string, number]

// ---------------------------------------------------------------------
// 3. Generic Constraints (`extends`)
// ---------------------------------------------------------------------

// Restricting type parameters to ensure they possess certain properties:
function logLength<T extends { length: number }>(item: T): T {
  console.log(item.length);
  return item;
}

logLength("hello"); // Valid: strings have a length property
logLength([1, 2, 3]); // Valid: arrays have a length property
logLength({ length: 10 }); // Valid: custom objects with length
// logLength(42);          // Error: number does not have a length property

// ---------------------------------------------------------------------
// 4. Using Type Parameters in Constraints (`keyof`)
// ---------------------------------------------------------------------

// Ensuring a key belongs strictly to a specific object's properties:
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Ana" };
const userName = getProperty(user, "name"); // Inferred type: string
// getProperty(user, "age");                // Error: "age" is not a key of user

// ---------------------------------------------------------------------
// 5. Default Type Arguments
// ---------------------------------------------------------------------

// Providing fallback types for generics if type argument inference is omitted:
function createResponse<T = string>(data: T): { status: number; payload: T } {
  return {
    status: 200,
    payload: data,
  };
}

const defaultResponse = createResponse("Success"); // payload is typed as string
const customResponse = createResponse<number>(42); // payload is typed as number

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Generic functions use type parameters (e.g., `<T>`) to handle multiple types safely.
// - Type arguments can be explicitly provided or automatically inferred from function arguments.
// - Use `extends` to add constraints, ensuring inputs satisfy specific structural requirements.
// - Combine multiple type parameters and `keyof` constraints for advanced type-safe lookups.
