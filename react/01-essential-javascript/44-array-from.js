/**
 * Array.prototype.from()
 * ======================
 *
 * The `Array.prototype.from()` method creates a new array from an iterable or
 * array-like value.
 *
 * It is commonly used to convert values such as strings, Sets, Maps,
 * NodeLists, and other iterable or array-like objects into real arrays.
 */

// ---------------------------------------------------------------------
// 1. Basic `Array.from()`
// ---------------------------------------------------------------------

// `Array.from()` creates a new real array from an iterable source.
const characters = Array.from("React");

console.log(characters); // ["R", "e", "a", "c", "t"]

// ---------------------------------------------------------------------
// 2. Converting a Set
// ---------------------------------------------------------------------

// Sets are iterable, so they can be converted directly to arrays while removing duplicates.
const uniqueNumbers = new Set([1, 2, 3, 2, 1]);
const numbers = Array.from(uniqueNumbers);

console.log(numbers); // [1, 2, 3]

// ---------------------------------------------------------------------
// 3. Converting a Map
// ---------------------------------------------------------------------

// Maps are iterable and yield `[key, value]` entry pairs.
const userRoles = new Map([
  ["john", "admin"],
  ["jane", "editor"],
]);

const entries = Array.from(userRoles);
console.log(entries); // [["john", "admin"], ["jane", "editor"]]

// ---------------------------------------------------------------------
// 4. Converting Map keys and values
// ---------------------------------------------------------------------

// Iterators from `Map.prototype.keys()` and `Map.prototype.values()` convert into clean arrays.
const roles = new Map([
  ["john", "admin"],
  ["jane", "editor"],
]);

const usernames = Array.from(roles.keys());
const roleNames = Array.from(roles.values());

console.log(usernames); // ["john", "jane"]
console.log(roleNames); // ["admin", "editor"]

// ---------------------------------------------------------------------
// 5. Converting array-like objects
// ---------------------------------------------------------------------

// Array-like objects feature a `length` property and indexed properties.
const arrayLike = {
  0: "first",
  1: "second",
  2: "third",
  length: 3,
};

const converted = Array.from(arrayLike);
console.log(converted); // ["first", "second", "third"]

// ---------------------------------------------------------------------
// 6. Array-like values and missing indexes
// ---------------------------------------------------------------------

// Missing indexed properties in array-like structures evaluate to `undefined`.
const sparseLike = {
  0: "first",
  2: "third",
  length: 3,
};

const result = Array.from(sparseLike);
console.log(result); // ["first", undefined, "third"]

// ---------------------------------------------------------------------
// 7. Converting a NodeList
// ---------------------------------------------------------------------

// Convert DOM NodeLists into arrays to unlock full array methods.
// const buttons = document.querySelectorAll("button");
// const buttonArray = Array.from(buttons);

// ---------------------------------------------------------------------
// 8. Converting an HTMLCollection
// ---------------------------------------------------------------------

// HTMLCollections are array-like browser structures that easily map to true arrays.
// const elements = document.getElementsByClassName("item");
// const elementArray = Array.from(elements);

// ---------------------------------------------------------------------
// 9. Strings are iterable
// ---------------------------------------------------------------------

// `Array.from()` iterates over strings natively by their characters.
const letters = Array.from("hello");
console.log(letters); // ["h", "e", "l", "l", "o"]

// ---------------------------------------------------------------------
// 10. Unicode characters
// ---------------------------------------------------------------------

// String iteration correctly handles Unicode code points and surrogate pairs (e.g., emojis).
const symbols = Array.from("A😀B");
console.log(symbols); // ["A", "😀", "B"]

// ---------------------------------------------------------------------
// 11. The optional mapping function
// ---------------------------------------------------------------------

// Provide an optional mapping function as the second argument to transform elements during creation.
const values = Array.from([1, 2, 3], (value) => value * 2);
console.log(values); // [2, 4, 6]

// ---------------------------------------------------------------------
// 12. Mapping strings
// ---------------------------------------------------------------------

// Map and convert character strings simultaneously during conversion.
const uppercaseLetters = Array.from("react", (letter) => letter.toUpperCase());
console.log(uppercaseLetters); // ["R", "E", "A", "C", "T"]

// ---------------------------------------------------------------------
// 13. The mapping function receives the index
// ---------------------------------------------------------------------

// The mapping function receives both the current value and its index.
const indexedValues = Array.from(["a", "b", "c"], (value, index) => `${index}:${value}`);
console.log(indexedValues); // ["0:a", "1:b", "2:c"]

