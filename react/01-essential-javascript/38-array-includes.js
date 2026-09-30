/**
 * Array.prototype.includes()
 * ==========================
 *
 * The `Array.prototype.includes()` checks whether an array contains a given value.
 * It returns `true` when the value is found and `false` otherwise.
 *
 * This file covers basic usage, `NaN`, `-0`, `fromIndex`, sparse arrays,
 * comparison behavior, practical patterns, and how `includes()` differs from `indexOf()`.
 */

// ---------------------------------------------------------------------
// 1. Basic usage
// ---------------------------------------------------------------------

// `includes()` returns a boolean indicating whether the array contains the value.

const numbers = [10, 20, 30, 40];

console.log(numbers.includes(20)); // true
console.log(numbers.includes(50)); // false

const fruits = ["apple", "banana", "orange"];

console.log(fruits.includes("banana")); // true
console.log(fruits.includes("grape")); // false

// The original array is not modified.

console.log(fruits); // ["apple", "banana", "orange"]

// ---------------------------------------------------------------------
// 2. `includes()` uses SameValueZero comparison
// ---------------------------------------------------------------------

// `includes()` uses the SameValueZero equality algorithm.
//
// SameValueZero behaves like `===` for most values, but:
// - `NaN` is considered equal to `NaN`.
// - `0` and `-0` are considered equal.
//
// This makes `includes()` particularly useful when searching for `NaN`.

console.log([1, 2, 3].includes(2)); // true
console.log([1, 2, 3].includes("2")); // false - no type coercion

console.log([NaN].includes(NaN)); // true
console.log([0].includes(-0)); // true
console.log([-0].includes(0)); // true

// There is no loose-equality coercion:

console.log([1].includes(true)); // false
console.log(["1"].includes(1)); // false
console.log([null].includes(undefined)); // false

// ---------------------------------------------------------------------
// 3. Searching for objects
// ---------------------------------------------------------------------

// Objects are still compared by reference.
// `includes()` does not compare object contents.

const userA = { id: 1 };
const userB = { id: 1 };

const users = [userA];

console.log(users.includes(userA)); // true  - same object reference
console.log(users.includes(userB)); // false - different object reference

// Even though the objects contain the same data,
// they are different objects.

console.log(userA === userB); // false

// A newly created object will therefore not be found:

console.log(users.includes({ id: 1 })); // false

// To search by content, use a method such as `some()`:

console.log(users.some((user) => user.id === 1)); // true

// ---------------------------------------------------------------------
// 4. Searching strings
// ---------------------------------------------------------------------

// Strings are primitives, so they are compared by value.

const names = ["Ada", "Grace", "Linus"];

console.log(names.includes("Ada")); // true
console.log(names.includes("Grace")); // true
console.log(names.includes("Charles")); // false

// The comparison is case-sensitive:

console.log(names.includes("ada")); // false
console.log(names.includes("ADA")); // false

// `includes()` does not perform partial string matching.
// The entire array element must match.

const languages = ["JavaScript", "TypeScript"];

console.log(languages.includes("Java")); // false
console.log(languages.includes("JavaScript")); // true

// ---------------------------------------------------------------------
// 5. The `fromIndex` parameter
// ---------------------------------------------------------------------

// `includes(value, fromIndex)` starts searching at the specified index.

const values = ["a", "b", "c", "b", "d"];

console.log(values.includes("b")); // true  - searches from index 0
console.log(values.includes("b", 2)); // true  - finds the second "b"
console.log(values.includes("b", 4)); // false - index 4 onward contains no "b"

// The starting index is inclusive.

console.log(values.includes("c", 2)); // true  - starts exactly at index 2
console.log(values.includes("c", 3)); // false - index 2 is skipped

// ---------------------------------------------------------------------
// 6. Positive `fromIndex`
// ---------------------------------------------------------------------

// A positive `fromIndex` counts from the beginning of the array.

const letters = ["a", "b", "c", "d", "e"];

console.log(letters.includes("b", 1)); // true
console.log(letters.includes("b", 2)); // false - index 1 is skipped
console.log(letters.includes("d", 3)); // true
console.log(letters.includes("d", 4)); // false

// An index greater than or equal to the array length means there is nothing to search.

console.log(letters.includes("a", 5)); // false
console.log(letters.includes("a", 100)); // false

// ---------------------------------------------------------------------
// 7. Negative `fromIndex`
// ---------------------------------------------------------------------

// A negative `fromIndex` counts backward from the end.
//
// The effective starting position is:
//
// array.length + fromIndex

