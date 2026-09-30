/**
 * Higher-Order Functions
 * ======================
 *
 * A higher-order function is a function that accepts another function as an argument,
 * returns a function, or does both. Because functions are values in JavaScript, they
 * can be passed around, stored, and returned like other values.
 *
 * Higher-order functions are commonly used for callbacks, array methods, function
 * factories, composition, and other patterns that separate reusable control flow
 * from the specific operation being performed.
 */

// ---------------------------------------------------------------------
// 1. What is a higher-order function?
// ---------------------------------------------------------------------

// A higher-order function works with other functions as values.
// It can receive a function as an argument and invoke it when needed.

function execute(operation) {
  return operation();
}

function sayHello() {
  return "Hello!";
}

const result = execute(sayHello);

console.log(result); // "Hello!"

// `execute` is a higher-order function because it accepts a function.
// `sayHello` is the function passed to `execute`.

// ---------------------------------------------------------------------
// 2. Functions are values
// ---------------------------------------------------------------------

// JavaScript functions are first-class values.
// They can be assigned to variables, passed as arguments, and returned from functions.

function add(first, second) {
  return first + second;
}

const operation = add;
const sum = operation(10, 20);

console.log(sum); // 30

// Assigning a function does not call it.
// `operation = add` stores a reference to the same function.
// `operation(10, 20)` invokes that function.

// ---------------------------------------------------------------------
// 3. Passing a function as an argument
// ---------------------------------------------------------------------

// A higher-order function can receive a function that determines
// which operation should be performed.

function calculate(first, second, operation) {
  return operation(first, second);
}

function multiply(first, second) {
  return first * second;
}

function subtract(first, second) {
  return first - second;
}

console.log(calculate(5, 3, multiply)); // 15
console.log(calculate(5, 3, subtract)); // 2

// `calculate` contains the common control flow.
// The caller supplies the operation to perform.

// ---------------------------------------------------------------------
// 4. Callbacks
// ---------------------------------------------------------------------

// A callback is a function passed to another function so that the receiving
// function can invoke it at a particular point during its execution.
// A callback can be invoked immediately or later, depending on the API.

function processUser(name, callback) {
  const message = `Processing ${name}`;
  callback(message);
}

function printMessage(message) {
  console.log(message);
}

processUser("John", printMessage); // "Processing John"

// `printMessage` is the callback.
// `processUser` is the higher-order function because it receives a function.

// A callback describes what should happen when the receiving function
// reaches the point where it invokes the callback.

// ---------------------------------------------------------------------
// 5. Callbacks can receive arguments
// ---------------------------------------------------------------------

// The receiving function controls which arguments are passed to the callback.

function transformValue(value, callback) {
  return callback(value);
}

const doubled = transformValue(10, (value) => value * 2);
const uppercased = transformValue("hello", (value) => value.toUpperCase());

console.log(doubled); // 20
console.log(uppercased); // "HELLO"

// The callback determines how the supplied value is transformed.

// ---------------------------------------------------------------------
// 6. Higher-order functions can return functions
// ---------------------------------------------------------------------

// A higher-order function can create and return another function.
// The returned function can then be stored and called independently.

