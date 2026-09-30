/**
 * Array.prototype.sort()
 * ======================
 *
 * The `Array.prototype.sort()` method sorts the elements of an array in place
 * and returns the same array.
 *
 * By default, elements are converted to strings and sorted according to
 * their UTF-16 code unit values. A compare function can be provided to
 * define numeric, object, descending, or other ordering rules.
 */

// ---------------------------------------------------------------------
// 1. Basic `sort()`
// ---------------------------------------------------------------------

// Without a compare function, `sort()` converts elements to strings
// and sorts them according to their UTF-16 code unit values.

const names = ["Charlie", "Alice", "Bob"];

names.sort();

console.log(names); // ["Alice", "Bob", "Charlie"]

// `sort()` mutates the original array.

// ---------------------------------------------------------------------
// 2. Default sorting is not numeric
// ---------------------------------------------------------------------

// Numbers are converted to strings before the default comparison.

const numbers = [10, 2, 30, 4, 1];

numbers.sort();

console.log(numbers); // [1, 10, 2, 30, 4]

// The string representations are compared:
// "1" < "10" < "2" < "30" < "4"

// Use a compare function for numeric sorting.

// ---------------------------------------------------------------------
// 3. Ascending numeric sort
// ---------------------------------------------------------------------

const values = [10, 2, 30, 4, 1];

values.sort((a, b) => a - b);

console.log(values); // [1, 2, 4, 10, 30]

// When the result is:
// negative -> `a` comes before `b`
// positive -> `b` comes before `a`
// zero     -> their relative order is preserved

// ---------------------------------------------------------------------
// 4. Descending numeric sort
// ---------------------------------------------------------------------

const scores = [10, 2, 30, 4, 1];

scores.sort((a, b) => b - a);

console.log(scores); // [30, 10, 4, 2, 1]

// Reversing the subtraction reverses the ordering.

// ---------------------------------------------------------------------
// 5. How the compare function works
// ---------------------------------------------------------------------

const valuesToCompare = [8, 3, 5];

valuesToCompare.sort((a, b) => {
  console.log("Comparing:", a, b);
  return a - b;
});

console.log(valuesToCompare); // [3, 5, 8]

// The compare function does not need to return exactly -1, 0, or 1.
// Any negative value means `a` should come before `b`.
// Any positive value means `a` should come after `b`.
// Zero means neither element is ordered before the other by this comparison.

// ---------------------------------------------------------------------
// 6. Sorting strings alphabetically
// ---------------------------------------------------------------------

const fruits = ["banana", "apple", "orange", "grape"];

fruits.sort();

console.log(fruits); // ["apple", "banana", "grape", "orange"]

// This works for simple strings when the desired order matches
// their default UTF-16 ordering.

// ---------------------------------------------------------------------
// 7. Case-sensitive string sorting
// ---------------------------------------------------------------------

const words = ["banana", "Apple", "apple", "Banana"];

words.sort();

console.log(words); // ["Apple", "Banana", "apple", "banana"]

// Uppercase and lowercase letters have different UTF-16 code unit values.
// For user-facing alphabetical sorting, `localeCompare()` is often more appropriate.

// ---------------------------------------------------------------------
// 8. `localeCompare()` for strings
// ---------------------------------------------------------------------

const cities = ["Zürich", "Amsterdam", "Berlin", "Århus"];

cities.sort((a, b) => a.localeCompare(b));

console.log(cities);

// `localeCompare()` compares strings according to locale-sensitive
// collation rules rather than simple UTF-16 ordering.

// ---------------------------------------------------------------------
// 9. Descending string sort
// ---------------------------------------------------------------------

const countries = ["Canada", "Brazil", "Germany", "Australia"];

countries.sort((a, b) => b.localeCompare(a));

console.log(countries); // ["Germany", "Canada", "Brazil", "Australia"]

// Swapping the operands reverses the ordering.

// ---------------------------------------------------------------------
// 10. Sorting objects by a property
// ---------------------------------------------------------------------

// When sorting objects, provide a compare function that reads the
// property used for ordering.

const users = [
  { name: "John", age: 35 },
  { name: "Jane", age: 28 },
  { name: "Mark", age: 42 },
];

users.sort((a, b) => a.age - b.age);

console.log(users);
// [
//     { name: "Jane", age: 28 },
//     { name: "John", age: 35 },
//     { name: "Mark", age: 42 }
// ]

// ---------------------------------------------------------------------
// 11. Sorting objects by strings
// ---------------------------------------------------------------------

