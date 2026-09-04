# Module Pattern

The Module Pattern is an organizational and encapsulation pattern in which related state, behavior, and implementation
details are grouped behind a controlled public interface while private implementation details remain inaccessible to
consumers. In JavaScript, the pattern is historically associated with closures and immediately invoked function
expressions (IIFEs), but the underlying design idea is broader: define a module boundary, keep internal representation
private, and expose only the operations and data that form the module's public contract.

The pattern predates native ECMAScript modules and was widely used before `import` and `export` became part of the
language. Modern JavaScript modules provide language-level support for many of the same architectural goals, so the
traditional Module Pattern is now less necessary for new code. Nevertheless, understanding it is important because it
explains closure-based encapsulation, the historical evolution of JavaScript module systems, and the distinction between
a module as a design boundary and a namespace as a naming boundary.

## Intent

The Module Pattern has several closely related purposes:

* Encapsulate implementation details.
* Protect internal state from direct external mutation.
* Expose a deliberately small public API.
* Group related data and behavior behind one abstraction.
* Control how consumers interact with internal state.
* Reduce global namespace pollution.
* Establish a stable dependency and ownership boundary.
* Allow implementation details to change without requiring consumers to know about them.

The essential property is not the syntax used to construct the module. The essential property is that the module
establishes a boundary between its public contract and its private implementation.

## The Problem

Without an explicit module boundary, related functionality can become distributed across global variables, unrelated
objects, and publicly accessible implementation details.

Consider a simple counter implemented as shared state:

```javascript
let count = 0;

function increment() {
    count += 1;
}

function decrement() {
    count -= 1;
}
```

The functions are globally reachable if defined in the global scope, and the state is directly accessible:

```javascript
count = 100;
```

The implementation therefore provides little protection against accidental mutation. Consumers also know that the
implementation uses a variable named `count`, creating unnecessary coupling to the internal representation.

The Module Pattern moves the state into a private lexical environment and exposes only the operations that are
intentionally part of the API.

```javascript
const counter = (() => {
    let count = 0;

    return {
        increment() {
            count += 1;
        },

        decrement() {
            count -= 1;
        },

        value() {
            return count;
        }
    };
})();
```

Consumers can use the public operations:

```javascript
counter.increment();
counter.increment();

console.log(counter.value());
```

but cannot directly access the lexical `count` variable:

```javascript
console.log(counter.count); // undefined
```

The important boundary is created by lexical scope and closure, not by the object returned from the function.

## Core Structure

A traditional Module Pattern implementation typically contains four conceptual parts:

* A private scope.
* Private state and implementation.
* Public functions that form the module interface.
* A returned or otherwise exposed public object.

The private scope is created using a function, commonly an IIFE:

```javascript
const userStore = (() => {
    const users = new Map();

    function addUser(user) {
        users.set(user.id, user);
    }

    function findUser(id) {
        return users.get(id);
    }

    return {
        addUser,
        findUser
    };
})();
```

`users`, `addUser`, and `findUser` are initially inside the module's private scope. Only the properties returned from
the IIFE become publicly reachable through `userStore`.

The returned functions retain access to the private lexical environment through closures. This gives the public API
controlled access to internal state without exposing the state itself.

## Private State

Private state is one of the primary reasons the historical Module Pattern was useful in JavaScript.

```javascript
const session = (() => {
    let token = null;

    function login(value) {
        token = value;
    }

    function logout() {
        token = null;
    }

    function isAuthenticated() {
        return token !== null;
    }

    return {
        login,
        logout,
        isAuthenticated
    };
})();
```

Consumers can change the state only through the exposed operations:

```javascript
session.login("abc");

console.log(session.isAuthenticated()); // true
```

There is no public `token` property to mutate directly.

This is stronger than merely placing state inside an object:

```javascript
const session = {
    token: null
};
```

The latter does not provide encapsulation because consumers can directly mutate `session.token`.

## Closure-Based Encapsulation

The traditional Module Pattern relies heavily on closures.

A closure allows a function to retain access to variables from its surrounding lexical environment after that
environment's creating function has finished executing.

