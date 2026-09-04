# Module Pattern vs ES Modules

The traditional Module Pattern and ECMAScript modules both provide mechanisms for organizing JavaScript code behind a
controlled boundary, but they operate at fundamentally different levels.

The Module Pattern is a programming pattern built primarily from lexical scope, closures, and object construction. The
traditional implementation commonly uses an immediately invoked function expression (IIFE) to create a private scope and
returns an object containing the public API.

ECMAScript modules, commonly called ES modules or ESM, are a standardized language and runtime module system. They
provide explicit `import` and `export` declarations, module-scoped bindings, a module dependency graph, live bindings,
standardized loading semantics, and integration with JavaScript engines and tooling.

The two approaches share the goal of separating implementation from public API, but they should not be treated as
equivalent mechanisms.

## Core Distinction

The fundamental distinction is:

**The Module Pattern is a coding pattern for encapsulation; ES modules are a language-level module system.**

A traditional Module Pattern implementation might look like:

```javascript
const calculator = (() => {
    function add(a, b) {
        return a + b;
    }

    function subtract(a, b) {
        return a - b;
    }

    return {
        add,
        subtract
    };
})();
```

The private scope is created by the function invocation. `add` and `subtract` become accessible because they are
returned from that function.

The equivalent modern structure is:

```javascript
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}
```

The ES module's module scope is provided by the language itself. Export declarations determine which bindings are part
of the module's public interface.

The visible result can look similar, but the underlying semantics are different.

## Module Pattern

The traditional Module Pattern creates encapsulation manually.

```javascript
const counter = (() => {
    let count = 0;

    function increment() {
        count += 1;
    }

    function value() {
        return count;
    }

    return {
        increment,
        value
    };
})();
```

`count` exists inside the lexical environment created by the IIFE. The returned functions close over that environment.

The pattern therefore combines:

* lexical scope,
* closures,
* object construction,
* explicit API exposure.

The JavaScript language does not recognize the resulting object as a module. It is simply an object whose methods happen
to close over private state.

## ES Modules

ES modules provide module semantics directly:

```javascript
let count = 0;

export function increment() {
    count += 1;
}

export function value() {
    return count;
}
```

The `count` binding belongs to the module's scope and is not exported.

Another module can consume the public API:

```javascript
import {increment, value} from "./counter.js";
```

The imported bindings are established by the module system rather than by properties on a returned object.

This distinction is important because ESM imports and exports are part of the language's module linkage semantics rather
than ordinary object property access.

## Module Scope

A traditional Module Pattern obtains private scope through a function:

```javascript
const module = (() => {
    const privateValue = 42;

    return {
        getValue() {
            return privateValue;
        }
    };
})();
```

An ES module has module scope intrinsically:

```javascript
const privateValue = 42;

export function getValue() {
    return privateValue;
}
```

No wrapper function is required.

Both prevent `privateValue` from becoming a property of the global object merely because it is declared at the top level
of the module boundary.

The difference is that ESM scope is recognized and managed by the module system itself.

## Public API

The Module Pattern usually constructs its public API explicitly:

```javascript
return {
    add,
    subtract
};
```

The returned object is the public interface.

ES modules use exports:

```javascript
export {
    add,
    subtract
};
```

The module namespace exposed to importers is managed by the module system rather than being an ordinary manually
constructed API object.

This means that ESM provides a stronger separation between module linkage and object property access.

## Import and Export Semantics

Traditional Module Pattern dependencies are normally ordinary JavaScript references:

```javascript
const service = (() => {
    const repository = userRepository;

    function find(id) {
        return repository.find(id);
    }

    return {
        find
    };
})();
```

The dependency must already be available in the surrounding environment.

ES modules declare dependencies explicitly:

```javascript
import {userRepository} from "./user-repository.js";

export function find(id) {
    return userRepository.find(id);
}
```

This makes the dependency relationship visible in the source code.

The module loader and runtime can construct the dependency graph from these declarations.

## Static Dependency Structure

One of the major advantages of ESM is that `import` and `export` are statically analyzable.

