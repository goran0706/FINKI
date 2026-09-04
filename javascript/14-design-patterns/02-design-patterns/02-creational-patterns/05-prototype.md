# Prototype

Prototype is a creational design pattern that creates new objects by copying an existing object, known as the prototype,
rather than constructing the new object from scratch.

The pattern is useful when creating an object directly is expensive, complicated, or dependent on runtime configuration,
and an existing configured instance provides a useful starting point for new instances.

Prototype is particularly important in JavaScript because the language itself is built around prototype-based object
delegation. However, JavaScript's built-in prototype mechanism and the GoF Prototype pattern are related concepts, not
identical concepts. The language feature defines how objects inherit behavior; the design pattern uses an existing
object as the basis for creating another object.

## Intent

The intent of Prototype is to create new objects by copying an existing object's structure and state.

Instead of requiring the caller to know how a complex object is constructed:

```javascript
const document = new Document(configuration);
```

the caller can create a new object from an existing configured instance:

```javascript
const document = prototype.clone();
```

The prototype encapsulates the state and configuration that should serve as the starting point for future objects.

## Problem

Consider an object with expensive or complicated initialization:

```javascript
class Report {
    constructor(configuration) {
        this.configuration = loadConfiguration(configuration);
        this.templates = loadTemplates(configuration);
        this.formatters = initializeFormatters(configuration);
    }
}
```

Creating every report independently may repeat expensive initialization.

If many reports share most of the same configuration, an existing configured report can serve as a prototype:

```javascript
const prototype = new Report(configuration);

const report = prototype.clone();
```

The new report starts from the prototype's state without requiring the caller to reconstruct that state manually.

Prototype therefore moves the complexity of initial configuration into an existing instance.

## Prototype Structure

The essential roles are:

| Role               | Responsibility                              |
|--------------------|---------------------------------------------|
| Prototype          | Defines or provides the cloning operation   |
| Concrete Prototype | Implements cloning for a particular product |
| Client             | Obtains new objects by cloning prototypes   |

A separate Prototype interface is optional in JavaScript.

The essential relationship is between an existing instance and the new instance derived from it.

## Basic Implementation

A simple JavaScript implementation can expose `clone()`:

```javascript
class Document {
    constructor(title, metadata) {
        this.title = title;
        this.metadata = metadata;
    }

    clone() {
        return new Document(
            this.title,
            {...this.metadata}
        );
    }
}
```

Usage:

```javascript
const prototype = new Document(
    "Architecture",
    {
        author: "Engineering",
        version: 1
    }
);

const document = prototype.clone();

document.title = "Implementation";
```

The cloned object is a distinct instance:

```javascript
console.log(document === prototype); // false
```

The prototype and clone share the same initial values while remaining separate objects.

## Shallow Copy

A shallow copy copies the top-level properties while preserving references to nested objects.

For example:

```javascript
const prototype = {
    name: "Document",
    metadata: {
        author: "Engineering"
    }
};

const clone = {
    ...prototype
};
```

The top-level objects are different:

```javascript
console.log(clone === prototype); // false
```

but the nested object is shared:

```javascript
console.log(clone.metadata === prototype.metadata); // true
```

Consequently:

```javascript
clone.metadata.author = "Alice";

console.log(prototype.metadata.author);
```

also observes the modification through the shared nested reference.

Shallow cloning is correct only when shared nested state is intentional or immutable.

## Deep Copy

A deep copy creates independent nested structures.

For data composed entirely of structured-clone-compatible values, JavaScript provides `structuredClone()`:

```javascript
const clone = structuredClone(prototype);
```

For example:

```javascript
const prototype = {
    name: "Document",
    metadata: {
        author: "Engineering"
    }
};

const clone = structuredClone(prototype);

clone.metadata.author = "Alice";

console.log(prototype.metadata.author); // "Engineering"
```

Deep cloning is not automatically the correct implementation of Prototype. The appropriate cloning semantics depend on
which state should be shared and which state must be independent.

## Custom Clone Semantics

A Prototype implementation can explicitly define which properties are copied:

```javascript
class User {
    constructor({
                    name,
                    preferences,
                    permissions
                }) {
        this.name = name;
        this.preferences = preferences;
        this.permissions = permissions;
    }

    clone() {
        return new User({
            name: this.name,
            preferences: {
                ...this.preferences
            },
            permissions: [
                ...this.permissions
            ]
        });
    }
}
```

This is often preferable to generic deep cloning because the class knows the ownership semantics of its state.

The clone operation can therefore preserve immutable shared dependencies while copying mutable instance state.

## Prototype with Immutable State

If part of the prototype's state is immutable, clones can safely share it.

```javascript
class Configuration {
    constructor(options) {
        this.options = Object.freeze({
            ...options
        });
    }

    clone() {
        return new Configuration(this.options);
    }
}
```

The cloned instances can reference the same immutable configuration without creating unnecessary copies.

This is often more efficient than blindly deep-cloning the entire object graph.

## Prototype and Object Identity

A clone must normally be a distinct object:

```javascript
const clone = prototype.clone();

console.log(clone === prototype); // false
```

The purpose is to create a new instance based on an existing one.

If the operation simply returns the original object:

```javascript
clone()
{
    return this;
}
```

it is not cloning. It is aliasing the existing instance.

This distinction becomes especially important when the resulting object is mutable.

## Prototype and Shared References

Not every reference should necessarily be copied.

Consider:

```javascript
class EditorState {
    constructor(document, schema) {
        this.document = document;
        this.schema = schema;
    }
}
```

If `schema` is immutable and shared across all instances, cloning can preserve the reference:

```javascript
clone()
{
    return new EditorState(
        structuredClone(this.document),
        this.schema
    );
}
```

The document is copied because it is instance-specific mutable state. The schema is shared because it is immutable
configuration.

Prototype therefore requires explicit ownership semantics rather than a universal rule that every reference must be
recursively copied.

## Prototype and Constructors

Prototype is particularly useful when construction requires information that already exists in an initialized object.

Without Prototype:

```javascript
const configuration = loadConfiguration();
const formatter = initializeFormatter(configuration);
const renderer = initializeRenderer(configuration);

const document = new Document(
    configuration,
    formatter,
    renderer
);
```

With Prototype:

```javascript
const prototype = createConfiguredDocument();

const document = prototype.clone();
```

The caller does not need to know how the configured instance was assembled.

This is useful when the initialization procedure is complex or when the initial configuration is discovered dynamically.

## Prototype and Expensive Initialization

A classic use case is reducing repeated initialization.

```javascript
class Parser {
    constructor(grammar) {
        this.grammar = compileGrammar(grammar);
    }

    clone() {
        return new Parser(this.grammar);
    }
}
```

The intention is that `grammar` represents reusable compiled state.

Whether this actually improves performance depends on what `compileGrammar()` and the copying operation do. Prototype
should therefore be justified by the actual cost characteristics of the object rather than assumed to be faster.

## Prototype and Runtime Configuration

Prototype can be useful when objects are configured dynamically at runtime.

```javascript
const productionPrototype = createClientPrototype({
    environment: "production",
    timeout: 5000,
    retries: 3
});
```

Individual instances can then be derived:

```javascript
const clientA = productionPrototype.clone();
const clientB = productionPrototype.clone();

clientA.setTenant("tenant-a");
clientB.setTenant("tenant-b");
```

The prototype contains the shared baseline configuration while each clone can receive instance-specific modifications.

## Prototype Registries

A Prototype Registry stores named prototype instances and allows clients to clone them.

```javascript
class PrototypeRegistry {
    #prototypes = new Map();

    register(name, prototype) {
        this.#prototypes.set(name, prototype);
    }

    create(name) {
        const prototype = this.#prototypes.get(name);

        if (!prototype) {
            throw new Error(`Unknown prototype: ${name}`);
        }

        return prototype.clone();
    }
}
```

Usage:

```javascript
const registry = new PrototypeRegistry();

registry.register(
    "standard-report",
    new ReportPrototype({
        format: "pdf",
        includeCharts: true
    })
);

const report = registry.create("standard-report");
```

The registry separates prototype selection from the creation process.

This can be useful when prototype types are determined dynamically or when new prototypes can be registered without
changing the registry implementation.

## Prototype Registry and Factory

A Prototype Registry behaves similarly to a factory:

```javascript
registry.create("standard-report");
```

The difference is where the concrete creation state comes from.

A conventional factory usually contains or selects a construction mechanism:

```javascript
function createReport(type) {
    return type === "pdf"
        ? new PdfReport()
        : new HtmlReport();
}
```

A Prototype Registry stores already-configured instances:

```javascript
registry.register("pdf", configuredPdfPrototype);
```

and creates new instances by cloning them.

The distinction becomes important when configuration itself is part of the reusable prototype state.

## Prototype and Factory Method

Factory Method delegates creation to a polymorphic creation method:

```javascript
createProduct()
{
    return new ConcreteProduct();
}
```

Prototype delegates creation to an existing object's cloning operation:

```javascript
prototype.clone();
```

Factory Method primarily varies the creation implementation.

Prototype primarily reuses an existing instance as the basis for a new instance.

The two can be combined:

```javascript
class ProductCreator {
    createProduct() {
        return this.prototype.clone();
    }
}
```

The Factory Method determines how creation is delegated, while the Prototype determines how the product is copied.

## Prototype and Builder

Builder constructs an object through an explicit sequence of configuration operations.

Prototype starts with an existing configured object and creates a new object from it.

Builder:

```javascript
const report = new ReportBuilder()
    .setFormat("pdf")
    .includeCharts()
    .setAuthor("Engineering")
    .build();
```

Prototype:

```javascript
const report = reportPrototype.clone();
```

If most objects share the same baseline configuration, Prototype can be simpler than repeatedly executing the same
construction sequence.

If each object requires substantially different construction decisions, Builder may be more appropriate.

## Prototype and Object Pool

Prototype creates a new object from an existing object.

Object Pool reuses the same object across multiple owners or operations.

Prototype:

```javascript
const clone = prototype.clone();
```

Object Pool:

```javascript
const object = pool.acquire();

try {
    use(object);
} finally {
    pool.release(object);
}
```

The resulting identity semantics are different.

A Prototype clone remains an independent object after creation. A pooled object is temporarily leased and later returned
for reuse.

## Prototype and Object.create ()

JavaScript provides `Object.create()`:

```javascript
const object = Object.create(prototype);
```

This does not normally perform a clone.

Instead, it creates a new object whose internal `[[Prototype]]` points to the supplied object.

For example:

```javascript
const prototype = {
    greet() {
        return "hello";
    }
};

const object = Object.create(prototype);
```

The new object delegates property lookup to `prototype`.

```javascript
console.log(object.greet());
```

The object does not contain its own copied `greet` function.

This is JavaScript's prototype delegation mechanism, not automatically an implementation of the GoF Prototype pattern.

## GoF Prototype vs JavaScript Prototypes

These concepts must be kept distinct.

The JavaScript prototype mechanism is a language-level object delegation system. Objects can inherit behavior through
the prototype chain.

The GoF Prototype pattern is a design technique in which an existing object serves as a template from which another
object is created.

JavaScript's prototype system can be used to implement Prototype-like behavior, but the pattern does not mean "use
`Object.create()`."

For example:

```javascript
const prototype = {
    type: "report"
};

const object = Object.create(prototype);
```

creates delegation.

By contrast:

```javascript
const prototype = new Report();

const object = prototype.clone();
```

expresses explicit cloning.

The two mechanisms may coexist in the same design.

## Prototype Methods

A Prototype implementation can use an explicit `clone()` method:

```javascript
class Shape {
    clone() {
        return Object.create(
            Object.getPrototypeOf(this),
            Object.getOwnPropertyDescriptors(this)
        );
    }
}
```

This performs a shallow structural copy while preserving the object's prototype and property descriptors.

However, this generic implementation does not necessarily satisfy the semantic requirements of every class.

Classes with external resources, private state, derived state, or nested mutable structures may require explicit cloning
logic.

## Private Fields

JavaScript private fields introduce an important limitation for generic cloning.

Consider:

```javascript
class Counter {
    #value;

    constructor(value) {
        this.#value = value;
    }

    increment() {
        this.#value++;
    }
}
```

A generic property-copying technique cannot simply copy `#value` because private fields are not ordinary enumerable or
reflective properties.

The class should therefore define its own cloning semantics:

```javascript
class Counter {
    #value;

    constructor(value) {
        this.#value = value;
    }

    clone() {
        return new Counter(this.#value);
    }

    increment() {
        this.#value++;
    }
}
```

Explicit clone implementations are often safer for classes with private state.

## Prototype and Class Invariants

A clone must preserve the invariants required by the product.

Suppose:

```javascript
class Account {
    constructor(balance) {
        if (balance < 0) {
            throw new Error("Invalid balance");
        }

        this.balance = balance;
    }

    clone() {
        return new Account(this.balance);
    }
}
```

The clone operation uses the constructor to preserve its validation rules.

This is preferable to blindly copying internal state when construction invariants are significant.

However, if the constructor performs expensive external initialization, using it during every clone may eliminate the
reason for introducing Prototype in the first place.

The clone strategy must therefore balance invariant preservation with the desired reuse of initialization state.

## Prototype and Derived State

Objects may contain values derived from other properties:

```javascript
class Product {
    constructor(price, taxRate) {
        this.price = price;
        this.taxRate = taxRate;
        this.total = price * (1 + taxRate);
    }
}
```

A clone can either copy the derived value:

```javascript
clone()
{
    return new Product(this.price, this.taxRate);
}
```

or copy all state directly:

```javascript
clone()
{
    const clone = Object.create(
        Object.getPrototypeOf(this)
    );

    clone.price = this.price;
    clone.taxRate = this.taxRate;
    clone.total = this.total;

    return clone;
}
```

The first approach recomputes derived state and is generally safer when the derivation is deterministic.

The second preserves the exact current state but risks copying stale or invalid derived values.

Clone semantics should therefore reflect the object's invariants rather than merely its current property layout.

## Prototype and External Resources

Blindly cloning an object that owns an external resource can be dangerous.

For example:

```javascript
class Connection {
    constructor(socket) {
        this.socket = socket;
    }

    clone() {
        return new Connection(this.socket);
    }
}
```

The clone now references the same socket.

If the connection assumes exclusive ownership, the clone is invalid.

External resources may require one of several strategies:

* share an immutable or explicitly shared resource
* create a new resource
* transfer ownership
* reject cloning entirely

Prototype is appropriate only when the semantics of copying the resource are well defined.

## Prototype and Event Listeners

Event listeners are another source of accidental shared state.

Consider:

```javascript
class Component {
    constructor() {
        this.listeners = new Set();
    }

    clone() {
        return new Component();
    }
}
```

A clone probably should not inherit listeners from the prototype because those listeners may reference the prototype's
environment.

Copying them blindly could create unexpected behavior and retain objects that should otherwise be eligible for garbage
collection.

Prototype implementations should distinguish configuration state from runtime subscription state.

## Prototype and Closures

Functions and closures can also retain references to external state:

```javascript
const prototype = {
    handler: createHandler(context)
};
```

A shallow clone:

```javascript
const clone = {
    ...prototype
};
```

shares the same function and therefore the same closure.

That may be correct if the handler is stateless or intentionally shared.

It may be incorrect if each clone is expected to have an independent runtime context.

Cloning behavior should therefore account for behavioral state, not only visible data properties.

## Prototype and Serialization

Serialization can sometimes be used as a cloning mechanism:

```javascript
const clone = JSON.parse(
    JSON.stringify(prototype)
);
```

This should not be treated as a general Prototype implementation.

JSON serialization loses or transforms several kinds of JavaScript state, including:

* class prototypes
* methods
* `undefined`
* symbols
* functions
* certain special object types
* property descriptors
* private fields

It is appropriate only when the object is intentionally a JSON-compatible data structure and those semantics are
acceptable.

## structuredClone ()

`structuredClone()` provides a much stronger general-purpose cloning mechanism for supported data structures:

```javascript
const clone = structuredClone(prototype);
```

It preserves many built-in data types and recursively clones supported values.

It still does not mean that `structuredClone()` is universally appropriate for Prototype.

Class instances, external resources, private state, and domain-specific invariants can require explicit clone semantics.

Use `structuredClone()` when its defined semantics match the object being cloned, not merely because the pattern
involves copying.

## Prototype and Property Descriptors

Prototype cloning can preserve property descriptors when necessary.

