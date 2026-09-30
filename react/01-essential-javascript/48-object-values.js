/**
 * Object.values
 * =============
 *
 * `Object.values()` returns an array containing the enumerable own
 * property values of an object.
 *
 * It is useful when the property names are not needed and the values
 * themselves need to be inspected, iterated over, counted, filtered,
 * or transformed.
 */

// ---------------------------------------------------------------------
// 1. Getting an object's values
// ---------------------------------------------------------------------

// `Object.values()` returns a new array of enumerable own property values without modifying the original object.
const user = { name: "John", age: 30, active: true };
const values = Object.values(user);

console.log(values); // ["John", 30, true]
console.log(Array.isArray(values)); // true

// ---------------------------------------------------------------------
// 2. Empty objects
// ---------------------------------------------------------------------

// An object with no enumerable own properties produces an empty array.
const emptyObject = {};
const valuesOfEmptyObject = Object.values(emptyObject);

console.log(valuesOfEmptyObject); // []

// ---------------------------------------------------------------------
// 3. Values can have different types
// ---------------------------------------------------------------------

// Resulting arrays can contain mixed data types matching the object's property values.
const product = { id: 101, name: "Laptop", price: 1200, available: true };
const productValues = Object.values(product);

console.log(productValues); // [101, "Laptop", 1200, true]

// ---------------------------------------------------------------------
// 4. Iterating over values
// ---------------------------------------------------------------------

// Iterate directly over values using `for...of` when property names are irrelevant.
const scores = { javascript: 95, typescript: 90, react: 98 };

for (const score of Object.values(scores)) {
  console.log(score);
}

// ---------------------------------------------------------------------
// 5. Counting values
// ---------------------------------------------------------------------

// Count the total number of enumerable own properties via array length.
const settings = { theme: "dark", language: "en", notifications: true };
const valueCount = Object.values(settings).length;

console.log(valueCount); // 3

// ---------------------------------------------------------------------
// 6. Checking whether any value matches a condition
// ---------------------------------------------------------------------

// Use array methods like `some()` directly on the returned values array.
const permissions = { read: true, write: false, delete: false };
const canModify = Object.values(permissions).some((p) => p === true);

console.log(canModify); // true

// ---------------------------------------------------------------------
// 7. Checking whether every value matches a condition
// ---------------------------------------------------------------------

// Use array `every()` to validate if all values satisfy a given condition.
const featureFlags = { search: true, dashboard: true, reports: true };
const allEnabled = Object.values(featureFlags).every((enabled) => enabled === true);

console.log(allEnabled); // true

// ---------------------------------------------------------------------
// 8. Filtering values
// ---------------------------------------------------------------------

// Filter values using array `filter()` based on specific predicates.
const prices = { laptop: 1200, phone: 800, tablet: 600 };
const expensivePrices = Object.values(prices).filter((price) => price >= 800);

console.log(expensivePrices); // [1200, 800]

// ---------------------------------------------------------------------
// 9. Transforming values
// ---------------------------------------------------------------------

// Transform values using array `map()` (keys are intentionally omitted).
const quantities = { apples: 5, oranges: 3, bananas: 7 };
const doubledQuantities = Object.values(quantities).map((q) => q * 2);

console.log(doubledQuantities); // [10, 6, 14]

// ---------------------------------------------------------------------
// 10. Summing numeric values
// ---------------------------------------------------------------------

// Aggregate numeric object values using array `reduce()`.
const monthlySales = { january: 1200, february: 1500, march: 1800 };
const totalSales = Object.values(monthlySales).reduce((total, sales) => total + sales, 0);

console.log(totalSales); // 4500

// ---------------------------------------------------------------------
// 11. Finding a value
// ---------------------------------------------------------------------

// Locate the first matching value using array `find()`.
const users = { first: "John", second: "Jane", third: "Mark" };
const foundName = Object.values(users).find((name) => name.startsWith("J"));

console.log(foundName); // "John"

// ---------------------------------------------------------------------
// 12. Checking whether an object contains a value
// ---------------------------------------------------------------------

// Check for specific value inclusion using `includes()`.
const roles = { admin: "administrator", editor: "editor", viewer: "viewer" };
const hasEditorRole = Object.values(roles).includes("editor");

console.log(hasEditorRole); // true

// ---------------------------------------------------------------------
// 13. Values are returned in property order
// ---------------------------------------------------------------------

// Integer-index-like keys are ordered numerically first, followed by creation order for other string keys.
const valuesByKey = { 2: "two", 1: "one", 3: "three", name: "John" };
console.log(Object.values(valuesByKey)); // ["one", "two", "three", "John"]

// ---------------------------------------------------------------------
// 14. Non-enumerable properties
// ---------------------------------------------------------------------

