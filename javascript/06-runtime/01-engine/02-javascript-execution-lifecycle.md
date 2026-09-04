## JavaScript Execution Lifecycle

* **Parsing Phase:** The engine's ingestion stage. A stream scanner breaks down raw character strings into discrete
  language tokens (Tokenization). The parser verifies these tokens against formal ECMAScript grammar to assemble an
  **Abstract Syntax Tree (AST)**.


* **Compilation Phase (JIT):** The hybrid execution optimization layer. An interpreter maps the AST directly into
  intermediate baseline bytecode for immediate execution. Concurrently, a profiling compiler monitors execution and
  optimizes frequently run code ("hot paths") by compiling that bytecode directly into optimized native machine
  instructions.


* *Optimization Techniques:* Uses **Inline Caching (IC)** and **Hidden Classes (Shapes)** to map object layouts. Reverts
  via **Deoptimization (Bailout)** to bytecode if runtime type assumptions fail.


* **Execution Phase:** The step-by-step evaluation of instructions. The engine references an internal **Execution
  Context Stack (Call Stack)** to sequence processing. It reads bytecode or native instructions sequentially, mutating
  memory registers and triggering environmental side effects.


* **Function Invocation:** The operational event of executing a callable object. Invocation pauses the current running
  execution context, creates a new functional execution context frame, establishes its internal scope parameters, and
  pushes it onto the top of the Call Stack.


* *Stack Overflow:* A runtime error triggered when call stack limit capacity is exceeded, typically caused by unbounded
  recursion.


* **Arguments Object:** A local, array-like object instantiated and bound automatically inside non-arrow functional
  execution contexts. It contains indexed mappings of values passed as parameters, a `length` property, and a pointer to
  the current executing function (`callee`).


* **Variable Environment:** A component of an execution context that holds identifier bindings created by **`var`
  statement declarations** and function declarations. Its environment record registers these identifiers during the
  context creation phase, implementing "hoisting" by initializing them to `undefined` before line-by-line execution
  begins.


* **Lexical Environment:** A component of an execution context that holds identifier bindings created by
  **`let`, `const`, and `class` declarations**. It dynamically tracks block-level structures, maintaining variables in
  an uninitialized state within a Temporal Dead Zone (TDZ) until their formal initialization line is evaluated.