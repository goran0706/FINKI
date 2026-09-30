/**
 * Generics with Constraints
 * =========================
 *
 * Generic constraints allow you to restrict the types that can be passed
 * to a generic function, interface, or class using the `extends` keyword,
 * ensuring that type parameters possess required properties or structures.
 */

// ---------------------------------------------------------------------
// 1. Basic Generic Constraints (`extends`)
// ---------------------------------------------------------------------

interface Lengthwise {
  length: number;
}

// Restricting `T` so it must satisfy the `Lengthwise` interface:
function logLength<T extends Lengthwise>(item: T): T {
  console.log(item.length);
  return item;
}

logLength("hello"); // Valid: string has a length property
logLength([1, 2, 3]); // Valid: array has a length property
logLength({ length: 10 }); // Valid: object explicitly has a length property
// logLength(42);          // Error: number does not have a length property

// ---------------------------------------------------------------------
// 2. Using `keyof` Constraints (`K extends keyof T`)
// ---------------------------------------------------------------------

// Enforcing that a key parameter belongs strictly to an object's keys:
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Ana", email: "ana@example.com" };

const userName = getProperty(user, "name"); // Valid: returns string
// getProperty(user, "age");                // Error: "age" is not a key of user

// ---------------------------------------------------------------------
// 3. Constraining One Type Parameter with Another
// ---------------------------------------------------------------------

// Ensuring that type parameter `K` is constrained to the keys of type `T`:
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

const users = [
  { id: 1, name: "Ana" },
  { id: 2, name: "Elena" },
];

const names = pluck(users, "name"); // Inferred return type: string[]
const ids = pluck(users, "id"); // Inferred return type: number[]

// ---------------------------------------------------------------------
// 4. Multiple Constraints Using Intersection Types
// ---------------------------------------------------------------------

interface Named {
  name: string;
}

interface Identifiable {
  id: number;
}

// A type parameter can be constrained by multiple interfaces combined with `&`:
function processEntity<T extends Named & Identifiable>(entity: T): string {
  return `[ID: ${entity.id}] ${entity.name}`;
}

processEntity({ id: 1, name: "Ana", role: "Admin" }); // Valid: has both id and name
// processEntity({ id: 1 });                         // Error: missing 'name' property

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Generic constraints use the `extends` keyword to restrict allowable types for a type parameter.
// - Guarantees that generic inputs safely expose required properties or methods at compile time.
// - `K extends keyof T` is essential for type-safe property lookups and manipulation.
// - Multiple constraints can be enforced simultaneously using intersection types (`T extends A & B`).