```javascript
import {parse} from "./parser.js";
import {validate} from "./validator.js";
```

The dependency declarations are part of the module's syntax.

By contrast, traditional Module Pattern dependencies may be obtained dynamically:

```javascript
const service = (() => {
    const dependency = globalThis.services.parser;

    return {
        execute(value) {
            return dependency.parse(value);
        }
    };
})();
```

The dependency is not visible as a module-level import declaration.

This distinction is important for:

* dependency analysis,
* bundling,
* tree shaking,
* static tooling,
* architecture visualization,
* refactoring,
* build optimization.

## Live Bindings

ES module imports are bindings rather than copies of exported values.

Consider:

```javascript
// counter.js

export let count = 0;

export function increment() {
    count += 1;
}
```

Another module can import the binding:

```javascript
import {count, increment} from "./counter.js";

console.log(count);

increment();

console.log(count);
```

The imported binding reflects the exported binding's current value.

This is fundamentally different from returning an ordinary property value from a Module Pattern API:

```javascript
const counter = (() => {
    let count = 0;

    return {
        count,
        increment() {
            count += 1;
        }
    };
})();
```

Here `counter.count` contains the value that was assigned to the property when the object was created. Updating the
private `count` variable does not automatically update that property.

A method or getter can provide dynamic access:

```javascript
return {
    get count() {
        return count;
    },

    increment
};
```

But that is manually implemented object behavior rather than ESM live-binding semantics.

## Exported Bindings Are Not Ordinary Properties

An ES module's exports should not be conceptualized simply as properties on a returned object.

For example:

```javascript
export const value = 42;
```

does not mean that the module executed:

```javascript
return {
    value: 42
};
```

The module system maintains bindings and module namespace semantics.

This distinction becomes particularly important with:

* live bindings,
* cyclic dependencies,
* re-exports,
* namespace imports,
* default exports,
* module evaluation order.

The Module Pattern is fundamentally object-oriented at its public boundary; ESM is fundamentally module-system-oriented.

## Module Namespace Objects

A namespace import provides access to a module's exported bindings:

```javascript
import * as math from "./math.js";
```

The resulting `math` value is a module namespace object.

It can resemble a Module Pattern's returned API object:

```javascript
const math = (() => {
    function add(a, b) {
        return a + b;
    }

    function subtract(a, b) {
        return a - b;
    }

    return {
        add,
        subtract
    };
})();
```

However, the semantics are different.

A module namespace object represents the module system's exports and their bindings. It is not an ordinary API object
manually created by the module implementation.

This distinction matters when reasoning about identity, mutation, live bindings, and interoperability.

## Initialization

A traditional IIFE Module Pattern executes immediately:

```javascript
const service = (() => {
    initialize();

    return {
        execute
    };
})();
```

The function invocation is ordinary JavaScript execution.

ES modules have standardized module instantiation and evaluation semantics.

```javascript
const configuration = loadConfiguration();

export function getConfiguration() {
    return configuration;
}
```

The module is instantiated as part of the module graph and evaluated according to module-system rules.

This means that ESM initialization is not simply equivalent to invoking an IIFE at the point where its source appears.

## Top-Level Execution

Both approaches can execute initialization code at module scope.

Traditional:

```javascript
const module = (() => {
    const connection = createConnection();

    return {
        query
    };
})();
```

ESM:

```javascript
const connection = createConnection();

export function query() {
    return connection.query();
}
```

The ESM form removes the explicit wrapper while retaining module-level state.

The important difference is that ESM initialization participates in the module graph and its evaluation semantics.

## Top-Level Await

Native ECMAScript modules support top-level `await`:

```javascript
const configuration = await loadConfiguration();

export function getConfiguration() {
    return configuration;
}
```

The traditional synchronous IIFE Module Pattern does not have equivalent native module semantics.

An asynchronous IIFE can approximate the concept:

```javascript
const module = await (async () => {
    const configuration = await loadConfiguration();

    return {
        getConfiguration() {
            return configuration;
        }
    };
})();
```

but this introduces ordinary promise semantics into the program rather than integrating with a standardized module
dependency graph in the same way as top-level `await`.

