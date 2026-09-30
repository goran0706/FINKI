/**
 * Array.prototype.filter()
 * ========================
 *
 * The `Array.prototype.filter()` method creates a new array
 * containing the elements that pass a test implemented by a callback function.
 *
 * The callback returns a truthy or falsy value for each element.
 * Elements with a truthy result are included in the new array.
 */

// ---------------------------------------------------------------------
// 1. Basic `filter()`
// ---------------------------------------------------------------------

// `filter()` keeps elements for which the callback returns a truthy value.
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter((number) => number % 2 === 0);

console.log(evenNumbers); // [2, 4]
console.log(numbers); // [1, 2, 3, 4, 5] (original unchanged)

// ---------------------------------------------------------------------
// 2. The callback return value
// ---------------------------------------------------------------------

// The callback's return value determines whether the original element is kept, not its transformed value.
const values = [1, 2, 3, 4];
const greaterThanTwo = values.filter((value) => value > 2);

console.log(greaterThanTwo); // [3, 4]

// ---------------------------------------------------------------------
// 3. Filtering strings
// ---------------------------------------------------------------------

// `filter()` can be applied to string arrays to select elements matching length or pattern checks.
const names = ["John", "Jane", "Mark", "Anna"];
const namesWithFourLetters = names.filter((name) => name.length === 4);

console.log(namesWithFourLetters); // ["John", "Jane", "Mark"]

// ---------------------------------------------------------------------
// 4. The callback receives the value
// ---------------------------------------------------------------------

// The first callback argument provides the current element's value.
const ages = [15, 21, 17, 30];
const adults = ages.filter((age) => age >= 18);

console.log(adults); // [21, 30]

// ---------------------------------------------------------------------
// 5. The callback receives the index
// ---------------------------------------------------------------------

// The second callback argument provides the current element's index.
const colors = ["red", "green", "blue", "yellow"];
const colorsAfterFirst = colors.filter((color, index) => index > 0);

console.log(colorsAfterFirst); // ["green", "blue", "yellow"]

// ---------------------------------------------------------------------
// 6. The callback receives the array
// ---------------------------------------------------------------------

// The third callback argument provides access to the full source array.
const valuesToInspect = [10, 20, 30];
const filtered = valuesToInspect.filter((value, index, array) => {
  return value > array[0] && index > 0;
});

console.log(filtered); // [20, 30]

// ---------------------------------------------------------------------
// 7. Filtering objects
// ---------------------------------------------------------------------

// `filter()` is standard for extracting objects that meet specific property criteria.
const users = [
  { name: "John", active: true },
  { name: "Jane", active: false },
  { name: "Mark", active: true },
];

const activeUsers = users.filter((user) => user.active);

console.log(activeUsers);
// [
//     { name: "John", active: true },
//     { name: "Mark", active: true }
// ]

// ---------------------------------------------------------------------
// 8. Filtering by multiple conditions
// ---------------------------------------------------------------------

// Complex filtering logic combines conditions using logical operators (`&&`, `||`).
const products = [
  { name: "Laptop", price: 1200, available: true },
  { name: "Phone", price: 800, available: true },
  { name: "Tablet", price: 500, available: false },
  { name: "Monitor", price: 300, available: true },
];

const affordableProducts = products.filter((product) => product.available && product.price < 1000);

console.log(affordableProducts);
// [
//     { name: "Phone", price: 800, available: true },
//     { name: "Monitor", price: 300, available: true }
// ]

// ---------------------------------------------------------------------
// 9. Filtering by property existence
// ---------------------------------------------------------------------

// Elements can be filtered based on whether a specific property is defined.
const records = [{ id: 1, name: "John" }, { id: 2 }, { id: 3, name: "Jane" }];

const recordsWithNames = records.filter((record) => record.name !== undefined);

console.log(recordsWithNames);
// [
//     { id: 1, name: "John" },
//     { id: 3, name: "Jane" }
// ]

// ---------------------------------------------------------------------
// 10. Filtering nullish values
// ---------------------------------------------------------------------

// Loose inequality (`!= null`) efficiently targets both `null` and `undefined`.
const valuesWithMissing = [10, null, 20, undefined, 30, null];
const definedValues = valuesWithMissing.filter((value) => value != null);

console.log(definedValues); // [10, 20, 30]

// ---------------------------------------------------------------------
// 11. Filtering truthy values
// ---------------------------------------------------------------------

// Passing `Boolean` as a callback filters out all falsy values (`0`, `""`, `false`, `null`, `undefined`, `NaN`).
const mixedValues = [0, 1, "", "hello", false, true, null, undefined];
const truthyValues = mixedValues.filter(Boolean);

console.log(truthyValues); // [1, "hello", true]

