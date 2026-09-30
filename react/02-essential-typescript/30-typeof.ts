/**
 * Typeof Operator
 * ===============
 *
 * TypeScript's `typeof` type operator allows you to extract the type of a
 * variable, constant, or property at compile time, bridging runtime values
 * and static typing.
 */

// ---------------------------------------------------------------------
// 1. Runtime vs. Type-Level `typeof`
// ---------------------------------------------------------------------

const score = 100;

// JavaScript runtime operator (evaluates to a string at runtime):
const runtimeType = typeof score; // "number"

// TypeScript type operator (extracts the type definition at compile time):
type ScoreType = typeof score; // 100 (literal type since it's a const)

// ---------------------------------------------------------------------
// 2. Extracting Types from Configuration Objects
// ---------------------------------------------------------------------

const config = {
  endpoint: "https://api.example.com",
  timeout: 5000,
  retries: 3,
};

// Extract the entire shape of the configuration object as a type:
type AppConfig = typeof config;

// Equivalent to:
// type AppConfig = {
//     endpoint: string;
//     timeout: number;
//     retries: number;
// }

function initializeApp(options: AppConfig) {
  // Implementation
}

// ---------------------------------------------------------------------
// 3. Combining `typeof` with `keyof`
// ---------------------------------------------------------------------

const permissions = {
  read: 1,
  write: 2,
  execute: 4,
} as const;

// Extract a union of keys from the object:
type PermissionKey = keyof typeof permissions; // "read" | "write" | "execute"

// Extract a union of values from the object:
type PermissionValue = (typeof permissions)[PermissionKey]; // 1 | 2 | 4

// ---------------------------------------------------------------------
// 4. Inferring Function and Method Signatures
// ---------------------------------------------------------------------

function calculateTotal(price: number, tax: number) {
  return price + tax;
}

// Extract the function signature type:
type CalculateFn = typeof calculateTotal; // (price: number, tax: number) => number

// Commonly paired with utility types like ReturnType or Parameters:
type TotalResult = ReturnType<typeof calculateTotal>; // number
type CalcParams = Parameters<typeof calculateTotal>; // [price: number, tax: number]

// ---------------------------------------------------------------------
// 5. Array and Tuple Inferences
// ---------------------------------------------------------------------

const supportedLocales = ["en-US", "mk-MK", "de-DE"] as const;

// Extract the readonly tuple type:
type LocalesTuple = typeof supportedLocales; // readonly ["en-US", "mk-MK", "de-DE"]

// Extract a union type of all array elements:
type Locale = (typeof supportedLocales)[number]; // "en-US" | "mk-MK" | "de-DE"

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - TypeScript's `typeof` operates at the type level to extract types directly from values.
// - It is distinct from JavaScript's runtime `typeof` operator, which returns string tags.
// - Ideal for capturing shapes of constants, lookup maps, and configuration objects (especially with `as const`).
// - Frequently combined with `keyof` (`keyof typeof obj`) and utility types like `ReturnType` for advanced type safety.
