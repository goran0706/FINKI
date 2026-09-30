/**
 * Null
 * ====
 *
 * `null` is a primitive value that represents the intentional absence of a value.
 * It is commonly assigned deliberately to indicate that a value is empty, missing, or cleared.
 */

// ---------------------------------------------------------------------
// 1. `null` is a primitive
// ---------------------------------------------------------------------

const missingValue = null;

// `typeof null` returns `"object"` because of a historical language quirk.
// `null` is nevertheless a primitive value, not an object.
console.log(typeof missingValue); // "object"

// The reliable way to check specifically for `null` is strict equality.
console.log(missingValue === null); // true

// ---------------------------------------------------------------------
// 2. `null` vs. `undefined`
// ---------------------------------------------------------------------

// `null` is an explicitly assigned value.
// It communicates that the value is intentionally empty.
let selectedUser = null;

console.log(selectedUser); // null

// A declared variable without an initializer evaluates to `undefined`.
// `undefined` is also a primitive value, but it commonly represents a value
// that has not been assigned or is otherwise absent.
let notYetAssigned;

console.log(notYetAssigned); // undefined

// The distinction is semantic:
// `null` usually means "intentionally empty",
// while `undefined` commonly means "not provided" or "not initialized".

// ---------------------------------------------------------------------
// 3. Equality checks involving `null`
// ---------------------------------------------------------------------

// Loose equality has a special rule for `null` and `undefined`:
// they are loosely equal to each other, but not to other falsy values.
console.log(null === null); // true
console.log(null === undefined); // false
console.log(null == undefined); // true
console.log(null == 0); // false
console.log(null == ""); // false
console.log(null == false); // false

// `value == null` is therefore a deliberate shorthand for checking
// whether a value is either `null` or `undefined`.
function describe(value) {
  if (value == null) {
    return "no value provided";
  }

  return `value: ${value}`;
}

console.log(describe(null)); // "no value provided"
console.log(describe(undefined)); // "no value provided"
console.log(describe(0)); // "value: 0"

// ---------------------------------------------------------------------
// 4. `null` in APIs and object properties
// ---------------------------------------------------------------------

// APIs commonly use `null` when a value exists conceptually but is
// currently empty or unavailable.
const userRecord = {
  id: 1,
  name: "Jane Doe",
  middleName: null,
  address: null,
};

console.log(userRecord.middleName); // null

// Browser DOM lookup methods such as `getElementById` return `null`
// when no matching element exists.
if (typeof document !== "undefined") {
  const missingElement = document.getElementById("does-not-exist");
  console.log(missingElement); // null
}

// Accessing a property on `null` throws a TypeError.
// userRecord.address.city; // TypeError: Cannot read properties of null

// Optional chaining safely handles both `null` and `undefined`.
// When `address` is `null`, the expression stops and returns `undefined`.
const city = userRecord.address?.city;
console.log(city); // undefined

// ---------------------------------------------------------------------
// 5. `null` and JSON
// ---------------------------------------------------------------------

// `JSON.stringify` preserves properties whose value is `null`.
// Properties whose value is `undefined` are omitted from JSON objects.
const payload = {
  id: 1,
  middleName: null,
  nickname: undefined,
};

console.log(JSON.stringify(payload)); // '{"id":1,"middleName":null}'

// ---------------------------------------------------------------------
// 6. `null` cannot be destructured
// ---------------------------------------------------------------------

// Destructuring requires a value that can provide properties.
// `null` cannot be destructured because it is not an object.
// const {id} = null; // TypeError: Cannot destructure property 'id' of 'null' as it is null.

// A default parameter value is used only when the argument is `undefined`.
// Passing `null` does not trigger the default.
function greet({ name } = {}) {
  return `Hello, ${name ?? "guest"}`;
}

console.log(greet()); // "Hello, guest"
console.log(greet(undefined)); // "Hello, guest"
// greet(null);                // TypeError: Cannot destructure property 'name' of 'null' as it is null.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `null` is a primitive value used to represent an intentional absence of a value.
// - `typeof null` returns `"object"` because of a historical language quirk; `null` is not an object.
// - `undefined` commonly represents a value that has not been provided or initialized, while `null` is usually assigned deliberately.
// - `null == undefined` is true, but `null === undefined` is false.
// - Accessing properties on `null` throws a TypeError; optional chaining safely handles `null` and `undefined`.
// - `JSON.stringify` preserves `null` properties but omits `undefined` properties from objects.
// - `null` cannot be destructured, and default parameter values do not apply when the argument is `null`.
