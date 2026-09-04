# CommonJS Module System

## CommonJS Architecture

CommonJS (CJS) is the traditional module system originally designed for synchronous server-side environments like
Node.js. It relies on the `require()` function to load modules and `module.exports` or `exports` to expose
functionality. Because server-side files reside on local disk storage, CommonJS modules load synchronously at runtime.

### Core CommonJS Mechanics

| Component            | Purpose                                 | Behavior                                                               |
|:---------------------|:----------------------------------------|:-----------------------------------------------------------------------|
| **`require()`**      | Imports modules synchronously           | Loads, evaluates, and caches the target module file on first execution |
| **`module.exports`** | Defines the exported API                | The definitive object returned to consumers when `require()` is called |
| **`exports`**        | Shorthand reference to `module.exports` | Direct pointer to `module.exports`; fails if reassigned directly       |

## Syntax and Usage Patterns

CommonJS syntax is straightforward and executed dynamically during runtime, allowing conditional module loading based on
program logic.

* **Exporting Values:** Assigning properties to `module.exports` or mutating `module.exports` directly as an object,
  function, or class instance.
* **Importing Modules:** Invoking `require('./path/to/module')` to fetch exported members, with automatic resolution for
  `.js`, `.json`, and `.node` extensions.
* **Module Caching:** Subsequent calls to `require()` return a cached instance of the exported object rather than
  re-evaluating the module file.

## Best Practices

* **Never Reassign the `exports` Variable:** Always mutate or assign to `module.exports` directly rather than
  overwriting `exports = ...`, which severs the reference link to the actual exported object.
* **Keep `require()` Calls at Startup:** Perform module imports at the top of files during application initialization to
  avoid blocking the event loop with synchronous disk I/O mid-request.
* **Export Cohesive Single-Purpose Modules:** Design modules to export a single class, constructor, or tightly related
  object namespace rather than a sprawling collection of disparate utilities.
* **Understand Module Caching Behavior:** Remember that Node.js caches CommonJS modules upon first load; mutate exported
  state cautiously to avoid unintended cross-module side effects.
* **Structure Circular Dependencies Carefully:** Recognize that CommonJS returns partial exports during circular module
  loads, requiring explicit ordering of property assignments on `module.exports`.
* **Use Absolute or Relative Paths Explicitly:** Prefix local module paths with `./` or `../` to prevent Node.js from
  misinterpreting them as built-in core modules or external node_modules packages.
* **Avoid Dynamic Path Interpolation in `require`:** Pass static string literals into `require()` calls to ensure static
  analysis tools and bundlers can accurately trace dependency graphs.
* **Verify File Extension Resolution Rules:** Rely on automatic extension resolution for `.js`, `.json`, and `.node`
  files rather than hardcoding legacy suffixes in import paths.
* **Clean Up Global State in Test Suites:** Reset mutated module states or mock caches explicitly between unit tests
  since CommonJS singleton instances persist across test runs.
* **Handle Missing Optional Modules Gracefully:** Wrap `require()` statements inside `try...catch` blocks when loading
  optional peer dependencies or platform-specific plug-ins.
* **Prefer Named Properties on Objects:** Assign properties explicitly (e.g., `module.exports.foo = foo`) when exporting
  multiple values to maintain clear, predictable public interfaces.
* **Do Not Mix CJS and ESM Carelessly:** Be aware of interop constraints when importing CommonJS modules into native
  ECMAScript modules, noting default export wrapping rules.
* **Avoid Modifying Native Module Prototypes:** Refrain from monkey-patching built-in CommonJS or third-party module
  prototypes globally to prevent difficult-to-debug integration conflicts.
* **Document Export Contracts Clearly:** Add explicit JSDoc comments or README notes describing the exact schema and
  type signatures of objects returned by `module.exports`.
* **Validate Environment Variables at Startup:** Check required configuration keys immediately upon module load or
  application bootstrap to fail fast on misconfigurations.
* **Keep Module Side Effects Minimal:** Limit top-level execution code inside modules to constant declarations and
  function definitions rather than heavy computations.
* **Use Strict Mode Explicitly:** Add `'use strict';` declarations at the top of legacy CommonJS files if running on
  older Node.js runtimes that do not enforce strict semantics by default.
* **Audit Third-Party Dependency Sizes:** Review imported CommonJS packages regularly to eliminate bloated dependencies
  that increase server build and startup times.
* **Monitor Memory Leaks from Caching:** Be cautious when dynamically generating and requiring files at runtime, as the
  internal `require.cache` grows indefinitely unless manually purged.
* **Keep Core and Local Imports Separated:** Group Node.js built-in core modules at the top of the import block,
  followed by external packages and local relative paths for readability.