ESM therefore provides a language-level mechanism for asynchronous module evaluation.

## Dependency Cycles

ES modules have defined semantics for cyclic dependencies.

```javascript
// a.js
import {b} from "./b.js";

export const a = "a";
```

```javascript
// b.js
import {a} from "./a.js";

export const b = "b";
```

The module system constructs and evaluates the dependency graph according to ESM's specified instantiation and
evaluation rules.

A traditional Module Pattern does not have an equivalent module graph.

Dependencies are ordinary runtime values:

```javascript
const a = (() => {
    const dependency = b;

    return {
        // ...
    };
})();
```

Initialization order and availability are governed by ordinary JavaScript execution.

This can make circular dependencies particularly fragile when modules are manually assembled through global variables or
script ordering.

## Global Scope

Traditional Module Patterns were often introduced specifically to avoid polluting the global scope.

Without a module boundary:

```javascript
var App = {};
var users = [];
var orders = [];
```

With a traditional module:

```javascript
const users = (() => {
    const records = [];

    function add(user) {
        records.push(user);
    }

    return {
        add
    };
})();
```

The private implementation is not globally exposed.

ES modules provide a stronger language-level solution because top-level declarations belong to the module scope rather
than being placed on the global object.

```javascript
const records = [];

export function add(user) {
    records.push(user);
}
```

No manually created global namespace object is necessary.

## Global Namespace Objects

The traditional Module Pattern is often combined with a namespace object:

```javascript
const App = {
    users: (() => {
        const records = [];

        function add(user) {
            records.push(user);
        }

        return {
            add
        };
    })()
};
```

This was historically useful when all application code was loaded through ordinary scripts.

ES modules generally eliminate the need for this global organizational mechanism.

```javascript
import {add} from "./users.js";
```

The module graph provides the organization and dependency relationships.

## Dependency Injection

The traditional Module Pattern can use dependency injection:

```javascript
function createUserService(repository, logger) {
    function createUser(user) {
        logger.info("Creating user");
        return repository.save(user);
    }

    return {
        createUser
    };
}
```

ES modules do not inherently replace dependency injection.

A module can import stable dependencies:

```javascript
import {repository} from "./repository.js";
import {logger} from "./logger.js";

export function createUser(user) {
    logger.info("Creating user");
    return repository.save(user);
}
```

If runtime substitution is required, the architecture may still use factories, dependency injection, explicit
parameters, or composition roots.

ESM provides dependency declaration; it does not automatically provide dependency configuration.

## Singleton-Like Behavior

A traditional Module Pattern created once often behaves like a singleton:

```javascript
const cache = (() => {
    const values = new Map();

    return {
        get(key) {
            return values.get(key);
        },

        set(key, value) {
            values.set(key, value);
        }
    };
})();
```

ES modules also commonly provide module-scoped state that is shared by importers:

```javascript
const values = new Map();

export function get(key) {
    return values.get(key);
}

export function set(key, value) {
    values.set(key, value);
}
```

However, this does not make ESM equivalent to the Singleton Pattern.

The sharing is a consequence of module evaluation and module identity. Singleton is concerned explicitly with
constraining object instantiation.

## Multiple Instances

A traditional Module Pattern can be converted into a factory:

```javascript
function createCounter(initialValue = 0) {
    let count = initialValue;

    function increment() {
        count += 1;
    }

    function value() {
        return count;
    }

    return {
        increment,
        value
    };
}
```

An ES module can also export a factory:

```javascript
export function createCounter(initialValue = 0) {
    let count = initialValue;

    function increment() {
        count += 1;
    }

    function value() {
        return count;
    }

    return {
        increment,
        value
    };
}
```

The two concerns are therefore orthogonal.

ESM determines module boundaries and linkage. The factory determines object-instance creation.

## API Organization

A traditional Module Pattern often groups its public API into one object:

```javascript
return {
    create,
    update,
    remove
};
```

ESM can expose individual named bindings:

```javascript
export function create() {
}

export function update() {
}

export function remove() {
}
```

