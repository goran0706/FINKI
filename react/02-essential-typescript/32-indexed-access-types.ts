/**
 * Indexed Access Types
 * ====================
 *
 * TypeScript's indexed access types allow you to look up and extract the
 * type of a specific property from another type using bracket notation,
 * mirroring how property access works at runtime.
 */

// ---------------------------------------------------------------------
// 1. Basic Indexed Access
// ---------------------------------------------------------------------

interface User {
  id: number;
  name: string;
  email: string;
  profile: {
    bio: string;
    age: number;
  };
}

// Extract the type of a single property:
type UserName = User["name"]; // string
type UserId = User["id"]; // number

// ---------------------------------------------------------------------
// 2. Indexing with a Union of Keys
// ---------------------------------------------------------------------

// Passing a union of keys extracts a union of their corresponding property types:
type UserIdentifiers = User["id" | "name"]; // number | string

// Combining with `keyof` to extract all property types from an interface:
type AllUserValues = User[keyof User]; // number | string | { bio: string; age: number; }

// ---------------------------------------------------------------------
// 3. Nested Property Access
// ---------------------------------------------------------------------

// Chain bracket notation to look up deep properties:
type UserBio = User["profile"]["bio"]; // string
type UserProfile = User["profile"]; // { bio: string; age: number; }

// ---------------------------------------------------------------------
// 4. Indexing Arrays and Tuples
// ---------------------------------------------------------------------

const roles = ["admin", "editor", "viewer"] as const;

// Extract a union of all possible array element types using [number]:
type Role = (typeof roles)[number]; // "admin" | "editor" | "viewer"

// Indexing fixed-length tuples at specific indices:
type CoordinateTuple = [number, number, string];
type XCoordinate = CoordinateTuple[0]; // number
type TupleLabel = CoordinateTuple[2]; // string

// ---------------------------------------------------------------------
// 5. Practical Example: Component or Config Sub-Types
// ---------------------------------------------------------------------

interface AppSchema {
  endpoints: {
    users: { path: "/api/users"; method: "GET" };
    posts: { path: "/api/posts"; method: "POST" };
  };
}

// Extract a sub-type directly from a deeply nested structure:
type UsersEndpoint = AppSchema["endpoints"]["users"]; // { path: "/api/users"; method: "GET"; }

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Indexed access types (`T[K]`) let you query and extract property types using familiar bracket syntax.
// - Supports union lookups (`T[K1 | K2]`) to automatically combine multiple property types.
// - Use `[number]` on arrays or `[index]` on tuples to extract element types.
// - Promotes DRY (Don't Repeat Yourself) code by deriving sub-types straight from source-of-truth interfaces or objects.