```javascript
const createCounter = () => {
    let count = 0;

    return {
        increment() {
            count += 1;
        },

        value() {
            return count;
        }
    };
};

const counter = createCounter();
```

`count` is not a property of `counter`. It exists in the lexical environment captured by the returned functions.

This distinction matters because consumers cannot obtain the private variable merely by inspecting the returned object.

The closure therefore provides both state ownership and access control.

## Public API

A module should expose only the operations and data that consumers legitimately need.

```javascript
const calculator = (() => {
    function add(a, b) {
        return a + b;
    }

    function subtract(a, b) {
        return a - b;
    }

    function validateNumber(value) {
        if (typeof value !== "number") {
            throw new TypeError("Expected a number");
        }
    }

    return {
        add,
        subtract
    };
})();
```

`validateNumber` remains private because it is an implementation detail.

A smaller public API generally provides a stronger abstraction boundary. Consumers should depend on capabilities rather
than on the module's internal functions, variables, data structures, or execution strategy.

## Revealing Module Pattern

A common variation is the Revealing Module Pattern.

Instead of defining public functions directly in the returned object, the module defines all implementation functions
privately and then explicitly maps selected functions into the public API.

```javascript
const calculator = (() => {
    function add(a, b) {
        return a + b;
    }

    function subtract(a, b) {
        return a - b;
    }

    function validate(a, b) {
        if (typeof a !== "number" || typeof b !== "number") {
            throw new TypeError("Arguments must be numbers");
        }
    }

    return {
        add,
        subtract
    };
})();
```

The pattern is called "revealing" because the final return object reveals which internal functions are public.

The important design principle is explicit API selection. Internal implementation functions remain private unless
deliberately exposed.

The Revealing Module Pattern is therefore a variation of the Module Pattern rather than a fundamentally separate
architectural pattern.

## Module State and Module Identity

A module created once at application initialization normally has one persistent module instance.

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

Every consumer of `cache` accesses the same closure and therefore the same internal `Map`.

This can be useful for genuinely shared state such as:

* application configuration,
* registries,
* caches,
* metrics,
* shared coordination state,
* immutable constants.

However, persistent module state also creates lifetime and coupling implications. A module containing mutable state
effectively owns that state for the lifetime of the module instance.

The Module Pattern should therefore not be interpreted as an automatic justification for global mutable state.

## Factory-Based Modules

The same encapsulation technique can be used to create multiple independent module instances.

```javascript
function createCounter(initialValue = 0) {
    let count = initialValue;

    return {
        increment() {
            count += 1;
        },

        decrement() {
            count -= 1;
        },

        value() {
            return count;
        }
    };
}

const first = createCounter();
const second = createCounter(10);
```

Each invocation creates a separate lexical environment and therefore independent state.

This distinction is important:

* An immediately created module commonly provides one module instance.
* A module factory creates independent instances.
* A native ECMAScript module is normally evaluated once per module graph and cached by the module loader.

The Module Pattern itself does not require singleton semantics. Singleton-like behavior arises when one module instance
is created and shared.

## Module Pattern vs Namespace Pattern

The Module Pattern and Namespace Pattern can look similar because both can expose an object containing related
functionality.

Their purposes are different.

A namespace primarily organizes names under a common identifier:

```javascript
const App = {
    users: {},
    orders: {}
};
```

The properties are still publicly accessible.

A module can instead keep its implementation private:

