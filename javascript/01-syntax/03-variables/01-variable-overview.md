# Variables Fundamentals

* **Variables and Constants:** Storage identifiers allocated in memory to track architectural state. A *variable* is a
  binding whose data reference can be dynamically shifted over time. A *constant* is an immutable binding that
  permanently locks its data reference upon initial declaration.


* **Declaring Variables:** The structural act of registering a new identifier token within the running context's Lexical
  Environment record. It informs the engine of the binding's existence before line-by-line runtime evaluation begins.


* **Defining Variables:** The architectural state achieved when a declared variable is allocated physical space within a
  structural environment memory record. In JavaScript, variable declaration and definition happen simultaneously during
  execution context parsing.


* **Initializing Variables:** The definitive act of assigning an initial data value to a newly declared identifier
  token. If an explicit initialization expression is missing during runtime evaluation, variables declared with `var` or
  `let` automatically default to an initial value of `undefined`.


* **Reassigning Variables:** Mutating the underlying memory binding reference of an existing identifier to point to an
  entirely new value or heap memory address. This operation is permitted on `var` and `let` bindings, but throws an
  immediate runtime `TypeError` if attempted on a `const` binding.


* **Declaration Structures & Syntax Varieties:**
  ```javascript
  // 1. Single Variable Declaration (Uninitialized - defaults to undefined)
  var number;

  // 2. Variable Initialization (Assignment of data value to an existing binding)
  number = 100;

  // 3. Variable Declaration and Initialization
  var number = 100;

  // 4. Multiple Variable Declarations in a single statement
  var number1, number2, number3;
  number1 = 1; number2 = 2; number3 = 3;

  // 5. Multiple Variable Declarations and Initializations combined
  var number1 = 1, number2 = 2, number3 = 3;

  // 6. Multiple Declarations (Only the final identifier is initialized)
  var number1, number2, number3 = 1000; 
  // Result: number1 is undefined, number2 is undefined, number3 is 1000
  ```
