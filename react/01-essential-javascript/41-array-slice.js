/**
 * Array.prototype.slice()
 * =======================
 *
 * The `Array.prototype.slice()` creates a shallow copy of part of an array.
 * It does not modify the original array and uses a start index and an optional
 * end index to determine which elements are included in the new array.
 *
 * This file covers basic slicing, start and end indexes, negative indexes,
 * omitted arguments, copying arrays, shallow copying, and practical React patterns.
 */

// ---------------------------------------------------------------------
// 1. Basic usage
// ---------------------------------------------------------------------

// `slice()` returns a new array containing a portion of the original array.

const numbers = [10, 20, 30, 40, 50];

const result = numbers.slice(1, 4);

console.log(result); // [20, 30, 40]
console.log(numbers); // [10, 20, 30, 40, 50]

// The original array is unchanged.

// ---------------------------------------------------------------------
// 2. The `start` parameter
// ---------------------------------------------------------------------

// `slice(start)` begins at `start` and continues to the end of the array.

const values = ["a", "b", "c", "d", "e"];

console.log(values.slice(2)); // ["c", "d", "e"]
console.log(values.slice(0)); // ["a", "b", "c", "d", "e"]
console.log(values.slice(4)); // ["e"]

// The start index is inclusive.

console.log(values.slice(2)); // starts with index 2 -> "c"

// ---------------------------------------------------------------------
// 3. The `end` parameter
// ---------------------------------------------------------------------

// `slice(start, end)` stops BEFORE the `end` index.
//
// Start is inclusive.
// End is exclusive.

const letters = ["a", "b", "c", "d", "e"];

console.log(letters.slice(1, 4)); // ["b", "c", "d"]

// Index positions:
//
// 0 -> "a"
// 1 -> "b"  <- included
// 2 -> "c"  <- included
// 3 -> "d"  <- included
// 4 -> "e"  <- excluded

// This makes `slice(start, end)` behave like a half-open range:
//
// [start, end)

// ---------------------------------------------------------------------
// 4. Omitting `end`
// ---------------------------------------------------------------------

// When `end` is omitted, `slice()` copies everything from `start`
// through the end of the array.

const colors = ["red", "green", "blue", "yellow"];

console.log(colors.slice(1)); // ["green", "blue", "yellow"]
console.log(colors.slice(2)); // ["blue", "yellow"]
console.log(colors.slice(3)); // ["yellow"]

// ---------------------------------------------------------------------
// 5. Starting from index zero
// ---------------------------------------------------------------------

// `slice(0)` creates a shallow copy of the entire array.

const original = [1, 2, 3];

const copy = original.slice();

console.log(copy); // [1, 2, 3]
console.log(original === copy); // false

// The two arrays have identical contents but are different array objects.

// ---------------------------------------------------------------------
// 6. `slice()` with no arguments
// ---------------------------------------------------------------------

// Calling `slice()` without arguments also copies the entire array.

const source = ["a", "b", "c"];

const copied = source.slice();

console.log(copied); // ["a", "b", "c"]
console.log(copied === source); // false

// `slice()` is therefore one of the traditional ways to create
// a shallow copy of an array.

// ---------------------------------------------------------------------
// 7. Negative start indexes
// ---------------------------------------------------------------------

// Negative indexes count backward from the end of the array.
//
// -1 -> last element
// -2 -> second-to-last element
// -3 -> third-to-last element

const items = ["a", "b", "c", "d", "e"];

console.log(items.slice(-1)); // ["e"]
console.log(items.slice(-2)); // ["d", "e"]
console.log(items.slice(-3)); // ["c", "d", "e"]

// Negative indexes are useful when working from the end
// without calculating the array length manually.

// ---------------------------------------------------------------------
// 8. Negative end indexes
// ---------------------------------------------------------------------

// The `end` parameter can also be negative.

const valuesAgain = ["a", "b", "c", "d", "e"];

console.log(valuesAgain.slice(1, -1)); // ["b", "c", "d"]
console.log(valuesAgain.slice(0, -2)); // ["a", "b", "c"]
console.log(valuesAgain.slice(2, -1)); // ["c", "d"]

// `-1` means "one position before the end" for the exclusive boundary.

// ---------------------------------------------------------------------
// 9. Combining positive and negative indexes
// ---------------------------------------------------------------------

const data = [10, 20, 30, 40, 50];

console.log(data.slice(1, -1)); // [20, 30, 40]
console.log(data.slice(-3, -1)); // [30, 40]
console.log(data.slice(-4, 4)); // [20, 30, 40]

// This lets you express ranges relative to both ends of the array.

// ---------------------------------------------------------------------
// 10. Start greater than or equal to end
// ---------------------------------------------------------------------

// If the normalized start position is greater than or equal to
// the normalized end position, `slice()` returns an empty array.

const sequence = [1, 2, 3, 4, 5];

console.log(sequence.slice(3, 2)); // []
console.log(sequence.slice(2, 2)); // []
console.log(sequence.slice(5, 2)); // []

// `slice()` does not reverse the range.
// Use `reverse()` or another approach when descending order is required.