const items = ["a", "b", "c", "d", "e"];

console.log(items.includes("e", -1)); // true  - starts at index 4
console.log(items.includes("d", -2)); // true  - starts at index 3
console.log(items.includes("c", -3)); // true  - starts at index 2

console.log(items.includes("b", -2)); // false - searches indices 3 and 4

// `-1` means "start at the last element".

console.log(items.includes("e", -1)); // true
console.log(items.includes("d", -1)); // false

// ---------------------------------------------------------------------
// 8. A negative index can become zero
// ---------------------------------------------------------------------

// If the negative `fromIndex` is larger than the array length,
// the effective starting position becomes zero.

const smallArray = [1, 2, 3];

console.log(smallArray.includes(1, -100)); // true - effectively starts at index 0
console.log(smallArray.includes(2, -100)); // true
console.log(smallArray.includes(3, -100)); // true

// In other words, a sufficiently negative index searches the entire array.

// ---------------------------------------------------------------------
// 9. `fromIndex` is converted to an integer
// ---------------------------------------------------------------------

// `fromIndex` can be another numeric value that JavaScript converts to an integer.

const sequence = [10, 20, 30, 40];

console.log(sequence.includes(20, 1.9)); // true  - starts at index 1
console.log(sequence.includes(20, 1.1)); // true  - starts at index 1
console.log(sequence.includes(10, 0.9)); // true  - starts at index 0

// Fractional indexes are truncated toward zero.

// ---------------------------------------------------------------------
// 10. `fromIndex` with `NaN`
// ---------------------------------------------------------------------

// `NaN` is treated as 0 when used as `fromIndex`.

const numbersAgain = [10, 20, 30];

console.log(numbersAgain.includes(10, NaN)); // true - starts at index 0
console.log(numbersAgain.includes(20, NaN)); // true

// ---------------------------------------------------------------------
// 11. `includes()` and `indexOf()`
// ---------------------------------------------------------------------

// Both methods can determine whether an array contains a value,
// but they differ in their return values and equality behavior.
//
// `includes()`:
// - returns `true` or `false`
// - uses SameValueZero
// - can find `NaN`
//
// `indexOf()`:
// - returns an index or `-1`
// - uses strict equality (`===`)
// - cannot find `NaN`

const searchValues = [10, 20, 30];

console.log(searchValues.includes(20)); // true
console.log(searchValues.indexOf(20)); // 1

console.log(searchValues.includes(50)); // false
console.log(searchValues.indexOf(50)); // -1

const nanValues = [1, NaN, 3];

console.log(nanValues.includes(NaN)); // true
console.log(nanValues.indexOf(NaN)); // -1

// When the only question is "does this value exist?",
// `includes()` communicates that intention more directly.

// ---------------------------------------------------------------------
// 12. Why `includes()` is often clearer than `indexOf()`
// ---------------------------------------------------------------------

// Older code often uses `indexOf()` like this:

const permissions = ["read", "write", "delete"];

console.log(permissions.indexOf("write") !== -1); // true

// `includes()` expresses the same intent directly:

console.log(permissions.includes("write")); // true

// This is easier to read because the result already answers the question:
//
// "Does the array include this value?"

// ---------------------------------------------------------------------
// 13. `includes()` with an empty array
// ---------------------------------------------------------------------

// An empty array never contains a value.

const empty = [];

console.log(empty.includes("anything")); // false
console.log(empty.includes(undefined)); // false
console.log(empty.includes(NaN)); // false

// The result is always `false` because there are no elements to search.

// ---------------------------------------------------------------------
// 14. `includes()` with `undefined`
// ---------------------------------------------------------------------

// `includes()` can distinguish between an array that actually contains
// `undefined` and an array that does not.

const valuesWithUndefined = [1, undefined, 3];

console.log(valuesWithUndefined.includes(undefined)); // true

const valuesWithoutUndefined = [1, 2, 3];

console.log(valuesWithoutUndefined.includes(undefined)); // false

// This is useful when `undefined` is a legitimate array value.

// ---------------------------------------------------------------------
// 15. Sparse arrays
// ---------------------------------------------------------------------

// Sparse arrays contain empty slots rather than explicit values.

const sparse = new Array(3);

console.log(sparse.length); // 3
console.log(sparse[0]); // undefined

// `includes()` treats empty slots as if they contain `undefined`.

console.log(sparse.includes(undefined)); // true

// This differs from methods such as `indexOf()`,
// which skip empty slots when searching.

console.log(sparse.indexOf(undefined)); // -1

