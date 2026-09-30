/**
 * Object.entries
 * ==============
 *
 * `Object.entries()` returns an array containing the enumerable own
 * property key-value pairs of an object.
 *
 * Each entry is represented as a two-element array:
 * `[key, value]`.
 *
 * It is useful when both the property name and its value are needed
 * while iterating, filtering, transforming, or reconstructing objects.
 */

// ---------------------------------------------------------------------
// 1. Getting an object's entries
// ---------------------------------------------------------------------

// `Object.entries()` returns a new array of enumerable own `[key, value]` pairs without modifying the source object.
const user = { name: "John", age: 30, active: true };
const entries = Object.entries(user);

console.log(entries);

// ---------------------------------------------------------------------
// 2. Empty objects
// ---------------------------------------------------------------------

// An object with no enumerable own properties produces an empty array.
const emptyObject = {};
const emptyEntries = Object.entries(emptyObject);

console.log(emptyEntries); // []

// ---------------------------------------------------------------------
// 3. Each entry contains a key and a value
// ---------------------------------------------------------------------

// Each entry is a two-element array where index 0 is the property key and index 1 is the value.
const product = { id: 101, name: "Laptop", price: 1200 };
const productEntries = Object.entries(product);
const firstEntry = productEntries[0];

console.log(firstEntry); // ["id", 101]
console.log(firstEntry[0]); // "id"
console.log(firstEntry[1]); // 101

// ---------------------------------------------------------------------
// 4. Destructuring entries
// ---------------------------------------------------------------------

// Use array destructuring in loops for concise key-value iteration.
const account = { username: "john", role: "admin", active: true };

for (const [key, value] of Object.entries(account)) {
  console.log(key, value);
}

// ---------------------------------------------------------------------
// 5. Iterating with forEach()
// ---------------------------------------------------------------------

// Combine `Object.entries()` with `forEach()` for array-style functional iteration.
const scores = { javascript: 95, typescript: 90, react: 98 };

Object.entries(scores).forEach(([language, score]) => {
  console.log(`${language}: ${score}`);
});

// ---------------------------------------------------------------------
// 6. Filtering entries
// ---------------------------------------------------------------------

// Filter entries using array `filter()` when conditions depend on both keys and values.
const prices = { laptop: 1200, phone: 800, tablet: 600 };
const expensiveItems = Object.entries(prices).filter(([, price]) => price >= 800);

console.log(expensiveItems);

// ---------------------------------------------------------------------
// 7. Transforming entries
// ---------------------------------------------------------------------

// Transform entries using array `map()` to reshape both keys and values.
const quantities = { apples: 5, oranges: 3, bananas: 7 };
const doubledEntries = Object.entries(quantities).map(([fruit, quantity]) => [fruit, quantity * 2]);

console.log(doubledEntries);

// ---------------------------------------------------------------------
// 8. Converting entries back to an object
// ---------------------------------------------------------------------

// Combine `Object.entries()` and `Object.fromEntries()` to transform data while preserving keys.
const originalPrices = { laptop: 1000, phone: 500, tablet: 700 };
const discountedPrices = Object.fromEntries(Object.entries(originalPrices).map(([name, price]) => [name, price * 0.9]));

console.log(discountedPrices);

// ---------------------------------------------------------------------
// 9. Selecting entries
// ---------------------------------------------------------------------

// Filter out specific properties by selecting entries and converting back with `Object.fromEntries()`.
const userData = {
  id: 1,
  name: "John",
  email: "john@example.com",
  password: "secret",
};
const publicUser = Object.fromEntries(Object.entries(userData).filter(([key]) => key !== "password"));

console.log(publicUser);

// ---------------------------------------------------------------------
// 10. Renaming a property
// ---------------------------------------------------------------------

// Modify property keys dynamically during entry transformation.
const userRecord = { id: 1, name: "John" };
const renamedUser = Object.fromEntries(
  Object.entries(userRecord).map(([key, value]) => [key === "name" ? "displayName" : key, value]),
);

