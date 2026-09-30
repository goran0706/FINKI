/**
 * Ternary Operator
 * ================
 *
 * The ternary operator is a conditional expression that evaluates one of two expressions
 * based on the truthiness of a condition. It produces a value, so it can be assigned to
 * variables, passed as arguments, returned from functions, or used inside larger expressions.
 */

// ---------------------------------------------------------------------
// 1. Basic ternary syntax
// ---------------------------------------------------------------------

// The syntax is:
// condition ? valueIfTrue : valueIfFalse
//
// The condition is evaluated first.
// If it is truthy, the expression before `:` is evaluated and returned.
// If it is falsy, the expression after `:` is evaluated and returned.

const age = 20;
const access = age >= 18 ? "granted" : "denied";

console.log(access); // "granted"

// A ternary produces a value, so its result can be assigned directly.

const score = 72;
const result = score >= 50 ? "passed" : "failed";

console.log(result); // "passed"

// ---------------------------------------------------------------------
// 2. Ternary expressions produce values
// ---------------------------------------------------------------------

// Because a ternary is an expression, it can appear anywhere an expression is expected.
// The selected value can be a literal, variable, function call, or another expression.

const temperature = 28;
const message = temperature > 25 ? "It is warm." : "It is cool.";

console.log(message); // "It is warm."
console.log(temperature > 25 ? "hot" : "cold"); // "hot"

// A ternary can also be embedded inside a template literal.

const username = "Ada";
console.log(`Hello, ${username ? username : "guest"}!`); // "Hello, Ada!"

// The branches can return values of any type.

const firstNumber = 10;
const secondNumber = 20;
const larger = firstNumber > secondNumber ? firstNumber : secondNumber;

console.log(larger); // 20

// ---------------------------------------------------------------------
// 3. Ternary vs. if...else
// ---------------------------------------------------------------------

// Use a ternary when the main purpose is to select one value from two alternatives.

const isLoggedIn = true;
const greeting = isLoggedIn ? "Welcome back." : "Please log in.";

console.log(greeting); // "Welcome back."

// Use `if...else` when the branches need to execute statements,
// especially when they contain multiple operations or side effects.

if (isLoggedIn) {
  console.log("Welcome back.");
} else {
  console.log("Please log in.");
}

// A ternary can technically execute functions with side effects,
// but using it only for side effects obscures the intent.
//
// Avoid:
//
// isLoggedIn ? console.log("Welcome") : console.log("Login");
//
// Prefer:
//
// if (isLoggedIn) {
//     console.log("Welcome");
// } else {
//     console.log("Login");
// }

// ---------------------------------------------------------------------
// 4. Truthy and falsy conditions
// ---------------------------------------------------------------------

// The condition does not have to be a boolean.
// JavaScript evaluates its truthiness to determine which branch to select.

const usernameValue = "john";
const displayName = usernameValue ? usernameValue : "Guest";

console.log(displayName); // "john"

const emptyUsername = "";
const fallbackName = emptyUsername ? emptyUsername : "Guest";

console.log(fallbackName); // "Guest"

// Falsy values include:
// false, 0, -0, 0n, "", null, undefined, and NaN.
//
// `document.all` is also falsy in browsers because of its legacy
// special behavior, although it is rarely relevant in normal code.
//
// Every other JavaScript value is truthy, including empty arrays and objects.

const items = [];
const itemsMessage = items ? "array exists" : "array is missing";

console.log(itemsMessage); // "array exists"

// The condition checks whether the array reference is truthy.
// It does not check whether the array contains any elements.

const emptyItemsMessage = items.length ? "array has items" : "array is empty";

console.log(emptyItemsMessage); // "array is empty"

// ---------------------------------------------------------------------
// 5. Choosing between different value types
// ---------------------------------------------------------------------

// JavaScript does not require both branches to produce values of the same type.
// The resulting value simply depends on which branch is selected.

const useMetric = true;
const unit = useMetric ? "kilometers" : 42;

console.log(unit); // "kilometers"

// Only the selected branch is evaluated.
// The unselected branch is not executed.

const condition = true;
const selected = condition
  ? "this branch is evaluated"
  : (() => {
      throw new Error("This branch is not evaluated");
    })();

console.log(selected); // "this branch is evaluated"

// This short-circuiting behavior matters when a branch contains a function call,
// property access, calculation, or other operation with observable behavior.

// ---------------------------------------------------------------------
// 6. Ternary in function arguments and return values
// ---------------------------------------------------------------------

// A ternary can be passed directly as a function argument.

const points = 85;

console.log(points >= 90 ? "A" : "Not an A"); // "Not an A"

// A function can also return the value produced by a ternary.

function getStatus(isActive) {
  return isActive ? "active" : "inactive";
}

console.log(getStatus(true)); // "active"
console.log(getStatus(false)); // "inactive"

// The value returned by the function is the value selected by the ternary.

function getShippingCost(total) {
  return total >= 50 ? 0 : 5;
}

console.log(getShippingCost(75)); // 0
console.log(getShippingCost(30)); // 5

// ---------------------------------------------------------------------
// 7. Selecting values from a condition
// ---------------------------------------------------------------------

// A common use is selecting a value before continuing with other operations.

const isDarkMode = false;
const backgroundColor = isDarkMode ? "black" : "white";
const textColor = isDarkMode ? "white" : "black";

