# Tree Shaking

Tree shaking is a build-time optimization that removes code that can be statically determined to be unused. In
JavaScript, it operates primarily on module dependency graphs and exported bindings, allowing a build system to
construct a smaller deployment artifact containing only the code reachable from the application's entry points.

Tree shaking is not a JavaScript runtime feature. It is performed by build tools before the resulting JavaScript is
delivered to the runtime. The JavaScript engine subsequently parses and compiles the reduced artifact like any other
JavaScript source.

## Purpose

The purpose of tree shaking is to eliminate unused code from a deployment artifact.

Consider a module containing multiple exports:

```js
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

export function multiply(a, b) {
    return a * b;
}
```

If another module imports only `add`:

```js
import {add} from "./math.js";

console.log(add(2, 3));
```

a build tool can potentially determine that `subtract` and `multiply` are not required and remove them from the
generated artifact.

The result is reduced application code rather than merely a shorter representation of the same code.

## Static Dependency Analysis

Tree shaking depends on static analysis.

A build tool examines source modules, import declarations, export declarations, references, and other information to
determine which parts of the module graph are reachable.

For example:

```js
import {add} from "./math.js";
```

provides explicit information about the dependency on `add`.

This is fundamentally different from loading a module through an arbitrary runtime string or constructing references
dynamically.

Static structure gives the build system enough information to reason about reachability before executing the
application.

## ECMAScript Modules

ECMAScript modules are particularly suitable for tree shaking because their import and export structure is statically
defined.

```js
import {createUser} from "./users.js";

export function register(name) {
    return createUser(name);
}
```

The module's dependency relationships are visible in source code.

The build tool can analyze these relationships without executing the application.

This does not mean that every ESM export is automatically removed. The build system must still determine whether
removing the corresponding code is semantically safe.

## Module Graph

Tree shaking operates over a module graph.

Each module can import bindings from other modules, and exports provide names through which those bindings are
connected.

The build process starts from one or more entry points and determines which modules, exports, declarations, and side
effects are required to preserve the behavior of the application.

Code that cannot be reached through the relevant dependency graph and that has no required observable side effects can
potentially be eliminated.

## Reachability

Reachability is the central concept behind tree shaking.

Consider:

```js
export function used() {
    return 1;
}

export function unused() {
    return 2;
}
```

If the application only references `used`, then `unused` may be unreachable from the application's entry point.

The build tool can remove `unused` when it can establish that doing so does not alter observable behavior.

Tree shaking therefore combines dependency analysis with semantic analysis rather than simply deleting exports that
happen not to be imported.

## Entry Points

Tree shaking requires one or more known entry points.

```js
import {createApplication} from "./application.js";

createApplication();
```

The build tool begins its reachability analysis from this entry module.

Library builds can have different entry points from application builds. A library may intentionally expose several
public exports, and those exports must remain available even if a particular internal consumer does not use them.

## Named Exports

Named exports provide explicit bindings that can be analyzed individually.

```js
export function createUser() {
    return {};
}

export function deleteUser() {
    return {};
}
```

A consumer can import only what it requires:

```js
import {createUser} from "./users.js";
```

This gives a tree-shaking-capable build tool a precise dependency relationship.

Named exports are not the only factor determining tree-shaking effectiveness, but they generally provide clearer static
information than dynamic access patterns.

## Default Exports

Default exports can also participate in tree shaking.

```js
export default function createUser() {
    return {};
}
```

The build tool can determine whether the default export is referenced.

The important distinction is not named versus default exports but whether the module structure and usage can be
statically analyzed.

## Re-Exports

Modules can re-export bindings:

```js
export {createUser} from "./users.js";
export {createOrder} from "./orders.js";
```

A build tool can follow these relationships through the module graph.

If an application imports only `createUser`, code exclusively required for `createOrder` may be removable when the build
system can establish that the corresponding modules have no required side effects.

Re-export structures therefore do not inherently prevent tree shaking.

## Barrel Modules

A barrel module aggregates exports:

```js
export {createUser} from "./users.js";
export {createOrder} from "./orders.js";
export {createInvoice} from "./invoices.js";
```

Consumers can write:

```js
import {createUser} from "./index.js";
```

