/**
 * Additional Utility Types
 * ========================
 *
 * TypeScript provides a rich set of built-in utility types that facilitate
 * union manipulations, conditional filtering, and function signature extractions
 * without repetitive manual type definitions.
 */

// ---------------------------------------------------------------------
// 1. Exclude<T, U>
// ---------------------------------------------------------------------

type AllRoles = "admin" | "editor" | "viewer" | "guest";

// Construct a type by excluding types from `T` that are assignable to `U`:
// Equivalent to: "admin" | "editor" | "viewer"
type ActiveRoles = Exclude<AllRoles, "guest">;

const role: ActiveRoles = "editor"; // Valid
// const guestRole: ActiveRoles = "guest"; // Error: Type '"guest"' is not assignable to type 'ActiveRoles'

// ---------------------------------------------------------------------
// 2. Extract<T, U>
// ---------------------------------------------------------------------

type MixedUnion = string | number | boolean | (() => void);

// Construct a type by extracting union members from `T` that are assignable to `U`:
// Equivalent to: string | number
type PrimitiveOnly = Extract<MixedUnion, string | number>;

const value: PrimitiveOnly = 42; // Valid

// ---------------------------------------------------------------------
// 3. NonNullable<T>
// ---------------------------------------------------------------------

type MaybeString = string | null | undefined;

// Construct a type by excluding `null` and `undefined` from `T`:
// Equivalent to: string
type DefiniteString = NonNullable<MaybeString>;

const str: DefiniteString = "hello"; // Valid
// const nil: DefiniteString = null; // Error: Type 'null' is not assignable to type 'string'

// ---------------------------------------------------------------------
// 4. Parameters<T>
// ---------------------------------------------------------------------

function createUser(name: string, age: number, isAdmin: boolean) {
  return { name, age, isAdmin };
}

// Extract the parameter types of a function type as a tuple:
// Equivalent to: [name: string, age: number, isAdmin: boolean]
type CreateUserParams = Parameters<typeof createUser>;

const args: CreateUserParams = ["Ana", 30, false];

// ---------------------------------------------------------------------
// 5. ReturnType<T>
// ---------------------------------------------------------------------

// Extract the return type of a function type:
// Equivalent to: { name: string; age: number; isAdmin: boolean; }
type CreatedUser = ReturnType<typeof createUser>;

const newUser: CreatedUser = {
  name: "Elena",
  age: 25,
  isAdmin: true,
};

// ---------------------------------------------------------------------
// 6. Awaited<T>
// ---------------------------------------------------------------------

// Unwraps the resolved type of a Promise recursively:
type AsyncResult = Awaited<Promise<Promise<string>>>; // string

async function fetchUserData(): Promise<{ id: number; name: string }> {
  return { id: 1, name: "Ana" };
}

// Automatically extract the resolved payload type from an async function:
type UserPayload = Awaited<ReturnType<typeof fetchUserData>>; // { id: number; name: string; }

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Exclude<T, U>` removes union members from `T` that match `U`.
// - `Extract<T, U>` keeps only union members from `T` that match `U`.
// - `NonNullable<T>` filters out `null` and `undefined` from a union type.
// - `Parameters<T>` extracts a function's parameter types into a tuple.
// - `ReturnType<T>` extracts what a function type evaluates and returns.
// - `Awaited<T>` unwraps nested Promise structures to get the underlying resolved type.
