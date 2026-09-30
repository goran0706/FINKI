/**
 * Function Overloads
 * ==================
 *
 * Function overloads allow a function to have multiple call signatures for
 * different argument combinations while sharing a single implementation.
 */

// -----------------------------------------------------------------------
// 1. Defining function overloads
// -----------------------------------------------------------------------

// Each overload signature describes one valid way to call the function.
function format(value: string): string;
function format(value: number): string;

function format(value: string | number): string {
  return String(value);
}

console.log(format("Hello")); // "Hello"
console.log(format(100)); // "100"

// The implementation signature is not directly visible to callers.
// Only the overload signatures define the allowed calls.

// -----------------------------------------------------------------------
// 2. Multiple parameter combinations
// -----------------------------------------------------------------------

// Overloads can describe functions with different numbers of parameters.
function greet(name: string): string;
function greet(name: string, age: number): string;

function greet(name: string, age?: number): string {
  if (age === undefined) {
    return `Hello, ${name}!`;
  }

  return `Hello, ${name}! You are ${age} years old.`;
}

console.log(greet("John Doe")); // "Hello, John Doe!"
console.log(greet("John Doe", 30)); // "Hello, John Doe! You are 30 years old."

// Calls must match one of the overload signatures.
// greet("John Doe", "30"); // TS2769: No overload matches this call.

// -----------------------------------------------------------------------
// 3. Different return types
// -----------------------------------------------------------------------

// Overloads can associate different argument types with different return types.
function getValue(value: string): string;
function getValue(value: number): number;

function getValue(value: string | number): string | number {
  return value;
}

const stringValue = getValue("Hello");
const numberValue = getValue(100);

console.log(stringValue); // "Hello"
console.log(numberValue); // 100

// TypeScript knows the return type from the matching overload.
// `stringValue` is `string` and `numberValue` is `number`.

// -----------------------------------------------------------------------
// 4. Overloads with different parameter types
// -----------------------------------------------------------------------

// Each overload can describe a different parameter type and return type.
function double(value: number): number;
function double(value: string): string;

function double(value: number | string): number | string {
  if (typeof value === "number") {
    return value * 2;
  }

  return value + value;
}

console.log(double(10)); // 20
console.log(double("Hello")); // "HelloHello"

// The implementation uses a union type because it must handle all overload cases.

// -----------------------------------------------------------------------
// 5. Overloads with object types
// -----------------------------------------------------------------------

// Overloads can describe different object shapes.
function getId(user: { id: number }): number;
function getId(user: { id: string }): string;

function getId(user: { id: number | string }): number | string {
  return user.id;
}

const numericId = getId({ id: 101 });
const stringId = getId({ id: "user-101" });

console.log(numericId); // 101
console.log(stringId); // "user-101"

// -----------------------------------------------------------------------
// 6. Overloads vs union parameters
// -----------------------------------------------------------------------

// A union parameter is appropriate when all accepted types have the same
// return type and the function behaves the same way for each type.
function printValue(value: string | number): string {
  return String(value);
}

console.log(printValue("Hello")); // "Hello"
console.log(printValue(100)); // "100"

// Overloads are useful when different inputs produce different return types
// or represent meaningfully different call signatures.

// -----------------------------------------------------------------------
// 7. Implementation signature
// -----------------------------------------------------------------------

// The implementation signature must be broad enough to handle every overload.
function parseValue(value: string): number;
function parseValue(value: number): number;

function parseValue(value: string | number): number {
  if (typeof value === "number") {
    return value;
  }

  return Number(value);
}

console.log(parseValue("100")); // 100
console.log(parseValue(100)); // 100

// The implementation signature cannot be used as an additional public overload.
// parseValue(true); // TS2769: No overload matches this call.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - Function overloads define multiple valid call signatures for one function.
// - Each overload describes a specific combination of parameters and return type.
// - The implementation signature must be able to handle every overload.
// - TypeScript selects the appropriate overload based on the arguments.
// - Overloads are useful when different inputs produce different return types or behavior.
// - A union parameter is often simpler when all accepted inputs share the same return type.
