# Compilation

Compilation is the process of transforming source code into another representation that is more suitable for execution,
deployment, analysis, or further transformation. In JavaScript, compilation is not limited to producing native machine
code. JavaScript engines typically parse source text into an internal representation, perform semantic analysis and
optimization, generate executable code, and may repeat or revise those steps as more information becomes available
during execution.

Compilation is therefore a runtime concern as well as a build-time concern. A JavaScript application may be transformed
by a compiler or transpiler before deployment, then compiled again by the JavaScript engine after the resulting source
is loaded. The two forms of compilation have different purposes and operate at different stages.

## Compilation in JavaScript

JavaScript source is distributed as source text, but engines generally do not execute that text directly as a sequence
of characters. The engine first parses the source into an internal representation and validates its syntactic structure.
It then performs the implementation-specific work necessary to make the program executable.

The exact compilation architecture differs between JavaScript engines. Some engines use bytecode interpreters, baseline
compilers, optimizing just-in-time compilers, or combinations of these techniques. The ECMAScript specification defines
the language semantics, but it does not mandate a particular compilation strategy, intermediate representation, bytecode
format, or machine-code generation technique.

This distinction is important because JavaScript developers should reason about the language semantics independently
from the implementation strategy used by a particular engine.

## Source-to-Executable Transformation

Compilation can occur through multiple transformations. Source code may first be transformed by a build tool,
transpiler, or compiler into another JavaScript representation. The resulting code can then be parsed and compiled by
the runtime.

For example, modern JavaScript syntax may be transformed into an older syntax level for compatibility with a target
environment. TypeScript may be transformed into JavaScript. JSX may be transformed into JavaScript expressions. A
bundler may combine modules into deployment artifacts. Minifiers may rewrite source while preserving its observable
semantics.

These transformations are different from the JavaScript engine's own runtime compilation. A build-time transformation
produces an artifact intended for another stage, whereas runtime compilation prepares code for execution by the
JavaScript engine.

## Parsing

Parsing converts source text into a structured representation according to the ECMAScript grammar. The parser determines
whether the source is syntactically valid and constructs the internal structures needed for subsequent processing.

Parsing is distinct from execution. The engine must understand the syntactic structure of source code before it can
execute the corresponding operations.

```js
function calculateTotal(price, quantity) {
    return price * quantity;
}
```

The parser identifies the function declaration, parameter list, block, return statement, identifiers, and multiplication
expression. The exact internal representation is engine-specific.

Syntax errors are generally detected during parsing or an associated early validation phase.

```js
function calculateTotal(price, quantity {
    return price * quantity;
}
```

The malformed parameter list prevents the source from being parsed as valid JavaScript.

## Abstract Syntax Trees

An Abstract Syntax Tree (AST) is a structured representation of source syntax. ASTs are commonly used by JavaScript
tooling such as parsers, linters, formatters, compilers, transpilers, and static-analysis tools.

Consider:

```js
const total = price * quantity;
```

Conceptually, the AST represents a variable declaration containing an initializer expression whose operands are the
identifiers `price` and `quantity`, with multiplication as the operator.

An AST is primarily a representation of syntax. It should not be confused with the engine's complete runtime
representation of a program. JavaScript engines may transform parsed structures into implementation-specific
intermediate representations that are substantially different from the AST exposed by development tooling.

## Compilation and Execution Contexts

Compilation does not eliminate the language's execution semantics. JavaScript execution still occurs within execution
contexts, environments, realms, agents, and the associated language mechanisms defined by ECMAScript.

Compilation prepares executable representations, but operations such as lexical binding resolution, function invocation,
object access, property lookup, exception handling, and control flow must still implement the specified language
behavior.

An engine may represent these operations using bytecode, native instructions, or other internal mechanisms. The
representation can change without changing the required observable behavior of the JavaScript program.

## Bytecode

Some JavaScript engines compile source into bytecode or another intermediate executable representation before or
alongside native machine-code compilation.

