# Private Class Data

## Intent

Private Class Data encapsulates a class's state behind a separate private data representation so that the implementation
can prevent methods from directly modifying state that should remain stable after construction.

The pattern separates **mutable operational behavior** from **encapsulated data that should not be changed after
initialization**. Methods operate on the private data through controlled access rather than exposing the underlying
representation as ordinary mutable class state.

The primary goal is not merely to make fields inaccessible from outside the class. The goal is to protect state from
unintended mutation by structurally separating stable data from the class's mutable operational state.

## Problem

A class often contains data that is initialized once and should remain unchanged throughout the object's lifetime. At
the same time, the class may contain methods and other state that legitimately change as operations are performed.

When all of this state is represented as ordinary class fields, the implementation can accidentally create mutation
paths that violate the intended invariants.

For example:

```js
class Account {
    constructor(owner, currency, balance) {
        this.owner = owner;
        this.currency = currency;
        this.balance = balance;
    }

    deposit(amount) {
        this.balance += amount;
    }

    withdraw(amount) {
        if (amount > this.balance) {
            throw new Error("Insufficient funds");
        }

        this.balance -= amount;
    }
}
```

`balance` is intentionally mutable, while `owner` and `currency` may be intended to remain fixed. If the class exposes
ordinary writable properties, nothing in the representation itself prevents:

```js
account.owner = "Another Owner";
account.currency = "EUR";
```

The problem becomes more significant when a class has several values that collectively define an immutable configuration
or identity.

```js
class Renderer {
    constructor(width, height, pixelFormat, device) {
        this.width = width;
        this.height = height;
        this.pixelFormat = pixelFormat;
        this.device = device;
        this.frameCount = 0;
    }

    render(frame) {
        this.frameCount++;
        return this.device.render(frame);
    }
}
```

`width`, `height`, `pixelFormat`, and `device` may conceptually form stable configuration, while `frameCount` is
operational state.

If the stable data is represented directly as mutable properties, the class has to rely on conventions, accessors, or
discipline to preserve those invariants.

Private Class Data addresses this by placing the stable data behind a private representation and exposing only the
operations required to use it.

## Structure

The pattern separates a class into two conceptual categories of state.

**Private class data** contains values that should be protected from modification.

**Operational class state** contains values that methods are expected to modify during the object's lifetime.

The public class exposes behavior rather than exposing direct access to the private data representation.

A JavaScript implementation can use native private fields:

```js
class Renderer {
    #config;

    constructor(width, height, pixelFormat, device) {
        this.#config = Object.freeze({
            width,
            height,
            pixelFormat,
            device
        });

        this.frameCount = 0;
    }

    render(frame) {
        this.frameCount++;

        return this.#config.device.render(
            frame,
            this.#config.width,
            this.#config.height,
            this.#config.pixelFormat
        );
    }

    getDimensions() {
        return {
            width: this.#config.width,
            height: this.#config.height
        };
    }
}
```

The important property is not the specific use of `#config`. The important property is that the data representation is
protected from direct mutation and that the class controls how the data is accessed.

## Encapsulation

Private Class Data is fundamentally an encapsulation technique.

Encapsulation separates the representation of an object's state from the operations that manipulate or observe that
state.

However, ordinary encapsulation does not necessarily require this pattern.

A class can already encapsulate state through private fields:

```js
class Counter {
    #value = 0;

    increment() {
        this.#value++;
    }

    getValue() {
        return this.#value;
    }
}
```

This provides encapsulation, but the Private Class Data pattern becomes particularly relevant when the class has a
distinct set of data whose immutability or restricted mutation deserves explicit structural separation.

The distinction is therefore:

* **Encapsulation** is the general principle of hiding representation.
* **Private fields** are a language mechanism for implementing encapsulation.
* **Private Class Data** is a structural pattern for isolating protected class data, particularly stable data, from
  mutable operational behavior.

## Stable Data

The pattern is especially useful when some values are established during construction and should not change afterward.

Examples include:

* object identity;
* immutable configuration;
* initialization parameters;
* environment information;
* capabilities;
* immutable metadata;
* structural dimensions;
* protocol configuration;
* dependency references;
* domain identifiers.

For example:

