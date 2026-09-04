# Pure Functions

## Pure Function Concept

**Pure Function:** A function that always produces the same output for the same input and does not modify external
state, relying solely on explicit parameters without observable side effects to achieve total predictability.

## Characteristics of Pure Functions

A function is considered pure when it satisfies core requirements for determinism and isolation.

| Requirement              | Description                                  |
|:-------------------------|:---------------------------------------------|
| Deterministic output     | Same input always produces the same result   |
| No external modification | Does not change values outside its own scope |
| No hidden dependencies   | Uses only provided inputs and local values   |
| No side effects          | Does not perform observable external actions |

## Deterministic Output

**Deterministic Output:** A function property where the same input values consistently produce identical results without
relying on changing external conditions.

## No External State Modification

Pure functions never modify external application state, global variables, module-level data, or external object
properties, choosing instead to create and return new results.

| External State    | Example                     |
|:------------------|:----------------------------|
| Global variables  | Shared application values   |
| Object properties | Modifying external objects  |
| Module-level data | Shared imported values      |
| Application state | Changing stored information |

## No Hidden Dependencies

Pure functions keep dependencies explicit by receiving everything they need exclusively through parameters rather than
relying on global scope or external systems.

| Dependency Type     | Allowed |
|:--------------------|:--------|
| Function parameters | Yes     |
| Local variables     | Yes     |
| Global variables    | No      |
| External systems    | No      |

## Pure Function Behavior

A pure function processes input values into new results through calculations or transformations without modifying
external data or depending on external conditions.

## Pure Functions and Immutability

Pure functions work with immutable data patterns by creating and returning new values and objects instead of modifying
existing ones, preserving original data to prevent shared reference bugs.

## Benefits of Pure Functions

| Benefit              | Description                                 |
|:---------------------|:--------------------------------------------|
| Easier testing       | Inputs and outputs can be verified directly |
| Predictable behavior | Results do not depend on external state     |
| Better reusability   | Functions work in different contexts        |
| Easier debugging     | Fewer hidden changes occur                  |

## Pure Functions and Testing

Pure functions simplify testing by requiring only input values and expected outputs without needing to mock external
systems, prepare application states, or reset modified data.

## Limitations of Pure Functions

Pure functions cannot directly perform operations requiring external changes, forcing applications to combine them with
controlled impure operations.

| Operation        | Reason                      |
|:-----------------|:----------------------------|
| Writing files    | Modifies external resources |
| Network requests | Depends on external systems |
| DOM updates      | Changes external state      |
| Logging          | Produces external output    |

## Pure Functions vs Impure Functions

| Feature                 | Pure Function | Impure Function |
|:------------------------|:--------------|:----------------|
| Same input, same output | Yes           | Not guaranteed  |
| External state access   | No            | Possible        |
| Side effects            | No            | Possible        |
| Testing difficulty      | Lower         | Higher          |
| Predictability          | High          | Variable        |

## Use Cases

* **Data transformation:** Convert data structures without modifying original values.
* **Calculations:** Perform predictable mathematical operations.
* **Validation:** Check values without changing application state.
* **Business logic:** Implement rules independently of external systems.

## Best Practices

* **Prefer pure functions for calculations and transformations:** Utilize them to maximize testability and
  maintainability.
* **Keep dependencies explicit:** Pass all required values strictly as parameters.
* **Separate logic from side effects:** Keep data processing completely independent of external operations.
* **Avoid modifying external state:** Always return new values instead of mutating inputs.
* **Treat function inputs as strictly immutable:** Never reassign or mutate properties of objects passed into functions;
  return a shallow or deep copy instead.
* **Isolate impure operations at application boundaries:** Contain side effects like network requests, DOM manipulation,
  and logging to specific service layers while keeping core business logic pure.
* **Leverage structural sharing for performance optimization:** Use efficient immutability patterns when dealing with
  large data structures to minimize memory overhead during transformations.
* **Validate deterministic properties during unit testing:** Write comprehensive assertions confirming that identical
  inputs always yield identical outputs under any environment.
* **Avoid relying on non-deterministic data sources:** Refrain from calling `Math.random()`, `Date.now()`, or external
  clock APIs directly inside pure functions; inject values as parameters instead.
* **Use pure functions freely inside higher-order array methods:** Pair pure callback functions with `.map()`,
  `.filter()`, and `.reduce()` to ensure clean and predictable data pipelines.
* **Document side effects explicitly where impurity is required:** Use comments or TypeScript return annotations to
  clearly mark functions that deliberately perform state mutations or I/O operations.
* **Return new object or array literals consistently:** Produce fresh reference copies using spread syntax (
  `{ ...obj }`, `[...arr]`) to prevent unintended mutation side-effects.
* **Keep state management logic predictable:** Pair pure functions with state container patterns (like Redux reducers)
  to handle state transitions reliably.
* **Avoid hidden global scope reads:** Ensure functions do not reference module-level variables or configuration states
  implicitly without explicit parameter passing.
* **Design robust error handling without side effects:** Throw descriptive errors for invalid inputs instead of mutating
  external flags or logging states globally inside core calculation blocks.
* **Perform deep cloning when mutating nested structures safely:** Use structured cloning or immutable update utilities
  when modifying deeply nested properties to preserve original data integrity.
* **Isolate asynchronous side effects cleanly:** Wrap promises, async timers, and event bindings away from pure
  functional computational layers.
* **Keep validation and parsing logic entirely free of I/O:** Ensure data validators evaluate inputs and return Boolean
  or result objects without triggering side actions.
* **Review third-party library dependencies for purity:** Verify that helper utilities or mathematical functions
  imported from external packages do not mutate shared states unexpectedly.
* **Embrace functional programming principles progressively:** Integrate pure function patterns gradually into existing
  codebases by starting with data formatting and transformation utilities.