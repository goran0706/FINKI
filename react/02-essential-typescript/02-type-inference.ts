/**
 * Type Inference
 * ==============
 *
 * Type inference is how the compiler determines a type from context, such as an
 * initializer value or a returned expression, without an explicit annotation.
 */

// -----------------------------------------------------------------------
// 1. Inference from initializers
// -----------------------------------------------------------------------

let age = 30; // inferred as `number`
let username = "johndoe"; // inferred as `string`
let isActive = true; // inferred as `boolean`

console.log(age); // 30
console.log(username); // "johndoe"
console.log(isActive); // true

// An inferred type constrains a binding exactly as an explicit annotation would:
// age = "thirty"; // TS2322: Type 'string' is not assignable to type 'number'.

// -----------------------------------------------------------------------
// 2. `let` widens; `const` keeps the literal type
// -----------------------------------------------------------------------

// `let` widens an inferred string literal to `string`, since the binding could be
// reassigned to any other string later. `const` keeps the exact literal type, since
// the binding can never change.
let dir = "up"; // inferred as `string`
const fixedDir = "up"; // inferred as the literal type `"up"`

function setDirection(direction: "up" | "down") {
  console.log(direction);
}

setDirection(fixedDir); // "up"
// setDirection(dir);   // TS2345: Argument of type 'string' is not assignable to parameter of type '"up" | "down"'.

// -----------------------------------------------------------------------
// 3. Return type inference
// -----------------------------------------------------------------------

// Inferred return type: `number`, taken from the type of the returned expression.
function add(a: number, b: number) {
  return a + b;
}

console.log(add(2, 3)); // 5

// Inferred return type: `string`.
function greet(name: string) {
  return `Hello, ${name}`;
}

console.log(greet("John Doe")); // "Hello, John Doe"

// -----------------------------------------------------------------------
// 4. Contextual typing
// -----------------------------------------------------------------------

const numbers = [1, 2, 3];

// `n` is inferred as `number` here from the array's element type, with no annotation
// needed on the callback parameter itself.
const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [ 2, 4, 6 ]

// -----------------------------------------------------------------------
// 5. Inference for array and object literals
// -----------------------------------------------------------------------

let scores = [10, 20, 30]; // inferred as `number[]`
let mixed = [1, "two", 3]; // inferred as `(string | number)[]` - the "best common type" across elements
let point = { x: 1, y: 2 }; // inferred as `{ x: number; y: number }`

console.log(scores); // [ 10, 20, 30 ]
console.log(mixed); // [ 1, 'two', 3 ]
console.log(point); // { x: 1, y: 2 }

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - Type inference determines a type from context, most commonly an initializer value
//   or a returned expression, without an explicit annotation.
// - `let` and `var` widen an inferred literal to its general type; `const` keeps the
//   exact literal type, since the binding can never be reassigned.
// - A function's return type is inferred from its returned expression when no return
//   type annotation is written.
// - Contextual typing infers a parameter's type from the position it's used in, such
//   as a callback passed to an array method.
// - Array and object literals infer element and property types, combining differing
//   element types into a union - the "best common type."
