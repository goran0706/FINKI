/**
 * Map
 * ===
 *
 * A `Map` is a collection of key-value pairs.
 *
 * Unlike ordinary objects, a `Map` is designed specifically for
 * key-value storage and allows keys of any JavaScript value type,
 * including objects, arrays, functions, and primitives.
 *
 * A `Map` preserves insertion order and provides dedicated methods
 * for adding, reading, checking, and removing entries.
 */

// ---------------------------------------------------------------------
// 1. Creating a Map
// ---------------------------------------------------------------------

// Initialize an empty Map using the `Map` constructor.
const users = new Map();

console.log(users); // Map(0) {}

// ---------------------------------------------------------------------
// 2. Adding entries with set()
// ---------------------------------------------------------------------

// Use `set()` to add key-value pairs to the Map.
const scores = new Map();
scores.set("javascript", 95);
scores.set("typescript", 90);
scores.set("react", 98);

console.log(scores);

// ---------------------------------------------------------------------
// 3. Reading values with get()
// ---------------------------------------------------------------------

// Retrieve values associated with specific keys using `get()`.
const userRoles = new Map();
userRoles.set("john", "admin");
userRoles.set("jane", "editor");

console.log(userRoles.get("john")); // "admin"
console.log(userRoles.get("jane")); // "editor"

// ---------------------------------------------------------------------
// 4. Missing keys
// ---------------------------------------------------------------------

// Calling `get()` on a non-existent key returns `undefined`.
const settings = new Map();
settings.set("theme", "dark");

console.log(settings.get("theme")); // "dark"
console.log(settings.get("language")); // undefined

// ---------------------------------------------------------------------
// 5. Checking keys with has()
// ---------------------------------------------------------------------

// Use `has()` to verify whether a key exists in the Map.
const permissions = new Map();
permissions.set("read", true);
permissions.set("write", false);

console.log(permissions.has("read")); // true
console.log(permissions.has("delete")); // false

// ---------------------------------------------------------------------
// 6. Keys can have any type
// ---------------------------------------------------------------------

// Map keys are not restricted to strings or symbols; any value type can be used.
const data = new Map();
data.set("name", "John");
data.set(1, "numeric key");
data.set(true, "boolean key");
data.set(null, "null key");
data.set(undefined, "undefined key");

console.log(data.get(1)); // "numeric key"

// ---------------------------------------------------------------------
// 7. Object keys
// ---------------------------------------------------------------------

// Complex data structures like objects can serve directly as Map keys.
const user = { id: 1, name: "John" };
const metadata = new Map();
metadata.set(user, { role: "admin", active: true });

console.log(metadata.get(user)); // { role: "admin", active: true }

// ---------------------------------------------------------------------
// 8. Object keys use reference identity
// ---------------------------------------------------------------------

// Object keys are compared by reference identity, not structural equality.
const firstUser = { id: 1 };
const secondUser = { id: 1 };
const userData = new Map();

userData.set(firstUser, "first");

console.log(userData.get(firstUser)); // "first"
console.log(userData.get(secondUser)); // undefined

// ---------------------------------------------------------------------
// 9. Function keys
// ---------------------------------------------------------------------

// Functions are objects and can also be used as Map keys.
function calculateTotal() {
  return 100;
}

const functionCache = new Map();
functionCache.set(calculateTotal, 100);

console.log(functionCache.get(calculateTotal)); // 100

// ---------------------------------------------------------------------
// 10. Initializing a Map with entries
// ---------------------------------------------------------------------

// Pass an iterable of two-element `[key, value]` pairs to the constructor.
const initialScores = new Map([
  ["javascript", 95],
  ["typescript", 90],
  ["react", 98],
]);

console.log(initialScores.get("react")); // 98

// ---------------------------------------------------------------------
// 11. Creating a Map from Object.entries()
// ---------------------------------------------------------------------

// Combine `Object.entries()` with `new Map()` to convert plain objects into Maps.
const userRolesObject = { john: "admin", jane: "editor", mark: "viewer" };
const userRolesMap = new Map(Object.entries(userRolesObject));

console.log(userRolesMap.get("john")); // "admin"

// ---------------------------------------------------------------------
// 12. Updating an existing key
// ---------------------------------------------------------------------

// Setting an already existing key overwrites its value rather than creating a duplicate entry.
const account = new Map();
account.set("status", "pending");
account.set("status", "active");

console.log(account.get("status")); // "active"
console.log(account.size); // 1

// ---------------------------------------------------------------------
// 13. set() returns the Map
// ---------------------------------------------------------------------

// Because `set()` returns the Map instance, method calls can be chained.
const preferences = new Map();
preferences.set("theme", "dark").set("language", "en").set("notifications", true);