Bytecode is an internal instruction format designed for execution by an interpreter or runtime execution engine. It can
provide a relatively fast path from parsed source to executable behavior without requiring every function to immediately
undergo expensive native-code optimization.

The exact bytecode format is engine-specific and is not part of the ECMAScript language.

A function may therefore exist in an interpreted or baseline-compiled representation initially and later be compiled
into optimized machine code if runtime information indicates that optimization is worthwhile.

## Just-in-Time Compilation

Just-in-time (JIT) compilation performs compilation during program execution rather than requiring all executable code
to be compiled into native machine code before the program starts.

JavaScript engines can observe how code behaves at runtime and use that information when generating optimized code.
Runtime information can include the types of values encountered, the shapes of objects, the frequency of particular
execution paths, and whether certain assumptions remain stable.

This allows the engine to optimize code based on actual execution behavior rather than relying exclusively on static
information available before execution.

JIT compilation is an implementation technique, not a JavaScript language feature.

## Baseline Compilation

A JavaScript engine may compile code into a relatively inexpensive executable representation before attempting more
aggressive optimization.

Baseline compilation prioritizes reducing execution overhead without spending excessive time analyzing and optimizing
code that may execute only briefly.

This is particularly important for applications containing large amounts of code where only a subset of functions become
sufficiently hot to justify expensive optimization.

The exact terminology and stages differ between engines, so "baseline compiler" should be understood as a general
implementation concept rather than a standardized JavaScript execution phase.

## Optimizing Compilation

Optimizing compilers attempt to generate more efficient executable code by using information about how a program
actually behaves.

A function that repeatedly performs the same operation with compatible value representations may become a candidate for
optimization. The engine can specialize generated code around observed conditions and eliminate unnecessary work when it
can prove that doing so preserves observable behavior.

For example:

```js
function add(a, b) {
    return a + b;
}

function calculate() {
    let result = 0;

    for (let i = 0; i < 1000000; i++) {
        result = add(result, i);
    }

    return result;
}
```

Repeated execution may provide the engine with information useful for optimizing `add` and its callers. The resulting
optimization is implementation-dependent and should never be treated as a guarantee that a particular function will be
compiled in a particular way.

## Speculative Optimization

Dynamic languages provide less static information than many statically typed languages. A JavaScript engine can
therefore use runtime observations to make speculative assumptions.

An engine might optimize a code path under an assumption that values encountered at a particular operation have
compatible representations. If that assumption later becomes invalid, the optimized code cannot continue operating under
the invalid assumption.

The engine can deoptimize the code and return execution to a less specialized representation that can correctly handle
the newly observed behavior.

This process is commonly called deoptimization or deopt.

## Deoptimization

Deoptimization reverses or abandons an optimization when assumptions used by optimized code are no longer valid.

For example:

```js
function multiply(value) {
    return value * 2;
}

multiply(10);
multiply(20);
multiply(30);
```

The engine may observe a stable pattern in the values used by the function. Later execution may introduce a different
value representation or behavior that invalidates an optimization.

The engine must preserve JavaScript semantics even when runtime behavior changes. Deoptimization allows execution to
continue using a more general representation.

This is one reason JavaScript performance cannot reliably be inferred from source syntax alone.

## Inline Caching

Inline caching is an optimization technique used to accelerate repeated operations such as property access and method
calls.

Consider:

```js
function getName(user) {
    return user.name;
}
```

Repeated execution of `getName` can provide the engine with information about the objects supplied to `user`. If the
relevant object structure remains stable, the engine may optimize the property access based on that information.

Inline caches can become more or less specialized depending on how many different object structures are observed at the
operation site.

The exact implementation varies by engine, but the underlying principle is to avoid repeatedly performing expensive
general-purpose lookup work when runtime observations make a faster specialized path possible.

## Object Shapes

JavaScript objects are dynamically extensible, but engines can internally associate objects with structural
representations often called shapes, hidden classes, or related implementation-specific terms.

Consider:

```js
const user = {};
user.name = "Ada";
user.age = 36;
```