```js
class Connection {
    #configuration;

    constructor(host, port, protocol) {
        this.#configuration = Object.freeze({
            host,
            port,
            protocol
        });
    }

    connect() {
        return openConnection(
            this.#configuration.host,
            this.#configuration.port,
            this.#configuration.protocol
        );
    }
}
```

The connection's operational behavior may change, but its configuration remains protected.

## Private Data Object

One common implementation is to group related private values into a dedicated private object.

```js
class UserSession {
    #data;

    constructor(userId, tenantId, permissions) {
        this.#data = Object.freeze({
            userId,
            tenantId,
            permissions: Object.freeze([...permissions])
        });

        this.authenticated = false;
    }

    authenticate() {
        this.authenticated = true;
    }

    getUserId() {
        return this.#data.userId;
    }

    getTenantId() {
        return this.#data.tenantId;
    }

    hasPermission(permission) {
        return this.#data.permissions.includes(permission);
    }
}
```

This creates a clear conceptual boundary between stable private data and mutable session state.

Grouping data can also make the intended invariant easier to understand. The private object represents one coherent
configuration or identity rather than a collection of unrelated fields.

## Native Private Fields

Modern JavaScript provides native private class elements using `#`.

```js
class Rectangle {
    #dimensions;

    constructor(width, height) {
        this.#dimensions = Object.freeze({
            width,
            height
        });
    }

    get area() {
        return this.#dimensions.width * this.#dimensions.height;
    }
}
```

Private fields are inaccessible outside the class body:

```js
const rectangle = new Rectangle(10, 20);

rectangle.#dimensions;
```

This is a syntax error.

Native private fields therefore provide actual language-level encapsulation rather than merely convention-based privacy.

## Private Class Data and Immutability

Private Class Data frequently works together with immutability.

The private field itself prevents external access:

```js
#config
```

Freezing the stored value prevents the class from accidentally modifying the configuration:

```js
this.#config = Object.freeze({
    host,
    port
});
```

These mechanisms solve different problems.

Private access controls **who can access the representation**.

Immutability controls **whether the representation can change**.

If nested structures exist, shallow freezing may not be sufficient.

```js
this.#config = Object.freeze({
    permissions: ["read", "write"]
});
```

The array itself remains mutable:

```js
this.#config.permissions.push("admin");
```

If the invariant requires deep immutability, nested structures must also be protected.

```js
this.#config = Object.freeze({
    permissions: Object.freeze(["read", "write"])
});
```

Alternatively, immutable data structures can be constructed so that mutation is impossible by design.

## Private Data and Getters

A getter can expose a value without exposing the underlying representation.

```js
class Product {
    #data;

    constructor(id, name, price) {
        this.#data = Object.freeze({
            id,
            name,
            price
        });
    }

    get id() {
        return this.#data.id;
    }

    get name() {
        return this.#data.name;
    }

    get price() {
        return this.#data.price;
    }
}
```

The getter provides controlled observation without providing a setter.

This is useful when callers need to inspect stable data but should not be able to replace it.

However, returning an object directly can still leak mutable internal state.

```js
get
metadata()
{
    return this.#data.metadata;
}
```

If `metadata` is mutable, callers may be able to mutate the object's internal representation indirectly.

The pattern therefore requires consideration of **representation exposure**, not merely field visibility.

## Defensive Copies

When private data contains mutable objects that must not be exposed, the class may return copies.

```js
class Configuration {
    #data;

    constructor(options) {
        this.#data = structuredClone(options);
    }

    get options() {
        return structuredClone(this.#data);
    }
}
```

This prevents callers from modifying the internal representation through an object reference.

For smaller structures, explicit copying may be preferable:

```js
get
dimensions()
{
    return {
        width: this.#data.width,
        height: this.#data.height
    };
}
```

The appropriate strategy depends on the data's size, structure, mutability, and performance requirements.

## Private Data and Constructor Initialization

Private Class Data is commonly initialized in the constructor because the constructor establishes the object's
invariant.

```js
class Request {
    #context;

    constructor(requestId, userId, timestamp) {
        this.#context = Object.freeze({
            requestId,
            userId,
            timestamp
        });
    }
}
```

After construction, methods can rely on the invariant that the private context exists and has the expected structure.

