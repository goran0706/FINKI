/**
 * Modules
 * =======
 *
 * JavaScript modules provide a way to organize code into separate files with
 * explicit dependencies and exports. Each module has its own scope and can
 * expose selected values to other modules.
 *
 * ECMAScript modules use `import` and `export` declarations for static
 * dependencies and `import()` for dynamic module loading.
 */

// ---------------------------------------------------------------------
// 1. What is a module?
// ---------------------------------------------------------------------

// A module is a JavaScript file whose imports and exports define its
// relationship with other modules.
//
// Example:
//
// import { add } from "./math.js";
// const result = add(2, 3);

// Modules create explicit boundaries between files.

// ---------------------------------------------------------------------
// 2. Module scope
// ---------------------------------------------------------------------

// Top-level declarations in a module belong to that module's own scope.

const moduleValue = "private";

console.log(moduleValue); // "private"

// Other modules cannot access `moduleValue` unless this module explicitly exports it.
// This prevents module-local variables from becoming global variables.

// ---------------------------------------------------------------------
// 3. Top-level variables are module-local
// ---------------------------------------------------------------------

const apiBaseUrl = "https://example.com";
const requestTimeout = 5000;

function createRequestUrl(path) {
  return `${apiBaseUrl}${path}`;
}

console.log(createRequestUrl("/users")); // "https://example.com/users"
console.log(requestTimeout); // 5000

// These declarations are available throughout this module only.

// ---------------------------------------------------------------------
// 4. Explicit exports
// ---------------------------------------------------------------------

// A module exposes values explicitly with `export`:
//
// export const version = "1.0.0";
//
// export function calculateTotal(items) {
//     return items.reduce((total, item) => total + item.price, 0);
// }

// Only exported values can be imported by another module.

// ---------------------------------------------------------------------
// 5. Explicit imports
// ---------------------------------------------------------------------

// Another module can explicitly request exported values:
//
// import { calculateTotal } from "./cart.js";

// Imports make relationships between modules visible in the source code
// instead of relying on global variables.

// ---------------------------------------------------------------------
// 6. Static module structure
// ---------------------------------------------------------------------

// Static `import` and `export` declarations must appear at the top level.
//
// import { add } from "./math.js";

// This is invalid:
//
// if (enabled) {
//     import { add } from "./math.js";
// }

// Static imports are analyzed before module evaluation.

// ---------------------------------------------------------------------
// 7. Dynamic import
// ---------------------------------------------------------------------

// `import()` loads a module dynamically and returns a Promise
// that fulfills with the module namespace object.

async function loadFeature(enabled) {
  if (!enabled) {
    return null;
  }

  return import("./feature.js");
}

// Dynamic imports are useful for conditional loading, lazy loading,
// and code splitting.

// ---------------------------------------------------------------------
// 8. Modules have their own top-level scope
// ---------------------------------------------------------------------

const privateCounter = 0;

function getPrivateCounter() {
  return privateCounter;
}

console.log(getPrivateCounter()); // 0

// Another module cannot access `privateCounter` directly.
// A module can expose controlled access through exported functions.

// ---------------------------------------------------------------------
// 9. Module dependencies
// ---------------------------------------------------------------------

// Imports create relationships between modules.
//
// app.js
//   -> price.js
//       -> format.js
//
// The complete set of module relationships forms a module dependency graph.
// The graph can contain cycles, although circular dependencies require care.

// ---------------------------------------------------------------------
// 10. Module execution
// ---------------------------------------------------------------------

// A module's top-level code runs when that module is evaluated.

const createdAt = new Date();

function getCreatedAt() {
  return createdAt;
}

console.log(getCreatedAt());

// Top-level initialization therefore happens as part of module evaluation.

// ---------------------------------------------------------------------
// 11. Modules are evaluated once within a module graph
// ---------------------------------------------------------------------

// When the same module is imported multiple times within the same module graph,
// its evaluation is normally performed once and its module instance is reused.
//
// This means module-level state can be shared by multiple importers.

// ---------------------------------------------------------------------
// 12. Module-level state
// ---------------------------------------------------------------------

const cache = new Map();

function getCachedValue(key) {
  return cache.get(key);
}

function setCachedValue(key, value) {
  cache.set(key, value);
}

setCachedValue("user:1", { id: 1 });

const cachedUser = getCachedValue("user:1");

console.log(cachedUser); // { id: 1 }

// If these functions were exported, importers would share the same module-level
// `cache` within the same module graph.

// ---------------------------------------------------------------------
// 13. Module bindings
// ---------------------------------------------------------------------

let currentLanguage = "en";

function setLanguage(language) {
  currentLanguage = language;
}

function getLanguage() {
  return currentLanguage;
}

