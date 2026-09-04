# Hoisting Mechanics

* **Variable Hoisting Mechanics:** The structural process where the JavaScript engine scans and registers variable
  declarations inside the environment record during the execution context creation (compilation) phase, making their
  identifiers known to the scope before line-by-line code execution begins.
    * `var` statements are allocated memory slots and immediately initialized to `undefined`.
    * `let` and `const` statements are allocated memory slots but are explicitly left marked as uninitialized.
* **Function Hoisting:** Complete function *declarations* (including their inner algorithmic logic blocks) are fully
  instantiated and initialized in memory during the context creation phase. This permits successful function invocation
  further up in the source file before its literal definition line has been reached by the execution thread.
    * *Functional Expressions:* Functions assigned to variables (e.g., `const fetchObj = () => {}`) do not follow
      function hoisting; they strictly follow the hoisting and initialization rules of their variable declaration
      keyword (`const`, `let`, or `var`).

```javascript
// Hoisting & TDZ Operational Sequence Demo

console.log(hoistedVar);   // undefined
console.log(hoistedLet);   // ReferenceError: Cannot access 'hoistedLet' before initialization
console.log(hoistedConst); // ReferenceError: Cannot access 'hoistedConst' before initialization

var hoistedVar = "Initialized var";
let hoistedLet = "Initialized let";
const hoistedConst = "Initialized const";

console.log(hoistedVar);   // "Initialized var"
console.log(hoistedLet);   // "Initialized let"
console.log(hoistedConst); // "Initialized const"

executeHoistedFunction();  // "Invoked"

function executeHoistedFunction() {
    console.log("Invoked");
}
```

* **Temporal Dead Zone (TDZ):** The period between entering a block scope and executing the `let` or `const`
  declaration. Although the variable has already been hoisted into memory, it remains **uninitialized** and cannot be
  accessed until its declaration statement is reached.
    * Attempting to read, assign, or even evaluate `typeof` on the variable while it is in the TDZ throws a
      `ReferenceError`.
    * The TDZ ends immediately after the declaration executes, allowing the variable to be accessed normally.

```javascript
{
    // TDZ begins when the block is entered
    console.log(user); // ReferenceError
    let user = "John"; // TDZ ends here
    console.log(user); // "John"
}
```

### Best Practices

* **Declare variables before using them, regardless of hoisting:** Relying on hoisting to read a `var` before its
  declaration line returns `undefined` silently, masking bugs that should have been caught immediately. Write code in
  the order it executes.

  ```javascript
  // ❌ Avoid — relies on hoisting, `total` is undefined here
  console.log(total);
  var total = 100;
  
  // ✅ Prefer — declare first
  var total = 100;
  console.log(total);
  ```

* **Never rely on the TDZ as documentation:** Treat `let`/`const` errors from the TDZ as bugs to fix, not as an
  intentional guard. Structure code so declarations always precede use, rather than depending on the engine to throw.

* **Prefer function declarations for hoisted, order-independent helpers; use function expressions/arrow functions for
  everything else:** Function declarations are fully hoisted, which is useful for utility functions called before their
  definition appears (e.g., at the bottom of a file for readability). Function expressions are not hoisted the same way,
  so define them before use to avoid a `TypeError` on invocation.

  ```javascript
  // ✅ OK — function declarations are hoisted
  main();
  
  function main() {
      console.log("running");
  }
  
  // ❌ Avoid — function expression is not hoisted the same way
  // run(); // TypeError: run is not a function
  const run = function () {
      console.log("running");
  };
  ```

* **Avoid `var` entirely to sidestep hoisting ambiguity:** Since `var` hoists and initializes to `undefined`, it allows
  a variable to be "read" before assignment without any error, hiding logic mistakes. `let`/`const` fail loudly instead,
  which is safer.

* **Don't shadow a hoisted outer variable with a `let`/`const` of the same name inside a nested block:** Doing so
  creates a TDZ for the inner name for the entire block, even before its own declaration line — a subtle trap when
  refactoring `var` to `let`.

  ```javascript
  let value = "outer";
  
  function example() {
      console.log(value); // ❌ ReferenceError — TDZ for inner `value`, NOT "outer"
      let value = "inner";
  }
  ```

* **Use a linter (e.g. ESLint's `no-use-before-define`, `block-scoped-var`) to catch hoisting-related misuse
  automatically:** Static analysis catches these patterns before runtime, rather than relying on careful manual review.