console.log(preferences.size); // 3

// ---------------------------------------------------------------------
// 14. Removing entries with delete()
// ---------------------------------------------------------------------

// Use `delete()` to remove an entry; it returns `true` if successful or `false` if the key was missing.
const cache = new Map();
cache.set("user:1", { name: "John" });

console.log(cache.delete("user:1")); // true
console.log(cache.delete("missing")); // false

// ---------------------------------------------------------------------
// 15. Removing all entries with clear()
// ---------------------------------------------------------------------

// Empty the entire Map using `clear()`.
const temporaryData = new Map([
  ["a", 1],
  ["b", 2],
]);
temporaryData.clear();

console.log(temporaryData.size); // 0

// ---------------------------------------------------------------------
// 16. Getting the number of entries
// ---------------------------------------------------------------------

// Access the `.size` property (not a method) to check entry counts.
const products = new Map([
  ["laptop", 1200],
  ["phone", 800],
]);
console.log(products.size); // 2

// ---------------------------------------------------------------------
// 17. Map insertion order
// ---------------------------------------------------------------------

// Maps strictly preserve and iterate in insertion order.
const ordered = new Map();
ordered.set("first", 1);
ordered.set("second", 2);

for (const [key, value] of ordered) {
  console.log(key, value);
}

// ---------------------------------------------------------------------
// 18. Updating a key does not move it
// ---------------------------------------------------------------------

// Updating an existing key modifies its value while preserving its original position.
const order = new Map([
  ["first", 1],
  ["second", 2],
  ["third", 3],
]);
order.set("second", 20);

console.log(order.get("second")); // 20

// ---------------------------------------------------------------------
// 19. Deleting and re-adding a key
// ---------------------------------------------------------------------

// Re-adding a deleted key appends it to the end of the insertion order.
const reordered = new Map([
  ["first", 1],
  ["second", 2],
  ["third", 3],
]);
reordered.delete("second");
reordered.set("second", 20);

// ---------------------------------------------------------------------
// 20. Iterating over keys
// ---------------------------------------------------------------------

// Use `.keys()` to retrieve an iterator over all Map keys.
const languages = new Map([
  ["js", "JavaScript"],
  ["ts", "TypeScript"],
]);
for (const key of languages.keys()) {
  console.log(key);
}

// ---------------------------------------------------------------------
// 21. Iterating over values
// ---------------------------------------------------------------------

// Use `.values()` to retrieve an iterator over all Map values.
for (const language of languages.values()) {
  console.log(language);
}

// ---------------------------------------------------------------------
// 22. Iterating over entries
// ---------------------------------------------------------------------

// Use `.entries()` to retrieve an iterator containing `[key, value]` pairs.
for (const [key, value] of languages.entries()) {
  console.log(key, value);
}

// ---------------------------------------------------------------------
// 23. Default Map iteration
// ---------------------------------------------------------------------

// A Map's default iterator evaluates to its `.entries()` iterator.
for (const [key, value] of languages) {
  console.log(key, value);
}

// ---------------------------------------------------------------------
// 24. forEach()
// ---------------------------------------------------------------------

// Map's `forEach()` callback receives the value first and the key second.
languages.forEach((value, key) => {
  console.log(key, value);
});

// ---------------------------------------------------------------------
// 25. Converting a Map to an array
// ---------------------------------------------------------------------

// Convert Map entries into an array using spread syntax.
const languageEntries = [...languages];
console.log(Array.isArray(languageEntries)); // true

// ---------------------------------------------------------------------
// 26. Converting a Map to an object
// ---------------------------------------------------------------------

// Transform a Map into a plain object using `Object.fromEntries()`.
const languageObject = Object.fromEntries(languages);
console.log(languageObject.js); // "JavaScript"

// ---------------------------------------------------------------------
// 27. Converting an object to a Map
// ---------------------------------------------------------------------

// Convert plain objects into Maps by wrapping `Object.entries()`.
const configuration = { host: "localhost", port: 3000 };
const configurationMap = new Map(Object.entries(configuration));

console.log(configurationMap.get("host")); // "localhost"

// ---------------------------------------------------------------------
// 28. Map versus object keys
// ---------------------------------------------------------------------

// Maps preserve actual key types, whereas plain objects coerce keys to strings.
const object = {};
const map = new Map();

object[1] = "one";
map.set(1, "one");

console.log(map.get(1)); // "one"

// ---------------------------------------------------------------------
// 29. Distinct object keys
// ---------------------------------------------------------------------

