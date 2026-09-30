/**
 * Spread Syntax
 * =============
 *
 * Spread syntax (`...`) expands the elements of an iterable or the
 * properties of an object into another value.
 *
 * It is commonly used to create new arrays and objects from existing
 * values without mutating the originals.
 */

// ---------------------------------------------------------------------
// 1. Spread syntax with arrays
// ---------------------------------------------------------------------

// Spread expands each array element into the surrounding array to create a shallow copy.
const numbers = [1, 2, 3];
const copy = [...numbers];

console.log(copy); // [1, 2, 3]

// ---------------------------------------------------------------------
// 2. Combining arrays
// ---------------------------------------------------------------------

// Spread can combine multiple arrays and individual values into a single new array.
const first = [1, 2];
const second = [3, 4];
const combined = [...first, ...second];

console.log(combined); // [1, 2, 3, 4]

const result = [0, ...first, 2.5, ...second, 5];
console.log(result); // [0, 1, 2, 2.5, 3, 4, 5]

// ---------------------------------------------------------------------
// 3. Spread creates a new array
// ---------------------------------------------------------------------

// Spread performs a shallow copy, meaning outer arrays are unique while nested structures remain shared.
const original = [1, 2, 3];
const cloned = [...original];

cloned.push(4);

console.log(original); // [1, 2, 3]
console.log(cloned); // [1, 2, 3, 4]
console.log(original === cloned); // false

const users = [{ name: "John" }, { name: "Jane" }];
const copiedUsers = [...users];

console.log(users === copiedUsers); // false
console.log(users[0] === copiedUsers[0]); // true

// ---------------------------------------------------------------------
// 4. Spread with strings
// ---------------------------------------------------------------------

// Strings are iterable and can be spread into an array of characters, respecting code point behavior.
const word = "hello";
const characters = [...word];

console.log(characters); // ["h", "e", "l", "l", "o"]

const emoji = "😀";
console.log([...emoji]); // ["😀"]

// ---------------------------------------------------------------------
// 5. Spread with other iterables
// ---------------------------------------------------------------------

// Any iterable, such as Sets or Maps, can be spread into an array.
const numbersSet = new Set([1, 2, 3]);
const numbersFromSet = [...numbersSet];

console.log(numbersFromSet); // [1, 2, 3]

const userMap = new Map([
  ["id", 1],
  ["name", "John"],
]);

const mapEntries = [...userMap];
console.log(mapEntries); // [["id", 1], ["name", "John"]]

// ---------------------------------------------------------------------
// 6. Spread with objects
// ---------------------------------------------------------------------

// Object spread copies enumerable own properties into a new object.
const user = {
  name: "John",
  age: 30,
};

const userCopy = {
  ...user,
};

console.log(userCopy); // { name: "John", age: 30 }
console.log(user === userCopy); // false

// ---------------------------------------------------------------------
// 7. Combining objects
// ---------------------------------------------------------------------

// Multiple objects can be merged into a single new object using spread.
const identity = {
  name: "John",
  age: 30,
};

const contact = {
  email: "john@example.com",
  phone: "555-1234",
};

const profile = {
  ...identity,
  ...contact,
};

console.log(profile); // { name: "John", age: 30, email: "john@example.com", phone: "555-1234" }

// ---------------------------------------------------------------------
// 8. Property precedence
// ---------------------------------------------------------------------

// Later properties overwrite earlier ones when duplicate keys exist (left-to-right precedence).
const defaults = {
  theme: "light",
  language: "en",
};

const preferences = {
  theme: "dark",
};

const settings = {
  ...defaults,
  ...preferences,
};

console.log(settings); // { theme: "dark", language: "en" }

const updatedSettings = {
  ...defaults,
  ...preferences,
  language: "de",
};

console.log(updatedSettings); // { theme: "dark", language: "de" }

// ---------------------------------------------------------------------
// 9. Shallow copying objects
// ---------------------------------------------------------------------

// Object spread creates a new outer object but leaves nested objects as shared references.
const account = {
  name: "John",
  address: {
    city: "Skopje",
  },
};

const accountCopy = {
  ...account,
};

console.log(account === accountCopy); // false
console.log(account.address === accountCopy.address); // true

