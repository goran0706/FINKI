## Scope Internals

* **Lexical Scoping:** A static scoping paradigm. Accessibility and visibility boundaries for variable identifiers are
  resolved entirely during compilation based on the structural position of the code within the nested source text.


* **Dynamic Scope vs. Lexical Scope:**
    * *Lexical Scope:* Identifier resolution is bound strictly to the compile-time structural layout of the source text.
    * *Dynamic Scope:* Identifier resolution is computed at runtime based on the calling sequence history of the call
      stack. (JavaScript does not use dynamic scoping; runtime context variation is limited to the execution context's
      `this` binding).


* **Environment Record:** The internal specification mechanism that stores key-value pairs mapping identifier strings to
  concrete language values or references.
    * *Declarative Environment Record:* Stores bindings for block and functional declarations directly (`let`, `const`,
      `class`).
    * *Object Environment Record:* Binds identifiers to the property keys of a concrete system object (used in global
      scope bindings and `with` statements).


* **Scope Chain:** A logical linked list of Environment Records. When resolving an identifier, the engine inspects the
  immediate execution context's local Environment Record. If unresolvable, it follows the outer reference pointer to the
  parent Environment Record, repeating this traversal up to the global environment record before throwing a
  `ReferenceError`.


* **`[[Scope]]`:** An internal, hidden specification slot attached permanently to function objects at the moment of
  their creation. It saves a direct reference to the active Lexical Environment chain of the execution context where the
  function was structurally written, forming the engineering foundation for closures.


* **Function Scope:** An encapsulation boundary created by function declarations. Variables declared inside this
  boundary (`var`, `let`, `const`) are contained within the function's local environment record and cannot be resolved
  by external parent scopes.


* **Block Scope:** A narrow encapsulation boundary established by a block statement (`{ ... }`). Identifiers declared
  using `let`, `const`, or `class` inside this block are bound to a newly instantiated block-level environment record,
  restricting usage exclusively to that block's execution lifetime.
