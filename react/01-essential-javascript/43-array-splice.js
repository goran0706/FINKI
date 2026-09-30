/**
 * Array.prototype.splice()
 * ========================
 *
 * The `Array.prototype.splice()` changes an array by removing, replacing,
 * and/or inserting elements at a specific position. Unlike `slice()`,
 * `splice()` mutates the original array and returns the elements removed.
 *
 * This file covers deletion, insertion, replacement, negative indexes,
 * the return value, practical immutable alternatives, and common mistakes.
 */

// ---------------------------------------------------------------------
// 1. Basic usage
// ---------------------------------------------------------------------

// `splice(start, deleteCount)` removes elements from the original array.
//
// The first argument is the index where the change starts.
// The second argument specifies how many elements to remove.

const numbers = [10, 20, 30, 40, 50];

const removed = numbers.splice(1, 2);

console.log(numbers); // [10, 40, 50]
console.log(removed); // [20, 30]

// `splice()` changed the original array.

// ---------------------------------------------------------------------
// 2. `splice()` mutates the original array
// ---------------------------------------------------------------------

// Unlike `slice()`, `splice()` does not create an unchanged copy.
// It directly modifies the array it is called on.

const values = ["a", "b", "c", "d"];

values.splice(1, 1);

console.log(values); // ["a", "c", "d"]

// The array itself has changed.

// This distinction is important:
//
// `slice()`  -> creates a new array; does not mutate
// `splice()` -> changes the existing array

// ---------------------------------------------------------------------
// 3. Removing one element
// ---------------------------------------------------------------------

// To remove one element, specify its index and `1` as the delete count.

const fruits = ["apple", "banana", "orange", "grape"];

const deletedFruit = fruits.splice(1, 1);

console.log(fruits); // ["apple", "orange", "grape"]
console.log(deletedFruit); // ["banana"]

// The returned value is always an array,
// even when only one element was removed.

// ---------------------------------------------------------------------
// 4. Removing multiple elements
// ---------------------------------------------------------------------

// The second argument determines how many elements are removed.

const colors = ["red", "green", "blue", "yellow", "purple"];

const deletedColors = colors.splice(1, 3);

console.log(colors); // ["red", "purple"]
console.log(deletedColors); // ["green", "blue", "yellow"]

// The deletion starts at index 1 and removes three elements.

// ---------------------------------------------------------------------
// 5. Removing everything from an index onward
// ---------------------------------------------------------------------

// Omitting `deleteCount` removes every element from `start` to the end.

const letters = ["a", "b", "c", "d", "e"];

const remainingRemoved = letters.splice(2);

console.log(letters); // ["a", "b"]
console.log(remainingRemoved); // ["c", "d", "e"]

// This is different from `splice(2, 0)`,
// which removes nothing and only provides an insertion point.

// ---------------------------------------------------------------------
// 6. Deleting zero elements
// ---------------------------------------------------------------------

// A delete count of zero means:
// "remove nothing from this position."

const items = ["a", "b", "c"];

const nothingRemoved = items.splice(1, 0);

console.log(items); // ["a", "b", "c"]
console.log(nothingRemoved); // []

// This becomes useful when inserting new elements.

// ---------------------------------------------------------------------
// 7. Inserting elements
// ---------------------------------------------------------------------

// To insert without removing anything:
//
// splice(start, 0, item1, item2, ...)

const numbersToInsert = [1, 2, 5];

numbersToInsert.splice(2, 0, 3, 4);

console.log(numbersToInsert); // [1, 2, 3, 4, 5]

// Index 2 was the insertion point.
// No existing elements were removed.

// ---------------------------------------------------------------------
// 8. Inserting one element
// ---------------------------------------------------------------------

const names = ["Ada", "Grace", "Linus"];

names.splice(1, 0, "Alan");

console.log(names); // ["Ada", "Alan", "Grace", "Linus"]

// The existing element at index 1 is shifted to the right.

// ---------------------------------------------------------------------
// 9. Inserting multiple elements
// ---------------------------------------------------------------------

const queue = ["first", "fourth"];

queue.splice(1, 0, "second", "third");

console.log(queue); // ["first", "second", "third", "fourth"]

// All inserted values appear in the order they were provided.

// ---------------------------------------------------------------------
// 10. Replacing elements
// ---------------------------------------------------------------------

// `splice()` can remove and insert at the same position,
// which makes it useful for replacing elements.
//
// splice(start, deleteCount, replacement...)

const valuesToReplace = ["a", "b", "c", "d"];

const replaced = valuesToReplace.splice(1, 2, "x", "y");

console.log(valuesToReplace); // ["a", "x", "y", "d"]
console.log(replaced); // ["b", "c"]

// Two elements were removed and two new elements were inserted.

// ---------------------------------------------------------------------
// 11. Replacing with a different number of elements
// ---------------------------------------------------------------------

// The number of inserted elements does not have to equal
// the number of removed elements.

const list = ["a", "b", "c", "d"];

list.splice(1, 2, "x");

console.log(list); // ["a", "x", "d"]

// Two elements were removed and one was inserted.

