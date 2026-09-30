/**
 * Nullish Coalescing
 * ==================
 *
 * The nullish coalescing operator (`??`) provides a fallback value when
 * the value on its left side is `null` or `undefined`.
 *
 * Unlike the logical OR operator (`||`), it does not treat other falsy
 * values such as `0`, `false`, or `""` as missing.
 */

// ---------------------------------------------------------------------
// 1. Basic nullish coalescing
// ---------------------------------------------------------------------

// If the left side is `null` or `undefined`, `??` returns the right side fallback.
const missingValue = null;
const defaultValue = "default";

console.log(missingValue ?? defaultValue); // "default"

const undefinedValue = undefined;
console.log(undefinedValue ?? defaultValue); // "default"

// If the left side has a non-nullish value, that value is returned instead.
const existingValue = "provided";
console.log(existingValue ?? defaultValue); // "provided"

// ---------------------------------------------------------------------
// 2. `null` and `undefined` are the only nullish values
// ---------------------------------------------------------------------

// Other falsy values like `0`, `false`, `""`, or `NaN` are preserved by `??`.
console.log(null ?? "fallback"); // "fallback"
console.log(undefined ?? "fallback"); // "fallback"
console.log(0 ?? "fallback"); // 0
console.log(false ?? "fallback"); // false
console.log("" ?? "fallback"); // ""
console.log(NaN ?? "fallback"); // NaN

// ---------------------------------------------------------------------
// 3. `??` vs. `||`
// ---------------------------------------------------------------------

// Logical OR (`||`) uses truthiness, while nullish coalescing (`??`) uses only nullishness.
console.log(0 || 100); // 100
console.log(0 ?? 100); // 0
console.log(false || true); // true
console.log(false ?? true); // false
console.log("" || "fallback"); // "fallback"
console.log("" ?? "fallback"); // ""

// ---------------------------------------------------------------------
// 4. Preserving zero
// ---------------------------------------------------------------------

// The nullish coalescing operator correctly preserves `0` as an intentional numeric value.
const page = 0;

const pageWithOr = page || 1;
const pageWithNullish = page ?? 1;

console.log(pageWithOr); // 1
console.log(pageWithNullish); // 0

// ---------------------------------------------------------------------
// 5. Preserving false
// ---------------------------------------------------------------------

// Boolean `false` values are preserved rather than replaced by defaults.
const isEnabled = false;

const enabledWithOr = isEnabled || true;
const enabledWithNullish = isEnabled ?? true;

console.log(enabledWithOr); // true
console.log(enabledWithNullish); // false

// ---------------------------------------------------------------------
// 6. Preserving empty strings
// ---------------------------------------------------------------------

// Empty strings are treated as valid provided values rather than missing state.
const username = "";

console.log(username || "Anonymous"); // "Anonymous"
console.log(username ?? "Anonymous"); // ""

// ---------------------------------------------------------------------
// 7. Using `??` with variables
// ---------------------------------------------------------------------

// Variables initialized to `undefined` or reassigned to `null` trigger the fallback.
let configuredValue;
console.log(configuredValue ?? "default"); // "default"

configuredValue = 0;
console.log(configuredValue ?? "default"); // 0

configuredValue = null;
console.log(configuredValue ?? "default"); // "default"

// ---------------------------------------------------------------------
// 8. Using `??` with object properties
// ---------------------------------------------------------------------

// Missing properties or properties explicitly set to `null` trigger the fallback value.
const user = {
  name: "John",
  age: null,
};

console.log(user.name ?? "Anonymous"); // "John"
console.log(user.age ?? 18); // 18
console.log(user.role ?? "user"); // "user"

// ---------------------------------------------------------------------
// 9. Combining optional chaining and `??`
// ---------------------------------------------------------------------

// Optional chaining pairs naturally with nullish coalescing for safe deep property reads.
const response = {
  user: {
    profile: {
      name: "John",
    },
  },
};

const displayName = response.user?.profile?.name ?? "Anonymous";
console.log(displayName); // "John"

