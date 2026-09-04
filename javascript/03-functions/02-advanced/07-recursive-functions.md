# Recursion

## Recursion Concept

**Recursion:** A function calling itself directly or indirectly to solve complex problems through repeated smaller
operations by reducing them until reaching a stopping condition.

## Recursive Function Structure

A recursive function requires a base case to stop execution and a recursive case to call the function again with a
smaller problem, preventing infinite recursion and stack overflows.

| Component      | Purpose                                         |
|:---------------|:------------------------------------------------|
| Base case      | Stops the recursive process                     |
| Recursive case | Calls the function again with a smaller problem |

## Base Case

**Base Case:** The condition that terminates recursive execution to prevent infinite loops and ensure termination.

## Recursive Case

**Recursive Case:** The part of the function that calls itself with a modified input moving closer to the base case.

| Pattern           | Example                  |
|:------------------|:-------------------------|
| Reduce a number   | Decrease a counter       |
| Move through data | Process the next item    |
| Divide a problem  | Split into smaller parts |

## Basic Recursion

Basic recursion applies the recursive pattern to standard operational challenges.

| Problem Type              | Usage                 |
|:--------------------------|:----------------------|
| Mathematical calculations | Factorials, sequences |
| Counting operations       | Repeating actions     |
| String processing         | Character traversal   |
| Array processing          | Recursive iteration   |

## Recursive Execution Flow

Each recursive call stores its current state in a new execution context via the call stack until reaching the base case
and returning results upward.

## Call Stack and Recursion

The JavaScript engine tracks active function calls using the call stack, where deep recursion increases memory usage,
slows execution, and risks stack overflow errors.

## Recursive Data Structures

Recursion provides natural traversal mechanisms for hierarchical and nested structures.

| Structure      | Recursive Use              |
|:---------------|:---------------------------|
| Trees          | Traverse child nodes       |
| File systems   | Process nested directories |
| Nested objects | Search deep values         |
| Graphs         | Explore connected nodes    |

## Recursion vs Iteration

| Feature             | Recursion                           | Iteration               |
|:--------------------|:------------------------------------|:------------------------|
| Uses function calls | Yes                                 | No                      |
| Uses call stack     | Yes                                 | Usually no              |
| Code readability    | Often clearer for nested structures | Often simpler for loops |
| Memory usage        | Higher                              | Usually lower           |

## Advanced Recursive Patterns

Complex recursive techniques expand standard functional execution.

| Pattern            | Purpose                           |
|:-------------------|:----------------------------------|
| Tree recursion     | Process branching structures      |
| Backtracking       | Explore possible solutions        |
| Divide and conquer | Split problems into smaller parts |

## Tree Recursion

**Tree Recursion:** A recursive pattern where each function call branches into multiple recursive calls to process
hierarchical data or trees, causing rapid growth in execution complexity.

## Backtracking

**Backtracking:** A recursive approach that explores potential solutions and reverses choices upon hitting a failure
path.

| Problem        | Example                 |
|:---------------|:------------------------|
| Path finding   | Explore routes          |
| Puzzle solving | Test possible solutions |
| Combinations   | Generate possibilities  |

## Divide and Conquer

**Divide and Conquer:** A recursive strategy that splits large problems into independent smaller parts, solves them
recursively, and combines the resulting outcomes.

---

## Tail Recursion

**Tail Recursion:** A recursive function where the recursive call is the final operation performed, directly producing
the final result without requiring additional work after completion.

### Tail Recursion Structure

A recursive function is tail recursive when the call happens at the end, contains no subsequent calculations, and
immediately passes the result upward.

| Requirement                | Description                          |
|:---------------------------|:-------------------------------------|
| Final operation            | Recursive call is the last step      |
| No subsequent calculations | No extra work performed after return |
| Immediate passing          | Result is sent directly upward       |

### Tail Recursion Example Pattern

Tail recursive functions use accumulator parameters to carry accumulated results through state updates instead of
calculating during returns.

### Tail Recursion vs Regular Recursion

| Feature                    | Tail Recursion  | Regular Recursion          |
|:---------------------------|:----------------|:---------------------------|
| Recursive call position    | Final operation | May occur before more work |
| Additional work after call | No              | Possible                   |
| Uses accumulator values    | Common          | Less common                |
| Optimization potential     | Higher          | Lower                      |

### Regular Recursion Behavior

Regular recursion pauses execution for each call, waits for recursive results to complete, and processes values while
returning, creating multiple pending operations on the call stack.

### Tail Recursion Behavior

Tail recursion passes all required information forward so the recursive call already contains the final state, reducing
stack unwinding work.

### Tail Call Optimization

**Tail Call Optimization (TCO):** A runtime optimization where tail recursive calls reuse the current execution context
instead of creating new stack frames.