const products = [
  { name: "Phone", price: 800 },
  { name: "Laptop", price: 1200 },
  { name: "Monitor", price: 300 },
];

products.sort((a, b) => a.name.localeCompare(b.name));

console.log(products);
// [
//     { name: "Laptop", price: 1200 },
//     { name: "Monitor", price: 300 },
//     { name: "Phone", price: 800 }
// ]

// ---------------------------------------------------------------------
// 12. Sorting by a derived value
// ---------------------------------------------------------------------

const files = [
  { name: "report.pdf", size: 500 },
  { name: "photo.jpg", size: 1200 },
  { name: "notes.txt", size: 200 },
];

files.sort((a, b) => a.size - b.size);

console.log(files);
// [
//     { name: "notes.txt", size: 200 },
//     { name: "report.pdf", size: 500 },
//     { name: "photo.jpg", size: 1200 }
// ]

// The comparison can use any value derived from the elements.

// ---------------------------------------------------------------------
// 13. Sorting with multiple criteria
// ---------------------------------------------------------------------

const people = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
  { name: "Mark", age: 30 },
  { name: "Alice", age: 25 },
];

people.sort((a, b) => {
  const ageDifference = a.age - b.age;

  if (ageDifference !== 0) {
    return ageDifference;
  }

  return a.name.localeCompare(b.name);
});

console.log(people);
// [
//     { name: "Alice", age: 25 },
//     { name: "Jane", age: 25 },
//     { name: "John", age: 30 },
//     { name: "Mark", age: 30 }
// ]

// The first criterion is age.
// When ages are equal, names determine the order.

// ---------------------------------------------------------------------
// 14. `sort()` mutates the array
// ---------------------------------------------------------------------

const original = [3, 1, 2];

const sorted = original.sort((a, b) => a - b);

console.log(sorted); // [1, 2, 3]
console.log(original); // [1, 2, 3]

// `sorted` and `original` refer to the same array.

console.log(sorted === original); // true

// ---------------------------------------------------------------------
// 15. Creating a sorted copy
// ---------------------------------------------------------------------

// Use `toSorted()` when you want a new sorted array without changing
// the original array.

const numbersToCopy = [3, 1, 2];

const sortedCopy = numbersToCopy.toSorted((a, b) => a - b);

console.log(sortedCopy); // [1, 2, 3]
console.log(numbersToCopy); // [3, 1, 2]

// `toSorted()` is the non-mutating counterpart of `sort()`.

// ---------------------------------------------------------------------
// 16. Copying before `sort()`
// ---------------------------------------------------------------------

// Another way to preserve the original array is to make a shallow copy
// before calling `sort()`.

const valuesToCopy = [5, 2, 8, 1];

const sortedValues = [...valuesToCopy].sort((a, b) => a - b);

console.log(sortedValues); // [1, 2, 5, 8]
console.log(valuesToCopy); // [5, 2, 8, 1]

// Array spread creates a new array, so `sort()` mutates only that copy.

// ---------------------------------------------------------------------
// 17. Sorting object arrays and shallow copies
// ---------------------------------------------------------------------

const originalUsers = [
  { name: "John", age: 35 },
  { name: "Jane", age: 28 },
];

const sortedUsers = [...originalUsers].sort((a, b) => a.age - b.age);

console.log(sortedUsers);
// [
//     { name: "Jane", age: 28 },
//     { name: "John", age: 35 }
// ]

console.log(originalUsers);
// [
//     { name: "John", age: 35 },
//     { name: "Jane", age: 28 }
// ]

// The array structure is copied, but the objects inside remain shared references.

// ---------------------------------------------------------------------
// 18. Stable sorting
// ---------------------------------------------------------------------

// Modern JavaScript specifies stable sorting.
// Elements that compare as equal keep their original relative order.

const employees = [
  { name: "John", department: "engineering" },
  { name: "Jane", department: "sales" },
  { name: "Mark", department: "engineering" },
  { name: "Alice", department: "sales" },
];

employees.sort((a, b) => a.department.localeCompare(b.department));

console.log(employees);
// [
//     { name: "John", department: "engineering" },
//     { name: "Mark", department: "engineering" },
//     { name: "Jane", department: "sales" },
//     { name: "Alice", department: "sales" }
// ]

// John remains before Mark because both compare equally on `department`
// and John appeared first in the original array.

// ---------------------------------------------------------------------
// 19. Sorting `undefined` values
// ---------------------------------------------------------------------

