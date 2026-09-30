/**
 * Equality
 * ========
 *
 * Equality is how JavaScript determines whether two values compare as the same.
 * JavaScript provides several comparison algorithms, and they differ in a small
 * number of important edge cases.
 *
 * This file covers strict equality (`===`), loose equality (`==`), `Object.is`,
 * primitive and object comparisons, `NaN`, signed zero, and other built-in
 * operations that use related equality algorithms.
 */

// ---------------------------------------------------------------------
// 1. Three ways to compare values
// ---------------------------------------------------------------------

// Strict equality (`===`) compares values without type coercion.
// Loose equality (`==`) may perform type conversion before comparing.
// `Object.is()` is similar to `===`, but treats `NaN` and signed zero differently.
console.log(5 === "5"); // false
console.log(5 == "5"); // true
console.log(Object.is(5, "5")); // false

// Strict and loose equality have negated forms.
// `Object.is()` has no separate operator, so negate the function call when needed.
console.log(5 !== "5"); // true
console.log(5 != "5"); // false
console.log(!Object.is(5, "5")); // true

// ---------------------------------------------------------------------
// 2. Strict equality (`===`)
// ---------------------------------------------------------------------

// `===` does not perform type coercion.
// For primitive values, both operands must have the same type and value.
console.log(5 === 5); // true
console.log("a" === "a"); // true
console.log(true === true); // true

console.log("5" === 5); // false - string vs. number
console.log(0 === false); // false - number vs. boolean
console.log(null === undefined); // false - different types

// For objects, arrays, and functions, `===` compares object identity:
// the operands must refer to the same object.
const objectA = { id: 1 };
const objectB = { id: 1 };
const objectC = objectA;

console.log(objectA === objectB); // false - different objects
console.log(objectA === objectC); // true - same object

// `!==` is the negation of strict equality.
console.log(5 !== "5"); // true

// ---------------------------------------------------------------------
// 3. Loose equality (`==`)
// ---------------------------------------------------------------------

// `==` uses a different equality algorithm that can perform type conversion
// when the operands have different types. The exact conversion depends on
// the types being compared.
console.log("5" == 5); // true - the string is converted to a number
console.log(0 == false); // true - the boolean is converted to a number
console.log("" == false); // true - both are converted to numeric zero
console.log("0" == false); // true - both are converted to numeric zero

// Objects can also participate in loose equality through object-to-primitive
// conversion before the comparison continues.
console.log([] == false); // true - [] becomes "" and then 0

// `null` and `undefined` have a special loose-equality rule:
// they compare equal to each other and to no other value.
console.log(null == undefined); // true
console.log(null == 0); // false
console.log(null == false); // false
console.log(undefined == 0); // false

// A string containing the word `"true"` does not convert to the boolean `true`.
// The string becomes `NaN`, while `true` becomes `1`.
console.log("true" == true); // false

// Loose equality can produce relationships that are surprising when chained.
// Equality itself does not guarantee transitivity when `==` performs coercion.
console.log("0" == false); // true
console.log(false == ""); // true
console.log("0" == ""); // false

// `===` and `!==` are generally preferred when the comparison should not
// perform implicit type conversion.

// ---------------------------------------------------------------------
// 4. Primitives and objects
// ---------------------------------------------------------------------

// Primitive values are compared according to their values.
const priceA = 10;
const priceB = 10;

console.log(priceA === priceB); // true

// Objects, arrays, and functions are compared by identity.
// Two separately created objects are different even when their contents match.
console.log({ id: 1 } === { id: 1 }); // false
console.log([1, 2] === [1, 2]); // false
console.log(function () {} === function () {}); // false

// Assigning an object to another variable copies the reference value.
// Both variables therefore refer to the same object.
const userA = { id: 1 };
const userB = userA;

console.log(userA === userB); // true

// The same identity rule applies to loose equality when both operands are objects.
const objectD = { id: 1 };
const objectE = { id: 1 };

console.log(objectD == objectE); // false - different objects

// ---------------------------------------------------------------------
// 5. `NaN`
// ---------------------------------------------------------------------

// `NaN` is a special numeric value that is not equal to itself
// under either strict or loose equality.
console.log(NaN === NaN); // false
console.log(NaN == NaN); // false

// Therefore, `value === NaN` can never successfully detect `NaN`.
// `Number.isNaN()` checks whether the value is actually `NaN` without coercion.
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN("hello")); // false

// The global `isNaN()` function converts its argument to a number first.
// This can report true for values that are not themselves the `NaN` value.
console.log(isNaN("hello")); // true - "hello" converts to NaN
console.log(isNaN("42")); // false - "42" converts to 42

// ---------------------------------------------------------------------
// 6. `0` and `-0`
// ---------------------------------------------------------------------

// JavaScript has both positive zero and negative zero.
// Strict and loose equality treat them as equal.
console.log(0 === -0); // true
console.log(0 == -0); // true

// Their sign can be observed through arithmetic.
console.log(1 / 0); // Infinity
console.log(1 / -0); // -Infinity

// `Object.is()` is the standard equality check that distinguishes them.
console.log(Object.is(0, -0)); // false
console.log(Object.is(-0, -0)); // true

// ---------------------------------------------------------------------
// 7. `Object.is()`
// ---------------------------------------------------------------------

