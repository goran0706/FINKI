/**
 * Type Coercion
 * =============
 *
 * Type coercion is the process of converting a value from one type to another.
 * JavaScript performs coercion explicitly when code requests a conversion and
 * implicitly when an operation requires values to be converted.
 *
 * Primitive values can be converted directly, while objects may first be converted
 * to primitive values before the requested conversion or operation takes place.
 */

// ---------------------------------------------------------------------
// 1. Explicit coercion
// ---------------------------------------------------------------------

// Explicit coercion happens when code intentionally converts a value using
// a conversion function such as `Number()`, `String()`, or `Boolean()`.
const stringValue = "42";
const numberValue = Number(stringValue);

console.log(numberValue); // 42
console.log(typeof numberValue); // "number"

const numericValue = 42;
const convertedString = String(numericValue);

console.log(convertedString); // "42"
console.log(typeof convertedString); // "string"

const value = 1;
const booleanValue = Boolean(value);

console.log(booleanValue); // true

// ---------------------------------------------------------------------
// 2. Implicit coercion
// ---------------------------------------------------------------------

// Implicit coercion happens automatically when an operator or language
// construct converts a value as part of its operation.
// The `+` operator can perform string concatenation when string conversion
// is selected for the operands.
const result = "42" + 8;

console.log(result); // "428"
console.log(typeof result); // "string"

// ---------------------------------------------------------------------
// 3. String coercion
// ---------------------------------------------------------------------

// `String()` explicitly converts a value to a string.
console.log(String(42)); // "42"
console.log(String(true)); // "true"
console.log(String(false)); // "false"
console.log(String(null)); // "null"
console.log(String(undefined)); // "undefined"

// Objects are converted to primitive values as part of string conversion.
// Arrays use their string representation, while a plain object normally
// produces the default object string.
const user = { name: "Jane Doe" };
const numbers = [1, 2, 3];

console.log(String(user)); // "[object Object]"
console.log(String(numbers)); // "1,2,3"

// Template literals also perform string conversion on interpolated values.
const age = 30;
const message = `Age: ${age}`;

console.log(message); // "Age: 30"

// ---------------------------------------------------------------------
// 4. Number coercion
// ---------------------------------------------------------------------

// `Number()` explicitly converts values to numbers when a numeric
// representation can be produced.
console.log(Number("42")); // 42
console.log(Number("3.14")); // 3.14
console.log(Number("")); // 0
console.log(Number("   ")); // 0
console.log(Number(true)); // 1
console.log(Number(false)); // 0
console.log(Number(null)); // 0
console.log(Number(undefined)); // NaN

// A string that does not represent a valid number produces `NaN`.
console.log(Number("hello")); // NaN

// `NaN` has the type `number` even though it represents an invalid numeric result.
console.log(typeof NaN); // "number"

// `Number.isNaN()` checks whether a value is actually the `NaN` value
// without coercing the argument first.
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN(42)); // false

// ---------------------------------------------------------------------
// 5. Boolean coercion
// ---------------------------------------------------------------------

// `Boolean()` explicitly converts a value to either `true` or `false`.
console.log(Boolean(1)); // true
console.log(Boolean(0)); // false
console.log(Boolean("hello")); // true
console.log(Boolean("")); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false

// Objects and arrays are truthy, including empty objects and arrays.
console.log(Boolean({})); // true
console.log(Boolean([])); // true

// ---------------------------------------------------------------------
// 6. Falsy values
// ---------------------------------------------------------------------

// JavaScript has exactly eight falsy values:
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

// ---------------------------------------------------------------------
// 7. Arithmetic coercion
// ---------------------------------------------------------------------

// The `-`, `*`, and `/` operators perform numeric conversion when necessary.
console.log("10" - 2); // 8
console.log("10" * 2); // 20
console.log("10" / 2); // 5

// If conversion produces `NaN`, the arithmetic result is also `NaN`.
console.log("hello" - 2); // NaN

// The unary `+` operator is another concise way to perform numeric conversion.
console.log(+"42"); // 42
console.log(+"3.14"); // 3.14
console.log(+"hello"); // NaN

// ---------------------------------------------------------------------
// 8. The `+` operator
// ---------------------------------------------------------------------

// When both operands are numbers, `+` performs numeric addition.
console.log(2 + 3); // 5

// When string concatenation is selected, the operands are converted to strings.
console.log("2" + 3); // "23"
console.log(2 + "3"); // "23"
console.log("2" + "3"); // "23"

// Explicit conversion makes the intended numeric operation clear.
const first = "10";
const second = "5";

console.log(Number(first) + Number(second)); // 15

