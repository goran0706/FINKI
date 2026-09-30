/**
 * Function Types
 * ==============
 *
 * Function types describe the parameters a function accepts and the type of
 * value it returns. TypeScript uses these types to check function arguments
 * and return values.
 */

// -----------------------------------------------------------------------
// 1. Typing function parameters
// -----------------------------------------------------------------------

// Each function parameter can have an explicit type.
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("John Doe")); // "Hello, John Doe!"

// TypeScript checks arguments against the parameter types.
// greet(30); // TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

// -----------------------------------------------------------------------
// 2. Typing return values
// -----------------------------------------------------------------------

// The return type is written after the parameter list.
function add(a: number, b: number): number {
  return a + b;
}

function isAdult(age: number): boolean {
  return age >= 18;
}

console.log(add(10, 5)); // 15
console.log(isAdult(30)); // true
console.log(isAdult(16)); // false

// TypeScript checks that the returned value matches the declared return type.
// function getName(): string {
//   return 42;
// }
// TS2322: Type 'number' is not assignable to type 'string'.

// -----------------------------------------------------------------------
// 3. Functions returning void
// -----------------------------------------------------------------------

// `void` is used when a function does not return a meaningful value.
function logMessage(message: string): void {
  console.log(message);
}

logMessage("Hello, TypeScript!"); // "Hello, TypeScript!"

// A function declared with `void` cannot return a value.
// function invalidLog(message: string): void {
//   return message;
// }
// TS2322: Type 'string' is not assignable to type 'void'.

// -----------------------------------------------------------------------
// 4. Functions returning never
// -----------------------------------------------------------------------

// `never` describes a function that never successfully returns to its caller.
function throwError(message: string): never {
  throw new Error(message);
}

// The function always throws an error instead of returning a value.
// throwError("Something went wrong");

// -----------------------------------------------------------------------
// 5. Function type aliases
// -----------------------------------------------------------------------

// A function type can be stored in a type alias and reused.
type Operation = (a: number, b: number) => number;

const addNumbers: Operation = (a, b) => a + b;
const multiplyNumbers: Operation = (a, b) => a * b;

console.log(addNumbers(10, 5)); // 15
console.log(multiplyNumbers(10, 5)); // 50

// The assigned function must match the parameter and return types.
// const subtract: Operation = (a: string, b: string) => a - b;
// TS2322: Type '(a: string, b: string) => number' is not assignable to type 'Operation'.

// -----------------------------------------------------------------------
// 6. Function types as parameters
// -----------------------------------------------------------------------

// A function can accept another function as a parameter.
function calculate(a: number, b: number, operation: (x: number, y: number) => number): number {
  return operation(a, b);
}

const sum = calculate(10, 5, (a, b) => a + b);
const product = calculate(10, 5, (a, b) => a * b);

console.log(sum); // 15
console.log(product); // 50

// The callback must accept two numbers and return a number.

// -----------------------------------------------------------------------
// 7. Function types as return values
// -----------------------------------------------------------------------

// A function can return another function.
function createMultiplier(multiplier: number): (value: number) => number {
  return (value) => value * multiplier;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(10)); // 20
console.log(triple(10)); // 30

// TypeScript knows that `double` and `triple` are functions accepting a number
// and returning a number.

// -----------------------------------------------------------------------
// 8. Optional parameters
// -----------------------------------------------------------------------

// A parameter can be optional by placing `?` after its name.
function greetUser(name: string, title?: string): string {
  if (title) {
    return `Hello, ${title} ${name}!`;
  }

  return `Hello, ${name}!`;
}

console.log(greetUser("John Doe")); // "Hello, John Doe!"
console.log(greetUser("John Doe", "Developer")); // "Hello, Developer John Doe!"

// Optional parameters must come after required parameters.
// function invalidGreeting(title?: string, name: string): string {
//   return `Hello, ${title} ${name}!`;
// }
// TS1016: A required parameter cannot follow an optional parameter.

// -----------------------------------------------------------------------
// 9. Default parameters
// -----------------------------------------------------------------------

// A parameter with a default value is automatically optional when calling the function.
function createGreeting(name: string, greeting = "Hello"): string {
  return `${greeting}, ${name}!`;
}

console.log(createGreeting("John Doe")); // "Hello, John Doe!"
console.log(createGreeting("John Doe", "Welcome")); // "Welcome, John Doe!"

// The default value is used when the argument is omitted.

// -----------------------------------------------------------------------
// 10. Arrow function types
// -----------------------------------------------------------------------

// Arrow functions can have typed parameters and return values.
const subtract = (a: number, b: number): number => a - b;

const divide = (a: number, b: number): number => a / b;

console.log(subtract(10, 5)); // 5
console.log(divide(10, 2)); // 5

// Function types can also be applied through a type alias.
const remainder: Operation = (a, b) => a % b;

console.log(remainder(10, 3)); // 1

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - Function types describe parameter types and return types.
// - Function parameters can be required, optional, or have default values.
// - Return types can be explicitly declared with `: Type`.
// - `void` describes functions that do not return a meaningful value.
// - `never` describes functions that never successfully return.
// - Function types can be stored in type aliases and reused.
// - Functions can accept other functions as parameters or return functions as values.