setLanguage("mk");

console.log(getLanguage()); // "mk"

// ECMAScript modules expose bindings rather than copying exported values.

// ---------------------------------------------------------------------
// 14. Live bindings
// ---------------------------------------------------------------------

// Imported bindings are live references to exported bindings.
// If the exporting module changes its binding, importers observe the new value.
//
// Example:
//
// // settings.js
// export let language = "en";
// export function setLanguage(value) {
//     language = value;
// }
//
// // app.js
// import { language, setLanguage } from "./settings.js";
//
// console.log(language); // "en"
// setLanguage("mk");
// console.log(language); // "mk"

// The imported binding reflects the current exported binding.

// ---------------------------------------------------------------------
// 15. Imports are read-only bindings
// ---------------------------------------------------------------------

// An imported binding cannot be reassigned by the importing module.
//
// import { language } from "./settings.js";
// language = "mk"; // TypeError

// The exporting module controls changes to its own binding.

// ---------------------------------------------------------------------
// 16. Importing an object does not make the object immutable
// ---------------------------------------------------------------------

// The imported binding itself cannot be reassigned:
//
// import { settings } from "./settings.js";
// settings = {}; // TypeError

// But the referenced object can still be mutable:
//
// settings.theme = "dark";

// Whether that mutation is appropriate depends on how the exported
// object is designed. An imported binding being read-only does not
// automatically make the referenced value immutable.

// ---------------------------------------------------------------------
// 17. Side-effect-only modules
// ---------------------------------------------------------------------

// A module can be imported only for the side effects produced by its evaluation:
//
// import "./analytics.js";

// No exported binding is imported.
// Use side-effect imports deliberately because loading the module executes it.

// ---------------------------------------------------------------------
// 18. Module evaluation order
// ---------------------------------------------------------------------

// A module is evaluated after its dependencies have been instantiated,
// with evaluation order determined by the module dependency graph.
//
// For an acyclic dependency chain:
//
// app.js -> price.js -> format.js
//
// `format.js` is evaluated before `price.js`, and `price.js` before `app.js`.

// Circular dependencies require more careful reasoning because modules
// can be instantiated before all dependencies have finished evaluating.

// ---------------------------------------------------------------------
// 19. Circular dependencies
// ---------------------------------------------------------------------

// Circular dependencies are legal:
//
// a.js -> b.js
// b.js -> a.js
//
// They can work when the modules access bindings at appropriate times,
// but accessing a binding before its initialization can cause a `ReferenceError`.
//
// Keep dependency relationships simple when possible.

// ---------------------------------------------------------------------
// 20. Module namespace objects
// ---------------------------------------------------------------------

// Dynamic `import()` fulfills with a module namespace object.
//
// const module = await import("./math.js");
//
// module.add(2, 3);
//
// The namespace object provides access to the module's exported bindings.

// ---------------------------------------------------------------------
// 21. Browser modules
// ---------------------------------------------------------------------

// Browsers can load ECMAScript modules natively:
//
// <script type="module" src="./app.js"></script>

// The browser treats the referenced file as an ECMAScript module.

// ---------------------------------------------------------------------
// 22. Browser module characteristics
// ---------------------------------------------------------------------

// Browser modules have their own scope and are deferred automatically.
// Module imports are resolved using URLs, so valid paths are required.
//
// <script type="module" src="./app.js"></script>

// Browser module loading also follows the browser's module fetching,
// parsing, instantiation, and evaluation rules.

// ---------------------------------------------------------------------
// 23. Node.js modules
// ---------------------------------------------------------------------

// Node.js supports ECMAScript modules.
// A package can explicitly use ESM with `"type": "module"` in `package.json`:
//
// {
//     "type": "module"
// }
//
// Node.js also supports explicit `.mjs` files for ECMAScript modules.

// Built-in modules can be imported using the `node:` scheme:
//
// import { readFile } from "node:fs/promises";

// ---------------------------------------------------------------------
// 24. ES modules versus CommonJS
// ---------------------------------------------------------------------

// Node.js supports both ECMAScript modules and CommonJS.
//
// ECMAScript modules:
// import { readFile } from "node:fs/promises";
// export function loadData() {}
//
// CommonJS:
// const fs = require("node:fs");
// module.exports = { loadData };

// These are different module systems with different syntax and semantics.
// ECMAScript modules use `import` and `export` as part of the language.

// ---------------------------------------------------------------------
// 25. File extensions and module resolution
// ---------------------------------------------------------------------

// How an import path is resolved depends on the runtime and module system.
//
// import { add } from "./math.js";

// Browsers resolve module specifiers as URLs.
// Node.js applies its own ESM resolution rules.
// Build tools can provide additional resolution behavior.