This makes the class easier to reason about because initialization and mutation responsibilities are separated.

## Private Data and Mutable Operational State

The strongest use case appears when a class has both immutable configuration and mutable runtime state.

```js
class Worker {
    #config;

    constructor(queue, concurrency) {
        this.#config = Object.freeze({
            queue,
            concurrency
        });

        this.running = false;
        this.activeJobs = 0;
    }

    start() {
        this.running = true;
    }

    stop() {
        this.running = false;
    }

    beginJob() {
        if (this.activeJobs >= this.#config.concurrency) {
            throw new Error("Concurrency limit reached");
        }

        this.activeJobs++;
    }

    endJob() {
        this.activeJobs--;
    }
}
```

The distinction is explicit:

* `#config` describes what the worker is configured to be.
* `running` and `activeJobs` describe what the worker is currently doing.

This separation reduces accidental mutation of configuration while allowing operational state to evolve.

## Closures as Private Class Data

Before native private fields, JavaScript commonly implemented private state through closures.

```js
function createCounter(initialValue) {
    let value = initialValue;

    return {
        increment() {
            value++;
        },

        getValue() {
            return value;
        }
    };
}
```

The data is inaccessible from outside the closure.

Closures remain a valid implementation technique when the object does not need to be a class or when per-instance
lexical privacy is desirable.

However, closure-based privacy changes the object model.

Methods are typically created per instance:

```js
function createUser(id) {
    let privateId = id;

    return {
        getId() {
            return privateId;
        }
    };
}
```

Native private fields allow instances to share prototype methods while maintaining private per-instance state:

```js
class User {
    #id;

    constructor(id) {
        this.#id = id;
    }

    getId() {
        return this.#id;
    }
}
```

Therefore, closures and private class fields are alternative implementation mechanisms rather than separate instances of
the same language feature.

## Symbols and Convention-Based Privacy

Older JavaScript implementations sometimes used naming conventions:

```js
class User {
    constructor(id) {
        this._id = id;
    }
}
```

The underscore communicates intent but provides no access restriction.

Likewise, symbols can make accidental access less likely:

```js
const id = Symbol("id");

class User {
    constructor(value) {
        this[id] = value;
    }
}
```

But symbols are not equivalent to native private fields. If the symbol is available, the property can still be accessed.

Private Class Data should therefore use actual encapsulation mechanisms when the invariant requires enforcement rather
than convention.

## TypeScript

TypeScript provides multiple privacy mechanisms with different runtime semantics.

```ts
class User {
    private readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}
```

`private` is primarily a TypeScript type-system restriction. Depending on compilation and runtime representation, the
generated JavaScript may still contain an ordinary property.

Native private fields provide runtime enforcement:

```ts
class User {
    #id: string;

    constructor(id: string) {
        this.#id = id;
    }

    getId(): string {
        return this.#id;
    }
}
```

`readonly` prevents assignment through the TypeScript type system but does not itself imply runtime immutability.

```ts
class Configuration {
    private readonly options: Options;

    constructor(options: Options) {
        this.options = options;
    }
}
```

The referenced `options` object can still be mutable unless the type and runtime representation prevent it.

Consequently, `private`, `readonly`, native `#` fields, and runtime immutability should not be treated as
interchangeable concepts.

## Data Representation Hiding

A central benefit of Private Class Data is representation hiding.

Suppose the original implementation stores configuration as separate values:

```js
class Service {
    #host;
    #port;
    #timeout;
}
```

The implementation may later change to:

```js
class Service {
    #configuration;
}
```

If clients interact only through behavior, this internal representation change does not affect them.

Representation hiding therefore protects the class from external dependencies on its internal state structure.

The same principle applies when replacing:

* objects with maps;
* arrays with indexed structures;
* primitive values with value objects;
* individual fields with configuration objects;
* mutable collections with immutable collections;
* local state with a state-management abstraction.

The public contract remains stable while the representation evolves internally.

## Controlled Mutation

Private Class Data does not necessarily mean that private data must be immutable.

A class can keep data private while providing controlled mutation.

```js
class Statistics {
    #data = {
        requests: 0,
        failures: 0
    };

    recordRequest() {
        this.#data.requests++;
    }

    recordFailure() {
        this.#data.failures++;
    }

    getSnapshot() {
        return {...this.#data};
    }
}
```