```javascript
const users = (() => {
    const records = new Map();

    function add(user) {
        records.set(user.id, user);
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

The namespace answers the organizational question "Where is this name located?"

The module answers the encapsulation question "What does this component expose, and what does it keep private?"

A namespace can contain modules, and a module can expose a namespace-like public object, but the concepts should not be
conflated.

## Module Pattern vs Singleton

A module created once can behave like a Singleton because consumers share the same module instance.

However, Module and Singleton solve different problems.

The Module Pattern primarily establishes encapsulation and a public API.

The Singleton pattern primarily constrains instantiation so that one instance exists and provides a shared access point.

A module does not need to expose a constructor, prohibit instantiation, or implement an explicit singleton mechanism.

Therefore:

```text
Module → encapsulation boundary
Singleton → instance cardinality constraint
```

The distinction is architectural rather than syntactic. A module may have singleton-like lifetime without being designed
primarily around the Singleton pattern.

## Module Pattern vs Revealing Module Pattern

The Revealing Module Pattern is a structural variation of the Module Pattern rather than an unrelated pattern.

Both use a private scope and expose a controlled public API.

The distinction is primarily organizational:

* Traditional Module Pattern may define public methods directly in the returned object.
* Revealing Module Pattern defines implementation functions first and exposes selected functions through the return
  object.

The latter can make the public API particularly explicit.

## Module Pattern vs ES Modules

Modern JavaScript provides native ECMAScript modules:

```javascript
// math.js

const precision = 2;

function add(a, b) {
    return a + b;
}

export {add};
```

Consumers can import the public API:

```javascript
import {add} from "./math.js";
```

`precision` is not exported and therefore is not part of the module's public interface.

Native ECMAScript modules provide language-level support for concepts that historically required the Module Pattern.

They also provide capabilities that the traditional closure-based pattern does not naturally provide, including:

* static `import` and `export`,
* module dependency graphs,
* loader integration,
* static dependency analysis,
* tree-shaking support in compatible tooling,
* cyclic dependency handling defined by the module system,
* live bindings,
* top-level `await`,
* standardized module semantics.

For new JavaScript applications, native ECMAScript modules should generally be preferred over manually implemented
IIFE-based modules.

The historical Module Pattern remains useful when working with legacy JavaScript, isolated scripts, compatibility
constraints, or codebases where closure-based encapsulation is specifically appropriate.

## Module Pattern vs CommonJS

CommonJS also provides module boundaries:

```javascript
const fs = require("node:fs");