// The distinction matters when working with sparse arrays.

// ---------------------------------------------------------------------
// 16. `includes()` does not mutate the array
// ---------------------------------------------------------------------

// `includes()` only reads the array.
// It does not add, remove, or reorder elements.

const original = [1, 2, 3];

const result = original.includes(2);

console.log(result); // true
console.log(original); // [1, 2, 3]

// This makes it safe to use in conditions without changing the source array.

// ---------------------------------------------------------------------
// 17. Using `includes()` in conditions
// ---------------------------------------------------------------------

// A common use is checking whether a value belongs to a known set.

const allowedRoles = ["admin", "editor", "author"];
const role = "editor";

if (allowedRoles.includes(role)) {
  console.log("Role is allowed");
}

// This is often clearer than chaining multiple equality checks:

if (role === "admin" || role === "editor" || role === "author") {
  console.log("Role is allowed");
}

// For a small fixed collection of allowed values,
// `includes()` keeps the condition concise and data-driven.

// ---------------------------------------------------------------------
// 18. Checking multiple allowed values
// ---------------------------------------------------------------------

// `includes()` can be useful for simple membership checks.

const status = "pending";
const activeStatuses = ["pending", "processing"];

if (activeStatuses.includes(status)) {
  console.log("The request is still active");
}

// Another common pattern:

const method = "POST";

if (["POST", "PUT", "PATCH"].includes(method)) {
  console.log("Method can modify data");
}

// The array contains the allowed values,
// while `includes()` performs the membership test.

// ---------------------------------------------------------------------
// 19. Case-insensitive membership checks
// ---------------------------------------------------------------------

// `includes()` itself is case-sensitive.
// Normalize the value when case should not matter.

const supportedFormats = ["json", "xml", "csv"];
const requestedFormat = "JSON";

console.log(supportedFormats.includes(requestedFormat.toLowerCase())); // true

// For arrays containing mixed casing, normalize the array as well.

const formats = ["JSON", "XML", "CSV"];
const format = "json";

console.log(formats.some((item) => item.toLowerCase() === format.toLowerCase())); // true

// `includes()` is not a case-insensitive search by itself.

// ---------------------------------------------------------------------
// 20. `includes()` is not a substring search
// ---------------------------------------------------------------------

// `includes()` on an array searches for an entire array element.
// It does not inspect part of a string.

const technologies = ["JavaScript", "TypeScript", "React"];

console.log(technologies.includes("Java")); // false
console.log(technologies.includes("JavaScript")); // true

// String.prototype.includes() behaves differently:
// it searches for a substring within one string.

const language = "JavaScript";

console.log(language.includes("Java")); // true
console.log(language.includes("Python")); // false

// The same method name exists on arrays and strings,
// but the operation is different for each type.

// ---------------------------------------------------------------------
// 21. `includes()` with nested arrays
// ---------------------------------------------------------------------

// Nested arrays are objects, so they are compared by reference.

const firstPair = [1, 2];

const pairs = [firstPair];

console.log(pairs.includes(firstPair)); // true
console.log(pairs.includes([1, 2])); // false

// The newly created `[1, 2]` is a different array object.

// To compare nested array contents, use a predicate:

console.log(pairs.some((pair) => pair[0] === 1 && pair[1] === 2)); // true

// ---------------------------------------------------------------------
// 22. Practical React example: checking a selected option
// ---------------------------------------------------------------------

// In React, `includes()` can be useful when checking whether a value
// belongs to a set of selected or allowed options.
//
// Example:
//
// const [selectedTags, setSelectedTags] = useState([]);
//
// const isSelected = selectedTags.includes("javascript");
//
// This produces a boolean that can directly control rendering:
//
// {isSelected && <span>JavaScript selected</span>}
//
// When the array contains primitive values such as strings or numbers,
// `includes()` is a natural membership check.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `includes()` returns `true` when an array contains a value and `false` otherwise.
// - It uses SameValueZero comparison, so `NaN` can be found.
// - It does not perform type coercion.
// - Objects and arrays are compared by reference.
// - The optional second argument specifies the starting index.
// - Positive `fromIndex` values count from the beginning.
// - Negative `fromIndex` values count backward from the end.
// - `includes()` does not mutate the array.
// - It treats sparse array holes as `undefined`.
// - Unlike `indexOf()`, it returns a boolean instead of an index.
// - Unlike `indexOf()`, it can find `NaN`.
// - Use `includes()` when the question is simply whether a value exists.
// - For searching by a condition or object contents, use methods such as `some()`.