A capable bundler can still follow the specific export and remove unused implementations.

However, barrel modules can complicate analysis and can introduce unnecessary module evaluation when imported modules
contain top-level side effects.

The problem is therefore not the existence of a barrel itself but the semantics of the modules participating in it.

## Side Effects

Side effects are the most important limitation on tree shaking.

Consider:

```js
console.log("module initialized");

export function createUser() {
    return {};
}
```

Even if `createUser` is never imported, evaluating the module produces observable output.

Removing the entire module could therefore change program behavior.

Tree shaking must distinguish unused declarations from modules whose evaluation itself is required.

## Side-Effect-Free Modules

A module is easier to tree shake when evaluating it produces no observable side effects other than creating its exports.

For example:

```js
export function add(a, b) {
    return a + b;
}
```

There is no top-level operation that obviously requires execution when `add` is unused.

By contrast:

```js
initializeGlobalState();

export function add(a, b) {
    return a + b;
}
```

contains a top-level side effect that may need to remain even if `add` is not referenced.

## Package Side Effects

Package metadata can communicate side-effect information to build tools.

Many JavaScript package ecosystems support metadata indicating whether modules or files are expected to contain side
effects.

A package may declare that its modules are side-effect-free or identify specific files that intentionally perform
initialization.

This information can enable more aggressive elimination while preventing removal of modules whose evaluation is
semantically important.

Such metadata must be accurate. Incorrectly declaring side-effect-free code can cause required initialization to
disappear from production builds.

## Top-Level Code

Top-level JavaScript executes when the module is evaluated.

```js
const configuration = loadConfiguration();

export function createApplication() {
    return configuration;
}
```

Even if `createApplication` is not referenced, `loadConfiguration()` may be observable.

Tree shaking cannot simply treat the module as a collection of independent declarations. Module evaluation itself has
semantics.

## Imports With Side Effects

JavaScript permits imports whose purpose is module initialization:

```js
import "./register-custom-elements.js";
```

The imported module may intentionally execute top-level code.

A build tool must preserve such imports when their side effects are required.

This pattern is common for polyfills, registrations, instrumentation, custom-element definitions, and global
initialization.

## Pure Functions

Pure functions are easier to reason about during tree shaking.

```js
export function square(value) {
    return value * value;
}
```

If the function is unused, removing its declaration does not produce an observable effect.

However, whether a function is pure is not determined solely by its appearance as a function declaration. The function's
body can contain calls, property accesses, exceptions, or other behavior.

## Pure Annotations

Some build tools support annotations that communicate that a particular expression is safe to eliminate when its result
is unused.

For example:

```js
const application = /* @__PURE__ */ createApplication();
```

The annotation tells compatible tooling that the expression can be treated as pure under the relevant assumptions.

Such annotations are optimization contracts. An incorrect annotation can cause observable behavior to be removed.

They should therefore only be used when the annotated operation is actually safe to eliminate when unused.

## Dead-Code Elimination

Tree shaking and dead-code elimination overlap but are not identical.

Tree shaking primarily analyzes module and symbol reachability.

Dead-code elimination can remove statements or expressions that are unreachable or whose results are provably
irrelevant.

For example:

```js
function calculate(value) {
    const unused = value * 100;
    return value + 1;
}
```

Removing `unused` is a dead-code elimination transformation.

Removing an unused exported function from a module is a tree-shaking transformation.

Modern build tools commonly perform both.

## Tree Shaking and Minification

Tree shaking reduces the amount of code.

Minification reduces the representation of the code that remains.

For example, tree shaking may remove:

```js
export function unused() {
    return 42;
}
```

while minification may transform:

```js
function calculateTotal(price, quantity) {
    return price * quantity;
}
```

into:

```js
function calculateTotal(t, e) {
    return t * e
}
```

A production build commonly uses both techniques.

Tree shaking therefore operates primarily on code reachability, while minification operates primarily on code
representation and local transformations.

## Tree Shaking and Bundling

Bundling combines modules into deployment artifacts.

Tree shaking determines which portions of those modules need to remain.

The two processes are conceptually distinct but commonly implemented together by modern bundlers.

A bundler can analyze the module graph, eliminate unreachable code, and emit one or more optimized chunks.

