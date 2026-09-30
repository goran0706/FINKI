/**
 * Tuples
 * ======
 *
 * A tuple is an array type with a fixed number of elements where each position
 * has a known type. Tuples are useful when the order and meaning of each element
 * are part of the value's structure.
 */

// -----------------------------------------------------------------------
// 1. Defining tuples
// -----------------------------------------------------------------------

// A tuple type specifies the type of each element by its position.
let user: [string, number] = ["John Doe", 30];
let coordinates: [number, number] = [42.01, 21.43];

console.log(user); // [ 'John Doe', 30 ]
console.log(coordinates); // [ 42.01, 21.43 ]

// The first position must contain a string and the second position must contain a number.
// user = [30, "John Doe"]; // TS2322: Type 'number' is not assignable to type 'string'.

// -----------------------------------------------------------------------
// 2. Accessing tuple elements
// -----------------------------------------------------------------------

// TypeScript knows the type of each element from its position.
const username: string = user[0];
const age: number = user[1];

console.log(username); // "John Doe"
console.log(age); // 30

// A tuple preserves positional meaning, so swapping the values changes their types.
// console.log(user[1].toUpperCase()); // TS2339: Property 'toUpperCase' does not exist on type 'number'.

// -----------------------------------------------------------------------
// 3. Fixed length
// -----------------------------------------------------------------------

// A tuple describes a fixed number of elements, unlike a regular array.
let point: [number, number] = [10, 20];

console.log(point); // [ 10, 20 ]

// A tuple with two elements cannot be initialized with one or three elements.
// point = [10];       // TS2322: Type '[number]' is not assignable to type '[number, number]'.
// point = [10, 20, 30]; // TS2322: Type '[number, number, number]' is not assignable to type '[number, number]'.

// -----------------------------------------------------------------------
// 4. Tuples with different types
// -----------------------------------------------------------------------

// Each position can have a completely different type.
let response: [number, string, boolean] = [200, "OK", true];

console.log(response); // [ 200, 'OK', true ]

const statusCode = response[0];
const message = response[1];
const successful = response[2];

console.log(statusCode); // 200
console.log(message); // "OK"
console.log(successful); // true

// -----------------------------------------------------------------------
// 5. Optional tuple elements
// -----------------------------------------------------------------------

// A tuple element can be optional by placing `?` after its type.
let userWithNickname: [string, number, string?] = ["John Doe", 30];
let userWithFullDetails: [string, number, string?] = ["Jane Doe", 28, "Jane"];

console.log(userWithNickname); // [ 'John Doe', 30 ]
console.log(userWithFullDetails); // [ 'Jane Doe', 28, 'Jane' ]

// The optional element may be omitted, but it must remain after all required elements.

// -----------------------------------------------------------------------
// 6. Rest elements in tuples
// -----------------------------------------------------------------------

// A tuple can use a rest element to allow any number of additional values
// of the specified type after its required elements.
let scores: [string, ...number[]] = ["John Doe", 10, 20, 30];

console.log(scores); // [ 'John Doe', 10, 20, 30 ]

scores.push(40);

console.log(scores); // [ 'John Doe', 10, 20, 30, 40 ]

// The first element remains a string, while every remaining element must be a number.

// -----------------------------------------------------------------------
// 7. Readonly tuples
// -----------------------------------------------------------------------

// A readonly tuple prevents its elements from being changed after initialization.
const coordinates: readonly [number, number] = [42.01, 21.43];

console.log(coordinates); // [ 42.01, 21.43 ]

// coordinates[0] = 50; // TS2540: Cannot assign to '0' because it is a read-only property.
// coordinates.push(50); // TS2339: Property 'push' does not exist on type 'readonly [number, number]'.

// -----------------------------------------------------------------------
// 8. Destructuring tuples
// -----------------------------------------------------------------------

// Tuple types work naturally with array destructuring because each position has
// a known type and meaning.
const product: [string, number] = ["Keyboard", 99];

const [productName, price] = product;

console.log(productName); // "Keyboard"
console.log(price); // 99

// TypeScript infers `productName` as `string` and `price` as `number`.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - A tuple is an array type with a fixed positional structure.
// - Each tuple position can have a different type, and TypeScript tracks those types individually.
// - Tuples normally have a fixed number of elements, unlike regular arrays.
// - Optional and rest elements allow controlled variation in tuple length.
// - Readonly tuples prevent mutation of their elements.
// - Tuple types work naturally with array destructuring because each position has a known type.