// ---------------------------------------------------------------------
// 12. Filtering falsy values
// ---------------------------------------------------------------------

// Negating values isolates falsy entries.
const valuesToCheck = [0, 1, "", "hello", false, true];
const falsyValues = valuesToCheck.filter((value) => !value);

console.log(falsyValues); // [0, "", false]

// ---------------------------------------------------------------------
// 13. `filter()` does not mutate the original array
// ---------------------------------------------------------------------

// `filter()` always returns a new array reference, leaving the source array unchanged.
const original = [1, 2, 3, 4];
const filteredOriginal = original.filter((number) => number % 2 === 0);

console.log(original); // [1, 2, 3, 4]
console.log(filteredOriginal); // [2, 4]
console.log(original === filteredOriginal); // false

// ---------------------------------------------------------------------
// 14. Filtering objects is shallow
// ---------------------------------------------------------------------

// The new array contains direct references to the original filtered objects.
const accounts = [
  { name: "John", active: true },
  { name: "Jane", active: false },
];

const activeAccounts = accounts.filter((account) => account.active);
console.log(accounts[0] === activeAccounts[0]); // true

// ---------------------------------------------------------------------
// 15. `filter()` can return an empty array
// ---------------------------------------------------------------------

// If no elements match the predicate, an empty array is returned.
const numbersToFilter = [1, 2, 3];
const greaterThanTen = numbersToFilter.filter((number) => number > 10);

console.log(greaterThanTen); // []

// ---------------------------------------------------------------------
// 16. `filter()` can keep every element
// ---------------------------------------------------------------------

// If every element passes, a new array with all original elements is returned.
const allNumbers = [1, 2, 3];
const allValues = allNumbers.filter(() => true);

console.log(allValues === allNumbers); // false

// ---------------------------------------------------------------------
// 17. `filter()` with a reusable predicate
// ---------------------------------------------------------------------

// Predicate functions can be defined separately for reuse across filtering operations.
function isAdult(age) {
  return age >= 18;
}

const userAges = [15, 18, 21, 16, 30];
const adultAges = userAges.filter(isAdult);

console.log(adultAges); // [18, 21, 30]

// ---------------------------------------------------------------------
// 18. `filter()` vs. `map()`
// ---------------------------------------------------------------------

// `filter()` determines which elements are present, whereas `map()` transforms each element's value.
const source = [1, 2, 3, 4, 5];
console.log(source.filter((n) => n > 2)); // [3, 4, 5]
console.log(source.map((n) => n > 2)); // [false, false, true, true, true]

// ---------------------------------------------------------------------
// 19. Chaining `filter()` and `map()`
// ---------------------------------------------------------------------

// Array methods can be chained to filter data subsets before transforming them.
const usersToProcess = [
  { name: "John", age: 30, active: true },
  { name: "Jane", age: 17, active: true },
  { name: "Mark", age: 25, active: false },
  { name: "Anna", age: 22, active: true },
];

const activeAdultNames = usersToProcess
  .filter((user) => user.active)
  .filter((user) => user.age >= 18)
  .map((user) => user.name);

console.log(activeAdultNames); // ["John", "Anna"]

// ---------------------------------------------------------------------
// 20. `filter()` and sparse arrays
// ---------------------------------------------------------------------

// `filter()` skips empty slots in sparse arrays, producing a dense result.
const sparse = [1, , 3];
const filteredSparse = sparse.filter(() => true);

console.log(filteredSparse); // [1, 3]
console.log(filteredSparse.length); // 2

// ---------------------------------------------------------------------
// 21. `filter()` and asynchronous callbacks
// ---------------------------------------------------------------------

// Async callbacks return promises, which are always truthy; `filter()` does not await them.
const ids = [1, 2, 3];
const filteredIds = ids.filter(async (id) => id > 1);

console.log(filteredIds); // [1, 2, 3] (does not filter asynchronously)

// ---------------------------------------------------------------------
// 22. `filter()` in React
// ---------------------------------------------------------------------

// React components commonly use `filter()` to display subset views of dynamic data collections.
const allUsers = [
  { id: 1, name: "John", active: true },
  { id: 2, name: "Jane", active: false },
  { id: 3, name: "Mark", active: true },
];

const visibleUsers = allUsers.filter((user) => user.active);
console.log(visibleUsers.length); // 2

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `filter()` creates a new array containing elements that pass a test callback.
// - Truthy/falsy callback results determine whether each element is kept.
// - The callback receives the current value, index, and source array.
// - `filter()` does not mutate the original array and handles sparse arrays by compacting them.
// - Use `filter()` to select elements and `map()` to transform them.
// - `filter(Boolean)` removes all falsy values when used intentionally.
// - Async callbacks do not work directly with `filter()` because promises are truthy.
