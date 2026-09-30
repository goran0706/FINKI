/**
 * Object.keys
 * ===========
 *
 * `Object.keys()` returns an array containing the enumerable own
 * property names of an object.
 *
 * It is commonly used when the keys of an object need to be inspected,
 * iterated over, counted, or transformed into another data structure.
 */

// ---------------------------------------------------------------------
// 1. Getting an object's keys
// ---------------------------------------------------------------------

// `Object.keys()` returns an array of an object's enumerable own property names without modifying the original object.
const user = { name: "John", age: 30, active: true };
const keys = Object.keys(user);

console.log(keys); // ["name", "age", "active"]
console.log(Array.isArray(keys)); // true

// ---------------------------------------------------------------------
// 2. Empty objects
// ---------------------------------------------------------------------

// An object with no enumerable own properties produces an empty array.
const emptyObject = {};
const keysOfEmptyObject = Object.keys(emptyObject);

console.log(keysOfEmptyObject); // []

// ---------------------------------------------------------------------
// 3. Property names are strings
// ---------------------------------------------------------------------

// `Object.keys()` always returns property names as strings, even if defined with numeric-looking keys.
const product = { 101: "Item", name: "Laptop", price: 1200 };
const productKeys = Object.keys(product);

productKeys.forEach((key) => {
  console.log(typeof key, key);
});

// ---------------------------------------------------------------------
// 4. Accessing values through the keys
// ---------------------------------------------------------------------

// Use dynamic bracket notation to access property values using their keys.
const account = { username: "john", role: "admin", active: true };
const accountKeys = Object.keys(account);

accountKeys.forEach((key) => {
  console.log(key, account[key]);
});

// ---------------------------------------------------------------------
// 5. Iterating over an object
// ---------------------------------------------------------------------

// `Object.keys()` provides the iterable array needed for `for...of` loops.
const scores = { javascript: 95, typescript: 90, react: 98 };

for (const key of Object.keys(scores)) {
  console.log(`${key}: ${scores[key]}`);
}

// ---------------------------------------------------------------------
// 6. Counting properties
// ---------------------------------------------------------------------

// Count enumerable own properties by checking the length of the keys array.
const settings = { theme: "dark", language: "en", notifications: true };
const propertyCount = Object.keys(settings).length;

console.log(propertyCount); // 3

// ---------------------------------------------------------------------
// 7. Checking whether an object has properties
// ---------------------------------------------------------------------

// Verify if an object contains any enumerable properties.
const preferences = { theme: "dark" };
const hasProperties = Object.keys(preferences).length > 0;
const hasNoProperties = Object.keys({}).length > 0;

console.log(hasProperties); // true
console.log(hasNoProperties); // false

// ---------------------------------------------------------------------
// 8. Checking for a specific key
// ---------------------------------------------------------------------

// Check inclusion within keys (though `Object.hasOwn()` is often more efficient for existence checks).
const profile = { name: "John", email: "john@example.com" };
const hasEmail = Object.keys(profile).includes("email");

console.log(hasEmail); // true

// ---------------------------------------------------------------------
// 9. Object.keys() and inherited properties
// ---------------------------------------------------------------------

// `Object.keys()` returns only own properties, excluding inherited properties.
const parent = { inheritedValue: 42 };
const child = Object.create(parent);
child.ownValue = 10;

console.log(Object.keys(child)); // ["ownValue"]

// ---------------------------------------------------------------------
// 10. Non-enumerable properties
// ---------------------------------------------------------------------

// `Object.keys()` explicitly excludes non-enumerable properties.
const object = { visible: true };
Object.defineProperty(object, "hidden", { value: false, enumerable: false });

console.log(Object.keys(object)); // ["visible"]

// ---------------------------------------------------------------------
// 11. Enumerable properties
// ---------------------------------------------------------------------

// Enumerability determines whether an own property appears in `Object.keys()`.
const data = {};
Object.defineProperty(data, "id", { value: 1, enumerable: true });
Object.defineProperty(data, "secret", { value: "hidden", enumerable: false });

console.log(Object.keys(data)); // ["id"]

// ---------------------------------------------------------------------
// 12. Symbols are not returned
// ---------------------------------------------------------------------

// Symbol-keyed properties are omitted from `Object.keys()`.
const symbolKey = Symbol("id");
const record = { name: "John", [symbolKey]: 123 };

console.log(Object.keys(record)); // ["name"]

// ---------------------------------------------------------------------
// 13. Integer-indexed property ordering
// ---------------------------------------------------------------------

// Integer-index-like keys are sorted in ascending numeric order, followed by other string keys in creation order.
const values = { 2: "two", 1: "one", 3: "three", name: "John" };
console.log(Object.keys(values)); // ["1", "2", "3", "name"]

// ---------------------------------------------------------------------
// 14. Object.keys() does not mutate the object
// ---------------------------------------------------------------------

// The returned array is independent; mutating it does not affect the source object.
const original = { name: "John", age: 30 };
const originalKeys = Object.keys(original);
originalKeys.push("email");

console.log(Object.keys(original)); // ["name", "age"]

// ---------------------------------------------------------------------
// 15. Transforming object keys
// ---------------------------------------------------------------------