// ---------------------------------------------------------------------
// 11. Start beyond the array length
// ---------------------------------------------------------------------

// A start index greater than or equal to the array length produces
// an empty array.

const smallArray = [1, 2, 3];

console.log(smallArray.slice(3)); // []
console.log(smallArray.slice(10)); // []

// The result is always a new array.

console.log(smallArray.slice(10) === smallArray); // false

// ---------------------------------------------------------------------
// 12. Negative start beyond the array length
// ---------------------------------------------------------------------

// A negative start index that is too small is clamped to index 0.

const numbersAgain = [1, 2, 3];

console.log(numbersAgain.slice(-100)); // [1, 2, 3]

// Conceptually:
//
// length + (-100) -> -97
// negative result -> treated as 0

// ---------------------------------------------------------------------
// 13. End beyond the array length
// ---------------------------------------------------------------------

// An end index greater than the array length is effectively treated
// as the array length.

const lettersAgain = ["a", "b", "c"];

console.log(lettersAgain.slice(1, 100)); // ["b", "c"]
console.log(lettersAgain.slice(0, 100)); // ["a", "b", "c"]

// There is no error when the end index exceeds the array length.

// ---------------------------------------------------------------------
// 14. `slice()` does not mutate the original array
// ---------------------------------------------------------------------

// `slice()` is a non-mutating array method.

const originalValues = [1, 2, 3, 4];

const selected = originalValues.slice(1, 3);

console.log(selected); // [2, 3]
console.log(originalValues); // [1, 2, 3, 4]

// Operations such as `splice()` behave differently because `splice()`
// modifies the original array.

// ---------------------------------------------------------------------
// 15. `slice()` vs. `splice()`
// ---------------------------------------------------------------------

// `slice()`:
// - returns a new array
// - does not mutate the original
// - selects a range

const numbersForSlice = [1, 2, 3, 4];

const sliced = numbersForSlice.slice(1, 2);

console.log(sliced); // [2]
console.log(numbersForSlice); // [1, 2, 3, 4]

// `splice()`:
// - modifies the original array
// - removes or replaces elements
// - returns the removed elements

const numbersForSplice = [1, 2, 3, 4];

const spliced = numbersForSplice.splice(1, 2);

console.log(spliced); // [2, 3]
console.log(numbersForSplice); // [1, 4]

// The similar names are easy to confuse.
// `slice()` is non-mutating; `splice()` is mutating.

// ---------------------------------------------------------------------
// 16. `slice()` creates a shallow copy
// ---------------------------------------------------------------------

// The array itself is copied, but nested objects are NOT cloned.

const userA = {
  name: "Ada",
};

const users = [userA];

const usersCopy = users.slice();

console.log(users === usersCopy); // false
console.log(users[0] === usersCopy[0]); // true

// Both arrays contain a reference to the same object.

// Changing the nested object therefore affects what both arrays see:

usersCopy[0].name = "Grace";

console.log(users[0].name); // "Grace"
console.log(usersCopy[0].name); // "Grace"

// `slice()` only creates a shallow copy.

// ---------------------------------------------------------------------
// 17. Shallow copying with primitive values
// ---------------------------------------------------------------------

// With primitive elements, the values themselves are copied.

const primitiveValues = [1, 2, 3];

const primitiveCopy = primitiveValues.slice();

primitiveCopy[0] = 100;

console.log(primitiveCopy); // [100, 2, 3]
console.log(primitiveValues); // [1, 2, 3]

// There is no shared nested object to mutate.

// ---------------------------------------------------------------------
// 18. Shallow copying nested arrays
// ---------------------------------------------------------------------

// Nested arrays are also objects, so they remain shared references.

const nested = [
  [1, 2],
  [3, 4],
];

const nestedCopy = nested.slice();

console.log(nested === nestedCopy); // false
console.log(nested[0] === nestedCopy[0]); // true

nestedCopy[0].push(3);

console.log(nested[0]); // [1, 2, 3]
console.log(nestedCopy[0]); // [1, 2, 3]

// `slice()` copied the outer array but not the inner arrays.

// ---------------------------------------------------------------------
// 19. Using `slice()` to remove the first element
// ---------------------------------------------------------------------

// Because `slice(1)` returns everything except the first element,
// it can be used for immutable array transformations.

const queue = ["first", "second", "third"];

const withoutFirst = queue.slice(1);

console.log(withoutFirst); // ["second", "third"]
console.log(queue); // ["first", "second", "third"]

// This is useful when creating a new array without mutating the original.

// ---------------------------------------------------------------------
// 20. Using `slice()` to remove the last element
// ---------------------------------------------------------------------

// `slice(0, -1)` returns everything except the last element.

const stack = [1, 2, 3, 4];

const withoutLast = stack.slice(0, -1);

console.log(withoutLast); // [1, 2, 3]
console.log(stack); // [1, 2, 3, 4]

// This is a common immutable alternative to `pop()`.

// ---------------------------------------------------------------------
// 21. Extracting the first N elements
// ---------------------------------------------------------------------

// `slice(0, n)` returns the first `n` elements.

const valuesToTake = [10, 20, 30, 40, 50];