const incompleteResponse = {
  user: null,
};

const fallbackName = incompleteResponse.user?.profile?.name ?? "Anonymous";
console.log(fallbackName); // "Anonymous"

// ---------------------------------------------------------------------
// 10. Chaining multiple nullish fallbacks
// ---------------------------------------------------------------------

// Multiple `??` operators evaluate from left to right until the first non-nullish value is found.
const firstValue = null;
const secondValue = undefined;
const thirdValue = "available";

const result = firstValue ?? secondValue ?? thirdValue;
console.log(result); // "available"

// ---------------------------------------------------------------------
// 11. Right-hand side is evaluated only when needed
// ---------------------------------------------------------------------

// The right-hand expression short-circuits and executes only if the left-hand side is nullish.
function createDefault() {
  console.log("Creating default");
  return "default";
}

const provided = "value";
console.log(provided ?? createDefault()); // "value" (createDefault not called)

const missing = null;
console.log(missing ?? createDefault()); // "Creating default", then "default"

// ---------------------------------------------------------------------
// 12. `??` with function calls
// ---------------------------------------------------------------------

// Function return values are evaluated first and checked for nullishness.
function getConfiguredName() {
  return undefined;
}

const configuredName = getConfiguredName() ?? "Anonymous";
console.log(configuredName); // "Anonymous"

// ---------------------------------------------------------------------
// 13. Operator precedence
// ---------------------------------------------------------------------

// `??` has lower precedence than arithmetic operators and requires grouping when mixed.
const total = 10 + 5 ?? 0;
console.log(total); // 15

const resultWithGrouping = (null ?? 10) * 2;
console.log(resultWithGrouping); // 20

// ---------------------------------------------------------------------
// 14. Mixing `??` with `||` or `&&`
// ---------------------------------------------------------------------

// Direct mixing of `??` with `||` or `&&` is disallowed without explicit parentheses.
// const invalid = null || undefined ?? "fallback"; // SyntaxError

const withOr = (null || undefined) ?? "fallback";
console.log(withOr); // "fallback"

const withNullish = null ?? (false || "fallback");
console.log(withNullish); // "fallback"

// ---------------------------------------------------------------------
// 15. Nullish assignment (`??=`)
// ---------------------------------------------------------------------

// The `??=` operator assigns a value only if the existing variable is `null` or `undefined`.
let count;
count ??= 10;
console.log(count); // 10

count ??= 20;
console.log(count); // 10 (not updated)

// ---------------------------------------------------------------------
// 16. `??=` preserves falsy values
// ---------------------------------------------------------------------

// Falsy values like `0`, `false`, and `""` prevent the nullish assignment from overwriting them.
let retryCount = 0;
let enabled = false;
let label = "";

retryCount ??= 3;
enabled ??= true;
label ??= "Default";

console.log(retryCount); // 0
console.log(enabled); // false
console.log(label); // ""

// ---------------------------------------------------------------------
// 17. `??=` with object properties
// ---------------------------------------------------------------------

// Nullish assignment works on object properties, updating only missing or nullish keys.
const settings = {
  timeout: undefined,
  retries: 0,
};

settings.timeout ??= 5000;
settings.retries ??= 3;

console.log(settings); // { timeout: 5000, retries: 0 }

// ---------------------------------------------------------------------
// 18. Choosing between `??` and `||`
// ---------------------------------------------------------------------

// Use `??` when falsy values are valid data; use `||` when any falsy value should trigger a fallback.
function getPageSize(size) {
  return size ?? 20;
}

console.log(getPageSize(0)); // 0
console.log(getPageSize(null)); // 20

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `??` returns the right-hand value only when the left-hand value is `null` or `undefined`.
// - Unlike `||`, `??` preserves `0`, `false`, `""`, and `NaN`.
// - `??` short-circuits, running the right-hand expression only when needed.
// - `??` pairs effectively with optional chaining for safe property lookups.
// - `??=` assigns a value only when the existing target is `null` or `undefined`.
// - Direct mixing of `??` with `||` or `&&` requires explicit parentheses.
