/**
 * Arrays
 * ======
 *
 * An Array in JavaScript is an ordered list of values. Arrays can hold items
 * of any type—including numbers, strings, objects, functions, or other arrays.
 *
 * Arrays are zero-indexed and dynamically sized, meaning their length grows
 * or shrinks automatically as items are added or removed.
 */

// ---------------------------------------------------------------------
// 1. Creating Arrays
// ---------------------------------------------------------------------

// Array literal notation (preferred, standard way)
const emptyArray = [];
const numbers = [10, 20, 30, 40, 50];
const mixed = [1, "hello", true, null, { id: 1 }, [2, 3]];

console.log(numbers); // [10, 20, 30, 40, 50]

// `Array` constructor
const numbersFromConstructor = new Array(10, 20, 30);
console.log(numbersFromConstructor); // [10, 20, 30]

// WARNING: Passing a single number argument to `new Array()` creates an empty array with that length!
const sparseArray = new Array(5);
console.log(sparseArray); // [ <5 empty items> ]
console.log(sparseArray.length); // 5

// ---------------------------------------------------------------------
// 2. `length` Property
// ---------------------------------------------------------------------

// The `length` property returns the total number of elements in the array.

const languages = ["JavaScript", "TypeScript", "Python", "Rust"];

console.log(languages.length); // 4

// `length` is mutable. Truncating `length` drops elements permanently!
languages.length = 2;
console.log(languages); // ["JavaScript", "TypeScript"]

// Clearing an array completely using `length`:
languages.length = 0;
console.log(languages); // []

// ---------------------------------------------------------------------
// 3. Accessing Elements (Zero-based Indexing & `at()`)
// ---------------------------------------------------------------------

const fruits = ["apple", "banana", "cherry", "date"];

// Standard Bracket Notation
console.log(fruits[0]); // "apple"
console.log(fruits[2]); // "cherry"
console.log(fruits[10]); // undefined (out of bounds)

// `at()` Method (supports negative indices relative to end)
console.log(fruits.at(0)); // "apple"
console.log(fruits.at(-1)); // "date"   (last element)
console.log(fruits.at(-2)); // "cherry" (second-to-last)

// ---------------------------------------------------------------------
// 4. Modifying Array Elements
// ---------------------------------------------------------------------

// Arrays are mutable, even when declared with `const`.
// (`const` prevents reassignment of the variable, not mutation of the contents).

const colors = ["red", "green", "blue"];

colors[1] = "yellow";
console.log(colors); // ["red", "yellow", "blue"]

// Adding an element at an index past current bounds creates sparse arrays:
colors[5] = "purple";
console.log(colors); // ["red", "yellow", "blue", <2 empty items>, "purple"]
console.log(colors.length); // 6

// ---------------------------------------------------------------------
// 5. Basic Mutation Methods: Stack & Queue Operations
// ---------------------------------------------------------------------

// `push()` - Add element(s) to the END. Returns new length.
const stack = ["a", "b"];
const newLength = stack.push("c", "d");
console.log(stack); // ["a", "b", "c", "d"]
console.log(newLength); // 4

// `pop()` - Remove & return the LAST element.
const lastItem = stack.pop();
console.log(lastItem); // "d"
console.log(stack); // ["a", "b", "c"]

// `unshift()` - Add element(s) to the START. Returns new length.
stack.unshift("z");
console.log(stack); // ["z", "a", "b", "c"]

// `shift()` - Remove & return the FIRST element.
const firstItem = stack.shift();
console.log(firstItem); // "z"
console.log(stack); // ["a", "b", "c"]

// Note: `shift()` and `unshift()` require re-indexing all subsequent items,
// making them O(n) operations, whereas `push()` and `pop()` are O(1).

// ---------------------------------------------------------------------
// 6. Checking for Arrays (`Array.isArray()`)
// ---------------------------------------------------------------------

// `typeof` treats arrays as `"object"`, which is ambiguous.
console.log(typeof [1, 2, 3]); // "object"

