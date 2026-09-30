/**
 * Readonly Utility Type
 * =====================
 *
 * TypeScript's built-in `Readonly<T>` utility type constructs a type with all
 * properties of `T` set to `readonly`, marking them as non-writable and preventing
 * accidental mutation after object creation.
 */

// ---------------------------------------------------------------------
// 1. Basic Usage of `Readonly<T>`
// ---------------------------------------------------------------------

interface User {
  id: number;
  name: string;
  email: string;
}

// `Readonly<User>` transforms all properties so they cannot be modified:
// Equivalent to: { readonly id: number; readonly name: string; readonly email: string; }
type ReadonlyUser = Readonly<User>;

const user: ReadonlyUser = {
  id: 1,
  name: "Ana",
  email: "ana@example.com",
};

// user.name = "Elena"; // Error: Cannot assign to 'name' because it is a read-only property

// ---------------------------------------------------------------------
// 2. Practical Application: Immutable State or Configuration
// ---------------------------------------------------------------------

interface AppConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
}

// Enforce immutability on configuration objects to prevent runtime tampering:
function loadConfig(config: Readonly<AppConfig>) {
  // config.timeout = 10000; // Error: Cannot assign to 'timeout'
  console.log(`Connecting to ${config.apiUrl}`);
}

const config: AppConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
};

loadConfig(config);

// ---------------------------------------------------------------------
// 3. How `Readonly<T>` Works Under the Hood (Mapped Types)
// ---------------------------------------------------------------------

// TypeScript implements `Readonly<T>` internally using mapped types and the `readonly` modifier:
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type CustomReadonlyUser = MyReadonly<User>;

const customUser: CustomReadonlyUser = {
  id: 2,
  name: "Elena",
  email: "elena@example.com",
};

// customUser.id = 3; // Error: Cannot assign to 'id'

// ---------------------------------------------------------------------
// 4. Advanced: Implementing a Recursive `DeepReadonly<T>`
// ---------------------------------------------------------------------

interface ComplexSettings {
  theme: string;
  window: {
    width: number;
    height: number;
  };
}

// Standard `Readonly<T>` is shallow—it only freezes top-level properties.
// For nested structures, a recursive conditional mapped type is needed:
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

const appSettings: DeepReadonly<ComplexSettings> = {
  theme: "dark",
  window: {
    width: 1920,
    height: 1080,
  },
};

// appSettings.window.width = 1280; // Error: Cannot assign to 'width' because it is a read-only property

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Readonly<T>` marks all properties of an object type as `readonly`.
// - Ideal for protecting configuration settings, state stores, constants, and function parameters from accidental mutation.
// - Implemented conceptually using mapped types with the `readonly` modifier (`{ readonly [K in keyof T]: T[K] }`).
// - The built-in utility is shallow; recursive types like `DeepReadonly` are necessary for fully freezing nested object hierarchies.