module.exports = {
    readFile
};
```

The CommonJS module system provides a module loader and exports mechanism, while the traditional Module Pattern is a
language-level coding technique based primarily on lexical scope and closures.

They can therefore coexist conceptually, but they are not the same mechanism.

A CommonJS module can internally use closure-based private state, and an ECMAScript module can similarly contain
unexported bindings.

## Encapsulation

The primary architectural value of the Module Pattern is information hiding.

Suppose a module internally stores users in a `Map`:

```javascript
const userRepository = (() => {
    const users = new Map();

    function add(user) {
        users.set(user.id, user);
    }

    function find(id) {
        return users.get(id);
    }

    return {
        add,
        find
    };
})();
```

The implementation can later change:

```javascript
const users = [];
```

or:

```javascript
const users = databaseConnection.createRepository();
```

without requiring consumers to know about the representation change, provided the public contract remains compatible.

This reduces representational coupling.

## Encapsulated Collections

Returning internal mutable collections directly defeats much of the module's encapsulation.

For example:

```javascript
const module = (() => {
    const users = [];

    return {
        getUsers() {
            return users;
        }
    };
})();
```

Consumers can mutate the internal state:

```javascript
module.getUsers().length = 0;
```

A safer interface can return a copy or immutable view:

```javascript
const module = (() => {
    const users = [];

    return {
        getUsers() {
            return [...users];
        }
    };
})();
```

For objects, defensive copying or immutable value representations may be necessary depending on the ownership model.

Encapsulation therefore concerns reachable object graphs, not merely lexical variable names.

## Controlled Mutation

A module can centralize mutation so that invariants are enforced in one place.

```javascript
const account = (() => {
    let balance = 0;

    function deposit(amount) {
        if (amount <= 0) {
            throw new RangeError("Amount must be positive");
        }

        balance += amount;
    }

    function withdraw(amount) {
        if (amount <= 0 || amount > balance) {
            throw new RangeError("Invalid withdrawal");
        }

        balance -= amount;
    }

    function getBalance() {
        return balance;
    }

    return {
        deposit,
        withdraw,
        getBalance
    };
})();
```

The consumer cannot bypass the validation by assigning directly to `balance`.

This makes the module boundary a natural location for enforcing invariants.

## Dependencies

A module can encapsulate dependencies as well as state.

```javascript
const service = (() => {
    const logger = console;

    function execute() {
        logger.log("Executing");
    }

    return {
        execute
    };
})();
```

However, hard-coding dependencies inside a module can make testing and composition more difficult.

A factory-based form allows dependencies to be injected:

```javascript
function createService({logger}) {
    function execute() {
        logger.log("Executing");
    }

    return {
        execute
    };
}
```

This preserves module-style encapsulation while improving dependency inversion and testability.

The Module Pattern therefore does not require dependencies to be globally acquired. The module boundary can instead be
combined with dependency injection.

## Initialization

An immediately invoked module executes its initialization logic when the module expression is evaluated.

```javascript
const configuration = (() => {
    const settings = loadConfiguration();

    return {
        get(key) {
            return settings[key];
        }
    };
})();
```

This creates eager initialization.

Eager initialization is appropriate when:

* initialization is cheap,
* the module is always required,
* initialization failure should occur immediately,
* the module's state must exist before consumers use it.

It can be problematic when initialization is expensive, asynchronous, environment-dependent, or unnecessary for most
consumers.

Lazy initialization can instead be implemented explicitly:

```javascript
const cache = (() => {
    let instance;

    function getCache() {
        if (!instance) {
            instance = new Map();
        }

        return instance;
    }

    return {
        get(key) {
            return getCache().get(key);
        },

        set(key, value) {
            getCache().set(key, value);
        }
    };
})();
```

The lifecycle semantics should be deliberate rather than accidental.

## Asynchronous Initialization

Traditional IIFE modules are naturally synchronous.

If initialization requires asynchronous work, forcing asynchronous behavior into module construction can complicate the
API.

A factory can instead make initialization explicit:

```javascript
async function createRepository(connectionFactory) {
    const connection = await connectionFactory();

    return {
        async find(id) {
            return connection.find(id);
        }
    };
}
```

Native ECMAScript modules also provide top-level `await`, which can be appropriate for module-level asynchronous
initialization when supported by the application's runtime and module graph.

The choice should be based on dependency lifecycle and startup requirements rather than on the desire to imitate older
module patterns.

## Public Constants

Modules can expose immutable configuration or constants:

```javascript
const math = (() => {
    const PI = Math.PI;

    function circleArea(radius) {
        return PI * radius ** 2;
    }

    return {
        PI,
        circleArea
    };
})();
```

If a public value must not be replaced, consumers can be given an immutable representation:

```javascript
const config = Object.freeze({
    environment: "production"
});
```

However, freezing the exported object does not automatically make every object reachable through it deeply immutable.

Deep immutability must be designed separately when required.

## Private Helper Functions

Private helpers are often where the Module Pattern provides the most practical benefit.

```javascript
const formatter = (() => {
    function normalize(value) {
        return value.trim().toLowerCase();
    }

    function validate(value) {
        if (typeof value !== "string") {
            throw new TypeError("Expected a string");
        }
    }

    function format(value) {
        validate(value);
        return normalize(value);
    }

    return {
        format
    };
})();
```

Consumers need to know only about `format`. The validation and normalization strategy remain implementation details.

This reduces the public API and makes internal refactoring easier.

## State Ownership

A module should have clear ownership of every mutable value it encapsulates.

If another component retains a reference to internal mutable state, the module may no longer control its invariants.

```javascript
const store = (() => {
    const state = {
        users: []
    };

    return {
        getState() {
            return state;
        }
    };
})();
```

The returned reference exposes the internal object graph.

A stronger boundary might return a snapshot:

```javascript
getState()
{
    return {
        users: [...state.users]
    };
}
```

The appropriate solution depends on whether consumers require a live view, snapshot, read-only view, or explicit
mutation API.

The important question is who owns mutation.

## Module-Level Caching

A module can naturally provide a private cache:

```javascript
const memoizedService = (() => {
    const cache = new Map();

    function get(key, factory) {
        if (!cache.has(key)) {
            cache.set(key, factory());
        }

        return cache.get(key);
    }

    return {
        get
    };
})();
```

This is useful when cached state belongs to the module's responsibility.

However, the Module Pattern itself does not turn caching into a module-specific concern. The cache remains a separate
behavioral mechanism. The module simply provides an encapsulation boundary around it.

Unbounded module-level caches can retain objects for the lifetime of the module and therefore create memory-retention
problems.

## Module-Level Registries

A module can also encapsulate a registry:

```javascript
const registry = (() => {
    const handlers = new Map();

    function register(name, handler) {
        handlers.set(name, handler);
    }

    function resolve(name) {
        return handlers.get(name);
    }

    return {
        register,
        resolve
    };
})();
```

The private `Map` prevents arbitrary consumers from manipulating the registry representation directly.

However, this does not make a registry a Module Pattern concept. Registry and Module solve different problems.

The module provides the encapsulation boundary; the registry provides name-to-object registration and lookup semantics.

## Testing

Encapsulation changes how tests interact with implementation details.

Private state should generally be tested through the public API rather than through attempts to access internal
variables.

```javascript
const counter = createCounter();

