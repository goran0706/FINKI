# Control Flow Concepts

## Branching

**Branching:** A control flow mechanism where program execution selects between different paths based on evaluated
conditions. Normally, JavaScript executes statements sequentially from top to bottom, but branching changes this linear
execution by allowing different sections of code to execute depending on runtime values. Branching decisions are
determined during runtime because the final condition values may depend on user input, external data, application state,
or previous computations.

| Feature               | Purpose                                         |
|:----------------------|:------------------------------------------------|
| `if` statement        | Execute code conditionally                      |
| `if...else` statement | Select between two execution paths              |
| `else if` chain       | Select between multiple conditions              |
| `switch` statement    | Select based on matching a single expression    |
| Ternary operator      | Produce one value from two possible expressions |

## Conditional Branch Selection

**Branch Selection:** The process of evaluating conditions and choosing which block of code becomes part of the active
execution path. When evaluating a conditional structure, only the selected branch executes, while all remaining branches
are skipped:

| Branch Type        | Purpose                                     |
|:-------------------|:--------------------------------------------|
| Primary branch     | Executes when the main condition succeeds   |
| Alternative branch | Executes when the primary condition fails   |
| Fallback branch    | Executes when no previous condition matches |

## Execution Paths

**Execution Path:** A possible sequence of statements that the JavaScript engine may execute during program runtime. A
program can contain multiple possible paths even though only one path is followed during a specific execution.

| Situation           | Possible Paths                    |
|:--------------------|:----------------------------------|
| User authentication | Logged-in path or guest path      |
| Input validation    | Valid input path or error path    |
| Application state   | Loading, success, or failure path |

## Path Selection

**Path Selection:** The runtime process where evaluated conditions determine which execution path is followed. Different
inputs can cause the same program to follow completely different paths based on runtime factors:

| Factor           | Description                                       |
|:-----------------|:--------------------------------------------------|
| Condition values | Results of expressions evaluated at runtime       |
| Program state    | Current values stored in variables and objects    |
| External input   | Data received from users, APIs, files, or systems |

## Sequential Execution vs Branching

JavaScript normally executes statements sequentially. Branching does not stop sequential execution, but rather
determines which statements are included in the overall execution sequence:

| Execution Type       | Behavior                                      |
|:---------------------|:----------------------------------------------|
| Sequential execution | Statements run in written order               |
| Branching execution  | Selected sections execute based on conditions |

## Reachable and Unreachable Paths

**Reachable Path:** A code path that can be executed when program conditions allow it.

**Unreachable Path:** A code path that cannot execute because program logic prevents reaching it. Unreachable paths may
indicate incorrect logic or intentional defensive code caused by runtime blocks:

| Cause                | Example                                  |
|:---------------------|:-----------------------------------------|
| Immediate return     | Code after `return`                      |
| Constant conditions  | Branch that can never become true        |
| Previous termination | Code after `throw` or unconditional exit |

## Control Flow Analysis

**Control Flow Analysis:** The process of examining possible execution paths within a program. Developers and static
analysis tools use control flow information to detect potential errors and issues before execution:

| Issue                 | Description                                |
|:----------------------|:-------------------------------------------|
| Dead code             | Statements that cannot execute             |
| Missing branches      | Unhandled conditions                       |
| Impossible states     | Conditions that cannot occur               |
| Incorrect assumptions | Logic that does not match runtime behavior |

## Branch Complexity

**Branch Complexity:** The number of possible execution paths created by conditional logic. Each additional condition
increases the number of possible paths that must be considered, making complex branching harder to test because more
possible states must be verified:

| Structure                  | Path Count                     |
|:---------------------------|:-------------------------------|
| One condition              | Two possible paths             |
| Two independent conditions | Multiple possible combinations |
| Nested conditions          | Increased path complexity      |

## Best Practices

* **Keep branching logic explicit:** Conditions should clearly describe the decision being made instead of hiding
  behavior through complex expressions.
* **Avoid unnecessary nested branches:** Deep nesting increases the number of execution paths and makes code harder to
  maintain.
* **Handle all meaningful states:** Missing branches can create unexpected behavior when new runtime conditions appear.
* **Separate decision logic from execution logic:** Complex conditions are easier to maintain when the decision process
  and the resulting action are separated.
* **Reduce unnecessary path complexity:** Simplifying conditions and extracting repeated logic reduces the number of
  cases that must be tested.
* **Ditch `if/else`/`switch` chains for lookup-table dispatch when branching on a known value.** An object or `Map`
  keyed by the value, with functions as entries, turns O (n) sequential comparisons into O (1) lookup and eliminates
  fall-through bugs entirely — there's no `case` to forget a `break` on.
* **Use labeled `break`/`continue` to escape nested loops directly**, instead of a `found` boolean flag checked at every
  level. Almost nobody uses this JS feature, but it removes an entire class of flag-management bugs in nested search
  logic.
* **Watch for monomorphic vs. polymorphic branches in hot paths.** V8's TurboFan optimizes a condition based on the
  shapes/types it observes; if the same comparison sees mixed types across calls (`x === 5` sometimes number, sometimes
  string), the function gets deoptimized back to the interpreter. Keeping comparison operands type-stable in
  performance-critical code isn't cosmetic — it's a real JIT concern.
* **Replace boolean flag parameters with distinct functions or a discriminated value.** A function taking
  `(x, isUrgent)` doubles its branch count for every additional flag added later (2ⁿ growth). This is the "flag
  argument" smell — split into `processUrgently(x)` / `processNormally(x)`, or pass a tagged mode value instead of
  stacking booleans.
* **`switch (true) { case cond1: ... }` is a legitimate, if divisive, pattern for range-based branching that reads
  better than an `else if` chain once you have 4+ conditions** — but only use it when every `case` is mutually exclusive
  and ordered correctly, since it silently breaks the usual "switch matches one value" mental model for future readers.
* **Extract complex conditions into named predicate functions, not just variables.** `if (isEligibleForRefund(order))`
  beats an inline multi-clause boolean expression — but the deeper reason few people cite: named predicates are reusable
  and independently unit-testable, whereas inline boolean expressions get silently duplicated (and drift out of sync)
  across a codebase.
* **Track cyclomatic complexity, not just visual nesting.** McCabe's metric (branches + 1) correlates with defect
  density more reliably than indentation depth does — a flat function with 12 independent early-return guards can be
  riskier than a nested one with 3 branches. Tools like ESLint's `complexity` rule catch this where "looks nested"
  heuristics miss it.
* **For multi-state workflows (order status, wizard steps, connection state), model an explicit state machine** — even a
  plain transition table — rather than ad hoc booleans like `isLoading`/`isError`/`isDone`. Independent booleans permit
  invalid combinations (`isLoading && isError` both true); a state machine makes invalid states structurally
  unrepresentable.
* **Don't rely on short-circuit evaluation (`&&`, `||`, `??`) for anything with a side effect you need to guarantee
  runs.** `condition && doSomething()` looks like control flow but is an expression — the moment someone negates the
  condition or refactors it into a ternary, the side effect silently disappears. Reserve short-circuiting for pure value
  selection, use real `if` for effects.
* **Hoist loop-invariant conditions out of loops manually.** JIT compilers hoist *simple* invariants automatically, but
  a condition involving a function call, property access through a getter, or anything non-trivial often isn't proven
  invariant by the engine and gets re-evaluated every iteration. If a branch condition inside a hot loop doesn't change
  per-iteration, compute it once before the loop.
