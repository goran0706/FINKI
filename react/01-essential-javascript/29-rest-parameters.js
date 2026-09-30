/**
 * Rest Parameters
 * ===============
 *
 * Rest parameters allow a function to collect multiple arguments into a
 * single array.
 *
 * The `...` syntax is used in a function parameter list to collect all
 * remaining arguments that were passed to the function.
 */

// ---------------------------------------------------------------------
// 1. Basic rest parameters
// ---------------------------------------------------------------------

// A rest parameter collects all arguments into an array when no separate named parameter exists.
function collectValues(...values) {
  return values;
}

console.log(collectValues(1, 2, 3)); // [1, 2, 3]
console.log(collectValues("a", "b")); // ["a", "b"]
console.log(collectValues()); // []

// ---------------------------------------------------------------------
// 2. Rest parameters with regular parameters
// ---------------------------------------------------------------------

// Named parameters match first, while the rest parameter collects all remaining arguments.
function describeUser(name, ...roles) {
  return {
    name,
    roles,
  };
}

console.log(describeUser("John", "admin", "editor")); // { name: "John", roles: ["admin", "editor"] }
console.log(describeUser("Jane")); // { name: "Jane", roles: [] }

// ---------------------------------------------------------------------
// 3. Rest parameters collect remaining arguments
// ---------------------------------------------------------------------

// The rest parameter receives every argument passed after the named parameters.
function collectAfterFirst(first, ...remaining) {
  return {
    first,
    remaining,
  };
}

console.log(collectAfterFirst(10, 20, 30, 40)); // { first: 10, remaining: [20, 30, 40] }

// ---------------------------------------------------------------------
// 4. Rest parameters are arrays
// ---------------------------------------------------------------------

// Because rest parameters are real arrays, built-in array methods like `map` can be used directly.
function doubleValues(...values) {
  return values.map((value) => value * 2);
}

console.log(doubleValues(1, 2, 3)); // [2, 4, 6]

// ---------------------------------------------------------------------
// 5. Rest parameters with calculations
// ---------------------------------------------------------------------

// Rest parameters are ideal for functions handling a variable number of numeric arguments.
function sum(...numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}

console.log(sum()); // 0
console.log(sum(1)); // 1
console.log(sum(1, 2, 3, 4)); // 10

// ---------------------------------------------------------------------
// 6. Rest parameters with different value types
// ---------------------------------------------------------------------

// Rest parameters do not restrict or filter the data types of collected arguments.
function collect(...values) {
  return values;
}

console.log(collect(1, "hello", true, null)); // [1, "hello", true, null]

// ---------------------------------------------------------------------
// 7. Rest parameters and missing arguments
// ---------------------------------------------------------------------

// Unsupplied named parameters receive `undefined`, while the rest parameter defaults to an empty array.
function inspect(first, second, ...remaining) {
  return {
    first,
    second,
    remaining,
  };
}

console.log(inspect("a")); // { first: "a", second: undefined, remaining: [] }
console.log(inspect("a", "b", "c", "d")); // { first: "a", second: "b", remaining: ["c", "d"] }

// ---------------------------------------------------------------------
// 8. Rest parameters vs. the `arguments` object
// ---------------------------------------------------------------------

// Modern rest parameters provide a real array directly, replacing legacy `arguments` array conversion.
function modernStyle(...values) {
  return values;
}

console.log(modernStyle(1, 2, 3)); // [1, 2, 3]

// ---------------------------------------------------------------------
// 9. Rest parameters are available in arrow functions
// ---------------------------------------------------------------------

// Since arrow functions lack an `arguments` object, rest parameters provide a clean alternative.
const multiply = (...numbers) => {
  return numbers.reduce((result, number) => result * number, 1);
};

console.log(multiply(2, 3, 4)); // 24

// ---------------------------------------------------------------------
// 10. Rest parameters with a fixed first argument
// ---------------------------------------------------------------------

// This pattern pairs a descriptive primary argument with a variable set of payload values.
const logMessage = (message, ...values) => {
  return {
    message,
    values,
  };
};

console.log(logMessage("User created", 1, "John", true));
// { message: "User created", values: [1, "John", true] }

// ---------------------------------------------------------------------
// 11. Rest parameters with destructuring
// ---------------------------------------------------------------------

// Rest syntax also collects remaining elements in array destructuring patterns.
const [first, ...others] = [10, 20, 30, 40];

console.log(first); // 10
console.log(others); // [20, 30, 40]

// ---------------------------------------------------------------------
// 12. Rest parameters must be last
// ---------------------------------------------------------------------

// Rest parameters must always be the final element in a parameter list, and only one is allowed.
// function example(first, ...rest) {} // Valid
// function example(...rest, last) {} // SyntaxError

// ---------------------------------------------------------------------
// 13. Rest parameters do not include named parameters
// ---------------------------------------------------------------------

// Named parameters are consumed first, so their values are excluded from the rest array.
function separate(first, second, ...rest) {
  return {
    first,
    second,
    rest,
  };
}

console.log(separate(1, 2, 3, 4, 5));
// { first: 1, second: 2, rest: [3, 4, 5] }

// ---------------------------------------------------------------------
// 14. Rest parameters and array methods
// ---------------------------------------------------------------------

// Collected arrays can be safely filtered, mapped, and sorted without mutating caller arrays.
function getPositiveNumbers(...numbers) {
  return numbers.filter((number) => number > 0);
}

console.log(getPositiveNumbers(-2, 5, -1, 8, 0)); // [5, 8]

function sortNumbers(...numbers) {
  return [...numbers].sort((a, b) => a - b);
}

console.log(sortNumbers(30, 10, 20)); // [10, 20, 30]

// ---------------------------------------------------------------------
// 15. Rest parameters and object construction
// ---------------------------------------------------------------------

// Rest parameters combine naturally with object shorthand syntax to construct records.
function createUser(name, ...roles) {
  return {
    name,
    roles,
  };
}

const user = createUser("John", "admin", "editor");
console.log(user); // { name: "John", roles: ["admin", "editor"] }

// ---------------------------------------------------------------------
// 16. Rest parameters and default parameters
// ---------------------------------------------------------------------

// Default values can be applied to named parameters preceding a rest parameter.
function configure(name = "Anonymous", ...options) {
  return {
    name,
    options,
  };
}

console.log(configure()); // { name: "Anonymous", options: [] }
console.log(configure("John", "dark", "compact")); // { name: "John", options: ["dark", "compact"] }

// ---------------------------------------------------------------------
// 17. Rest parameters do not mutate the caller's array
// ---------------------------------------------------------------------

// Spreading an array into arguments and collecting them via rest creates a fresh array copy.
const originalValues = [1, 2, 3];

function addValue(...values) {
  values.push(4);
  return values;
}

const result = addValue(...originalValues);

console.log(originalValues); // [1, 2, 3]
console.log(result); // [1, 2, 3, 4]

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Rest parameters use `...` in a function parameter list to collect remaining arguments.
// - The collected value is always a real array.
// - Named parameters are matched first; the rest parameter receives the remaining arguments.
// - A rest parameter can be empty when no arguments remain.
// - Rest parameters must be the final parameter and only one rest parameter is allowed.
// - Rest parameters work with regular and arrow functions.
// - Rest parameters are generally clearer than using the `arguments` object.
// - Rest syntax also exists in destructuring, where it collects remaining elements or properties.
// - Rest parameters create a new array when arguments are collected.