// Separate object references remain distinct keys within a Map.
const objectKeyA = {};
const objectKeyB = {};
const objectKeyMap = new Map();

objectKeyMap.set(objectKeyA, "A");
objectKeyMap.set(objectKeyB, "B");

console.log(objectKeyMap.size); // 2

// ---------------------------------------------------------------------
// 30. SameValueZero key equality
// ---------------------------------------------------------------------

// Maps use SameValueZero equality, meaning `NaN` matches `NaN` and `+0` equals `-0`.
const specialKeys = new Map();
specialKeys.set(NaN, "not a number");

console.log(specialKeys.get(NaN)); // "not a number"
console.log(specialKeys.get(Number.NaN)); // "not a number"

// ---------------------------------------------------------------------
// 31. Map values can be undefined
// ---------------------------------------------------------------------

// A stored `undefined` value does not mean the key is missing; use `has()` to verify.
const optionalValues = new Map();
optionalValues.set("value", undefined);

console.log(optionalValues.get("value")); // undefined
console.log(optionalValues.has("value")); // true

// ---------------------------------------------------------------------
// 32. Map values can be any type
// ---------------------------------------------------------------------

// Map values have no type restrictions and can store any JavaScript data type.
const mixed = new Map();
mixed.set("number", 42);
mixed.set("object", { active: true });

console.log(mixed.get("number")); // 42

// ---------------------------------------------------------------------
// 33. Map with object values
// ---------------------------------------------------------------------

// Maps store references to objects without deep-cloning them.
const userCache = new Map();
const cachedUser = { id: 1, name: "John" };

userCache.set(1, cachedUser);
console.log(userCache.get(1) === cachedUser); // true

// ---------------------------------------------------------------------
// 34. Updating an object stored in a Map
// ---------------------------------------------------------------------

// Updating stored objects requires explicit immutable replacement strategies.
const session = new Map();
const sessionUser = { id: 1, name: "John" };

session.set("user", sessionUser);
const updatedSessionUser = { ...session.get("user"), name: "Jane" };
session.set("user", updatedSessionUser);

console.log(session.get("user").name); // "Jane"

// ---------------------------------------------------------------------
// 35. Nested Maps
// ---------------------------------------------------------------------

// Maps can contain other Maps as keys or values for nested data structures.
const usersByRole = new Map([
  [
    "admin",
    new Map([
      [1, "John"],
      [2, "Jane"],
    ]),
  ],
]);

console.log(usersByRole.get("admin").get(1)); // "John"

// ---------------------------------------------------------------------
// 36. Map with arrays as keys
// ---------------------------------------------------------------------

// Arrays used as keys are evaluated by reference identity rather than contents.
const coordinates = new Map();
const point = [10, 20];

coordinates.set(point, "location");
console.log(coordinates.get(point)); // "location"
console.log(coordinates.get([10, 20])); // undefined

// ---------------------------------------------------------------------
// 37. Map size versus object property count
// ---------------------------------------------------------------------

// Maps provide a direct `.size` property instead of requiring helper methods like `Object.keys().length`.
const mapData = new Map([
  ["a", 1],
  ["b", 2],
]);
console.log(mapData.size); // 2

// ---------------------------------------------------------------------
// 38. Map is not JSON data
// ---------------------------------------------------------------------

// Maps cannot be serialized directly to JSON via `JSON.stringify()`; convert via `Object.fromEntries()` first.
const mapToSerialize = new Map([
  ["name", "John"],
  ["age", 30],
]);
const serializableObject = Object.fromEntries(mapToSerialize);

console.log(JSON.stringify(serializableObject));

// ---------------------------------------------------------------------
// 39. Map for keyed lookup
// ---------------------------------------------------------------------

// Maps are optimized for efficient keyed lookups across custom key types.
const usersById = new Map([
  [101, { name: "John" }],
  [102, { name: "Jane" }],
]);
console.log(usersById.get(102).name); // "Jane"

// ---------------------------------------------------------------------
// 40. Map and React
// ---------------------------------------------------------------------

// When storing Maps in React state, construct a new Map reference on update to trigger component re-renders.
// Example pattern:
// setUsers((users) => {
//     const nextUsers = new Map(users);
//     nextUsers.set(103, { name: "Mark" });
//     return nextUsers;
// });

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Map` stores key-value pairs supporting any JavaScript type as a key.
// - `set()`, `get()`, `has()`, and `delete()` provide robust entry manipulation.
// - `.size` tracks total items directly.
// - Iteration strictly preserves insertion order.
// - Objects and arrays as keys rely on reference identity comparison.
// - Utilizes SameValueZero equality rules.
// - Integrates smoothly with object conversion tools (`Object.fromEntries()`).