The engine may track the sequence and structure of properties internally. Another object created with compatible
property structure may be able to share relevant internal metadata.

These internal structures are implementation details. JavaScript does not expose "hidden classes" as a language concept.

Object-shape stability can nevertheless affect optimization because engines can use stable structural information to
specialize property access.

## Function Optimization

Functions are common optimization units because JavaScript programs execute substantial amounts of behavior through
function calls.

An engine may gather execution information about a function and its callers, optimize operations within the function,
inline frequently executed calls, specialize property accesses, eliminate redundant operations, or perform other
transformations when correctness can be established.

Inlining can eliminate the overhead associated with a function call and expose additional optimization opportunities.

```js
function square(value) {
    return value * value;
}

function calculate(value) {
    return square(value) + 1;
}
```

An optimizing engine may inline `square` into `calculate`, but this is an implementation decision rather than a semantic
guarantee.

## Dead Code Elimination

Compilers can eliminate computations whose results cannot affect observable behavior.

Consider:

```js
function calculate(value) {
    const unused = value * 100;
    return value + 1;
}
```

If the multiplication has no observable effects and the result is never used, an optimizer may eliminate the
calculation.

JavaScript's dynamic semantics impose important constraints on this optimization. An operation that appears unused may
still have observable behavior through getters, proxies, coercion, exceptions, function calls, or other mechanisms.

Therefore, optimization is constrained by semantic correctness rather than merely by whether a value appears
syntactically unused.

## Constant Folding

Constant folding evaluates expressions at compile time when their values can be determined safely.

```js
const value = 10 * 20;
```

An optimizer may replace the computation with its known result because the multiplication of those numeric literals does
not depend on runtime state.

More complex expressions may not be eligible because JavaScript operations can involve coercion, observable calls,
exceptions, or dynamically resolved behavior.

## Dead Branch Elimination

Compilers may remove branches that are provably unreachable or whose condition can be determined without changing
observable behavior.

```js
if (false) {
    performOperation();
}
```

The body cannot execute under ordinary JavaScript semantics because the condition is a constant `false`.

Runtime information can also make some branches effectively predictable, but speculative branch optimization must remain
capable of handling later behavior that violates the assumptions used by the optimizer.

## Inlining

Inlining replaces a function call with the function's body or an equivalent optimized representation.

```js
function increment(value) {
    return value + 1;
}

const result = increment(count);
```

An optimizing compiler may inline `increment` when doing so is beneficial.

Inlining can expose additional optimization opportunities because operations that were previously separated by a
function-call boundary become visible to the optimizer.

Inlining is not guaranteed. Functions can be difficult or undesirable to inline because of size, recursion,
polymorphism, dynamic behavior, optimization cost, or other implementation constraints.

## Escape Analysis

Escape analysis determines whether allocated values can remain local to a particular execution scope or whether they
become observable outside that scope.

This information can enable optimizations such as reducing allocation or replacing object representations when the
engine can prove that the externally observable behavior remains unchanged.

JavaScript's dynamic object model makes such analysis complex because objects can escape through returns, closures,
properties, calls, globals, and other mechanisms.

```js
function calculate(x, y) {
    const point = {
        x,
        y
    };

    return point.x + point.y;
}
```

If the engine can establish that the object does not need to exist as an independently observable object, it may
optimize the representation of the computation.

Such optimizations are engine-specific and should not be assumed from the source code.

## Compilation and Closures

Closures require compiled code to preserve access to variables belonging to surrounding lexical environments.

```js
function createCounter() {
    let count = 0;

    return function increment() {
        return ++count;
    };
}
```

The returned function continues to access `count` after `createCounter` has returned.

An implementation may represent captured variables using environment structures, optimized storage, registers, stack
locations, heap-allocated structures, or other mechanisms depending on escape analysis and optimization decisions.

The observable requirement is that the closure retain the required lexical semantics. The physical representation is
implementation-dependent.

## Compilation and `eval`

