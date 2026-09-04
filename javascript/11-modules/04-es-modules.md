# ECMAScript Modules (ESM)

## ESM Architecture

ECMAScript Modules (ESM) represent the official standard module system for JavaScript, designed for both browser and
server-side runtimes. Unlike the synchronous, runtime-evaluated nature of CommonJS, ESM relies on a static structure
that enables compile-time analysis, tree-shaking, and asynchronous loading phases.

### Core ESM Phases

| Phase                | Action Performed                                                 | Operational Impact                                   |
|:---------------------|:-----------------------------------------------------------------|:-----------------------------------------------------|
| **1. Construction**  | Fetches files and parses code into an Abstract Syntax Tree (AST) | Discovers and loads all dependency files recursively |
| **2. Instantiation** | Allocates memory for exports and links imports/exports           | Creates live read-only bindings across modules       |
| **3. Evaluation**    | Executes top-level code statements in dependency order           | Populates memory with actual computed values         |

## Syntax and Static Structure

ESM syntax uses explicit `import` and `export` keywords evaluated before code execution begins.

* **Static Imports:** Must reside at the top level of a module file; conditional or dynamic imports require the separate
  `import()` expression.
* **Live Bindings:** Imported variables are live read-only views pointing to the exporting module's memory location,
  meaning updates in the exporter reflect automatically in the importer.
* **Strict Enforcement:** All ECMAScript modules execute under strict mode (`"use strict"`) automatically, disabling
  legacy non-strict constructs.

## Best Practices

* **Always Include Explicit File Extensions:** Specify complete file extensions (e.g., `./utils.js`) in relative import
  paths to comply with native browser and Node.js ESM loader requirements.
* **Keep Imports at the Top Level:** Position `import` and `export` statements strictly at the top of module files to
  enable static analysis, compilation, and efficient tree-shaking by bundlers.
* **Avoid Exporting Mutable Primitive State:** Refrain from exporting raw mutable primitives, as ESM live bindings
  propagate changes across modules unexpectedly; prefer getter functions or classes instead.
* **Use Dynamic `import()` for Conditional Loading:** Load heavy modules or optional dependencies asynchronously using
  the `import('./module.js')` expression rather than static top-level syntax.
* **Leverage Named Exports for Flexibility:** Prefer named exports over default exports to maintain predictable import
  identifiers, prevent naming collisions, and improve IDE refactoring support.
* **Consolidate Default Exports Judiciously:** Reserve default exports strictly for modules that represent a single
  primary entity, such as a React component or a class definition.
* **Understand Live Binding Read-Only Rules:** Remember that imported bindings cannot be reassigned locally by the
  consuming module, as they serve as live read-only views into the exporting scope.
* **Do Not Rely on `__dirname` or `__filename`:** Use `import.meta.url` combined with `fileURLToPath` from the `url`
  module when resolving file system paths in native Node.js ESM environments.
* **Configure `"type": "module"` Explicitly:** Define the module type inside `package.json` to ensure the runtime
  interprets `.js` files as ECMAScript modules by default.
* **Handle Circular Dependencies via Functions:** Structure circular dependencies carefully by exposing state through
  getter functions, since top-level evaluation order can result in uninitialized bindings.
* **Avoid Mixing CJS and ESM Syntax:** Refrain from using `require()` or `module.exports` inside files marked as
  ECMAScript modules unless utilizing proper interop patterns.
* **Use Export Re-mapping for Public APIs:** Aggregate and re-export modular functionality through index files (
  `export * from './module.js'`) to maintain clean entry-point boundaries.
* **Test ESM Import Resolution Early:** Verify that build pipelines, testing frameworks (like Jest or Vitest), and
  runtime environments resolve extensionless or mapped imports correctly.
* **Minimize Top-Level Await Bottlenecks:** Use top-level `await` sparingly, as asynchronous module initialization
  blocks dependent consumers and delays application startup performance.
* **Keep Module Side Effects Explicit:** Avoid executing heavy asynchronous work or network calls during module
  evaluation phases to prevent cascading initialization failures.
* **Audit Bundler Output for Duplicate Code:** Verify that tree-shaking removes unused exports effectively by inspecting
  production bundle analysis reports regularly.
* **Use Import Maps for Browser Development:** Configure browser import maps to manage bare specifier resolutions
  cleanly without relying on complex preprocessing steps.
* **Document Public Module Interfaces:** Provide clear JSDoc annotations on exported functions and classes to clarify
  type structures for consuming developers.
* **Isolate Environment-Specific Imports:** Separate browser-specific and server-specific logic cleanly using dynamic
  imports or runtime checks to prevent bundling errors.
* **Keep Dependency Graphs Shallow:** Prevent overly deep module import chains to reduce resolution latency and simplify
  architectural debugging.