console.log(renamedUser);

// ---------------------------------------------------------------------
// 11. Transforming keys and values
// ---------------------------------------------------------------------

// Simultaneously transform both keys and values using entry mapping.
const settings = { theme: "dark", language: "en" };
const normalizedSettings = Object.fromEntries(
  Object.entries(settings).map(([key, value]) => [key.toUpperCase(), String(value).toUpperCase()]),
);

console.log(normalizedSettings);

// ---------------------------------------------------------------------
// 12. Finding an entry
// ---------------------------------------------------------------------

// Locate a specific entry using array `find()`.
const permissions = { read: true, write: false, delete: false };
const firstDisabledPermission = Object.entries(permissions).find(([, enabled]) => enabled === false);

console.log(firstDisabledPermission); // ["write", false]

// ---------------------------------------------------------------------
// 13. Checking whether an entry matches
// ---------------------------------------------------------------------

// Check if any entry matches a condition using array `some()`.
const featureFlags = { search: true, dashboard: true, reports: false };
const hasDisabledFeature = Object.entries(featureFlags).some(([, enabled]) => enabled === false);

console.log(hasDisabledFeature); // true

// ---------------------------------------------------------------------
// 14. Checking every entry
// ---------------------------------------------------------------------

// Validate that all entries meet a criteria using array `every()`.
const enabledFeatures = { search: true, dashboard: true, reports: true };
const allFeaturesEnabled = Object.entries(enabledFeatures).every(([, enabled]) => enabled === true);

console.log(allFeaturesEnabled); // true

// ---------------------------------------------------------------------
// 15. Reducing entries
// ---------------------------------------------------------------------

// Aggregate entry data using array `reduce()`.
const monthlySales = { january: 1200, february: 1500, march: 1800 };
const totalSales = Object.entries(monthlySales).reduce((total, [, sales]) => total + sales, 0);

console.log(totalSales); // 4500

// ---------------------------------------------------------------------
// 16. Building a Map
// ---------------------------------------------------------------------

// Pass `Object.entries()` output directly to the `Map` constructor.
const userRoles = { john: "admin", jane: "editor", mark: "viewer" };
const roleMap = new Map(Object.entries(userRoles));

console.log(roleMap.get("john")); // "admin"

// ---------------------------------------------------------------------
// 17. Building an object from a Map
// ---------------------------------------------------------------------

// Convert a `Map` back to a plain object using `Object.fromEntries()`.
const map = new Map([
  ["name", "John"],
  ["age", 30],
]);
const objectFromMap = Object.fromEntries(map);

console.log(objectFromMap);

// ---------------------------------------------------------------------
// 18. Property keys are strings
// ---------------------------------------------------------------------

// Property keys in entries are always returned as strings; symbol keys are excluded.
const values = { 1: "one", 2: "two" };
const valueEntries = Object.entries(values);

console.log(typeof valueEntries[0][0]); // "string"

// ---------------------------------------------------------------------
// 19. Property ordering
// ---------------------------------------------------------------------

// Integer-index-like keys are sorted numerically first, followed by creation order for other string keys.
const orderedObject = { 2: "two", 1: "one", 3: "three", name: "John" };
console.log(Object.entries(orderedObject));

// ---------------------------------------------------------------------
// 20. Non-enumerable properties
// ---------------------------------------------------------------------

// Non-enumerable own properties are excluded from `Object.entries()`.
const object = { visible: "shown" };
Object.defineProperty(object, "hidden", {
  value: "not shown",
  enumerable: false,
});

console.log(Object.entries(object)); // [["visible", "shown"]]

// ---------------------------------------------------------------------
// 21. Inherited properties
// ---------------------------------------------------------------------

// Inherited properties are excluded; only enumerable own properties appear.
const parent = { inheritedValue: 42 };
const child = Object.create(parent);
child.ownValue = 10;

console.log(Object.entries(child)); // [["ownValue", 10]]

