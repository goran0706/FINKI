/**
 * Any
 * ===
 *
 * The `any` type disables TypeScript's type checking for a value. It allows
 * almost any operation and should be used carefully because it removes type safety.
 */

// -----------------------------------------------------------------------
// 1. Defining values with `any`
// -----------------------------------------------------------------------

// A value typed as `any` can hold values of any type.
let value: any = "Hello";

console.log(value); // "Hello"

value = 42;
console.log(value); // 42

value = true;
console.log(value); // true

// TypeScript allows `any` to change between unrelated types.

// -----------------------------------------------------------------------
// 2. Any allows unrestricted operations
// -----------------------------------------------------------------------

// TypeScript does not check whether an operation is valid for an `any` value.
let input: any = "TypeScript";

console.log(input.toUpperCase()); // "TYPESCRIPT"

input = 42;

console.log(input.toFixed(2)); // "42.00"

// TypeScript does not report an error even though `input` has different types at runtime.

// -----------------------------------------------------------------------
// 3. Invalid operations with any
// -----------------------------------------------------------------------

// `any` can allow code that will fail when it actually runs.
let data: any = "Hello";

// console.log(data.toFixed(2)); // Runtime error: data.toFixed is not a function.

// TypeScript cannot protect against this error because `data` is `any`.

// -----------------------------------------------------------------------
// 4. Any bypasses property checking
// -----------------------------------------------------------------------

// TypeScript normally checks whether an object contains a requested property.
const user: any = {
  name: "John Doe",
};

console.log(user.name); // "John Doe"

// console.log(user.email); // No TypeScript error, but the value is undefined at runtime.

// Accessing unknown properties is allowed because `user` is `any`.

// -----------------------------------------------------------------------
// 5. Any bypasses function checking
// -----------------------------------------------------------------------

// An `any` value can be called as a function without TypeScript verifying it.
const operation: any = "not a function";

// operation(); // Runtime error: operation is not a function.

// TypeScript allows the call because `operation` is `any`.

// -----------------------------------------------------------------------
// 6. Any spreads through expressions
// -----------------------------------------------------------------------

// Operations involving `any` often produce another `any` value.
let source: any = {
  name: "John Doe",
};

const result = source.user.profile.name;

console.log(result); // undefined or a runtime error depending on the value.

// TypeScript cannot verify any of the intermediate properties.

// -----------------------------------------------------------------------
// 7. Any and function parameters
// -----------------------------------------------------------------------

// Using `any` for a parameter removes type checking for callers and the function body.
function printValue(value: any): void {
  console.log(value.toUpperCase());
}

printValue("hello"); // "HELLO"

// printValue(42); // No TypeScript error, but this causes a runtime error.

// A more specific parameter type would catch the invalid call at compile time.

// -----------------------------------------------------------------------
// 8. Any vs unknown
// -----------------------------------------------------------------------

// `any` allows operations without narrowing.
let unsafeValue: any = "Hello";

console.log(unsafeValue.toUpperCase()); // "HELLO"

// `unknown` requires narrowing before the same operation is allowed.
let safeValue: unknown = "Hello";

// safeValue.toUpperCase(); // TS18046: 'safeValue' is of type 'unknown'.

if (typeof safeValue === "string") {
  console.log(safeValue.toUpperCase()); // "HELLO"
}

// Prefer `unknown` when a value's type is genuinely unknown.

// -----------------------------------------------------------------------
// 9. When any may be appropriate
// -----------------------------------------------------------------------

// `any` can be useful when integrating with code or libraries whose types cannot
// reasonably be represented yet, but its use should be isolated and intentional.
function parseLegacyValue(value: any): any {
  return value;
}

const legacyValue = parseLegacyValue("Hello");

console.log(legacyValue); // "Hello"

// Keep `any` at system boundaries when necessary rather than allowing it to spread
// throughout the rest of the application.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - `any` disables TypeScript's type checking for a value.
// - An `any` value can hold values of any type and can be reassigned freely.
// - Property access, function calls, and other operations are not checked on `any`.
// - Errors involving `any` may therefore appear only at runtime.
// - `any` can spread through expressions and function return values.
// - Prefer specific types or `unknown` when possible.
// - Use `any` intentionally and keep it isolated when integration constraints require it.
