/**
 * Short-Circuit Evaluation
 * ========================
 *
 * JavaScript logical operators do more than produce boolean values: they evaluate operands
 * from left to right and stop as soon as the final result is known.
 *
 * This behavior is called short-circuit evaluation and is commonly used for conditional
 * execution, fallback values, guarding operations, and choosing between values.
 */

// ---------------------------------------------------------------------
// 1. What short-circuit evaluation means
// ---------------------------------------------------------------------

// JavaScript evaluates logical expressions from left to right.
// It stops evaluating as soon as the result is already determined.
//
// For `&&`:
// - If the left operand is falsy, the result is already known to be falsy.
// - The right operand is not evaluated.
//
// For `||`:
// - If the left operand is truthy, the result is already known to be truthy.
// - The right operand is not evaluated.
//
// The important point is that JavaScript does NOT necessarily evaluate both operands.

// ---------------------------------------------------------------------
// 2. Logical AND (&&)
// ---------------------------------------------------------------------

// With `&&`, JavaScript evaluates the right operand only when the left operand is truthy.

const isLoggedIn = true;
const hasPermission = true;

const canEdit = isLoggedIn && hasPermission;

console.log(canEdit); // true

// If the first operand is falsy, JavaScript stops immediately.

const loggedIn = false;
const permission = true;

const canDelete = loggedIn && permission;

console.log(canDelete); // false

// `permission` is not even evaluated when `loggedIn` is falsy.
// This is the first important meaning of "short-circuit".

// ---------------------------------------------------------------------
// 3. && returns an operand
// ---------------------------------------------------------------------

// `&&` does not necessarily return `true` or `false`.
// It returns one of its operands.
//
// If the left operand is falsy, that operand is returned.
// Otherwise, the right operand is returned.

console.log(true && "hello"); // "hello"
console.log(false && "hello"); // false

console.log(10 && 20); // 20
console.log(0 && 20); // 0

console.log("user" && "admin"); // "admin"
console.log("" && "admin"); // ""

// This is why logical operators can be used to select values,
// not only to combine boolean conditions.

// ---------------------------------------------------------------------
// 4. && with truthy and falsy values
// ---------------------------------------------------------------------

// The left operand determines whether JavaScript needs to evaluate the right operand.

const username = "john";
const greeting = username && `Hello, ${username}!`;

console.log(greeting); // "Hello, john!"

const emptyName = "";
const emptyGreeting = emptyName && `Hello, ${emptyName}!`;

console.log(emptyGreeting); // ""

// The second expression is not evaluated because `emptyName` is falsy.

// Common falsy values include:
// false, 0, -0, 0n, "", null, undefined, and NaN.
//
// Everything else is truthy, including empty arrays and empty objects.

// ---------------------------------------------------------------------
// 5. Conditional execution with &&
// ---------------------------------------------------------------------

// A common pattern is using `&&` to execute something only when a condition is truthy.

const hasMessage = true;

hasMessage && console.log("You have a message.");

const hasError = false;

hasError && console.log("An error occurred.");

// When `hasError` is false, `console.log(...)` is never called.

// This is useful for simple one-line conditional actions,
// but it should not replace `if` when the conditional logic becomes complex.
//
// Prefer:
// if (hasError) {
//     console.log("An error occurred.");
// }
//
// when the condition controls multiple statements or more involved logic.

// ---------------------------------------------------------------------
// 6. Short-circuiting prevents evaluation
// ---------------------------------------------------------------------

// The right operand can be any expression, including a function call.
// If the left operand short-circuits the expression, the function is never called.

function notify() {
  console.log("Notification sent.");
  return true;
}

const shouldNotify = false;

shouldNotify && notify();

// Nothing is printed because `notify()` is never called.

// When the condition is truthy, the right operand is evaluated.

const shouldNotifyAgain = true;

shouldNotifyAgain && notify(); // "Notification sent."

// This is an important difference from writing two independent statements:
// the function call itself is conditionally evaluated.

// ---------------------------------------------------------------------
// 7. Logical OR (||)
// ---------------------------------------------------------------------

// With `||`, JavaScript evaluates the right operand only when the left operand is falsy.
//
// If the left operand is truthy, the result is already known,
// so JavaScript returns it without evaluating the right operand.

const primaryName = "John";
const displayName = primaryName || "Guest";

console.log(displayName); // "John"

const missingName = "";
const fallbackName = missingName || "Guest";

console.log(fallbackName); // "Guest"

// `||` is commonly used to provide a fallback when a value is falsy.

// ---------------------------------------------------------------------
// 8. || returns an operand
// ---------------------------------------------------------------------

// Like `&&`, `||` returns an operand rather than necessarily returning a boolean.
//
// If the left operand is truthy, it is returned.
// If the left operand is falsy, the right operand is returned.

console.log(true || "hello"); // true
console.log(false || "hello"); // "hello"