// The array became shorter.

// The opposite is also possible:

const expandedList = ["a", "d"];

expandedList.splice(1, 0, "b", "c");

console.log(expandedList); // ["a", "b", "c", "d"]

// ---------------------------------------------------------------------
// 12. The return value
// ---------------------------------------------------------------------

// `splice()` returns an array containing all removed elements.

const source = [10, 20, 30, 40];

const deleted = source.splice(1, 2);

console.log(deleted); // [20, 30]
console.log(source); // [10, 40]

// If nothing is removed, the return value is an empty array.

const array = [1, 2, 3];

const result = array.splice(1, 0, 100);

console.log(result); // []
console.log(array); // [1, 100, 2, 3]

// ---------------------------------------------------------------------
// 13. Removing the first element
// ---------------------------------------------------------------------

// `splice(0, 1)` removes the first element.

const firstItems = ["first", "second", "third"];

const firstRemoved = firstItems.splice(0, 1);

console.log(firstRemoved); // ["first"]
console.log(firstItems); // ["second", "third"]

// For queues, `shift()` is often more direct when only the first element
// needs to be removed.

// ---------------------------------------------------------------------
// 14. Removing the last element
// ---------------------------------------------------------------------

// `splice(-1, 1)` removes the last element.

const lastItems = [1, 2, 3, 4];

const lastRemoved = lastItems.splice(-1, 1);

console.log(lastRemoved); // [4]
console.log(lastItems); // [1, 2, 3]

// If the only requirement is removing the last element,
// `pop()` is usually clearer.

// ---------------------------------------------------------------------
// 15. Negative `start` indexes
// ---------------------------------------------------------------------

// A negative start index counts backward from the end.
//
// -1 -> last element
// -2 -> second-to-last element
// -3 -> third-to-last element

const valuesAgain = ["a", "b", "c", "d", "e"];

valuesAgain.splice(-2, 1);

console.log(valuesAgain); // ["a", "b", "c", "e"]

// The operation started at index 3,
// which is the second-to-last element before deletion.

// ---------------------------------------------------------------------
// 16. Negative start indexes with insertion
// ---------------------------------------------------------------------

// Negative indexes can also identify an insertion position.

const lettersAgain = ["a", "b", "d", "e"];

lettersAgain.splice(-2, 0, "c");

console.log(lettersAgain); // ["a", "b", "c", "d", "e"]

// `-2` refers to the position before "d" in this array.

// ---------------------------------------------------------------------
// 17. A start index larger than the array length
// ---------------------------------------------------------------------

// If `start` is greater than the array length,
// it is treated as the array length.

const smallArray = [1, 2, 3];

smallArray.splice(100, 0, 4);

console.log(smallArray); // [1, 2, 3, 4]

// The value is inserted at the end.

// If deletion is requested beyond the end,
// there are simply no elements to remove.

const anotherArray = [1, 2, 3];

const removedNothing = anotherArray.splice(100, 2);

console.log(anotherArray); // [1, 2, 3]
console.log(removedNothing); // []

// ---------------------------------------------------------------------
// 18. A negative start index beyond the array length
// ---------------------------------------------------------------------

// If a negative start index goes beyond the beginning,
// it is effectively clamped to index 0.

const numbersAgain = [1, 2, 3];

numbersAgain.splice(-100, 1);

console.log(numbersAgain); // [2, 3]

// The effective start position became 0.

// ---------------------------------------------------------------------
// 19. `deleteCount` larger than the remaining elements
// ---------------------------------------------------------------------

// If `deleteCount` exceeds the number of elements remaining,
// all remaining elements are removed.

const remaining = [1, 2, 3, 4];

const removedRemaining = remaining.splice(2, 100);

console.log(remaining); // [1, 2]
console.log(removedRemaining); // [3, 4]

// No error is thrown.

// ---------------------------------------------------------------------
// 20. `deleteCount` is zero
// ---------------------------------------------------------------------

// `splice(start, 0, ...)` is the standard insertion form.

const insertion = ["a", "d"];

insertion.splice(1, 0, "b", "c");

console.log(insertion); // ["a", "b", "c", "d"]

// This is different from omitting `deleteCount`.
//
// `splice(1)`    -> removes everything from index 1
// `splice(1, 0)` -> removes nothing

// ---------------------------------------------------------------------
// 21. `splice()` can replace one value
// ---------------------------------------------------------------------

const statuses = ["pending", "pending", "pending"];

statuses.splice(1, 1, "completed");

console.log(statuses); // ["pending", "completed", "pending"]

// This is often the simplest form when changing one element in place.

// ---------------------------------------------------------------------
// 22. `splice()` can replace several values
// ---------------------------------------------------------------------

const technologies = ["HTML", "CSS", "JavaScript", "PHP"];

technologies.splice(3, 1, "TypeScript");

console.log(technologies);
// ["HTML", "CSS", "JavaScript", "TypeScript"]

// Multiple values can also be replaced at once:

const stack = ["React", "Node.js", "MongoDB"];

stack.splice(1, 2, "Next.js", "PostgreSQL");