## Tree Shaking and Code Splitting

Code splitting divides the application into separately loaded chunks.

```js
const editor = await import("./editor.js");
```

The dynamically imported module can become a separate chunk.

Tree shaking can still operate within the statically analyzable portions of that chunk.

This means an application can simultaneously use tree shaking to remove unused code and code splitting to avoid
downloading code until it is required.

## Dynamic Imports

Dynamic imports introduce runtime loading:

```js
const module = await import(path);
```

where `path` may be dynamically determined.

```js
const module = await import(`./locales/${locale}.js`);
```

A build tool may be able to recognize a finite set of possible modules and generate an appropriate chunk structure.

Completely arbitrary dynamic module resolution can be much harder to analyze statically.

Tree shaking effectiveness therefore depends on how much of the dynamic dependency structure the build tool can
determine ahead of time.

## CommonJS

CommonJS uses runtime-oriented module operations:

```js
const {createUser} = require("./users");
```

and can also perform dynamic loading:

```js
const module = require(moduleName);
```

The latter makes static reachability analysis significantly harder because the dependency cannot necessarily be
determined without executing the program.

Modern tooling can analyze many CommonJS patterns, but CommonJS generally provides less static information for tree
shaking than native ECMAScript modules.

## Property-Based Exports

Dynamic access can also complicate static analysis.

```js
const api = {
    createUser,
    deleteUser
};

export default api;
```

A consumer might write:

```js
import api from "./api.js";

api[methodName]();
```

The build tool may not know which property is required because `methodName` is determined at runtime.

Explicit static imports generally provide stronger information:

```js
import {createUser} from "./api.js";
```

The more dynamic the access pattern becomes, the less precisely the build system can determine reachability.

## Reflection

Reflection can make otherwise unused code observable.

```js
const methods = Object.keys(api);
```

If property existence itself is observable, removing an apparently unused method can change the result.

Likewise:

```js
Object.getOwnPropertyNames(object);
```

can observe object structure.

Tree shaking therefore has to consider whether declarations contribute to observable structure rather than merely
whether their return values are used.

## `eval`

Dynamic evaluation significantly restricts static analysis.

```js
eval("createUser()");
```

The build tool cannot generally determine all source-level references created through arbitrary runtime strings.

Identifier mangling and dead-code elimination can also interact badly with dynamically generated code.

Applications that rely on `eval` therefore reduce the assumptions available to static optimization tools.

## Function Constructor

The `Function` constructor creates code dynamically:

```js
const calculate = new Function("value", "return value * 2;");
```

The generated source is not represented as an ordinary static dependency in the module graph.

Tree shaking cannot generally reason about arbitrary generated source in the same way that it can reason about static
imports and exports.

## Global State

Global state can make side effects difficult to classify.

```js
globalThis.application = createApplication();
```

Even if no exported binding is imported, assigning to `globalThis` is observable.

Removing the corresponding module could therefore change application behavior.

Tree-shaking-friendly modules generally minimize implicit global mutation.

## Module Registration

Some libraries register behavior merely by being imported.

```js
registerPlugin();

export const plugin = createPlugin();
```

If a consumer does not explicitly reference `plugin`, the registration may still be required.

Such modules need to communicate their side-effect semantics correctly to the build system.

## Polyfills

Polyfills are a common example of intentional side-effect imports.

```js
import "./polyfills.js";
```

The imported module may modify global objects or install runtime behavior.

Removing it because none of its exports are referenced would break the intended application behavior.

Build configuration must therefore distinguish unused exports from required module initialization.

## CSS and Non-JavaScript Assets

Modern JavaScript build systems can import non-JavaScript resources:

```js
import "./application.css";
```

The import can have a build-time side effect even though there is no JavaScript value being consumed.

The bundler may interpret the import as an instruction to include another deployment asset.

Tree shaking must therefore be understood within the semantics of the complete build pipeline rather than as a
transformation applied only to isolated JavaScript functions.

## Library Design

Libraries intended for effective tree shaking should expose functionality through statically analyzable module exports.

Prefer:

```js
export function createUser() {
    return {};
}

export function createOrder() {
    return {};
}
```

over requiring consumers to import an opaque runtime object when independent elimination matters:

```js
export default {
    createUser,
    createOrder
};
```

The second form is not inherently incorrect, but it can make fine-grained reachability analysis more difficult depending
on how consumers access the object.

Library APIs should therefore consider tree-shaking behavior as part of packaging design.

## Package Entry Points

A package can expose multiple entry points:

```text
package
├── core
├── browser
└── server
```

The exact packaging mechanism is tool- and package-specific, but the architectural principle is that consumers should be
able to depend on an appropriate subset of the package.

Providing focused entry points can reduce the amount of code that must be considered by downstream builds.

## Conditional Exports

Package systems can provide different implementations for different environments.

For example, a package may expose browser and server implementations through package metadata.

This can allow a build tool to select the appropriate implementation before tree shaking.

The more accurately the package describes its environment-specific entry points, the less irrelevant code downstream
consumers need to process.

## TypeScript

TypeScript types are erased from ordinary runtime JavaScript output.

```ts
export function createUser(name: string): User {
    return {
        name
    };
}
```

The generated JavaScript contains no runtime representation of the `string` annotation or `User` type.

Tree shaking therefore operates on the emitted JavaScript and its module structure, although TypeScript-aware tooling
can participate in the broader build process.

## Type-Only Imports

TypeScript provides type-only imports:

```ts
import type {User} from "./user.js";
```

These imports do not represent runtime dependencies.

Keeping type dependencies separate from runtime dependencies gives build tooling clearer information about which modules
are actually needed at runtime.

## Side-Effect Detection

Determining whether code has side effects is one of the hardest parts of aggressive tree shaking.

Consider:

```js
const user = createUser();
```

Whether this can be removed when `user` is unused depends on whether `createUser()` is pure.

For example:

```js
function createUser() {
    return {};
}
```

is easier to classify than:

```js
function createUser() {
    console.log("created");
    return {};
}
```

The second function has an observable side effect.

Static analysis therefore has to reason about calls and their potential behavior.

## Getters

Getters can make apparently passive property access observable.

```js
const object = {
    get value() {
        console.log("read");
        return 42;
    }
};
```

Accessing `object.value` executes code.

A tree-shaking transformation that assumes property access is always passive could therefore change behavior.

## Proxies

Proxies make property operations dynamically interceptable.

```js
const object = new Proxy(
    {},
    {
        get(target, property) {
            console.log(property);
            return target[property];
        }
    }
);
```

This further limits assumptions about whether an operation can safely be removed.

Tree shaking therefore relies heavily on conservative semantic analysis when dynamic object behavior is possible.

## Class Static Initialization

Class definitions can execute observable initialization logic.

```js
class Application {
    static {
        initializeApplication();
    }
}
```

Removing the class because no instance is created could change behavior if the static initialization is required.

Modern JavaScript therefore contains additional forms of executable code that build tools must account for when
determining whether declarations are removable.

## Top-Level Await

ECMAScript modules can use top-level `await`:

```js
const configuration = await loadConfiguration();

export function createApplication() {
    return configuration;
}
```

Module evaluation now includes asynchronous behavior.

Even when an export appears unused, removing the module can alter dependency evaluation and timing.

Tree shaking must therefore account for module evaluation semantics rather than considering exports in isolation.

## Module Cycles

Modules can form dependency cycles:

```js
// a.js
import {valueB} from "./b.js";

export const valueA = valueB + 1;
```

```js
// b.js
import {valueA} from "./a.js";

export const valueB = valueA + 1;
```

Cycles interact with module initialization order and live bindings.

Tree shaking must preserve the semantics of the remaining module graph. Removing apparently unused declarations can be
unsafe if they participate in initialization or cycle behavior.

## Live Bindings

ES module imports are live bindings.

```js
import {count} from "./state.js";
```

The imported binding reflects updates to the exported binding.

A build tool cannot treat every imported value as an immutable copy.

Tree shaking and other optimizations must preserve the semantics of live bindings when transforming module code.

## Namespace Imports

Namespace imports expose a module namespace object:

```js
import * as users from "./users.js";
```

The consumer can access properties dynamically:

```js
users.createUser();
```

or:

```js
users[methodName]();
```

The latter is more difficult to analyze because the specific export may not be statically known.

