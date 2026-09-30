/**
 * User-Defined Type Guards
 * ========================
 *
 * A user-defined type guard is a function whose return type uses a type predicate
 * to tell TypeScript that a value has a more specific type when the function returns true.
 */

// -----------------------------------------------------------------------
// 1. Defining a type guard
// -----------------------------------------------------------------------

// A type predicate has the form `value is Type`.
function isString(value: unknown): value is string {
  return typeof value === "string";
}

const value: unknown = "Hello";

if (isString(value)) {
  console.log(value.toUpperCase()); // "HELLO"
}

// After `isString(value)` returns true, TypeScript narrows `value` to `string`.

// -----------------------------------------------------------------------
// 2. Type guards for object types
// -----------------------------------------------------------------------

// A type guard can check whether an unknown value matches an object shape.
type User = {
  id: number;
  name: string;
};

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("id" in value) || !("name" in value)) {
    return false;
  }

  return typeof value.id === "number" && typeof value.name === "string";
}

const data: unknown = {
  id: 1,
  name: "John Doe",
};

if (isUser(data)) {
  console.log(data.name); // "John Doe"
}

// The type guard validates the runtime shape and narrows `data` to `User`.

// -----------------------------------------------------------------------
// 3. Type guards with arrays
// -----------------------------------------------------------------------

// Type guards can identify arrays containing values of a specific type.
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

const names: unknown = ["John", "Jane", "Mark"];

if (isStringArray(names)) {
  console.log(names.join(", ")); // "John, Jane, Mark"
}

// TypeScript narrows `names` to `string[]` after the guard succeeds.

// -----------------------------------------------------------------------
// 4. Type guards with union types
// -----------------------------------------------------------------------

// A type guard can distinguish between members of an object union.
type Admin = {
  username: string;
  permissions: string[];
};

type Guest = {
  username: string;
  expiresAt: Date;
};

function isAdmin(user: Admin | Guest): user is Admin {
  return "permissions" in user;
}

function describeUser(user: Admin | Guest): string {
  if (isAdmin(user)) {
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

// `isAdmin` tells TypeScript that a successful check means `user` is an `Admin`.

// -----------------------------------------------------------------------
// 5. Type guards in array methods
// -----------------------------------------------------------------------

// Type guards can be used with array methods to produce more precise types.
type Product = {
  id: number;
  name: string;
};

const values: unknown[] = [{ id: 1, name: "Keyboard" }, "invalid", { id: 2, name: "Mouse" }];

const products: Product[] = values.filter(isProduct);

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return "id" in value && "name" in value && typeof value.id === "number" && typeof value.name === "string";
}

console.log(products); // [ { id: 1, name: 'Keyboard' }, { id: 2, name: 'Mouse' } ]

// The type predicate allows `filter` to infer the result as `Product[]`.

// -----------------------------------------------------------------------
// 6. Generic type guards
// -----------------------------------------------------------------------

// A generic type guard can check whether a value is an array of a specific type.
function isArrayOf<T>(value: unknown, guard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(guard);
}

const numbers: unknown = [10, 20, 30];

if (isArrayOf(numbers, (item): item is number => typeof item === "number")) {
  console.log(numbers.reduce((total, number) => total + number, 0)); // 60
}

// The guard function determines the element type while `isArrayOf` handles the array check.

// -----------------------------------------------------------------------
// 7. Type guards vs boolean functions
// -----------------------------------------------------------------------

// A regular boolean function does not provide TypeScript with narrowing information.
function isNumberBoolean(value: unknown): boolean {
  return typeof value === "number";
}

function isNumberGuard(value: unknown): value is number {
  return typeof value === "number";
}

const input: unknown = 42;

if (isNumberBoolean(input)) {
  // input.toFixed(2); // TS18046: 'input' is of type 'unknown'.
}

if (isNumberGuard(input)) {
  console.log(input.toFixed(2)); // "42.00"
}

// The `value is number` predicate connects the runtime check to TypeScript's type system.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - A user-defined type guard is a function whose return type uses a type predicate.
// - The `value is Type` syntax tells TypeScript how to narrow a value after a successful check.
// - Type guards can validate primitives, objects, arrays, and union members.
// - Type guards work naturally with array methods such as `filter`.
// - Generic type guards can reuse the same narrowing logic for different types.
// - A boolean-returning function does not narrow a value unless its return type is a type predicate.