Consumers can choose specific exports:

```javascript
import {create, update} from "./users.js";
```

This gives ESM a more explicit relationship between source declarations and public API.

The API can also be aggregated through a namespace import:

```javascript
import * as users from "./users.js";
```

The resulting interface resembles the conceptual API object of the Module Pattern without requiring the module to
construct that object manually.

## Default Exports

ESM also supports default exports:

```javascript
export default function createUser(user) {
    // ...
}
```

Consumers can import the default:

```javascript
import createUser from "./users.js";
```

The traditional Module Pattern does not have an equivalent language-level default export concept.

A returned object can certainly contain one primary operation:

```javascript
const users = (() => {
    function createUser(user) {
        // ...
    }

    return createUser;
})();
```

but that is simply returning a function, not using module-system semantics.

## Re-Exports

ES modules allow one module to expose declarations from another:

```javascript
export {createUser} from "./user-service.js";
export {createOrder} from "./order-service.js";
```

This allows public APIs to be composed across module boundaries without manually constructing forwarding objects.

A traditional Module Pattern can manually forward operations:

```javascript
const api = (() => {
    return {
        createUser: userService.createUser,
        createOrder: orderService.createOrder
    };
})();
```

Again, the conceptual result may be similar, but ESM provides standardized module linkage rather than ordinary object
composition.

## Tree Shaking

ESM's static import/export structure enables bundlers to perform static analysis and, where appropriate, eliminate
unused exports.

For example:

```javascript
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}
```

A bundler can determine which exports are imported by consumers.

A traditional Module Pattern creates an ordinary runtime object:

```javascript
const math = (() => {
    function add(a, b) {
        return a + b;
    }

    function subtract(a, b) {
        return a - b;
    }

    return {
        add,
        subtract
    };
})();
```

Static analysis can still optimize JavaScript in many circumstances, but the pattern does not provide the same
standardized static module structure.

Tree shaking is therefore an ecosystem and tooling advantage of ESM rather than a property of the Module Pattern.

## Code Splitting

ES modules integrate naturally with dynamic imports:

```javascript
const module = await import("./feature.js");
```

This allows applications and bundlers to treat modules as independently loadable units.

The traditional Module Pattern has no equivalent built-in loading mechanism. It depends on the surrounding environment
to load and execute the script containing the pattern.

Dynamic loading can still be implemented around traditional scripts, but it is not provided by the pattern itself.

## Dynamic Imports

ESM supports:

```javascript
const {createUser} = await import("./users.js");
```

The import operation participates in the module system and returns the module namespace object.

A traditional Module Pattern might be dynamically loaded as a script and then accessed through a global:

```javascript
await loadScript("/users.js");

globalThis.users.createUser();
```

This approach requires a global coordination mechanism and therefore introduces coupling that native modules avoid.

## Browser Usage

Traditional Module Patterns were especially common when browser applications were composed from ordinary `<script>`
elements:

```html

<script src="users.js"></script>
<script src="orders.js"></script>
<script src="application.js"></script>
```

Execution order and global variables often established dependencies.

Modern browsers support native module scripts:

```html

<script type="module" src="./application.js"></script>
```

Dependencies can then be expressed directly:

```javascript
import {createUser} from "./users.js";
```

This removes the need to use global variables as the primary dependency mechanism.

## Node.js

Modern Node.js supports ECMAScript modules alongside CommonJS.

An ESM file can use:

```javascript
import {readFile} from "node:fs/promises";
```

and export:

```javascript
export async function loadData(path) {
    return readFile(path, "utf8");
}
```

The traditional Module Pattern can still be used inside either module system:

```javascript
const parser = (() => {
    function parse(input) {
        return JSON.parse(input);
    }

    return {
        parse
    };
})();
```

The pattern is therefore independent of whether the containing environment uses ESM or CommonJS, although ESM generally
provides the more direct modern module abstraction.

## CommonJS

CommonJS also provides a module system:

```javascript
function add(a, b) {
    return a + b;
}

module.exports = {
    add
};
```

This can resemble the public object returned by the Module Pattern.

The distinction remains important:

* Module Pattern uses ordinary JavaScript scope and closures.
* CommonJS uses a runtime module system.
* ESM uses standardized language-level module syntax and semantics.

The fact that CommonJS and the Module Pattern both expose objects does not make them the same abstraction.

## Encapsulation

Both patterns can hide implementation details.

Traditional:

```javascript
const service = (() => {
    const cache = new Map();

    function find(id) {
        return cache.get(id);
    }

    return {
        find
    };
})();
```

ESM:

```javascript
const cache = new Map();

export function find(id) {
    return cache.get(id);
}
```

In both cases, `cache` is not directly exported.

The important difference is that ESM provides encapsulation as part of the module system, whereas the traditional
pattern constructs encapsulation from lexical scope.

## Mutable Exports

ESM permits exported bindings to be mutable within the module:

```javascript
export let status = "idle";

export function start() {
    status = "running";
}
```

Consumers can observe the exported binding but cannot reassign the imported binding itself.

```javascript
import {status} from "./service.js";

// status = "stopped"; // invalid
```

A traditional API object can expose a mutable property:

```javascript
const service = (() => {
    let status = "idle";

    return {
        status
    };
})();
```

This does not provide equivalent live-binding behavior.

An accessor can approximate dynamic read access:

```javascript
return {
    get status() {
        return status;
    }
};
```

but again, this is ordinary object behavior.

## Encapsulation of Mutable Objects

Neither approach automatically protects objects that are explicitly exposed.

ESM:

```javascript
export const config = {
    retries: 3
};
```

The binding cannot be reassigned by an importer, but the exported object itself can still be mutable:

```javascript
config.retries = 10;
```

The same issue exists with a Module Pattern:

```javascript
return {
    config
};
```

Therefore module encapsulation and object immutability are separate concerns.

If the exported object should not be mutated, its mutability must be constrained explicitly.

## Circular State and Initialization Hazards

The module system provides defined semantics for cycles, but cyclic dependencies can still produce difficult designs.

```javascript
// a.js
import {valueB} from "./b.js";

export const valueA = valueB;
```

```javascript
// b.js
import {valueA} from "./a.js";

export const valueB = valueA;
```

Even though the module graph is valid from a dependency-system perspective, evaluation order and temporal availability
can create runtime problems.

The traditional Module Pattern has analogous problems when manually ordering script execution, but without ESM's formal
module graph semantics.

The architectural recommendation in both cases is to avoid unnecessary cyclic dependencies.

## Error Isolation

A traditional module can translate implementation errors before exposing them:

```javascript
const repository = (() => {
    function find(id) {
        try {
            return database.find(id);
        } catch (error) {
            throw new RepositoryError("Unable to find entity", {
                cause: error
            });
        }
    }

    return {
        find
    };
})();
```

ESM provides no automatic error translation. An ES module still needs explicit error handling:

```javascript
export function find(id) {
    try {
        return database.find(id);
    } catch (error) {
        throw new RepositoryError("Unable to find entity", {
            cause: error
        });
    }
}
```

The difference between the systems is therefore not error semantics but module linkage and encapsulation.

## Testing

ESM generally improves test architecture by making dependencies explicit in the source graph.

```javascript
import {calculateTotal} from "./pricing.js";
```

The test can import the public API directly.

Traditional Module Pattern code may require access to a returned object or factory:

```javascript
const calculator = createCalculator();
```

Both approaches can be tested effectively.

The key principle remains the same: tests should normally interact with the public contract rather than depend on
private implementation details.

## Mocking and Dependency Replacement

Traditional modules that acquire dependencies from globals can be difficult to isolate:

```javascript
const service = (() => {
    const repository = globalThis.repository;

    return {
        find(id) {
            return repository.find(id);
        }
    };
})();
```

Dependency injection provides a better seam:

```javascript
function createService(repository) {
    function find(id) {
        return repository.find(id);
    }

    return {
        find
    };
}
```

ESM similarly does not automatically make mocking easy. Static imports create real module dependencies, and replacing
them for tests is generally a concern of the test runner, bundler, loader, or architecture.