Explicit named imports generally provide stronger reachability information.

## Reaching Through Higher-Order Functions

Higher-order code can make static usage analysis less obvious.

```js
export function createHandler() {
    return () => console.log("handled");
}
```

If the returned function is passed around dynamically, a build tool must track the relevant references through the
generated code.

This does not make tree shaking impossible, but it increases the complexity of the analysis.

## Dynamic Property Access

Dynamic property access can inhibit elimination:

```js
const method = "createUser";

api[method]();
```

A build tool may need to conservatively retain multiple properties if it cannot prove which one is required.

Explicit static property access provides more information:

```js
api.createUser();
```

This distinction can affect the granularity of removable code.

## Tree Shaking Granularity

Tree shaking can operate at different granularities depending on the build tool and source structure.

Possible units include:

* modules;
* exports;
* declarations;
* functions;
* variables;
* statements;
* expressions.

Fine-grained elimination generally requires more precise static analysis.

A module can therefore be partially retained rather than treated as an indivisible unit.

## Code Structure

Code organization affects tree-shaking effectiveness.

A module containing many independently exported, side-effect-free functions gives a build tool more opportunities for
selective elimination.

A module that performs extensive initialization and exposes one large runtime object can make elimination less precise.

This does not mean that every module should contain one function. Excessive fragmentation introduces its own costs in
dependency management, build complexity, and architectural cohesion.

## Tree Shaking and Architecture

Tree shaking works best when module boundaries correspond to meaningful dependency boundaries.

A clean dependency graph makes it easier for the build system to determine which functionality is required.

Poorly structured global state, implicit registration, dynamic loading, and broad runtime objects make reachability less
explicit.

Tree-shaking effectiveness is therefore partly an architectural property.

## Tree Shaking and Dependency Injection

Dependency injection can either support or complicate tree shaking depending on how implementations are selected.

Static construction:

```js
import {SqlUserRepository} from "./sql-user-repository.js";

const repository = new SqlUserRepository();
```

provides a clear dependency.

Dynamic registration:

```js
const repository = container.resolve("UserRepository");
```

can hide the concrete dependency from static analysis.

This does not mean dependency injection prevents tree shaking. Rather, runtime resolution can reduce the amount of
dependency information available to the build system.

## Tree Shaking and Plugin Systems

Plugin systems frequently depend on dynamic discovery.

```js
registerPlugin(createPlugin());
```

or:

```js
const plugin = await import(pluginName);
```

can make reachability less predictable.

A plugin architecture may intentionally retain dynamic loading because extensibility is more important than maximal
static elimination.

The architectural requirement should determine the trade-off rather than forcing every dependency into a statically
analyzable structure.

## Tree Shaking and Frameworks

Frameworks can expose APIs that are highly tree-shakeable when functionality is provided through independent exports.

For example:

```js
import {featureA} from "framework";
```

allows tooling to identify a narrower dependency than:

```js
import framework from "framework";
```

followed by broad runtime access.

Framework-specific build integrations can provide additional static metadata or transformations, but the underlying
principle remains static reachability.

## Tree Shaking and Side-Effect Imports

Side-effect imports should be explicit.

```js
import "./setup.js";
```

communicates that the module is imported for its evaluation rather than for a particular binding.

This makes the architectural intent clearer than relying on accidental execution of an apparently unused export.

## Common Failure Modes

One common failure is incorrectly declaring a package side-effect-free. If a required initialization module is removed,
the application can appear correct during development and fail only in the production build.

Another is assuming that every unused export can be deleted. The module containing the export may still have top-level
side effects.

Another is relying heavily on dynamic property access or runtime module names while expecting precise static
elimination.

Another is treating CommonJS and ESM as equally analyzable in all circumstances. Static analysis of CommonJS is often
possible, but arbitrary runtime `require()` calls are substantially harder to resolve.

Another is testing only source modules instead of the generated production artifact.

## Testing Tree-Shaken Builds

Production builds should be tested after tree shaking.

Tests should cover behavior that depends on:

* module initialization;
* registration;
* polyfills;
* global state;
* side effects;
* reflection;
* dynamically selected implementations;
* plugins;
* environment-specific entry points.

A source-level test can pass while an incorrectly configured production build removes required initialization.

