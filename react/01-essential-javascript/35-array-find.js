/**
 * Array.prototype.find()
 * ======================
 *
 * The `Array.prototype.find()` method returns the first element in an array
 * that satisfies a test implemented by a callback function.
 *
 * If no element satisfies the test, `find()` returns `undefined`.
 */

// ---------------------------------------------------------------------
// 1. Basic `find()`
// ---------------------------------------------------------------------

// `find()` returns the first element for which the callback returns a truthy value.
const numbers = [1, 2, 3, 4, 5];
const firstEven = numbers.find((number) => number % 2 === 0);

console.log(firstEven); // 2 (stops searching immediately upon the first match)

// ---------------------------------------------------------------------
// 2. `find()` returns the element itself
// ---------------------------------------------------------------------

// The callback determines the match condition, but `find()` returns the matching element itself.
const values = [10, 20, 30, 40];
const result = values.find((value) => value > 15);

console.log(result); // 20

// ---------------------------------------------------------------------
// 3. No matching element
// ---------------------------------------------------------------------

// If no element satisfies the test condition, `find()` returns `undefined`.
const numbersToSearch = [1, 3, 5, 7];
const firstEvenNumber = numbersToSearch.find((number) => number % 2 === 0);

console.log(firstEvenNumber); // undefined

// ---------------------------------------------------------------------
// 4. The callback receives the value
// ---------------------------------------------------------------------

// The first argument passed to the callback is the current element's value.
const names = ["John", "Jane", "Mark"];
const firstLongName = names.find((name) => name.length > 4);

console.log(firstLongName); // "John"

// ---------------------------------------------------------------------
// 5. The callback receives the index
// ---------------------------------------------------------------------

// The second callback argument provides the current element's index.
const colors = ["red", "green", "blue", "yellow"];
const firstColorAfterIndexOne = colors.find((color, index) => index > 1 && color.length > 4);

console.log(firstColorAfterIndexOne); // "yellow"

// ---------------------------------------------------------------------
// 6. The callback receives the array
// ---------------------------------------------------------------------

// The third callback argument provides access to the full array being searched.
const valuesToInspect = [10, 20, 30];
const firstGreaterThanFirst = valuesToInspect.find((value, index, array) => index > 0 && value > array[0]);

console.log(firstGreaterThanFirst); // 20

// ---------------------------------------------------------------------
// 7. Finding objects
// ---------------------------------------------------------------------

// `find()` is frequently used to locate an object within a collection by a property match.
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Mark" },
];

const user = users.find((user) => user.id === 2);
console.log(user); // { id: 2, name: "Jane" }

// ---------------------------------------------------------------------
// 8. Finding an object by multiple conditions
// ---------------------------------------------------------------------

// Callbacks can combine multiple synchronous conditions to pinpoint a specific element.
const products = [
  { id: 1, name: "Laptop", available: false },
  { id: 2, name: "Phone", available: true },
  { id: 3, name: "Monitor", available: true },
];

const availableProduct = products.find((product) => product.available && product.name === "Monitor");

console.log(availableProduct); // { id: 3, name: "Monitor", available: true }

// ---------------------------------------------------------------------
// 9. `find()` returns the first match
// ---------------------------------------------------------------------

// Even if multiple elements match, `find()` strictly returns only the first occurrence.
const duplicateValues = [10, 20, 20, 30, 20];
const firstTwenty = duplicateValues.find((value) => value === 20);

console.log(firstTwenty); // 20

// ---------------------------------------------------------------------
// 10. `find()` vs. `filter()`
// ---------------------------------------------------------------------

// `find()` returns a single matching element, whereas `filter()` returns an array of all matches.
const numbersToCompare = [1, 2, 3, 4, 5];
console.log(numbersToCompare.find((n) => n % 2 === 0)); // 2
console.log(numbersToCompare.filter((n) => n % 2 === 0)); // [2, 4]

// ---------------------------------------------------------------------
// 11. `find()` vs. `some()`
// ---------------------------------------------------------------------

// `find()` returns the element itself; `some()` returns a boolean confirming existence.
const valuesToCompare = [1, 3, 5, 8];
console.log(valuesToCompare.find((v) => v % 2 === 0)); // 8
console.log(valuesToCompare.some((v) => v % 2 === 0)); // true

// ---------------------------------------------------------------------
// 12. `find()` vs. `findIndex()`
// ---------------------------------------------------------------------