// `Object.values()` explicitly excludes non-enumerable properties.
const object = { visible: "shown" };
Object.defineProperty(object, "hidden", {
  value: "not shown",
  enumerable: false,
});

console.log(Object.values(object)); // ["shown"]

// ---------------------------------------------------------------------
// 15. Inherited properties
// ---------------------------------------------------------------------

// Inherited properties are excluded; only own properties are returned.
const parent = { inheritedValue: 42 };
const child = Object.create(parent);
child.ownValue = 10;

console.log(Object.values(child)); // [10]

// ---------------------------------------------------------------------
// 16. Symbol-keyed properties
// ---------------------------------------------------------------------

// Symbol-keyed properties are omitted from `Object.values()`.
const symbolKey = Symbol("id");
const record = { name: "John", [symbolKey]: 123 };

console.log(Object.values(record)); // ["John"]

// ---------------------------------------------------------------------
// 17. Object.values() does not mutate the object
// ---------------------------------------------------------------------

// The returned array is independent; mutations to it do not impact the source object.
const original = { name: "John", age: 30 };
const originalValues = Object.values(original);
originalValues.push("extra");

console.log(Object.values(original)); // ["John", 30]

// ---------------------------------------------------------------------
// 18. Object.values() and object references
// ---------------------------------------------------------------------

// Inner objects inside the values remain shared references and are not cloned.
const address = { city: "London" };
const userProfile = { name: "John", address };
const profileValues = Object.values(userProfile);

profileValues[1].city = "Paris";
console.log(userProfile.address.city); // "Paris" (shared mutation)

// ---------------------------------------------------------------------
// 19. Object.values() and arrays
// ---------------------------------------------------------------------

// Arrays are objects, so their enumerable index values are returned.
const colors = ["red", "green", "blue"];
console.log(Object.values(colors)); // ["red", "green", "blue"]

// ---------------------------------------------------------------------
// 20. Object.values() and sparse arrays
// ---------------------------------------------------------------------

// Empty slots in sparse arrays lack enumerable properties and are ignored.
const sparseArray = [];
sparseArray[0] = "first";
sparseArray[2] = "third";

console.log(Object.values(sparseArray)); // ["first", "third"]

// ---------------------------------------------------------------------
// 21. Primitive values
// ---------------------------------------------------------------------

// Primitive values are temporarily boxed; strings expose character indexes, while numbers and booleans return empty arrays.
console.log(Object.values("hello")); // ["h", "e", "l", "l", "o"]
console.log(Object.values(42)); // []
console.log(Object.values(true)); // []

// ---------------------------------------------------------------------
// 22. Null and undefined
// ---------------------------------------------------------------------

// Passing `null` or `undefined` throws a TypeError; guard inputs accordingly.
// Object.values(null); // TypeError

// ---------------------------------------------------------------------
// 23. Object.values() versus Object.keys()
// ---------------------------------------------------------------------

// `Object.keys()` yields property names; `Object.values()` yields property values.
const account = { username: "john", role: "admin", active: true };
console.log(Object.keys(account)); // ["username", "role", "active"]
console.log(Object.values(account)); // ["john", "admin", true]

// ---------------------------------------------------------------------
// 24. Object.values() versus Object.entries()
// ---------------------------------------------------------------------

// `Object.entries()` returns both keys and values as pairs, unlike `Object.values()`.
const dimensions = { width: 800, height: 600 };
console.log(Object.values(dimensions)); // [800, 600]
console.log(Object.entries(dimensions)); // [["width", 800], ["height", 600]]

// ---------------------------------------------------------------------
// 25. Reconstructing an object after transforming values
// ---------------------------------------------------------------------

// Combine `Object.entries()` and `Object.fromEntries()` when keys must be preserved during transformations.
const originalPrices = { laptop: 1000, phone: 500, tablet: 700 };
const discountedPrices = Object.fromEntries(
  Object.entries(originalPrices).map(([product, price]) => [product, price * 0.9]),
);

console.log(discountedPrices); // { laptop: 900, phone: 450, tablet: 630 }

// ---------------------------------------------------------------------
// 26. React-style object data
// ---------------------------------------------------------------------

// Extract values for error messages or list rendering in UI libraries.
const validationErrors = {
  username: "Username is required",
  email: "Invalid email address",
};
const errorMessages = Object.values(validationErrors);

console.log(errorMessages); // ["Username is required", "Invalid email address"]

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Object.values(object)` returns an array of enumerable own property values.
// - The returned array is a new instance and does not mutate the source object.
// - Inherited properties, non-enumerable properties, and symbol keys are excluded.
// - Values of inner objects/arrays remain shared references (shallow extraction).
// - Works seamlessly with array methods like `map()`, `filter()`, `some()`, `every()`, and `reduce()`.
// - Ideal when object keys are irrelevant and only the values need processing.
