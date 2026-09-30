/**
 * Truthiness
 * ==========
 *
 * A value is "truthy" if it coerces to `true` when JavaScript evaluates it in a boolean context.
 * Every value is truthy except for a short, fixed list of falsy values.
 */

// ---------------------------------------------------------------------
// 1. Implicit boolean coercion
// ---------------------------------------------------------------------

// JavaScript implicitly converts a value to a boolean when it is used
// in a boolean context, such as an `if` condition.
if ("a non-empty string") {
  console.log("truthy - this branch runs");
}

// Loop conditions are also boolean contexts.
let attemptsLeft = 3;
while (attemptsLeft) {
  attemptsLeft--;
}

// The condition of the ternary operator is a boolean context.
const label = 1 ? "yes" : "no";
console.log(label); // "yes"

// Boolean coercion can also be performed explicitly with `Boolean()` or `!!`.
console.log(Boolean("hello")); // true
console.log(!!"hello"); // true

// ---------------------------------------------------------------------
// 2. Truthy and falsy values
// ---------------------------------------------------------------------

// The complete set of falsy values is fixed:
// `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`.
// Every other JavaScript value is truthy.
console.log(Boolean(false)); // false
console.log(Boolean(0)); // false
console.log(Boolean(-0)); // false
console.log(Boolean(0n)); // false
console.log(Boolean("")); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN)); // false

console.log(Boolean(1)); // true
console.log(Boolean("hello")); // true
console.log(Boolean([])); // true
console.log(Boolean({})); // true

// ---------------------------------------------------------------------
// 3. Truthy values that commonly surprise people
// ---------------------------------------------------------------------

// A string is truthy whenever it is non-empty, regardless of its contents.
console.log(Boolean("0")); // true
console.log(Boolean("false")); // true
console.log(Boolean(" ")); // true - a space is still a character

// Arrays and objects are truthy even when they contain no elements or properties.
console.log(Boolean([])); // true
console.log(Boolean({})); // true

// Functions are objects and are also truthy.
console.log(Boolean(function () {})); // true

// Positive and negative infinity are truthy.
console.log(Boolean(Infinity)); // true
console.log(Boolean(-Infinity)); // true

// Boolean wrapper objects are truthy because the object itself is truthy,
// regardless of the primitive boolean value stored inside it.
console.log(Boolean(new Boolean(false))); // true

// ---------------------------------------------------------------------
// 4. Short-circuit evaluation with `&&` and `||`
// ---------------------------------------------------------------------

// `&&` evaluates from left to right and stops at the first falsy operand.
// If every operand is truthy, it returns the last operand.
// It returns an operand itself, not necessarily a boolean.
console.log(true && "reached"); // "reached"
console.log(0 && "never reached"); // 0 - evaluation stops at `0`
console.log("a" && "b" && "c"); // "c" - every operand is truthy

// `||` evaluates from left to right and stops at the first truthy operand.
// If every operand is falsy, it returns the last operand.
// It also returns an operand itself, not necessarily a boolean.
console.log(0 || "fallback"); // "fallback"
console.log("first" || "second"); // "first"
console.log(0 || "" || null); // null - every operand is falsy

// This behavior is commonly used for conditional rendering in React.
// When `isLoggedIn` is truthy, the right-hand expression is evaluated and returned.
// When it is falsy, `&&` returns the falsy value itself.
const isLoggedIn = true;
const banner = isLoggedIn && "Welcome back!";
console.log(banner); // "Welcome back!"

const isLoading = false;
const spinner = isLoading && "Loading...";
console.log(spinner); // false

// ---------------------------------------------------------------------
// 5. `||` as a default-value pattern
// ---------------------------------------------------------------------

// `||` can provide a fallback when the value on its left is falsy.
function greet(name) {
  const resolvedName = name || "Guest";
  console.log(`Hello, ${resolvedName}`);
}

greet("John Doe"); // "Hello, John Doe"
greet(""); // "Hello, Guest"
greet(); // "Hello, Guest"

// The important limitation is that ALL falsy values trigger the fallback.
// This can incorrectly replace a legitimate value such as `0`.
function setQuantity(quantity) {
  const resolvedQuantity = quantity || 1;
  console.log(resolvedQuantity);
}

setQuantity(0); // 1 - `0` is falsy, so the fallback is used

// When only `null` and `undefined` should trigger the fallback,
// the nullish coalescing operator `??` is more precise.
function setQuantitySafely(quantity) {
  const resolvedQuantity = quantity ?? 1;
  console.log(resolvedQuantity);
}

setQuantitySafely(0); // 0
setQuantitySafely(undefined); // 1
setQuantitySafely(null); // 1

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A value is truthy if it is not one of JavaScript's eight falsy values.
// - Implicit boolean coercion occurs in conditions, loop tests, ternary expressions, and short-circuit operators.
// - Empty arrays, empty objects, non-empty strings, functions, and Boolean wrapper objects are truthy.
// - `&&` returns the first falsy operand or the last operand when all operands are truthy.
// - `||` returns the first truthy operand or the last operand when all operands are falsy.
// - `value || fallback` treats every falsy value as missing; `value ?? fallback` only treats `null` and `undefined` as missing.
