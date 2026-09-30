/**
 * Array.prototype.every()
 * =======================
 *
 * The `Array.prototype.every()` method tests whether all elements in an array
 * satisfy a condition implemented by a callback function.
 *
 * It returns `true` only when every tested element passes the condition.
 * It returns `false` as soon as one element fails the condition.
 */

// ---------------------------------------------------------------------
// 1. Basic `every()`
// ---------------------------------------------------------------------

// `every()` returns `true` when all elements pass the test callback.
const numbers = [2, 4, 6, 8];
const areAllEven = numbers.every((number) => number % 2 === 0);

console.log(areAllEven); // true

// ---------------------------------------------------------------------
// 2. A failing element
// ---------------------------------------------------------------------

// If even a single element fails, `every()` immediately returns `false`.
const mixedNumbers = [2, 4, 5, 8];
const areAllEvenValues = mixedNumbers.every((number) => number % 2 === 0);

console.log(areAllEvenValues); // false

// ---------------------------------------------------------------------
// 3. The callback return value
// ---------------------------------------------------------------------

// The callback's truthy/falsy result determines whether an element passes.
const values = [10, 20, 30, 40];
const areAllPositive = values.every((value) => value > 0);

console.log(areAllPositive); // true

// ---------------------------------------------------------------------
// 4. The callback receives the value
// ---------------------------------------------------------------------

// The first argument passed to the callback is the current element's value.
const names = ["John", "Jane", "Mark"];
const areAllNamesPresent = names.every((name) => name.length > 0);

console.log(areAllNamesPresent); // true

// ---------------------------------------------------------------------
// 5. The callback receives the index
// ---------------------------------------------------------------------

// The second callback argument provides the current element's index.
const colors = ["red", "green", "blue"];
const areAllAfterFirstLongEnough = colors.every((color, index) => index === 0 || color.length >= 5);

console.log(areAllAfterFirstLongEnough); // false

// ---------------------------------------------------------------------
// 6. The callback receives the array
// ---------------------------------------------------------------------

// The third callback argument provides access to the full source array.
const valuesToInspect = [10, 20, 30];
const areAllGreaterThanPrevious = valuesToInspect.every(
  (value, index, array) => index === 0 || value > array[index - 1],
);

console.log(areAllGreaterThanPrevious); // true

// ---------------------------------------------------------------------
// 7. `every()` stops at the first failure
// ---------------------------------------------------------------------

// `every()` short-circuits and stops iterating as soon as a failing element is encountered.
const numbersToCheck = [2, 4, 6, 7, 8];
const areAllEvenNumbers = numbersToCheck.every((number) => number % 2 === 0);

console.log(areAllEvenNumbers); // false (8 is never inspected because 7 fails)

// ---------------------------------------------------------------------
// 8. `every()` with objects
// ---------------------------------------------------------------------

// `every()` validates object collection properties, returning a boolean.
const users = [
  { name: "John", active: true },
  { name: "Jane", active: true },
  { name: "Mark", active: true },
];

const areAllUsersActive = users.every((user) => user.active);
console.log(areAllUsersActive); // true

// ---------------------------------------------------------------------
// 9. `every()` with multiple conditions
// ---------------------------------------------------------------------

// Callbacks can combine logical conditions (`&&`, `||`) to validate complex property rules.
const products = [
  { name: "Laptop", price: 1200, available: true },
  { name: "Phone", price: 800, available: true },
  { name: "Monitor", price: 300, available: true },
];

const areAllProductsValid = products.every((product) => product.available && product.price > 0);

console.log(areAllProductsValid); // true

// ---------------------------------------------------------------------
// 10. `every()` vs. `some()`
// ---------------------------------------------------------------------

// `every()` tests if all elements pass; `some()` tests if at least one passes.
const numbersToCompare = [2, 4, 6, 7];
console.log(numbersToCompare.some((n) => n % 2 !== 0)); // true
console.log(numbersToCompare.every((n) => n % 2 === 0)); // false

// ---------------------------------------------------------------------
// 11. `every()` vs. `find()`
// ---------------------------------------------------------------------

