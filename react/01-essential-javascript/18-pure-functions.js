/**
 * Pure Functions
 * ==============
 *
 * A pure function produces the same result when called with the same inputs and does not
 * cause observable side effects outside the function. It depends only on its inputs and
 * does not modify external state.
 *
 * Pure functions are predictable, easy to test, and compose naturally with other functions.
 */

// ---------------------------------------------------------------------
// 1. What is a pure function?
// ---------------------------------------------------------------------

// A pure function depends only on its parameters and returns a result
// without changing anything outside the function.

function addNumbers(first, second) {
  return first + second;
}

console.log(addNumbers(2, 3)); // 5
console.log(addNumbers(2, 3)); // 5
console.log(addNumbers(10, 20)); // 30

// The same inputs always produce the same result.
// Calling the function does not modify external state.

// ---------------------------------------------------------------------
// 2. Same input, same output
// ---------------------------------------------------------------------

// Deterministic behavior is a defining property of a pure function.

function multiplyNumbers(first, second) {
  return first * second;
}

console.log(multiplyNumbers(4, 5)); // 20
console.log(multiplyNumbers(4, 5)); // 20
console.log(multiplyNumbers(4, 5)); // 20

// `multiplyNumbers(4, 5)` always produces `20` because the result
// depends only on the values supplied to the function.

// ---------------------------------------------------------------------
// 3. External mutable state makes a function impure
// ---------------------------------------------------------------------

// A function that reads mutable external state does not depend only
// on its parameters.

let taxRate = 0.2;

function calculateTax(price) {
  return price * taxRate;
}

console.log(calculateTax(100)); // 20

taxRate = 0.3;

console.log(calculateTax(100)); // 30

// The same argument produces different results because the function
// reads the external `taxRate` variable.

// A pure version receives the required value explicitly:

function calculateTaxPure(price, rate) {
  return price * rate;
}

console.log(calculateTaxPure(100, 0.2)); // 20
console.log(calculateTaxPure(100, 0.2)); // 20

// All information required to calculate the result is provided as input.

// ---------------------------------------------------------------------
// 4. Modifying external state makes a function impure
// ---------------------------------------------------------------------

// Changing external state is an observable side effect.

let total = 0;

function addToTotal(value) {
  total += value;
  return total;
}

console.log(addToTotal(10)); // 10
console.log(addToTotal(10)); // 20

// The result depends on previous calls because the function modifies
// the external `total` variable.

// A pure version returns the calculated value without modifying
// external state:

function calculateNewTotal(total, value) {
  return total + value;
}

console.log(calculateNewTotal(0, 10)); // 10
console.log(calculateNewTotal(10, 10)); // 20

// The caller decides what to do with the returned value.

// ---------------------------------------------------------------------
// 5. Local variables do not make a function impure
// ---------------------------------------------------------------------

// Creating or modifying local variables is not an observable side effect
// when those variables are not exposed outside the function.

function calculateTotal(price, tax) {
  const subtotal = price + price * tax;

  return subtotal;
}

console.log(calculateTotal(100, 0.2)); // 120

// `subtotal` exists only inside the function.
// Its creation does not affect external state.

// ---------------------------------------------------------------------
// 6. Pure functions and primitive values
// ---------------------------------------------------------------------

// Primitive values are immutable, which makes them straightforward
// to use in pure transformations.

function capitalize(name) {
  return name.toUpperCase();
}

const name = "john";

console.log(capitalize(name)); // "JOHN"
console.log(name); // "john"

// The original string is unchanged.
// `capitalize` creates and returns a new string value.

// ---------------------------------------------------------------------
// 7. Pure functions and arrays
// ---------------------------------------------------------------------

// A pure function should not mutate an input array.
// Instead, it can create and return a new array.

function doubleNumbers(numbers) {
  return numbers.map((number) => number * 2);
}

const numbers = [1, 2, 3];
const doubled = doubleNumbers(numbers);

console.log(doubled); // [2, 4, 6]
console.log(numbers); // [1, 2, 3]

// `map` creates a new array, so the input array remains unchanged.

// ---------------------------------------------------------------------
// 8. Mutation makes a function impure
// ---------------------------------------------------------------------

// `push` mutates the array supplied by the caller.

function addNumber(numbers, number) {
  numbers.push(number);
  return numbers;
}

const values = [1, 2];
const result = addNumber(values, 3);

console.log(result); // [1, 2, 3]
console.log(values); // [1, 2, 3]

// The function changed an object owned by the caller.
// That mutation is an observable side effect.

// A pure alternative creates a new array:

function addNumberPure(numbers, number) {
  return [...numbers, number];
}

const originalValues = [1, 2];
const newValues = addNumberPure(originalValues, 3);

console.log(newValues); // [1, 2, 3]
console.log(originalValues); // [1, 2]

