# JavaScript Exporting Mechanics

## Export Patterns in ES Modules

ES Modules provide two distinct export mechanisms—named exports and default exports—allowing developers to structure
their public APIs precisely. Named exports allow multiple bindings per file, while default exports designate a primary
value for the module.

### Export Syntax and Strategies

| Export Type               | Syntax Example                        | Consumption Requirement                     |
|:--------------------------|:--------------------------------------|:--------------------------------------------|
| **Named Export (Inline)** | `export const API_KEY = '123';`       | Must be imported using exact matching names |
| **Named Export (List)**   | `export { formatDate, parseData };`   | Must be imported using exact matching names |
| **Default Export**        | `export default class UserService {}` | Can be imported with any custom identifier  |
| **Re-exporting**          | `export { sum } from './math.js';`    | Aggregates exports from external modules    |

## Mechanics of Module Exports

Exports in ECMAScript modules are not snapshot copies; they establish permanent live bindings to the underlying variable
memory location.

* **Live Bindings:** When an exporting module updates the value of a exported variable, any importing module instantly
  reflects that updated value without re-importing.
* **Renamed Exports:** Developers can alias exports using the `as` keyword (e.g., `export { oldName as newName }`),
  protecting internal naming conventions while offering clean public APIs.
* **Module Aggregation:** Modules can combine multiple disparate files into a single entry point by re-exporting their
  contents cleanly.

## Best Practices

* **Prefer Named Exports for Public Libraries:** Use named exports predominantly across utility and component libraries
  to maximize bundler tree-shaking efficiency and IDE refactoring safety.
* **Limit Default Exports to Single Entities:** Reserve default exports strictly for primary module components like a
  root React component, a singleton service instance, or a main class definition.
* **Avoid Exporting Mutable Primitive Values:** Prevent unintended side effects caused by ESM live bindings by wrapping
  exported state in getter functions rather than exposing raw mutable variables.
* **Use Aliased Exports for Clarity:** Leverage the `as` keyword to rename internal helper functions into clean,
  professional public-facing API names.
* **Consolidate Module Aggregations:** Group disparate submodule APIs cleanly into central entry points using re-export
  syntax (`export * from './module.js'`) for tidy consumer imports.
* **Keep Export Statements Organized:** Declare exports either directly inline with their definitions or neatly inside a
  single consolidated block at the bottom of the source file.
* **Do Not Mix Default and Named Wildcards:** Avoid complex wildcard re-exports that conflict with or accidentally
  overwrite existing default export bindings.
* **Document Exported Signatures Explicitly:** Provide complete JSDoc annotations on all exported classes, functions,
  and constants to clarify expected types for consumers.
* **Test Export Resolution Rigorously:** Verify that entry-point export maps and package configuration files point
  correctly to all published module exports.
* **Maintain Backward Compatibility on Renames:** Keep deprecated named exports active alongside new identifiers with
  deprecation warnings before removing them in major version updates.
* **Avoid Circular Export Dependencies:** Prevent initialization race conditions by structuring multi-file exports so
  that interdependent modules do not rely on circular references.
* **Isolate Private Helper Functions:** Keep internal utility functions unexported to maintain a clean encapsulation
  boundary and prevent unintended external consumption.
* **Use Consistent Naming Conventions:** Adopt uniform naming patterns (e.g., camelCase for functions, PascalCase for
  classes) across all exported public module interfaces.
* **Verify Tree-Shaking Output:** Audit production build artifacts to ensure unused named exports are successfully
  stripped by code bundlers.
* **Avoid Default Export Aliasing Confusion:** Choose descriptive local identifiers when importing default exports to
  prevent ambiguity across multi-file codebases.
* **Group Re-exports by Domain:** Organize aggregated re-exports logically by feature folders or architectural domains
  to simplify large package directory structures.
* **Protect Immutable Export Objects:** Freeze configuration objects or data structures before exporting them to prevent
  runtime mutation by consuming modules.
* **Review Export Visibility Rules:** Ensure TypeScript definition files (`.d.ts`) accurately reflect all intended
  runtime exports when building typed JavaScript packages.
* **Minimize Re-export Depth:** Limit deep chains of re-exported modules to maintain fast build resolution times and
  simpler error stack traces.
* **Document Side-Effect Imports Clearly:** Add explicit comments if an exported module relies on side effects executed
  during its initial evaluation phase.