The important property is that callers cannot mutate the internal representation directly.

This allows the class to enforce invariants:

```js
recordFailure()
{
    this.#data.failures++;
}
```

rather than exposing:

```js
statistics.failures++;
```

The pattern is therefore broader than immutable data. It is fundamentally about controlled ownership of data
representation.

## Invariants

Private data is particularly valuable when state must satisfy invariants.

For example:

```js
class Range {
    #data;

    constructor(min, max) {
        if (min > max) {
            throw new Error("Invalid range");
        }

        this.#data = Object.freeze({min, max});
    }

    contains(value) {
        return value >= this.#data.min &&
            value <= this.#data.max;
    }
}
```

The constructor establishes:

```text
min <= max
```

If callers could mutate either value independently, they could violate that invariant.

Keeping both values private makes the invariant enforceable by the class.

## Private Class Data and Value Objects

The pattern works naturally with value-oriented domain objects.

```js
class Money {
    #data;

    constructor(amount, currency) {
        if (!Number.isInteger(amount)) {
            throw new TypeError("Amount must be an integer");
        }

        this.#data = Object.freeze({
            amount,
            currency
        });
    }

    get amount() {
        return this.#data.amount;
    }

    get currency() {
        return this.#data.currency;
    }

    add(other) {
        if (other.currency !== this.currency) {
            throw new Error("Currency mismatch");
        }

        return new Money(
            this.amount + other.amount,
            this.currency
        );
    }
}
```

The internal representation cannot be mutated into an invalid state.

This is particularly useful for domain values whose validity depends on relationships between multiple fields.

## Private Class Data and Dependencies

Dependencies can also be stored as private data when callers should not replace them.

```js
class OrderService {
    #repository;

    constructor(repository) {
        this.#repository = repository;
    }

    async findOrder(id) {
        return this.#repository.findById(id);
    }
}
```

However, dependency privacy should not be confused with dependency injection.

Dependency injection determines how the dependency is supplied.

Private Class Data determines how the dependency is represented and accessed after it has been supplied.

The two techniques are complementary.

## Private Class Data and API Design

Private data allows a class API to expose operations instead of state.

A state-oriented interface might expose:

```js
account.balance
account.status
account.creditLimit
```

A behavior-oriented interface might expose:

```js
account.getAvailableCredit()
account.isActive()
account.canWithdraw(amount)
```

The second approach gives the class greater control over how the result is calculated.

This can become important when internal representation changes.

For example, `balance` might initially be stored directly but later calculated from a transaction ledger. If consumers
depend on the property itself, the representation change becomes an API change.

If consumers depend on behavior such as `getBalance()`, the implementation can change internally.

## Public State Is Not Always Wrong

Private Class Data should not be interpreted as a requirement that every field in every class be private.

Public immutable values can be entirely appropriate:

```js
const point = Object.freeze({
    x: 10,
    y: 20
});
```

Similarly, a data-transfer object may intentionally expose its complete representation.

The pattern becomes useful when the class owns invariants, lifecycle, behavior, or representation that should not be
controlled directly by consumers.

Excessive privacy can make simple data structures unnecessarily complicated.

## Relationship to Encapsulation

Encapsulation is the broader design principle.

Private Class Data is one particular structural technique for applying that principle.

A class can be encapsulated without using a separate private data object:

```js
class Counter {
    #value = 0;
}
```

It can also use Private Class Data without making every field private.

```js
class Processor {
    #configuration;

    status = "idle";
}
```

The important question is whether the data has a reason to be protected as part of the object's invariant or
representation.

## Relationship to Information Hiding

Information hiding concerns what implementation decisions should remain hidden from clients.

Private Class Data provides a concrete mechanism for hiding state representation.

Information hiding is broader because it can hide:

* algorithms;
* data structures;
* dependencies;
* persistence mechanisms;
* protocol details;
* lifecycle management;
* implementation choices.

Private Class Data focuses specifically on state representation and ownership.

## Relationship to Immutable Objects

Immutable objects prevent state changes after construction.

Private Class Data does not inherently require immutability.

```js
class Counter {
    #value = 0;

    increment() {
        this.#value++;
    }
}
```