// The original array remains unchanged.

// ---------------------------------------------------------------------
// 9. Pure functions and objects
// ---------------------------------------------------------------------

// Mutating an object supplied by the caller is also an observable side effect.

function activateUser(user) {
  user.active = true;
  return user;
}

const user = {
  name: "John",
  active: false,
};

const activatedUser = activateUser(user);

console.log(activatedUser); // { name: "John", active: true }
console.log(user); // { name: "John", active: true }

// The original object was modified.

// A pure alternative creates a new object:

function activateUserPure(user) {
  return {
    ...user,
    active: true,
  };
}

const originalUser = {
  name: "John",
  active: false,
};

const newUser = activateUserPure(originalUser);

console.log(newUser); // { name: "John", active: true }
console.log(originalUser); // { name: "John", active: false }

// The original object remains unchanged.

// ---------------------------------------------------------------------
// 10. Referential transparency
// ---------------------------------------------------------------------

// An expression is referentially transparent when it can be replaced
// by its resulting value without changing the program's behavior.

function square(number) {
  return number * number;
}

console.log(square(5)); // 25
console.log(25); // 25

// `square(5)` can be reasoned about as the value `25` because it is
// deterministic and produces no observable side effects.

// This property makes pure expressions easier to reason about,
// substitute, optimize, and compose.

// ---------------------------------------------------------------------
// 11. Pure functions are easy to test
// ---------------------------------------------------------------------

// Because pure functions depend only on their inputs,
// tests can focus directly on input/output relationships.

function isAdult(age) {
  return age >= 18;
}

console.log(isAdult(20)); // true
console.log(isAdult(17)); // false
console.log(isAdult(18)); // true

// Each call is independent.
// No external state needs to be prepared or reset.

// ---------------------------------------------------------------------
// 12. Pure functions are predictable
// ---------------------------------------------------------------------

function getFullName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

console.log(getFullName("John", "Doe")); // "John Doe"
console.log(getFullName("John", "Doe")); // "John Doe"

// The result does not depend on the current time, random values,
// global variables, or external resources.

// ---------------------------------------------------------------------
// 13. Impure functions
// ---------------------------------------------------------------------

// An impure function may read or modify state outside itself.

let counter = 0;

function incrementCounter() {
  counter++;
  return counter;
}

console.log(incrementCounter()); // 1
console.log(incrementCounter()); // 2

// The function modifies external state.
// Its result cannot be determined from its arguments because it has none.

// ---------------------------------------------------------------------
// 14. Common sources of impurity
// ---------------------------------------------------------------------

// Functions can become impure when they interact with external state
// or perform observable operations.
//
// Common examples include:
//
// - modifying global variables
// - modifying objects supplied by callers
// - modifying arrays supplied by callers
// - writing to the DOM
// - logging to the console
// - making network requests
// - reading the current time
// - generating random values
// - writing to storage
//
// Impurity is not inherently bad.
// Applications need side effects to interact with the outside world.

// ---------------------------------------------------------------------
// 15. `Date.now()` makes a function impure
// ---------------------------------------------------------------------

// The result depends on the current time rather than on function inputs.

function getCurrentTime() {
  return Date.now();
}

console.log(getCurrentTime()); // varies with execution time

// Calling the function at different times can produce different results.

// A pure alternative receives the timestamp as an argument:

function formatTime(timestamp) {
  return new Date(timestamp).toISOString();
}

const timestamp = 0;

console.log(formatTime(timestamp)); // "1970-01-01T00:00:00.000Z"

// The result is determined entirely by the supplied timestamp.

// ---------------------------------------------------------------------
// 16. `Math.random()` makes a function impure
// ---------------------------------------------------------------------

// Randomness introduces a changing external source of information.

function createRandomNumber() {
  return Math.random();
}

console.log(createRandomNumber()); // varies with execution

// Calling the function with no arguments does not guarantee the same result.

// The random value can instead be supplied to a pure transformation:

function doubleValue(value) {
  return value * 2;
}

console.log(doubleValue(0.5)); // 1

// The random operation can occur at the boundary while the transformation
// itself remains pure.

// ---------------------------------------------------------------------
// 17. Logging is a side effect
// ---------------------------------------------------------------------

// `console.log` produces observable output outside the function.

function printGreeting(name) {
  console.log(`Hello, ${name}!`);
}

printGreeting("John"); // "Hello, John!"

// The function performs an output operation rather than only calculating
// and returning a value.

// A pure alternative returns the message:

function createGreeting(name) {
  return `Hello, ${name}!`;
}

const greeting = createGreeting("John");

console.log(greeting); // "Hello, John!"

// `createGreeting` performs the pure calculation.
// The logging side effect happens outside the function.