function createGreeting(greeting) {
  return function (name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHelloTo = createGreeting("Hello");
const sayGoodbyeTo = createGreeting("Goodbye");

console.log(sayHelloTo("John")); // "Hello, John!"
console.log(sayGoodbyeTo("John")); // "Goodbye, John!"

// Each returned function retains access to the `greeting` value
// from the call that created it.

// ---------------------------------------------------------------------
// 7. Higher-order functions with arrow functions
// ---------------------------------------------------------------------

// Arrow functions are commonly used for short callbacks.

function calculateValue(value, operation) {
  return operation(value);
}

const squared = calculateValue(5, (value) => value * value);
const tripled = calculateValue(5, (value) => value * 3);

console.log(squared); // 25
console.log(tripled); // 15

// The callback can be written inline when the operation is simple.

// ---------------------------------------------------------------------
// 8. Array methods as higher-order functions
// ---------------------------------------------------------------------

// Many array methods are higher-order functions because they accept callbacks.
// Common examples include `map`, `filter`, `find`, `some`, `every`, and `reduce`.

const numbers = [1, 2, 3, 4, 5];

const doubledNumbers = numbers.map((number) => number * 2);
const evenNumbers = numbers.filter((number) => number % 2 === 0);

console.log(doubledNumbers); // [2, 4, 6, 8, 10]
console.log(evenNumbers); // [2, 4]

// The array method controls the iteration.
// The callback defines the operation performed for each relevant element.

// ---------------------------------------------------------------------
// 9. `map` transforms values
// ---------------------------------------------------------------------

// `map` invokes its callback for each element and creates a new array
// containing the values returned by the callback.

const prices = [10, 20, 30];

const discountedPrices = prices.map((price) => price * 0.9);

console.log(discountedPrices); // [9, 18, 27]

// The callback receives each element and returns its transformed value.
// `map` collects those returned values into a new array.

// ---------------------------------------------------------------------
// 10. `filter` selects values
// ---------------------------------------------------------------------

// `filter` creates a new array containing the elements for which
// the callback returns a truthy value.

const ages = [12, 17, 18, 21, 30];

const adults = ages.filter((age) => age >= 18);

console.log(adults); // [18, 21, 30]

// The callback does not determine a replacement value.
// It determines whether each element is included in the result.

// ---------------------------------------------------------------------
// 11. `find` searches for a value
// ---------------------------------------------------------------------

// `find` invokes its callback until it finds an element for which
// the callback returns a truthy value.

const users = [
  { name: "John", age: 25 },
  { name: "Jane", age: 31 },
  { name: "Mike", age: 19 },
];

const matchingUser = users.find((user) => user.age >= 30);

console.log(matchingUser); // { name: "Jane", age: 31 }

// `find` returns the first matching element.
// If no element matches, it returns `undefined`.

// ---------------------------------------------------------------------
// 12. `reduce` combines values
// ---------------------------------------------------------------------

// `reduce` invokes its callback while carrying an accumulator
// from one iteration to the next.

const values = [10, 20, 30];

const total = values.reduce((sum, value) => sum + value, 0);

console.log(total); // 60

// The callback receives the accumulated value and the current element.
// The second argument (`0`) is the initial accumulator value.

// ---------------------------------------------------------------------
// 13. Reusable control flow
// ---------------------------------------------------------------------

// Higher-order functions allow common control flow to be written once
// while the caller supplies the operation performed during that control flow.

function repeat(count, action) {
  for (let index = 0; index < count; index++) {
    action(index);
  }
}

repeat(3, (index) => {
  console.log(`Iteration ${index}`);
});

// Output:
// Iteration 0
// Iteration 1
// Iteration 2

// `repeat` controls when and how often the callback is invoked.
// The callback controls what happens during each iteration.

// ---------------------------------------------------------------------
// 14. Separating iteration from transformation
// ---------------------------------------------------------------------

// A higher-order function can own the iteration logic while callers
// provide different transformations.

function processNumbers(numbers, operation) {
  const results = [];

  for (const number of numbers) {
    results.push(operation(number));
  }

  return results;
}

const numbersToProcess = [1, 2, 3, 4];

const squares = processNumbers(numbersToProcess, (number) => number * number);
const cubes = processNumbers(numbersToProcess, (number) => number * number * number);

console.log(squares); // [1, 4, 9, 16]
console.log(cubes); // [1, 8, 27, 64]

// The iteration logic is written once.
// Different operations can be supplied without changing `processNumbers`.

// ---------------------------------------------------------------------
// 15. Returning specialized functions
// ---------------------------------------------------------------------

// A higher-order function can return a specialized function based on
// a value supplied when the higher-order function is called.

function multiplyBy(factor) {
  return (value) => value * factor;
}

const multiplyBy2 = multiplyBy(2);
const multiplyBy10 = multiplyBy(10);

console.log(multiplyBy2(5)); // 10
console.log(multiplyBy10(5)); // 50

// `multiplyBy` returns a different configured function for each factor.
// The returned function retains access to its corresponding `factor`.

// ---------------------------------------------------------------------
// 16. Function factories
// ---------------------------------------------------------------------

// A function that creates and returns other functions is often called
// a function factory.

function createValidator(minimumLength) {
  return function (value) {
    return value.length >= minimumLength;
  };
}

const isLongEnough = createValidator(8);
const isVeryLong = createValidator(12);

console.log(isLongEnough("JavaScript")); // true
console.log(isVeryLong("JavaScript")); // false

// Each factory call creates a function with its own configuration.
// The returned function retains access to that configuration.

// ---------------------------------------------------------------------
// 17. Function composition
// ---------------------------------------------------------------------

// Higher-order functions can combine smaller functions into a new function.
// The result of one function becomes the input to the next function.

function compose(first, second) {
  return (value) => second(first(value));
}

const addFive = (value) => value + 5;
const double = (value) => value * 2;

const addFiveThenDouble = compose(addFive, double);

console.log(addFiveThenDouble(10)); // 30

// Evaluation:
// 10 -> addFive -> 15 -> double -> 30

// Composition allows small functions to be combined into larger operations.

// ---------------------------------------------------------------------
// 18. Higher-order functions and side effects
// ---------------------------------------------------------------------

// A callback can perform side effects such as logging or modifying
// external state. Whether that is appropriate depends on the operation.

const valuesToLog = [1, 2, 3];

valuesToLog.forEach((value) => {
  console.log(`Value: ${value}`);
});

// Output:
// Value: 1
// Value: 2
// Value: 3

// `forEach` is a higher-order function.
// It invokes the callback once for each element.

// ---------------------------------------------------------------------
// 19. `map` vs. `forEach`
// ---------------------------------------------------------------------

// Both methods accept callbacks, but they have different purposes.
// `map` creates a new array; `forEach` returns `undefined`.

const scores = [10, 20, 30];

const doubledScores = scores.map((score) => score * 2);

scores.forEach((score) => {
  console.log(score);
});

console.log(doubledScores); // [20, 40, 60]

// Use `map` when the callback produces transformed values.
// Use `forEach` when the callback performs an action for each element.

// ---------------------------------------------------------------------
// 20. Common mistake: calling instead of passing a function
// ---------------------------------------------------------------------

// When an API expects a function, pass the function value itself.
// Adding `()` calls the function immediately and passes its return value instead.

function greet() {
  return "Hello!";
}

function run(callback) {
  return callback();
}

console.log(run(greet)); // "Hello!"

// `greet` is passed as a function value.
// `greet()` is called immediately, producing the string `"Hello!"`.
// Passing that string to `run` causes `callback()` to throw a TypeError.

// TypeError: callback is not a function
// console.log(run(greet()));

// ---------------------------------------------------------------------
// 21. Common mistake: forgetting to return from a callback
// ---------------------------------------------------------------------

// A concise arrow body implicitly returns its expression.
// An arrow function with a block body requires an explicit `return`.

const originalNumbers = [1, 2, 3];

const correct = originalNumbers.map((number) => number * 2);

const incorrect = originalNumbers.map((number) => {
  number * 2;
});

console.log(correct); // [2, 4, 6]
console.log(incorrect); // [undefined, undefined, undefined]

const fixed = originalNumbers.map((number) => {
  return number * 2;
});

console.log(fixed); // [2, 4, 6]

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A higher-order function accepts a function, returns a function, or does both.
// - JavaScript functions are first-class values and can be passed and returned.
// - A callback is a function passed to another function for that function to invoke.
// - `map`, `filter`, `find`, `reduce`, and `forEach` are higher-order array methods.
// - Higher-order functions separate reusable control flow from the operation being performed.
// - Higher-order functions can create specialized functions and function factories.
// - Returned functions can retain access to values from the call that created them.
// - Function composition combines smaller functions into larger operations.
// - Pass `greet`, not `greet()`, when an API expects a function.
// - Arrow functions with block bodies require an explicit `return` when producing a value.