Dynamic code evaluation restricts some static and speculative optimization opportunities.

```js
function execute(source) {
    return eval(source);
}
```

Direct `eval` can introduce or interact with bindings in ways that make certain compile-time assumptions unsafe.

JavaScript engines therefore have to account for dynamic evaluation when determining which optimizations are valid.

Avoiding unnecessary dynamic code evaluation generally gives engines more freedom to analyze and optimize programs.

## Compilation and `Function`

The `Function` constructor also creates executable JavaScript dynamically.

```js
const add = new Function("a", "b", "return a + b;");
```

The generated function's source is not available to the surrounding program as ordinary static source during the initial
compilation of that surrounding code.

The engine must parse and compile the generated source when it is created or otherwise needed according to its
implementation strategy.

Dynamic code generation therefore introduces an additional compilation boundary.

## Compilation and Modules

ECMAScript modules provide statically structured import and export declarations.

```js
import {calculateTotal} from "./pricing.js";

export function checkout(order) {
    return calculateTotal(order.price, order.quantity);
}
```

The module structure provides information that build tools and JavaScript engines can use when resolving dependencies
and constructing module execution.

Static module declarations also make dependency relationships more analyzable than arbitrary runtime loading mechanisms.

Dynamic `import()` introduces runtime module loading:

```js
const module = await import("./pricing.js");
```

The module can therefore be loaded asynchronously at runtime, while the loaded source still undergoes parsing and
compilation before its code can execute.

## Compilation and Bundling

Bundling and compilation are related but distinct processes.

A bundler analyzes module dependencies and constructs deployment artifacts from multiple source modules. A compiler
transforms source representations or generates executable representations. A build pipeline may perform both.

For example, a build may transform TypeScript into JavaScript, resolve and combine modules, perform tree shaking and
minification, and emit deployment files. When those files are loaded by a JavaScript runtime, the engine still parses
and compiles the resulting JavaScript.

Bundling therefore does not eliminate runtime compilation.

## Transpilation

Transpilation transforms source code from one language or language level into another representation that preserves the
intended behavior.

TypeScript is a common example:

```ts
function greet(name: string): string {
    return `Hello, ${name}`;
}
```

A TypeScript compiler can remove the type annotations and emit JavaScript suitable for a target environment.

The JavaScript engine does not execute TypeScript types. They are removed before the resulting JavaScript reaches the
runtime.

Transpilation and compilation are sometimes used interchangeably, but they describe different concerns in many
JavaScript toolchains. Transpilation emphasizes source-to-source transformation, while compilation more broadly includes
transformations into executable or intermediate representations.

## Minification and Compilation

Minification rewrites source code to reduce its size while preserving relevant behavior.

```js
function calculateTotal(price, quantity) {
    return price * quantity;
}
```

A minifier might shorten local identifiers and remove unnecessary syntactic characters.

Minification is a build-time transformation. The resulting JavaScript still has to be parsed and compiled by the
JavaScript engine.

Minification can improve transfer and parsing costs, but its impact on runtime execution depends on the generated code
and the engine.

## Tree Shaking

Tree shaking is a build-time optimization that removes code that static analysis determines is unused.

It is particularly effective with statically structured module systems such as ECMAScript modules.

```js
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}
```

If an application imports only `add`, a sufficiently capable build process may remove `subtract` when it can establish
that doing so is safe.

Tree shaking is not the same as runtime dead-code elimination. Tree shaking operates on the build-time module graph,
while runtime compilers optimize executable code based on language semantics and runtime information.

## Compilation and Garbage Collection

Compilation and garbage collection are separate subsystems, but they interact.

Optimized code must preserve references to objects that remain reachable. Garbage collectors may also use information
about compiled code to identify references held in registers, stack frames, environments, and other runtime structures.

Optimizations that change object representation or allocation behavior must remain compatible with the garbage
collector.

JavaScript engines therefore coordinate code generation, runtime metadata, stack maps, object representation, and
garbage collection mechanisms.

## Compilation and Exceptions

