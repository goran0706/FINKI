/**
 * Falsiness
 * =========
 *
 * JavaScript defines exactly eight falsy values. The `ToBoolean` abstract operation
 * converts these values to `false`; every other JavaScript value converts to `true`.
 *
 * The eight falsy values are: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`.
 */

// ---------------------------------------------------------------------
// 1. The complete list
// ---------------------------------------------------------------------

// The `ToBoolean` abstract operation defines exactly eight falsy values.
const falsyValues = [false, 0, -0, 0n, "", null, undefined, NaN];

// Every value in the list coerces to `false` in a boolean context.
falsyValues.forEach((value) => {
  console.log(value, "->", Boolean(value));
});

// ---------------------------------------------------------------------
// 2. `false`
// ---------------------------------------------------------------------

// `false` is the boolean value representing a false condition.
// The other falsy values are also converted to `false` by `ToBoolean`,
// but they are not themselves equal to `false` under strict equality.
console.log(Boolean(false)); // false
console.log(0 === false); // false
console.log("" === false); // false

// ---------------------------------------------------------------------
// 3. `0` and `-0`
// ---------------------------------------------------------------------

// Both signed zeros are falsy.
console.log(Boolean(0)); // false
console.log(Boolean(-0)); // false

// `0` and `-0` are strictly equal.
console.log(-0 === 0); // true

// `Object.is` distinguishes the two signed zero values.
console.log(Object.is(-0, 0)); // false

// Division by the two signed zeros exposes their different signs.
console.log(1 / -0); // -Infinity
console.log(1 / 0); // Infinity

// ---------------------------------------------------------------------
// 4. `0n`
// ---------------------------------------------------------------------

// BigInt zero is also falsy.
console.log(Boolean(0n)); // false

// Loose equality allows `0n` and numeric `0` to compare as equal.
// Strict equality keeps them separate because their types differ.
console.log(0n == 0); // true
console.log(0n === 0); // false

// ---------------------------------------------------------------------
// 5. `""`
// ---------------------------------------------------------------------

// Only the empty string is falsy.
console.log(Boolean("")); // false

// Any non-empty string is truthy, including strings containing only whitespace.
console.log(Boolean(" ")); // true
console.log(Boolean("0")); // true
console.log(Boolean("false")); // true
console.log(Boolean("\n")); // true

// String length determines whether the string is empty;
// the textual meaning of its contents does not affect truthiness.
console.log("".length); // 0
console.log(" ".length); // 1

// ---------------------------------------------------------------------
// 6. `null` and `undefined`
// ---------------------------------------------------------------------

// Both `null` and `undefined` are falsy primitive values.
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false

// They are different values even though both are falsy.
console.log(null === undefined); // false

// ---------------------------------------------------------------------
// 7. `NaN`
// ---------------------------------------------------------------------

// `NaN` is the only falsy numeric value other than the two signed zeros.
console.log(Boolean(NaN)); // false

// `NaN` is unique because it is not strictly equal to itself.
console.log(NaN === NaN); // false

// `Number.isNaN` checks whether a value is actually the `NaN` value
// without first converting the argument to a number.
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN("not a number")); // false

// The global `isNaN` function coerces its argument before checking it.
// A non-numeric string therefore becomes `NaN` and produces `true`.
console.log(isNaN("not a number")); // true

// `Object.is` treats `NaN` as equal to itself.
console.log(Object.is(NaN, NaN)); // true

// ---------------------------------------------------------------------
// 8. Objects are always truthy
// ---------------------------------------------------------------------

// Objects are truthy regardless of how "empty" or unusual they appear.
console.log(Boolean([])); // true
console.log(Boolean({})); // true
console.log(Boolean(function () {})); // true

// Wrapper objects are objects, so they are also truthy even when they
// contain a falsy primitive value.
console.log(Boolean(new Number(0))); // true
console.log(Boolean(new String(""))); // true
console.log(Boolean(new Boolean(false))); // true

// The object itself is used for the boolean conversion, not the primitive
// value stored inside the wrapper.
const wrappedZero = new Number(0);

if (wrappedZero) {
  console.log("this branch runs, even though the wrapped value is 0");
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JavaScript has exactly eight falsy values: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`.
// - Every other JavaScript value is truthy, including empty arrays, empty objects, and functions.
// - `0` and `-0` are strictly equal, but `Object.is` distinguishes them and division exposes their different signs.
// - `0n == 0` is true with loose equality, but `0n === 0` is false because their types differ.
// - Only the empty string is falsy; every non-empty string is truthy, including whitespace-only strings.
// - `NaN` is not equal to itself; use `Number.isNaN` to test for the actual `NaN` value.
// - Wrapper objects around falsy primitives are truthy because they are objects.
