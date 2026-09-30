/**
 * TypeScript Modules
 * ==================
 *
 * TypeScript extends standard ECMAScript modules with type-level imports
 * and exports, enabling clean separation of code and type definitions
 * across project files.
 */

// ---------------------------------------------------------------------
// 1. Basic Exports and Imports
// ---------------------------------------------------------------------

export interface User {
  id: number;
  name: string;
}

export function formatUser(user: User): string {
  return `${user.name} (#${user.id})`;
}

// In another file:
// import { User, formatUser } from "./user.js";

// ---------------------------------------------------------------------
// 2. Default Exports
// ---------------------------------------------------------------------

export default class HttpClient {
  get(url: string): Promise<any> {
    return fetch(url).then((res) => res.json());
  }
}

// In another file:
// import HttpClient from "./httpClient.js";

// ---------------------------------------------------------------------
// 3. Type-Only Imports and Exports (`import type`)
// ---------------------------------------------------------------------

// Using `import type` guarantees that the import is entirely erased during
// compilation, preventing unused type imports from leaking into runtime code.
//
// import type { User } from "./user.js";
//
// export type { User };

// ---------------------------------------------------------------------
// 4. Re-exporting Types and Values
// ---------------------------------------------------------------------

// Aggregate modules by re-exporting values and types from other files:
// export * from "./user.js";
// export { default as HttpClient } from "./httpClient.js";
// export type { UserSettings } from "./settings.js";

// ---------------------------------------------------------------------
// 5. Ambient Module Declarations (`.d.ts`)
// ---------------------------------------------------------------------

// Ambient declarations describe the shape of code or assets that lack
// native TypeScript types (e.g., legacy libraries, images, or CSS modules):
//
// declare module "*.css" {
//     const classes: Record<string, string>;
//     export default classes;
// }

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - TypeScript fully supports standard ECMAScript module syntax (`import`/`export`).
// - `import type` and `export type` ensure types are completely erased at compile time, optimizing build outputs.
// - Re-exporting syntax allows clean module aggregation and robust public API design.
// - Ambient declarations (`.d.ts`) provide type safety for external modules or non-JS assets.
