/**
 * Default Parameters
 * ==================
 *
 * Default parameters allow a function parameter to use a fallback value when the corresponding
 * argument is `undefined`. The default expression is evaluated when the function is called and
 * only when the parameter receives `undefined`.
 */

// ---------------------------------------------------------------------
// 1. Basic default parameters
// ---------------------------------------------------------------------

// A default parameter is written as `parameter = defaultValue`.
// The default value is used when the argument is omitted or is `undefined`.

function greet(name = "Guest") {
  return `Hello, ${name}!`;
}

console.log(greet("John")); // "Hello, John!"
console.log(greet()); // "Hello, Guest!"

// ---------------------------------------------------------------------
// 2. `undefined` activates the default
// ---------------------------------------------------------------------

// Omitting an argument and explicitly passing `undefined` both cause the default
// parameter expression to be used.

function createUser(name = "Unknown") {
  return name;
}

console.log(createUser()); // "Unknown"
console.log(createUser(undefined)); // "Unknown"

// ---------------------------------------------------------------------
// 3. `null` does not activate the default
// ---------------------------------------------------------------------

// Default parameters respond specifically to `undefined`.
// Other values, including `null`, are passed to the parameter unchanged.

function describeUser(name = "Unknown") {
  return name;
}

console.log(describeUser(null)); // null
console.log(describeUser(undefined)); // "Unknown"

// ---------------------------------------------------------------------
// 4. Falsy values are not replaced
// ---------------------------------------------------------------------

// Default parameters do not use JavaScript's general truthiness rules.
// Values such as `false`, `0`, and `""` are valid arguments and are preserved.

function configure(enabled = true, retries = 3, label = "Default") {
  return { enabled, retries, label };
}

console.log(configure(false, 0, "")); // { enabled: false, retries: 0, label: "" }

// ---------------------------------------------------------------------
// 5. Multiple default parameters
// ---------------------------------------------------------------------

// Each parameter can have its own independent default expression.
// An argument only affects the corresponding parameter.

function createRequest(method = "GET", timeout = 5000, retries = 3) {
  return {
    method,
    timeout,
    retries,
  };
}

console.log(createRequest()); // { method: "GET", timeout: 5000, retries: 3 }
console.log(createRequest("POST", 10000)); // { method: "POST", timeout: 10000, retries: 3 }

// ---------------------------------------------------------------------
// 6. Defaults can appear after required parameters
// ---------------------------------------------------------------------

// A parameter without a default can appear before one with a default.
// The caller must still provide the required value when it is needed.

function connect(host, port = 443) {
  return `${host}:${port}`;
}

console.log(connect("example.com")); // "example.com:443"
console.log(connect("example.com", 8080)); // "example.com:8080"

// ---------------------------------------------------------------------
// 7. Default expressions are evaluated when needed
// ---------------------------------------------------------------------

// A default expression is evaluated each time the function is called with
// `undefined` for that parameter. It is not evaluated when an argument is provided.

let counter = 0;

function getNextNumber(value = ++counter) {
  return value;
}

console.log(getNextNumber()); // 1
console.log(getNextNumber()); // 2
console.log(getNextNumber()); // 3
console.log(getNextNumber(100)); // 100
console.log(counter); // 3

// The call with `100` does not evaluate `++counter`, so `counter` remains `3`.

// ---------------------------------------------------------------------
// 8. Default values can use earlier parameters
// ---------------------------------------------------------------------

// A default parameter can reference parameters that appear before it.
// The earlier parameter has already been initialized when the default is evaluated.

function createRange(start, end = start + 10) {
  return { start, end };
}

console.log(createRange(5)); // { start: 5, end: 15 }
console.log(createRange(5, 20)); // { start: 5, end: 20 }

// Later parameters cannot be referenced before their initialization.
// Such a reference causes a `ReferenceError` when the default is evaluated.

// function invalid(start = end, end = 10) {
//     return {start, end};
// }

// ---------------------------------------------------------------------
// 9. Default values can call functions
// ---------------------------------------------------------------------

// A default expression can contain any valid expression, including a function call.
// The function is called only when the parameter receives `undefined`.

function generateId() {
  return Math.random().toString(36).slice(2);
}

