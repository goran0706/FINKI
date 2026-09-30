/**
 * Array.prototype.reduce()
 * ========================
 *
 * The `Array.prototype.reduce()` method processes the elements of an array
 * and combines them into a single accumulated result.
 *
 * Each callback invocation receives the current accumulator and element
 * and returns the accumulator value for the next iteration.
 */

// ---------------------------------------------------------------------
// 1. Basic `reduce()`
// ---------------------------------------------------------------------

// `reduce()` combines all elements into a single accumulated total (e.g., a sum).
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((total, number) => total + number, 0);

console.log(sum); // 15 (`0` is the initial accumulator value)

// ---------------------------------------------------------------------
// 2. The accumulator
// ---------------------------------------------------------------------

// The first callback argument stores the result produced by the previous iteration.
const values = [10, 20, 30];
const total = values.reduce((accumulator, value) => accumulator + value, 0);

console.log(total); // 60

// ---------------------------------------------------------------------
// 3. The current value
// ---------------------------------------------------------------------

// The second callback argument represents the current array element being processed.
const prices = [100, 200, 300];
const totalPrice = prices.reduce((total, price) => total + price, 0);

console.log(totalPrice); // 600

// ---------------------------------------------------------------------
// 4. The current index
// ---------------------------------------------------------------------

// The third callback argument provides the current element's index.
const valuesWithIndex = [10, 20, 30];
const indexedTotal = valuesWithIndex.reduce((total, value, index) => total + value * (index + 1), 0);

console.log(indexedTotal); // 140

// ---------------------------------------------------------------------
// 5. The source array
// ---------------------------------------------------------------------

// The fourth callback argument provides access to the full array being reduced.
const numbersToInspect = [1, 2, 3];
const result = numbersToInspect.reduce((total, value, index, array) => total + value + array.length, 0);

console.log(result); // 15

// ---------------------------------------------------------------------
// 6. Providing an initial value
// ---------------------------------------------------------------------

// Providing an explicit initial value makes the accumulator's starting state and type clear.
const numbersWithInitialValue = [2, 4, 6];
const sumWithInitialValue = numbersWithInitialValue.reduce((total, number) => total + number, 0);

console.log(sumWithInitialValue); // 12

// ---------------------------------------------------------------------
// 7. Omitting the initial value
// ---------------------------------------------------------------------

// Without an initial value, `reduce()` uses the first array element as the accumulator and starts at index 1.
const numbersWithoutInitialValue = [10, 20, 30];
const sumWithoutInitialValue = numbersWithoutInitialValue.reduce((total, number) => total + number);

console.log(sumWithoutInitialValue); // 60

// ---------------------------------------------------------------------
// 8. Empty arrays
// ---------------------------------------------------------------------

// Reducing an empty array requires an initial value; otherwise, it throws a TypeError.
const empty = [];
const emptySum = empty.reduce((total, value) => total + value, 0);

console.log(emptySum); // 0

// ---------------------------------------------------------------------
// 9. Multiplication
// ---------------------------------------------------------------------

// Match the initial value to the mathematical identity of the operation (e.g., `1` for multiplication).
const factors = [2, 3, 4];
const product = factors.reduce((result, factor) => result * factor, 1);

console.log(product); // 24

// ---------------------------------------------------------------------
// 10. Building a string
// ---------------------------------------------------------------------

// The accumulator can be a string instead of a number.
const words = ["React", "is", "a", "library"];
const sentence = words.reduce((result, word) => `${result} ${word}`, "").trim();

console.log(sentence); // "React is a library"

// ---------------------------------------------------------------------
// 11. Building an array
// ---------------------------------------------------------------------

// `reduce()` can construct new arrays (though `map()` or `filter()` are often clearer when appropriate).
const numbersToDouble = [1, 2, 3, 4];
const doubled = numbersToDouble.reduce((result, number) => {
  result.push(number * 2);
  return result;
}, []);

console.log(doubled); // [2, 4, 6, 8]

// ---------------------------------------------------------------------
// 12. Filtering with `reduce()`
// ---------------------------------------------------------------------

// `reduce()` can manually implement filtering logic by conditionally pushing items to an array accumulator.
const numbersToFilter = [1, 2, 3, 4, 5];
const evenNumbers = numbersToFilter.reduce((result, number) => {
  if (number % 2 === 0) result.push(number);
  return result;
}, []);

console.log(evenNumbers); // [2, 4]

// ---------------------------------------------------------------------
// 13. Building an object
// ---------------------------------------------------------------------

// An object can serve as the accumulator to map keys to values.
const names = ["John", "Jane", "Mark"];
const usersByName = names.reduce((result, name) => {
  result[name] = name.length;
  return result;
}, {});

console.log(usersByName); // { John: 4, Jane: 4, Mark: 4 }

// ---------------------------------------------------------------------
// 14. Counting values
// ---------------------------------------------------------------------

// Accumulators can compile frequency maps of item occurrences.
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
const fruitCounts = fruits.reduce((counts, fruit) => {
  counts[fruit] = (counts[fruit] ?? 0) + 1;
  return counts;
}, {});