For example:

```javascript
function cloneObject(object) {
    return Object.create(
        Object.getPrototypeOf(object),
        Object.getOwnPropertyDescriptors(object)
    );
}
```

This can preserve:

* getters
* setters
* enumerability
* writability
* configurability
* own symbol properties

It is still a shallow clone.

Nested objects remain shared unless explicitly copied.

This technique is therefore useful for structural cloning but should not be confused with semantic deep cloning.

## Prototype and Inheritance

Prototype-based cloning can preserve the original object's prototype:

```javascript
const clone = Object.create(
    Object.getPrototypeOf(prototype),
    Object.getOwnPropertyDescriptors(prototype)
);
```

The clone therefore remains associated with the same prototype chain.

This can be useful for polymorphic objects:

```javascript
class PdfReport {
    render() {
        return "PDF";
    }
}
```

A clone of a `PdfReport` should generally remain a `PdfReport` rather than becoming a generic object.

Explicit `clone()` methods can make this guarantee clear.

## Prototype Registry with Polymorphic Products

A registry can store different concrete prototype types behind one abstraction:

```javascript
class ShapeRegistry {
    #prototypes = new Map();

    register(name, shape) {
        this.#prototypes.set(name, shape);
    }

    create(name) {
        const prototype = this.#prototypes.get(name);

        if (!prototype) {
            throw new Error(`Unknown shape: ${name}`);
        }

        return prototype.clone();
    }
}
```

The registry does not need to know the concrete type of each shape.

```javascript
registry.register("circle", new Circle(10));
registry.register("rectangle", new Rectangle(20, 10));

const circle = registry.create("circle");
const rectangle = registry.create("rectangle");
```

The concrete objects own their cloning behavior.

## Prototype and Configuration Templates

Prototype is particularly useful when an existing object represents a reusable template.

```javascript
const standardReport = new Report({
    format: "pdf",
    includeCharts: true,
    includeSummary: true
});

const regionalReport = standardReport.clone();
regionalReport.region = "EU";
```

The prototype acts as a configured baseline.

This is often more useful than creating a separate Builder sequence whenever the same baseline configuration is
repeatedly required.

## Prototype and Defaults

Prototype can provide default state for new objects:

```javascript
class Request {
    constructor(options) {
        Object.assign(this, options);
    }

    clone() {
        return new Request({
            ...this
        });
    }
}

const defaultRequest = new Request({
    method: "GET",
    timeout: 5000,
    retries: 2
});
```

A new request can then be derived from the default:

```javascript
const request = defaultRequest.clone();

request.url = "/users";
```

The prototype represents a configured baseline rather than merely a class definition.

## Prototype and Mutation

A common source of bugs is mutating shared nested state after cloning.

```javascript
const clone = prototype.clone();

clone.options.headers.Authorization = "Bearer token";
```

If `options.headers` was shallow-copied, the prototype may also be modified.

This is why clone semantics must be explicitly defined.

A good Prototype implementation should make it clear which state is:

* copied
* shared
* immutable
* regenerated
* reset
* intentionally omitted

Without this contract, callers cannot safely reason about the resulting object.

## Prototype and Reset State

Not every state in an existing object belongs in a clone.

For example, a prototype may contain:

```javascript
class Session {
    constructor(configuration) {
        this.configuration = configuration;
        this.user = null;
        this.events = [];
        this.connected = false;
    }
}
```

When cloning the prototype, configuration may be copied while runtime state should be reset:

```javascript
clone()
{
    return new Session({
        ...this.configuration
    });
}
```

Prototype therefore does not necessarily mean "copy every property." It means create a new object based on an existing
object's state and configuration according to defined clone semantics.

## Prototype and Persistence

Prototype can also be useful when persisted objects provide a baseline for new objects.

For example:

```javascript
const template = loadTemplate();

const instance = template.clone();
```

The template may contain complex configuration loaded from a database or file.

This allows runtime creation to reuse the persisted configuration without requiring callers to reconstruct it manually.

Care is required when persisted state contains identity, timestamps, ownership information, or other fields that must
not be copied into the new instance.

## Prototype and Identity Fields

A clone often needs a new identity.

For example:

```javascript
class Order {
    constructor(id, items) {
        this.id = id;
        this.items = items;
    }

    clone() {
        return new Order(
            generateId(),
            this.items.map(item => ({...item}))
        );
    }
}
```

Copying the original identifier would produce two logically distinct orders with the same identity.

Prototype implementations should explicitly determine which fields represent reusable state and which fields represent
object identity.

## Prototype and Timestamps

Similar considerations apply to timestamps.

A prototype may represent a template created at one point in time:

```javascript
class Task {
    constructor(name) {
        this.name = name;
        this.createdAt = new Date();
    }
}
```

A clone may need a new creation timestamp:

```javascript
clone()
{
    const clone = new Task(this.name);

    return clone;
}
```

Copying `createdAt` would make the clone appear to have been created at the same time as the prototype.

Prototype semantics must therefore distinguish template state from instance-specific state.

## TypeScript Implementation

TypeScript can define an explicit clone contract:

```typescript
interface Prototype<T> {
    clone(): T;
}
```

A concrete class can implement it:

```typescript
class Document implements Prototype<Document> {
    constructor(
        public readonly title: string,
        public readonly metadata: Record<string, string>
    ) {
    }

    clone(): Document {
        return new Document(
            this.title,
            {...this.metadata}
        );
    }
}
```

The generic interface ensures that the clone operation returns the appropriate product type.

## Polymorphic Clone Methods

A base class can define the cloning contract:

```typescript
abstract class Shape {
    abstract clone(): Shape;
}
```

Concrete products implement their own semantics:

```typescript
class Circle extends Shape {
    constructor(
        public radius: number
    ) {
        super();
    }

    clone(): Circle {
        return new Circle(this.radius);
    }
}
```

The concrete return type can be narrower than the base declaration.

This allows polymorphic code to work with `Shape` while preserving the concrete type when known.

## Prototype and Generics

A generic helper can represent cloning:

```typescript
interface Cloneable<T> {
    clone(): T;
}
```

A class can then declare:

```typescript
class Configuration implements Cloneable<Configuration> {
    constructor(
        public readonly environment: string,
        public readonly options: Record<string, unknown>
    ) {
    }

    clone(): Configuration {
        return new Configuration(
            this.environment,
            {...this.options}
        );
    }
}
```

The contract makes the relationship between the source and cloned type explicit.

## Benefits

Prototype can avoid repeating complex initialization, encapsulate reusable configuration, support runtime creation of
new variants, reduce dependence on concrete constructors, and allow dynamically registered prototypes.

It can also be useful when the object to be created is determined by an existing runtime instance rather than by a
compile-time class.

## Costs

Prototype requires clearly defined cloning semantics.

Shallow copies can accidentally share mutable state. Deep copies can be expensive or semantically incorrect. Generic
cloning can fail with private fields, external resources, event subscriptions, closures, identity fields, and other
runtime state.

Prototype can therefore introduce subtle bugs if "clone" is treated as a generic copy operation without defining
ownership and lifecycle semantics.

A prototype registry also introduces mutable global or shared state if it is not given an appropriate ownership
boundary.

## Common Misuse

A common misuse is assuming that `Object.create()` implements the GoF Prototype pattern.

```javascript
const clone = Object.create(prototype);
```

This creates prototype delegation rather than copying the prototype's state.

Another misuse is using `structuredClone()` indiscriminately for domain objects whose invariants or resource ownership
cannot be represented by structural cloning.

Prototype is also unnecessary when normal construction is cheap and straightforward.

If an object can be clearly constructed with:

```javascript
new User({
    name,
    email
});
```

introducing a prototype merely to avoid the constructor call adds complexity without solving a meaningful problem.

## Refactoring Toward Prototype

Prototype is a candidate when application code repeatedly reconstructs the same complex baseline configuration.

Before:

```javascript
const reportA = new Report({
    format: "pdf",
    includeCharts: true,
    includeSummary: true,
    template: loadTemplate()
});

const reportB = new Report({
    format: "pdf",
    includeCharts: true,
    includeSummary: true,
    template: loadTemplate()
});
```

A configured prototype can centralize the baseline:

```javascript
const reportPrototype = new Report({
    format: "pdf",
    includeCharts: true,
    includeSummary: true,
    template: loadTemplate()
});
```