accountCopy.address.city = "London";
console.log(account.address.city); // "London"

// ---------------------------------------------------------------------
// 10. Updating an object without mutation
// ---------------------------------------------------------------------

// Spread is commonly used to create new objects with specific properties overridden safely.
const product = {
  name: "Laptop",
  price: 1200,
};

const discountedProduct = {
  ...product,
  price: 1000,
};

console.log(product); // { name: "Laptop", price: 1200 }
console.log(discountedProduct); // { name: "Laptop", price: 1000 }

// ---------------------------------------------------------------------
// 11. Updating nested objects
// ---------------------------------------------------------------------

// Nested objects require explicit spreading at each level to achieve immutable updates.
const customer = {
  name: "John",
  address: {
    city: "Skopje",
    country: "North Macedonia",
  },
};

const updatedCustomer = {
  ...customer,
  address: {
    ...customer.address,
    city: "London",
  },
};

console.log(customer.address.city); // "Skopje"
console.log(updatedCustomer.address.city); // "London"
console.log(customer.address === updatedCustomer.address); // false

// ---------------------------------------------------------------------
// 12. Adding array elements without mutation
// ---------------------------------------------------------------------

// Spread enables adding items to the beginning or end of an array immutably.
const items = ["a", "b"];

const withStart = ["start", ...items];
const withEnd = [...items, "end"];

console.log(withStart); // ["start", "a", "b"]
console.log(withEnd); // ["a", "b", "end"]
console.log(items); // ["a", "b"]

// ---------------------------------------------------------------------
// 13. Updating an array element without mutation
// ---------------------------------------------------------------------

// Array spread can be paired with array methods like `map` to update elements immutably.
const values = [10, 20, 30];

const updatedValues = values.map((value, index) => (index === 1 ? 25 : value));

console.log(values); // [10, 20, 30]
console.log(updatedValues); // [10, 25, 30]

// ---------------------------------------------------------------------
// 14. Spread in function calls
// ---------------------------------------------------------------------

// Spread can expand an iterable directly into individual function arguments.
function add(a, b, c) {
  return a + b + c;
}

const operands = [10, 20, 30];
console.log(add(...operands)); // 60

// ---------------------------------------------------------------------
// 15. Spread with function arguments
// ---------------------------------------------------------------------

// Spread is frequently used with math utility functions that accept multiple arguments.
const numbersToAdd = [1, 2, 3, 4];

console.log(Math.max(...numbersToAdd)); // 4
console.log(Math.min(...numbersToAdd)); // 1

// ---------------------------------------------------------------------
// 16. Spread vs. rest syntax
// ---------------------------------------------------------------------

// The `...` syntax expands values when used as spread, and collects values when used as rest.
const valuesToCopy = [1, 2, 3];
const copiedValues = [...valuesToCopy]; // Spread (expands)

function collect(...values) {
  return values; // Rest (collects)
}

console.log(collect(1, 2, 3)); // [1, 2, 3]

// ---------------------------------------------------------------------
// 17. Object spread and property descriptors
// ---------------------------------------------------------------------

// Object spread copies only enumerable own data properties, omitting prototypes and non-enumerable flags.
const source = {
  value: 42,
};

Object.defineProperty(source, "hidden", {
  value: "not enumerable",
  enumerable: false,
});

const copiedSource = {
  ...source,
};

console.log(copiedSource.value); // 42
console.log(copiedSource.hidden); // undefined

// ---------------------------------------------------------------------
// 18. Object spread with primitives
// ---------------------------------------------------------------------

// Object spread accepts primitive values, extracting character properties from strings while ignoring others.
const stringObject = {
  ..."abc",
};

console.log(stringObject); // { 0: "a", 1: "b", 2: "c" }

const numberObject = {
  ...42,
};

console.log(numberObject); // {}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Array spread expands iterable values into a new array.
// - Object spread copies enumerable own properties into a new object.
// - Spread can combine arrays or objects and control property precedence.
// - Spread creates shallow copies; nested objects and arrays remain shared references.
// - Spread can construct new arrays and objects without mutating the originals.
// - Spread can expand iterable values into function arguments.
// - Spread and rest both use `...`, but spread expands values while rest collects them.
// - Object spread copies enumerable own properties, not prototypes or non-enumerable properties.
