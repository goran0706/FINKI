/**
 * Array.prototype.map()
 * =====================
 *
 * The `Array.prototype.map()` method creates a new array
 * by calling a function for every element in the original array.
 *
 * The resulting array contains the values returned by the callback.
 * `Array.prototype.map()` does not change the original array.
 */

// ---------------------------------------------------------------------
// 1. Basic `map()`
// ---------------------------------------------------------------------

// `map()` calls the callback once for every element and collects each returned value into a new array.
const numbers = [1, 2, 3, 4];
const doubled = numbers.map((number) => number * 2);

console.log(doubled); // [2, 4, 6, 8]
console.log(numbers); // [1, 2, 3, 4] (original remains unchanged)

// ---------------------------------------------------------------------
// 2. The callback return value
// ---------------------------------------------------------------------

// The value returned by the callback becomes the corresponding element in the new array.
const values = [10, 20, 30];
const strings = values.map((value) => `Value: ${value}`);

console.log(strings); // ["Value: 10", "Value: 20", "Value: 30"]

// ---------------------------------------------------------------------
// 3. `map()` preserves array length
// ---------------------------------------------------------------------

// For a normal dense array, `map()` produces a new array with the exact same length.
const numbersToTransform = [1, 2, 3, 4, 5];
const squared = numbersToTransform.map((number) => number ** 2);

console.log(squared); // [1, 4, 9, 16, 25]
console.log(squared.length); // 5

// ---------------------------------------------------------------------
// 4. The callback receives the value
// ---------------------------------------------------------------------

// The first argument passed to the callback is the current element's value.
const names = ["John", "Jane", "Mark"];
const uppercasedNames = names.map((name) => name.toUpperCase());

console.log(uppercasedNames); // ["JOHN", "JANE", "MARK"]

// ---------------------------------------------------------------------
// 5. The callback receives the index
// ---------------------------------------------------------------------

// The second callback argument provides the current element's index.
const colors = ["red", "green", "blue"];
const indexedColors = colors.map((color, index) => `${index}: ${color}`);

console.log(indexedColors); // ["0: red", "1: green", "2: blue"]

// ---------------------------------------------------------------------
// 6. The callback receives the array
// ---------------------------------------------------------------------

// The third callback argument provides access to the full array being mapped.
const valuesToInspect = [10, 20, 30];
const results = valuesToInspect.map((value, index, array) => ({
  value,
  index,
  length: array.length,
}));

console.log(results);
// [
//     { value: 10, index: 0, length: 3 },
//     { value: 20, index: 1, length: 3 },
//     { value: 30, index: 2, length: 3 }
// ]

// ---------------------------------------------------------------------
// 7. `map()` with an explicit return
// ---------------------------------------------------------------------

// Block-bodied arrow functions require an explicit `return` keyword.
const prices = [10, 20, 30];
const withTax = prices.map((price) => {
  const tax = price * 0.18;
  return price + tax;
});

console.log(withTax); // [11.8, 23.6, 35.4]

// ---------------------------------------------------------------------
// 8. `map()` with an implicit return
// ---------------------------------------------------------------------

// Expression-bodied arrow functions implicitly return their evaluated expression.
const ages = [20, 30, 40];
const nextYearAges = ages.map((age) => age + 1);

console.log(nextYearAges); // [21, 31, 41]

// ---------------------------------------------------------------------
// 9. Transforming objects
// ---------------------------------------------------------------------

// `map()` is frequently used to extract properties or reshape arrays of objects.
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];

const userNames = users.map((user) => user.name);
console.log(userNames); // ["John", "Jane"]

// ---------------------------------------------------------------------
// 10. Returning object literals
// ---------------------------------------------------------------------

// Implicitly returning an object literal requires wrapping it in parentheses.
const products = [
  { name: "Laptop", price: 1200 },
  { name: "Phone", price: 800 },
];

const productNames = products.map((product) => ({
  label: product.name,
  value: product.price,
}));

console.log(productNames);
// [
//     { label: "Laptop", value: 1200 },
//     { label: "Phone", value: 800 }
// ]

// ---------------------------------------------------------------------
// 11. `map()` does not mutate the original array
// ---------------------------------------------------------------------