The private state changes, but external callers cannot directly mutate it.

Therefore:

**Private Class Data controls access to state; immutability controls whether state can change.**

They are complementary rather than synonymous.

## Relationship to Readonly Properties

A readonly property prevents reassignment through a particular interface or type system.

```ts
class User {
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}
```

This does not necessarily provide the same runtime encapsulation as a private field.

Private Class Data is concerned with ownership and representation hiding, not merely preventing assignment syntax.

## Relationship to Encapsulated Collections

Collections require particular care.

```js
class Registry {
    #items = [];

    add(item) {
        this.#items.push(item);
    }

    getItems() {
        return this.#items;
    }
}
```

This leaks the internal representation:

```js
registry.getItems().push(item);
```

A safer implementation returns a copy or immutable view:

```js
getItems()
{
    return [...this.#items];
}
```

The same principle applies to `Map`, `Set`, nested objects, and other mutable structures.

Private Class Data is ineffective if references to the private representation escape through the public API.

## Relationship to Singleton

Private Class Data is unrelated to Singleton.

Singleton controls instance multiplicity.

Private Class Data controls access to internal state.

A singleton may use private class data:

```js
class Configuration {
    static #instance;
    #data;
}
```

But neither pattern implies the other.

## Relationship to Flyweight

Flyweight shares intrinsic state among multiple objects.

Private Class Data hides state owned by an individual object.

The objectives are different.

Flyweight asks whether identical state can safely be shared.

Private Class Data asks how state should be encapsulated and protected.

A flyweight implementation can itself use private class data, but the patterns solve different problems.

## Relationship to Memento

Memento externalizes object state so that it can be saved and restored without exposing the object's internal
implementation.

Private Class Data does almost the opposite: it keeps the object's representation internal.

A class may use both patterns by creating controlled snapshots of private data:

```js
class Editor {
    #content;

    createMemento() {
        return structuredClone(this.#content);
    }
}
```

The memento is an intentionally controlled representation of state rather than an unrestricted reference to the object's
internal data.

## Relationship to Builder

Builder controls construction of complex objects.

Private Class Data controls state after construction.

They can be combined:

```js
const user = new UserBuilder()
    .withName("Alice")
    .withRole("admin")
    .build();
```

The resulting `User` can then protect its configuration using private class data.

## Relationship to Module Encapsulation

Modules can also hide state:

```js
const registry = new Map();

export function register(name, value) {
    registry.set(name, value);
}

export function resolve(name) {
    return registry.get(name);
}
```

The module-level `registry` is inaccessible directly to consumers.

Private Class Data applies the same broad principle at object scope.

The distinction is primarily one of ownership and lifecycle:

* module encapsulation protects module-level state;
* private class data protects instance-level state.

## Refactoring Toward Private Class Data

A class is a candidate when public or broadly accessible fields are being used to represent state that should be
controlled.

For example:

```js
class Account {
    constructor(balance, limit) {
        this.balance = balance;
        this.limit = limit;
    }
}
```

If the class must enforce:

```text
balance >= 0
balance <= limit
```

then direct field mutation is problematic.

A refactoring can move the representation behind private state:

```js
class Account {
    #data;

    constructor(balance, limit) {
        if (balance < 0 || balance > limit) {
            throw new Error("Invalid account state");
        }

        this.#data = {
            balance,
            limit
        };
    }

    getBalance() {
        return this.#data.balance;
    }

    deposit(amount) {
        const nextBalance = this.#data.balance + amount;

        if (nextBalance > this.#data.limit) {
            throw new Error("Credit limit exceeded");
        }

        this.#data.balance = nextBalance;
    }
}
```

The mutation path now goes through the class's behavior.

## Migration from Public Fields

A practical migration can proceed incrementally.

First identify which fields are true state and which are merely implementation details.

Next identify invariants associated with those fields.

Then make the representation private.

Finally replace direct consumers of the fields with behavioral methods or controlled accessors.

For example:

```js
service.timeout
```

may become:

```js
service.getTimeout()
```

or, when exposing a read-only property is appropriate:

```js
service.timeout
```

backed by:

```js
get
timeout()
{
    return this.#config.timeout;
}
```