// When sorting without a compare function, `undefined` values are placed
// at the end of the array.

const valuesWithUndefined = [3, undefined, 1, 2, undefined];

valuesWithUndefined.sort((a, b) => a - b);

console.log(valuesWithUndefined);
// [1, 2, 3, undefined, undefined]

// `sort()` always places existing `undefined` elements at the end.
// A numeric compare function should therefore account for other
// special values if they are possible in the data.

// ---------------------------------------------------------------------
// 20. Sorting `NaN` values
// ---------------------------------------------------------------------

// A compare function should return meaningful ordering results.
// Subtracting values that contain `NaN` produces `NaN`, which behaves
// like a comparison result of zero for sorting purposes.

const valuesWithNaN = [3, NaN, 1, 2];

valuesWithNaN.sort((a, b) => a - b);

console.log(valuesWithNaN);

// Avoid relying on numeric subtraction when the data can contain
// non-numeric values such as `NaN`. Validate or normalize the data first.

// ---------------------------------------------------------------------
// 21. Sorting numbers with negative and decimal values
// ---------------------------------------------------------------------

const measurements = [3.5, -2, 10.25, 0, -1.5];

measurements.sort((a, b) => a - b);

console.log(measurements); // [-2, -1.5, 0, 3.5, 10.25]

// The numeric compare function works for negative and decimal numbers.

// ---------------------------------------------------------------------
// 22. Sorting by boolean values
// ---------------------------------------------------------------------

const accounts = [
  { name: "John", active: false },
  { name: "Jane", active: true },
  { name: "Mark", active: false },
];

accounts.sort((a, b) => Number(b.active) - Number(a.active));

console.log(accounts);
// [
//     { name: "Jane", active: true },
//     { name: "John", active: false },
//     { name: "Mark", active: false }
// ]

// `Number(true)` is 1 and `Number(false)` is 0.
// Subtracting `b` from `a` puts active accounts first.

// ---------------------------------------------------------------------
// 23. Sorting dates
// ---------------------------------------------------------------------

const dates = [new Date("2026-03-15"), new Date("2025-12-01"), new Date("2026-01-10")];

dates.sort((a, b) => a - b);

console.log(dates);
// [
//     2025-12-01,
//     2026-01-10,
//     2026-03-15
// ]

// Date objects can be numerically compared because subtraction converts
// them to their numeric time values.

// ---------------------------------------------------------------------
// 24. The compare function should define a consistent ordering
// ---------------------------------------------------------------------

const numbersToSort = [4, 1, 3, 2];

numbersToSort.sort((a, b) => {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
});

console.log(numbersToSort); // [1, 2, 3, 4]

// A compare function should consistently describe the intended ordering.
// Returning inconsistent results can produce implementation-dependent
// or unexpected ordering.

// ---------------------------------------------------------------------
// 25. `sort()` in React
// ---------------------------------------------------------------------

// React state and props should generally be treated as immutable.
// Calling `sort()` directly on an array from state or props mutates
// that array, which can cause incorrect state updates.

const usersForRendering = [
  { name: "John", age: 35 },
  { name: "Jane", age: 28 },
  { name: "Mark", age: 42 },
];

const sortedUsersForRendering = usersForRendering.toSorted((a, b) => a.name.localeCompare(b.name));

console.log(sortedUsersForRendering);
// [
//     { name: "Jane", age: 28 },
//     { name: "John", age: 35 },
//     { name: "Mark", age: 42 }
// ]

console.log(usersForRendering);
// [
//     { name: "John", age: 35 },
//     { name: "Jane", age: 28 },
//     { name: "Mark", age: 42 }
// ]

// `toSorted()` is particularly useful when an existing array must remain
// unchanged, such as data originating from React state or props.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `sort()` sorts an array in place and returns the same array.
// - Without a compare function, elements are converted to strings and sorted by UTF-16 code unit values.
// - Numeric arrays require a compare function such as `(a, b) => a - b`.
// - Returning a negative value puts `a` before `b`; a positive value puts `a` after `b`; zero preserves their relative order.
// - `sort()` can sort strings, numbers, objects, dates, and other values with an appropriate compare function.
// - Modern JavaScript specifies stable sorting, so equal elements retain their original relative order.
// - `sort()` mutates the source array.
// - `toSorted()` creates a sorted copy without mutating the source array.
// - Array spread can also create a shallow copy before calling `sort()`.
// - In React, avoid mutating arrays from state or props; use `toSorted()` or copy the array before sorting.
