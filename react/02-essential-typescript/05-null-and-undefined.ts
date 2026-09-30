/**
 * null and undefined
 * ==================
 *
 * `null` and `undefined` are distinct JavaScript primitive values that represent
 * the absence of a value, but they have different semantics and common uses.
 */

// -----------------------------------------------------------------------
// 1. The `undefined` value
// -----------------------------------------------------------------------

// `undefined` is the value of a declared variable that has not been initialized.
let uninitialized: undefined;

// A function with no explicit return statement returns `undefined`.
function doNothing(): void {}

// Accessing a missing object property also produces `undefined`.
const user = { name: "John Doe" };

console.log(uninitialized); // undefined
console.log(doNothing()); // undefined
console.log(user.email); // undefined

// -----------------------------------------------------------------------
// 2. The `null` value
// -----------------------------------------------------------------------

// `null` is an explicit value that represents the intentional absence of an object value.
let selectedUser: null = null;
let currentUser: string | null = null;

console.log(selectedUser); // null
console.log(currentUser); // null

// A union type allows the variable to contain either a string or `null`.
currentUser = "John Doe";

console.log(currentUser); // "John Doe"

// -----------------------------------------------------------------------
// 3. `null` and `undefined` are different values
// -----------------------------------------------------------------------

// They are distinct primitive values and are not strictly equal.
console.log(null === undefined); // false

// Their `typeof` results are also different. `typeof null` returns `"object"`
// because of a historical behavior in JavaScript.
console.log(typeof null); // "object"
console.log(typeof undefined); // "undefined"

// -----------------------------------------------------------------------
// 4. Strict null checking
// -----------------------------------------------------------------------

// With `strictNullChecks` enabled, `null` and `undefined` are not assignable
// to ordinary types such as `string`, `number`, or `boolean`.
let username: string = "johndoe";

// username = null;      // TS2322: Type 'null' is not assignable to type 'string'.
// username = undefined; // TS2322: Type 'undefined' is not assignable to type 'string'.

console.log(username); // "johndoe"

// A union type explicitly allows a value to be either a string or `null`.
let displayName: string | null = null;
console.log(displayName); // null

displayName = "John Doe";
console.log(displayName); // "John Doe"

// -----------------------------------------------------------------------
// 5. Optional values and `undefined`
// -----------------------------------------------------------------------

// An optional property can be absent, in which case reading it produces `undefined`.
interface User {
  name: string;
  nickname?: string;
}

const userWithoutNickname: User = {
  name: "John Doe",
};

const userWithUndefinedNickname: User = {
  name: "John Doe",
  nickname: undefined,
};

console.log(userWithoutNickname.nickname); // undefined
console.log(userWithUndefinedNickname.nickname); // undefined

// -----------------------------------------------------------------------
// 6. Checking for `null` and `undefined`
// -----------------------------------------------------------------------

// Strict equality precisely checks for one specific nullish value.
let value: string | null | undefined = null;

console.log(value === null); // true
console.log(value === undefined); // false

value = undefined;

console.log(value === null); // false
console.log(value === undefined); // true

// -----------------------------------------------------------------------
// 7. Nullish values
// -----------------------------------------------------------------------

// A nullish value is specifically `null` or `undefined`.
function getDisplayName(name: string | null | undefined): string {
  if (name === null || name === undefined) {
    return "Unknown";
  }

  return name;
}

console.log(getDisplayName("John Doe")); // "John Doe"
console.log(getDisplayName(null)); // "Unknown"
console.log(getDisplayName(undefined)); // "Unknown"

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - `undefined` commonly represents an uninitialized value, a missing property,
//   or the result of a function with no explicit return value.
// - `null` is an explicit value representing the intentional absence of an object value.
// - `null` and `undefined` are distinct values with different runtime behavior.
// - With `strictNullChecks`, nullish values must be explicitly included in a type.
// - Union types such as `string | null` model values that may intentionally be absent.