JavaScript exceptions are observable behavior.

```js
function divide(value) {
    if (value === 0) {
        throw new Error("Division by zero");
    }

    return 100 / value;
}
```

An optimizer cannot remove or reorder operations if doing so would change observable exception behavior.

This constraint applies broadly to JavaScript optimization. Apparent simplifications must preserve normal results,
exceptions, side effects, evaluation order, coercion behavior, and other observable semantics required by the language.

## Compilation and Side Effects

Side effects restrict optimization because they make execution observable.

```js
let count = 0;

function increment() {
    count++;
}
```

A compiler cannot arbitrarily remove or reorder the increment because other operations can observe the value of `count`.

The same principle applies to property setters, getters, proxies, function calls, DOM operations, I/O, shared memory,
exceptions, and other observable behavior.

Optimization is therefore constrained by the JavaScript memory and execution model rather than merely by algebraic
equivalence.

## Compilation and `Proxy`

`Proxy` can make operations such as property access, assignment, function calls, and other object interactions
dynamically observable.

```js
const user = new Proxy(
    {},
    {
        get(target, property) {
            console.log("reading", property);
            return target[property];
        }
    }
);
```

An engine cannot assume that an apparently ordinary property access has only ordinary object semantics when a proxy may
intercept it.

Dynamic language features such as `Proxy` therefore affect the assumptions available to optimizing compilers.

## Compilation and Property Access

Property access is a major optimization target in JavaScript.

```js
function getAge(user) {
    return user.age;
}
```

A general JavaScript property lookup may need to account for prototypes, accessors, proxies, property descriptors,
dynamic mutation, and other semantics.

When runtime information establishes stable conditions, an engine can use optimized property access paths. If those
conditions cease to hold, the engine must fall back to a more general implementation or deoptimize specialized code.

## Compilation and Prototype Mutation

Prototype mutation can invalidate assumptions about property lookup.

```js
function getValue(object) {
    return object.value;
}

Object.prototype.value = 42;
```

Changes to prototype relationships can affect what a property access means.

Engines therefore need mechanisms for invalidating or guarding optimized assumptions when relevant object structures or
prototype relationships change.

Stable object and prototype structures generally provide more opportunities for predictable optimization than frequently
mutated structures.

## Compilation and Performance

Source-level intuition is not sufficient to predict JavaScript runtime performance.

The engine's optimization decisions depend on runtime behavior, execution frequency, object structures, value
representations, code size, allocation behavior, garbage collection, deoptimization, and many other factors.

A source-level rewrite can improve performance, have no measurable effect, or make performance worse depending on the
actual workload and engine behavior.

Performance-sensitive code should therefore be evaluated using measurements rather than assumptions about how a compiler
"must" optimize it.

## Warm-Up

JIT-compiled environments can exhibit warm-up behavior.

Code may initially execute through parsing, interpretation, or baseline compilation before reaching an optimized state.
A benchmark that measures only the first few executions may therefore measure startup and compilation overhead rather
than steady-state execution.

Conversely, a benchmark that runs for a long time may measure an optimization state that is not representative of a real
application whose relevant code executes only occasionally.

Reliable benchmarking should account for both startup behavior and steady-state behavior when both matter.

## Compilation Cost

Compilation itself consumes CPU time and memory.

Aggressive optimization can improve execution speed but require additional analysis and code generation. Optimizing code
that executes only once may therefore be counterproductive.

This creates a trade-off between compilation cost and execution benefit.

JavaScript engines continuously balance these costs based on runtime information and implementation heuristics.

## Code Size and Optimization

Large generated functions can be expensive to parse, compile, optimize, and execute.

Build-time transformations can unintentionally increase code size or produce structures that affect runtime
optimization.

Inlining can also increase generated code size even when it reduces function-call overhead.

The optimal result is therefore not simply "more optimization." The engine must balance execution speed, compilation
time, memory usage, instruction-cache behavior, and other constraints.

## Compilation Boundaries

A compilation boundary is a point at which code must be separately analyzed, generated, loaded, or executed.

