# JavaScript Optimization: Writing Performant Code and JIT Awareness

Modern JavaScript engines (such as Google Chrome's V8) employ sophisticated Just-In-Time (JIT) compilation pipelines
that translate high-level JavaScript into highly optimized machine code during runtime. Writing performant JavaScript
requires understanding how JIT engines analyze code execution, optimize hot functions, and handle deoptimizations when
runtime assumptions fail.

## Writing Optimized Code for JIT Engines

JIT compilers rely on type feedback and execution patterns to transform interpreted JavaScript into optimized machine
code. Writing predictable, structurally consistent code allows the engine to apply aggressive optimization techniques
like hidden classes and inline caching.

* **Stable Object Shapes:** Creating and initializing object properties in a consistent order across all instantiations
  ensures the engine assigns them identical hidden classes (maps), enabling fast property access.
* **Monomorphic Operations:** Keeping function parameters and arithmetic operations restricted to consistent data
  types (e.g., always passing integers rather than mixing numbers and strings) allows the JIT compiler to generate
  specialized machine code without polymorphic type-checking overhead.

```javascript
// Monomorphic function: consistently receives number arguments
function calculateArea(width, height) {
    return width * height; // Engine optimizes this for fast numeric multiplication
}

calculateArea(10, 20);
calculateArea(15, 25);
```

## Avoiding Deoptimization (Bailouts)

Deoptimization occurs when runtime behavior violates the assumptions made by the JIT compiler during optimization,
forcing the engine to discard optimized machine code and fall back to slower interpreted execution (a bailout).

* **Avoiding Type Polimorphism:** Passing mixed types (such as passing a string into a function previously optimized
  exclusively for integers) triggers deoptimization.
* **Avoiding `try...catch` in Hot Loops:** Placing heavy error-handling blocks directly inside performance-critical
  iteration loops can inhibit compiler optimizations.
* **Avoiding `delete` Operator on Objects:** Dynamically deleting properties from objects destroys their hidden class
  stability, forcing the engine into slow dictionary lookup modes.

## Architectural Trade-Offs

Writing JIT-aware JavaScript involves balancing micro-level code structure against high-level maintainability:

* **Advantages:** Faster CPU execution speeds, reduced function evaluation latency, and optimal utilization of
  underlying hardware capabilities.
* **Disadvantages:** Potential reduction in code readability if over-optimized, increased fragility when refactoring
  object shapes, and engine-specific optimization nuances that may change across browser versions.

## Best Practices

* **Initialize object properties consistently:** Always assign object properties in the constructor or object literal in
  the exact same order to preserve hidden class stability.
* **Keep functions monomorphic:** Ensure functions process consistent data types across calls to prevent expensive JIT
  deoptimizations and bailouts.