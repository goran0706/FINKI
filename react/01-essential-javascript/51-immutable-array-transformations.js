/**
 * Immutable Array Transformations
 * ===============================
 *
 * Immutable array transformations create new arrays instead of modifying
 * the original array.
 *
 * JavaScript array methods such as `map()`, `filter()`, and `slice()` can
 * create new arrays without changing the source array. Other methods such
 * as `sort()`, `reverse()`, `splice()`, and `push()` mutate the array.
 *
 * Understanding the difference is important when working with state and
 * other data that should not be modified in place.
 */

// ---------------------------------------------------------------------
// 1. What immutability means for arrays
// ---------------------------------------------------------------------

// Immutable transformations leave the original array unchanged and produce a new array.
const numbers = [1, 2, 3];
const doubled = numbers.map((number) => number * 2);

console.log(numbers); // [1, 2, 3]
console.log(doubled); // [2, 4, 6]
console.log(numbers === doubled); // false

// ---------------------------------------------------------------------
// 2. `map()` creates a new array
// ---------------------------------------------------------------------

// `map()` provides an immutable transformation of the array structure.
const values = [10, 20, 30];
const increased = values.map((value) => value + 1);

console.log(values); // [10, 20, 30]
console.log(increased); // [11, 21, 31]

// ---------------------------------------------------------------------
// 3. `filter()` creates a new array
// ---------------------------------------------------------------------

// `filter()` generates a new array matching condition criteria without mutating the source.
const scores = [45, 72, 88, 51, 93];
const passingScores = scores.filter((score) => score >= 60);

console.log(scores); // [45, 72, 88, 51, 93]
console.log(passingScores); // [72, 88, 93]

// ---------------------------------------------------------------------
// 4. `slice()` creates a new array
// ---------------------------------------------------------------------

// `slice()` copies a selected portion into a distinct new array instance.
const items = ["a", "b", "c", "d"];
const selectedItems = items.slice(1, 3);

console.log(items); // ["a", "b", "c", "d"]
console.log(selectedItems); // ["b", "c"]

// ---------------------------------------------------------------------
// 5. Spread syntax creates a new array
// ---------------------------------------------------------------------

// Array spread syntax (`[...]`) creates a new shallow copy of an array.
const original = [1, 2, 3];
const copy = [...original];

console.log(original === copy); // false

// ---------------------------------------------------------------------
// 6. Adding elements immutably
// ---------------------------------------------------------------------

// Avoid mutating with `push()`; use spread syntax to append elements to a new array.
const users = ["John", "Jane"];
const usersWithMark = [...users, "Mark"];

console.log(users); // ["John", "Jane"]
console.log(usersWithMark); // ["John", "Jane", "Mark"]

// ---------------------------------------------------------------------
// 7. Adding elements at the beginning
// ---------------------------------------------------------------------

// Place spread elements after new entries to prepend items immutably.
const names = ["Jane", "Mark"];
const namesWithJohn = ["John", ...names];

console.log(namesWithJohn); // ["John", "Jane", "Mark"]

// ---------------------------------------------------------------------
// 8. Removing an element with `filter()`
// ---------------------------------------------------------------------

// Express element removal by filtering out unwanted values.
const numbersToRemove = [1, 2, 3, 4, 5];
const withoutThree = numbersToRemove.filter((number) => number !== 3);

console.log(withoutThree); // [1, 2, 4, 5]

// ---------------------------------------------------------------------
// 9. Replacing an element with `map()`
// ---------------------------------------------------------------------

// Combine `map()` and object spread syntax to replace elements safely.
const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" },
  { id: 3, name: "Monitor" },
];

const updatedProducts = products.map((product) => (product.id === 2 ? { ...product, name: "Smartphone" } : product));

console.log(updatedProducts[1]); // { id: 2, name: "Smartphone" }

// ---------------------------------------------------------------------
// 10. Updating an object inside an array
// ---------------------------------------------------------------------

// Unchanged items retain their memory references; only modified objects receive new references.
const accounts = [
  { id: 1, name: "John", active: true },
  { id: 2, name: "Jane", active: false },
];

const activatedAccounts = accounts.map((account) => (account.id === 2 ? { ...account, active: true } : account));

console.log(accounts[0] === activatedAccounts[0]); // true
console.log(accounts[1] === activatedAccounts[1]); // false

// ---------------------------------------------------------------------
// 11. Removing an object by ID
// ---------------------------------------------------------------------

// Filter out objects by checking unique identifiers like `id`.
const usersToRemove = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Mark" },
];

const usersWithoutJane = usersToRemove.filter((user) => user.id !== 2);
console.log(usersWithoutJane); // [{ id: 1, name: "John" }, { id: 3, name: "Mark" }]

// ---------------------------------------------------------------------
// 12. Replacing an element by index
// ---------------------------------------------------------------------

// Use the map callback index parameter to substitute targeted items.
const colors = ["red", "green", "blue"];
const updatedColors = colors.map((color, index) => (index === 1 ? "yellow" : color));

console.log(updatedColors); // ["red", "yellow", "blue"]

// ---------------------------------------------------------------------
// 13. Inserting an element at an index
// ---------------------------------------------------------------------

// Combine `slice()` and spread syntax to insert elements at specific positions.
const letters = ["a", "b", "d", "e"];
const inserted = [...letters.slice(0, 2), "c", ...letters.slice(2)];