Examples include dynamically imported modules, dynamically generated functions, worker scripts, evaluated source, and
separately deployed artifacts.

Compilation boundaries can affect startup behavior and optimization opportunities because information may not be
available across the boundary in the same way it is within a single statically analyzable unit.

The exact effect depends on the runtime and build architecture.

## Compilation and Workers

JavaScript executed in a worker is associated with a separate execution environment and can require separate loading and
compilation of its code.

```js
const worker = new Worker("./worker.js");
```

The worker's source must be made executable within the worker's runtime environment.

Worker boundaries therefore have implications for code loading, parsing, compilation, memory, startup cost, and
optimization. They should not be treated as merely another function-call boundary.

## Compilation and Shared Memory

Shared memory introduces additional semantic constraints for optimization.

```js
const buffer = new SharedArrayBuffer(1024);
const values = new Int32Array(buffer);
```

Operations involving shared memory must obey the JavaScript memory model and the semantics of atomic operations where
applicable.

An optimizer cannot apply transformations that would violate those semantics merely because the transformation would be
valid for ordinary non-shared local state.

## Compilation and WebAssembly

WebAssembly introduces a separate compilation and execution technology that can coexist with JavaScript.

```js
const instance = await WebAssembly.instantiateStreaming(fetch("./module.wasm"));
```

WebAssembly has its own binary format, type system, instruction set, and execution model. JavaScript can interact with
WebAssembly through defined host integration mechanisms.

The compilation of WebAssembly and the compilation of JavaScript are distinct processes, although an engine can optimize
their interaction.

## Build-Time Compilation Versus Runtime Compilation

The term compilation is frequently overloaded in JavaScript projects.

Build-time compilation includes transformations performed by tools such as TypeScript compilers, transpilers, bundlers,
JSX transformers, and minifiers.

Runtime compilation refers to work performed by the JavaScript engine to turn loaded source or intermediate
representations into executable forms.

These processes can occur sequentially:

* Source code is transformed during the build.
* Deployment artifacts are loaded.
* The runtime parses the resulting JavaScript.
* The runtime produces executable representations.
* Frequently executed code may be optimized further during execution.

The boundaries are conceptually distinct even when a particular tool combines multiple stages.

## Compilation and Source Maps

Build tools frequently generate source maps so that transformed or compiled artifacts can be related back to their
original source.

```text
app.ts
app.js
app.js.map
```

The source map does not affect JavaScript semantics. It provides metadata used by development and debugging tools to map
generated locations back to original source locations.

Source maps are therefore a tooling concern rather than a runtime compilation mechanism.

## Compilation and Debugging

Debugging optimized code can be more complex than debugging unoptimized source because the executable representation may
differ substantially from the source structure.

Optimizations can inline functions, eliminate variables, reorder internal operations, specialize paths, and otherwise
change the relationship between source constructs and generated instructions.

Debuggers compensate using metadata and deoptimization or interpreter mechanisms where necessary to provide a useful
source-level debugging experience.

## Compilation and Security

Compilation must preserve JavaScript's security-relevant semantics.

Dynamic code generation, `eval`, `Function`, proxies, getters, prototype mutation, and other dynamic mechanisms can
constrain optimization while also increasing the complexity of reasoning about program behavior.

Build-time compilation introduces separate security concerns. Build tools execute transformations and plugins that can
access source code, configuration, dependencies, and potentially credentials or filesystem resources.

Compilation pipelines should therefore be treated as part of the software supply chain rather than as purely mechanical
preprocessing.

## Compilation and Determinism

Build-time compilation should ideally be reproducible.

Given the same source, dependencies, compiler configuration, and environment, a reproducible build should produce
equivalent artifacts.

Deterministic compilation is valuable for debugging, caching, deployment verification, supply-chain security, and
artifact integrity.

Runtime JIT compilation is different. Its generated machine code can legitimately vary between machines, runtime
versions, processor architectures, execution histories, and optimization decisions.

