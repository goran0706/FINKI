/**
 * Set
 * ===
 *
 * A `Set` is a collection of unique values.
 *
 * Unlike an array, a Set does not store duplicate values. It can contain
 * values of any JavaScript type, including objects, arrays, functions,
 * and primitives.
 *
 * A Set preserves insertion order and provides methods for adding,
 * checking, removing, and iterating over values.
 */

// ---------------------------------------------------------------------
// 1. Creating a Set
// ---------------------------------------------------------------------

// Initialize an empty Set using the `Set` constructor.
const users = new Set();

console.log(users); // Set(0) {}

// ---------------------------------------------------------------------
// 2. Adding values with add()
// ---------------------------------------------------------------------

// Use `add()` to insert values; it returns the Set instance itself.
const languages = new Set();
languages.add("JavaScript");
languages.add("TypeScript");
languages.add("React");

console.log(languages);

// ---------------------------------------------------------------------
// 3. Duplicate values are ignored
// ---------------------------------------------------------------------

// Sets automatically ignore duplicate entries.
const numbers = new Set();
numbers.add(1);
numbers.add(2);
numbers.add(1);
numbers.add(2);
numbers.add(3);

console.log(numbers.size); // 3

// ---------------------------------------------------------------------
// 4. Initializing a Set with values
// ---------------------------------------------------------------------

// Pass any iterable into the constructor to populate the Set with unique values.
const initialNumbers = new Set([1, 2, 3, 2, 1]);
console.log(initialNumbers); // Set(3) {1, 2, 3}

// ---------------------------------------------------------------------
// 5. Creating a Set from an array
// ---------------------------------------------------------------------

// A common idiom for stripping duplicate primitive values from an array.
const values = [1, 2, 2, 3, 3, 3, 4];
const uniqueValues = new Set(values);

console.log(uniqueValues); // Set(4) {1, 2, 3, 4}

// ---------------------------------------------------------------------
// 6. Converting a Set back to an array
// ---------------------------------------------------------------------

// Because Sets are iterable, spread syntax easily converts them back into arrays.
const uniqueNumbers = new Set([1, 2, 3]);
const numberArray = [...uniqueNumbers];

console.log(numberArray); // [1, 2, 3]

// ---------------------------------------------------------------------
// 7. Checking for a value with has()
// ---------------------------------------------------------------------

// Use `has()` to quickly verify if a value exists within the Set.
const permissions = new Set(["read", "write"]);

console.log(permissions.has("read")); // true
console.log(permissions.has("delete")); // false

// ---------------------------------------------------------------------
// 8. Removing values with delete()
// ---------------------------------------------------------------------

// Use `delete()` to remove a value; it returns `true` if successful or `false` if missing.
const roles = new Set(["admin", "editor", "viewer"]);

console.log(roles.delete("editor")); // true
console.log(roles.delete("missing")); // false

// ---------------------------------------------------------------------
// 9. Removing all values with clear()
// ---------------------------------------------------------------------

// Wipe all elements from a Set completely using `clear()`.
const temporaryValues = new Set([1, 2, 3]);
temporaryValues.clear();

console.log(temporaryValues.size); // 0

// ---------------------------------------------------------------------
// 10. Getting the number of values
// ---------------------------------------------------------------------

// Access the `.size` property (not a method) to check total elements.
const products = new Set(["laptop", "phone", "tablet"]);
console.log(products.size); // 3

// ---------------------------------------------------------------------
// 11. Set preserves insertion order
// ---------------------------------------------------------------------

// Sets strictly track and iterate elements in the order they were inserted.
const ordered = new Set();
ordered.add("first");
ordered.add("second");
ordered.add("third");

for (const value of ordered) {
  console.log(value);
}

// ---------------------------------------------------------------------
// 12. Adding an existing value does not move it
// ---------------------------------------------------------------------

// Re-adding a value that is already present has no effect on its position.
const order = new Set(["first", "second", "third"]);
order.add("second");

console.log(order.size); // 3

// ---------------------------------------------------------------------
// 13. Deleting and re-adding a value
// ---------------------------------------------------------------------

// Deleting a value and re-adding it appends it to the end of the insertion order.
const reordered = new Set(["first", "second", "third"]);
reordered.delete("second");
reordered.add("second");

// ---------------------------------------------------------------------
// 14. Values can have different types
// ---------------------------------------------------------------------

// Sets can host elements of entirely mixed JavaScript types.
const mixed = new Set();
mixed.add("hello");
mixed.add(42);
mixed.add(true);
mixed.add(null);
mixed.add(undefined);