The module system should therefore not be confused with dependency injection.

## Performance

Neither approach should be selected primarily for raw runtime performance.

A traditional Module Pattern introduces function invocation and closure behavior, but modern JavaScript engines optimize
many such constructs effectively.

ESM provides module-level semantics and can enable build-time optimizations such as tree shaking and code splitting.

Performance depends more significantly on:

* allocation,
* object shape,
* closure lifetime,
* module initialization,
* dependency graph size,
* bundling,
* code splitting,
* runtime behavior,
* caching,
* data structures.

The primary reason to prefer ESM is its semantics and ecosystem integration, not a blanket runtime-speed guarantee.

## Memory and Lifetime

Traditional closure-based modules can retain captured state:

```javascript
const cache = (() => {
    const values = new Map();

    return {
        set(key, value) {
            values.set(key, value);
        }
    };
})();
```

The `Map` remains reachable through the closure as long as the module object remains reachable.

ESM can similarly retain module-scoped state:

```javascript
const values = new Map();

export function set(key, value) {
    values.set(key, value);
}
```

Imported bindings keep the module reachable according to the module system's lifetime semantics.

Neither approach eliminates the need to design cache lifetime, event listener cleanup, resource ownership, or memory
retention carefully.

## API Stability

Both patterns can establish stable public contracts.

Traditional:

```javascript
return {
    create,
    find,
    remove
};
```

ESM:

```javascript
export {
    create,
    find,
    remove
};
```

In both cases, consumers may begin depending on the exposed operations.

The major difference is that ESM makes the module boundary part of the language and tooling model, which makes the
public dependency graph easier to analyze and maintain.

## Migration from Module Pattern to ESM

A traditional module:

```javascript
const userService = (() => {
    function create(user) {
        // ...
    }

    function find(id) {
        // ...
    }

    return {
        create,
        find
    };
})();
```

can often be migrated directly:

```javascript
export function create(user) {
    // ...
}

export function find(id) {
    // ...
}
```

Consumers change from:

```javascript
userService.create(user);
userService.find(id);
```

to:

```javascript
import {create, find} from "./user-service.js";

create(user);
find(id);
```

Alternatively, consumers can preserve a namespace-like style:

```javascript
import * as userService from "./user-service.js";

userService.create(user);
userService.find(id);
```

This can make incremental migration easier.

## Preserving a Public API Object

If consumers require an object-like API, ESM can explicitly construct one:

```javascript
export function create(user) {
    // ...
}

export function find(id) {
    // ...
}

export const userService = {
    create,
    find
};
```

However, this should not be done automatically merely to imitate the old pattern.

Named exports are often a cleaner representation when consumers do not actually require an object.

## Migrating Private State

Traditional:

```javascript
const store = (() => {
    const records = new Map();

    function add(record) {
        records.set(record.id, record);
    }

    function find(id) {
        return records.get(id);
    }

    return {
        add,
        find
    };
})();
```

ESM:

```javascript
const records = new Map();

export function add(record) {
    records.set(record.id, record);
}

export function find(id) {
    return records.get(id);
}
```

The closure is no longer necessary because the ES module itself supplies the private scope.

This is one of the simplest and most common migrations.

## Migrating Private Helpers

Traditional:

```javascript
const parser = (() => {
    function normalize(input) {
        return input.trim();
    }

    function parse(input) {
        return JSON.parse(normalize(input));
    }

    return {
        parse
    };
})();
```

ESM:

```javascript
function normalize(input) {
    return input.trim();
}

export function parse(input) {
    return JSON.parse(normalize(input));
}
```

The helper remains private because it is not exported.

This demonstrates that the Revealing Module Pattern's central idea maps naturally onto ESM: private declarations remain
unexported, while public declarations are exported.

## Migration of Dependencies

Traditional code may depend on globals:

```javascript
const service = (() => {
    const logger = globalThis.logger;

    function execute() {
        logger.info("Executing");
    }

    return {
        execute
    };
})();
```

An ESM migration can make the dependency explicit:

```javascript
import {logger} from "./logger.js";

export function execute() {
    logger.info("Executing");
}
```

This improves dependency visibility and allows tooling to understand the relationship.

If runtime dependency injection is required, the module can instead export a factory.

## When the Module Pattern Is Still Appropriate

The traditional Module Pattern can still be reasonable when:

* maintaining legacy JavaScript,
* supporting environments where native modules are unavailable or intentionally avoided,
* creating a small closure-based abstraction,
* working inside an existing architecture built around IIFEs,
* deliberately creating an encapsulated function instance,
* demonstrating closure-based encapsulation.

It should not be selected merely because it predates ESM or because it can imitate an import/export boundary.

## When ES Modules Should Be Preferred

ES modules should generally be preferred for modern JavaScript when the requirement is:

* organizing source files,
* declaring dependencies,
* exposing public APIs,
* composing libraries,
* supporting static analysis,
* enabling tree shaking,
* enabling code splitting,
* integrating with modern build tooling,
* expressing module-level encapsulation,
* using standardized JavaScript module semantics.

The native module system is the correct abstraction when the problem is actually module management.

## Common Misconceptions

One misconception is that an ES module is simply a Module Pattern implemented by the JavaScript engine. It is not. ESM
has its own specification-level semantics for module instantiation, linking, evaluation, bindings, namespace objects,
imports, exports, and dependency graphs.

Another misconception is that the Module Pattern provides stronger privacy than ESM. Both can keep internal bindings
inaccessible through the public interface, but they achieve this through different mechanisms.

A third misconception is that ESM automatically creates a Singleton. Module identity and evaluation behavior can result
in shared module state, but Singleton is a separate design concept concerned with object instance cardinality.

Another misconception is that ESM replaces dependency injection. It provides explicit module dependencies, but runtime
configurability and substitutability remain architectural concerns.

## Comparison

| Concern                              | Module Pattern                         | ES Modules                                                   |
|--------------------------------------|----------------------------------------|--------------------------------------------------------------|
| Primary abstraction                  | Programming pattern                    | Language/runtime module system                               |
| Encapsulation                        | Closures and lexical scope             | Module scope                                                 |
| Public API                           | Returned object or function            | `export` declarations                                        |
| Dependencies                         | Ordinary references or injected values | `import` declarations and dynamic `import()`                 |
| Dependency graph                     | Not inherent                           | Built into module semantics                                  |
| Static analysis                      | Limited by pattern                     | Strongly supported                                           |
| Live bindings                        | Must be implemented manually           | Native                                                       |
| Cyclic dependencies                  | Ordinary runtime behavior              | Defined module graph semantics                               |
| Global pollution                     | Avoided manually                       | Module scope avoids ordinary global exposure                 |
| Tree shaking                         | Not inherent                           | Strong tooling support                                       |
| Code splitting                       | External mechanism                     | Integrates naturally with dynamic imports/tooling            |
| Top-level await                      | Not inherent                           | Native                                                       |
| Multiple instances                   | Factory required                       | Factory required                                             |
| Singleton semantics                  | Possible but not inherent              | Shared module state possible but not Singleton by definition |
| Private helpers                      | Closure scope                          | Unexported bindings                                          |
| Private state                        | Closure scope                          | Module scope                                                 |
| Tooling integration                  | Depends on environment                 | Native ecosystem support                                     |
| Historical use                       | Very common before ESM                 | Modern standard                                              |
| Recommended for new application code | Usually no                             | Generally yes                                                |

## Architectural Distinction

The Module Pattern is primarily a local encapsulation technique.

ES modules are architectural building blocks for source-level dependency structure.

A Module Pattern can encapsulate a single cohesive component:

```javascript
const validator = (() => {
    function validate(value) {
        // ...
    }

    return {
        validate
    };
})();
```

An ESM architecture can establish relationships among many components:

```javascript
import {validate} from "./validator.js";
import {repository} from "./repository.js";

export function createUser(user) {
    validate(user);
    return repository.save(user);
}
```

The latter makes the dependency structure visible at the file and module level.

This distinction becomes increasingly important as systems grow.

