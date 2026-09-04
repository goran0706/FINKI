# Strict Mode

* **Enabling Strict Mode:** Triggered by declaring the literal directive `"use strict"` (or `'use strict'`) as the
  absolute first expression statement within a global script or a local functional body.


* **"use strict":** A backwards-compatible directive that tells the compiler to parse code under a restricted legal
  variant of ECMAScript, eliminating silent errors by forcing visibility on unsafe or obsolete semantics.

```javascript
'use strict'

// rest of the code...
```

* **Major Changes Introduced by Strict Mode:**

| Change                                      | Non-Strict Mode                         | Strict Mode                |
|---------------------------------------------|-----------------------------------------|----------------------------|
| `this` in regular functions                 | Global object (`window` / `globalThis`) | `undefined`                |
| Assigning to undeclared variables           | Creates an implicit global              | `ReferenceError`           |
| Writing to read-only properties             | Fails silently                          | `TypeError`                |
| Writing to getter-only properties           | Fails silently                          | `TypeError`                |
| Adding properties to non-extensible objects | Fails silently                          | `TypeError`                |
| Deleting non-configurable properties        | Returns `false`                         | `TypeError`                |
| Deleting variables/functions                | Allowed syntax                          | `SyntaxError`              |
| Duplicate parameter names                   | Allowed                                 | `SyntaxError`              |
| `arguments` ↔ parameters                    | Aliased (linked)                        | Independent                |
| Legacy octal literals (`0123`)              | Allowed                                 | `SyntaxError`              |
| `with` statement                            | Allowed                                 | `SyntaxError`              |
| Reassigning `eval` or `arguments`           | Allowed                                 | `SyntaxError`              |
| Variables declared inside `eval()`          | Can affect surrounding scope            | Confined to `eval()` scope |
| Setting properties on primitives            | Fails silently                          | `TypeError`                |