## Debugging

Tree shaking can make production artifacts structurally different from development artifacts.

A function may no longer exist because it was proven unused, and module boundaries may disappear as a result of
bundling.

Source maps can help map generated code back to original source, but developers should still understand that the
deployed artifact may contain only a subset of the source program.

## Performance

Tree shaking primarily reduces application size.

Smaller artifacts can reduce transfer, parsing, compilation, and startup costs, particularly in browser environments.

The exact performance benefit depends on the amount of code removed, deployment compression, network conditions, runtime
parsing behavior, caching, and application startup characteristics.

Tree shaking is therefore most valuable when substantial amounts of otherwise unused code would reach the deployed
artifact.

## Build Cost

Static analysis is not free.

Large module graphs can require significant CPU and memory during the build.

More aggressive optimization can increase build time because the tool must perform more analysis and transformation.

Build systems should therefore balance artifact optimization against development feedback time and CI resource
consumption.

## Caching

Tree shaking interacts with caching through generated artifact identity.

A small source change can alter the generated dependency graph and therefore change a chunk's content hash.

Stable module boundaries and deterministic builds can improve cache behavior by limiting unnecessary invalidation.

The effect depends on the bundler's chunking strategy and the structure of the dependency graph.

## Code Splitting and Cache Stability

Combining tree shaking with code splitting can produce highly optimized deployment artifacts.

However, changing shared modules can invalidate multiple chunks.

Architecture should therefore consider not only how much code can be removed but also how dependencies are distributed
across long-lived and frequently changing artifacts.

## Security

Tree shaking is not a security mechanism.

Removing unused code can reduce the attack surface of a deployed artifact in some circumstances, but it does not
establish authorization, confidentiality, integrity, or trust.

Unused client-side code should not be treated as a security boundary.

Likewise, retaining or removing a module based on static analysis does not determine whether its underlying capability
is secure.

## Reproducible Builds

Tree-shaken artifacts should ideally be reproducible.

Given the same source, dependencies, build configuration, and environment, the build should produce equivalent generated
artifacts.

Deterministic output improves debugging, artifact verification, caching, and supply-chain auditing.

## Tree Shaking for Applications

Application builds generally have a controlled set of entry points and consumers.

The build system can therefore aggressively remove functionality that is not reachable from those entry points, provided
side effects and dynamic behavior are correctly modeled.

This makes tree shaking particularly effective for applications that consume large libraries but use only small portions
of their APIs.

## Tree Shaking for Libraries

Library authors have a different requirement.

They cannot remove exports merely because their own test application does not use them. Those exports may be required by
downstream consumers.

Instead, the library should publish statically analyzable modules and accurate package metadata so that downstream
application builds can eliminate unused portions.

Library packaging should therefore preserve the information needed for downstream tree shaking.

## Decision Criteria

Design for tree shaking when deployment size matters and the application or library can expose dependencies through
statically analyzable module boundaries.

Prefer ECMAScript modules and explicit imports and exports when practical.

Keep module-level initialization deliberate and minimal.

Document or correctly declare side effects.

Use explicit side-effect imports for modules whose evaluation is intentionally required.

Be cautious with dynamic module resolution, reflection, `eval`, global mutation, runtime registration, and dynamic
property access when fine-grained elimination is important.

Test the production build because tree shaking changes the generated artifact rather than the source code developers
normally inspect.

## Summary

Tree shaking is a build-time reachability optimization that removes unused JavaScript from deployment artifacts. It
relies primarily on static analysis of module dependencies, imports, exports, declarations, and side effects.

ECMAScript modules provide particularly strong information for this analysis because their dependency structure is
statically represented. CommonJS, dynamic imports, runtime property access, reflection, `eval`, plugin systems, global
state, and side-effectful initialization can make elimination less precise.

Tree shaking is distinct from minification, bundling, dead-code elimination, compilation, and code splitting, although
modern production build pipelines commonly combine all of them.

The central requirement is semantic correctness. Code can be removed only when the build system can establish that its
removal does not change required observable behavior. Effective tree shaking therefore depends not only on the build
tool but also on module architecture, side-effect discipline, dependency visibility, package design, and the
application's use of JavaScript's dynamic features.