counter.increment();

console.assert(counter.value() === 1);
```

Tests that depend on private implementation details weaken the abstraction boundary and make refactoring harder.

If a private component becomes sufficiently complex that it requires extensive direct testing, that can indicate that
the component should become an independently testable module or service with its own explicit contract.

## Error Handling

Errors originating inside a module should generally preserve the module's abstraction boundary.

```javascript
const parser = (() => {
    function parse(input) {
        if (typeof input !== "string") {
            throw new TypeError("Input must be a string");
        }

        return JSON.parse(input);
    }

    return {
        parse
    };
})();
```

The module may translate low-level errors into domain-specific errors when exposing a higher-level contract.

This is especially useful when consumers should not depend on the implementation's underlying library or storage
mechanism.

## TypeScript

TypeScript supports the same architectural idea through ECMAScript modules and lexical visibility.

```typescript
const users = new Map<string, User>();

export function addUser(user: User): void {
    users.set(user.id, user);
}

export function findUser(id: string): User | undefined {
    return users.get(id);
}
```

`users` is module-private because it is not exported.

This is generally preferable to recreating the historical IIFE Module Pattern in modern TypeScript.

TypeScript's `private` modifier has a different scope and semantic purpose from module-level visibility:

```typescript
class UserService {
    private cache = new Map<string, User>();
}
```

Here the state is private to instances of the class rather than private to the module.

Module-level encapsulation and class-level encapsulation can therefore coexist.

## Module Pattern and Classes

A module and a class encapsulate different kinds of boundaries.

A module commonly encapsulates:

* module-wide state,
* helper functions,
* dependencies,
* constants,
* related exported operations.

A class commonly encapsulates:

* per-instance state,
* instance behavior,
* object identity,
* lifecycle,
* polymorphic behavior.

A module can contain classes:

```javascript
const users = (() => {
    class UserRepository {
        // ...
    }

    return {
        UserRepository
    };
})();
```

Likewise, a class can be exported from a module.

The choice should follow the ownership and lifecycle model rather than a preference for one syntax.

## Module Pattern and Functional Programming

The Module Pattern works naturally with functional techniques because closures can capture state while functions provide
the public interface.

```javascript
function createAccumulator(initial = 0) {
    let total = initial;

    return {
        add(value) {
            total += value;
            return total;
        },

        value() {
            return total;
        }
    };
}
```

The returned object is an interface over a private stateful computation.

A purely functional module may instead expose stateless functions and immutable values:

```javascript
export function add(a, b) {
    return a + b;
}
```

The Module Pattern does not require mutable private state.

## Dependency Direction

A module boundary should encourage consumers to depend on the module's public contract rather than on its internal
implementation.

Bad coupling looks conceptually like consumers knowing:

* which internal collection is used,
* which helper functions exist,
* how state is represented,
* which library performs the work,
* how initialization is implemented.

A stronger boundary exposes capabilities:

```javascript
repository.find(id);
repository.save(entity);
repository.remove(id);
```

The implementation may internally use a `Map`, database, remote API, or another storage mechanism without exposing that
decision.

This is the same information-hiding principle that applies to larger architectural components.

## Module Granularity

A module can be too large or too small.

A module containing unrelated responsibilities may become a dumping ground:

```javascript
const utilities = (() => {
    // formatting
    // authentication
    // database access
    // logging
    // HTTP requests
    // configuration
    // validation
})();
```

Encapsulation alone does not create cohesion.

Conversely, splitting every function into its own module can create excessive indirection and make the dependency graph
unnecessarily difficult to understand.

A useful module boundary generally corresponds to a cohesive responsibility, stable concept, or meaningful dependency
boundary.

## Common Uses

The Module Pattern is particularly appropriate for:

* encapsulated utilities,
* stateful services,
* private caches,
* registries,
* configuration access,
* legacy JavaScript libraries,
* browser scripts without native module support,
* reusable libraries with controlled public APIs,
* compatibility layers,
* small self-contained components.

Modern applications should normally use native ECMAScript modules to express file-level module boundaries.

## Common Misuse

The Module Pattern is frequently misused as a justification for putting arbitrary application state into globally shared
module variables.

For example:

```javascript
const applicationState = (() => {
    let state = {};

    return {
        getState() {
            return state;
        },

        setState(value) {
            state = value;
        }
    };
})();
```

Although the state is technically private, the module may still become a globally shared mutable dependency.

The fact that state is encapsulated does not make its ownership, lifecycle, concurrency, or architectural role correct.

Another misuse is exposing excessive getters and setters:

```javascript
return {
    getA,
    setA,
    getB,
    setB,
    getC,
    setC
};
```

This can merely hide public mutable state behind methods without creating meaningful invariants or abstraction.

A module should expose meaningful operations rather than mechanically exposing its entire representation.

## Module Explosion

A codebase can overuse modules to the point where every trivial operation becomes a separately named abstraction.

This produces:

* excessive files,
* unnecessary indirection,
* difficult navigation,
* large dependency graphs,
* fragmented responsibilities,
* weak conceptual boundaries.

The goal is not to maximize the number of modules. The goal is to establish useful boundaries around cohesive
responsibilities.

## Hidden Dependencies

A module that directly reaches into globals can be difficult to test and reuse.

```javascript
const service = (() => {
    function execute() {
        return window.someGlobalService.execute();
    }

    return {
        execute
    };
})();
```

The module appears encapsulated, but its behavior depends on ambient global state.

Dependency injection can make the dependency explicit:

```javascript
function createService(someService) {
    return {
        execute() {
            return someService.execute();
        }
    };
}
```

Encapsulation should reduce unnecessary coupling, not merely hide it.

## Lifetime and Resource Management

Module-scoped resources may live for the lifetime of the module.

```javascript
const connection = (() => {
    const socket = createSocket();

    return {
        send(message) {
            socket.send(message);
        }
    };
})();
```

If there is no cleanup operation, the resource may remain active for as long as the module remains reachable.

Long-lived modules therefore need explicit consideration of:

* initialization,
* cleanup,
* connection lifetime,
* event subscriptions,
* timers,
* caches,
* resource ownership.

A module boundary does not automatically solve lifecycle management.

## Memory and Performance

Closures retain references to values used by their enclosed functions.

```javascript
function createProcessor() {
    const largeDataSet = createLargeDataSet();

    return {
        process() {
            return processData(largeDataSet);
        }
    };
}
```

As long as the returned object remains reachable, the captured data can remain reachable as well.

This is normally the desired behavior when the state belongs to the module instance. It becomes a problem when a
long-lived module unintentionally retains large objects, request-specific data, event listeners, or other resources.

The Module Pattern therefore has no inherent performance advantage. Its primary benefit is encapsulation. Performance
characteristics depend on the captured state, allocation model, call frequency, and lifecycle.

## Security Considerations

Lexical privacy can prevent ordinary JavaScript consumers from directly accessing internal bindings, but it is not a
security boundary against privileged execution or compromised runtime environments.

For example:

```javascript
const secrets = (() => {
    const token = "secret";

    return {
        authenticate() {
            return verify(token);
        }
    };
})();
```

The token is inaccessible through ordinary property lookup on the returned object, but the module is still running
inside the same JavaScript environment.

The Module Pattern should therefore be treated as an encapsulation mechanism, not as a substitute for cryptographic
protection, process isolation, capability security, or secure secret management.

Secrets should not be embedded in client-side JavaScript merely because they are inside a closure.

## Refactoring Toward the Module Pattern

A codebase may benefit from introducing a module boundary when related functions and state are currently exposed
globally.

Before:

```javascript
let items = [];

