/**
 * Partial Utility Type
 * ====================
 *
 * TypeScript's built-in `Partial<T>` utility type constructs a type with
 * all properties of `T` set to optional, allowing you to represent partial
 * objects, incremental updates, or patch payloads safely.
 */

// ---------------------------------------------------------------------
// 1. Basic Usage of `Partial<T>`
// ---------------------------------------------------------------------

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// `Partial<User>` transforms all properties into optional ones:
// Equivalent to: { id?: number; name?: string; email?: string; role?: string; }
type PartialUser = Partial<User>;

const userUpdate: PartialUser = {
  name: "Ana", // Providing only a subset of properties is completely valid
};

// ---------------------------------------------------------------------
// 2. Practical Application: Update / Patch Functions
// ---------------------------------------------------------------------

const currentUser: User = {
  id: 1,
  name: "Ana",
  email: "ana@example.com",
  role: "developer",
};

// Function that accepts a partial object to update existing records:
function patchUser(existing: User, updates: Partial<User>): User {
  return {
    ...existing,
    ...updates,
  };
}

const updatedUser = patchUser(currentUser, {
  email: "ana.new@example.com",
  role: "admin",
});

// ---------------------------------------------------------------------
// 3. How `Partial<T>` Works Under the Hood (Mapped Types)
// ---------------------------------------------------------------------

// TypeScript implements `Partial<T>` internally using mapped types and the `?` modifier:
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

const customPartialUser: MyPartial<User> = {
  id: 2,
  // Other fields can be safely omitted
};

// ---------------------------------------------------------------------
// 4. Advanced: Implementing a Recursive `DeepPartial<T>`
// ---------------------------------------------------------------------

interface ComplexProfile {
  id: number;
  settings: {
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

// Standard `Partial<T>` is shallow—it only makes top-level properties optional.
// For nested objects, a recursive conditional mapped type is required:
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const nestedUpdate: DeepPartial<ComplexProfile> = {
  settings: {
    notifications: {
      email: false, // Deeply nested properties are also optional
    },
  },
};

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Partial<T>` makes all properties of an interface or type optional (`?`).
// - Essential for update functions, patch payloads, form state models, and configuration builders.
// - Implemented conceptually using mapped types (`{ [K in keyof T]?: T[K] }`).
// - Built-in `Partial` is shallow; recursive types like `DeepPartial` are needed when working with nested object structures.