console.log(valuesToTake.slice(0, 3)); // [10, 20, 30]
console.log(valuesToTake.slice(0, 1)); // [10]
console.log(valuesToTake.slice(0, 5)); // [10, 20, 30, 40, 50]

// This is useful for limiting the number of displayed items.

// ---------------------------------------------------------------------
// 22. Extracting the last N elements
// ---------------------------------------------------------------------

// Negative indexes make it easy to take elements from the end.

const latestValues = [10, 20, 30, 40, 50];

console.log(latestValues.slice(-2)); // [40, 50]
console.log(latestValues.slice(-3)); // [30, 40, 50]

// This is often useful for "latest N items" patterns.

// ---------------------------------------------------------------------
// 23. Pagination with `slice()`
// ---------------------------------------------------------------------

// `slice()` can create a page from an array.
//
// For page size 3:
//
// page 1 -> indexes 0 through 2
// page 2 -> indexes 3 through 5
// page 3 -> indexes 6 through 8

const allItems = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8", "Item 9"];

const pageSize = 3;
const page = 2;

const start = (page - 1) * pageSize;
const end = start + pageSize;

const pageItems = allItems.slice(start, end);

console.log(pageItems); // ["Item 4", "Item 5", "Item 6"]

// This works because `slice()` uses an inclusive start
// and exclusive end boundary.

// ---------------------------------------------------------------------
// 24. Practical React example: limiting visible items
// ---------------------------------------------------------------------

// `slice()` is commonly used when rendering only part of a collection.
//
// Example:
//
// const visibleItems = items.slice(0, 5);
//
// return (
//   <ul>
//     {visibleItems.map((item) => (
//       <li key={item.id}>{item.name}</li>
//     ))}
//   </ul>
// );
//
// The original `items` array remains unchanged.
// This is useful for "show first 5" or "show latest 5" interfaces.

// ---------------------------------------------------------------------
// 25. Practical React example: immutable array updates
// ---------------------------------------------------------------------

// `slice()` can be combined with spread syntax to create immutable updates.
//
// Insert an item at index 2:
//
// const updated = [
//   ...items.slice(0, 2),
//   newItem,
//   ...items.slice(2),
// ];
//
// If:
//
// items = ["a", "b", "c", "d"]
//
// then:
//
// [
//   ...items.slice(0, 2), // ["a", "b"]
//   newItem,
//   ...items.slice(2),   // ["c", "d"]
// ]
//
// produces:
//
// ["a", "b", newItem, "c", "d"]
//
// This pattern is useful when updating React state without mutating
// the existing array.

// ---------------------------------------------------------------------
// 26. Splitting an array into two parts
// ---------------------------------------------------------------------

// A single index can divide an array into two new arrays.

const sequenceAgain = [1, 2, 3, 4, 5];

const splitIndex = 3;

const left = sequenceAgain.slice(0, splitIndex);
const right = sequenceAgain.slice(splitIndex);

console.log(left); // [1, 2, 3]
console.log(right); // [4, 5]

// The two arrays together contain the same elements as the original,
// while the original remains unchanged.

// ---------------------------------------------------------------------
// 27. Copying an array before mutation
// ---------------------------------------------------------------------

// A common pattern is to make a shallow copy and then modify the copy.

const originalList = [1, 2, 3];

const copiedList = originalList.slice();

copiedList.push(4);

console.log(originalList); // [1, 2, 3]
console.log(copiedList); // [1, 2, 3, 4]

// This prevents direct mutation of the original array.

// In modern JavaScript, spread syntax is another concise option:
//
// const copiedList = [...originalList];

// Both create shallow copies.

// ---------------------------------------------------------------------
// 28. `slice()` works with array-like objects
// ---------------------------------------------------------------------

// `slice()` is an Array method, but it can be borrowed for array-like objects.
// An array-like object has numeric properties and a `length`.

const arrayLike = {
  0: "a",
  1: "b",
  2: "c",
  length: 3,
};

const converted = Array.prototype.slice.call(arrayLike);

console.log(converted); // ["a", "b", "c"]

// In modern JavaScript, `Array.from()` is usually clearer for conversion:
//
// const converted = Array.from(arrayLike);
//
// The important point is that `slice()` itself is an Array method,
// while `Array.from()` is specifically designed for converting iterables
// and array-like values.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `slice(start, end)` creates a new shallow copy of a selected range.
// - `start` is inclusive.
// - `end` is exclusive.
// - Omitting `end` copies from `start` through the end.
// - Calling `slice()` or `slice(0)` creates a shallow copy of the entire array.
// - Negative indexes count backward from the end.
// - An index beyond the array length is safely clamped.
// - If the normalized start is greater than or equal to the end, the result is [].
// - `slice()` never mutates the original array.
// - The copy is shallow: nested objects and arrays remain shared references.
// - `slice()` differs from `splice()`: `slice()` copies; `splice()` mutates.
// - Common uses include taking the first or last N elements, pagination,
//   splitting arrays, and immutable React state updates.
// - `slice()` can be combined with spread syntax to insert or remove elements
//   without mutating the original array.
