/**
 * Unknown
 * =======
 *
 * The `unknown` type represents a value whose type is not known at compile time.
 * Unlike `any`, an `unknown` value must be narrowed or validated before it can be used.
 */

// -----------------------------------------------------------------------
// 1. Defining unknown values
// -----------------------------------------------------------------------

// `unknown` can hold values of any type.
let value: unknown = "Hello";

console.log(value); // "Hello"

value = 42;
console.log(value); // 42

value = true;
console.log(value); // true

value = null;
console.log(value); // null

// Any value can be assigned to `unknown`.

// -----------------------------------------------------------------------
// 2. Unknown values require narrowing
// -----------------------------------------------------------------------

// TypeScript does not allow operations on `unknown` without first checking its type.
let input: unknown = "TypeScript";

// input.toUpperCase(); // TS18046: 'input' is of type 'unknown'.

if (typeof input === "string") {
  console.log(input.toUpperCase()); // "TYPESCRIPT"
}

// The `typeof` check narrows `input` from `unknown` to `string`.

// -----------------------------------------------------------------------
// 3. Narrowing unknown primitives
// -----------------------------------------------------------------------

// `unknown` can be narrowed to different primitive types.
function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return `String: ${value}`;
  }

  if (typeof value === "number") {
    return `Number: ${value}`;
  }

  if (typeof value === "boolean") {
    return `Boolean: ${value}`;
  }

  return "Other value";
}

console.log(describeValue("hello")); // "String: hello"
console.log(describeValue(42)); // "Number: 42"
console.log(describeValue(true)); // "Boolean: true"
console.log(describeValue(null)); // "Other value"

// Each `typeof` check narrows the value before it is used.

// -----------------------------------------------------------------------
// 4. Unknown with null and undefined
// -----------------------------------------------------------------------

// `unknown` may contain `null` or `undefined`, so they must also be checked.
function getValueLength(value: unknown): number {
  if (typeof value === "string") {
    return value.length;
  }

  if (Array.isArray(value)) {
    return value.length;
  }

  return 0;
}

console.log(getValueLength("TypeScript")); // 10
console.log(getValueLength([1, 2, 3])); // 3
console.log(getValueLength(null)); // 0
console.log(getValueLength(undefined)); // 0

// The function safely handles values whose types are not known beforehand.

// -----------------------------------------------------------------------
// 5. Unknown with objects
// -----------------------------------------------------------------------

// An `unknown` value must be checked before accessing object properties.
function getUsername(value: unknown): string {
  if (typeof value === "object" && value !== null && "username" in value && typeof value.username === "string") {
    return value.username;
  }

  return "Unknown user";
}

console.log(getUsername({ username: "John Doe" })); // "John Doe"
console.log(getUsername({ username: 42 })); // "Unknown user"
console.log(getUsername("John Doe")); // "Unknown user"

// The checks narrow the value enough for TypeScript to safely access `username`.

// -----------------------------------------------------------------------
// 6. Unknown with arrays
// -----------------------------------------------------------------------

// `Array.isArray` narrows an unknown value to an array.
function getFirstValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
}

console.log(getFirstValue(["John", "Jane"])); // "John"
console.log(getFirstValue("John")); // undefined

// The element type is still unknown because the array's element type is not known.

// -----------------------------------------------------------------------
// 7. Unknown with type guards
// -----------------------------------------------------------------------

// User-defined type guards can provide more precise narrowing for unknown values.
type User = {
  id: number;
  name: string;
};

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return "id" in value && "name" in value && typeof value.id === "number" && typeof value.name === "string";
}

const data: unknown = {
  id: 1,
  name: "John Doe",
};

if (isUser(data)) {
  console.log(data.name); // "John Doe"
}

// The type guard narrows `data` from `unknown` to `User`.

// -----------------------------------------------------------------------
// 8. Unknown in error handling
// -----------------------------------------------------------------------

// Errors caught by `catch` are treated as `unknown` when `useUnknownInCatchVariables` is enabled.
function parseData(value: string): void {
  try {
    JSON.parse(value);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("Unknown error");
    }
  }
}

parseData('{"name":"John"}');
parseData("{invalid}");

// Checking the error before accessing `message` keeps error handling type-safe.

// -----------------------------------------------------------------------
// 9. Unknown vs any
// -----------------------------------------------------------------------

// `any` disables type checking, while `unknown` requires validation before use.
let unsafeValue: any = "Hello";
let safeValue: unknown = "Hello";

console.log(unsafeValue.toUpperCase()); // "HELLO"

// safeValue.toUpperCase(); // TS18046: 'safeValue' is of type 'unknown'.

if (typeof safeValue === "string") {
  console.log(safeValue.toUpperCase()); // "HELLO"
}

// Prefer `unknown` when a value can legitimately have an unknown type.
// Use `any` only when opting out of type safety is intentional.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - `unknown` can hold a value of any type.
// - Unlike `any`, `unknown` cannot be used without first being narrowed.
// - `typeof`, `Array.isArray`, `in`, `instanceof`, and type guards can narrow unknown values.
// - `unknown` is useful for external data whose type cannot be trusted at compile time.
// - `unknown` works well for safely handling caught errors.
// - Prefer `unknown` over `any` when the value's type is not known.
