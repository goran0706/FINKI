/*
  Falsy and Truthy values

  Truthy values are true, numbers other than 0, strings, etc.
  - any other number, including negative number = true
  - any other non-empty string, including false = true
  - {}, [] & all other objects or arrays = true

  Falsy values are false, 0, -0, 0n, "", null, undefined, and NaN
  - 0 - false
  - empty string = false
  - null, undefined, NaN = false
*/

/* -------------------------------------------------------------------------- */
/*                             Built-in Constants                             */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                      null                                  */
/* -------------------------------------------------------------------------- */
// * null is used for representing the intentional absence of an object value and is a primitive value.
// * Unlike undefined, it is not a property of the global object.
// * It is equal to undefined but not identical to it.

null == undefined; // true
null === undefined; // false
typeof null; // 'object';

/* -------------------------------------------------------------------------- */
/*                                undefined                                   */
/* -------------------------------------------------------------------------- */
// * At first glance it may appear that null and undefined are basically the same, however there are subtle but important differences.
// * undefined is the absence of a value in the compiler, because where it should be a value, there hasn't been put one,
// * like the case of an unassigned variable.

// undefined is a global value that represents the absence of an assigned value.
typeof undefined === "undefined";

// null is an object that indicates that a variable has been explicitly assigned "no value".
typeof null === "object";

// Setting a variable to undefined means the variable effectively does not exist. Some processes, such as JSON serialization,
// may strip undefined properties from objects.
// In contrast, null properties indicate will be preserved so you can explicitly convey the concept of an "empty" property.

/* -------------------------------------------------------------------------- */
/*                                      NaN                                   */
/* -------------------------------------------------------------------------- */
// * NaN stands for "Not a Number."
// * When a mathematical function or operation in JavaScript cannot return a specific number, it returns the value NaN instead.
window.hasOwnProperty("NaN"); // true
NaN; // NaN
NaN == NaN; // false
NaN === NaN; // false
typeof NaN; // 'number'

/* -------------------------------------------------------------------------- */
/*                                Number Constants                            */
/* -------------------------------------------------------------------------- */

Number.MIN_VALUE; // 5e-324
Number.MAX_VALUE; // 1.7976931348623157e+308
Number.MIN_SAFE_INTEGER; // -9007199254740991
Number.MAX_SAFE_INTEGER; // 9007199254740991
Number.POSITIVE_INFINITY; // Infinity
Number.NEGATIVE_INFINITY; // -Infinity
Number.EPSILON; // 0.0000000000000002220446049250313
Number.NaN; // NaN