// ---------------------------------------------------------------------
// 22. Symbol-keyed properties
// ---------------------------------------------------------------------

// Symbol-keyed properties are omitted from `Object.entries()`.
const symbolKey = Symbol("id");
const record = { name: "John", [symbolKey]: 123 };

console.log(Object.entries(record)); // [["name", "John"]]

// ---------------------------------------------------------------------
// 23. Object.entries() does not mutate the object
// ---------------------------------------------------------------------

// The returned entry arrays are independent; mutating them does not update the source object.
const original = { name: "John", age: 30 };
const originalEntries = Object.entries(original);
originalEntries[0][1] = "Jane";

console.log(original.name); // "John"

// ---------------------------------------------------------------------
// 24. Object values that are objects remain references
// ---------------------------------------------------------------------

// Nested objects inside entries remain shared references and are not deep-copied.
const address = { city: "London" };
const userProfile = { name: "John", address };
const profileEntries = Object.entries(userProfile);

profileEntries[1][1].city = "Paris";
console.log(userProfile.address.city); // "Paris" (shared mutation)

// ---------------------------------------------------------------------
// 25. Object.entries() and arrays
// ---------------------------------------------------------------------

// Arrays are objects, so `Object.entries()` returns their index keys alongside their values.
const colors = ["red", "green", "blue"];
console.log(Object.entries(colors));

// ---------------------------------------------------------------------
// 26. Object.entries() and sparse arrays
// ---------------------------------------------------------------------

// Empty slots in sparse arrays lack enumerable properties and are omitted.
const sparseArray = [];
sparseArray[0] = "first";
sparseArray[2] = "third";

console.log(Object.entries(sparseArray)); // [["0", "first"], ["2", "third"]]

// ---------------------------------------------------------------------
// 27. Primitive values
// ---------------------------------------------------------------------

// Primitive values are temporarily boxed; strings expose character indexes, while numbers/booleans yield empty arrays.
console.log(Object.entries("hello"));
console.log(Object.entries(42)); // []
console.log(Object.entries(true)); // []

// ---------------------------------------------------------------------
// 28. Null and undefined
// ---------------------------------------------------------------------

// Passing `null` or `undefined` throws a TypeError; guard inputs accordingly.
// Object.entries(null); // TypeError

// ---------------------------------------------------------------------
// 29. Object.entries() versus Object.keys()
// ---------------------------------------------------------------------

// `Object.keys()` returns property names; `Object.entries()` returns both names and values as pairs.
const accountData = { username: "john", role: "admin", active: true };
console.log(Object.keys(accountData)); // ["username", "role", "active"]
console.log(Object.entries(accountData)); // [["username", "john"], ["role", "admin"], ["active", true]]

// ---------------------------------------------------------------------
// 30. Object.entries() versus Object.values()
// ---------------------------------------------------------------------

// `Object.values()` returns only values, whereas `Object.entries()` returns key-value pairs.
const metrics = { users: 100, posts: 250, comments: 500 };
console.log(Object.values(metrics)); // [100, 250, 500]
console.log(Object.entries(metrics)); // [["users", 100], ["posts", 250], ["comments", 500]]

// ---------------------------------------------------------------------
// 31. React-style object data
// ---------------------------------------------------------------------

// Transform dictionary objects into element arrays for rendering UI collections.
const fieldErrors = {
  username: "Username is required",
  email: "Invalid email address",
};
const errorMessages = Object.entries(fieldErrors).map(([field, message]) => ({
  field,
  message,
}));

console.log(errorMessages);

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Object.entries(object)` returns an array of `[key, value]` pairs for enumerable own properties.
// - Keys are strings; symbol-keyed, non-enumerable, and inherited properties are excluded.
// - The returned arrays are new instances, but nested object/array values remain shared references.
// - Integrates smoothly with array methods like `map()`, `filter()`, `find()`, `some()`, `every()`, and `reduce()`.
// - Combine with `Object.fromEntries()` to reconstruct or transform objects.
// - Essential when both property names and values must be processed together.
