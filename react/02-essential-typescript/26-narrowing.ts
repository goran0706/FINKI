/**
 * Narrowing
 * =========
 *
 * Narrowing is the process of refining a value from a broader type into a more
 * specific type based on checks in the code. TypeScript uses these checks to
 * determine which operations are safe for the value at each point.
 */

// -----------------------------------------------------------------------
// 1. Narrowing with `typeof`
// -----------------------------------------------------------------------

// `typeof` can narrow primitive union types based on their runtime type.
function formatValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  return value.toFixed(2);
}

console.log(formatValue("hello")); // "HELLO"
console.log(formatValue(42.5)); // "42.50"

// Inside the `if` block, `value` is narrowed to `string`.
// After the check, TypeScript knows that `value` must be `number`.

// -----------------------------------------------------------------------
// 2. Narrowing with `typeof` for booleans
// -----------------------------------------------------------------------

// `typeof` can distinguish boolean values from other primitive types.
function describeValue(value: string | boolean): string {
  if (typeof value === "boolean") {
    return value ? "Enabled" : "Disabled";
  }

  return value.toUpperCase();
}

console.log(describeValue(true)); // "Enabled"
console.log(describeValue("hello")); // "HELLO"

// -----------------------------------------------------------------------
// 3. Narrowing with equality checks
// -----------------------------------------------------------------------

// Equality checks can narrow a union to a specific literal value.
function getLabel(status: "pending" | "success" | "error"): string {
  if (status === "success") {
    return "Request completed";
  }

  if (status === "error") {
    return "Request failed";
  }

  return "Request is pending";
}

console.log(getLabel("success")); // "Request completed"
console.log(getLabel("error")); // "Request failed"
console.log(getLabel("pending")); // "Request is pending"

// TypeScript narrows `status` to the matching literal type in each branch.

// -----------------------------------------------------------------------
// 4. Narrowing with truthiness
// -----------------------------------------------------------------------

// Truthiness checks can narrow values that may be `null` or `undefined`.
function getUsername(username: string | null): string {
  if (username) {
    return username.toUpperCase();
  }

  return "Anonymous";
}

console.log(getUsername("John Doe")); // "JOHN DOE"
console.log(getUsername(null)); // "Anonymous"

// The truthy branch narrows `username` from `string | null` to `string`.

// -----------------------------------------------------------------------
// 5. Narrowing with `null` and `undefined` checks
// -----------------------------------------------------------------------

// Explicit checks make it clear which values are being excluded.
function getLength(value: string | null | undefined): number {
  if (value !== null && value !== undefined) {
    return value.length;
  }

  return 0;
}

console.log(getLength("TypeScript")); // 10
console.log(getLength(null)); // 0
console.log(getLength(undefined)); // 0

// After both checks, `value` is narrowed to `string`.

// -----------------------------------------------------------------------
// 6. Narrowing with the `in` operator
// -----------------------------------------------------------------------

// The `in` operator can determine which object type contains a property.
type Admin = {
  username: string;
  permissions: string[];
};

type Guest = {
  username: string;
  expiresAt: Date;
};

function describeUser(user: Admin | Guest): string {
  if ("permissions" in user) {
    return `${user.username}: ${user.permissions.join(", ")}`;
  }

  return `${user.username}: expires ${user.expiresAt.toISOString()}`;
}

const admin: Admin = {
  username: "admin",
  permissions: ["read", "write"],
};

const guest: Guest = {
  username: "guest",
  expiresAt: new Date("2026-12-31"),
};

console.log(describeUser(admin)); // "admin: read, write"
console.log(describeUser(guest)); // expiration date

// The presence of `permissions` narrows the value to `Admin`.
// The absence of that property narrows it to `Guest`.

// -----------------------------------------------------------------------
// 7. Narrowing with `instanceof`
// -----------------------------------------------------------------------

// `instanceof` can narrow values to specific class instances.
function formatDate(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return value.toUpperCase();
}

console.log(formatDate(new Date("2026-01-01"))); // ISO date string
console.log(formatDate("hello")); // "HELLO"

// TypeScript knows that `value` is a `Date` inside the first branch
// and a `string` in the remaining branch.

// -----------------------------------------------------------------------
// 8. Narrowing after assignment
// -----------------------------------------------------------------------

// TypeScript also tracks the current type of a variable after assignment.
let value: string | number = "hello";

if (typeof value === "string") {
  console.log(value.toUpperCase()); // "HELLO"
}

value = 100;

console.log(value.toFixed(2)); // "100.00"

// After assigning a number, TypeScript knows that `value` is currently a `number`.

// -----------------------------------------------------------------------
// 9. Narrowing function parameters
// -----------------------------------------------------------------------

// Narrowing can be performed directly on function parameters.
function printId(id: string | number): void {
  if (typeof id === "number") {
    console.log(`Numeric ID: ${id}`);
    return;
  }

  console.log(`String ID: ${id.toUpperCase()}`);
}

printId(42); // "Numeric ID: 42"
printId("user-42"); // "String ID: USER-42"

// The parameter starts as `string | number` and is narrowed before use.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - Narrowing refines a broader type into a more specific type.
// - `typeof` narrows primitive union types such as `string | number`.
// - Equality checks can narrow values to specific literal types.
// - Truthiness and nullish checks can remove `null` and `undefined` from a type.
// - The `in` operator narrows object unions based on property presence.
// - `instanceof` narrows values to specific class instances.
// - TypeScript also tracks narrowing after assignments and inside function branches.