The important change is not the syntax of access. It is that the underlying representation is no longer externally
mutable.

## Testing

Tests should primarily verify behavior and invariants rather than private representation.

Prefer:

```js
const account = new Account(100, 500);

account.deposit(50);

expect(account.getBalance()).toBe(150);
```

rather than tests that depend on the existence of:

```js
account.#data
```

Private implementation details should generally remain invisible to tests.

Tests should verify that invalid transitions are rejected:

```js
expect(() => account.withdraw(1000))
    .toThrow();
```

They should also verify that returned objects do not provide unintended mutation access.

```js
const config = service.getConfig();

config.timeout = 999999;

expect(service.getTimeout()).toBe(originalTimeout);
```

This tests representation isolation rather than the private field syntax itself.

## Performance Considerations

Private Class Data usually has no meaningful performance cost that should determine the design by itself.

The more relevant costs can arise from defensive copying.

For example:

```js
getItems()
{
    return [...this.#items];
}
```

creates a new array for every call.

For large collections, alternatives include:

* immutable collections;
* iterators;
* read-only views;
* controlled query methods;
* snapshots only when required;
* domain-specific accessors.

The correct design depends on the size and mutation characteristics of the data.

## Serialization

Native private fields are not serialized by ordinary JSON serialization.

```js
JSON.stringify(instance)
```

does not expose private fields.

If serialized state is required, the class must explicitly define what becomes part of its external representation.

```js
toJSON()
{
    return {
        id: this.#data.id,
        name: this.#data.name
    };
}
```

This is desirable when the serialized representation should be an intentional API rather than an accidental dump of
internal state.

## Persistence

Private Class Data should not be confused with persistence state.

A private field may contain data that ultimately needs to be persisted, but persistence should generally operate through
explicit mapping.

```js
class User {
    #data;

    toRecord() {
        return {
            id: this.#data.id,
            name: this.#data.name
        };
    }

    static fromRecord(record) {
        return new User(record.id, record.name);
    }
}
```

The database representation and in-memory representation can therefore evolve independently.

## Common Misuse

Private Class Data becomes counterproductive when every value is hidden without a clear reason.

A class such as:

```js
class Point {
    #x;
    #y;

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }
}
```

may be unnecessarily verbose if the object is simply intended to represent immutable coordinate data.

Likewise, adding private fields does not automatically produce good encapsulation.

```js
class User {
    #data;

    getData() {
        return this.#data;
    }
}
```

If `getData()` returns the complete mutable representation, the encapsulation boundary has effectively been bypassed.

Another misuse is using private data merely to hide poor design. A class with excessive responsibilities does not become
well designed simply because all of its fields are private.

## Excessive Getter APIs

A class that contains dozens of private fields and a getter for every field may simply have transformed public state
into an unnecessarily verbose API.

For example:

```js
getName()
getAddress()
getEmail()
getPhone()
getDepartment()
getRole()
getStatus()
```

If callers need the entire data structure and no invariants depend on controlled access, a value object or DTO may be a
better representation.

Private Class Data is strongest when hiding the representation provides meaningful protection or enables implementation
freedom.

## God Objects

Private fields do not solve excessive class responsibility.

```js
class Application {
    #database;
    #logger;
    #configuration;
    #cache;
    #httpClient;
    #mailer;
    #paymentService;
    #authentication;
    #authorization;
    #metrics;
}
```

Making all of these dependencies private does not make the class cohesive.

Private Class Data should support a coherent abstraction rather than conceal an oversized object.

## Data Ownership

A critical design question is:

**Who owns this state?**

If a class owns a value, it should generally control mutation of that value.

If ownership belongs to another component, copying or sharing may be appropriate depending on the contract.

For example:

```js
class Order {
    #items;

    constructor(items) {
        this.#items = [...items];
    }
}
```

Copying the input establishes that `Order` owns its internal collection.

Without the copy:

```js
this.#items = items;
```

the caller and the class may both retain references to the same mutable array.

Private visibility does not solve shared-reference ownership problems.

## Aliasing

Aliasing occurs when multiple parts of a program hold references to the same mutable object.

```js
const items = [];

const order = new Order(items);
```

If `Order` stores `items` directly, external code can modify the order indirectly:

```js
items.push(product);
```