console.log("hello" || "fallback"); // "hello"
console.log("" || "fallback"); // "fallback"

console.log(10 || 20); // 10
console.log(0 || 20); // 20

// This behavior makes `||` useful for selecting the first truthy value.

// ---------------------------------------------------------------------
// 9. Multiple operands
// ---------------------------------------------------------------------

// Logical operators can be chained.
// JavaScript continues from left to right until the result is determined.

const firstName = "";
const secondName = null;
const thirdName = "John";

const name = firstName || secondName || thirdName || "Guest";

console.log(name); // "John"

// Evaluation stops at "John" because it is truthy.
// The final "Guest" is never evaluated.

// The same idea works with `&&`:

const firstCondition = true;
const secondCondition = true;
const thirdCondition = "success";

const result = firstCondition && secondCondition && thirdCondition;

console.log(result); // "success"

// If any operand is falsy, `&&` stops at the first falsy operand.

const valid = true;
const authenticated = false;
const authorized = true;

const accessResult = valid && authenticated && authorized;

console.log(accessResult); // false

// `authorized` is never evaluated because `authenticated` is already falsy.

// ---------------------------------------------------------------------
// 10. Evaluation happens from left to right
// ---------------------------------------------------------------------

// Short-circuit evaluation follows the normal left-to-right evaluation order.

function first() {
  console.log("first");
  return true;
}

function second() {
  console.log("second");
  return false;
}

function third() {
  console.log("third");
  return true;
}

const evaluationResult = first() && second() && third();

console.log(evaluationResult); // false

// Output:
//
// first
// second
// false
//
// `third()` is never called because `second()` returned a falsy value.

// With `||`, evaluation stops at the first truthy operand.

const orResult = second() || first() || third();

console.log(orResult); // true

// Output:
//
// second
// first
// true
//
// `third()` is never called because `first()` returned true.

// ---------------------------------------------------------------------
// 11. && vs. ||
// ---------------------------------------------------------------------

// `&&` looks for the first falsy value.
// `||` looks for the first truthy value.
//
// `&&`:
// - truthy && truthy -> evaluates and returns the right operand
// - falsy && anything -> stops and returns the left operand
//
// `||`:
// - truthy || anything -> stops and returns the left operand
// - falsy || falsy -> evaluates and returns the right operand

console.log("A" && "B"); // "B"
console.log("" && "B"); // ""

console.log("A" || "B"); // "A"
console.log("" || "B"); // "B"

// ---------------------------------------------------------------------
// 12. && and || are not boolean operators only
// ---------------------------------------------------------------------

// It is important not to assume that logical operators always produce booleans.
//
// They can return strings, numbers, objects, arrays, functions, null,
// undefined, or any other JavaScript value.

const user = { name: "Ada" };

const objectResult = user && user.name;

console.log(objectResult); // "Ada"

const noUser = null;
const missingUserName = noUser && noUser.name;

console.log(missingUserName); // null

// The second example does not throw an error because `noUser` is falsy.
// JavaScript stops before trying to access `noUser.name`.

// ---------------------------------------------------------------------
// 13. Guarding operations with &&
// ---------------------------------------------------------------------

// A common use of `&&` is to guard an operation that should happen only
// when some prerequisite value exists.

const account = {
  name: "Ada",
};

account && console.log(account.name); // "Ada"

// If the object is nullish, the right side is skipped.

const missingAccount = null;

missingAccount && console.log(missingAccount.name);

// Nothing is printed, and no property access occurs.

// This pattern was common before optional chaining.

// ---------------------------------------------------------------------
// 14. Default values with ||
// ---------------------------------------------------------------------

// `||` is often used to provide a default value.

const configuredPort = 3000;
const port = configuredPort || 8080;

console.log(port); // 3000

const missingPort = undefined;
const fallbackPort = missingPort || 8080;

console.log(fallbackPort); // 8080

// However, `||` treats EVERY falsy value as missing.
// This can be a problem when 0, "", or false are valid values.

const retryCount = 0;
const retries = retryCount || 3;

console.log(retries); // 3

// The value 0 was replaced even though it was explicitly provided.

// The nullish coalescing operator `??` solves this specific problem
// by falling back only for null and undefined.

// ---------------------------------------------------------------------
// 15. && and || with function calls
// ---------------------------------------------------------------------

// Because function calls are expressions, they can participate in short-circuiting.

function getUser() {
  console.log("getUser() called");
  return { name: "Ada" };
}

const useUser = true;

const currentUser = useUser && getUser();

console.log(currentUser); // { name: "Ada" }

// When `useUser` is false, the function call does not happen.

const skipUser = false;

const noCurrentUser = skipUser && getUser();

console.log(noCurrentUser); // false

// The same principle can be used with fallback-producing functions.

function getDefaultName() {
  console.log("getDefaultName() called");
  return "Guest";
}

