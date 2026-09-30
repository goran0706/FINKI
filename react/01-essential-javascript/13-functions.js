/**
 * Functions
 * =========
 *
 * A function is a callable value that represents a reusable block of code. It can receive
 * input through parameters, perform an operation, return a value, access its surrounding
 * lexical environment, and be passed around like other JavaScript values.
 */

// ---------------------------------------------------------------------
// 1. Function declarations
// ---------------------------------------------------------------------

// A function declaration creates a named function using the `function` keyword.
// Declaring a function does not execute its body; the body runs when the function is called.

function greet() {
  console.log("Hello");
}

greet(); // "Hello"
greet(); // "Hello"
greet(); // "Hello"

// Calling the same function multiple times executes the same function body
// with a new execution context created for each call.

// ---------------------------------------------------------------------
// 2. Parameters and arguments
// ---------------------------------------------------------------------

// Parameters are variables defined by the function.
// Arguments are the actual values supplied when the function is called.

function greetUser(name) {
  console.log(`Hello, ${name}`);
}

greetUser("John"); // "Hello, John"
greetUser("Ada"); // "Hello, Ada"

// A function can define multiple parameters.

function add(first, second) {
  return first + second;
}

console.log(add(2, 3)); // 5

// Arguments are matched to parameters by position.
// If an argument is missing, the corresponding parameter receives `undefined`.

function describeUser(name, age) {
  return `${name} is ${age} years old`;
}

console.log(describeUser("John")); // "John is undefined years old"

// Supplying extra arguments does not create additional parameters.
// They are still available through the function's `arguments` object in
// non-arrow functions, although explicit parameters are normally preferred.

// ---------------------------------------------------------------------
// 3. Return values
// ---------------------------------------------------------------------

// `return` ends the current function execution and provides a value
// to the code that called the function.

function multiply(first, second) {
  return first * second;
}

const result = multiply(4, 5);

console.log(result); // 20

// A function can return any JavaScript value, including objects.

function createUser() {
  return {
    name: "John",
    age: 30,
  };
}

const user = createUser();

console.log(user.name); // "John"

// A function without a return value produces `undefined`.

function performAction() {
  console.log("Action performed");
}

console.log(performAction()); // "Action performed", then undefined

// An explicit `return;` also returns `undefined`.

function doNothing() {}

console.log(doNothing()); // undefined

// ---------------------------------------------------------------------
// 4. `return` stops execution
// ---------------------------------------------------------------------

// Once `return` executes, the current function invocation ends immediately.
// Statements after that return are not executed.

function checkAge(age) {
  if (age < 18) {
    return "Minor";
  }

  return "Adult";
}

console.log(checkAge(15)); // "Minor"
console.log(checkAge(25)); // "Adult"

// An unconditional return makes subsequent statements unreachable during execution.

function getValue() {
  return 42;
  console.log("Never executed"); // unreachable
}

function getValue() {
  return 42;
}

console.log(getValue()); // 42

// ---------------------------------------------------------------------
// 5. Function expressions
// ---------------------------------------------------------------------

// A function expression creates a function value as part of an expression.
// That value can then be assigned to a variable.

const greetPerson = function (name) {
  return `Hello, ${name}`;
};

console.log(greetPerson("John")); // "Hello, John"

// A function expression can have an internal name.
// The name is local to the function and can be useful for recursion and debugging.

const factorial = function calculateFactorial(number) {
  if (number <= 1) {
    return 1;
  }

  return number * calculateFactorial(number - 1);
};

console.log(factorial(5)); // 120

// The internal name `calculateFactorial` is not available in the surrounding scope.
//
// ReferenceError: calculateFactorial is not defined
// console.log(calculateFactorial);

// ---------------------------------------------------------------------
// 6. Function declaration hoisting
// ---------------------------------------------------------------------

// Function declarations are hoisted with their function definition,
// so they can be called before the declaration appears in the source code.

sayHello(); // "Hello"

function sayHello() {
  console.log("Hello");
}

// Function expressions assigned to `const` do not behave this way.
// The `const` binding exists in the temporal dead zone until execution
// reaches its initialization.

//
// ReferenceError: Cannot access 'sayGoodbye' before initialization
//
// sayGoodbye();
//
// const sayGoodbye = function () {
//     return "Goodbye";
// };

const sayGoodbye = function () {
  return "Goodbye";
};

console.log(sayGoodbye()); // "Goodbye"

// The important distinction is that function declarations are callable
// before their declaration, while a function expression assigned to `const`
// can only be called after its variable has been initialized.

// ---------------------------------------------------------------------
// 7. Functions are first-class values
// ---------------------------------------------------------------------

// Functions are values in JavaScript.
// They can be assigned to variables just like strings, numbers, objects, and arrays.

function calculateTotal(price, quantity) {
  return price * quantity;
}

const calculate = calculateTotal;

console.log(calculate(10, 3)); // 30
console.log(calculate === calculateTotal); // true

// Both variables reference the same function object.
// Assigning a function to another variable does not create a new function.

// ---------------------------------------------------------------------
// 8. Passing functions as arguments
// ---------------------------------------------------------------------