function addItem(item) {
    items.push(item);
}

function removeItem(item) {
    items = items.filter(value => value !== item);
}
```

After:

```javascript
const itemStore = (() => {
    let items = [];

    function add(item) {
        items.push(item);
    }

    function remove(item) {
        items = items.filter(value => value !== item);
    }

    function getAll() {
        return [...items];
    }

    return {
        add,
        remove,
        getAll
    };
})();
```

The refactoring establishes ownership of the state and reduces the externally visible surface.

In modern code, the preferred destination will often be an ECMAScript module rather than an IIFE-based Module Pattern.

## Refactoring Away from the Module Pattern

A traditional closure-based module may become difficult to maintain when it accumulates:

* large amounts of mutable state,
* many unrelated responsibilities,
* complex lifecycle behavior,
* polymorphic behavior,
* multiple independent instances,
* complicated dependency graphs,
* extensive internal branching.

Possible refactorings include:

* splitting the module into multiple cohesive modules,
* extracting classes for object identity and instance state,
* extracting pure functions,
* introducing dependency injection,
* replacing the IIFE with a native ECMAScript module,
* extracting a factory when multiple instances are required,
* introducing explicit state-management abstractions where appropriate.

The correct refactoring depends on what responsibility has become overloaded.

## Relationship to Facade

A module can expose a Facade-like API, but Module and Facade address different concerns.

The Module Pattern establishes an encapsulation boundary around implementation and state.

A Facade provides a simplified interface to a potentially complex subsystem.

A module can contain a Facade, expose a Facade, or itself serve as a small Facade, but simplification of subsystem
interaction is not the defining property of the Module Pattern.

## Relationship to Namespace

Namespace organization and module encapsulation are complementary.

A namespace primarily groups identifiers under a naming hierarchy.

A module controls which implementation details are exposed.

Modern ECMAScript modules largely eliminate the need to use global namespace objects for application organization,
although namespaces can still be relevant for compatibility and API organization.

## Relationship to Private Class Data

Private Class Data encapsulates state associated with a class or object instance.

The Module Pattern encapsulates state associated with a module instance or module-level closure.

For example:

```javascript
const module = (() => {
    let configuration;

    return {
        configure(value) {
            configuration = value;
        }
    };
})();
```

The state belongs to the module.

By contrast:

```javascript
class Service {
    #configuration;

