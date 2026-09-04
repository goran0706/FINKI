# Variables Declaration Keywords & Global Object Integration

## `var`

* **Scope Layer:** Function-scoped or globally scoped. It completely leaks out of and ignores standard block boundaries
  `{}` (e.g., `if`, `for`, `switch`).
* **Lifecycle & Hoisting:** Hoisted to the top of its scope and instantly initialized to `undefined` during the
  compilation phase. It can be accessed before its physical source line without throwing an error.
* **Re-declaration Capability:** Explicitly permitted within the same scope layer. The engine does not throw errors;
  instead, subsequent `var` statements are silently compiled into simple assignment statements.
* **Global Object Attachment:** When declared at the root global execution context layer, `var` attaches itself directly
  as a configurable property on the global window object (`window.foo` or `globalThis.foo`).
  ```javascript
  // Redeclaration
  var foo = "10";
  var foo = "20"; // Fully valid syntax; overrides the assignment reference
  
  // Reassignment
  foo = 30;
  
  // Global attachment
  console.log(window.foo);
  console.log(globalThis.foo);
  ```

## `let`

* **Scope Layer:** Block-scoped. Access is bound strictly within the nearest enclosing curly braces `{}`.
* **Lifecycle & Hoisting:** Hoisted to the top of its enclosing block but remains completely uninitialized. It cannot be
  read or written to until its literal declaration line evaluates.
* **Re-declaration Capability:** Strictly forbidden within the same lexical scope layer. Attempting to re-declare an
  existing identifier using `let` triggers an immediate, uncatchable `SyntaxError`.
* **Global Object Attachment:** Declaring a `let` variable at the global root level registers the identifier in the
  script/global declarative environment rather than the object environment record. It does *not* create a property on
  the `window` object.
  ```javascript
  let foo = "10";
  foo = "20"; // Valid reassignment
  let foo = "20"; // SyntaxError: Identifier 'foo' has already been declared
  ```

## `const`

* **Scope Layer:** Block-scoped. Access is bound within the nearest enclosing curly braces `{}`.
* **Lifecycle & Hoisting:** Hoisted to the top of its block but remains uninitialized within the memory system.
* **Re-declaration & Reassignment Constraints:** Strictly forbidden from both re-declaration and value reassignment. It
  requires an immediate, explicit value assignment during initialization; leaving it uninitialized throws a
  `SyntaxError`.

* **Reference Type Immutability Exception:** The binding reference itself is permanently locked, but the underlying
  data-structure value is *not* deeply frozen. Non-primitive reference types (Objects, Arrays, Functions) held inside a
  `const` container can have their internal properties mutated or appended freely without throwing errors.
* **Global Object Attachment:** Like `let`, global declarations are isolated inside the declarative environment and do
  *not* create properties on the global `window` object.
  ```javascript
  const foo = "10";
  foo = "20"; // TypeError: Assignment to constant variable.
  ```

### Best Practices

* **Default to `const`:** Declare every variable with `const` unless you know the binding itself must later reference a
  different value. This communicates intent clearly and prevents accidental reassignment.

* **Transition to `let` Only When Necessary:** Choose `let` only when the variable's binding must change over time
  (e.g., counters, accumulators, application state, or loop indexes).

* **Avoid `var` in Modern JavaScript:** `var`'s function scoping, block leakage, hoisting behavior, re-declaration
  capability, and global object attachment make code less predictable and more susceptible to subtle bugs. Prefer `let`
  or `const` in modern codebases.

* **Keep Variable Scope as Small as Possible:** Declare variables inside the smallest block that requires them.
  Block-scoped declarations (`let` and `const`) naturally reduce accidental access and naming collisions.

* **Avoid Polluting the Global Scope:** Global variables remain accessible throughout the entire application and
  increase the likelihood of naming conflicts. Prefer modules or local scopes whenever possible.

* **Understand Global Object Attachment:** Remember that global `var` declarations become properties of the global
  object (`window` or `globalThis`), whereas global `let` and `const` declarations remain within the global lexical
  environment and do not become global object properties.

* **Initialize Variables Immediately:** Whenever possible, assign a meaningful initial value at the moment of
  declaration instead of leaving variables temporarily uninitialized.

* **Never Rely on Hoisting:** Although `var`, `let`, and `const` are all hoisted differently, always write code as
  though declarations appear before their first use. This makes execution order explicit and improves readability.

* **Do Not Confuse Binding Immutability with Object Immutability:** A `const` declaration only locks the variable's
  binding. Objects, arrays, maps, sets, and functions referenced by a `const` variable remain mutable unless explicitly
  frozen.

  ```javascript
  const user = { name: "John" };
  user.name = "Jane";      // ✅ Allowed
  user.age = 25;           // ✅ Allowed
  user = {};               // ❌ TypeError
  ```

* **Avoid Unnecessary Reassignment:** Even when using `let`, avoid repeatedly changing the meaning of a variable. If the
  value represents a different concept, introduce a new variable rather than reusing an existing one.

* **Declare Variables Close to Their First Use:** Keeping declarations near where they are first used reduces
  unnecessary lifetime and improves code readability.

* **Use Descriptive Identifier Names:** Variable names should clearly communicate purpose rather than implementation
  details.

  ```javascript
  // Good
  const userCount = 10;
  
  // Poor
  const x = 10;
  ```

* **Use `const` Within Loop Bodies When Appropriate:** If a variable created during each loop iteration is never
  reassigned within that iteration, declare it using `const`.

  ```javascript
  for (const user of users) {
      console.log(user.name);
  }
  ```

* **Reserve `let` for True State Changes:** Variables representing evolving application state—such as counters, indexes,
  timers, or finite-state values—are appropriate candidates for `let`.

  ```javascript
  let attempts = 0;

  while (!success) {
      attempts++;
  }
  ```
