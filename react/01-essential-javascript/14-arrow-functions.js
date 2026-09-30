/**
 * Arrow Functions
 * ===============
 *
 * Arrow functions are function expressions that use `=>` syntax and provide a concise way
 * to define functions. They differ from regular functions in several important ways:
 * arrow functions capture `this` lexically, do not have their own `arguments` object,
 * cannot be used as constructors, and do not have a `prototype` property.
 */

// ---------------------------------------------------------------------
// 1. Basic arrow function syntax
// ---------------------------------------------------------------------

// An arrow function assigned to a variable is a function expression.
// The variable must be initialized before the function can be called.
// Parameters appear on the left of `=>`, and the function body appears on the right.

const greet = () => {
  return "Hello";
};

console.log(greet()); // "Hello"

// The function body is not executed when the function is created.
// It executes when the function is called.

// ---------------------------------------------------------------------
// 2. Parameters
// ---------------------------------------------------------------------

// With no parameters, use empty parentheses.

const getMessage = () => {
  return "Hello, world!";
};

// With one parameter, parentheses are optional.

const square = (number) => {
  return number * number;
};

// With multiple parameters, parentheses are required.

const add = (first, second) => {
  return first + second;
};

console.log(getMessage()); // "Hello, world!"
console.log(square(5)); // 25
console.log(add(2, 3)); // 5

// Parentheses around a single parameter are also valid.
// They are often preferred when keeping parameter formatting consistent.

const double = (number) => {
  return number * 2;
};

console.log(double(4)); // 8

// ---------------------------------------------------------------------
// 3. Implicit return
// ---------------------------------------------------------------------

// An arrow function can use a concise body when it contains a single expression.
// The expression is returned automatically without braces or the `return` keyword.

const multiply = (first, second) => first * second;
const isAdult = (age) => age >= 18;

console.log(multiply(4, 5)); // 20
console.log(isAdult(20)); // true

// The value of the expression becomes the function's return value.

// ---------------------------------------------------------------------
// 4. Block bodies require an explicit return
// ---------------------------------------------------------------------

// When braces are used, the arrow function has a block body.
// A block body does not implicitly return its final expression.

const subtract = (first, second) => {
  const result = first - second;
  return result;
};

console.log(subtract(10, 3)); // 7

// Forgetting `return` causes the function to return `undefined`.

const incorrectSubtract = (first, second) => {
  first - second;
};

console.log(incorrectSubtract(10, 3)); // undefined

// ---------------------------------------------------------------------
// 5. Returning an object literal
// ---------------------------------------------------------------------

// With a concise body, `{}` immediately after `=>` is interpreted as a block body.
// Wrap an object literal in parentheses when it should be returned implicitly.

const createUser = (name) => ({
  name: name,
  active: true,
});

console.log(createUser("John")); // { name: "John", active: true }

// Without the parentheses, the braces would be interpreted as the function body
// rather than as an object literal to return.

// ---------------------------------------------------------------------
// 6. Multiline arrow function bodies
// ---------------------------------------------------------------------

// Arrow functions can contain multiple statements when a block body is used.
// A block body requires an explicit `return` when the function should produce a value.

const calculateTotal = (price, quantity) => {
  const subtotal = price * quantity;
  const tax = subtotal * 0.2;
  return subtotal + tax;
};

console.log(calculateTotal(100, 2)); // 240

// A concise body is appropriate when the operation can be expressed as one expression.
// A block body is useful when intermediate values or multiple statements improve clarity.

// ---------------------------------------------------------------------
// 7. Arrow functions as callbacks
// ---------------------------------------------------------------------

// Arrow functions are commonly used as concise callbacks for array methods.

const numbers = [1, 2, 3, 4];

const doubled = numbers.map((number) => number * 2);
const evenNumbers = numbers.filter((number) => number % 2 === 0);

console.log(doubled); // [2, 4, 6, 8]
console.log(evenNumbers); // [2, 4]

// The arrow function is passed to `map` and `filter` as a function value.
// The array method calls that function for each relevant element.

// ---------------------------------------------------------------------
// 8. Lexical `this`
// ---------------------------------------------------------------------

// Arrow functions do not create their own `this`.
// Instead, they capture `this` from the surrounding lexical scope.

const user = {
  name: "John",

  greet() {
    const sayName = () => {
      return this.name;
    };

    return sayName();
  },
};