New instances can then be derived:

```javascript
const reportA = reportPrototype.clone();
const reportB = reportPrototype.clone();
```

The refactoring is justified when the repeated configuration represents a stable reusable baseline and cloning has
well-defined semantics.

## Refactoring Away from Prototype

Prototype should be removed when cloning becomes more complicated than direct construction.

For example, if:

```javascript
clone()
{
    // Copy state.
    // Reset state.
    // Regenerate identity.
    // Rebuild external resources.
    // Re-register listeners.
    // Recalculate derived values.
}
```

becomes a large lifecycle procedure, the clone operation may no longer provide a meaningful simplification.

A constructor, factory, Builder, or explicit template object may provide clearer semantics.

Prototype is most effective when the relationship between the source object and the resulting object is simple and well
understood.

## Prototype and Factories Together

A factory can select a prototype:

```javascript
class ReportFactory {
    constructor(prototypes) {
        this.prototypes = prototypes;
    }

    create(type) {
        const prototype = this.prototypes[type];

        if (!prototype) {
            throw new Error(`Unknown report type: ${type}`);
        }

        return prototype.clone();
    }
}
```

The factory performs selection while the prototype performs creation through cloning.

This combination is useful when the set of available product templates is dynamic or configured at runtime.

## Prototype and Dependency Injection

A prototype can itself be injected:

```javascript
class ReportService {
    constructor(reportPrototype) {
        this.reportPrototype = reportPrototype;
    }

    createReport() {
        return this.reportPrototype.clone();
    }
}
```

The service does not need to know the concrete report class.

This is particularly useful when prototypes represent environment-specific configuration or test fixtures.

## Prototype and Testing

Prototype can simplify test setup when many tests need the same complex baseline object.

```javascript
const prototype = createConfiguredOrder();

const order = prototype.clone();

order.addItem(product);
```

Each test receives an independent object derived from the same baseline.

This can be preferable to repeating a large setup procedure.

However, shared prototypes must themselves be treated carefully. If a test accidentally mutates the prototype or if the
clone is shallow and shares mutable state, tests can interfere with one another.

## Architectural Considerations

Prototype is useful when an existing runtime object contains meaningful construction state.

This often occurs with:

* dynamically configured objects
* template instances
* document models
* UI or rendering configurations
* domain object templates
* plugin configurations
* runtime-defined product variants
* expensive initialization state

The pattern is less useful when product creation is naturally expressed through a simple constructor or factory.

At architectural boundaries, prototype can also separate product selection from concrete construction. A caller can
select a registered prototype without needing to know how that product is initialized.

## Decision Criteria

| Situation                                           | Prototype suitability              |
|-----------------------------------------------------|------------------------------------|
| Existing object is a useful template                | Strong fit                         |
| Complex baseline configuration is reused            | Strong fit                         |
| Construction is expensive                           | Potentially strong fit             |
| Product type is determined at runtime               | Potentially strong fit             |
| Prototypes can be registered dynamically            | Strong fit                         |
| Object is simple data                               | Usually unnecessary                |
| Object owns unique external resources               | Usually poor fit                   |
| Clone semantics are difficult to define             | Poor fit                           |
| Main concern is incremental construction            | Prefer Builder                     |
| Main concern is selecting a product type            | Prefer Factory                     |
| Main concern is reusable resource lifecycle         | Prefer Object Pool                 |
| Need prototype-chain delegation rather than copying | Use JavaScript prototypes directly |

## Summary

Prototype creates new objects from existing objects rather than constructing them entirely from scratch.

Its value comes from reusing meaningful runtime state, configuration, or initialization while producing a distinct
object with defined ownership semantics.

JavaScript's prototype mechanism should not be confused with the GoF Prototype pattern. `Object.create()` establishes
prototype delegation; a Prototype implementation defines semantics for creating an independent object from an existing
instance.

The most important design question is what "clone" actually means for the object. A correct implementation must
determine which state is copied, which state is shared, which state is regenerated, which state is reset, and which
state cannot safely be cloned.

Prototype is therefore strongest when an existing configured instance is a meaningful template and cloning that template
is simpler or more useful than reconstructing the object through a constructor, factory, or Builder.
