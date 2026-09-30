/**
 * Type Assertions
 * ===============
 *
 * A type assertion tells TypeScript to treat a value as a more specific type.
 * Assertions affect compile-time checking only and do not perform runtime conversion or validation.
 */

// -----------------------------------------------------------------------
// 1. Using the `as` syntax
// -----------------------------------------------------------------------

// The `as` syntax tells TypeScript which type to assume for a value.
const value: unknown = "Hello";

const message = value as string;

console.log(message.toUpperCase()); // "HELLO"

// The assertion changes how TypeScript views `value`; it does not change the runtime value.

// -----------------------------------------------------------------------
// 2. Type assertions with object types
// -----------------------------------------------------------------------

// An assertion can tell TypeScript that an object has a specific shape.
const data: unknown = {
  id: 1,
  name: "John Doe",
};

const user = data as {
  id: number;
  name: string;
};

console.log(user.id); // 1
console.log(user.name); // "John Doe"

// TypeScript trusts the assertion and does not verify the object's structure at runtime.

// -----------------------------------------------------------------------
// 3. Type assertions do not perform conversion
// -----------------------------------------------------------------------

// A type assertion does not convert a value into the asserted type.
const input: unknown = "42";

const numberValue = input as number;

console.log(numberValue); // "42"
console.log(typeof numberValue); // "string"

// `as number` only changes TypeScript's compile-time view.
// It does not convert the string `"42"` into the number `42`.

// -----------------------------------------------------------------------
// 4. Assertions with DOM elements
// -----------------------------------------------------------------------

// Type assertions are commonly used when TypeScript cannot infer a specific DOM element type.
const element = document.getElementById("username") as HTMLInputElement;

console.log(element.value);

// TypeScript can now access properties specific to `HTMLInputElement`.

// -----------------------------------------------------------------------
// 5. Non-null assertions
// -----------------------------------------------------------------------

// The `!` operator tells TypeScript that a value is not `null` or `undefined`.
const usernameElement = document.getElementById("username");

const username = usernameElement!.value;

console.log(username);

// The assertion does not perform a runtime null check.
// If the element does not exist, accessing `.value` will throw at runtime.

// -----------------------------------------------------------------------
// 6. Angle-bracket syntax
// -----------------------------------------------------------------------

// TypeScript also supports angle-bracket assertions outside JSX.
const inputValue: unknown = "Hello";

const text = <string>inputValue;

console.log(text.toUpperCase()); // "HELLO"

// The `as` syntax is generally preferred because angle-bracket assertions conflict with JSX syntax.

// -----------------------------------------------------------------------
// 7. Assertions with union types
// -----------------------------------------------------------------------

// An assertion can narrow a union when the programmer knows more than TypeScript.
type Response = string | number;

const response: Response = "Success";

const responseText = response as string;

console.log(responseText.toUpperCase()); // "SUCCESS"

// Assertions should only be used when the asserted type is actually valid at runtime.

// -----------------------------------------------------------------------
// 8. Invalid assertions
// -----------------------------------------------------------------------

// TypeScript prevents assertions between types that are clearly incompatible.
const value: string = "Hello";

// const numberValue = value as number;
// TS2352: Conversion of type 'string' to type 'number' may be a mistake.

// When types do not sufficiently overlap, TypeScript rejects the assertion.

// -----------------------------------------------------------------------
// 9. Double assertions
// -----------------------------------------------------------------------

// A value can sometimes be asserted through `unknown` when two types do not overlap directly.
const textValue: string = "Hello";

const numberValue = textValue as unknown as number;

console.log(numberValue); // "Hello"
console.log(typeof numberValue); // "string"

// This does not convert the value.
// Double assertions should be avoided unless there is a specific boundary or interoperability reason.

// -----------------------------------------------------------------------
// 10. Assertions vs type guards
// -----------------------------------------------------------------------

// A type guard verifies a value at runtime before narrowing it.
function isString(value: unknown): value is string {
  return typeof value === "string";
}

const input: unknown = "TypeScript";

if (isString(input)) {
  console.log(input.toUpperCase()); // "TYPESCRIPT"
}

// A type assertion does not perform this runtime validation.
const assertedInput = input as string;

console.log(assertedInput.toUpperCase()); // "TYPESCRIPT"

// Prefer type guards when the actual runtime type is uncertain.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - Type assertions tell TypeScript to treat a value as a specific type.
// - The `as` syntax is the standard assertion syntax.
// - Type assertions affect compile-time checking but do not convert values at runtime.
// - The non-null assertion operator `!` tells TypeScript that a value is not nullish.
// - Angle-bracket assertions are supported outside JSX but are generally less convenient.
// - Double assertions can bypass compatibility checks but should be used sparingly.
// - Assertions are different from type guards because assertions do not perform runtime validation.