// ---------------------------------------------------------------------
// 14. Creating a range of numbers
// ---------------------------------------------------------------------

// Combine an object length descriptor with a mapping function to generate number ranges.
const numbersFromZero = Array.from({ length: 5 }, (_, index) => index);
console.log(numbersFromZero); // [0, 1, 2, 3, 4]

// ---------------------------------------------------------------------
// 15. Creating a range with an offset
// ---------------------------------------------------------------------

// Adjust the mapping calculation to generate sequences starting from custom offsets.
const numbersFromOne = Array.from({ length: 5 }, (_, index) => index + 1);
console.log(numbersFromOne); // [1, 2, 3, 4, 5]

// ---------------------------------------------------------------------
// 16. Creating calculated sequences
// ---------------------------------------------------------------------

// Generate complex algorithmic values based on indexes.
const squares = Array.from({ length: 5 }, (_, index) => (index + 1) ** 2);
console.log(squares); // [1, 4, 9, 16, 25]

// ---------------------------------------------------------------------
// 17. The length of an array-like object
// ---------------------------------------------------------------------

// `Array.from()` strictly respects the specified `length` property limits.
const limited = Array.from({
  0: "a",
  1: "b",
  2: "c",
  length: 2,
});

console.log(limited); // ["a", "b"]

// ---------------------------------------------------------------------
// 18. Array.from() creates a new array
// ---------------------------------------------------------------------

// The returned output is always a distinct new array instance.
const source = [1, 2, 3];
const copy = Array.from(source);

console.log(copy === source); // false

// ---------------------------------------------------------------------
// 19. Shallow copying
// ---------------------------------------------------------------------

// `Array.from()` performs a shallow copy; inner object references remain shared.
const users = [{ name: "John" }, { name: "Jane" }];
const usersCopy = Array.from(users);

usersCopy[0].name = "Mark";
console.log(users[0].name); // "Mark" (shared reference)

// ---------------------------------------------------------------------
// 20. `Array.from()` vs. spread syntax
// ---------------------------------------------------------------------

// Spread syntax (`[...]`) and `Array.from()` both convert iterables, but `Array.from()` supports inline mapping.
const valuesToCopy = new Set([1, 2, 3]);
const fromResult = Array.from(valuesToCopy);
const spreadResult = [...valuesToCopy];

console.log(fromResult); // [1, 2, 3]
console.log(spreadResult); // [1, 2, 3]

// ---------------------------------------------------------------------
// 21. `Array.from()` vs. `map()`
// ---------------------------------------------------------------------

// `map()` transforms an existing array; `Array.from()` builds an array from an iterable source with optional mapping.
const sourceValues = [1, 2, 3];
console.log(Array.from(sourceValues, (v) => v * 2)); // [2, 4, 6]

// ---------------------------------------------------------------------
// 22. Converting an arguments object
// ---------------------------------------------------------------------

// Convert legacy function `arguments` collection objects into real arrays.
function collectArguments() {
  return Array.from(arguments);
}

console.log(collectArguments("a", "b", "c")); // ["a", "b", "c"]

// ---------------------------------------------------------------------
// 23. Converting a typed array
// ---------------------------------------------------------------------

// Copy performance-optimized typed arrays into standard JavaScript arrays.
const typedValues = new Uint8Array([10, 20, 30]);
const regularArray = Array.from(typedValues);

console.log(Array.isArray(regularArray)); // true

// ---------------------------------------------------------------------
// 24. `Array.from()` with `null` and `undefined`
// ---------------------------------------------------------------------

// Passing `null` or `undefined` throws a TypeError because they are neither iterable nor array-like.
try {
  Array.from(null);
} catch (error) {
  console.log(error instanceof TypeError); // true
}

// ---------------------------------------------------------------------
// 25. `Array.from()` in React
// ---------------------------------------------------------------------

// Convert query selections into standard arrays for React data manipulations.
const selectedElements = Array.from(document?.querySelectorAll?.("[data-selected]") ?? []);
console.log(selectedElements.length);

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Array.from()` creates a new array from any iterable or array-like value.
// - It handles strings, Sets, Maps, NodeLists, HTMLCollections, typed arrays, and `arguments`.
// - The optional second argument applies a mapping function during creation, receiving values and indices.
// - Array-like objects are evaluated via their `length` and sequential index properties.
// - `Array.from()` performs shallow copies and throws a TypeError if given `null` or `undefined`.