// Always use `Array.isArray()` to check if a value is an array:
console.log(Array.isArray([1, 2, 3])); // true
console.log(Array.isArray({})); // false
console.log(Array.isArray("string")); // false

// ---------------------------------------------------------------------
// 7. Searching Arrays (`indexOf`, `lastIndexOf`, `includes`)
// ---------------------------------------------------------------------

const items = ["A", "B", "C", "B", "A"];

// `indexOf()` - Returns first matching index, or -1 if not found.
console.log(items.indexOf("B")); // 1
console.log(items.indexOf("Z")); // -1

// `lastIndexOf()` - Returns last matching index.
console.log(items.lastIndexOf("B")); // 3

// `includes()` - Returns boolean indicating existence (uses `SameValueZero`).
console.log(items.includes("C")); // true
console.log(items.includes("Z")); // false

// Difference with NaN: `indexOf` fails on NaN, but `includes` finds it.
const numList = [1, 2, NaN];
console.log(numList.indexOf(NaN)); // -1
console.log(numList.includes(NaN)); // true

// ---------------------------------------------------------------------
// 8. Extracting & Combining (`slice` vs `concat`)
// ---------------------------------------------------------------------

// `slice(start, end)` - Returns a shallow copy of a portion of an array.
// Does NOT mutate original array. End index is exclusive.
const animals = ["ant", "bison", "camel", "duck", "elephant"];

console.log(animals.slice(2)); // ["camel", "duck", "elephant"]
console.log(animals.slice(1, 4)); // ["bison", "camel", "duck"]
console.log(animals.slice(-2)); // ["duck", "elephant"]

// `concat()` - Merges arrays into a new array without mutating sources.
const set1 = [1, 2];
const set2 = [3, 4];
const combined = set1.concat(set2, [5, 6]);

console.log(combined); // [1, 2, 3, 4, 5, 6]
console.log(set1); // [1, 2] (original untouched)

// Modern alternative to `concat()`: Spread syntax `[...]`
const spreadCombined = [...set1, ...set2, 5, 6];
console.log(spreadCombined); // [1, 2, 3, 4, 5, 6]

// ---------------------------------------------------------------------
// 9. Powerful In-Place Mutation: `splice()`
// ---------------------------------------------------------------------

// `splice(start, deleteCount, ...itemsToAdd)`
// Alters the original array by removing, replacing, or inserting elements.
// Returns an array of deleted elements.

const months = ["Jan", "March", "April", "June"];

// Inserting at index 1:
months.splice(1, 0, "Feb");
console.log(months); // ["Jan", "Feb", "March", "April", "June"]

// Replacing 1 element at index 4:
months.splice(4, 1, "May");
console.log(months); // ["Jan", "Feb", "March", "April", "May"]

// Deleting 2 elements starting at index 0:
const deleted = months.splice(0, 2);
console.log(deleted); // ["Jan", "Feb"]
console.log(months); // ["March", "April", "May"]

// ---------------------------------------------------------------------
// 10. Reversing & Sorting (`reverse`, `sort`)
// ---------------------------------------------------------------------

// `reverse()` - Reverses the array IN PLACE.
const originalSeq = [1, 2, 3];
originalSeq.reverse();
console.log(originalSeq); // [3, 2, 1]

// `sort()` - Sorts elements IN PLACE.
// Default sort converts elements to strings and compares UTF-16 code units!
const scores = [10, 5, 80, 100, 1];
scores.sort();
console.log(scores); // [1, 10, 100, 5, 80] <-- String comparison sorting error!

// Correct numerical sorting using a comparator callback:
scores.sort((a, b) => a - b);
console.log(scores); // [1, 5, 10, 80, 100]

// ---------------------------------------------------------------------
// 11. Immutable Copy-on-Write Alternatives (ES2023)
// ---------------------------------------------------------------------

// Modern JS added non-mutating counterparts to `reverse`, `sort`, `splice`, and index assignment.

const originalList = ["C", "A", "B"];

// `toSorted()` returns a sorted copy
const sortedCopy = originalList.toSorted();
console.log(sortedCopy); // ["A", "B", "C"]
console.log(originalList); // ["C", "A", "B"]

