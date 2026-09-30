/**
 * Enums
 * =====
 *
 * TypeScript enums allow you to define a collection of named constants, making
 * it easier to document intent, represent distinct states, or restrict values
 * to a set of mutually exclusive choices.
 */

// ---------------------------------------------------------------------
// 1. Numeric Enums
// ---------------------------------------------------------------------

// By default, numeric enums start at 0 and auto-increment subsequent values:
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

const currentDirection: Direction = Direction.Up;

// ---------------------------------------------------------------------
// 2. Initialized Numeric Enums
// ---------------------------------------------------------------------

// You can explicitly assign starting values, and subsequent members continue auto-incrementing:
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized, // Automatically 401
}

const statusValue: HttpStatus = HttpStatus.OK;

// ---------------------------------------------------------------------
// 3. String Enums
// ---------------------------------------------------------------------

// String enums require every member to be initialized with a string literal,
// providing meaningful runtime values that improve logging and debugging:
enum UserRole {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER",
}

const userRole: UserRole = UserRole.Admin;

// ---------------------------------------------------------------------
// 4. Const Enums
// ---------------------------------------------------------------------

// Prefixing an enum with `const` completely removes the generated runtime object
// during compilation, inlining member values directly into the output code:
const enum LogLevel {
  Info,
  Warning,
  Error,
}

const level: LogLevel = LogLevel.Error; // Compiles down directly to the literal value `2`

// ---------------------------------------------------------------------
// 5. Union Types as an Alternative to Enums
// ---------------------------------------------------------------------

// Modern TypeScript projects frequently prefer string literal unions over
// enums for a lighter runtime footprint and native JavaScript interoperability:
type Theme = "light" | "dark" | "system";

const activeTheme: Theme = "dark";

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Enums define structured sets of named constants (numeric or string-based).
// - Numeric enums auto-increment values starting from 0 or a specified custom initializer.
// - String enums retain explicit string values at runtime, aiding readability and log inspection.
// - `const enum` optimizes performance by inlining constants and eliminating runtime object allocation.
// - String literal union types (`type X = "a" | "b"`) offer a lightweight, idiomatically modern alternative to enums.
