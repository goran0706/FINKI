# JavaScript Module Scope

## Understanding Module Scope

Module scope is the execution context created for an individual JavaScript module file. Unlike traditional script tags
that share a single global scope, every ES module and CommonJS module runs within its own isolated lexical scope.
Variables, functions, and classes declared at the top level of a module remain private to that file unless explicitly
exported.

### Scope Comparison Across JavaScript Environments

| Scope Type         | Accessibility Range                               | Modification Impact                                      | Namespace Safety                                      |
|:-------------------|:--------------------------------------------------|:---------------------------------------------------------|:------------------------------------------------------|
| **Global Scope**   | Accessible across entire application runtime      | High risk of collision and unintended mutation           | Vulnerable to namespace pollution                     |
| **Function Scope** | Restricted to the declaring function body         | Isolated to local function execution                     | Safe internally, but requires patterns like IIFEs     |
| **Module Scope**   | Restricted strictly to the individual module file | Completely isolated from other scripts and global window | Maximum safety; requires explicit imports and exports |

## Mechanics of Module Scope

In modern ECMAScript modules (ESM), scope isolation introduces specific behaviors regarding execution context and global
variable availability.

* **Top-Level `this` Binding:** At the top level of an ES module, the value of `this` evaluates to `undefined` rather
  than the global `window` object (in browsers) or `global` object (in Node.js).
* **Implicit Strict Mode:** All ES modules automatically execute in strict mode (`"use strict"`), preventing accidental
  global variable creation, disabling `with` statements, and throwing errors on unsafe actions.
* **File-Level Closures:** Because each file forms a distinct lexical scope, top-level variables act as file-level
  closures that persist across imports while remaining entirely invisible to external consumers.

## Best Practices

* **Avoid Global Augmentation:** Never attach properties directly to `window` or `global` inside a module; pass
  configurations through explicit function arguments or environment parameters.
* **Limit Top-Level Mutable State:** Keep top-level variables constant (`const`) or encapsulate mutable state within
  factory functions or classes to prevent unpredictable side effects across importing files.
* **Explicitly Scope Imports:** Import only the exact functions or variables needed rather than importing entire
  namespaces when possible, maintaining clean dependency boundaries.