// `toReversed()` returns a reversed copy
const reversedCopy = originalList.toReversed();
console.log(reversedCopy); // ["B", "A", "C"]

// `toSpliced()` returns a modified copy
const splicedCopy = originalList.toSpliced(1, 1, "X");
console.log(splicedCopy); // ["C", "X", "B"]

// `with(index, value)` returns a copy with one item replaced
const updatedCopy = originalList.with(0, "Z");
console.log(updatedCopy); // ["Z", "A", "B"]

// ---------------------------------------------------------------------
// 12. Joining and Converting to Strings (`join`)
// ---------------------------------------------------------------------

// `join(separator)` combines all elements into a single string.

const pathSegments = ["usr", "local", "bin"];

console.log(pathSegments.join("/")); // "usr/local/bin"
console.log(pathSegments.join()); // "usr,local,bin" (default separator is comma)
console.log(pathSegments.join("")); // "usrlocalbin"

// ---------------------------------------------------------------------
// 13. Static Utility Methods (`Array.from` & `Array.of`)
// ---------------------------------------------------------------------

// `Array.from()` creates a true array from iterable or array-like objects.
const charArray = Array.from("Hello");
console.log(charArray); // ["H", "e", "l", "l", "o"]

// Optional mapping callback in `Array.from()`:
const doubled = Array.from([1, 2, 3], (x) => x * 2);
console.log(doubled); // [2, 4, 6]

// `Array.of()` creates an array from a variable number of arguments,
// avoiding the single integer pitfall of `new Array()`.
console.log(Array.of(7)); // [7]
console.log(new Array(7)); // [ <7 empty items> ]
console.log(Array.of(1, 2, 3)); // [1, 2, 3]

// ---------------------------------------------------------------------
// 14. Shallow Copying Arrays
// ---------------------------------------------------------------------

// Assigning an array variable creates a reference, NOT a copy.
const source = [1, 2, 3];
const reference = source;
reference.push(4);
console.log(source); // [1, 2, 3, 4] (mutated!)

// Common ways to make a SHALLOW copy:
const copy1 = [...source];
const copy2 = source.slice();
const copy3 = Array.from(source);

copy1.push(99);
console.log(source); // [1, 2, 3, 4] (unaffected)
console.log(copy1); // [1, 2, 3, 4, 99]

// ---------------------------------------------------------------------
// 15. Common Mistake: Default `sort()` behavior
// ---------------------------------------------------------------------

const userIDs = [20, 3, 100, 1];

// Bad: lexicographical sort
userIDs.sort();
console.log(userIDs); // [1, 100, 20, 3]

// Good: explicit numeric comparator function
userIDs.sort((a, b) => a - b);
console.log(userIDs); // [1, 3, 20, 100]

// ---------------------------------------------------------------------
// 16. Common Mistake: Confusing `slice()` vs `splice()`
// ---------------------------------------------------------------------

const lettersArr = ["a", "b", "c", "d"];

// `slice`: Non-mutating, arguments are (start, end)
const sub = lettersArr.slice(1, 3);
console.log(sub); // ["b", "c"]
console.log(lettersArr); // ["a", "b", "c", "d"] (unchanged)

// `splice`: Mutating, arguments are (start, deleteCount, ...items)
const removed = lettersArr.splice(1, 2);
console.log(removed); // ["b", "c"]
console.log(lettersArr); // ["a", "d"] (mutated)

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// - Arrays are zero-indexed, dynamic, reference-type ordered collections.
// - Use `Array.isArray(val)` instead of `typeof` to verify array types.
// - `push()`/`pop()` mutate the end; `shift()`/`unshift()` mutate the start.
// - `at(-1)` provides clean negative index access for fetching end items.
// - `slice()` extracts elements without mutating; `splice()` mutates in-place.
// - Default `sort()` sorts lexicographically (as strings); always pass a comparator for numbers.
// - Modern ES2023 methods (`toSorted`, `toReversed`, `toSpliced`, `with`) provide immutable options.
// - Spread syntax `[...arr]` or `.slice()` creates shallow copies of arrays.