// ---------------------------------------------------------------------
// 26. Modules and strict mode
// ---------------------------------------------------------------------

// ECMAScript modules are always evaluated in strict mode automatically.
//
// "use strict";

// The directive is unnecessary because module code is already strict.

// ---------------------------------------------------------------------
// 27. Top-level `await`
// ---------------------------------------------------------------------

// ECMAScript modules can use `await` at the top level in supported environments:
//
// const response = await fetch("https://example.com/data.json");
// const data = await response.json();

// Top-level `await` pauses evaluation of that module until the awaited
// Promise settles and can therefore affect modules that depend on it.

// ---------------------------------------------------------------------
// 28. Module boundaries and encapsulation
// ---------------------------------------------------------------------

const basePrice = 100;

function calculateTax(price) {
  return price * 0.18;
}

function calculateTotal(price) {
  return price + calculateTax(price);
}

console.log(calculateTotal(basePrice)); // 118

// `calculateTax` can remain unexported when it is an implementation detail.
// Only the values that form the public API need to be exported.

// ---------------------------------------------------------------------
// 29. Modules as APIs
// ---------------------------------------------------------------------

// A module's exports form its public API.
//
// export function calculateTotal(price) {
//     return price + calculateTax(price);
// }

// Keeping the public API small reduces coupling and hides implementation details.

// ---------------------------------------------------------------------
// 30. Module composition
// ---------------------------------------------------------------------

// Larger applications can be composed from smaller modules.
//
// api.js       -> API operations
// validation.js -> validation logic
// format.js    -> formatting logic
// app.js       -> application composition

// Each module can focus on a cohesive responsibility while importing
// the functionality it needs.

// ---------------------------------------------------------------------
// 31. Module organization
// ---------------------------------------------------------------------

// Organize modules around cohesive responsibilities such as:
//
// components/
// utilities/
// services/
// validation/
// configuration/

// The exact structure depends on the application.
// The important principle is that module boundaries should represent
// meaningful responsibilities rather than arbitrary file splitting.

// ---------------------------------------------------------------------
// 32. Avoid unnecessary global state
// ---------------------------------------------------------------------

// Prefer explicit module APIs over modifying `globalThis`.
//
// globalThis.sharedValue = "data";

// Explicit imports make dependencies visible and easier for tools and
// developers to analyze.

// ---------------------------------------------------------------------
// 33. Modules and tree shaking
// ---------------------------------------------------------------------

// ES module imports and exports are statically analyzable:
//
// export function usedFunction() {}
// export function unusedFunction() {}
//
// import { usedFunction } from "./utilities.js";

// Build tools can use this static structure to identify unused exports
// and potentially remove them from production bundles.

// ---------------------------------------------------------------------
// 34. Module design and side effects
// ---------------------------------------------------------------------

// Modules that primarily export functions and declarative values are often
// easier to reason about than modules that perform substantial work immediately.
//
// export function calculateTotal(price) {
//     return price * 1.18;
// }

// Side effects are sometimes necessary, but they should be deliberate
// because importing a module can trigger its top-level code.

// ---------------------------------------------------------------------
// 35. Module dependencies should be explicit
// ---------------------------------------------------------------------

// Prefer explicit imports:
//
// import { formatPrice } from "./format.js";
//
// over hidden global dependencies:
//
// formatPrice(100); // unclear where `formatPrice` came from

// Explicit dependencies improve readability, tooling, testing, and maintenance.

// ---------------------------------------------------------------------
// 36. Modules versus ordinary scripts
// ---------------------------------------------------------------------

// ECMAScript modules differ from classic scripts in several important ways:
//
// - module-local top-level scope
// - automatic strict mode
// - explicit imports and exports
// - live imported bindings
// - static module structure
// - dependency-based evaluation

// Classic scripts do not provide the same module boundaries and dependency semantics.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - ECMAScript modules provide explicit imports, exports, and module-local scope.
// - Top-level module declarations do not become global variables.
// - Static `import` and `export` declarations are part of the module's structure.
// - Dynamic `import()` loads a module asynchronously and returns a Promise.
// - Imported bindings are live and cannot be reassigned by the importing module.
// - A read-only imported binding does not make the referenced object immutable.
// - Module-level state can be shared by importers within the same module graph.
// - Module graphs can contain circular dependencies, but initialization order matters.
// - ECMAScript modules are always evaluated in strict mode.
// - Browsers and Node.js support ECMAScript modules.
// - CommonJS is a separate module system supported by Node.js.
// - Top-level `await` is available in ECMAScript modules in supported environments.
// - Module exports define a module's public API and hide unexported implementation details.
// - Static module structure enables tooling such as tree shaking.
// - Explicit dependencies make module relationships visible and maintainable.