console.log(mixed.size); // 5

// ---------------------------------------------------------------------
// 15. Object values
// ---------------------------------------------------------------------

// Complex entities like objects can be stored directly as elements.
const user = { id: 1, name: "John" };
const usersSet = new Set();
usersSet.add(user);

console.log(usersSet.has(user)); // true

// ---------------------------------------------------------------------
// 16. Object values use reference identity
// ---------------------------------------------------------------------

// Object values are checked by reference equality, not structural equality.
const firstUser = { id: 1 };
const secondUser = { id: 1 };
const userSet = new Set();

userSet.add(firstUser);
console.log(userSet.has(firstUser)); // true
console.log(userSet.has(secondUser)); // false

// ---------------------------------------------------------------------
// 17. Duplicate object references
// ---------------------------------------------------------------------

// The exact same object reference cannot be added twice.
const sharedUser = { id: 1, name: "John" };
const duplicateReferences = new Set();

duplicateReferences.add(sharedUser);
duplicateReferences.add(sharedUser);

console.log(duplicateReferences.size); // 1

// ---------------------------------------------------------------------
// 18. Different objects with identical contents
// ---------------------------------------------------------------------

// Structurally identical objects stored separately are distinct Set members.
const objectA = { id: 1 };
const objectB = { id: 1 };
const objects = new Set([objectA, objectB]);

console.log(objects.size); // 2

// ---------------------------------------------------------------------
// 19. Function values
// ---------------------------------------------------------------------

// Functions are objects and can also be stored as Set items.
function calculateTotal() {
  return 100;
}

const functions = new Set();
functions.add(calculateTotal);

console.log(functions.has(calculateTotal)); // true

// ---------------------------------------------------------------------
// 20. SameValueZero equality
// ---------------------------------------------------------------------

// Sets use SameValueZero rules (`NaN` matches `NaN`, and `+0` equals `-0`).
const specialValues = new Set();
specialValues.add(NaN);
specialValues.add(0);
specialValues.add(-0);

console.log(specialValues.has(Number.NaN)); // true
console.log(specialValues.size); // 2

// ---------------------------------------------------------------------
// 21. Undefined is a valid Set value
// ---------------------------------------------------------------------

// `undefined` can explicitly exist as a stored element, distinct from absence.
const optionalValues = new Set();
optionalValues.add(undefined);

console.log(optionalValues.has(undefined)); // true
console.log(optionalValues.size); // 1

// ---------------------------------------------------------------------
// 22. Iterating with for...of
// ---------------------------------------------------------------------

// Loop through Set elements cleanly using `for...of`.
const colors = new Set(["red", "green", "blue"]);
for (const color of colors) {
  console.log(color);
}

// ---------------------------------------------------------------------
// 23. Iterating with values()
// ---------------------------------------------------------------------

// The `.values()` method provides an iterator over the Set's items.
const valuesSet = new Set(["JavaScript", "TypeScript", "React"]);
for (const value of valuesSet.values()) {
  console.log(value);
}

// ---------------------------------------------------------------------
// 24. keys() on a Set
// ---------------------------------------------------------------------

// Sets lack separate keys/values; `.keys()` exists for API symmetry with Maps.
for (const value of valuesSet.keys()) {
  console.log(value);
}

// ---------------------------------------------------------------------
// 25. entries() on a Set
// ---------------------------------------------------------------------

// `.entries()` yields `[value, value]` pairs for Map compatibility.
for (const [first, second] of valuesSet.entries()) {
  console.log(first, second);
}

// ---------------------------------------------------------------------
// 26. forEach()
// ---------------------------------------------------------------------

// Iterate over each item using the built-in `forEach()` callback method.
valuesSet.forEach((value) => {
  console.log(value);
});

// ---------------------------------------------------------------------
// 27. Converting a Set to an array
// ---------------------------------------------------------------------

// Use `Array.from()` or spread syntax to convert a Set into a standard array.
const tags = new Set(["javascript", "react", "typescript"]);
const tagArray = Array.from(tags);

console.log(Array.isArray(tagArray)); // true

// ---------------------------------------------------------------------
// 28. Set from a string
// ---------------------------------------------------------------------

// Strings are iterable, so passing one to a Set breaks it into unique characters.
const characters = new Set("hello");
console.log(characters.size); // 4 ("h", "e", "l", "o")

// ---------------------------------------------------------------------
// 29. Set from another Set
// ---------------------------------------------------------------------

// Passing an existing Set into the constructor creates an independent clone.
const original = new Set([1, 2, 3]);
const copy = new Set(original);

console.log(copy === original); // false