// Combine `Object.keys()` with array methods like `map()` to transform keys.
const prices = { laptop: 1200, phone: 800, tablet: 600 };
const upperCaseKeys = Object.keys(prices).map((key) => key.toUpperCase());

console.log(upperCaseKeys); // ["LAPTOP", "PHONE", "TABLET"]

// ---------------------------------------------------------------------
// 16. Filtering object keys
// ---------------------------------------------------------------------

// Filter out specific keys using array `filter()`.
const userData = {
  name: "John",
  age: 30,
  password: "secret",
  email: "john@example.com",
};
const publicKeys = Object.keys(userData).filter((key) => key !== "password");

console.log(publicKeys); // ["name", "age", "email"]

// ---------------------------------------------------------------------
// 17. Creating an object from selected keys
// ---------------------------------------------------------------------

// Reconstruct filtered objects using `Object.fromEntries()` and key filtering.
const userRecord = {
  id: 1,
  name: "John",
  email: "john@example.com",
  role: "admin",
};
const allowedKeys = ["id", "name"];

const selectedUser = Object.fromEntries(
  Object.keys(userRecord)
    .filter((key) => allowedKeys.includes(key))
    .map((key) => [key, userRecord[key]]),
);

console.log(selectedUser); // { id: 1, name: "John" }

// ---------------------------------------------------------------------
// 18. Mapping keys to values
// ---------------------------------------------------------------------

// Map keys into structured key-value object representations.
const configuration = { host: "localhost", port: 3000, secure: false };
const entries = Object.keys(configuration).map((key) => ({
  key,
  value: configuration[key],
}));

console.log(entries);

// ---------------------------------------------------------------------
// 19. Comparing object key sets
// ---------------------------------------------------------------------

// Compare whether two objects share identical own keys.
const first = { name: "John", age: 30 };
const second = { age: 25, name: "Jane" };
const firstKeys = Object.keys(first);
const secondKeys = Object.keys(second);

const sameKeys = firstKeys.length === secondKeys.length && firstKeys.every((key) => Object.hasOwn(second, key));

console.log(sameKeys); // true

// ---------------------------------------------------------------------
// 20. Object.keys() with null and undefined
// ---------------------------------------------------------------------

// `Object.keys()` throws a TypeError if passed null or undefined.
// Ensure inputs are valid objects before calling.
console.log(Object.keys({})); // []

// ---------------------------------------------------------------------
// 21. Primitive values
// ---------------------------------------------------------------------

// Primitive values are boxed temporarily; strings expose character indexes, while numbers/booleans yield empty arrays.
console.log(Object.keys("hello")); // ["0", "1", "2", "3", "4"]
console.log(Object.keys(42)); // []
console.log(Object.keys(true)); // []

// ---------------------------------------------------------------------
// 22. Object.keys() and arrays
// ---------------------------------------------------------------------

// Arrays are objects, so `Object.keys()` returns their string index keys.
const colors = ["red", "green", "blue"];
console.log(Object.keys(colors)); // ["0", "1", "2"]

// ---------------------------------------------------------------------
// 23. Object.keys() and sparse arrays
// ---------------------------------------------------------------------

// Empty array slots in sparse arrays are ignored because they lack enumerable properties.
const sparseArray = [];
sparseArray[0] = "first";
sparseArray[2] = "third";

console.log(Object.keys(sparseArray)); // ["0", "2"]

// ---------------------------------------------------------------------
// 24. Object.keys() versus `for...in`
// ---------------------------------------------------------------------

// `for...in` includes inherited properties, whereas `Object.keys()` only returns own properties.
const prototype = { inherited: true };
const item = Object.create(prototype);
item.own = true;

console.log(Object.keys(item)); // ["own"]

// ---------------------------------------------------------------------
// 25. Object.keys() versus Object.values()
// ---------------------------------------------------------------------

// `Object.keys()` yields property names; `Object.values()` yields property values.
const metrics = { users: 100, posts: 250 };
console.log(Object.keys(metrics)); // ["users", "posts"]
console.log(Object.values(metrics)); // [100, 250]

// ---------------------------------------------------------------------
// 26. Object.keys() versus Object.entries()
// ---------------------------------------------------------------------

// `Object.entries()` returns both keys and values as nested pairs.
const dimensions = { width: 800, height: 600 };
console.log(Object.entries(dimensions)); // [["width", 800], ["height", 600]]

// ---------------------------------------------------------------------
// 27. React-style object iteration
// ---------------------------------------------------------------------

// Transform dictionary-style objects into arrays of objects for UI rendering.
const fieldErrors = {
  username: "Username is required",
  email: "Invalid email",
};
const errorMessages = Object.keys(fieldErrors).map((field) => ({
  field,
  message: fieldErrors[field],
}));

console.log(errorMessages);

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Object.keys(object)` returns an array of enumerable own property names as strings.
// - Inherited properties, non-enumerable properties, and symbol keys are excluded.
// - Integer-indexed keys are sorted numerically.
// - It integrates seamlessly with array methods (`map`, `filter`, `every`) for powerful transformations.
// - Compare with `Object.values()` and `Object.entries()` for values or pairs.