    configure(value) {
        this.#configuration = value;
    }
}
```

The state belongs to each `Service` instance.

The same information-hiding principle applies, but the ownership model differs.

## Relationship to Singleton

A module instantiated once can provide singleton-like shared state, but Singleton is not required for Module Pattern
usage.

A module factory demonstrates this clearly:

```javascript
function createStore() {
    let state = {};

    return {
        getState() {
            return state;
        }
    };
}
```

Each call creates a separate encapsulated instance.

Therefore module encapsulation and instance cardinality should remain conceptually separate.

## Relationship to Observer

A module may internally manage subscriptions:

```javascript
const events = (() => {
    const listeners = new Set();

    function subscribe(listener) {
        listeners.add(listener);

        return () => listeners.delete(listener);
    }

    function publish(value) {
        for (const listener of listeners) {
            listener(value);
        }
    }

    return {
        subscribe,
        publish
    };
})();
```

The module provides encapsulation around the listener collection, while Observer semantics provide the notification
behavior.

The Module Pattern is the encapsulation mechanism; Observer is the behavioral relationship.

## Relationship to Registry and Service Locator

A module can encapsulate a registry:

```javascript
const services = (() => {
    const registry = new Map();

    return {
        register(name, service) {
            registry.set(name, service);
        },

        resolve(name) {
            return registry.get(name);
        }
    };
})();
```

This does not make the registry a Module Pattern-specific concept.

Likewise, hiding a service locator inside a module does not eliminate the architectural drawbacks of service location.
The dependency remains implicit if consumers obtain services dynamically rather than receiving their dependencies
explicitly.

## Architectural Role

At application scale, modules provide boundaries around responsibilities, dependencies, and implementation details.

A well-designed module can:

* reduce dependency coupling,
* hide implementation choices,
* expose stable contracts,
* localize changes,
* establish ownership,
* support independent testing,
* improve reuse,
* provide a unit of composition.

At larger architectural scales, these boundaries often correspond to packages, libraries, services, components, or
bounded responsibilities rather than individual closure expressions.

The pattern therefore scales conceptually even when its original JavaScript syntax does not.

## Decision Criteria

Use the Module Pattern when a cohesive group of functionality needs a controlled public API and private implementation
state, particularly in legacy or non-module JavaScript environments.

Prefer native ECMAScript modules for modern JavaScript when the primary requirement is file-level dependency and export
organization.

Use a factory when multiple independent encapsulated instances are required.

Use a class when object identity, per-instance state, lifecycle, inheritance, or polymorphism is central to the design.

Use a namespace when the primary requirement is name organization rather than private state.

Use a Facade when the primary requirement is simplifying interaction with a complex subsystem.

Use a Singleton only when single-instance semantics are themselves a requirement.

Do not introduce the Module Pattern merely to make code look encapsulated. The boundary should represent a meaningful
responsibility, ownership model, or dependency boundary.

## Benefits

The Module Pattern provides:

* encapsulation through lexical scope,
* controlled public APIs,
* private state,
* implementation hiding,
* reduced global namespace pollution,
* centralized invariant enforcement,
* clear ownership of internal state,
* reduced representational coupling,
* support for closure-based stateful components,
* a useful migration concept toward modern module systems.

## Costs and Trade-offs

The Module Pattern can introduce:

* hidden state,
* implicit singleton-like lifetime,
* difficulty inspecting private state during debugging,
* resource-retention risks,
* challenges with dependency injection if dependencies are hard-coded,
* excessive module-level mutable state,
* overlarge modules,
* unnecessary complexity when native ECMAScript modules already provide the required boundary.

The most important trade-off is between encapsulation and transparency. A private implementation is valuable because
consumers cannot depend on it, but excessive hidden state can make lifecycle, dependencies, and runtime behavior harder
to understand.

## Recognizing the Pattern

Code is likely using the traditional Module Pattern when:

* related state and functions are enclosed inside a function scope,
* the function executes immediately or returns an API,
* private variables are accessed by returned functions through closures,
* only selected operations are exposed,
* consumers cannot directly access internal bindings,
* the public object represents the module's API.

For example:

```javascript
const cart = (() => {
    const items = [];

    function add(item) {
        items.push(item);
    }

    function remove(itemId) {
        const index = items.findIndex(item => item.id === itemId);

        if (index !== -1) {
            items.splice(index, 1);
        }
    }

    function total() {
        return items.reduce((sum, item) => sum + item.price, 0);
    }

    return {
        add,
        remove,
        total
    };
})();
```

The essential characteristic is not the IIFE itself. It is the controlled boundary between private implementation and
public capability.

## Summary

The Module Pattern encapsulates related state and behavior behind a controlled public interface. Its traditional
JavaScript implementation uses lexical scope and closures, often through an IIFE, to keep implementation details private
while exposing selected operations.

Its primary concern is encapsulation and ownership, not naming organization, singleton semantics, subsystem
simplification, or algorithm selection. Namespace Pattern organizes names; Singleton constrains instance cardinality;
Facade simplifies subsystem interaction; Strategy encapsulates interchangeable algorithms; Private Class Data protects
class-owned state.

The historical closure-based form remains important for understanding JavaScript architecture and legacy code, but
modern JavaScript generally expresses module boundaries using native ECMAScript modules. The underlying design principle
remains the same: expose a stable contract, hide implementation details, and make state ownership explicit.
