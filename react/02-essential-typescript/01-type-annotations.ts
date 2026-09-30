/**
 * Type Annotations
 * ================
 *
 * A type annotation is explicit syntax, `: Type`, attached to a variable, parameter, or
 * return position that tells the compiler what type a value is expected to be.
 */

// -----------------------------------------------------------------------
// 1. Annotating variables
// -----------------------------------------------------------------------

let age: number = 30;
let username: string = "johndoe";
let isActive: boolean = true;

console.log(age); // 30
console.log(username); // "johndoe"
console.log(isActive); // true

// The annotation constrains what can be assigned to the variable from this point on:
// age = "thirty"; // TS2322: Type 'string' is not assignable to type 'number'.

// -----------------------------------------------------------------------
// 2. Annotating function parameters and return types
// -----------------------------------------------------------------------

// A parameter annotation constrains what the function accepts; a return type annotation
// constrains what the function must produce. Both are written after a colon.
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(2, 3)); // 5

// add("2", "3"); // TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

// A function that returns nothing is annotated `void`:
function logMessage(message: string): void {
  console.log(message);
}

logMessage("System ready"); // "System ready"

// -----------------------------------------------------------------------
// 3. Unannotated parameters and the `strict` compiler baseline
// -----------------------------------------------------------------------

// Under a `strict: true` tsconfig, the standard baseline for new projects,
// a parameter the compiler cannot infer from context must be annotated explicitly.
// Leaving it out is a compile error rather than a silent fallback to `any`:
// function double(x) {
//   return x * 2;
// }
// TS7006: Parameter 'x' implicitly has an 'any' type.

// -----------------------------------------------------------------------
// 4. Annotations are erased at compile time
// -----------------------------------------------------------------------

// Type annotations exist only while the compiler is checking the code. The JavaScript
// emitted for `let score: number = 100;` is simply `let score = 100;`, with no trace of
// the annotation left behind.
let score: number = 100;
console.log(typeof score); // "number" - the underlying JavaScript type, not the TypeScript annotation

// -----------------------------------------------------------------------
// 5. Annotating array and object values
// -----------------------------------------------------------------------

// The same `: Type` syntax applies to any binding, including arrays and object shapes:
let scores: number[] = [10, 20, 30];
let user: { name: string; age: number } = { name: "John Doe", age: 30 };

console.log(scores); // [ 10, 20, 30 ]

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - A type annotation is `: Type` written after a variable, parameter, or return position.
// - Assigning or passing a value of the wrong type against an annotation is a compile-time
//   diagnostic (e.g. TS2322, TS2345), not a runtime error - the code simply does not compile.
// - Under `strict: true`, an unannotated parameter the compiler cannot infer produces
//   TS7006 instead of silently becoming `any`.
// - Annotations are erased during compilation and have no representation in the emitted
//   JavaScript or at runtime.