// `map()` creates a brand new array reference and leaves the source array untouched.
const original = [1, 2, 3];
const transformed = original.map((number) => number * 10);

console.log(original); // [1, 2, 3]
console.log(transformed); // [10, 20, 30]
console.log(original === transformed); // false

// ---------------------------------------------------------------------
// 12. Shallow transformation of objects
// ---------------------------------------------------------------------

// `map()` creates a new array, but inner object references are shared by default.
const accounts = [
  { name: "John", active: true },
  { name: "Jane", active: false },
];

const copiedAccounts = accounts.map((account) => account);
console.log(accounts === copiedAccounts); // false
console.log(accounts[0] === copiedAccounts[0]); // true

// ---------------------------------------------------------------------
// 13. Creating new objects during mapping
// ---------------------------------------------------------------------

// Returning new object literals during mapping prevents unintended mutations of source objects.
const originalUsers = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
];

const updatedUsers = originalUsers.map((user) => ({
  ...user,
  active: true,
}));

console.log(originalUsers[0] === updatedUsers[0]); // false

// ---------------------------------------------------------------------
// 14. `map()` with index
// ---------------------------------------------------------------------

// The index can be utilized when element position is part of the final structure.
const tasks = ["Learn JavaScript", "Learn React", "Build an app"];
const numberedTasks = tasks.map((task, index) => ({
  number: index + 1,
  task,
}));

console.log(numberedTasks);
// [
//     { number: 1, task: "Learn JavaScript" },
//     { number: 2, task: "Learn React" },
//     { number: 3, task: "Build an app" }
// ]

// ---------------------------------------------------------------------
// 15. `map()` and sparse arrays
// ---------------------------------------------------------------------

// `map()` skips empty slots in sparse arrays, preserving holes in the resulting array.
const sparse = [1, , 3];
const mappedSparse = sparse.map((value) => value * 2);

console.log(mappedSparse); // [2, empty, 6]
console.log(1 in mappedSparse); // false

// ---------------------------------------------------------------------
// 16. `map()` does not flatten nested arrays
// ---------------------------------------------------------------------

// `map()` returns whatever the callback evaluates to, resulting in nested arrays if mapped recursively.
const nested = [
  [1, 2],
  [3, 4],
  [5, 6],
];
const doubledGroups = nested.map((group) => group.map((number) => number * 2));

console.log(doubledGroups); // [[2, 4], [6, 8], [10, 12]]

// ---------------------------------------------------------------------
// 17. `map()` vs. `forEach()`
// ---------------------------------------------------------------------

// Use `map()` to create a transformed new array; use `forEach()` to execute side effects.
const sourceValues = [1, 2, 3];
const doubledValues = sourceValues.map((value) => value * 2);

console.log(doubledValues); // [2, 4, 6]

// ---------------------------------------------------------------------
// 18. `map()` and side effects
// ---------------------------------------------------------------------

// Performing mutations inside `map()` violates functional purity; prefer returning new copies.
const usersToUpdate = [{ name: "John", active: false }];

const activatedUsers = usersToUpdate.map((user) => ({
  ...user,
  active: true,
}));

console.log(activatedUsers); // [{ name: "John", active: true }]

// ---------------------------------------------------------------------
// 19. `map()` and asynchronous callbacks
// ---------------------------------------------------------------------

// Async callbacks return promises; use `Promise.all()` to resolve an array of promises.
const ids = [1, 2, 3];
const promises = ids.map(async (id) => id * 10);

// const valuesFromPromises = await Promise.all(promises);
// console.log(valuesFromPromises); // [10, 20, 30]

// ---------------------------------------------------------------------
// 20. `map()` in React
// ---------------------------------------------------------------------

// `map()` is standard in React for rendering lists of UI elements from data arrays.
const namesForList = ["John", "Jane", "Mark"];
const labels = namesForList.map((name) => `User: ${name}`);

console.log(labels); // ["User: John", "User: Jane", "User: Mark"]

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `map()` calls a callback for each existing array element to build a new array.
// - It does not mutate the original array and preserves length for dense arrays.
// - The callback receives the current value, index, and full source array.
// - Use explicit returns for block bodies and parentheses for implicit object returns.
// - `map()` skips sparse array holes and does not flatten nested arrays.
// - Async `map()` operations require `Promise.all()` to resolve correctly.