console.log(user.greet()); // "John"

// `greet` is a regular method, so `this` is determined by the call `user.greet()`.
// `sayName` is an arrow function, so it captures that same `this` value.

// A regular nested function would have its own `this` behavior instead.

// ---------------------------------------------------------------------
// 9. Lexical `this` with asynchronous callbacks
// ---------------------------------------------------------------------

// The same lexical `this` behavior is useful with asynchronous callbacks.
// The arrow callback captures `this` from `incrementLater`.

const counter = {
  value: 0,

  incrementLater() {
    setTimeout(() => {
      this.value += 1;
      console.log(this.value);
    }, 0);
  },
};

counter.incrementLater(); // 1

// `incrementLater` is called as a method, so its `this` is `counter`.
// The arrow function passed to `setTimeout` captures that `this` value.
// The callback runs later, after `incrementLater` has returned, but the captured
// `this` still refers to `counter`.

// ---------------------------------------------------------------------
// 10. Arrow functions do not have their own `arguments`
// ---------------------------------------------------------------------

// Regular functions have an `arguments` object containing the arguments
// supplied during the current function call.

function regularFunction(first, second) {
  return arguments.length;
}

console.log(regularFunction(1, 2, 3)); // 3

// Arrow functions do not create their own `arguments` object.
// Use a rest parameter when an arrow function needs to collect its arguments.

const countArguments = (...args) => {
  return args.length;
};

console.log(countArguments(1, 2, 3)); // 3
console.log(countArguments("a", "b")); // 2

// The rest parameter creates a real array containing the collected arguments.

// ---------------------------------------------------------------------
// 11. Arrow functions cannot be constructors
// ---------------------------------------------------------------------

// Ordinary functions can be constructable when they have the required
// internal constructor capability.

function User(name) {
  this.name = name;
}

const userInstance = new User("John");

console.log(userInstance.name); // "John"

// Arrow functions are not constructable.
// Calling an arrow function with `new` throws a TypeError.

const createUserObject = (name) => ({
  name: name,
});

// TypeError: createUserObject is not a constructor
// const userObject = new createUserObject("John");

// Arrow functions also do not have a `prototype` property.

console.log(createUserObject.prototype); // undefined

// Ordinary constructor-capable functions have a `prototype` property
// that is used when creating instances with `new`.

console.log(typeof User.prototype); // "object"

// ---------------------------------------------------------------------
// 12. Arrow functions and function expressions
// ---------------------------------------------------------------------

// Both of these are function expressions.
// The difference is in the function syntax and semantics, not whether they
// are expressions.

const regularExpression = function (number) {
  return number * 2;
};

const arrowExpression = (number) => number * 2;

console.log(regularExpression(5)); // 10
console.log(arrowExpression(5)); // 10

// Both can be assigned to variables, passed as arguments, and returned from functions.
// Their behavior differs for `this`, `arguments`, and constructor capability.

// ---------------------------------------------------------------------
// 13. Arrow functions and regular functions
// ---------------------------------------------------------------------

// Arrow functions are useful for concise operations and callbacks,
// especially when lexical `this` is desired.

const names = ["John", "Jane", "Alice"];
const upperCaseNames = names.map((name) => name.toUpperCase());

console.log(upperCaseNames); // ["JOHN", "JANE", "ALICE"]

// Regular functions are appropriate when a function needs its own `this`,
// needs to be constructable with `new`, or when a function declaration is preferable.

function createPerson(name) {
  this.name = name;
}

const person = new createPerson("John");

console.log(person.name); // "John"

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Arrow functions are function expressions that use `=>` syntax.
// - Parentheses are required for no parameters or multiple parameters and optional for one parameter.
// - A concise arrow body implicitly returns its expression.
// - A block body requires an explicit `return`.
// - Object literals returned implicitly must be wrapped in parentheses.
// - Arrow functions are commonly used as concise callbacks.
// - Arrow functions capture `this` lexically instead of creating their own `this`.
// - Arrow functions do not have their own `arguments` object; rest parameters can collect arguments instead.
// - Arrow functions cannot be used as constructors with `new`.
// - Arrow functions do not have a `prototype` property.
// - Regular functions can have their own `this`, `arguments`, and constructor capability.
// - Arrow functions and regular functions are both function values, but their semantics differ.