// ---------------------------------------------------------------------
// 9. Equality and coercion
// ---------------------------------------------------------------------

// `==` performs type coercion when necessary before comparing values.
console.log(5 == "5"); // true
console.log(false == 0); // true

// `===` does not perform this type coercion.
// Values of different types therefore do not compare as strictly equal.
console.log(5 === "5"); // false
console.log(false === 0); // false

// Strict equality is generally preferred when the comparison should
// distinguish values of different types.

// ---------------------------------------------------------------------
// 10. `null` and `undefined`
// ---------------------------------------------------------------------

// `null` and `undefined` are a special pair in loose equality.
console.log(null == undefined); // true

// Neither is loosely equal to zero, `false`, or an empty string.
console.log(null == 0); // false
console.log(null == false); // false
console.log(null == ""); // false
console.log(undefined == 0); // false
console.log(undefined == false); // false
console.log(undefined == ""); // false

// Strict equality distinguishes them because they are different values.
console.log(null === undefined); // false

// ---------------------------------------------------------------------
// 11. Coercion in conditions
// ---------------------------------------------------------------------

// Conditions automatically apply boolean coercion to their expressions.
// An explicit `Boolean()` call is therefore unnecessary here.
const username = "";

if (username) {
  console.log("Username exists.");
} else {
  console.log("Username is empty."); // "Username is empty."
}

// ---------------------------------------------------------------------
// 12. Logical operators
// ---------------------------------------------------------------------

// Logical operators use truthiness but return one of their operand values.
// `||` returns the first truthy operand, or the last operand if all are falsy.
const name = "" || "Anonymous";

console.log(name); // "Anonymous"

// This can be incorrect when `0` is a valid value.
// Because `0` is falsy, `||` selects the right-hand fallback.
const count = 0;
const displayedCount = count || 10;

console.log(displayedCount); // 10

// ---------------------------------------------------------------------
// 13. Nullish coalescing
// ---------------------------------------------------------------------

// `??` differs from `||`: it only treats `null` and `undefined` as missing.
// Other falsy values such as `0`, `false`, and `""` are preserved.
console.log(0 ?? 10); // 0
console.log("" ?? "Anonymous"); // ""
console.log(false ?? true); // false

console.log(null ?? 10); // 10
console.log(undefined ?? 10); // 10

// ---------------------------------------------------------------------
// 14. Relational comparisons
// ---------------------------------------------------------------------

// Relational operators can perform numeric coercion when the operands
// are not both strings.
console.log("10" > 5); // true
console.log("2" < 10); // true

// When both operands are strings, they are compared lexicographically
// rather than converted to numbers.
console.log("10" > "5"); // false

// ---------------------------------------------------------------------
// 15. Object coercion
// ---------------------------------------------------------------------

// When an object is used in an operation that requires a primitive value,
// JavaScript first performs object-to-primitive conversion.
// The resulting primitive is then used by the operation.
const values = [1, 2, 3];

console.log(String(values)); // "1,2,3"
console.log(values + ""); // "1,2,3"

// Arrays use their string representation during this conversion.
// A plain object normally produces the default string representation.
const person = { name: "Jane Doe" };

console.log(String(person)); // "[object Object]"

// Objects can customize their primitive conversion with methods such as
// `toString()` or `valueOf()`, so object coercion is not always this simple.
const customValue = {
  valueOf() {
    return 10;
  },
};

console.log(Number(customValue)); // 10

// ---------------------------------------------------------------------
// 16. Coercion at application boundaries
// ---------------------------------------------------------------------

// External data often arrives as strings even when the application needs
// a different type. HTML form controls are a common example.
const inputValue = "25";

console.log(typeof inputValue); // "string"

// Convert the input explicitly before performing numeric operations.
const quantity = Number(inputValue);

console.log(typeof quantity); // "number"
console.log(quantity); // 25

// Explicit conversion makes the expected type clear and avoids relying
// on implicit coercion later in the application.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Type coercion converts a value from one type to another explicitly or implicitly.
// - Explicit coercion uses operations such as `Number()`, `String()`, and `Boolean()`.
// - Implicit coercion happens automatically when operators or language constructs require conversion.
// - `+` can perform numeric addition or string concatenation depending on the operands.
// - Arithmetic operators such as `-`, `*`, `/`, and unary `+` perform numeric coercion when necessary.
// - `==` allows type coercion, whereas `===` compares without type coercion.
// - Logical operators use truthiness and return operand values, while `??` only falls back for `null` and `undefined`.
// - Objects can be converted to primitive values before an operation and can customize that conversion.
// - Explicit conversion is useful at application boundaries where incoming values have types different from those the application expects.
