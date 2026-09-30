/**
 * Undefined
 * =========
 *
 * `undefined` is a primitive value that commonly represents the absence of an assigned value.
 * JavaScript produces it automatically in several situations, such as uninitialized variables,
 * missing function arguments, missing object properties, and functions that do not return a value.
 */

// ---------------------------------------------------------------------
// 1. Where `undefined` appears automatically
// ---------------------------------------------------------------------

// A declared variable without an initializer has the value `undefined`.
let notYetSet;
console.log(notYetSet); // undefined

// A missing function argument has the value `undefined`.
function greet(name) {
  console.log(name);
}

greet(); // undefined

// Accessing a property that does not exist returns `undefined`.
const user = { id: 1, name: "John Doe" };
console.log(user.middleName); // undefined

// Accessing an array index outside the array's existing elements returns `undefined`.
const numbers = [1, 2, 3];
console.log(numbers[10]); // undefined

// A function that does not explicitly return a value returns `undefined`.
function noReturnValue() {}

console.log(noReturnValue()); // undefined

// ---------------------------------------------------------------------
// 2. `typeof undefined`
// ---------------------------------------------------------------------

console.log(typeof notYetSet); // "undefined"

// `typeof` also returns `"undefined"` for an undeclared identifier.
// This is a special case that does not throw a ReferenceError.
console.log(typeof neverDeclaredAnywhere); // "undefined"

// Directly accessing an undeclared identifier does throw a ReferenceError.
// console.log(neverDeclaredAnywhere); // ReferenceError: neverDeclaredAnywhere is not defined

// ---------------------------------------------------------------------
// 3. The `undefined` identifier can be shadowed
// ---------------------------------------------------------------------

// The global `undefined` property cannot be reassigned in modern JavaScript,
// but a local binding can use the same name and hide the global binding.
function shadowedExample(undefined) {
  console.log(undefined); // value passed to the parameter
}

shadowedExample(5); // 5

// The `void` operator always produces the actual `undefined` value.
// This remains true even when a local binding named `undefined` exists.
console.log(void 0); // undefined
console.log(void "anything at all"); // undefined

// ---------------------------------------------------------------------
// 4. Checking for `undefined`
// ---------------------------------------------------------------------

// Strict equality is the usual way to check whether a value is `undefined`.
console.log(notYetSet === undefined); // true

// `typeof` is useful when the identifier itself might not exist.
// It can distinguish an undeclared identifier without throwing.
console.log(typeof notYetSet === "undefined"); // true
console.log(typeof neverDeclaredAnywhere === "undefined"); // true

// ---------------------------------------------------------------------
// 5. Default parameters use `undefined`
// ---------------------------------------------------------------------

// A default parameter is used when the argument is `undefined`,
// including when the argument is omitted.
// Passing `null` is different because `null` is an explicitly provided value.
function withDefault(role = "guest") {
  console.log(role);
}

withDefault(); // "guest"
withDefault(undefined); // "guest"
withDefault(null); // null

// ---------------------------------------------------------------------
// 6. `undefined` and JSON
// ---------------------------------------------------------------------

// `JSON.stringify` omits object properties whose values are `undefined`.
console.log(JSON.stringify({ id: 1, nickname: undefined })); // '{"id":1}'

// In an array, `undefined` elements are serialized as `null`
// so that the resulting JSON preserves the array's length and positions.
console.log(JSON.stringify([1, undefined, 3])); // '[1,null,3]'

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `undefined` is a primitive value commonly representing the absence of an assigned value.
// - It appears automatically in uninitialized variables, missing arguments, missing properties, and functions without a return value.
// - `typeof` returns `"undefined"` for `undefined` values and safely returns `"undefined"` for undeclared identifiers.
// - A local binding can shadow the identifier `undefined`; `void 0` always produces the actual `undefined` value.
// - Default parameters are used when the argument is `undefined`, but not when it is `null`.
// - `JSON.stringify` omits `undefined` object properties and converts `undefined` array elements to `null`.
