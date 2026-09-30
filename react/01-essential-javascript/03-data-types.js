/**
 * Data Types
 * ==========
 *
 * JavaScript has seven primitive types and one non-primitive type: object.
 * Every value in JavaScript belongs to one of these categories.
 *
 * A primitive value represents data directly and is immutable.
 * An object is a mutable collection of properties, and variables holding objects contain
 * reference values that identify the underlying object.
 */

// ---------------------------------------------------------------------
// 1. The seven primitive types
// ---------------------------------------------------------------------

// JavaScript has seven primitive types.
const aString = "hello"; // string
const aNumber = 42; // number
const aBigInt = 42n; // bigint
const aBoolean = true; // boolean
const aUndefined = undefined; // undefined
const aNull = null; // null
const aSymbol = Symbol("id"); // symbol

// Primitive values are immutable: operations do not modify the original value.
// Instead, operations produce another value.
let text = "hello";

text.toUpperCase(); // returns a new string; `text` is unchanged
console.log(text); // "hello"

text = text.toUpperCase(); // reassignment stores the new value in `text`
console.log(text); // "HELLO"

// ---------------------------------------------------------------------
// 2. The object type
// ---------------------------------------------------------------------

// Objects are non-primitive values and can contain properties and methods.
// Arrays, dates, regular expressions, maps, and sets are objects.
// Functions are also objects, although `typeof` reports `"function"` for them.

const anObject = { role: "admin" };
const anArray = [1, 2, 3];
const aDate = new Date();
const aMap = new Map();
const aSet = new Set();

function aFunction() {}

// Objects are mutable: their properties or contents can be changed.
anObject.role = "user";
anArray.push(4);

console.log(anObject); // {role: "user"}
console.log(anArray); // [1, 2, 3, 4]

// ---------------------------------------------------------------------
// 3. The `typeof` operator
// ---------------------------------------------------------------------

// `typeof` returns a string describing the type of a value.
console.log(typeof aString); // "string"
console.log(typeof aNumber); // "number"
console.log(typeof aBigInt); // "bigint"
console.log(typeof aBoolean); // "boolean"
console.log(typeof aUndefined); // "undefined"
console.log(typeof aSymbol); // "symbol"
console.log(typeof anObject); // "object"
console.log(typeof anArray); // "object"
console.log(typeof aDate); // "object"
console.log(typeof aFunction); // "function"

// `typeof null` returns `"object"` because of a historical language quirk.
// `null` is nevertheless its own primitive type and is not an object.
console.log(typeof aNull); // "object"

// `typeof` can safely be used with an undeclared identifier.
// Instead of throwing a ReferenceError, it returns `"undefined"`.
console.log(typeof neverDeclared); // "undefined"

// `typeof` cannot distinguish specific kinds of objects.
// Arrays, dates, maps, and plain objects all report `"object"`.
console.log(typeof anArray); // "object"
console.log(typeof aDate); // "object"
console.log(typeof aMap); // "object"

// ---------------------------------------------------------------------
// 4. Checking specific object types
// ---------------------------------------------------------------------

// `Array.isArray` specifically checks whether a value is an array.
console.log(Array.isArray(anArray)); // true
console.log(Array.isArray(anObject)); // false

// `instanceof` checks whether an object's prototype chain contains
// the prototype associated with a particular constructor.
console.log(anArray instanceof Array); // true
console.log(aDate instanceof Date); // true
console.log(anObject instanceof Array); // false

// Use `typeof` for broad type checks.
// Use `Array.isArray` or `instanceof` when a more specific object check is required.

// ---------------------------------------------------------------------
// 5. Primitive values are copied independently
// ---------------------------------------------------------------------

// Assigning a primitive value to another variable copies that value.
// Reassigning the second variable does not affect the first.
let x = 10;
let y = x;

y = 20;

console.log(x); // 10
console.log(y); // 20

// Primitive values with the same value compare as equal with `===`.
console.log(10 === 10); // true
console.log("abc" === "abc"); // true
console.log(true === true); // true

// ---------------------------------------------------------------------
// 6. Object values contain references
// ---------------------------------------------------------------------

// Assigning an object to another variable copies the reference value.
// Both variables therefore refer to the SAME underlying object.
const person1 = { name: "John Doe" };
const person2 = person1;

person2.name = "Jane Doe";

console.log(person1.name); // "Jane Doe"
console.log(person2.name); // "Jane Doe"

// Because both variables refer to the same object, their references are equal.
console.log(person1 === person2); // true

// Two separately created objects are different objects, even when their contents match.
// `===` compares their references, not their properties.
console.log({ name: "John Doe" } === { name: "John Doe" }); // false

// Arrays are objects, so assigning an array also copies its reference.
const numbers1 = [1, 2, 3];
const numbers2 = numbers1;

numbers2.push(4);

console.log(numbers1); // [1, 2, 3, 4]
console.log(numbers2); // [1, 2, 3, 4]

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JavaScript has seven primitive types: string, number, bigint, boolean, undefined, null, and symbol.
// - Primitive values are immutable; operations produce new values instead of modifying the original.
// - Objects are non-primitive values and include plain objects, arrays, functions, dates, maps, sets, and more.
// - `typeof` identifies primitive types and reports `"function"` for callable objects.
// - `typeof null` returns `"object"` because of a historical language quirk; `null` is still a primitive.
// - Assigning a primitive copies its value, while assigning an object copies its reference to the same underlying object.
// - `===` compares primitive values directly and object values by reference.
