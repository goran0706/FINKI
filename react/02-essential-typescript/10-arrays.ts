/**
 * Arrays
 * ======
 *
 * Array types describe ordered collections of values where each element follows
 * a specified type. TypeScript provides several equivalent syntaxes for defining
 * arrays and checks both their elements and accessed values.
 */

// -----------------------------------------------------------------------
// 1. Typing arrays
// -----------------------------------------------------------------------

// The `Type[]` syntax describes an array whose elements are all the specified type.
let scores: number[] = [10, 20, 30];
let usernames: string[] = ["john", "jane", "admin"];
let active: boolean[] = [true, false, true];

console.log(scores); // [ 10, 20, 30 ]
console.log(usernames); // [ 'john', 'jane', 'admin' ]
console.log(active); // [ true, false, true ]

// Assigning an element of another type produces a compile-time error:
// scores.push("40"); // TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

// -----------------------------------------------------------------------
// 2. Inferring array types
// -----------------------------------------------------------------------

// TypeScript usually infers the element type from the values in an array literal.
let numbers = [1, 2, 3];
let names = ["John Doe", "Jane Doe"];

console.log(numbers); // [ 1, 2, 3 ]
console.log(names); // [ 'John Doe', 'Jane Doe' ]

// The inferred type of `numbers` is `number[]`, so subsequent elements must also be numbers.
numbers.push(4);
names.push("Admin");

console.log(numbers); // [ 1, 2, 3, 4 ]
console.log(names); // [ 'John Doe', 'Jane Doe', 'Admin' ]

// -----------------------------------------------------------------------
// 3. Arrays with union element types
// -----------------------------------------------------------------------

// A union element type allows each array element to contain one of several types.
let values: (string | number)[] = [10, "twenty", 30];

values.push("forty");
values.push(50);

console.log(values); // [ 10, 'twenty', 30, 'forty', 50 ]

// Parentheses are required because `string | number[]` would mean either a string
// or an array of numbers, rather than an array containing strings or numbers.

// -----------------------------------------------------------------------
// 4. The `Array<Type>` syntax
// -----------------------------------------------------------------------

// `Array<Type>` is equivalent to `Type[]` and is useful when the element type itself
// is more complex, such as a union or another generic type.
let scoresA: number[] = [10, 20, 30];
let scoresB: Array<number> = [40, 50, 60];

console.log(scoresA); // [ 10, 20, 30 ]
console.log(scoresB); // [ 40, 50, 60 ]

// Both declarations describe the same array type:
scoresA.push(40);
scoresB.push(70);

console.log(scoresA); // [ 10, 20, 30, 40 ]
console.log(scoresB); // [ 40, 50, 60, 70 ]

// -----------------------------------------------------------------------
// 5. Arrays of object types
// -----------------------------------------------------------------------

// An array can contain objects whose properties are described by an object type.
let users: { name: string; age: number }[] = [
  { name: "John Doe", age: 30 },
  { name: "Jane Doe", age: 28 },
];

users.push({ name: "Admin", age: 40 });

console.log(users); // [ { name: 'John Doe', age: 30 }, { name: 'Jane Doe', age: 28 }, { name: 'Admin', age: 40 } ]

// Each object must satisfy the declared element type:
// users.push({ name: "Guest" }); // TS2345: Property 'age' is missing in type '{ name: string; }'.

// -----------------------------------------------------------------------
// 6. Accessing array elements
// -----------------------------------------------------------------------

// Indexed access returns an element with the array's element type.
const firstScore: number = scores[0];
const firstUsername: string = usernames[0];

console.log(firstScore); // 10
console.log(firstUsername); // "john"

// An index outside the known array contents produces `undefined` at runtime.
const missingScore = scores[99];

console.log(missingScore); // undefined

// With `noUncheckedIndexedAccess` enabled, TypeScript includes `undefined`
// in the type of an indexed access because the element may not exist.

// -----------------------------------------------------------------------
// 7. Multidimensional arrays
// -----------------------------------------------------------------------

// An array can contain other arrays by using a nested array type.
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
];

console.log(matrix); // [ [ 1, 2, 3 ], [ 4, 5, 6 ] ]
console.log(matrix[0]); // [ 1, 2, 3 ]
console.log(matrix[1][2]); // 6

// The inner `number[]` describes each row, while the outer `number[][]` describes
// the collection of rows.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - `Type[]` describes an array whose elements all have the specified type.
// - `Array<Type>` is an equivalent array syntax, especially useful with complex types.
// - Array literals are usually inferred from their elements, such as `number[]` or `string[]`.
// - Union element types such as `(string | number)[]` allow multiple types in one array.
// - Object arrays describe the shape that every element must satisfy.
// - Indexed access returns an element of the array's element type and may produce
//   `undefined` when the requested index does not contain an element.
// - Nested array types such as `number[][]` describe multidimensional arrays.