const existingName = "Ada";
const selectedName = existingName || getDefaultName();

console.log(selectedName); // "Ada"

// `getDefaultName()` is never called because `existingName` is truthy.

// ---------------------------------------------------------------------
// 16. Combining logical operators
// ---------------------------------------------------------------------

// `&&` and `||` can be combined to express more complex conditions.
// Parentheses should be used when they make the intended grouping clearer.

const isMember = true;
const isAdmin = false;
const canView = true;

const allowed = (isMember || isAdmin) && canView;

console.log(allowed); // true

// The parentheses make the intended logic explicit:
//
// (isMember OR isAdmin) AND canView
//
// Without parentheses, `&&` has higher precedence than `||`:
//
// a || b && c
//
// is interpreted as:
//
// a || (b && c)

// Do not rely on precedence when parentheses make the logic easier to understand.

// ---------------------------------------------------------------------
// 17. Short-circuiting and side effects
// ---------------------------------------------------------------------

// Because short-circuiting controls whether expressions are evaluated,
// it also controls whether their side effects happen.

let count = 0;

function increment() {
  count++;
  return true;
}

false && increment();

console.log(count); // 0

true && increment();

console.log(count); // 1

// The first `increment()` call never happened.
// The second one did happen because the left operand was truthy.

// This is useful, but side effects hidden inside logical expressions
// can make code harder to understand when overused.

// ---------------------------------------------------------------------
// 18. Short-circuiting vs. ternary
// ---------------------------------------------------------------------

// A ternary explicitly chooses between TWO expressions:
//
// condition ? valueIfTrue : valueIfFalse
//
// `&&` evaluates the right expression only when the left side is truthy:
//
// condition && value
//
// These expressions are not interchangeable.

const authenticatedUser = true;

const ternaryResult = authenticatedUser ? "Dashboard" : "Login";

const andResult = authenticatedUser && "Dashboard";

console.log(ternaryResult); // "Dashboard"
console.log(andResult); // "Dashboard"

// The ternary provides a value for BOTH cases.
// The `&&` expression returns the falsy condition itself when the condition fails.

const unauthenticatedUser = false;

console.log(unauthenticatedUser ? "Dashboard" : "Login"); // "Login"
console.log(unauthenticatedUser && "Dashboard"); // false

// Use a ternary when there are two meaningful alternatives.
// Use `&&` when the right side should happen only when the condition is truthy.

// ---------------------------------------------------------------------
// 19. Short-circuiting in React
// ---------------------------------------------------------------------

// React commonly uses `&&` for conditional rendering when there is no
// alternative element to render.

const hasErrorMessage = true;

const errorElement = hasErrorMessage && "Error message";

console.log(errorElement); // "Error message"

// In JSX, the same pattern can be written:
//
// {hasErrorMessage && <ErrorMessage />}
//
// If `hasErrorMessage` is false, the component on the right is not rendered.
//
// A ternary is usually more appropriate when there are two alternatives:
//
// {isLoading ? <Spinner /> : <Content />}

// Be careful when the condition can be a number.
// In React, an expression such as:
//
// {count && <List />}
//
// can render `0` when `count` is zero.
//
// A boolean condition is often clearer:
//
// {count > 0 && <List />}

// ---------------------------------------------------------------------
// 20. Common mistake: assuming || means "boolean OR"
// ---------------------------------------------------------------------

// In a conditional, `||` behaves like logical OR.
// But outside a boolean context, it returns one of its operands.

const value = "hello" || "goodbye";

console.log(value); // "hello"

// This does NOT produce `true`.
//
// Similarly:

const otherValue = 0 || 10;

console.log(otherValue); // 10

// The operator is choosing between values based on truthiness.

// ---------------------------------------------------------------------
// 21. Common mistake: assuming && means "boolean AND"
// ---------------------------------------------------------------------

// `&&` also returns operands rather than forcing the result to a boolean.

const firstValue = "hello" && 42;

console.log(firstValue); // 42

const secondValue = 0 && 42;

console.log(secondValue); // 0

// If an actual boolean result is required, convert the expression explicitly.

const hasAccess = Boolean(isLoggedIn && hasPermission);

console.log(hasAccess); // true

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JavaScript evaluates logical expressions from left to right.
// - `&&` stops at the first falsy operand and returns it.
// - `||` stops at the first truthy operand and returns it.
// - If short-circuiting does not occur, the remaining operand is evaluated and returned.
// - Logical operators return operands, not necessarily `true` or `false`.
// - `&&` is useful for conditional execution and guarded operations.
// - `||` is useful for selecting the first truthy value, but treats all falsy values as missing.
// - Only the expressions that need to be evaluated are evaluated.
// - Ternaries are better when two explicit alternatives are required.
// - `??` should be considered when only `null` and `undefined` should trigger a fallback.
// - In React, `&&` is commonly used for conditional rendering when there is no alternative.