function createRecord(id = generateId()) {
  return {
    id,
    created: true,
  };
}

const record = createRecord();

console.log(typeof record.id); // "string"
console.log(record.created); // true

// ---------------------------------------------------------------------
// 10. Default parameters have their own parameter environment
// ---------------------------------------------------------------------

// When a function has default parameters, parameter initialization is handled
// before the function body executes. Default expressions can access earlier
// parameters, but cannot access later parameters before they are initialized.

function calculate(value = 10) {
  return value * 2;
}

console.log(calculate()); // 20
console.log(calculate(5)); // 10

// A default parameter can also access variables from an outer lexical scope.

const defaultMultiplier = 2;

function multiply(value, multiplier = defaultMultiplier) {
  return value * multiplier;
}

console.log(multiply(5)); // 10
console.log(multiply(5, 3)); // 15

// ---------------------------------------------------------------------
// 11. Default parameters with object destructuring
// ---------------------------------------------------------------------

// Destructuring defaults and parameter defaults solve different problems.
// `= {}` provides an object when the entire argument is `undefined`.
// Individual property defaults provide values for missing or `undefined` properties.

function displayUser({ name = "Unknown", role = "user" } = {}) {
  return `${name} (${role})`;
}

console.log(displayUser()); // "Unknown (user)"
console.log(displayUser({ name: "John" })); // "John (user)"
console.log(displayUser({ name: "Jane", role: "admin" })); // "Jane (admin)"

// ---------------------------------------------------------------------
// 12. Default parameters with array destructuring
// ---------------------------------------------------------------------

// The same distinction applies to array destructuring.
// `= []` provides the array when the entire argument is `undefined`.
// Element defaults provide values for missing or `undefined` elements.

function getCoordinates([x = 0, y = 0] = []) {
  return { x, y };
}

console.log(getCoordinates()); // { x: 0, y: 0 }
console.log(getCoordinates([10])); // { x: 10, y: 0 }
console.log(getCoordinates([10, 20])); // { x: 10, y: 20 }

// ---------------------------------------------------------------------
// 13. Default parameters and `arguments`
// ---------------------------------------------------------------------

// In a non-arrow function, default parameters change the relationship between
// named parameters and the `arguments` object. The parameter binding is not
// automatically synchronized with the corresponding `arguments` entry.

function showArgument(value = 10) {
  console.log(value);
  console.log(arguments[0]);
}

showArgument(); // 10, undefined
showArgument(20); // 20, 20

// ---------------------------------------------------------------------
// 14. Default parameters with arrow functions
// ---------------------------------------------------------------------

// Default parameters work with arrow functions in the same way.
// The parameter receives its default when the corresponding argument is `undefined`.

const multiplyValue = (value, multiplier = 2) => value * multiplier;

console.log(multiplyValue(5)); // 10
console.log(multiplyValue(5, 3)); // 15

// ---------------------------------------------------------------------
// 15. Default parameters vs. fallback operators
// ---------------------------------------------------------------------

// Default parameters respond only to `undefined`.
// `||` uses truthiness, so every falsy value can trigger its fallback.
// `??` uses nullish semantics, so only `null` and `undefined` trigger its fallback.

function parameterDefault(value = "default") {
  return value;
}

function orFallback(value) {
  return value || "default";
}

function nullishFallback(value) {
  return value ?? "default";
}

console.log(parameterDefault(0)); // 0
console.log(orFallback(0)); // "default"
console.log(nullishFallback(0)); // 0

console.log(parameterDefault(null)); // null
console.log(orFallback(null)); // "default"
console.log(nullishFallback(null)); // "default"

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Default parameters provide fallback values directly in a function's parameter list.
// - A default is used when the corresponding argument is omitted or is `undefined`.
// - `null`, `false`, `0`, and `""` do not activate a default parameter.
// - Each default expression is evaluated when the function is called and only when needed.
// - A default parameter can reference earlier parameters and outer lexical variables.
// - Later parameters cannot be referenced before their initialization.
// - Default parameters can be combined with object and array destructuring.
// - Default parameters work with both regular functions and arrow functions.
// - Default parameters do not use truthiness; they respond specifically to `undefined`.
// - `||` uses truthiness, while `??` uses nullish semantics (`null` and `undefined`).