console.log(stack);
// ["React", "Next.js", "PostgreSQL"]

// ---------------------------------------------------------------------
// 23. `splice()` and object references
// ---------------------------------------------------------------------

// Removing an object from an array does not clone or destroy the object.
// `splice()` simply removes the reference from the array.

const user = {
  name: "Ada",
};

const users = [user];

const removedUsers = users.splice(0, 1);

console.log(users); // []
console.log(removedUsers); // [{ name: "Ada" }]

// The object itself still exists because `removedUsers[0]` references it.

removedUsers[0].name = "Grace";

console.log(removedUsers[0].name); // "Grace"
console.log(user.name); // "Grace"

// `splice()` changes the array structure, not the referenced object.

// ---------------------------------------------------------------------
// 24. Common mistake: confusing `slice()` and `splice()`
// ---------------------------------------------------------------------

// `slice()` does not mutate:

const originalValues = [1, 2, 3, 4];

const sliced = originalValues.slice(1, 3);

console.log(sliced); // [2, 3]
console.log(originalValues); // [1, 2, 3, 4]

// `splice()` mutates:

const originalValuesAgain = [1, 2, 3, 4];

const spliced = originalValuesAgain.splice(1, 2);

console.log(spliced); // [2, 3]
console.log(originalValuesAgain); // [1, 4]

// The names are similar, but their behavior is fundamentally different.

// ---------------------------------------------------------------------
// 25. `splice()` in React state
// ---------------------------------------------------------------------

// Directly calling `splice()` on an array stored in React state
// mutates the existing state object.
//
// This is a common mistake:
//
// const [items, setItems] = useState(["a", "b", "c"]);
//
// items.splice(1, 1);       // BAD: mutates React state directly
// setItems(items);          // same array reference
//
// React state should instead be replaced with a new array.
//
// A non-mutating alternative is:
//
// setItems((previousItems) =>
//   previousItems.filter((_, index) => index !== 1),
// );
//
// Or, when replacing one position:
//
// setItems((previousItems) =>
//   previousItems.map((item, index) =>
//     index === 1 ? newValue : item,
//   ),
// );

// ---------------------------------------------------------------------
// 26. Immutable alternative: remove by index
// ---------------------------------------------------------------------

// `slice()` and spread syntax can remove an element without mutation.

const originalList = ["a", "b", "c", "d"];
const indexToRemove = 1;

const updatedList = [...originalList.slice(0, indexToRemove), ...originalList.slice(indexToRemove + 1)];

console.log(updatedList); // ["a", "c", "d"]
console.log(originalList); // ["a", "b", "c", "d"]

// This creates a new array and leaves the original unchanged.

// ---------------------------------------------------------------------
// 27. Immutable alternative: insert by index
// ---------------------------------------------------------------------

// An element can be inserted without mutating the original array.

const originalItems = ["a", "c", "d"];
const insertAt = 1;
const newItem = "b";

const updatedItems = [...originalItems.slice(0, insertAt), newItem, ...originalItems.slice(insertAt)];

console.log(updatedItems); // ["a", "b", "c", "d"]
console.log(originalItems); // ["a", "c", "d"]

// This pattern is useful for React state because the original array
// remains untouched and the result has a new reference.

// ---------------------------------------------------------------------
// 28. Immutable alternative: replace by index
// ---------------------------------------------------------------------

// For replacing one item, `map()` is often simpler.

const originalNumbers = [10, 20, 30];
const replacementIndex = 1;

const updatedNumbers = originalNumbers.map((number, index) => (index === replacementIndex ? 99 : number));

console.log(updatedNumbers); // [10, 99, 30]
console.log(originalNumbers); // [10, 20, 30]

// No mutation occurs.

// ---------------------------------------------------------------------
// 29. `splice()` is useful for intentionally mutable arrays
// ---------------------------------------------------------------------

// `splice()` is not inherently bad.
// It is appropriate when mutation is intentional and controlled.

const buffer = [];

buffer.splice(0, 0, "a", "b", "c");

console.log(buffer); // ["a", "b", "c"]

buffer.splice(1, 1, "B");

console.log(buffer); // ["a", "B", "c"]

// Local temporary arrays that are not shared state can often be mutated safely.
// The important distinction is whether the array is shared or treated as immutable.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `splice()` changes the original array.
// - Its basic form is `splice(start, deleteCount, ...items)`.
// - `start` determines where the operation begins.
// - `deleteCount` determines how many existing elements are removed.
// - Additional arguments are inserted at the removal position.
// - `splice(start, 0, ...items)` inserts without removing anything.
// - Omitting `deleteCount` removes everything from `start` onward.
// - `splice()` returns an array containing the removed elements.
// - Negative `start` indexes count backward from the end.
// - The number of inserted elements can differ from the number removed.
// - `splice()` is fundamentally different from `slice()`: `splice()` mutates;
//   `slice()` creates a new shallow copy.
// - Directly using `splice()` on React state mutates existing state and should be avoided.
// - For React and other immutable state patterns, use `slice()`, spread,
//   `filter()`, or `map()` to create a new array instead.
