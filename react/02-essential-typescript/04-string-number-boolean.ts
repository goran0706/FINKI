/**
 * string, number, boolean
 * =======================
 *
 * TypeScript provides `string`, `number`, and `boolean` as the primitive types
 * for textual values, numeric values, and true/false values.
 */

// -----------------------------------------------------------------------
// 1. The `string` type
// -----------------------------------------------------------------------

// `string` represents textual data. Single quotes, double quotes, and
// template literals all produce JavaScript strings.
let username: string = "johndoe";
let greeting: string = "Hello";
let message: string = `${greeting}, ${username}`;

console.log(username); // "johndoe"
console.log(greeting); // "Hello"
console.log(message); // "Hello, johndoe"

// String methods return new strings rather than modifying the original string:
let text: string = "hello";

console.log(text.toUpperCase()); // "HELLO"
console.log(text); // "hello"

// A value of another type cannot be assigned to a `string` binding:
// username = 42; // TS2322: Type 'number' is not assignable to type 'string'.

// -----------------------------------------------------------------------
// 2. The `number` type
// -----------------------------------------------------------------------

// `number` represents both integer and floating-point values.
// JavaScript uses IEEE 754 double-precision floating-point numbers for this type.
let count: number = 42;
let price: number = 19.99;
let temperature: number = -5;
let percentage: number = 0.75;

console.log(count); // 42
console.log(price); // 19.99
console.log(temperature); // -5
console.log(percentage); // 0.75

// The same `number` type covers special numeric values such as `NaN`
// and positive or negative `Infinity`.
let invalidCalculation: number = NaN;
let infiniteValue: number = Infinity;

console.log(invalidCalculation); // NaN
console.log(infiniteValue); // Infinity

// Arithmetic operations on numbers produce another `number`:
let total: number = 10 + 5;
let difference: number = 10 - 5;
let product: number = 10 * 5;
let quotient: number = 10 / 5;

console.log(total); // 15
console.log(difference); // 5
console.log(product); // 50
console.log(quotient); // 2

// A value of another type cannot be assigned to a `number` binding:
// count = "42"; // TS2322: Type 'string' is not assignable to type 'number'.

// -----------------------------------------------------------------------
// 3. The `boolean` type
// -----------------------------------------------------------------------

// `boolean` represents exactly two values: `true` and `false`.
let isAuthenticated: boolean = true;
let hasPermission: boolean = false;

console.log(isAuthenticated); // true
console.log(hasPermission); // false

// Boolean expressions produce boolean values:
let age: number = 30;
let isAdult: boolean = age >= 18;

console.log(isAdult); // true

// Logical operators also produce boolean values:
let hasUsername: boolean = true;
let hasPassword: boolean = true;
let canLogin: boolean = hasUsername && hasPassword;

console.log(canLogin); // true

// A value of another type cannot be assigned to a `boolean` binding:
// isAuthenticated = 1; // TS2322: Type 'number' is not assignable to type 'boolean'.

// -----------------------------------------------------------------------
// 4. Type-specific operations
// -----------------------------------------------------------------------

// TypeScript uses the declared type to check that operations are valid
// for the value being used.
let firstName: string = "John";
let lastName: string = "Doe";
let fullName: string = `${firstName} ${lastName}`;

console.log(fullName); // "John Doe"

let firstNumber: number = 10;
let secondNumber: number = 20;
let sum: number = firstNumber + secondNumber;

console.log(sum); // 30

let firstCondition: boolean = true;
let secondCondition: boolean = false;
let bothConditions: boolean = firstCondition && secondCondition;

console.log(bothConditions); // false

// TypeScript rejects operations that require an incompatible type:
// firstName.toFixed(2); // TS2339: Property 'toFixed' does not exist on type 'string'.
// firstNumber.toUpperCase(); // TS2339: Property 'toUpperCase' does not exist on type 'number'.

// -----------------------------------------------------------------------
// 5. `number` vs. `bigint`
// -----------------------------------------------------------------------

// `number` and `bigint` are different JavaScript primitive types.
// The TypeScript types are therefore also distinct.
let regularNumber: number = 42;
let largeInteger: bigint = 42n;

console.log(typeof regularNumber); // "number"
console.log(typeof largeInteger); // "bigint"

// Arithmetic cannot directly mix `number` and `bigint`:
let numberValue: number = 10;
let bigintValue: bigint = 20n;

// const invalidSum = numberValue + bigintValue;
// TS2365: Operator '+' cannot be applied to types 'number' and 'bigint'.

// -----------------------------------------------------------------------
// 6. Type annotations and runtime values
// -----------------------------------------------------------------------

// TypeScript checks the declared types during compilation, but the emitted
// JavaScript does not retain the type annotations at runtime.
let runtimeString: string = "hello";
let runtimeNumber: number = 42;
let runtimeBoolean: boolean = true;

console.log(typeof runtimeString); // "string"
console.log(typeof runtimeNumber); // "number"
console.log(typeof runtimeBoolean); // "boolean"

// The runtime JavaScript values determine the result of `typeof`.
// TypeScript annotations themselves do not exist at runtime.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - `string` represents textual values.
// - `number` represents JavaScript numbers, including integers, fractions, `NaN`, and `Infinity`.
// - `boolean` represents exactly `true` or `false`.
// - TypeScript prevents values of incompatible types from being assigned to these bindings.
// - `number` and `bigint` are distinct types and cannot be mixed directly in arithmetic.
// - Type annotations are compile-time information; runtime values retain their JavaScript types.
