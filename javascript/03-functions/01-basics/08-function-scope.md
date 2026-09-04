# Scope and Functions

## Function Scope

**Function Scope:** The visibility boundary created by a function that determines where variables and parameters can be
accessed, preventing internal variables from being directly modified or read by external code while remaining available
to nested functions.

## Local Scope

**Local Scope:** The scope created inside a function where input parameters, local variables, and nested declarations
are available during the function's execution lifetime, unless preserved through closures.

| Component        | Description                            |
|:-----------------|:---------------------------------------|
| Parameters       | Function input bindings                |
| Local variables  | Variables declared inside the function |
| Nested functions | Functions created inside the function  |

## Global Scope

**Global Scope:** The outermost scope available throughout a JavaScript program where variables remain accessible for
the program's entire execution lifetime, with global environment behavior varying by context.

| Environment     | Global Object |
|:----------------|:--------------|
| Browser scripts | `window`      |
| Node.js modules | Module scope  |
| ES modules      | Module scope  |

## Lexical Scope

**Lexical Scope:** A scope system where variable access is determined strictly by where code is written rather than
where it is executed, allowing nested functions to inherit access to variables from their surrounding lexical
environments.

| Scope Level           | Accessible |
|:----------------------|:-----------|
| Own scope             | Yes        |
| Outer scopes          | Yes        |
| Child function scopes | No         |

## Scope Chain

**Scope Chain:** The sequence of lexical environments JavaScript searches from the current function scope outward
through parent scopes and global environments until a variable reference is resolved or the global scope is reached.

## Variable Shadowing

**Variable Shadowing:** A situation where an inner scope variable uses the same name as an outer scope variable, taking
priority within that specific inner scope without altering outer declarations.

| Location      | Priority |
|:--------------|:---------|
| Current scope | Highest  |
| Parent scope  | Lower    |
| Global scope  | Lowest   |

## Closures Introduction

**Closure:** A function that maintains access to variables from its surrounding lexical environment even after the outer
function has finished executing, combining executable code with preserved variable references.

| Component           | Description               |
|:--------------------|:--------------------------|
| Function            | Executable code           |
| Lexical environment | Preserved variable access |

## Closure Creation

Closures are created naturally whenever a nested function references variables from an outer function, allowing data to
persist beyond the original execution and enabling patterns like private state management.

## Closures and Function Lifetime

Normally, local variables are removed after a function finishes execution, but closures change this behavior by keeping
referenced variables alive while the inner function exists, bridging data persistence beyond standard execution limits.

## Common Closure Patterns

Closures are commonly applied across various structural software patterns.

| Pattern            | Purpose                             |
|:-------------------|:------------------------------------|
| Data privacy       | Restrict direct access to variables |
| Function factories | Generate customized functions       |
| State management   | Maintain internal values            |
| Callbacks          | Preserve execution context          |

## Scope and Function Definitions

The location where a function is created determines its available variables through lexical scope, meaning moving a
function alters its available variables because creation location supersedes execution location.

## Function Scope vs Block Scope

JavaScript utilizes multiple distinct scope types depending on declaration syntax and structural blocks.

| Scope Type     | Created By                         |
|:---------------|:-----------------------------------|
| Function scope | Functions                          |
| Block scope    | `{}` blocks with `let` and `const` |
| Global scope   | Program level                      |

*Note: `var` follows function scope rules, whereas `let` and `const` follow block scope rules.*

## Best Practices

* **Limit global variables:** Minimize global state to reduce naming conflicts and maintainability issues.
* **Keep variables close to their usage:** Narrow scopes to improve readability and prevent accidental modifications.
* **Avoid unnecessary shadowing:** Prevent confusion by keeping variable names distinct across different scopes.
* **Understand lexical scope before using closures:** Ensure a solid grasp of surrounding environments since closures
  rely entirely on them.
* **Use closures intentionally:** Employ closures purposefully to meet explicit design requirements like privacy or
  factory generation.