// Because functions are values, they can be passed to other functions.
// A function supplied as an argument is commonly called a callback.

function execute(operation) {
  return operation();
}

function getMessage() {
  return "Hello";
}

console.log(execute(getMessage)); // "Hello"

// Notice that `getMessage` is passed without parentheses.
// `getMessage` passes the function itself, while `getMessage()` calls it immediately.

function processValue(value, operation) {
  return operation(value);
}

function double(value) {
  return value * 2;
}

console.log(processValue(5, double)); // 10

// ---------------------------------------------------------------------
// 9. Returning functions
// ---------------------------------------------------------------------

// Functions can also return other functions because functions are first-class values.

function createMultiplier(multiplier) {
  return function (value) {
    return value * multiplier;
  };
}

const doubleValue = createMultiplier(2);
const tripleValue = createMultiplier(3);

console.log(doubleValue(5)); // 10
console.log(tripleValue(5)); // 15

// Each returned function retains access to the `multiplier` value
// associated with the call that created it.

// ---------------------------------------------------------------------
// 10. Function scope and lexical scope
// ---------------------------------------------------------------------

// Variables declared inside a function belong to that function's local scope.

function createGreeting() {
  const message = "Hello";
  return message;
}

console.log(createGreeting()); // "Hello"

// The local variable cannot be accessed directly from outside the function.
//
// ReferenceError: message is not defined
// console.log(message);

// Functions can access variables from their surrounding lexical scope.

const applicationName = "My App";

function getApplicationName() {
  return applicationName;
}

console.log(getApplicationName()); // "My App"

// The function does not need to receive `applicationName` as a parameter.
// It resolves the identifier through its lexical environment.

// ---------------------------------------------------------------------
// 11. Nested functions
// ---------------------------------------------------------------------

// A function can be declared inside another function.
// The nested function is scoped to the outer function.

function createMessage(name) {
  function formatMessage() {
    return `Hello, ${name}`;
  }

  return formatMessage();
}

console.log(createMessage("Ada")); // "Hello, Ada"

// The nested function cannot be referenced directly from outside its scope.
//
// ReferenceError: formatMessage is not defined
// formatMessage();

// A nested function can access variables from its enclosing function,
// such as the `name` parameter above.

// ---------------------------------------------------------------------
// 12. Closures
// ---------------------------------------------------------------------

// When a function retains access to variables from its surrounding lexical
// environment after that outer function has returned, the function forms a closure.

function createCounter() {
  let count = 0;

  return function () {
    count += 1;
    return count;
  };
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// The returned function retains access to `count` even after `createCounter`
// has finished executing.

const firstCounter = createCounter();
const secondCounter = createCounter();

console.log(firstCounter()); // 1
console.log(firstCounter()); // 2
console.log(secondCounter()); // 1

// Each invocation of `createCounter` creates a separate lexical environment,
// so the two counters maintain independent `count` variables.

// ---------------------------------------------------------------------
// 13. Higher-order functions
// ---------------------------------------------------------------------

// A higher-order function accepts a function as an argument, returns a function,
// or does both.

function applyOperation(value, operation) {
  return operation(value);
}

function square(value) {
  return value * value;
}

console.log(applyOperation(4, square)); // 16

// `applyOperation` is a higher-order function because it receives `operation`,
// which is itself a function.

// ---------------------------------------------------------------------
// 14. Recursion
// ---------------------------------------------------------------------

// A recursive function calls itself.
// A recursive implementation needs a base case that eventually stops the recursion.

function countdown(number) {
  if (number <= 0) {
    return;
  }

  console.log(number);
  countdown(number - 1);
}

countdown(3); // 3, 2, 1

// Each recursive call creates a new function execution context.
// The recursion terminates when the base case returns.

// ---------------------------------------------------------------------
// 15. Function declarations vs. function expressions
// ---------------------------------------------------------------------

// Both forms create callable functions, but they differ in syntax and initialization.

function declaredFunction() {
  return "declaration";
}

const expressedFunction = function () {
  return "expression";
};

console.log(declaredFunction()); // "declaration"
console.log(expressedFunction()); // "expression"

// A function declaration is hoisted with its definition.
// A function expression is evaluated when execution reaches the expression,
// and the resulting function value is assigned to its variable.

console.log(typeof declaredFunction); // "function"
console.log(typeof expressedFunction); // "function"

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A function is a callable JavaScript value that encapsulates reusable behavior.
// - Parameters receive values supplied through arguments.
// - Missing arguments produce `undefined` for their corresponding parameters.
// - `return` provides a value and immediately terminates the current function call.
// - Functions without an explicit return value produce `undefined`.
// - Function declarations and function expressions both create callable functions.
// - Function declarations are hoisted with their definitions.
// - Function declarations create functions with a `prototype` property and can be used as constructors with `new`.
// - Function expressions assigned to `const` are unavailable before initialization.
// - Functions are first-class values that can be assigned, passed, and returned.
// - Nested functions can access variables from their surrounding lexical scope.
// - A closure preserves access to its surrounding lexical environment.
// - Higher-order functions accept functions, return functions, or do both.
// - Recursive functions call themselves and require a terminating base case.