console.log(inserted); // ["a", "b", "c", "d", "e"]

// ---------------------------------------------------------------------
// 14. Removing an element at an index
// ---------------------------------------------------------------------

// Slice segments together around the target index to excise elements immutably.
const valuesToRemove = ["a", "b", "c", "d"];
const removed = [...valuesToRemove.slice(0, 2), ...valuesToRemove.slice(3)];

console.log(removed); // ["a", "b", "d"]

// ---------------------------------------------------------------------
// 15. Moving an element
// ---------------------------------------------------------------------

// Copy array first if you need to use mutating methods like `splice()` internally.
const queue = ["A", "B", "C", "D"];
const moved = [...queue];
const [item] = moved.splice(1, 1);
moved.splice(3, 0, item);

console.log(moved); // ["A", "C", "D", "B"]

// ---------------------------------------------------------------------
// 16. Sorting immutably
// ---------------------------------------------------------------------

// Use `toSorted()` to order elements without mutating the original array.
const numbersToSort = [30, 10, 20];
const sortedNumbers = numbersToSort.toSorted((a, b) => a - b);

console.log(sortedNumbers); // [10, 20, 30]
console.log(numbersToSort); // [30, 10, 20]

// ---------------------------------------------------------------------
// 17. Reversing immutably
// ---------------------------------------------------------------------

// Use `toReversed()` as a non-mutating alternative to `reverse()`.
const valuesToReverse = [1, 2, 3];
const reversedValues = valuesToReverse.toReversed();

console.log(reversedValues); // [3, 2, 1]
console.log(valuesToReverse); // [1, 2, 3]

// ---------------------------------------------------------------------
// 18. Splicing immutably
// ---------------------------------------------------------------------

// Perform `splice()` operations on a shallow copy to retain source immutability.
const originalItems = ["a", "b", "c", "d"];
const updatedItems = [...originalItems];
updatedItems.splice(1, 2, "x", "y");

console.log(updatedItems); // ["a", "x", "y", "d"]
console.log(originalItems); // ["a", "b", "c", "d"]

// ---------------------------------------------------------------------
// 19. Concatenating arrays
// ---------------------------------------------------------------------

// `concat()` returns a new combined array without modifying its inputs.
const first = [1, 2];
const second = [3, 4];
const combined = first.concat(second);

console.log(combined); // [1, 2, 3, 4]

// ---------------------------------------------------------------------
// 20. Flattening immutably
// ---------------------------------------------------------------------

// `flat()` creates a new flattened array structure.
const nested = [[1, 2], [3, 4], [5]];
const flattened = nested.flat();

console.log(flattened); // [1, 2, 3, 4, 5]

// ---------------------------------------------------------------------
// 21. Combining transformations
// ---------------------------------------------------------------------

// Chain methods like `filter()` and `map()` into clean, non-mutating pipelines.
const orders = [
  { id: 1, total: 100, paid: true },
  { id: 2, total: 200, paid: false },
  { id: 3, total: 300, paid: true },
];

const paidOrderTotals = orders.filter((o) => o.paid).map((o) => o.total);
console.log(paidOrderTotals); // [100, 300]

// ---------------------------------------------------------------------
// 22. Shallow immutability
// ---------------------------------------------------------------------

// Standard immutable array operations perform shallow copies; nested object references remain shared.
const originalUsers = [{ name: "John" }, { name: "Jane" }];
const copiedUsers = originalUsers.map((user) => user);

copiedUsers[0].name = "Mark";
console.log(originalUsers[0].name); // "Mark" (shared reference)

// ---------------------------------------------------------------------
// 23. Copying nested objects when updating
// ---------------------------------------------------------------------

// Create new object references along the modified path for deep updates.
const originalProfile = [{ id: 1, profile: { name: "John", city: "London" } }];
const updatedProfile = originalProfile.map((user) =>
  user.id === 1 ? { ...user, profile: { ...user.profile, city: "Paris" } } : user,
);

console.log(originalProfile[0].profile.city); // "London"
console.log(updatedProfile[0].profile.city); // "Paris"

// ---------------------------------------------------------------------
// 24. Avoiding direct mutation
// ---------------------------------------------------------------------

// Never mutate state objects directly; instantiate new objects with spread changes.
const todos = [{ id: 1, text: "Learn JavaScript", completed: false }];
const completedTodos = todos.map((t) => (t.id === 1 ? { ...t, completed: true } : t));

console.log(todos[0].completed); // false
console.log(completedTodos[0].completed); // true

// ---------------------------------------------------------------------
// 25. Immutable transformations in React
// ---------------------------------------------------------------------

// React state updates require new arrays and object references to trigger re-renders properly.
const initialItems = [
  { id: 1, selected: false },
  { id: 2, selected: false },
];
const nextItems = initialItems.map((item) => (item.id === 2 ? { ...item, selected: true } : item));

console.log(nextItems); // Updated state representation

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Immutable array transformations return new arrays, leaving the source array untouched.
// - Methods like `map()`, `filter()`, `slice()`, `concat()`, `flat()`, and spread syntax create new arrays.
// - Use `toSorted()` and `toReversed()` for non-mutating ordering changes.
// - Shallow copies do not protect nested objects; deep updates require new references along the path.
// - Immutable patterns are critical for application state management, especially in React.