The internal field remains private, but its referenced object is not exclusively owned.

Private Class Data therefore often needs to be combined with defensive copying or explicit ownership contracts.

## Architectural Use

Private Class Data is primarily an object-level design technique, but it has architectural implications because
encapsulated state reduces coupling to implementation details.

A component can expose stable behavioral contracts while keeping configuration, caches, internal indexes, connection
state, and other representation details private.

This is particularly useful at boundaries where implementation changes are expected.

Examples include:

* domain entities;
* application services;
* infrastructure clients;
* protocol implementations;
* connection managers;
* repositories;
* caches;
* parsers;
* stateful adapters.

The pattern should not be treated as an architectural boundary by itself. It contributes to encapsulation within a
component; module, package, service, and API boundaries still need to be designed separately.

## Private Class Data and Dependency Boundaries

A class can keep implementation dependencies private while exposing domain-level behavior.

```js
class CustomerService {
    #repository;

    constructor(repository) {
        this.#repository = repository;
    }

    async activateCustomer(id) {
        const customer = await this.#repository.findById(id);

        if (!customer) {
            throw new Error("Customer not found");
        }

        customer.activate();

        await this.#repository.save(customer);
    }
}
```

The repository reference is an implementation detail of the service.

Consumers depend on:

```js
activateCustomer(id)
```

rather than on the repository itself.

This reduces coupling between callers and internal infrastructure.

## Private Class Data and Change Isolation

One of the strongest benefits is containment of change.

If a class exposes:

```js
object.configuration.timeout
```

then callers become coupled to:

* the existence of `configuration`;
* its object structure;
* the `timeout` field;
* its mutability;
* its representation.

If the class exposes:

```js
object.getTimeout()
```

the implementation can change without requiring callers to change.

This makes private state particularly valuable at boundaries where representation is likely to evolve.

## Decision Criteria

Use Private Class Data when:

* some state must not be externally mutable;
* several fields collectively define an invariant;
* configuration should remain stable after initialization;
* the class owns mutable data structures;
* exposing representation would create coupling;
* implementation representation is likely to evolve;
* state transitions must be controlled by behavior;
* dependencies or internal resources should not be replaceable by callers;
* returned objects could otherwise expose internal mutable state.

Avoid it when:

* the object is intentionally a transparent data structure;
* no invariant depends on controlled access;
* the added abstraction only creates boilerplate;
* consumers legitimately need unrestricted data manipulation;
* a value object or DTO communicates the model more clearly;
* the real problem is excessive class responsibility rather than state exposure.

## Benefits

Private Class Data provides strong control over object state.

It prevents external code from directly changing protected representation when native private fields or equivalent
mechanisms are used.

It makes invariants enforceable by the owning class.

It reduces coupling to internal representation.

It allows implementation details to change without necessarily changing the public API.

It clarifies the distinction between stable configuration and mutable operational state.

It can improve ownership semantics for mutable collections and nested objects.

It works naturally with immutable objects, value objects, domain entities, dependency injection, and representation
hiding.

## Costs

The pattern can introduce additional boilerplate.

Private fields and accessors can make simple data structures unnecessarily verbose.

Defensive copying can increase CPU and memory usage.

Poorly designed getter APIs can expose the entire representation indirectly.

Private state can make debugging and introspection less convenient.

Using private fields everywhere can obscure whether a class actually has meaningful encapsulation responsibilities.

Private Class Data also does not solve cohesion, excessive responsibility, dependency management, or architectural
coupling by itself.

## Summary

Private Class Data protects a class's internal state by separating its representation from the public behavior through
which that state is accessed and changed.

Its most valuable application is the protection of data that establishes identity, configuration, ownership, or
invariants, particularly when that data exists alongside mutable operational state.

In JavaScript, native `#` private fields provide runtime-enforced encapsulation, while `Object.freeze()`, defensive
copying, immutable data structures, and controlled accessors can provide additional protection against mutation and
representation leakage.

The pattern should not be confused with encapsulation itself, readonly properties, immutability, closures, or
TypeScript's `private` modifier. Those are related mechanisms or concepts with different semantics.

The essential design rule is:

**A class should own and control state whose unrestricted mutation could violate its invariants or couple clients to its
implementation representation.**
