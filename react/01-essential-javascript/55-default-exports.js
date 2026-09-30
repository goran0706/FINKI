/**
 * Default Exports
 * ===============
 *
 * A default export defines the primary value a module provides.
 * A module can have one default export and any number of named exports.
 */

// ---------------------------------------------------------------------
// 1. Exporting a default value
// ---------------------------------------------------------------------

const apiClient = {
    baseUrl: "/api",
};

export default apiClient;

// ---------------------------------------------------------------------
// 2. Exporting a function as the default
// ---------------------------------------------------------------------

export default function createApiClient(baseUrl) {
    return {
        baseUrl,
    };
}

// ---------------------------------------------------------------------
// 3. Exporting a class as the default
// ---------------------------------------------------------------------

export default class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    get(path) {
        return `${this.baseUrl}${path}`;
    }
}

// ---------------------------------------------------------------------
// 4. Exporting an existing declaration as default
// ---------------------------------------------------------------------

function formatUser(user) {
    return `${user.firstName} ${user.lastName}`;
}

export default formatUser;

// ---------------------------------------------------------------------
// 5. Default imports
// ---------------------------------------------------------------------

// A default export is imported without curly braces:
// import apiClient from "./api-client.js";

// ---------------------------------------------------------------------
// 6. Default import names are local
// ---------------------------------------------------------------------

// The local import name does not need to match the exported declaration name:
// import client from "./api-client.js";

// ---------------------------------------------------------------------
// 7. Default and named exports
// ---------------------------------------------------------------------

// A module can provide both a default export and named exports concurrently:
// import createApiClient, { version } from "./api-client.js";

// ---------------------------------------------------------------------
// 8. Default imports can be renamed locally
// ---------------------------------------------------------------------

// Since the default import name is local, it can be chosen freely:
// import client from "./api-client.js";
// import api from "./api-client.js";

// ---------------------------------------------------------------------
// 9. A module has only one default export
// ---------------------------------------------------------------------

// Defining multiple default exports in a single module is invalid syntax.

// ---------------------------------------------------------------------
// 10. Default export does not mean singleton
// ---------------------------------------------------------------------

// A default export is simply a value; it does not automatically enforce a singleton pattern.
// Each invocation can yield a new distinct value.

// ---------------------------------------------------------------------
// 11. Re-exporting a default export
// ---------------------------------------------------------------------

// A default export can be directly forwarded without creating a local binding:
// export { default } from "./api-client.js";

// ---------------------------------------------------------------------
// 12. Re-exporting a default export with a named export
// ---------------------------------------------------------------------

// A default export can be exposed under a custom named export:
// export { default as apiClient } from "./api-client.js";

// ---------------------------------------------------------------------
// 13. Default exports in React modules
// ---------------------------------------------------------------------

// React components are commonly exported as default when representing a primary component:
// export default function UserProfile({ name }) { return <section>{name}</section>; }
// import UserProfile from "./UserProfile.jsx";

// ---------------------------------------------------------------------
// 14. Default exports for page components
// ---------------------------------------------------------------------

// Modules representing full pages often use default exports for file-based routing conventions:
// export default function DashboardPage() { return <main>Dashboard</main>; }

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A module can have one default export representing its primary value.
// - Default imports do not use curly braces, and their local names are freely chosen.
// - Default and named exports can coexist harmoniously within the same module.
// - Default exports do not imply a singleton pattern.
// - Widely used for primary React components, page views, and core module values.