// `every()` returns a boolean validation; `find()` returns the first matching element.
const valuesToFind = [2, 4, 6];
console.log(valuesToFind.find((v) => v % 2 === 0)); // 2
console.log(valuesToFind.every((v) => v % 2 === 0)); // true

// ---------------------------------------------------------------------
// 12. `every()` vs. `filter()`
// ---------------------------------------------------------------------

// `every()` returns a boolean; `filter()` collects all matching elements into a new array.
const valuesToFilter = [2, 4, 6];
console.log(valuesToFilter.filter((v) => v % 2 === 0)); // [2, 4, 6]
console.log(valuesToFilter.every((v) => v % 2 === 0)); // true

// ---------------------------------------------------------------------
// 13. `every()` with truthy values
// ---------------------------------------------------------------------

// Passing `Boolean` checks if every element is truthy without creating a new array.
const truthyValues = [1, "hello", true, {}, []];
console.log(truthyValues.every(Boolean)); // true

// ---------------------------------------------------------------------
// 14. `every()` with nullish values
// ---------------------------------------------------------------------

// Use loose inequality (`!= null`) to ensure all values are non-null and defined.
const valuesWithMissing = ["John", "Jane", "Mark"];
console.log(valuesWithMissing.every((v) => v != null)); // true

// ---------------------------------------------------------------------
// 15. `every()` with a reusable predicate
// ---------------------------------------------------------------------

// Validation logic can be extracted into reusable named functions.
function isAdult(age) {
  return age >= 18;
}

const ages = [21, 25, 30, 42];
console.log(ages.every(isAdult)); // true

// ---------------------------------------------------------------------
// 16. `every()` on an empty array
// ---------------------------------------------------------------------

// An empty array returns `true` (vacuous truth) because no elements can fail the condition.
const empty = [];
console.log(empty.every(() => false)); // true

// ---------------------------------------------------------------------
// 17. `every()` does not mutate the array
// ---------------------------------------------------------------------

// Testing an array leaves its contents and structure completely unchanged.
const original = [2, 4, 6, 8];
console.log(original.every((n) => n % 2 === 0)); // true
console.log(original); // [2, 4, 6, 8]

// ---------------------------------------------------------------------
// 18. `every()` and object references
// ---------------------------------------------------------------------

// `every()` returns a boolean; use `find()` if you need the actual object reference.
const accounts = [
  { id: 1, active: true },
  { id: 2, active: true },
];
console.log(accounts.every((a) => a.active)); // true

// ---------------------------------------------------------------------
// 19. `every()` and sparse arrays
// ---------------------------------------------------------------------

// `every()` skips empty slots in sparse arrays instead of treating them as `undefined`.
const sparse = [2, , 4];
console.log(sparse.every((v) => v !== undefined)); // true

// ---------------------------------------------------------------------
// 20. `every()` and asynchronous callbacks
// ---------------------------------------------------------------------

// Async callbacks return truthy promises immediately, bypassing asynchronous validation behavior.
const ids = [1, 2, 3];
const areAllMatchingIds = ids.every(async (id) => id > 1);

console.log(areAllMatchingIds); // true (does not perform async evaluation)

// ---------------------------------------------------------------------
// 21. `every()` in React
// ---------------------------------------------------------------------

// React components use `every()` to validate input states (e.g., checking if all form fields are valid).
const fields = [
  { name: "firstName", valid: true },
  { name: "lastName", valid: true },
  { name: "email", valid: true },
];

const isFormValid = fields.every((f) => f.valid);
console.log(isFormValid); // true

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `every()` returns `true` if every element satisfies the test callback, otherwise `false`.
// - It returns a boolean rather than elements, indices, or filtered arrays.
// - `every()` short-circuits and stops iterating as soon as the first failing element is found.
// - It differs from `some()` (at least one must pass) and `find()` (returns element).
// - `every()` returns `true` for empty arrays (vacuous truth) and skips empty slots in sparse arrays.
// - Async callbacks do not work directly with `every()` because promises are always truthy.
