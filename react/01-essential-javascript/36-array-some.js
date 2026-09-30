/**
 * Array.prototype.some()
 * ======================
 *
 * The `Array.prototype.some()` method tests whether at least one element in an array
 * satisfies a condition implemented by a callback function.
 *
 * It returns `true` as soon as a matching element is found.
 * If no element satisfies the condition, it returns `false`.
 */

// ---------------------------------------------------------------------
// 1. Basic `some()`
// ---------------------------------------------------------------------

// `some()` returns `true` when at least one element passes the test.
const numbers = [1, 2, 3, 4, 5];
const hasEvenNumber = numbers.some((number) => number % 2 === 0);

console.log(hasEvenNumber); // true

// ---------------------------------------------------------------------
// 2. No matching element
// ---------------------------------------------------------------------

// `some()` returns `false` when no element satisfies the condition.
const oddNumbers = [1, 3, 5, 7];
const hasEvenValue = oddNumbers.some((number) => number % 2 === 0);

console.log(hasEvenValue); // false

// ---------------------------------------------------------------------
// 3. The callback return value
// ---------------------------------------------------------------------

// The callback's truthy/falsy result determines the match; `some()` only checks for truthiness.
const values = [10, 20, 30, 40];
const hasValueGreaterThan25 = values.some((value) => value > 25);

console.log(hasValueGreaterThan25); // true

// ---------------------------------------------------------------------
// 4. The callback receives the value
// ---------------------------------------------------------------------

// The first callback argument is the current element's value.
const names = ["John", "Jane", "Mark"];
const hasLongName = names.some((name) => name.length > 4);

console.log(hasLongName); // true

// ---------------------------------------------------------------------
// 5. The callback receives the index
// ---------------------------------------------------------------------

// The second callback argument provides the current element's index.
const colors = ["red", "green", "blue", "yellow"];
const hasLongColorAfterFirst = colors.some((color, index) => index > 0 && color.length > 5);

console.log(hasLongColorAfterFirst); // true

// ---------------------------------------------------------------------
// 6. The callback receives the array
// ---------------------------------------------------------------------

// The third callback argument provides access to the full array being tested.
const valuesToInspect = [10, 20, 30];
const hasValueGreaterThanFirst = valuesToInspect.some((value, index, array) => index > 0 && value > array[0]);

console.log(hasValueGreaterThanFirst); // true

// ---------------------------------------------------------------------
// 7. `some()` stops at the first match
// ---------------------------------------------------------------------

// `some()` short-circuits and stops evaluating as soon as a match is found.
const numbersToCheck = [2, 4, 6, 7, 8];
const hasOddNumber = numbersToCheck.some((number) => number % 2 !== 0);

console.log(hasOddNumber); // true (8 is never inspected because 7 matches)

// ---------------------------------------------------------------------
// 8. `some()` with objects
// ---------------------------------------------------------------------

// `some()` returns a boolean confirming property matches in an object collection.
const users = [
  { name: "John", active: false },
  { name: "Jane", active: true },
  { name: "Mark", active: false },
];

const hasActiveUser = users.some((user) => user.active);
console.log(hasActiveUser); // true

// ---------------------------------------------------------------------
// 9. `some()` with multiple conditions
// ---------------------------------------------------------------------

// Callbacks can combine multiple logical conditions to test element properties.
const products = [
  { name: "Laptop", price: 1200, available: false },
  { name: "Phone", price: 800, available: true },
  { name: "Monitor", price: 300, available: true },
];

const hasAffordableProduct = products.some((product) => product.available && product.price < 500);

console.log(hasAffordableProduct); // true

// ---------------------------------------------------------------------
// 10. `some()` vs. `find()`
// ---------------------------------------------------------------------

// `find()` returns the first matching element, whereas `some()` returns a boolean.
const numbersToCompare = [1, 2, 3, 4, 5];
console.log(numbersToCompare.find((n) => n % 2 === 0)); // 2
console.log(numbersToCompare.some((n) => n % 2 === 0)); // true