## Compilation Is Not Interpretation

Compilation and interpretation are often presented as mutually exclusive execution models, but modern JavaScript engines
commonly combine techniques associated with both.

An engine may parse source, generate an intermediate representation or bytecode, interpret some code, baseline-compile
other code, and optimize hot code into native machine instructions.

Therefore, asking whether JavaScript is "compiled or interpreted" is an oversimplification.

The more precise statement is that JavaScript source is parsed and transformed into executable representations, and a
particular engine may use interpretation, baseline compilation, optimizing JIT compilation, or other techniques to
execute those representations.

## Compilation Versus Transpilation

Transpilation changes source representation, generally producing source in another language or language version.

Compilation is broader and can include transformation into intermediate or executable representations.

For example, TypeScript transpilation can produce JavaScript:

```ts
const message: string = "hello";
```

The emitted JavaScript can then undergo parsing and runtime compilation in the JavaScript engine.

The TypeScript compiler and JavaScript engine therefore perform different compilation-related responsibilities.

## Compilation Versus Bundling

Bundling assembles modules into deployment artifacts according to a dependency graph.

Compilation transforms code into another representation suitable for analysis or execution.

A bundler can invoke compilers, and a compiler can participate in a build pipeline containing bundling, but the concepts
should remain distinct.

A single build command may therefore perform several transformations without those transformations constituting one
conceptual operation.

## Compilation Versus Optimization

Compilation does not necessarily imply optimization.

A compiler can produce executable code without performing aggressive optimization. Optimization is a transformation
intended to improve some property such as execution speed, memory use, code size, or startup behavior while preserving
required semantics.

In JavaScript engines, optimization can happen incrementally after code has already begun executing.

## Compilation and Architecture

Compilation affects application architecture because build-time and runtime transformations influence deployment
artifacts, startup behavior, module boundaries, observability, debugging, and performance.

An architecture that depends heavily on dynamic loading or runtime-generated code has different compilation
characteristics from one based primarily on statically analyzable modules.

Likewise, an application with many independently deployed bundles can have different parsing, compilation, caching, and
loading characteristics from a monolithic bundle.

Compilation should therefore be considered alongside module architecture, bundling, code splitting, deployment topology,
and runtime execution behavior.

## Design Considerations

Use build-time compilation and transformation when code must be adapted to a target runtime, statically analyzed,
optimized for deployment, or transformed from another source representation.

Avoid treating runtime JIT behavior as a contractual performance guarantee. Engine optimizations are implementation
details and can change between runtime versions and execution environments.

Avoid writing source code solely to satisfy assumptions about hidden classes, inline caches, optimization thresholds, or
specific JIT heuristics unless controlled measurements demonstrate a meaningful workload-specific benefit and the
dependency on implementation behavior is acceptable.

Prefer straightforward code whose semantics and architecture are clear. Optimize based on profiling when runtime
performance is important.

Treat dynamic language features such as `eval`, `Function`, `Proxy`, and extensive prototype mutation as semantic
features with real consequences rather than merely as syntax variations. They can affect static analysis, optimization
opportunities, debugging, security, and maintainability.

## Summary

Compilation in JavaScript is a layered process rather than a single transformation. Build tools may transpile, bundle,
minify, and otherwise transform source before deployment, while the JavaScript engine subsequently parses and compiles
the resulting code for execution.

JavaScript engines can combine interpretation, baseline compilation, JIT compilation, speculative optimization, inline
caching, inlining, deoptimization, and other implementation techniques. None of these mechanisms is mandated by
ECMAScript; the language specification defines observable behavior rather than the internal compilation strategy.

The central architectural distinction is between source transformation and runtime execution preparation. Build-time
compilation produces artifacts for a target environment, while runtime compilation converts loaded code into
representations that the engine can execute efficiently. Understanding that distinction prevents common misconceptions
about JavaScript being simply "interpreted" or "compiled" and provides a more accurate model for reasoning about startup
cost, runtime optimization, deployment artifacts, and performance.
