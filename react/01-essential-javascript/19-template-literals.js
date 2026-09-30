/**
 * Template Literals
 * =================
 *
 * Template literals are string literals written with backticks.
 * They support string interpolation, multiline strings, and tagged template syntax.
 */

// ---------------------------------------------------------------------
// 1. Basic template literals
// ---------------------------------------------------------------------

// Template literals use backticks instead of single or double quotes.

const message = `Hello, world!`;

console.log(message); // "Hello, world!"
console.log(typeof message); // "string"

// A template literal produces a string value.

// ---------------------------------------------------------------------
// 2. String interpolation
// ---------------------------------------------------------------------

// Expressions can be embedded inside `${}` to produce dynamic strings.
// The expression is evaluated and its result is inserted into the string.

const name = "John";
const age = 30;

const introduction = `My name is ${name} and I am ${age} years old.`;

console.log(introduction); // "My name is John and I am 30 years old."

// ---------------------------------------------------------------------
// 3. Expressions inside interpolation
// ---------------------------------------------------------------------

// `${}` can contain any JavaScript expression, including arithmetic,
// conditional expressions, and property access.

const price = 100;
const quantity = 3;

const total = `Total: ${price * quantity}`;

console.log(total); // "Total: 300"

const status = `User is ${age >= 18 ? "an adult" : "a minor"}`;

console.log(status); // "User is an adult"

// Property access is also a valid expression inside `${}`.

const user = {
  firstName: "John",
  lastName: "Doe",
};

const fullName = `${user.firstName} ${user.lastName}`;

console.log(fullName); // "John Doe"

// ---------------------------------------------------------------------
// 4. Calling functions inside template literals
// ---------------------------------------------------------------------

// Function calls are expressions, so they can be evaluated inside `${}`.

function formatName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

const formattedName = `User: ${formatName("Jane", "Smith")}`;

console.log(formattedName); // "User: Jane Smith"

// The function call is evaluated and its return value is inserted
// into the resulting string.

// ---------------------------------------------------------------------
// 5. Multiline strings
// ---------------------------------------------------------------------

// Template literals can contain line breaks directly without `\n`.

const description = `This is line one.
This is line two.
This is line three.`;

console.log(description);

// The line breaks between the backticks become part of the string.

// ---------------------------------------------------------------------
// 6. Newline characters
// ---------------------------------------------------------------------

// Escape sequences can also be used inside template literals.

const lines = `First line\nSecond line`;

console.log(lines); // "First line\nSecond line"

// `\n` represents a newline character in the resulting string.

// ---------------------------------------------------------------------
// 7. Quotes inside template literals
// ---------------------------------------------------------------------

// Single and double quotes do not need to be escaped when using backticks.

const singleQuote = `It's a simple string.`;
const doubleQuote = `He said "hello".`;
const bothQuotes = `It's called "JavaScript".`;

console.log(singleQuote); // "It's a simple string."
console.log(doubleQuote); // 'He said "hello".'
console.log(bothQuotes); // `It's called "JavaScript".`

// ---------------------------------------------------------------------
// 8. Escaping backticks
// ---------------------------------------------------------------------

// A literal backtick inside a template literal must be escaped.

const text = `Use \'const' when the binding should not be reassigned.`;

console.log(text); // "Use `const` when the binding should not be reassigned."

// ---------------------------------------------------------------------
// 9. Converting values to strings
// ---------------------------------------------------------------------

// Interpolated values are converted to strings when the template literal
// is evaluated.

const number = 42;
const boolean = true;
const empty = null;
const missing = undefined;

console.log(`number: ${number}`); // "number: 42"
console.log(`boolean: ${boolean}`); // "boolean: true"
console.log(`empty: ${empty}`); // "empty: null"
console.log(`missing: ${missing}`); // "missing: undefined"

// Objects and arrays use their normal string conversion behavior.

console.log(`items: ${[1, 2, 3]}`); // "items: 1,2,3"
console.log(`user: ${{ name: "John" }}`); // "user: [object Object]"

// ---------------------------------------------------------------------
// 10. Interpolation with object properties
// ---------------------------------------------------------------------

// Template literals can combine interpolation with multiline strings.

const account = {
  username: "john",
  role: "admin",
};

const accountSummary = `    Username: ${account.username}
Role: ${account.role}`;

console.log(accountSummary);

// The indentation and line breaks inside the template literal
// are also part of the resulting string.

// ---------------------------------------------------------------------
// 11. Template literals are expressions
// ---------------------------------------------------------------------

// A template literal is an expression that produces a string.
// It can be used anywhere a string expression is allowed.

const enabled = true;
const label = enabled ? `Enabled` : `Disabled`;

console.log(label); // "Enabled"

// ---------------------------------------------------------------------
// 12. Nested expressions
// ---------------------------------------------------------------------

// Expressions inside `${}` can contain nested template literals.

const firstName = "John";
const lastName = "Doe";

const nested = `${firstName} ${lastName === "Doe" ? `(verified)` : ``}`;

console.log(nested); // "John Doe (verified)"

// The inner template literal is evaluated as part of the conditional expression.

// ---------------------------------------------------------------------
// 13. Building strings from arrays
// ---------------------------------------------------------------------

// Template literals work naturally with array methods such as `join` and `map`.

const products = ["Laptop", "Keyboard", "Mouse"];

const productList = `Products: ${products.join(", ")}`;

console.log(productList); // "Products: Laptop, Keyboard, Mouse"

const numbers = [1, 2, 3];

const doubled = `Doubled values: ${numbers.map((number) => number * 2).join(", ")}`;

console.log(doubled); // "Doubled values: 2, 4, 6"

// Array methods produce values that can then be interpolated.

// ---------------------------------------------------------------------
// 14. Template literals vs. string concatenation
// ---------------------------------------------------------------------

// Template literals can make dynamic strings easier to read
// than traditional string concatenation.

const first = "John";
const last = "Doe";

const concatenated = "Hello, " + first + " " + last + "!";
const templated = `Hello, ${first} ${last}!`;

console.log(concatenated); // "Hello, John Doe!"
console.log(templated); // "Hello, John Doe!"

// Both expressions produce the same string value.

// ---------------------------------------------------------------------
// 15. Tagged template literals
// ---------------------------------------------------------------------

// A tagged template literal calls a function with the template's
// static string segments and evaluated interpolation values.

function describe(strings, name, age) {
  return `${strings[0]}${name}${strings[1]}${age}${strings[2]}`;
}

const nameValue = "John";
const ageValue = 30;

const result = describe`Name: ${nameValue}, Age: ${ageValue}.`;

console.log(result); // "Name: John, Age: 30."

// The tag function receives:
//
// `strings` -> ["Name: ", ", Age: ", "."]
// `name`    -> "John"
// `age`     -> 30
//
// The tag function can inspect, transform, validate, or combine
// these values before returning a result.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Template literals are string literals delimited by backticks.
// - `${expression}` evaluates a JavaScript expression and inserts its result into the string.
// - Template literals support multiline strings without requiring explicit `\n` characters.
// - Single and double quotes do not need escaping inside backtick-delimited strings.
// - A literal backtick must be escaped as ```.
// - Interpolated values are converted to strings when the template literal is evaluated.
// - Template literals are expressions that produce string values.
// - Tagged template literals pass static string segments and evaluated values to a tag function.