// ---------------------------------------------------------------------
// 11. `some()` vs. `filter()`
// ---------------------------------------------------------------------

// `filter()` collects all matches into an array; `some()` stops early and returns a boolean.
const valuesToCompare = [1, 2, 3, 4, 5];
console.log(valuesToCompare.filter((v) => v % 2 === 0)); // [2, 4]
console.log(valuesToCompare.some((v) => v % 2 === 0)); // true

// ---------------------------------------------------------------------
// 12. `some()` vs. `every()`
// ---------------------------------------------------------------------

// `some()` tests if at least one element passes; `every()` tests if all elements pass.
const valuesToTest = [2, 4, 6];
console.log(valuesToTest.some((v) => v % 2 !== 0)); // false
console.log(valuesToTest.every((v) => v % 2 === 0)); // true

// ---------------------------------------------------------------------
// 13. `some()` with truthy values
// ---------------------------------------------------------------------

// Use `Boolean` to check if at least one truthy value exists without creating a new array.
const mixedValues = [0, "", null, "hello", false];
console.log(mixedValues.some(Boolean)); // true

// ---------------------------------------------------------------------
// 14. `some()` with nullish values
// ---------------------------------------------------------------------

// Use loose inequality (`!= null`) to check for non-null/undefined values.
const valuesWithMissing = [null, undefined, null, "available"];
console.log(valuesWithMissing.some((v) => v != null)); // true

// ---------------------------------------------------------------------
// 15. `some()` with a reusable predicate
// ---------------------------------------------------------------------

// Search conditions can be separated into reusable named functions.
function isAdult(age) {
  return age >= 18;
}

const ages = [15, 16, 17, 21];
console.log(ages.some(isAdult)); // true

// ---------------------------------------------------------------------
// 16. `some()` on an empty array
// ---------------------------------------------------------------------

// An empty array has no elements to satisfy any condition, so `some()` always returns `false`.
const empty = [];
console.log(empty.some(() => true)); // false

// ---------------------------------------------------------------------
// 17. `some()` does not mutate the array
// ---------------------------------------------------------------------

// Testing an array does not alter its contents or structure.
const original = [1, 2, 3, 4];
console.log(original.some((n) => n > 3)); // true
console.log(original); // [1, 2, 3, 4]

// ---------------------------------------------------------------------
// 18. `some()` with object references
// ---------------------------------------------------------------------

// `some()` returns a boolean; use `find()` if you need the actual object reference.
const accounts = [
  { id: 1, active: false },
  { id: 2, active: true },
];
console.log(accounts.some((a) => a.id === 2)); // true

// ---------------------------------------------------------------------
// 19. `some()` and sparse arrays
// ---------------------------------------------------------------------

// `some()` skips empty slots in sparse arrays rather than treating them as `undefined`.
const sparse = [1, , 3];
console.log(sparse.some((v) => v === undefined)); // false

// ---------------------------------------------------------------------
// 20. `some()` and asynchronous callbacks
// ---------------------------------------------------------------------

// Async callbacks return truthy promises immediately, bypassing asynchronous search behavior.
const ids = [1, 2, 3];
const hasMatchingId = ids.some(async (id) => id > 1);

console.log(hasMatchingId); // true (does not perform async evaluation)

// ---------------------------------------------------------------------
// 21. `some()` in React
// ---------------------------------------------------------------------

// React applications use `some()` to compute boolean UI states (e.g., notification alerts).
const notifications = [
  { id: 1, read: true },
  { id: 2, read: false },
  { id: 3, read: true },
];

const hasUnreadNotifications = notifications.some((n) => !n.read);
console.log(hasUnreadNotifications); // true

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `some()` returns `true` if at least one element satisfies the test callback, otherwise `false`.
// - It returns a boolean rather than elements, indices, or filtered arrays.
// - `some()` short-circuits and stops iterating as soon as the first matching element is found.
// - It differs from `find()` (returns element), `filter()` (returns array), and `every()` (all must pass).
// - `some()` returns `false` for empty arrays and skips empty slots in sparse arrays.
// - Async callbacks do not work directly with `some()` because promises are always truthy.
