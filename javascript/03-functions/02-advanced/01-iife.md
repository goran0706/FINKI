# Immediately Invoked Function Expressions (IIFE)

## IIFE Concept

**IIFE (Immediately Invoked Function Expression):** A function expression created and executed immediately upon
definition instead of being called later, creating a temporary execution scope that exists only during its runtime.

## IIFE Structure

An IIFE consists of a function expression wrapped in parentheses to convert declaration syntax into an expression,
followed by an immediate invocation.

| Component            | Purpose                                        |
|:---------------------|:-----------------------------------------------|
| Function expression  | Creates the function                           |
| Parentheses wrapper  | Converts declaration syntax into an expression |
| Immediate invocation | Executes the function instantly                |

## IIFE Characteristics

An IIFE creates a private scope and executes instantly without remaining available for later invocation unless
explicitly referenced.

| Feature                     | Behavior              |
|:----------------------------|:----------------------|
| Creates a function          | Yes                   |
| Executes immediately        | Yes                   |
| Creates private scope       | Yes                   |
| Requires later invocation   | No                    |
| Remains available afterward | No, unless referenced |

## Function Declaration vs IIFE

| Feature        | Function Declaration | IIFE                      |
|:---------------|:---------------------|:--------------------------|
| Execution      | Called later         | Runs immediately          |
| Naming         | Usually named        | Often anonymous           |
| Scope creation | Function scope       | Temporary execution scope |
| Reuse          | Yes                  | Usually no                |

## IIFE Scope

An IIFE creates its own function scope where variables remain inaccessible from outside, exist only during execution,
and prevent global namespace pollution for temporary logic.

## Historical Uses of IIFEs

Before modern JavaScript modules, IIFEs were widely used for scope management and initialization.

| Purpose                | Description               |
|:-----------------------|:--------------------------|
| Create private scope   | Prevent global variables  |
| Avoid naming conflicts | Isolate code              |
| Initialize values      | Run setup logic once      |
| Create module patterns | Encapsulate functionality |

## IIFE and Global Scope Protection

Older JavaScript applications wrapped variables and functions inside a private IIFE scope to reduce global pollution and
prevent accidental script conflicts.

## IIFE and Module Patterns

Before native modules, developers utilized IIFEs to construct module-like structures that stored private variables,
exposed selected methods, and hid implementation details, though modern JavaScript prefers ES modules.

## IIFE Return Values

An IIFE can return a value immediately—stored in a variable, used as an expression, or assigned to an object
property—allowing initialization while producing a final result.

## IIFE Parameters

IIFEs can receive arguments during immediate invocation to enable controlled input, prevent global lookups, and
establish isolated execution environments.

## IIFE Advantages

| Benefit              | Description                            |
|:---------------------|:---------------------------------------|
| Scope isolation      | Prevents variable conflicts            |
| Immediate execution  | Runs setup logic automatically         |
| Encapsulation        | Hides implementation details           |
| Legacy compatibility | Works in older JavaScript environments |

## IIFE Limitations

| Limitation        | Description                       |
|:------------------|:----------------------------------|
| Limited reuse     | Usually executes only once        |
| Additional syntax | Requires wrapping syntax          |
| Less common today | Replaced by modules in many cases |

## Modern Alternatives

Modern JavaScript replaces many traditional IIFE use cases with native language features.

| Feature     | Purpose                                   |
|:------------|:------------------------------------------|
| ES modules  | Create isolated files and scopes          |
| Block scope | Use `let` and `const` for local variables |
| Classes     | Encapsulate object behavior               |

## Use Cases

* **One-time initialization:** Execute setup logic once.
* **Legacy applications:** Maintain older JavaScript patterns.
* **Scope isolation:** Prevent temporary variables from leaking.
* **Expression initialization:** Create values during declaration.

## Best Practices

* **Prefer modules for new applications:** Use ES modules to achieve superior code organization and scoping.
* **Use IIFEs when immediate execution is required:** Deploy them for standalone execution needs rather than relying
  purely on legacy patterns.
* **Keep IIFEs small:** Maintain high readability by avoiding large IIFE blocks.
* **Avoid unnecessary nesting:** Utilize modern block scope features for cleaner solutions.
* **Always wrap the function expression in parentheses:** Ensure the opening parenthesis precedes the `function` keyword
  to prevent syntax parsing errors caused by hoisting expressions as declarations.
* **Pass global objects as arguments for performance:** Inject `window`, `document`, or `undefined` explicitly into IIFE
  parameters to optimize global lookups and guarantee safe modifications.
* **Assign return values from IIFEs to enforce initialization logic:** Capture the result of an immediately invoked
  function to initialize module states or configuration objects cleanly.
* **Avoid polluting the global namespace with legacy IIFEs:** Use block scoping (`let` and `const`) instead of IIFEs for
  simple local variables within modern scripts.
* **Use arrow functions for concise IIFE structures:** Write modern, compact immediately invoked arrow expressions (
  e.g., `(() => {})()`) where explicit `this` binding is not required.
* **Document module boundaries in legacy scripts clearly:** Maintain readable comments around IIFE-based modules to
  signal where encapsulated scopes begin and end.
* **Avoid redundant IIFE wrappers:** Refactor code to strip unnecessary IIFEs when native block scoping or module files
  provide identical encapsulation natively.
* **Test IIFE-wrapped code structures via returned APIs:** Expose testable utility interfaces through returned object
  structures when working with legacy module patterns.
* **Prevent accidental semicolon omission bugs:** Always prefix IIFEs with a preceding semicolon if combining files or
  scripts to avoid runtime syntax collisions with prior expressions.
* **Keep asynchronous initialization contained:** Use `async` IIFEs (`(async () => {})()`) carefully to handle top-level
  promise resolution in environments lacking native top-level await.
* **Pass configuration dependencies cleanly:** Supply external configuration flags or environment variables directly as
  parameters during the IIFE's immediate execution.
* **Avoid heavy state mutation inside IIFE scopes:** Keep temporary initialization routines side-effect free to prevent
  unpredictable application states during startup.
* **Use descriptive names for self-referencing IIFEs:** Include a name in the function expression if the IIFE requires
  internal recursion during execution.
* **Audit bundle sizes for excessive IIFE usage:** Minimize redundant wrapper boilerplate across older transpiled
  codebases to optimize overall file footprints.
* **Embrace modern block scopes for temporary variables:** Replace old loop-based IIFE closures with `let` block scoping
  to handle asynchronous iteration variables correctly.
* **Transition legacy IIFE modules to ES modules gradually:** Refactor older script-tag modules into standard `import`/
  `export` files to improve long-term maintainability.