// ---------------------------------------------------------------------
// 18. Pure functions can call other pure functions
// ---------------------------------------------------------------------

// Pure functions compose naturally when each function produces
// a deterministic result without side effects.

function addTax(price, rate) {
  return price + price * rate;
}

function roundPrice(price) {
  return Math.round(price * 100) / 100;
}

function calculateFinalPrice(price, rate) {
  return roundPrice(addTax(price, rate));
}

console.log(calculateFinalPrice(19.99, 0.2)); // 23.99

// Each function performs a deterministic transformation.
// The larger function combines those transformations.

// ---------------------------------------------------------------------
// 19. Function composition
// ---------------------------------------------------------------------

// Pure functions can be chained because each one produces a predictable value.

function trimText(text) {
  return text.trim();
}

function toLowerCase(text) {
  return text.toLowerCase();
}

function addPrefix(text) {
  return `user:${text}`;
}

const username = "  JOHN  ";

const normalizedUsername = addPrefix(toLowerCase(trimText(username)));

console.log(normalizedUsername); // "user:john"

// Each function performs one transformation.
// The output of one function becomes the input of the next.

// ---------------------------------------------------------------------
// 20. Pure functions and higher-order functions
// ---------------------------------------------------------------------

// Higher-order functions can receive pure functions as callbacks.

const prices = [10, 20, 30];

const discountedPrices = prices.map((price) => price * 0.9);
const roundedPrices = discountedPrices.map((price) => Math.round(price));

console.log(discountedPrices); // [9, 18, 27]
console.log(roundedPrices); // [9, 18, 27]

// `map` creates new arrays, and the callbacks perform pure transformations.

// ---------------------------------------------------------------------
// 21. Pure calculation vs side effect
// ---------------------------------------------------------------------

// A useful design is to keep calculations pure and perform side effects
// separately.

function calculateOrderTotal(price, quantity) {
  return price * quantity;
}

const orderTotal = calculateOrderTotal(25, 3);

console.log(orderTotal); // 75

// The calculation is pure.
// Logging is the separate side effect.

// Separating these responsibilities makes the calculation easier
// to test and reason about.

// ---------------------------------------------------------------------
// 22. Pure does not mean "no mutation anywhere"
// ---------------------------------------------------------------------

// A function can mutate data that it creates locally without creating
// an observable mutation outside the function.

function sortNumbers(numbers) {
  const copy = [...numbers];

  copy.sort((a, b) => a - b);

  return copy;
}

const unsorted = [3, 1, 2];
const sorted = sortNumbers(unsorted);

console.log(sorted); // [1, 2, 3]
console.log(unsorted); // [3, 1, 2]

// `sort` mutates `copy`, but `copy` was created inside the function
// and the caller's array remains unchanged.

// ---------------------------------------------------------------------
// 23. Shallow copying is not deep copying
// ---------------------------------------------------------------------

// Spread syntax creates a shallow copy.
// Nested objects remain shared unless they are copied separately.

function updateUserName(user) {
  return {
    ...user,
    profile: {
      ...user.profile,
      name: "Jane",
    },
  };
}

const original = {
  id: 1,
  profile: {
    name: "John",
  },
};

const updated = updateUserName(original);

console.log(updated); // { id: 1, profile: { name: "Jane" } }
console.log(original); // { id: 1, profile: { name: "John" } }

// Each nested object that needs to change must also be copied.

// ---------------------------------------------------------------------
// 24. Pure functions and external boundaries
// ---------------------------------------------------------------------

// External operations such as network requests are inherently impure:
//
// async function getUser() {
//     const response = await fetch("/api/user");
//     return response.json();
// }
//
// The function interacts with an external system, so its result can depend
// on information outside the function's parameters.
//
// Data transformation after receiving the response can still be pure:

function formatUser(user) {
  return {
    id: user.id,
    name: user.name.toUpperCase(),
  };
}

const apiUser = {
  id: 1,
  name: "john",
};

console.log(formatUser(apiUser)); // { id: 1, name: "JOHN" }

// Keep external interaction at application boundaries and pure
// transformations in the logic that processes the resulting data.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A pure function produces the same result for the same inputs.
// - A pure function does not cause observable side effects.
// - Pure functions should not depend on mutable external state.
// - Pure functions should not mutate objects or arrays supplied by callers.
// - Returning new arrays and objects helps preserve immutability.
// - Local mutation is compatible with purity when it remains unobservable outside the function.
// - Pure functions are deterministic, predictable, and easy to test.
// - Referential transparency allows pure expressions to be reasoned about by their results.
// - Time, randomness, I/O, logging, and external mutation are common sources of impurity.
// - Pure functions compose naturally with other pure functions and higher-order functions.
// - Impure operations are not inherently bad; applications need side effects at external boundaries.
