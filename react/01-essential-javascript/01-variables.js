/**
 * Variables
 * =========
 *
 * A variable is a named reference to a value stored in memory.
 * A declaration creates the binding in the current scope, while an assignment gives
 * that binding a value.
 *
 * JavaScript provides three variable declaration keywords: `var`, `let`, and `const`.
 * They share the basic mechanics of declaration and assignment, but differ in scope,
 * redeclaration, reassignment, and hoisting behavior.
 */

// ---------------------------------------------------------------------
// 1. Declaration and assignment
// ---------------------------------------------------------------------

// A declaration introduces the variable name.
// Initialization assigns its first value as part of the declaration.
// Assignment can also happen later as a separate statement.

let username = "john"; // declaration + initialization
let age; // declaration only -> value is `undefined`
age = 30; // assignment after declaration

console.log(username); // "john"
console.log(age); // 30

// ---------------------------------------------------------------------
// 2. The three declaration keywords
// ---------------------------------------------------------------------

var legacyVariable = "declared with var"; // function-scoped, reassignable, redeclarable
let mutableVariable = "declared with let"; // block-scoped, reassignable, not redeclarable
const constantVariable = "declared with const"; // block-scoped, not reassignable, not redeclarable, must be initialized

// `const` makes the binding immutable, not the referenced object.
// The object's properties can still be changed.

const user = { name: "John Doe" };
user.name = "J. Doe"; // allowed -> the binding still references the same object
// user = {};         // not allowed -> TypeError: Assignment to constant variable.

// Modern recommendation:
// - Prefer `const` by default.
// - Use `let` when the binding must be reassigned.
// - Avoid `var` in modern code.

// ---------------------------------------------------------------------
// 3. Variables are dynamically typed
// ---------------------------------------------------------------------

// A JavaScript variable does not have a permanent type.
// A `let` binding can be reassigned to values of different types.

let value = 42; // number
value = "hello"; // string
value = true; // boolean

console.log(typeof value); // "boolean"

// `const` prevents reassignment of the binding, but JavaScript remains dynamically typed.

const fixedValue = 42;
// fixedValue = "hello"; // TypeError: Assignment to constant variable.
// TypeScript can add static type checking on top of JavaScript.

// ---------------------------------------------------------------------
// 4. Declaring multiple variables
// ---------------------------------------------------------------------

// Multiple bindings can be declared in a single statement.
// Each binding can have its own initializer.

let firstName = "Ada",
  lastName = "Lovelace";

console.log(firstName); // "Ada"
console.log(lastName); // "Lovelace"

// A declaration without an initializer produces `undefined`.

let a = 1,
  b,
  c = 3;

console.log(a); // 1
console.log(b); // undefined
console.log(c); // 3

// One declaration per statement is generally preferred for readability.
// It makes each binding and its initialization easier to scan.

// ---------------------------------------------------------------------
// 5. Identifier rules and naming conventions
// ---------------------------------------------------------------------

// Valid identifiers can contain letters, digits, `$`, and `_`.
// They cannot begin with a digit and are case-sensitive.

let $element = null;
let _privateLookingValue = 10;
let count2 = 0;
let valueName = "lowercase";
let ValueName = "uppercase";

console.log(valueName); // "lowercase"
console.log(ValueName); // "uppercase"

// Identifiers cannot be reserved words.

// let 2ndPlace = "invalid"; // SyntaxError
// let class = "invalid";    // SyntaxError

// Common naming conventions:
// - camelCase for variables and functions
// - PascalCase for classes and React components
// - UPPER_SNAKE_CASE for constants representing fixed configuration values

let userCount = 0;

function UserCard() {}

const MAX_RETRIES = 3;

// ---------------------------------------------------------------------
// 6. Redeclaration and reassignment
// ---------------------------------------------------------------------

// Redeclaration introduces the same binding again in the same scope.
// Reassignment changes the value stored in an existing binding.

var canBeRedeclared = 1;
var canBeRedeclared = 2; // allowed -> `var` permits redeclaration
console.log(canBeRedeclared); // 2

let canBeReassigned = 1;
canBeReassigned = 2; // allowed -> `let` permits reassignment
console.log(canBeReassigned); // 2

const cannotBeReassigned = 1;
// cannotBeReassigned = 2; // TypeError: Assignment to constant variable.

// `let` and `const` do not allow redeclaration in the same scope.

// let cannotBeRedeclared = 1;
// let cannotBeRedeclared = 2; // SyntaxError: Identifier has already been declared

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A variable is a named binding that allows code to refer to a value.
// Declaration introduces a binding; initialization gives it its first value.
// Assignment changes the value stored in an existing binding.
// `var` is function-scoped and permits redeclaration and reassignment.
// `let` is block-scoped and permits reassignment but not redeclaration.
// `const` is block-scoped and prevents reassignment of its binding.
// `const` does not make referenced objects or arrays immutable.
// JavaScript variables are dynamically typed, so a `let` binding can hold values of different types.