// ---------------------------------------------------------------------
// 30. Set is shallow with object values
// ---------------------------------------------------------------------

// Sets do not deep-clone stored objects; references are preserved.
const profile = { name: "John" };
const profileSet = new Set([profile]);
const [storedProfile] = profileSet;

storedProfile.name = "Jane";
console.log(profile.name); // "Jane" (shared reference)

// ---------------------------------------------------------------------
// 31. Removing duplicates from an array
// ---------------------------------------------------------------------

// Filter array duplicates while retaining original order via spread operator.
const duplicateTags = ["react", "javascript", "react", "typescript", "javascript"];
const uniqueTags = [...new Set(duplicateTags)];

console.log(uniqueTags);

// ---------------------------------------------------------------------
// 32. Checking array membership
// ---------------------------------------------------------------------

// Sets offer efficient membership checks compared to scanning arrays.
const allowedRoles = new Set(["admin", "editor", "moderator"]);
console.log(allowedRoles.has("editor")); // true

// ---------------------------------------------------------------------
// 33. Set versus Array
// ---------------------------------------------------------------------

// Arrays allow duplicate items and numeric indexes; Sets enforce uniqueness without indexes.
const setValues = new Set([1, 2, 2, 3]);
console.log(setValues.size); // 3

// ---------------------------------------------------------------------
// 34. No indexed access
// ---------------------------------------------------------------------

// Sets do not support direct bracket lookup like `set[0]`; convert to an array first if needed.
const numbersSet = new Set([10, 20, 30]);
console.log(numbersSet[0]); // undefined

// ---------------------------------------------------------------------
// 35. Set does not provide map/filter directly
// ---------------------------------------------------------------------

// Transform or filter Sets by spreading them into arrays first.
const numbersToTransform = new Set([1, 2, 3, 4]);
const doubledNumbers = [...numbersToTransform].map((n) => n * 2);

console.log(doubledNumbers); // [2, 4, 6, 8]

// ---------------------------------------------------------------------
// 36. Basic set operations
// ---------------------------------------------------------------------

// Combine multiple sets to produce a unique union.
const firstSet = new Set([1, 2, 3, 4]);
const secondSet = new Set([3, 4, 5, 6]);
const union = new Set([...firstSet, ...secondSet]);

console.log(union.size); // 6

// ---------------------------------------------------------------------
// 37. Set intersection
// ---------------------------------------------------------------------

// Find overlapping values present in both sets.
const available = new Set(["javascript", "typescript", "react"]);
const requested = new Set(["react", "vue", "typescript"]);
const common = new Set([...available].filter((val) => requested.has(val)));

console.log(common.size); // 2

// ---------------------------------------------------------------------
// 38. Set difference
// ---------------------------------------------------------------------

// Isolate elements existing in the first set but missing from the second.
const allPermissions = new Set(["read", "write", "delete"]);
const grantedPermissions = new Set(["read", "write"]);
const missingPermissions = new Set([...allPermissions].filter((p) => !grantedPermissions.has(p)));

console.log(missingPermissions); // Set(1) {"delete"}

// ---------------------------------------------------------------------
// 39. Updating a Set immutably
// ---------------------------------------------------------------------

// Create a copy before mutating to preserve the original Set's state.
const currentTags = new Set(["react", "javascript"]);
const nextTags = new Set(currentTags);
nextTags.add("typescript");

console.log(currentTags.size); // 2
console.log(nextTags.size); // 3

// ---------------------------------------------------------------------
// 40. Removing a value immutably
// ---------------------------------------------------------------------

// Safely delete elements without mutating the reference source.
const currentRoles = new Set(["admin", "editor", "viewer"]);
const nextRoles = new Set(currentRoles);
nextRoles.delete("viewer");

console.log(currentRoles.size); // 3
console.log(nextRoles.size); // 2

// ---------------------------------------------------------------------
// 41. React state with Set
// ---------------------------------------------------------------------

// When managing Sets in React state, always instantiate a new Set reference on update.
// Example pattern:
// setSelection((items) => {
//     const nextItems = new Set(items);
//     nextItems.add(id);
//     return nextItems;
// });

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Set` maintains a unique collection of elements across any data type.
// - `add()`, `has()`, and `delete()` provide clean element manipulation.
// - Duplicates are automatically discarded; insertion order is strictly preserved.
// - Objects and arrays check membership via reference identity.
// - Employs SameValueZero comparison guidelines.
// - Easily bridges with standard array operations via spread syntax or `Array.from()`.
// - Immutable update patterns ensure state management frameworks (like React) detect updates properly.
