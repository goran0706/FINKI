/**
 * Named Exports
 * =============
 *
 * Named exports allow a module to expose multiple values by their declared names.
 * Importing code must reference those exported names explicitly.
 */

// ---------------------------------------------------------------------
// 1. Exporting named values
// ---------------------------------------------------------------------

const appName = "React Tutorial";
const version = "1.0.0";

export { appName, version };

// ---------------------------------------------------------------------
// 2. Exporting declarations
// ---------------------------------------------------------------------

export const apiUrl = "/api";

export function createUser(name) {
  return {
    name,
  };
}

// ---------------------------------------------------------------------
// 3. Exporting after declaration
// ---------------------------------------------------------------------

const timeout = 5000;

function createRequest(url) {
  return {
    url,
    timeout,
  };
}

export { timeout, createRequest };

// ---------------------------------------------------------------------
// 4. Multiple named exports
// ---------------------------------------------------------------------

export const minItems = 1;
export const maxItems = 100;

export function isValidCount(count) {
  return count >= minItems && count <= maxItems;
}

// ---------------------------------------------------------------------
// 5. Named imports
// ---------------------------------------------------------------------

// Another module could contain:
// export const apiUrl = "/api";
// export function createUser(name) { return { name }; }
//
// The names are imported explicitly:
// import { apiUrl, createUser } from "./users.js";

// ---------------------------------------------------------------------
// 6. Importing multiple named exports
// ---------------------------------------------------------------------

// Multiple named exports can be imported in one statement:
// import { apiUrl, createUser, isValidCount } from "./users.js";

// ---------------------------------------------------------------------
// 7. Renaming named imports
// ---------------------------------------------------------------------

// A named import can be given a local name with `as`:
// import { createUser as createUserAccount } from "./users.js";
// The exported name remains `createUser`; only the local binding is renamed.

// ---------------------------------------------------------------------
// 8. Renaming named exports
// ---------------------------------------------------------------------

const requestTimeout = 3000;

export { requestTimeout as timeoutMs };

// ---------------------------------------------------------------------
// 9. Exporting values with different local names
// ---------------------------------------------------------------------

const developmentApi = "/api/dev";

export { developmentApi as apiEndpoint };

// ---------------------------------------------------------------------
// 10. Namespace imports
// ---------------------------------------------------------------------

// Named exports can also be imported as properties of a namespace object:
// import * as users from "./users.js";
// users.createUser("Ada");
// users.apiUrl;

// ---------------------------------------------------------------------
// 11. Named exports are statically identified
// ---------------------------------------------------------------------

export const featureEnabled = true;

export function getFeatureStatus() {
  return featureEnabled;
}

// Export names are part of the module's static structure, not created dynamically.

// ---------------------------------------------------------------------
// 12. Re-exporting named exports
// ---------------------------------------------------------------------

// A module can re-export named exports from another module:
// export { createUser, apiUrl } from "./users.js";

// ---------------------------------------------------------------------
// 13. Re-exporting with different names
// ---------------------------------------------------------------------

// A re-export can rename an exported value:
// export { createUser as createAccount } from "./users.js";

// ---------------------------------------------------------------------
// 14. Exporting everything as a namespace
// ---------------------------------------------------------------------

// A module can re-export all named exports (`export * from "./users.js"`),
// though this does not re-export a default export.

// ---------------------------------------------------------------------
// 15. Named exports and default exports
// ---------------------------------------------------------------------

// A module can have named exports and a default export concurrently:
// import { version, createUser } from "./users.js";
// import Users from "./users.js";

// ---------------------------------------------------------------------
// 16. Named exports in React modules
// ---------------------------------------------------------------------

// React modules commonly use named exports for components, hooks, utilities, and constants:
// export function UserCard({ name }) { return <article>{name}</article>; }
// export function useUser(id) { /* Hook implementation */ }
// export const userRoles = ["admin", "user"];
// import { UserCard, useUser, userRoles } from "./users.jsx";

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Named exports expose values using explicit export names.
// - A module can have multiple named exports, declared directly or exported later.
// - Named imports use curly braces: `import { value } from "./module.js"`.
// - Named imports can be renamed with `as`.
// - Namespace imports group named exports under one local object.
// - Modules can re-export named exports, but `export *` ignores default exports.
// - Named exports and a default export can coexist in the same module.
// - Frequently used for React components, hooks, utilities, and constants.