console.log(backgroundColor); // "white"
console.log(textColor); // "black"

// The condition can be the result of a comparison.

const accountAge = 3;
const accountType = accountAge >= 5 ? "established" : "new";

console.log(accountType); // "new"

// A boolean variable can be used directly as the condition.

const hasPermission = true;
const buttonLabel = hasPermission ? "Delete" : "Request access";

console.log(buttonLabel); // "Delete"

// ---------------------------------------------------------------------
// 8. Nested ternary operators
// ---------------------------------------------------------------------

// A ternary can be used as one of the branches of another ternary.
// This creates multiple possible outcomes, but readability decreases quickly.

const testScore = 82;

const grade = testScore >= 90 ? "A" : testScore >= 80 ? "B" : testScore >= 70 ? "C" : testScore >= 60 ? "D" : "F";

console.log(grade); // "B"

// Nested ternaries are valid, but several conditions are often clearer
// when expressed with `if...else if...else`.

let letterGrade;

if (testScore >= 90) {
  letterGrade = "A";
} else if (testScore >= 80) {
  letterGrade = "B";
} else if (testScore >= 70) {
  letterGrade = "C";
} else if (testScore >= 60) {
  letterGrade = "D";
} else {
  letterGrade = "F";
}

console.log(letterGrade); // "B"

// A simple ternary is generally preferable to a deeply nested ternary.

// ---------------------------------------------------------------------
// 9. Parentheses and operator precedence
// ---------------------------------------------------------------------

// The ternary operator has lower precedence than many common operators,
// so comparisons can normally be written directly in its condition.

const count = 3;
const countMessage = count > 0 ? `There are ${count} items.` : "There are no items.";

console.log(countMessage); // "There are 3 items."

// Parentheses can make the grouping explicit when the complete ternary
// participates in another expression.

const label = (count > 0 ? "Items" : "Empty") + ": " + count;

console.log(label); // "Items: 3"

// Parentheses are especially useful when combining a ternary with operators
// whose precedence could make the intended grouping less obvious.

// ---------------------------------------------------------------------
// 10. Ternary vs. logical operators
// ---------------------------------------------------------------------

// A ternary explicitly chooses between two expressions:
//
// condition ? valueIfTrue : valueIfFalse
//
// Logical operators serve different purposes.
//
// `condition && value` evaluates `value` only when the condition is truthy.
// `value || fallback` selects the fallback when `value` is falsy.
// `value ?? fallback` selects the fallback only when `value` is null or undefined.

const loggedIn = true;
const loginMessage = loggedIn ? "Dashboard" : "Login";

console.log(loginMessage); // "Dashboard"

// Do not replace a ternary with `&&` or `||` simply because the syntax is shorter.
// They do not represent the same operation.

const hasNotifications = false;
const notificationLabel = hasNotifications ? "Notifications" : "No notifications";

console.log(notificationLabel); // "No notifications"

// `&&` is useful when there is only a value to produce for the truthy case,
// while `??` is useful when nullish values specifically represent absence.

// ---------------------------------------------------------------------
// 11. Ternary vs. nullish values
// ---------------------------------------------------------------------

// A ternary condition uses truthiness.
// Therefore, values such as `0`, `""`, and `false` select the false branch.

const quantity = 0;
const quantityText = quantity ? `${quantity} items` : "No items";

console.log(quantityText); // "No items"

// This can be incorrect when `0` is a legitimate value that should be preserved.
//
// `||` has the same truthiness behavior:
//
// quantity || 10              // 10
//
// `??` only falls back for `null` and `undefined`:
//
// quantity ?? 10              // 0

const explicitValue = 0;
const fallbackWithTernary = explicitValue !== null && explicitValue !== undefined ? explicitValue : 10;

console.log(fallbackWithTernary); // 0

const fallbackWithNullish = explicitValue ?? 10;

console.log(fallbackWithNullish); // 0

// Use a ternary when the condition itself is meaningful.
// Use `??` when the requirement is specifically to distinguish nullish values.

// ---------------------------------------------------------------------
// 12. Common ternary patterns
// ---------------------------------------------------------------------

// Ternaries are useful when two alternatives can be expressed clearly and locally.

const isOnline = true;
const statusLabel = isOnline ? "Online" : "Offline";

console.log(statusLabel); // "Online"

// They are also useful for selecting numeric values.

const isWeekend = false;
const deliveryDays = isWeekend ? 3 : 1;

console.log(deliveryDays); // 1

// A ternary can select the result of a function call.

function getGuestName() {
  return "Guest";
}

const name = usernameValue ? usernameValue : getGuestName();

console.log(name); // "john"

// Only the selected function call is evaluated.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The ternary operator has the form `condition ? valueIfTrue : valueIfFalse`.
// - It is an expression that produces one of two values.
// - Its condition is evaluated using JavaScript truthiness rules.
// - Only the selected branch is evaluated.
// - A ternary can be assigned, returned, passed as an argument, or nested in another expression.
// - Use `if...else` when branches need multiple statements or side effects.
// - Avoid deeply nested ternaries when conditional logic becomes difficult to read.
// - Empty arrays and objects are truthy even when they contain no elements or properties.
// - A ternary uses truthiness, while `??` specifically checks for `null` and `undefined`.
// - `&&`, `||`, and `??` have different semantics and should not be treated as interchangeable.
// - Ternaries are most effective when they express a simple, local choice between two values.