console.log(fruitCounts); // { apple: 3, banana: 2, orange: 1 }

// ---------------------------------------------------------------------
// 15. Grouping values
// ---------------------------------------------------------------------

// `reduce()` is ideal for restructuring an array into grouped categories.
const products = [
  { name: "Laptop", category: "electronics" },
  { name: "Phone", category: "electronics" },
  { name: "Desk", category: "furniture" },
];

const productsByCategory = products.reduce((groups, product) => {
  const category = product.category;
  if (!groups[category]) groups[category] = [];
  groups[category].push(product);
  return groups;
}, {});

console.log(productsByCategory);

// ---------------------------------------------------------------------
// 16. Finding a maximum value
// ---------------------------------------------------------------------

// Track extremes (like maximums or minimums) using an appropriate starting boundary (e.g., `-Infinity`).
const scores = [72, 91, 84, 99, 68];
const highestScore = scores.reduce((highest, score) => Math.max(highest, score), -Infinity);

console.log(highestScore); // 99

// ---------------------------------------------------------------------
// 17. Reducing objects
// ---------------------------------------------------------------------

// Extract and aggregate properties from a collection of objects.
const orders = [
  { id: 1, total: 100 },
  { id: 2, total: 250 },
  { id: 3, total: 150 },
];

const orderTotal = orders.reduce((total, order) => total + order.total, 0);
console.log(orderTotal); // 500

// ---------------------------------------------------------------------
// 18. Returning the accumulator
// ---------------------------------------------------------------------

// The callback must explicitly return the accumulator so subsequent iterations receive it.
const numbersToCollect = [1, 2, 3];
const collected = numbersToCollect.reduce((result, number) => {
  result.push(number);
  return result; // Omitting this causes the next accumulator to become `undefined`
}, []);

console.log(collected); // [1, 2, 3]

// ---------------------------------------------------------------------
// 19. Mutation of the accumulator
// ---------------------------------------------------------------------

// Mutating the returned accumulator object per step is a valid performance design decision.
const original = [1, 2, 3];
const resultObject = original.reduce((result, number) => {
  result[number] = number * 10;
  return result;
}, {});

console.log(resultObject); // { 1: 10, 2: 20, 3: 30 }
console.log(original); // [1, 2, 3] (source array remains untouched)

// ---------------------------------------------------------------------
// 20. `reduce()` does not mutate the source array
// ---------------------------------------------------------------------

// Running `reduce()` leaves the original source collection entirely unmodified.
const source = [1, 2, 3];
const sumOfSource = source.reduce((total, number) => total + number, 0);

console.log(sumOfSource); // 6
console.log(source); // [1, 2, 3]

// ---------------------------------------------------------------------
// 21. `reduce()` and sparse arrays
// ---------------------------------------------------------------------

// `reduce()` skips empty slots in sparse arrays rather than evaluating them as `undefined`.
const sparse = [1, , 3];
const sparseSum = sparse.reduce((total, value) => total + value, 0);

console.log(sparseSum); // 4

// ---------------------------------------------------------------------
// 22. `reduce()` vs. other array methods
// ---------------------------------------------------------------------

// `reduce()` combines elements into a single result, whereas other methods map, filter, or test elements.
const valuesToCompare = [1, 2, 3, 4, 5];
console.log(valuesToCompare.reduce((t, v) => t + v, 0)); // 15

// ---------------------------------------------------------------------
// 23. Chaining `reduce()` with other methods
// ---------------------------------------------------------------------

// Combine `filter()` or `map()` pipelines before running final reductions.
const lineItems = [
  { price: 100, quantity: 2 },
  { price: 50, quantity: 3 },
  { price: 25, quantity: 1 },
];

const totalCost = lineItems
  .filter((item) => item.quantity > 0)
  .reduce((total, item) => total + item.price * item.quantity, 0);

console.log(totalCost); // 375

// ---------------------------------------------------------------------
// 24. `reduce()` with nested arrays
// ---------------------------------------------------------------------

// `reduce()` can flatten single-level nested arrays (though `flat()` is cleaner for this goal).
const nested = [[1, 2], [3, 4], [5]];
const flattened = nested.reduce((result, group) => result.concat(group), []);

console.log(flattened); // [1, 2, 3, 4, 5]

// ---------------------------------------------------------------------
// 25. Avoid using `reduce()` for everything
// ---------------------------------------------------------------------

// Prefer specific methods like `map()` or `filter()` when they more clearly express the operation intent.
const numbersForClarity = [1, 2, 3, 4];
const doubledNumbers = numbersForClarity.map((number) => number * 2);

console.log(doubledNumbers); // [2, 4, 6, 8]

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `reduce()` processes and combines array elements into a single accumulated result.
// - The callback receives the accumulator, current value, index, and source array, and must return the accumulator.
// - An initial value should be explicitly provided; omitting it on empty arrays throws a TypeError.
// - The accumulator can be any type: number, string, array, or object.
// - `reduce()` does not mutate the source array and skips empty slots in sparse arrays.
// - Use specific methods (`map()`, `filter()`, etc.) instead of `reduce()` when they communicate intent better.