| Benefit                  | Description          |
|:-------------------------|:---------------------|
| Lower memory usage       | Fewer stack frames   |
| Deeper recursion support | Reduced stack growth |
| Improved efficiency      | Less call overhead   |

### JavaScript and Tail Call Optimization

JavaScript engines do not universally guarantee tail call optimization, meaning developers should never rely on tail
recursion to avoid stack overflow errors.

### Tail Recursion and Accumulators

Tail recursive functions use accumulators to store current results, avoid waiting for return calculations, and create
clearer state transitions.

### Tail Recursion Limitations

| Limitation                 | Description                                      |
|:---------------------------|:-------------------------------------------------|
| No guaranteed optimization | JavaScript engines may still create stack frames |
| More complex parameters    | Often requires accumulator patterns              |
| Not always clearer         | Simple loops may be easier to understand         |

### Tail Recursion vs Iteration

| Feature             | Tail Recursion                      | Iteration                        |
|:--------------------|:------------------------------------|:---------------------------------|
| Uses function calls | Yes                                 | No                               |
| Uses loop syntax    | No                                  | Yes                              |
| Stack usage         | Potentially higher                  | Usually lower                    |
| Readability         | Can express recursive logic clearly | Often simpler for repeated tasks |

---

## Recursion Limitations

| Limitation           | Description                               |
|:---------------------|:------------------------------------------|
| Stack usage          | Each call requires memory                 |
| Performance overhead | Function calls add cost                   |
| Complexity           | Incorrect logic can be difficult to debug |

## Use Cases

* **Tree traversal:** Process nested structures.
* **Algorithm design:** Solve naturally recursive problems.
* **Data processing:** Handle hierarchical information.
* **Problem-solving:** Break complex problems into smaller steps.
* **Functional programming patterns:** Express repeated transformations.

## Best Practices

* **Always define a base case:** Explicitly prevent infinite recursion by setting a stopping condition.
* **Ensure progress toward termination:** Guarantee that each recursive step moves closer to the base case.
* **Avoid unnecessary deep recursion:** Switch to iteration when stack usage becomes high to prevent overflow.
* **Use recursion when the problem structure benefits from it:** Apply it purposefully to nested or hierarchical data
  rather than replacing simple loops unnecessarily.
* **Implement tail-call optimization where supported:** Write recursive functions in tail position to help engines
  optimize stack frame allocation and prevent memory bloat.
* **Cache expensive recursive results using memoization:** Store previously computed outcomes in a cache or lookup table
  to avoid redundant calculations in recursive branches like Fibonacci sequences.
* **Handle edge cases gracefully at the entry point:** Validate parameters before launching the initial recursive call
  to prevent unhandled runtime errors during nested executions.
* **Keep recursive functions pure where possible:** Ensure that recursive calls rely on passed parameters and local
  variables rather than modifying external mutable states.
* **Prefer iteration for linear loops:** Use standard `for` or `while` loops instead of simple recursion for flat arrays
  or linear counters to conserve stack memory.
* **Visualize call stack depths during debugging:** Monitor the number of active recursive frames using debugger tools
  or console tracing when diagnosing stack overflow exceptions.
* **Break complex recursive functions into helper routines:** Isolate recursive logic behind clean wrapper functions
  that set up initial parameters or state objects for the caller.
* **Document recursive exit and entry conditions clearly:** Write detailed code comments outlining how the base case is
  reached and how inputs shrink across recursive steps.
* **Avoid redundant argument duplication:** Pass large data structures by reference or use indexes/slices carefully to
  minimize memory overhead during deep recursive traversals.
* **Test recursive functions with extreme input sizes:** Verify that edge cases like empty trees, single-item lists, or
  maximum depth thresholds do not trigger unintended failures.
* **Use iterative alternatives for deep structures:** Refactor heavy tree-walking algorithms to use explicit stacks or
  queues if the data hierarchy exceeds standard engine call stack limits.
* **Structure divide-and-conquer steps cleanly:** Ensure that partitioned sub-problems remain completely independent
  before merging their recursive results back together.
* **Guard against circular references in graphs or objects:** Maintain a visited set or marker property during recursive
  traversals to prevent infinite loops on cyclic data.
* **Keep return values explicit across all execution paths:** Ensure every recursive branch returns a properly
  calculated value up the call stack without relying on implicit returns.
* **Limit branching complexity in tree recursion:** Monitor exponential time complexities in multi-branch recursive
  algorithms by applying dynamic programming techniques.
* **Embrace functional composition for recursive data processing:** Combine recursive traversal patterns cleanly with
  higher-order array methods to transform nested data structures safely.
* **Do not rely on tail call optimization in JavaScript:** Engine support remains inconsistent across environments.
* **Use accumulators when appropriate:** Simplify recursive calculations by carrying state forward.
* **Use tail recursion when it improves clarity:** Prioritize code readability over theoretical optimization.