## Relationship to the Revealing Module Pattern

The Revealing Module Pattern is especially close to ESM conceptually because both distinguish implementation
declarations from explicitly exposed declarations.

Traditional:

```javascript
const service = (() => {
    function validate() {
        // private
    }

    function execute() {
        validate();
    }

    return {
        execute
    };
})();
```

ESM:

```javascript
function validate() {
    // private
}

export function execute() {
    validate();
}
```

The conceptual mapping is straightforward:

* private closure binding → unexported module binding,
* revealed function → exported binding,
* returned API object → module export surface,
* IIFE-created module instance → evaluated ES module.

The semantics are nevertheless different, particularly around dependency linkage, live bindings, module identity, and
evaluation.

## Relationship to Namespace Pattern

The traditional Module Pattern is often combined with namespaces because older browser applications lacked native module
organization.

ESM generally removes the need for global namespace objects.

Instead of:

```javascript
App.Users.create(user);
```

modern code can use:

```javascript
import {create} from "./users.js";

create(user);
```

or:

```javascript
import * as Users from "./users.js";

Users.create(user);
```

The second form resembles namespace-style organization while remaining inside the ESM module system.

Namespace and module therefore remain distinct concepts: namespace organizes names; ESM establishes module boundaries
and dependency semantics.

## Relationship to CommonJS

CommonJS and ESM are both module systems.

The traditional Module Pattern is neither.

CommonJS:

```javascript
const add = (a, b) => a + b;

module.exports = {
    add
};
```

ESM:

```javascript
export function add(a, b) {
    return a + b;
}
```

Module Pattern:

```javascript
const math = (() => {
    function add(a, b) {
        return a + b;
    }

    return {
        add
    };
})();
```

The similar API shape can obscure the fundamental distinction.

CommonJS and ESM define how modules are loaded and linked. The Module Pattern defines how a developer can create
encapsulation using ordinary language features.

## Relationship to Closures

Closures are the core mechanism behind traditional Module Pattern privacy.

```javascript
function createModule() {
    let state = 0;

    return {
        increment() {
            state += 1;
        }
    };
}
```

ESM does not require an explicit closure to preserve module-private state:

```javascript
let state = 0;

export function increment() {
    state += 1;
}
```

The module scope itself provides the required lexical boundary.

Closures remain useful inside ES modules, but they are no longer required merely to implement module-level privacy.

## Decision Criteria

Use the traditional Module Pattern when maintaining legacy code, deliberately using closure-based encapsulation, or
creating a local stateful abstraction where a function-based factory is the natural model.

Use ES modules when the requirement is source-level module organization, dependency declaration, API exposure, reusable
library construction, static analysis, or modern JavaScript application architecture.

Use a factory when multiple independent instances are required regardless of whether the implementation lives inside a
traditional Module Pattern or an ES module.

Use a class when per-instance identity, lifecycle, polymorphism, or object-oriented state is central.

Use a namespace only when name organization is the actual requirement rather than encapsulation.

Do not use the traditional Module Pattern simply to recreate capabilities already provided by native ESM.

## Summary

The traditional Module Pattern and ES modules share an important design goal: separating a component's public contract
from its private implementation. They differ fundamentally in how that boundary is established.

The Module Pattern uses ordinary JavaScript mechanisms, especially lexical scope, closures, and returned objects. It is
a programming pattern.

ES modules use standardized language and runtime semantics. They provide module scope, explicit imports and exports,
dependency graphs, live bindings, cyclic dependency semantics, dynamic loading, top-level `await`, and strong
integration with modern JavaScript tooling.

The traditional pattern remains useful for understanding legacy JavaScript and closure-based encapsulation, but it
should not normally be used to recreate a module system in modern code.

The practical rule is straightforward: **use the Module Pattern when the problem is closure-based encapsulation; use ES
modules when the problem is module organization and dependency management.**

The Revealing Module Pattern is particularly close conceptually to ESM because both explicitly distinguish private
implementation from the public API. The critical difference is that ESM makes that boundary a first-class part of the
language rather than constructing it manually through a closure and returned object.