// `find()` returns the matched element, while `findIndex()` returns its index.
const tasks = [
  { id: 1, title: "Learn JavaScript" },
  { id: 2, title: "Learn React" },
];

console.log(tasks.find((t) => t.id === 2)); // { id: 2, title: "Learn React" }
console.log(tasks.findIndex((t) => t.id === 2)); // 1

// ---------------------------------------------------------------------
// 13. Checking for `undefined` results
// ---------------------------------------------------------------------

// Callbacks should account for `undefined` when a search yields no matches.
const missingUser = users.find((user) => user.id === 99);

if (missingUser === undefined) {
  console.log("User not found");
}

// ---------------------------------------------------------------------
// 14. Optional chaining after `find()`
// ---------------------------------------------------------------------

// Optional chaining safely accesses properties on potentially undefined search results.
const matchingUser = users.find((user) => user.id === 99);
const matchingUserName = matchingUser?.name;

console.log(matchingUserName); // undefined

// ---------------------------------------------------------------------
// 15. `find()` with a default value
// ---------------------------------------------------------------------

// Combine optional chaining with nullish coalescing to provide safe fallbacks.
const searchedUser = users.find((user) => user.id === 99);
const userName = searchedUser?.name ?? "Unknown user";

console.log(userName); // "Unknown user"

// ---------------------------------------------------------------------
// 16. Reusable predicates
// ---------------------------------------------------------------------

// Search conditions can be separated into named predicate functions.
function isActive(user) {
  return user.active;
}

const accounts = [
  { name: "John", active: false },
  { name: "Jane", active: true },
];

console.log(accounts.find(isActive)); // { name: "Jane", active: true }

// ---------------------------------------------------------------------
// 17. `find()` with primitive values
// ---------------------------------------------------------------------

// `find()` works seamlessly across arrays containing strings, numbers, or other primitives.
const words = ["apple", "banana", "orange"];
console.log(words.find((w) => w.startsWith("b"))); // "banana"
console.log(words.find((w) => w.startsWith("z"))); // undefined

// ---------------------------------------------------------------------
// 18. `find()` with `NaN`
// ---------------------------------------------------------------------

// Strict equality (`===`) fails for `NaN`; use `Number.isNaN()` to find NaN entries.
const numbersWithNaN = [1, NaN, 3];
console.log(numbersWithNaN.find((v) => Number.isNaN(v))); // NaN

// ---------------------------------------------------------------------
// 19. `find()` and object identity
// ---------------------------------------------------------------------

// `find()` returns original references; mutating the returned object affects the source array.
const firstUser = users.find((user) => user.id === 1);
console.log(firstUser === users[0]); // true

// ---------------------------------------------------------------------
// 20. `find()` does not mutate the array
// ---------------------------------------------------------------------

// Searching an array does not alter its contents or structure.
const original = [1, 2, 3, 4];
console.log(original.find((n) => n > 2)); // 3
console.log(original); // [1, 2, 3, 4]

// ---------------------------------------------------------------------
// 21. `find()` and sparse arrays
// ---------------------------------------------------------------------

// `find()` visits empty slots in sparse arrays, treating them as `undefined`.
const sparse = [1, , 3];
console.log(sparse.find((v) => v === undefined)); // undefined (ambiguous with missing match)

// ---------------------------------------------------------------------
// 22. `find()` and asynchronous callbacks
// ---------------------------------------------------------------------

// Async callbacks return truthy promises immediately, bypassing asynchronous search behavior.
const ids = [1, 2, 3];
const foundId = ids.find(async (id) => id > 1);

console.log(foundId); // 1 (does not perform async evaluation)

// ---------------------------------------------------------------------
// 23. `find()` in React
// ---------------------------------------------------------------------

// React applications use `find()` to locate specific items for rendering or updates.
const selectedId = 2;
const selectedUser = users.find((user) => user.id === selectedId);

console.log(selectedUser?.name); // "Jane"

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `find()` returns the first element satisfying a test callback, or `undefined` if none match.
// - It returns the actual element reference, not a boolean or a filtered array.
// - `find()` short-circuits and stops searching immediately upon finding the first match.
// - It differs from `filter()` (returns array), `some()` (returns boolean), and `findIndex()` (returns index).
// - `find()` does not mutate the source array and requires explicit handling for `NaN` or sparse holes.
// - Async callbacks do not work directly with `find()` because promises are always truthy.
