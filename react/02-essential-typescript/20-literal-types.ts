/**
 * Literal Types
 * =============
 *
 * A literal type represents a specific value rather than a broad type such as
 * `string`, `number`, or `boolean`. Literal types are useful when a value must
 * be one of a known set of exact values.
 */

// -----------------------------------------------------------------------
// 1. String literal types
// -----------------------------------------------------------------------

// A string literal type allows only the specified string value.
let direction: "up" = "up";

console.log(direction); // "up"

// direction = "down"; // TS2322: Type '"down"' is not assignable to type '"up"'.

// -----------------------------------------------------------------------
// 2. Number literal types
// -----------------------------------------------------------------------

// A number literal type allows only the specified numeric value.
let statusCode: 200 = 200;

console.log(statusCode); // 200

// statusCode = 404; // TS2322: Type '404' is not assignable to type '200'.

// -----------------------------------------------------------------------
// 3. Boolean literal types
// -----------------------------------------------------------------------

// Boolean literal types restrict a value to exactly `true` or exactly `false`.
let enabled: true = true;

console.log(enabled); // true

// enabled = false; // TS2322: Type 'false' is not assignable to type 'true'.

// -----------------------------------------------------------------------
// 4. Literal types with unions
// -----------------------------------------------------------------------

// Literal types become especially useful when combined into a union.
let directionName: "up" | "down" | "left" | "right" = "up";

console.log(directionName); // "up"

directionName = "right";

console.log(directionName); // "right"

// directionName = "forward"; // TS2322: Type '"forward"' is not assignable to type '"up" | "down" | "left" | "right"'.

// -----------------------------------------------------------------------
// 5. Literal types for application states
// -----------------------------------------------------------------------

// A literal union can model a fixed set of valid application states.
type RequestStatus = "idle" | "loading" | "success" | "error";

let requestStatus: RequestStatus = "idle";

console.log(requestStatus); // "idle"

requestStatus = "loading";

console.log(requestStatus); // "loading"

// requestStatus = "pending"; // TS2322: Type '"pending"' is not assignable to type 'RequestStatus'.

// -----------------------------------------------------------------------
// 6. Literal types for numeric values
// -----------------------------------------------------------------------

// Numeric literal unions can restrict values to a known set of valid numbers.
type HttpStatusCode = 200 | 201 | 400 | 401 | 404 | 500;

let responseCode: HttpStatusCode = 200;

console.log(responseCode); // 200

responseCode = 404;

console.log(responseCode); // 404

// responseCode = 301; // TS2322: Type '301' is not assignable to type 'HttpStatusCode'.

// -----------------------------------------------------------------------
// 7. Literal types in object properties
// -----------------------------------------------------------------------

// Literal types can constrain individual properties of an object.
type Button = {
  label: string;
  variant: "primary" | "secondary" | "danger";
};

let saveButton: Button = {
  label: "Save",
  variant: "primary",
};

console.log(saveButton); // { label: 'Save', variant: 'primary' }

saveButton.variant = "danger";

console.log(saveButton); // { label: 'Save', variant: 'danger' }

// saveButton.variant = "success"; // TS2322: Type '"success"' is not assignable to type '"primary" | "secondary" | "danger"'.

// -----------------------------------------------------------------------
// 8. Literal type inference
// -----------------------------------------------------------------------

// `const` variables can preserve literal types because their values cannot be reassigned.
const theme = "dark";

console.log(theme); // "dark"

// `let` variables normally widen their types because their values can change.
let currentTheme = "dark";

currentTheme = "light";

console.log(currentTheme); // "light"

// `theme` is inferred as the literal type `"dark"` while `currentTheme` is inferred as `string`.

// -----------------------------------------------------------------------
// 9. Const assertions
// -----------------------------------------------------------------------

// `as const` prevents literal values from being widened to broader types.
const configuration = {
  mode: "production",
  retries: 3,
} as const;

console.log(configuration); // { mode: 'production', retries: 3 }

// configuration.mode = "development"; // TS2540: Cannot assign to 'mode' because it is a read-only property.
// configuration.retries = 5; // TS2540: Cannot assign to 'retries' because it is a read-only property.

// `as const` also makes nested values readonly and preserves their literal types.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - Literal types represent specific values such as `"active"`, `200`, or `true`.
// - String, number, and boolean literals can be used as individual types.
// - Literal types are commonly combined with unions to define a fixed set of valid values.
// - Literal types can constrain object properties and function inputs.
// - `const` declarations can preserve literal types when TypeScript can safely do so.
// - `as const` preserves literal values and makes the resulting object or array readonly.
