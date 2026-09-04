# Variable Scope

* **Global Variables:** Variables declared outside any function or block, or implicitly bound to the global object
  (e.g., `window` or `globalThis`). They reside at the root of the scope chain, making them accessible from anywhere
  within the execution Realm. They persist for the entire lifecycle of the application runtime.


* **Local Variables:** Variables declared inside a specific structural boundary (a function body or a code block). They
  are private to that execution context, accessible only within that boundary or nested scopes, and are typically
  destroyed when the scope exits.


* **Function Scope:** The accessibility boundary created by a function declaration or expression. Variables declared
  with `var` are accessible anywhere within this function body—regardless of nested blocks—but cannot be accessed from
  outside the function.


* **Block Scope:** The accessibility boundary created by any pair of curly braces `{}` (e.g., `if`, `for`, `switch`, or
  standalone blocks). Variables declared with `let` or `const` are structurally confined to this block, rendering them
  completely inaccessible outside of it.

```javascript
var bar = 0;        // Global scope (creates a new global variable)

function foo() {
    var bar = 0;    // Function scope (creates a new local variable)
}

{
    var bar = 0;    // NOT block scope! This overwrites the global `bar` variable because `var` leaks out of blocks.
}

for (var i = 0; i < 10; i++) {
    var bar = 0;    // NOT block scope! This overwrites the global `bar` variable because `var` leaks out of blocks.
}

// IIFE usage creates function scope
(function () {
    var privateVariable = 'This is private';
    console.log(privateVariable);
})();

// =======================================================
// Block scoped by design (let and const are block-scoped)
// =======================================================
let letVariable = 0;
const constVariable = 0;

{
    let bar = 0;    // True block scope
}

for (let i = 0; i < 10; i++) {
    let bar = 0;    // True block scope per iteration
}
```

### Best Practices

* **Avoid using `var`:** Replace `var` with `let` or `const`. `var` is function-scoped (not block-scoped), is hoisted
  with an `undefined` initialization, and silently leaks out of `if`/`for`/`{}` blocks — a frequent source of bugs.

  ```javascript
  // ❌ Avoid
  for (var i = 0; i < 3; i++) {
      setTimeout(() => console.log(i), 0); // 3, 3, 3 — `i` leaks and is shared
  }
  
  // ✅ Prefer
  for (let i = 0; i < 3; i++) {
      setTimeout(() => console.log(i), 0); // 0, 1, 2 — new `i` per iteration
  }
  ```

* **Default to `const`, use `let` only when reassignment is required:** Signals intent to readers — a `const` binding
  communicates "this reference never changes," making code easier to reason about. Reach for `let` only when a
  variable's value legitimately needs to change.

  ```javascript
  const MAX_RETRIES = 3;   // ✅ never reassigned — const
  let attempts = 0;        // ✅ mutated below — let
  attempts++;
  ```

* **Minimize global variables:** Every global is a potential naming collision and a hidden dependency shared across the
  entire application. Encapsulate state inside modules, functions, classes, or closures instead of attaching it to the
  global object.

  ```javascript
  // ❌ Avoid — pollutes the global object
  globalThis.currentUser = {id: 1};
  
  // ✅ Prefer — encapsulated in a module
  export const userStore = (() => {
      let currentUser = {id: 1};
  
      return {
          get: () => currentUser,
          set: (u) => {
              currentUser = u;
          },
      };
  })();
  ```

* **Declare variables in the narrowest scope that needs them:** Keep bindings as close as possible to where they're used
  rather than declaring everything up front. This limits their visibility and lifetime, reducing accidental reuse.

  ```javascript
  // ❌ Avoid — `result` visible for the whole function even though only used once
  function process(items) {
      let result;
      // ...lots of unrelated code...
      result = items.map((i) => i * 2);
      return result;
  }
  
  // ✅ Prefer
  function process(items) {
      // ...unrelated code...
      const result = items.map((i) => i * 2);
      return result;
  }
  ```

* **Avoid shadowing variables:** Reusing an outer variable's name inside a nested scope makes code harder to trace and
  easy to misread, even though it's legal.

  ```javascript
  // ❌ Avoid — confusing shadowing
  let status = "active";
  
  function check() {
      let status = "inactive"; // shadows outer `status`
      return status;
  }
  
  // ✅ Prefer distinct names
  let userStatus = "active";
  
  function check() {
      let localStatus = "inactive";
      return localStatus;
  }
  ```

* **Enable strict mode (or use ES Modules, which are strict by default):** Prevents accidental creation of implicit
  globals when a variable is assigned without being declared.

  ```javascript
  "use strict";
  // bar = 5; // ❌ ReferenceError in strict mode — must declare with let/const/var
  ```

* **Watch the Temporal Dead Zone (TDZ) with `let`/`const`:** Unlike `var`, `let` and `const` are hoisted but not
  initialized — accessing them before their declaration line throws, rather than silently returning `undefined`. Declare
  before use to avoid relying on this behavior at all.

  ```javascript
  console.log(x); // ❌ ReferenceError — in the TDZ
  let x = 5;
  ```