// `Object.is()` generally agrees with `===`, except for `NaN` and signed zero.
console.log(NaN === NaN); // false
console.log(Object.is(NaN, NaN)); // true

console.log(0 === -0); // true
console.log(Object.is(0, -0)); // false

// For ordinary values, the results match strict equality.
console.log(Object.is(5, 5)); // true
console.log(Object.is("a", "a")); // true
console.log(Object.is(null, undefined)); // false

// Objects are still compared by identity.
const objectF = { id: 1 };
const objectG = { id: 1 };
const objectH = objectF;

console.log(Object.is(objectF, objectG)); // false - different objects
console.log(Object.is(objectF, objectH)); // true - same object

// ---------------------------------------------------------------------
// 8. Equality and React
// ---------------------------------------------------------------------

// React uses Object.is-based comparisons in several places.
// For state updates, React can bail out when the new state is identical
// to the current state according to Object.is.
// Dependency values for `useEffect`, `useMemo`, and `useCallback` are
// compared with Object.is.
// `React.memo` compares each prop with Object.is by default.
//
// This makes object and array identity important when working with React state
// and dependencies.

// Mutating an array keeps the same object identity.
const items = [1, 2, 3];
const sameItems = items;

sameItems.push(4);

console.log(Object.is(items, sameItems)); // true - same array reference

// Creating another array creates a different object identity,
// even when the contents are the same.
const newItems = [1, 2, 3, 4];

console.log(Object.is(items, newItems)); // false - different array references

// This is why React state updates normally create new arrays or objects
// instead of mutating existing state in place.

// ---------------------------------------------------------------------
// 9. Comparing objects by content
// ---------------------------------------------------------------------

// JavaScript's equality operators do not perform deep object comparison.
// Two objects with identical properties are still different objects.
const profileA = { id: 1, name: "Ada" };
const profileB = { id: 1, name: "Ada" };

console.log(profileA === profileB); // false

// When the object structure is known, individual properties can be compared.
console.log(profileA.id === profileB.id && profileA.name === profileB.name); // true

// A shallow comparison checks corresponding top-level properties.
// Nested objects are still compared by their references.
const settingsA = {
  theme: "dark",
  preferences: { notifications: true },
};

const settingsB = {
  theme: "dark",
  preferences: { notifications: true },
};

console.log(settingsA.theme === settingsB.theme); // true
console.log(settingsA.preferences === settingsB.preferences); // false

// `JSON.stringify()` is not a general-purpose equality algorithm.
// Property order can affect the resulting strings, and values such as
// `undefined` can be omitted during serialization.
console.log(JSON.stringify({ a: 1, b: 2 }) === JSON.stringify({ b: 2, a: 1 })); // false

// Deep equality requires comparing nested structures according to rules
// appropriate for the data being compared.

// ---------------------------------------------------------------------
// 10. The useful `value == null` pattern
// ---------------------------------------------------------------------

// `null` and `undefined` are the only values that compare loosely equal to `null`.
// Therefore, `value == null` can intentionally check for either one.
let maybeValue = undefined;

console.log(maybeValue == null); // true

maybeValue = null;
console.log(maybeValue == null); // true

maybeValue = 0;
console.log(maybeValue == null); // false

maybeValue = "";
console.log(maybeValue == null); // false

// The explicit equivalent is:
console.log(maybeValue === null || maybeValue === undefined); // false

// This is one of the few deliberate uses of `==` because its coercion rule
// provides exactly the desired null-or-undefined check.

// ---------------------------------------------------------------------
// 11. Other equality algorithms
// ---------------------------------------------------------------------

// Different built-in operations use different equality rules.
// `indexOf()` uses strict equality, so it cannot find `NaN`.
console.log([NaN].indexOf(NaN)); // -1

// `includes()` uses SameValueZero, which treats `NaN` as equal to itself
// while still treating `0` and `-0` as equal.
console.log([NaN].includes(NaN)); // true
console.log([0].includes(-0)); // true

// `Map` and `Set` also use SameValueZero for key/value matching.
const values = new Set([NaN]);

console.log(values.has(NaN)); // true

// No type coercion occurs for these operations.
console.log([1, 2, 3].includes(2)); // true
console.log([1, 2, 3].includes("2")); // false

// `switch` case matching uses strict equality semantics.
const status = 1;

switch (status) {
  case 1:
    console.log("number 1 matched"); // "number 1 matched"
    break;
  case "1":
    console.log("string 1 matched");
    break;
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `===` compares without type coercion; for primitives it compares type and value, while objects are compared by identity.
// - `==` can perform type conversion before comparing and therefore has additional coercion rules and edge cases.
// - `Object.is()` generally matches `===`, except that it considers `NaN` equal to itself and distinguishes `0` from `-0`.
// - Primitives are compared by value; objects, arrays, and functions are compared by identity.
// - `NaN` is not equal to itself under `===` or `==`; use `Number.isNaN()` to test for the actual `NaN` value.
// - `value == null` is a deliberate loose-equality pattern for checking both `null` and `undefined`.
// - Built-in operations can use different equality algorithms; `indexOf()` uses strict equality, while `includes()`, `Map`, and `Set` use SameValueZero.
// - React uses Object.is-based comparisons in several state, dependency, and memoization mechanisms, making object and array identity significant.
